"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  PenTool,
  Calendar,
  MapPin,
  ArrowRight,
  XCircle,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const contracts = {
  active: [
    {
      id: 1,
      property: "Modern Loft in Downtown",
      address: "123 Main St, Los Angeles, CA",
      image: "/images/property-1.jpg",
      type: "Rental Agreement",
      status: "pending_signature",
      createdDate: "Feb 1, 2026",
      dueDate: "Feb 10, 2026",
      monthlyRent: 2500,
      deposit: 5000,
      term: "12 months",
      startDate: "Mar 1, 2026",
      endDate: "Feb 28, 2027",
      steps: [
        { name: "Application Submitted", status: "completed", date: "Jan 25, 2026" },
        { name: "Application Approved", status: "completed", date: "Jan 28, 2026" },
        { name: "Contract Generated", status: "completed", date: "Feb 1, 2026" },
        { name: "Contract Review", status: "current", date: null },
        { name: "Signature", status: "pending", date: null },
        { name: "Deposit Payment", status: "pending", date: null },
        { name: "Key Handover", status: "pending", date: null },
      ],
    },
  ],
  past: [
    {
      id: 2,
      property: "Cozy Studio Apartment",
      address: "321 Gallery Row, Los Angeles, CA",
      image: "/images/property-3.jpg",
      type: "Rental Agreement",
      status: "expired",
      startDate: "Jan 1, 2025",
      endDate: "Dec 31, 2025",
      monthlyRent: 1800,
    },
    {
      id: 3,
      property: "Beach View Condo",
      address: "789 Ocean Blvd, Santa Monica, CA",
      image: "/images/property-2.jpg",
      type: "Rental Agreement",
      status: "terminated",
      startDate: "Jun 1, 2024",
      endDate: "Nov 30, 2024",
      monthlyRent: 3200,
      terminationReason: "Relocated for work",
    },
  ],
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending_signature":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <PenTool className="mr-1 h-3 w-3" />
          Awaiting Signature
        </Badge>
      )
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      )
    case "expired":
      return <Badge variant="secondary">Expired</Badge>
    case "terminated":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Terminated
        </Badge>
      )
    default:
      return null
  }
}

function getStepIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "current":
      return <Clock className="h-5 w-5 text-accent" />
    default:
      return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
  }
}

export default function ContractsPage() {
  const [signDialogOpen, setSignDialogOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const activeContract = contracts.active[0]
  const completedSteps = activeContract?.steps.filter((s) => s.status === "completed").length || 0
  const totalSteps = activeContract?.steps.length || 1
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Contracts</h1>
          <p className="text-muted-foreground">View and manage your rental agreements and contracts.</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active ({contracts.active.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({contracts.past.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Contracts */}
        <TabsContent value="active" className="space-y-6">
          {contracts.active.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No active contracts</h3>
                <p className="text-muted-foreground mb-4">
                  When you're ready to move forward with a property, your contract will appear here.
                </p>
                <Button asChild>
                  <Link href="/portal/favorites">View Your Favorites</Link>
                </Button>
              </div>
            </Card>
          ) : (
            contracts.active.map((contract) => (
              <div key={contract.id} className="space-y-6">
                {/* Contract Overview Card */}
                <Card>
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="relative w-full lg:w-64 h-48 lg:h-auto flex-shrink-0">
                        <Image
                          src={contract.image || "/placeholder.svg"}
                          alt={contract.property}
                          fill
                          className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-foreground">{contract.property}</h3>
                              {getStatusBadge(contract.status)}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {contract.address}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                              ${contract.monthlyRent.toLocaleString()}
                              <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Contract Type</p>
                            <p className="text-sm font-medium text-foreground">{contract.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Term</p>
                            <p className="text-sm font-medium text-foreground">{contract.term}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="text-sm font-medium text-foreground">{contract.startDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Security Deposit</p>
                            <p className="text-sm font-medium text-foreground">${contract.deposit.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="mr-2 h-4 w-4" />
                            View Contract
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                          {contract.status === "pending_signature" && (
                            <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm">
                                  <PenTool className="mr-2 h-4 w-4" />
                                  Sign Contract
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Sign Contract</DialogTitle>
                                  <DialogDescription>
                                    Review and sign your rental agreement for {contract.property}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="rounded-lg border border-border p-4 bg-secondary/30">
                                    <h4 className="font-medium text-foreground mb-2">Contract Summary</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Property</span>
                                        <span className="font-medium">{contract.property}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Monthly Rent</span>
                                        <span className="font-medium">${contract.monthlyRent.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Security Deposit</span>
                                        <span className="font-medium">${contract.deposit.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Term</span>
                                        <span className="font-medium">{contract.term}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Start Date</span>
                                        <span className="font-medium">{contract.startDate}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      id="terms"
                                      checked={termsAccepted}
                                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                    />
                                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                                      I have read and agree to the terms and conditions of this rental agreement. I understand that this is a legally binding contract.
                                    </Label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setSignDialogOpen(false)} className="bg-transparent">
                                    Cancel
                                  </Button>
                                  <Button disabled={!termsAccepted} onClick={() => setSignDialogOpen(false)}>
                                    <PenTool className="mr-2 h-4 w-4" />
                                    Sign Now
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Timeline */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Contract Progress</CardTitle>
                        <CardDescription>Track the status of your rental agreement</CardDescription>
                      </div>
                      <Badge variant="secondary">{progressPercentage}% Complete</Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {contract.steps.map((step, index) => (
                        <div key={step.name} className="relative flex gap-4 pb-6 last:pb-0">
                          {index !== contract.steps.length - 1 && (
                            <div
                              className={`absolute left-[9px] top-6 h-full w-0.5 ${
                                step.status === "completed" ? "bg-green-600" : "bg-border"
                              }`}
                            />
                          )}
                          <div className="relative z-10 flex-shrink-0">
                            {getStepIcon(step.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h4 className={`text-sm font-medium ${
                                step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                              }`}>
                                {step.name}
                              </h4>
                              {step.date && (
                                <span className="text-xs text-muted-foreground">{step.date}</span>
                              )}
                            </div>
                            {step.status === "current" && (
                              <p className="text-xs text-accent mt-1">
                                Please review and sign the contract by {contract.dueDate}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Required Banner */}
                {contract.status === "pending_signature" && (
                  <Card className="border-accent/50 bg-accent/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">Action Required</h3>
                          <p className="text-sm text-muted-foreground">
                            Please review and sign your contract by {contract.dueDate} to secure your new home.
                          </p>
                        </div>
                        <Button onClick={() => setSignDialogOpen(true)}>
                          <PenTool className="mr-2 h-4 w-4" />
                          Sign Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))
          )}
        </TabsContent>

        {/* Past Contracts */}
        <TabsContent value="past" className="space-y-4">
          {contracts.past.map((contract) => (
            <Card key={contract.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                    <Image
                      src={contract.image || "/placeholder.svg"}
                      alt={contract.property}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{contract.property}</h3>
                          {getStatusBadge(contract.status)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          {contract.address}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {contract.startDate} - {contract.endDate}
                          </span>
                          <span>${contract.monthlyRent.toLocaleString()}/mo</span>
                        </div>
                        {contract.terminationReason && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Reason: {contract.terminationReason}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
