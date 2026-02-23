"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  MessageSquare,
  Receipt,
  AlertCircle,
  Settings,
  Check,
  Trash2,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    type: "visit",
    title: "Visit Confirmed",
    message: "Your visit for Modern Loft in Downtown has been confirmed for February 5, 2026 at 2:00 PM.",
    time: "2 hours ago",
    date: "Feb 4, 2026",
    read: false,
    actionUrl: "/portal/visits",
    actionLabel: "View Visit",
  },
  {
    id: 2,
    type: "document",
    title: "Document Required",
    message: "Please upload your proof of income to proceed with your application for Modern Loft in Downtown.",
    time: "1 day ago",
    date: "Feb 3, 2026",
    read: false,
    priority: "high",
    actionUrl: "/portal/documents",
    actionLabel: "Upload Document",
  },
  {
    id: 3,
    type: "contract",
    title: "Contract Ready for Review",
    message: "Your rental contract for Modern Loft in Downtown is ready for review and signature.",
    time: "2 days ago",
    date: "Feb 2, 2026",
    read: false,
    actionUrl: "/portal/contracts",
    actionLabel: "Review Contract",
  },
  {
    id: 4,
    type: "message",
    title: "New Message from Elite Properties",
    message: "Sarah Johnson from Elite Properties has sent you a message regarding your upcoming visit.",
    time: "3 days ago",
    date: "Feb 1, 2026",
    read: true,
    actionUrl: "/portal/messages",
    actionLabel: "View Message",
  },
  {
    id: 5,
    type: "invoice",
    title: "New Invoice Generated",
    message: "A new invoice for security deposit ($5,000) has been generated for your upcoming rental.",
    time: "4 days ago",
    date: "Jan 31, 2026",
    read: true,
    actionUrl: "/portal/invoices",
    actionLabel: "View Invoice",
  },
  {
    id: 6,
    type: "visit",
    title: "Visit Reminder",
    message: "Reminder: You have a property visit scheduled for tomorrow at 2:00 PM.",
    time: "5 days ago",
    date: "Jan 30, 2026",
    read: true,
    actionUrl: "/portal/visits",
    actionLabel: "View Visit",
  },
  {
    id: 7,
    type: "system",
    title: "Profile Incomplete",
    message: "Complete your profile to improve your application success rate. You're 75% done!",
    time: "1 week ago",
    date: "Jan 28, 2026",
    read: true,
    actionUrl: "/portal/profile",
    actionLabel: "Complete Profile",
  },
]

const notificationSettings = {
  email: {
    visits: true,
    documents: true,
    contracts: true,
    messages: true,
    invoices: true,
    marketing: false,
  },
  push: {
    visits: true,
    documents: true,
    contracts: true,
    messages: true,
    invoices: false,
    marketing: false,
  },
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "visit":
      return <Calendar className="h-5 w-5" />
    case "document":
      return <FileText className="h-5 w-5" />
    case "contract":
      return <CheckCircle className="h-5 w-5" />
    case "message":
      return <MessageSquare className="h-5 w-5" />
    case "invoice":
      return <Receipt className="h-5 w-5" />
    case "system":
      return <Bell className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

function getIconBgColor(type: string, priority?: string) {
  if (priority === "high") return "bg-destructive/10 text-destructive"
  switch (type) {
    case "visit":
      return "bg-accent/10 text-accent"
    case "document":
      return "bg-amber-100 text-amber-600"
    case "contract":
      return "bg-green-100 text-green-600"
    case "message":
      return "bg-blue-100 text-blue-600"
    case "invoice":
      return "bg-primary/10 text-primary"
    default:
      return "bg-secondary text-muted-foreground"
  }
}

export default function NotificationsPage() {
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [filterType, setFilterType] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = filterType === "all" 
    ? notifications 
    : notifications.filter((n) => n.type === filterType)

  const markAllAsRead = () => {
    // Handle mark all as read
  }

  const toggleNotification = (id: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : "You're all caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead} className="bg-transparent">
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType("all")}>All Notifications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("visit")}>Visits</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("document")}>Documents</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("contract")}>Contracts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("message")}>Messages</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("invoice")}>Invoices</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* All Notifications */}
        <TabsContent value="all" className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  When you have notifications, they'll appear here.
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 transition-colors hover:bg-secondary/30 ${
                      !notification.read ? "bg-accent/5" : ""
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${getIconBgColor(notification.type, notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-accent" />
                            )}
                            {notification.priority === "high" && (
                              <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {notification.actionUrl && (
                              <Button variant="link" size="sm" className="h-auto p-0 text-accent" asChild>
                                <Link href={notification.actionUrl}>
                                  {notification.actionLabel}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what notifications you receive via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-visits">Visit Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about visit confirmations and reminders.</p>
                </div>
                <Switch id="email-visits" defaultChecked={notificationSettings.email.visits} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-documents">Document Requests</Label>
                  <p className="text-sm text-muted-foreground">Get notified when documents are required.</p>
                </div>
                <Switch id="email-documents" defaultChecked={notificationSettings.email.documents} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-contracts">Contract Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about contract status changes.</p>
                </div>
                <Switch id="email-contracts" defaultChecked={notificationSettings.email.contracts} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-messages">Messages</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you receive new messages.</p>
                </div>
                <Switch id="email-messages" defaultChecked={notificationSettings.email.messages} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-invoices">Invoice Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new invoices and payment reminders.</p>
                </div>
                <Switch id="email-invoices" defaultChecked={notificationSettings.email.invoices} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-marketing">Marketing & Promotions</Label>
                  <p className="text-sm text-muted-foreground">Receive news, updates, and special offers.</p>
                </div>
                <Switch id="email-marketing" defaultChecked={notificationSettings.email.marketing} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Choose what notifications you receive on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-visits">Visit Updates</Label>
                  <p className="text-sm text-muted-foreground">Real-time visit confirmations and reminders.</p>
                </div>
                <Switch id="push-visits" defaultChecked={notificationSettings.push.visits} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-documents">Document Requests</Label>
                  <p className="text-sm text-muted-foreground">Urgent document requirement alerts.</p>
                </div>
                <Switch id="push-documents" defaultChecked={notificationSettings.push.documents} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-contracts">Contract Updates</Label>
                  <p className="text-sm text-muted-foreground">Important contract status changes.</p>
                </div>
                <Switch id="push-contracts" defaultChecked={notificationSettings.push.contracts} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-messages">Messages</Label>
                  <p className="text-sm text-muted-foreground">Instant message notifications.</p>
                </div>
                <Switch id="push-messages" defaultChecked={notificationSettings.push.messages} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
