"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Building2,
  Filter,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for calendar events
const visits = [
  {
    id: 1,
    type: "visit",
    title: "Property Visit - Modern Apartment",
    property: "Modern Downtown Apartment",
    client: "John Smith",
    agent: "Sarah Johnson",
    date: "2026-02-05",
    time: "10:00",
    duration: 60,
    status: "confirmed",
  },
  {
    id: 2,
    type: "visit",
    title: "Property Visit - Beach Villa",
    property: "Luxury Beach Villa",
    client: "Emily Davis",
    agent: "Michael Chen",
    date: "2026-02-05",
    time: "14:00",
    duration: 90,
    status: "pending",
  },
  {
    id: 3,
    type: "visit",
    title: "Property Visit - Family Home",
    property: "Suburban Family Home",
    client: "Robert Wilson",
    agent: "Sarah Johnson",
    date: "2026-02-07",
    time: "11:00",
    duration: 60,
    status: "confirmed",
  },
  {
    id: 4,
    type: "visit",
    title: "Property Visit - Studio",
    property: "Cozy Studio Apartment",
    client: "Lisa Anderson",
    agent: "David Brown",
    date: "2026-02-10",
    time: "09:00",
    duration: 45,
    status: "confirmed",
  },
  {
    id: 5,
    type: "visit",
    title: "Property Visit - Penthouse",
    property: "Luxury Penthouse Suite",
    client: "Mark Thompson",
    agent: "Michael Chen",
    date: "2026-02-12",
    time: "15:00",
    duration: 90,
    status: "pending",
  },
]

const availabilitySlots = [
  {
    id: 101,
    type: "availability",
    agent: "Sarah Johnson",
    date: "2026-02-05",
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    id: 102,
    type: "availability",
    agent: "Sarah Johnson",
    date: "2026-02-05",
    startTime: "14:00",
    endTime: "18:00",
  },
  {
    id: 103,
    type: "availability",
    agent: "Michael Chen",
    date: "2026-02-06",
    startTime: "10:00",
    endTime: "16:00",
  },
  {
    id: 104,
    type: "availability",
    agent: "David Brown",
    date: "2026-02-07",
    startTime: "09:00",
    endTime: "13:00",
  },
  {
    id: 105,
    type: "availability",
    agent: "Sarah Johnson",
    date: "2026-02-10",
    startTime: "08:00",
    endTime: "17:00",
  },
  {
    id: 106,
    type: "availability",
    agent: "Michael Chen",
    date: "2026-02-11",
    startTime: "09:00",
    endTime: "15:00",
  },
  {
    id: 107,
    type: "availability",
    agent: "David Brown",
    date: "2026-02-12",
    startTime: "10:00",
    endTime: "18:00",
  },
]

const agents = [
  { id: 1, name: "Sarah Johnson", color: "bg-blue-500" },
  { id: 2, name: "Michael Chen", color: "bg-emerald-500" },
  { id: 3, name: "David Brown", color: "bg-amber-500" },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)) // February 2026
  const [view, setView] = useState<"month" | "week">("month")
  const [selectedEvent, setSelectedEvent] = useState<typeof visits[0] | typeof availabilitySlots[0] | null>(null)
  const [eventFilter, setEventFilter] = useState<"all" | "visits" | "availability">("all")
  const [agentFilter, setAgentFilter] = useState<string>("all")

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Get week days
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })
  }

  // Navigation
  const navigatePrev = () => {
    if (view === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() - 7)
      setCurrentDate(newDate)
    }
  }

  const navigateNext = () => {
    if (view === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() + 7)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date(2026, 1, 5)) // Today is Feb 5, 2026
  }

  // Format date for comparison
  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  // Get events for a specific date
  const getEventsForDate = (dateKey: string) => {
    const events: Array<typeof visits[0] | typeof availabilitySlots[0]> = []
    
    if (eventFilter === "all" || eventFilter === "visits") {
      visits.forEach(visit => {
        if (visit.date === dateKey) {
          if (agentFilter === "all" || visit.agent === agentFilter) {
            events.push(visit)
          }
        }
      })
    }
    
    if (eventFilter === "all" || eventFilter === "availability") {
      availabilitySlots.forEach(slot => {
        if (slot.date === dateKey) {
          if (agentFilter === "all" || slot.agent === agentFilter) {
            events.push(slot)
          }
        }
      })
    }
    
    return events
  }

  // Get agent color
  const getAgentColor = (agentName: string) => {
    const agent = agents.find(a => a.name === agentName)
    return agent?.color || "bg-gray-500"
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = getWeekDays(currentDate)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage visits and agent availability</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/dashboard/availability">
              <Clock className="mr-2 h-4 w-4" />
              Manage Availability
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/visits/new">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Visit
            </Link>
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={navigatePrev} className="bg-transparent">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={navigateNext} className="bg-transparent">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {view === "month" 
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `Week of ${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                }
              </h2>
              <Button variant="ghost" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            {/* View Toggle and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggle */}
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Event Type Filter */}
              <Select value={eventFilter} onValueChange={(v: "all" | "visits" | "availability") => setEventFilter(v)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="visits">Visits Only</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>

              {/* Agent Filter */}
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-[160px]">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.name}>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", agent.color)} />
                        {agent.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded bg-primary" />
              <span className="text-muted-foreground">Confirmed Visit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded bg-amber-500" />
              <span className="text-muted-foreground">Pending Visit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-500/20" />
              <span className="text-muted-foreground">Agent Available</span>
            </div>
          </div>

          {/* Monthly View */}
          {view === "month" && (
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-px bg-border rounded-t-lg overflow-hidden">
                  {DAYS.map(day => (
                    <div key={day} className="bg-muted px-2 py-3 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-border">
                  {days.map((day, index) => {
                    const dateKey = day ? formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day) : ""
                    const dayEvents = day ? getEventsForDate(dateKey) : []
                    const isToday = day === 5 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[120px] bg-card p-2",
                          !day && "bg-muted/50"
                        )}
                      >
                        {day && (
                          <>
                            <div className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium mb-1",
                              isToday && "bg-primary text-primary-foreground"
                            )}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <button
                                  key={`${event.type}-${event.id}`}
                                  onClick={() => setSelectedEvent(event)}
                                  className={cn(
                                    "w-full text-left px-2 py-1 rounded text-xs font-medium truncate transition-colors",
                                    event.type === "visit" && (event as typeof visits[0]).status === "confirmed" && "bg-primary/20 text-primary hover:bg-primary/30",
                                    event.type === "visit" && (event as typeof visits[0]).status === "pending" && "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30",
                                    event.type === "availability" && "bg-emerald-500/20 text-emerald-700 border border-dashed border-emerald-500 hover:bg-emerald-500/30"
                                  )}
                                >
                                  {event.type === "visit" 
                                    ? `${(event as typeof visits[0]).time} - ${(event as typeof visits[0]).client}`
                                    : `${(event as typeof availabilitySlots[0]).startTime}-${(event as typeof availabilitySlots[0]).endTime}`
                                  }
                                </button>
                              ))}
                              {dayEvents.length > 3 && (
                                <p className="text-xs text-muted-foreground pl-2">
                                  +{dayEvents.length - 3} more
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Weekly View */}
          {view === "week" && (
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Day Headers */}
                <div className="grid grid-cols-8 gap-px bg-border rounded-t-lg overflow-hidden">
                  <div className="bg-muted px-2 py-3 text-center text-sm font-medium text-muted-foreground">
                    Time
                  </div>
                  {weekDays.map((day, i) => {
                    const isToday = day.getDate() === 5 && day.getMonth() === 1 && day.getFullYear() === 2026
                    return (
                      <div key={i} className={cn(
                        "bg-muted px-2 py-3 text-center",
                        isToday && "bg-primary/10"
                      )}>
                        <div className="text-sm font-medium text-muted-foreground">{DAYS[day.getDay()]}</div>
                        <div className={cn(
                          "text-lg font-semibold",
                          isToday ? "text-primary" : "text-foreground"
                        )}>
                          {day.getDate()}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Time Grid */}
                <div className="grid grid-cols-8 gap-px bg-border">
                  {HOURS.map(hour => (
                    <>
                      {/* Time Label */}
                      <div key={`time-${hour}`} className="bg-card px-2 py-4 text-right text-sm text-muted-foreground">
                        {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                      </div>
                      
                      {/* Day Columns */}
                      {weekDays.map((day, dayIndex) => {
                        const dateKey = formatDateKey(day.getFullYear(), day.getMonth(), day.getDate())
                        const dayEvents = getEventsForDate(dateKey)
                        const hourStr = String(hour).padStart(2, "0")
                        
                        // Get events that start at this hour
                        const hourEvents = dayEvents.filter(event => {
                          if (event.type === "visit") {
                            return (event as typeof visits[0]).time.startsWith(hourStr)
                          } else {
                            const startHour = parseInt((event as typeof availabilitySlots[0]).startTime.split(":")[0])
                            const endHour = parseInt((event as typeof availabilitySlots[0]).endTime.split(":")[0])
                            return hour >= startHour && hour < endHour
                          }
                        })

                        const isToday = day.getDate() === 5 && day.getMonth() === 1 && day.getFullYear() === 2026

                        return (
                          <div 
                            key={`${hour}-${dayIndex}`} 
                            className={cn(
                              "bg-card min-h-[60px] p-1 relative",
                              isToday && "bg-primary/5"
                            )}
                          >
                            {hourEvents.map((event) => (
                              <button
                                key={`${event.type}-${event.id}`}
                                onClick={() => setSelectedEvent(event)}
                                className={cn(
                                  "w-full text-left px-2 py-1 rounded text-xs font-medium truncate mb-1 transition-colors",
                                  event.type === "visit" && (event as typeof visits[0]).status === "confirmed" && "bg-primary text-primary-foreground hover:bg-primary/90",
                                  event.type === "visit" && (event as typeof visits[0]).status === "pending" && "bg-amber-500 text-white hover:bg-amber-600",
                                  event.type === "availability" && "bg-emerald-500/30 text-emerald-700 border border-dashed border-emerald-500 hover:bg-emerald-500/40"
                                )}
                              >
                                {event.type === "visit" 
                                  ? (event as typeof visits[0]).client
                                  : (event as typeof availabilitySlots[0]).agent.split(" ")[0]
                                }
                              </button>
                            ))}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
            <CardDescription>February 5, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visits
                .filter(v => v.date === "2026-02-05")
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(visit => (
                  <div 
                    key={visit.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(visit)}
                  >
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      visit.status === "confirmed" ? "bg-primary/20" : "bg-amber-500/20"
                    )}>
                      <Building2 className={cn(
                        "h-5 w-5",
                        visit.status === "confirmed" ? "text-primary" : "text-amber-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">{visit.property}</h3>
                        <Badge variant={visit.status === "confirmed" ? "default" : "secondary"}>
                          {visit.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {visit.time} ({visit.duration} min)
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {visit.client}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{visit.agent}</p>
                      <p className="text-xs text-muted-foreground">Agent</p>
                    </div>
                  </div>
                ))}
              {visits.filter(v => v.date === "2026-02-05").length === 0 && (
                <p className="text-center text-muted-foreground py-8">No visits scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Availability</CardTitle>
            <CardDescription>Today&apos;s available slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availabilitySlots
                .filter(s => s.date === "2026-02-05")
                .map(slot => (
                  <div 
                    key={slot.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-emerald-500 bg-emerald-500/10 cursor-pointer hover:bg-emerald-500/20 transition-colors"
                    onClick={() => setSelectedEvent(slot)}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white",
                      getAgentColor(slot.agent)
                    )}>
                      {slot.agent.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{slot.agent}</p>
                      <p className="text-xs text-muted-foreground">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              {availabilitySlots.filter(s => s.date === "2026-02-05").length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">No availability slots today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          {selectedEvent?.type === "visit" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Property Visit
                </DialogTitle>
                <DialogDescription>
                  {(selectedEvent as typeof visits[0]).property}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{(selectedEvent as typeof visits[0]).client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <p className="font-medium">{(selectedEvent as typeof visits[0]).agent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date((selectedEvent as typeof visits[0]).date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{(selectedEvent as typeof visits[0]).time} ({(selectedEvent as typeof visits[0]).duration} min)</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Badge variant={(selectedEvent as typeof visits[0]).status === "confirmed" ? "default" : "secondary"}>
                    {(selectedEvent as typeof visits[0]).status}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button className="flex-1">Edit Visit</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">Cancel Visit</Button>
                </div>
              </div>
            </>
          )}
          {selectedEvent?.type === "availability" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agent Availability
                </DialogTitle>
                <DialogDescription>
                  Available time slot
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <p className="font-medium">{(selectedEvent as typeof availabilitySlots[0]).agent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date((selectedEvent as typeof availabilitySlots[0]).date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="font-medium">{(selectedEvent as typeof availabilitySlots[0]).startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Time</p>
                    <p className="font-medium">{(selectedEvent as typeof availabilitySlots[0]).endTime}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button className="flex-1" asChild>
                    <Link href="/dashboard/visits/new">Schedule Visit</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">Edit Slot</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
