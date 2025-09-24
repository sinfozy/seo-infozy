"use client";

import {
  useGetResellers,
  useToggleResellerStatus,
} from "@/lib/queries/admin/reseller";

import { LoaderBig } from "@/components/ui/loader";
import React from "react";
import TableData from "@/components/admin/TableData";

const columnConfig = [
  { key: "id", label: "ID", visible: false },
  { key: "name", label: "Name", visible: true },
  { key: "company", label: "Company", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "contact", label: "Contact", visible: true },
  { key: "walletBalance", label: "Wallet Balance", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

export default function Page() {
  const { data: resellers, isLoading, isError } = useGetResellers();

  const { mutate: toggleStatus } = useToggleResellerStatus();

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleStatus({ id, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoaderBig />
      </div>
    );
  }

  if (isError) return <p>Failed to load resellers.</p>;

  return (
    <TableData
      label="reseller"
      columnConfig={columnConfig}
      data={resellers ?? []}
      onToggleStatus={handleToggle}
    />
  );
}
