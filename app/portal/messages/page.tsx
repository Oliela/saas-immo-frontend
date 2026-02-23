"use client"

import { useState } from "react"
import Image from "next/image"
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  CheckCheck,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const conversations = [
  {
    id: 1,
    contact: {
      name: "Sarah Johnson",
      role: "Agent",
      agency: "Elite Properties",
      avatar: "",
      initials: "SJ",
    },
    property: "Modern Loft in Downtown",
    lastMessage: "Great! I've confirmed your visit for February 5th at 2:00 PM.",
    time: "2h ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    contact: {
      name: "Michael Chen",
      role: "Agent",
      agency: "Coastal Realty",
      avatar: "",
      initials: "MC",
    },
    property: "Luxury Penthouse Suite",
    lastMessage: "The owner has approved your application!",
    time: "1d ago",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    contact: {
      name: "Emily Rodriguez",
      role: "Agent",
      agency: "Urban Living",
      avatar: "",
      initials: "ER",
    },
    property: "Industrial Loft Conversion",
    lastMessage: "Thank you for visiting the property. Let me know if you have any questions.",
    time: "3d ago",
    unread: 0,
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "agent",
    content: "Hi John! Thanks for your interest in the Modern Loft in Downtown. I'd be happy to help you with any questions.",
    time: "10:00 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 2,
    sender: "user",
    content: "Hi Sarah! I'd like to schedule a visit to see the property. Is it available this week?",
    time: "10:15 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 3,
    sender: "agent",
    content: "Of course! I have availability on Tuesday at 2:00 PM or Thursday at 11:00 AM. Which works better for you?",
    time: "10:20 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 4,
    sender: "user",
    content: "Tuesday at 2:00 PM works perfectly for me!",
    time: "10:30 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 5,
    sender: "agent",
    content: "Excellent! I've scheduled the visit for Tuesday, February 5th at 2:00 PM. Please meet me at the lobby of the building. I'll send you the full address and parking information shortly.",
    time: "10:35 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 6,
    sender: "agent",
    content: "Here's the address: 123 Main St, Los Angeles, CA 90012. There's visitor parking available in the building garage.",
    time: "10:36 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 7,
    sender: "user",
    content: "Perfect, thank you! Is there anything I should bring for the visit?",
    time: "11:00 AM",
    date: "Feb 1, 2026",
  },
  {
    id: 8,
    sender: "agent",
    content: "Great! I've confirmed your visit for February 5th at 2:00 PM.",
    time: "2:00 PM",
    date: "Feb 4, 2026",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.property.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Communicate with agents about your property inquiries.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
                      selectedConversation.id === conversation.id && "bg-secondary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.contact.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{conversation.contact.initials}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {conversation.contact.name}
                          </p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {conversation.property}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate flex-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-col flex-1">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConversation.contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedConversation.contact.initials}</AvatarFallback>
                  </Avatar>
                  {selectedConversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedConversation.contact.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.contact.role} at {selectedConversation.contact.agency}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Property</DropdownMenuItem>
                    <DropdownMenuItem>View Agent Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Property Context */}
            <div className="px-4 py-2 bg-secondary/30 border-b border-border">
              <p className="text-xs text-muted-foreground">
                Regarding: <span className="font-medium text-foreground">{selectedConversation.property}</span>
              </p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const showDate =
                    index === 0 || messages[index - 1].date !== message.date
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                            {message.date}
                          </span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex",
                          message.sender === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={cn(
                              "flex items-center gap-1 mt-1",
                              message.sender === "user" ? "justify-end" : "justify-start"
                            )}
                          >
                            <span
                              className={cn(
                                "text-[10px]",
                                message.sender === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {message.time}
                            </span>
                            {message.sender === "user" && (
                              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: No conversation selected message */}
          <div className="flex-1 flex items-center justify-center md:hidden">
            <div className="text-center p-4">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
