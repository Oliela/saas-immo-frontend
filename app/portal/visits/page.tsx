"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  ChevronDown,
  Phone,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const visits = {
  upcoming: [
    {
      id: 1,
      property: "Modern Loft in Downtown",
      address: "123 Main St, Los Angeles, CA",
      date: "Feb 5, 2026",
      time: "2:00 PM",
      agent: "Sarah Johnson",
      agentPhone: "+1 (555) 123-4567",
      image: "/images/property-1.jpg",
      status: "confirmed",
      notes: "Meet at the lobby, parking available in the building.",
    },
    {
      id: 2,
      property: "Luxury Penthouse Suite",
      address: "456 Beverly Blvd, Beverly Hills, CA",
      date: "Feb 8, 2026",
      time: "11:00 AM",
      agent: "Michael Chen",
      agentPhone: "+1 (555) 987-6543",
      image: "/images/property-5.jpg",
      status: "pending",
      notes: "",
    },
  ],
  past: [
    {
      id: 3,
      property: "Industrial Loft Conversion",
      address: "789 Arts District, Los Angeles, CA",
      date: "Jan 28, 2026",
      time: "3:00 PM",
      agent: "Emily Rodriguez",
      image: "/images/property-7.jpg",
      status: "completed",
      feedback: {
        rating: 4,
        liked: "Great natural light, unique design, high ceilings",
        disliked: "Far from public transit, noisy street",
        interested: false,
        comments: "Beautiful space but the commute would be too long for work.",
      },
    },
    {
      id: 4,
      property: "Cozy Studio Apartment",
      address: "321 Gallery Row, Los Angeles, CA",
      date: "Jan 20, 2026",
      time: "10:00 AM",
      agent: "Sarah Johnson",
      image: "/images/property-3.jpg",
      status: "completed",
      feedback: {
        rating: 3,
        liked: "Good location, modern kitchen",
        disliked: "Too small, limited storage",
        interested: false,
        comments: "Nice place but not enough space for my needs.",
      },
    },
    {
      id: 5,
      property: "Suburban Family Home",
      address: "555 Oak Lane, Pasadena, CA",
      date: "Jan 15, 2026",
      time: "1:00 PM",
      agent: "Michael Chen",
      image: "/images/property-4.jpg",
      status: "cancelled",
      cancelReason: "Schedule conflict",
    },
  ],
}

function getStatusBadge(status: string) {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>
    case "pending":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending Confirmation</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    case "cancelled":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>
    default:
      return null
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  )
}

export default function VisitsPage() {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Visits</h1>
          <p className="text-muted-foreground">Manage your property visits and provide feedback.</p>
        </div>
        <Button asChild>
          <Link href="/portal/favorites">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule New Visit
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({visits.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({visits.past.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Visits */}
        <TabsContent value="upcoming" className="space-y-4">
          {visits.upcoming.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No upcoming visits</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule a visit to see your favorite properties in person.
                </p>
                <Button asChild>
                  <Link href="/portal/favorites">Browse Favorites</Link>
                </Button>
              </div>
            </Card>
          ) : (
            visits.upcoming.map((visit) => (
              <Card key={visit.id}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={visit.image || "/placeholder.svg"}
                        alt={visit.property}
                        fill
                        className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{visit.property}</h3>
                            {getStatusBadge(visit.status)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {visit.address}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">{visit.date}</p>
                          <p className="text-sm text-accent">{visit.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{visit.agent}</p>
                          <p className="text-xs text-muted-foreground">Your agent for this visit</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                      </div>

                      {visit.notes && (
                        <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Note:</span> {visit.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild className="bg-transparent">
                          <Link href={`/property/${visit.id}`}>
                            View Property
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Agent
                        </Button>
                        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Visit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Visit</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel your visit to {visit.property}?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Reason for cancellation (optional)</Label>
                                <Textarea placeholder="Let us know why you need to cancel..." />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setCancelDialogOpen(false)} className="bg-transparent">
                                Keep Visit
                              </Button>
                              <Button variant="destructive" onClick={() => setCancelDialogOpen(false)}>
                                Cancel Visit
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Past Visits */}
        <TabsContent value="past" className="space-y-4">
          {visits.past.map((visit) => (
            <Collapsible key={visit.id}>
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
                      <Image
                        src={visit.image || "/placeholder.svg"}
                        alt={visit.property}
                        fill
                        className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{visit.property}</h3>
                            {getStatusBadge(visit.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {visit.date} at {visit.time} with {visit.agent}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {visit.status === "completed" && visit.feedback && (
                            <StarRating rating={visit.feedback.rating} />
                          )}
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Details
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="border-t border-border p-4">
                      {visit.status === "completed" && visit.feedback ? (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">What you liked</p>
                              <p className="text-sm text-muted-foreground">{visit.feedback.liked}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">What you disliked</p>
                              <p className="text-sm text-muted-foreground">{visit.feedback.disliked}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Additional comments</p>
                            <p className="text-sm text-muted-foreground">{visit.feedback.comments}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={visit.feedback.interested ? "default" : "secondary"}>
                              {visit.feedback.interested ? "Still Interested" : "Not Interested"}
                            </Badge>
                          </div>
                        </div>
                      ) : visit.status === "cancelled" ? (
                        <p className="text-sm text-muted-foreground">
                          Cancelled: {visit.cancelReason}
                        </p>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            You haven't provided feedback for this visit yet.
                          </p>
                          <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Star className="mr-2 h-4 w-4" />
                                Leave Feedback
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Visit Feedback</DialogTitle>
                                <DialogDescription>
                                  Share your thoughts about {visit.property}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Overall Rating</Label>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        type="button"
                                        key={star}
                                        onClick={() => setSelectedRating(star)}
                                        className="p-1"
                                      >
                                        <Star
                                          className={`h-6 w-6 ${
                                            star <= selectedRating
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="liked">What did you like?</Label>
                                  <Textarea id="liked" placeholder="Great features, location, etc." />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="disliked">What could be better?</Label>
                                  <Textarea id="disliked" placeholder="Any concerns or drawbacks..." />
                                </div>
                                <div className="space-y-2">
                                  <Label>Are you interested in this property?</Label>
                                  <RadioGroup defaultValue="no">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="yes" id="yes" />
                                      <Label htmlFor="yes" className="font-normal">Yes, I'm interested</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="maybe" id="maybe" />
                                      <Label htmlFor="maybe" className="font-normal">Maybe, need more info</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="no" id="no" />
                                      <Label htmlFor="no" className="font-normal">No, not for me</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="comments">Additional Comments</Label>
                                  <Textarea id="comments" placeholder="Any other thoughts..." />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)} className="bg-transparent">
                                  Cancel
                                </Button>
                                <Button onClick={() => setFeedbackDialogOpen(false)}>Submit Feedback</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="bg-secondary/30">
        <CardContent className="p-6">
          <h3 className="font-medium text-foreground mb-3">Tips for Property Visits</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Arrive 5-10 minutes early to explore the neighborhood
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Prepare a list of questions about the property
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Take photos and notes during the visit (with permission)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Check water pressure, outlets, and storage space
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
