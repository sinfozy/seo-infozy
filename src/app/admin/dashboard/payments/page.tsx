"use client";

import { Payment, useGetPayments } from "@/lib/queries/admin/payments";
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
import { Search } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: payments = [], isLoading } = useGetPayments();

  const filteredData = payments.filter((tx) => {
    const matchesSearch =
      tx.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      tx.ownerModel.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: Payment["status"]) => {
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
      <h1 className="text-2xl font-bold">Payments</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by username or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="reseller">Reseller</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="w-full py-6 flex items-center justify-center gap-2"
                >
                  <Loader className="text-muted-foreground" /> Loading
                  payments...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {tx._id}
                  </TableCell>
                  <TableCell>{tx.ownerName}</TableCell>
                  <TableCell className="capitalize">{tx.ownerModel}</TableCell>
                  <TableCell>
                    {tx.currency === "USD" ? "$" : "₹"} {tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{tx.currency}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        tx.status
                      )}`}
                    >
                      {tx.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(tx.createdAt), "dd MMM yyyy, HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
