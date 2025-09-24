"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface TableRowData {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  plan?: {
    name: string;
  };
  walletId?: {
    balance: number;
  };
  currency?: string;
  isActive: boolean;
  createdAt?: string;
  resellerId?: {
    _id: string;
    companyName: string;
  };
  avatar?: string;
}

interface TableDataProps {
  label: string;
  columnConfig: ColumnConfig[];
  data: TableRowData[];
  showCreateBtn?: boolean;
}

export default function ResellerTableData({
  label,
  columnConfig,
  data,
  showCreateBtn = true,
}: TableDataProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    columnConfig.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})
  );

  const router = useRouter();

  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && row.isActive) ||
      (statusFilter === "inactive" && !row.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    router.push(`/reseller/dashboard/${label.toLocaleLowerCase()}s/${id}`);
  };

  const handleCreate = () => {
    router.push(`/reseller/dashboard/${label.toLocaleLowerCase()}s/new`);
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Gold":
        return "bg-yellow-500 text-black";
      case "Silver":
        return "bg-gray-500 text-white";
      case "Bronze":
        return "bg-amber-950 text-white";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="text-2xl font-bold capitalize">{label}s</div>
        {showCreateBtn && (
          <Button onClick={handleCreate} className="bg-primary ">
            <Plus className="h-4 w-4" />
            Create New<span className="capitalize!">{label}</span>
          </Button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rows per page */}
        <div className="flex items-center space-x-2 ml-auto mr-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Column toggle */}
        <div className="h-full flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Columns
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columnConfig.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={columnVisibility[column.key]}
                  onCheckedChange={() => toggleColumnVisibility(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table className="px-2">
          <TableHeader>
            <TableRow>
              {columnConfig.map(
                (col) =>
                  columnVisibility[col.key] && (
                    <TableHead key={col.key}>
                      {col.label.toUpperCase()}
                    </TableHead>
                  )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row._id}>
                {columnVisibility.id && (
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {row._id}
                  </TableCell>
                )}
                {columnVisibility.name && (
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={row.avatar || "/placeholder.svg"}
                          alt={row.fullname}
                        />
                        <AvatarFallback>
                          {row.fullname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{row.fullname}</div>
                        {row.createdAt && (
                          <div className="text-sm text-muted-foreground">
                            Joined{" "}
                            {format(new Date(row.createdAt), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.email && <TableCell>{row.email}</TableCell>}
                {columnVisibility.contact && (
                  <TableCell className="text-sm">{row.phone}</TableCell>
                )}
                {columnVisibility.reseller && (
                  <TableCell>
                    {row.resellerId ? (
                      <Link
                        href={`/reseller/dashboard/resellers/${row.resellerId?._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {row.resellerId.companyName}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                )}
                {columnVisibility.plan && (
                  <TableCell>
                    {row.plan?.name ? (
                      <Badge
                        variant="default"
                        className={`${getPlanBadgeColor(row?.plan?.name ?? "")} font-medium border-none outline-none`}
                      >
                        {row.plan?.name}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                )}
                {columnVisibility.walletBalance && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: row.currency || "USD",
                        }).format(
                          row.currency === "USD"
                            ? (row.walletId?.balance ?? 0) /
                                Number(process.env.NEXT_PUBLIC_USD_RATE)
                            : (row.walletId?.balance ?? 0)
                        )}
                      </span>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell>
                    <Badge
                      variant={row.isActive ? "default" : "destructive"}
                      className="font-medium"
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.actions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(row._id)}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          0 of {filteredData.length} selected
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm" className="bg-primary">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
