"use client";

import { useGetUsers, useToggleUserStatus } from "@/lib/queries/admin/user";

import { LoaderBig } from "@/components/ui/loader";
import TableData from "@/components/admin/TableData";

const columnConfig = [
  { key: "id", label: "Id", visible: false },
  { key: "name", label: "Name", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "contact", label: "Contact", visible: true },
  { key: "reseller", label: "Reseller", visible: true },
  { key: "plan", label: "Plan", visible: true },
  { key: "walletBalance", label: "Wallet Balance", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

export default function Page() {
  const { data: usersData = [], isLoading } = useGetUsers();

  const { mutate: toggleStatus } = useToggleUserStatus();

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleStatus({ id, isActive: !currentStatus });
  };

  if (isLoading)
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <LoaderBig />
      </div>
    );

  return (
    <TableData
      label="user"
      columnConfig={columnConfig}
      data={usersData}
      onToggleStatus={handleToggle}
    />
  );
}
