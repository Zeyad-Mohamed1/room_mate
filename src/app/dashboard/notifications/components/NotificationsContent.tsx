"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, RefreshCw, Search, Send, Trash, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { getUsers } from "@/actions/users";
import {
  getAllNotifications,
  sendNotification,
  deleteNotification,
} from "@/actions/admin-notifications";

export default function NotificationsContent() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Query to fetch all users
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Query to fetch all notifications
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications", "admin"],
    queryFn: getAllNotifications,
  });

  // Mutation to send notification
  const sendNotificationMutation = useMutation({
    mutationFn: (data: { title: string; message: string; userIds: string[] }) =>
      sendNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "admin"] });
      toast.success("Notification sent successfully");
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
    },
    onError: () => {
      toast.error("Failed to send notification");
    },
  });

  // Mutation to delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "admin"] });
      toast.success("Notification deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  // Handle sending a notification
  const handleSendNotification = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("Select at least one user");
      return;
    }

    sendNotificationMutation.mutate({
      title,
      message,
      userIds: selectedUsers,
    });
  };

  // Filter users by search query
  const filteredUsers = users?.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle user selection
  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedUsers((prev) => [...prev, userId]);
    }
  };

  // Select/deselect all users
  const toggleAllUsers = () => {
    if (filteredUsers?.length === selectedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map((user: any) => user.id) || []);
    }
  };

  return (
    <Tabs defaultValue="send">
      <TabsList className="mb-6">
        <TabsTrigger value="send">
          <Send className="h-4 w-4 mr-2" />
          Send Notifications
        </TabsTrigger>
        <TabsTrigger value="history">
          <Bell className="h-4 w-4 mr-2" />
          Notification History
        </TabsTrigger>
      </TabsList>

      {/* Send Notifications Tab */}
      <TabsContent value="send">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Notification</CardTitle>
              <CardDescription>
                Send notifications to selected users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Notification Title
                </label>
                <Input
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Notification Message
                </label>
                <Textarea
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                <span>{selectedUsers.length} users selected</span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled={sendNotificationMutation.isPending}
                  onClick={handleSendNotification}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendNotificationMutation.isPending
                    ? "Sending..."
                    : "Send Notification"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <CardDescription>
                Choose users to receive the notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users by name or email"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={toggleAllUsers}>
                  {filteredUsers?.length === selectedUsers.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              <div className="border rounded-md max-h-80 overflow-y-auto">
                {loadingUsers ? (
                  <div className="flex justify-center items-center h-40">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUser(user.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Notification History Tab */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>View all sent notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingNotifications ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : Array.isArray(notifications) && notifications?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification: any) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">
                        {notification.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {notification.message}
                      </TableCell>
                      <TableCell>{notification.user.name}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.read
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {notification.read ? "Read" : "Unread"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteNotificationMutation.mutate(notification.id)
                          }
                          disabled={deleteNotificationMutation.isPending}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-500">
                  No notifications yet
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Start by sending a notification to your users
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
