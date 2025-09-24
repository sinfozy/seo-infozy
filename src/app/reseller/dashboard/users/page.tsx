"use client";

import { LoaderBig } from "@/components/ui/loader";
import ResellerTableData from "@/components/reseller/ResellerTableData";
import { useGetResellerUsers } from "@/lib/queries/reseller/user";

const columnConfig = [
  { key: "id", label: "ID", visible: false },
  { key: "name", label: "Name", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "contact", label: "Contact", visible: true },
  { key: "plan", label: "Plan", visible: true },
  { key: "walletBalance", label: "Wallet Balance", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

export default function Page() {
  const { data: users, isLoading: isLoadingUsers } = useGetResellerUsers();

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoaderBig />
      </div>
    );
  }

  return (
    <ResellerTableData
      label="user"
      columnConfig={columnConfig}
      data={users || []}
    />
  );
}
