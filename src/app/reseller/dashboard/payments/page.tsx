"use client";

import { Search, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { useGetResellerPayments } from "@/lib/queries/reseller/payments";
import { useState } from "react";

export default function ResellerPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: payments, isLoading, isError } = useGetResellerPayments();

  const filteredData = (payments ?? []).filter((p) => {
    const matchesSearch =
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "created":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reseller Payments</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by ID or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="created">Created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {(() => {
        let tableContent;
        if (isLoading) {
          tableContent = (
            <div className="flex justify-center py-10">
              <Loader className="text-muted-foreground" />
            </div>
          );
        } else if (isError) {
          tableContent = (
            <div className="text-red-500 p-4">Failed to load payments.</div>
          );
        } else {
          tableContent = (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {p._id}
                    </TableCell>
                    <TableCell>{p.ownerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        {p.currency === "USD" ? "$" : "₹"} {p.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(p.createdAt), "dd MMM yyyy, hh:mm a")}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          );
        }
        return <div className="rounded-md border">{tableContent}</div>;
      })()}
    </div>
  );
}
