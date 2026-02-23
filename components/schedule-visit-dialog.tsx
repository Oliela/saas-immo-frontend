"use client"

import React from "react"

import { useState } from "react"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface ScheduleVisitDialogProps {
  propertyTitle: string
  children: React.ReactNode
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

// Generate next 14 days
const generateDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  return dates
}

export function ScheduleVisitDialog({ propertyTitle, children }: ScheduleVisitDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const dates = generateDates()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const resetForm = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setFormData({ name: "", email: "", phone: "", message: "" })
    setIsSuccess(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(resetForm, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {isSuccess ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CalendarCheck className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl">Visit Scheduled!</DialogTitle>
              <DialogDescription className="text-center">
                Your visit has been scheduled for{" "}
                <span className="font-semibold text-foreground">
                  {selectedDate && formatDate(selectedDate)} at {selectedTime}
                </span>
                . We&apos;ll send you a confirmation email shortly.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Schedule a Visit</DialogTitle>
              <DialogDescription>
                Book a viewing for <span className="font-medium text-foreground">{propertyTitle}</span>
              </DialogDescription>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {s}
                  </div>
                  {s < 2 && (
                    <div
                      className={cn(
                        "h-1 w-12 rounded-full transition-colors",
                        step > s ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Select a Date
                  </Label>
                  <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto">
                    {dates.map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "p-2 rounded-lg text-center transition-colors border",
                          selectedDate?.toDateString() === date.toDateString()
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:bg-muted"
                        )}
                      >
                        <div className="text-xs font-medium">
                          {date.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="text-lg font-bold">{date.getDate()}</div>
                        <div className="text-xs">
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select a Time
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "p-2 rounded-lg text-sm font-medium transition-colors border",
                          selectedTime === time
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:bg-muted"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Any questions or special requests..."
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Selected Date/Time Summary */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Selected appointment:</p>
                  <p className="font-medium text-foreground">
                    {selectedDate && formatDate(selectedDate)} at {selectedTime}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              {step === 2 && (
                <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                  Back
                </Button>
              )}
              {step === 1 ? (
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedDate || !selectedTime}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.email || !formData.phone || isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Confirm Booking"}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
