"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  AlertTriangle,
  User,
  Building2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

// Mock data
const properties = [
  { id: "1", title: "Modern Downtown Apartment", address: "123 Main St, New York" },
  { id: "2", title: "Luxury Beachfront Villa", address: "456 Ocean Dr, Miami" },
  { id: "3", title: "Cozy Studio Loft", address: "789 Art District, Chicago" },
  { id: "4", title: "Family Suburban Home", address: "321 Oak Lane, Boston" },
]

const agents = [
  { id: "1", name: "Sarah Johnson", avatar: "SJ" },
  { id: "2", name: "Michael Chen", avatar: "MC" },
  { id: "3", name: "Emily Davis", avatar: "ED" },
  { id: "4", name: "Robert Wilson", avatar: "RW" },
]

interface AvailabilitySlot {
  id: string
  propertyId: string
  propertyTitle: string
  date: string
  startTime: string
  endTime: string
  agentId: string
  agentName: string
  status: "available" | "booked"
}

const initialSlots: AvailabilitySlot[] = [
  {
    id: "1",
    propertyId: "1",
    propertyTitle: "Modern Downtown Apartment",
    date: "2026-02-06",
    startTime: "09:00",
    endTime: "10:00",
    agentId: "1",
    agentName: "Sarah Johnson",
    status: "available",
  },
  {
    id: "2",
    propertyId: "1",
    propertyTitle: "Modern Downtown Apartment",
    date: "2026-02-06",
    startTime: "10:30",
    endTime: "11:30",
    agentId: "1",
    agentName: "Sarah Johnson",
    status: "booked",
  },
  {
    id: "3",
    propertyId: "2",
    propertyTitle: "Luxury Beachfront Villa",
    date: "2026-02-06",
    startTime: "14:00",
    endTime: "15:00",
    agentId: "2",
    agentName: "Michael Chen",
    status: "available",
  },
  {
    id: "4",
    propertyId: "3",
    propertyTitle: "Cozy Studio Loft",
    date: "2026-02-07",
    startTime: "11:00",
    endTime: "12:00",
    agentId: "3",
    agentName: "Emily Davis",
    status: "available",
  },
  {
    id: "5",
    propertyId: "1",
    propertyTitle: "Modern Downtown Apartment",
    date: "2026-02-07",
    startTime: "09:00",
    endTime: "10:00",
    agentId: "1",
    agentName: "Sarah Johnson",
    status: "booked",
  },
  {
    id: "6",
    propertyId: "4",
    propertyTitle: "Family Suburban Home",
    date: "2026-02-08",
    startTime: "10:00",
    endTime: "11:30",
    agentId: "4",
    agentName: "Robert Wilson",
    status: "available",
  },
]

// Generate calendar days for current week
const generateWeekDays = (baseDate: Date) => {
  const days = []
  const startOfWeek = new Date(baseDate)
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay())
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push(day)
  }
  return days
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

export default function AvailabilitySlotsPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots)
  const [viewMode, setViewMode] = useState<"table" | "calendar">("calendar")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
  const [filterProperty, setFilterProperty] = useState<string>("all")
  const [filterAgent, setFilterAgent] = useState<string>("all")
  
  // Form state
  const [formData, setFormData] = useState({
    propertyId: "",
    date: "",
    startTime: "",
    endTime: "",
    agentId: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null)

  const weekDays = generateWeekDays(currentWeek)

  const checkOverlap = (newSlot: typeof formData, excludeId?: string) => {
    const overlapping = slots.find(slot => {
      if (excludeId && slot.id === excludeId) return false
      if (slot.propertyId !== newSlot.propertyId) return false
      if (slot.date !== newSlot.date) return false
      
      const newStart = newSlot.startTime
      const newEnd = newSlot.endTime
      const existingStart = slot.startTime
      const existingEnd = slot.endTime
      
      return (newStart < existingEnd && newEnd > existingStart)
    })
    return overlapping
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.propertyId) errors.propertyId = "Property is required"
    if (!formData.date) errors.date = "Date is required"
    if (!formData.startTime) errors.startTime = "Start time is required"
    if (!formData.endTime) errors.endTime = "End time is required"
    if (!formData.agentId) errors.agentId = "Agent is required"
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = "End time must be after start time"
    }
    
    setFormErrors(errors)
    
    // Check for overlapping slots
    if (formData.propertyId && formData.date && formData.startTime && formData.endTime) {
      const overlap = checkOverlap(formData, editingSlot?.id)
      if (overlap) {
        setOverlapWarning(`This slot overlaps with an existing slot (${overlap.startTime} - ${overlap.endTime})`)
      } else {
        setOverlapWarning(null)
      }
    }
    
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    if (overlapWarning) return
    
    const property = properties.find(p => p.id === formData.propertyId)
    const agent = agents.find(a => a.id === formData.agentId)
    
    if (editingSlot) {
      setSlots(slots.map(slot => 
        slot.id === editingSlot.id 
          ? {
              ...slot,
              propertyId: formData.propertyId,
              propertyTitle: property?.title || "",
              date: formData.date,
              startTime: formData.startTime,
              endTime: formData.endTime,
              agentId: formData.agentId,
              agentName: agent?.name || "",
            }
          : slot
      ))
    } else {
      const newSlot: AvailabilitySlot = {
        id: Date.now().toString(),
        propertyId: formData.propertyId,
        propertyTitle: property?.title || "",
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        agentId: formData.agentId,
        agentName: agent?.name || "",
        status: "available",
      }
      setSlots([...slots, newSlot])
    }
    
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      propertyId: "",
      date: "",
      startTime: "",
      endTime: "",
      agentId: "",
    })
    setFormErrors({})
    setOverlapWarning(null)
    setEditingSlot(null)
  }

  const handleEdit = (slot: AvailabilitySlot) => {
    setEditingSlot(slot)
    setFormData({
      propertyId: slot.propertyId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      agentId: slot.agentId,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (slotId: string) => {
    setSlots(slots.filter(slot => slot.id !== slotId))
  }

  const filteredSlots = slots.filter(slot => {
    if (filterProperty !== "all" && slot.propertyId !== filterProperty) return false
    if (filterAgent !== "all" && slot.agentId !== filterAgent) return false
    return true
  })

  const getSlotForCell = (day: Date, time: string) => {
    const dateStr = day.toISOString().split('T')[0]
    return filteredSlots.filter(slot => 
      slot.date === dateStr && 
      slot.startTime <= time && 
      slot.endTime > time
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="bg-transparent">
            <Link href="/dashboard/visits">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Availability Slots</h1>
            <p className="text-muted-foreground">Manage visit availability for properties</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingSlot ? "Edit Availability Slot" : "Add Availability Slot"}</DialogTitle>
              <DialogDescription>
                {editingSlot ? "Update the slot details below." : "Create a new availability slot for property visits."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Property Selection */}
              <div className="space-y-2">
                <Label htmlFor="property">Property *</Label>
                <Select 
                  value={formData.propertyId} 
                  onValueChange={(value) => {
                    setFormData({ ...formData, propertyId: value })
                    setFormErrors({ ...formErrors, propertyId: "" })
                  }}
                >
                  <SelectTrigger className={cn(formErrors.propertyId && "border-destructive")}>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        <div className="flex flex-col">
                          <span>{property.title}</span>
                          <span className="text-xs text-muted-foreground">{property.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.propertyId && (
                  <p className="text-xs text-destructive">{formErrors.propertyId}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Visit Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value })
                    setFormErrors({ ...formErrors, date: "" })
                  }}
                  className={cn(formErrors.date && "border-destructive")}
                />
                {formErrors.date && (
                  <p className="text-xs text-destructive">{formErrors.date}</p>
                )}
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => {
                      setFormData({ ...formData, startTime: e.target.value })
                      setFormErrors({ ...formErrors, startTime: "" })
                    }}
                    className={cn(formErrors.startTime && "border-destructive")}
                  />
                  {formErrors.startTime && (
                    <p className="text-xs text-destructive">{formErrors.startTime}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => {
                      setFormData({ ...formData, endTime: e.target.value })
                      setFormErrors({ ...formErrors, endTime: "" })
                    }}
                    className={cn(formErrors.endTime && "border-destructive")}
                  />
                  {formErrors.endTime && (
                    <p className="text-xs text-destructive">{formErrors.endTime}</p>
                  )}
                </div>
              </div>

              {/* Agent Selection */}
              <div className="space-y-2">
                <Label htmlFor="agent">Assigned Agent *</Label>
                <Select 
                  value={formData.agentId} 
                  onValueChange={(value) => {
                    setFormData({ ...formData, agentId: value })
                    setFormErrors({ ...formErrors, agentId: "" })
                  }}
                >
                  <SelectTrigger className={cn(formErrors.agentId && "border-destructive")}>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {agent.avatar}
                          </div>
                          <span>{agent.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.agentId && (
                  <p className="text-xs text-destructive">{formErrors.agentId}</p>
                )}
              </div>

              {/* Overlap Warning */}
              {overlapWarning && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Overlapping Slot Detected</p>
                    <p className="text-xs text-amber-700">{overlapWarning}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm()
                setIsDialogOpen(false)
              }} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!!overlapWarning}>
                {editingSlot ? "Update Slot" : "Create Slot"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & View Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Select value={filterProperty} onValueChange={setFilterProperty}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Select value={filterAgent} onValueChange={setFilterAgent}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={cn(viewMode !== "calendar" && "bg-transparent")}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={cn(viewMode !== "table" && "bg-transparent")}
              >
                <List className="mr-2 h-4 w-4" />
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(currentWeek)
                    newDate.setDate(newDate.getDate() - 7)
                    setCurrentWeek(newDate)
                  }}
                  className="bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[200px] text-center">
                  {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(currentWeek)
                    newDate.setDate(newDate.getDate() + 7)
                    setCurrentWeek(newDate)
                  }}
                  className="bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Calendar Header */}
                <div className="grid grid-cols-8 border-b">
                  <div className="p-3 text-sm font-medium text-muted-foreground">Time</div>
                  {weekDays.map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    return (
                      <div 
                        key={index} 
                        className={cn(
                          "p-3 text-center border-l",
                          isToday && "bg-primary/5"
                        )}
                      >
                        <div className="text-xs text-muted-foreground">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={cn(
                          "text-sm font-medium",
                          isToday && "text-primary"
                        )}>
                          {day.getDate()}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Calendar Grid */}
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 border-b last:border-b-0">
                    <div className="p-3 text-sm text-muted-foreground border-r">
                      {time}
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const cellSlots = getSlotForCell(day, time)
                      const isToday = day.toDateString() === new Date().toDateString()
                      return (
                        <div 
                          key={dayIndex} 
                          className={cn(
                            "min-h-[60px] p-1 border-l",
                            isToday && "bg-primary/5"
                          )}
                        >
                          {cellSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className={cn(
                                "text-xs p-1.5 rounded mb-1 cursor-pointer transition-colors",
                                slot.status === "available" 
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              )}
                              onClick={() => slot.status === "available" && handleEdit(slot)}
                            >
                              <div className="font-medium truncate">{slot.propertyTitle.split(' ').slice(0, 2).join(' ')}</div>
                              <div className="text-[10px] opacity-75">{slot.startTime} - {slot.endTime}</div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                <span className="text-sm text-muted-foreground">Booked</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              All Availability Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No availability slots found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSlots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{slot.propertyTitle}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(slot.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                              {agents.find(a => a.id === slot.agentId)?.avatar}
                            </div>
                            {slot.agentName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={slot.status === "available" ? "default" : "secondary"}
                            className={cn(
                              slot.status === "available" 
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" 
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            )}
                          >
                            {slot.status === "available" ? (
                              <><Check className="mr-1 h-3 w-3" /> Available</>
                            ) : (
                              <><Clock className="mr-1 h-3 w-3" /> Booked</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(slot)}
                              disabled={slot.status === "booked"}
                              className="bg-transparent"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:text-destructive bg-transparent"
                                  disabled={slot.status === "booked"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Availability Slot?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove this availability slot. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-transparent">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(slot.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Slots</p>
                <p className="text-2xl font-bold">{filteredSlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{filteredSlots.filter(s => s.status === "available").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booked</p>
                <p className="text-2xl font-bold">{filteredSlots.filter(s => s.status === "booked").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Properties</p>
                <p className="text-2xl font-bold">{new Set(filteredSlots.map(s => s.propertyId)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
