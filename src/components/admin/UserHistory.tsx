"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { User } from "@/lib/queries/admin/user";
import { format } from "date-fns";

interface UserHistoryProps {
  user: User;
}

export default function UserHistory({ user }: UserHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Website Search History */}
      <Card>
        <CardHeader>
          <CardTitle>Website Search History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.websiteSearchHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No searches found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Searched At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.websiteSearchHistory.map((search, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{search.url}</TableCell>
                    <TableCell>
                      {format(
                        new Date(search.searchedAt),
                        "dd MMM yyyy, HH:mm"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* AI Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle>AI Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.aiConversationHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No AI conversations found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Input</TableHead>
                  <TableHead>Output</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.aiConversationHistory.map((conv, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{conv.input}</TableCell>
                    <TableCell>{conv.output}</TableCell>
                    <TableCell>
                      {format(new Date(conv.createdAt), "dd MMM yyyy, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
