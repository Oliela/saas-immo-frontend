"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const conversations = [
  {
    id: "1",
    name: "John Smith",
    avatar: "",
    lastMessage: "I'm very interested in the downtown apartment. When can we schedule a viewing?",
    time: "2m ago",
    unread: 2,
    property: "Modern Downtown Apartment",
    online: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "",
    lastMessage: "Thank you for the information. The beachfront villa looks amazing!",
    time: "1h ago",
    unread: 0,
    property: "Luxury Beachfront Villa",
    online: true,
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "",
    lastMessage: "Is the penthouse still available? I'd like to make an offer.",
    time: "3h ago",
    unread: 1,
    property: "Penthouse with City Views",
    online: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "",
    lastMessage: "Perfect, I'll see you tomorrow at 2 PM for the viewing.",
    time: "Yesterday",
    unread: 0,
    property: "Family Home with Garden",
    online: false,
  },
  {
    id: "5",
    name: "Robert Wilson",
    avatar: "",
    lastMessage: "Can you send me more photos of the property?",
    time: "Yesterday",
    unread: 0,
    property: "Charming Victorian House",
    online: false,
  },
]

const messages = [
  {
    id: "1",
    sender: "John Smith",
    content: "Hello! I saw your listing for the Modern Downtown Apartment and I'm very interested.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "Me",
    content: "Hi John! Thank you for your interest. The apartment is still available. Would you like more details?",
    time: "10:32 AM",
    isMe: true,
  },
  {
    id: "3",
    sender: "John Smith",
    content: "Yes please! I'd love to know more about the amenities and the neighborhood.",
    time: "10:35 AM",
    isMe: false,
  },
  {
    id: "4",
    sender: "Me",
    content: "Of course! The apartment features modern finishes throughout, including hardwood floors, stainless steel appliances, and floor-to-ceiling windows with stunning city views. The building has a fitness center, rooftop terrace, and 24/7 concierge. The neighborhood is very walkable with plenty of restaurants, shops, and public transportation nearby.",
    time: "10:38 AM",
    isMe: true,
  },
  {
    id: "5",
    sender: "John Smith",
    content: "That sounds perfect! I'm very interested in the downtown apartment. When can we schedule a viewing?",
    time: "10:42 AM",
    isMe: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [message, setMessage] = useState("")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Communicate with your clients</p>
      </div>

      {/* Messages Interface */}
      <Card className="h-[calc(100vh-220px)] min-h-[500px]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full max-w-xs border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                      selectedConversation.id === conversation.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{conversation.property}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center flex-shrink-0">
                        {conversation.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col hidden sm:flex">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {selectedConversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedConversation.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.online ? "Online" : "Offline"} - {selectedConversation.property}
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
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.isMe ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button size="icon" className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: Select conversation prompt */}
          <div className="flex-1 hidden max-sm:flex items-center justify-center">
            <p className="text-muted-foreground text-center px-4">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
