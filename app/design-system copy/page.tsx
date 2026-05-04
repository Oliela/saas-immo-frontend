"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Home,
  Building2,
  Users,
  Calendar,
  FileText,
  Receipt,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Heart,
  Share2,
  Filter,
  MoreHorizontal,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DesignSystemPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const colors = [
    { name: "Background", variable: "--background", class: "bg-background", textClass: "text-foreground" },
    { name: "Foreground", variable: "--foreground", class: "bg-foreground", textClass: "text-background" },
    { name: "Card", variable: "--card", class: "bg-card", textClass: "text-card-foreground" },
    { name: "Primary", variable: "--primary", class: "bg-primary", textClass: "text-primary-foreground" },
    { name: "Secondary", variable: "--secondary", class: "bg-secondary", textClass: "text-secondary-foreground" },
    { name: "Muted", variable: "--muted", class: "bg-muted", textClass: "text-muted-foreground" },
    { name: "Accent", variable: "--accent", class: "bg-accent", textClass: "text-accent-foreground" },
    { name: "Destructive", variable: "--destructive", class: "bg-destructive", textClass: "text-destructive-foreground" },
    { name: "Border", variable: "--border", class: "bg-border", textClass: "text-foreground" },
    { name: "Input", variable: "--input", class: "bg-input", textClass: "text-foreground" },
  ]

  const chartColors = [
    { name: "Chart 1", variable: "--chart-1", class: "bg-chart-1" },
    { name: "Chart 2", variable: "--chart-2", class: "bg-chart-2" },
    { name: "Chart 3", variable: "--chart-3", class: "bg-chart-3" },
    { name: "Chart 4", variable: "--chart-4", class: "bg-chart-4" },
    { name: "Chart 5", variable: "--chart-5", class: "bg-chart-5" },
  ]

  const icons = [
    { name: "Home", icon: Home, usage: "Navigation, homepage" },
    { name: "Building2", icon: Building2, usage: "Properties, real estate" },
    { name: "Users", icon: Users, usage: "Clients, leads, people" },
    { name: "Calendar", icon: Calendar, usage: "Visits, scheduling" },
    { name: "FileText", icon: FileText, usage: "Contracts, documents" },
    { name: "Receipt", icon: Receipt, usage: "Invoices, payments" },
    { name: "Settings", icon: Settings, usage: "Configuration, preferences" },
    { name: "Bell", icon: Bell, usage: "Notifications, alerts" },
    { name: "Search", icon: Search, usage: "Search functionality" },
    { name: "Plus", icon: Plus, usage: "Add, create new" },
    { name: "Edit", icon: Edit, usage: "Edit, modify" },
    { name: "Trash2", icon: Trash2, usage: "Delete, remove" },
    { name: "Eye", icon: Eye, usage: "View, preview" },
    { name: "Download", icon: Download, usage: "Download files" },
    { name: "Upload", icon: Upload, usage: "Upload files" },
    { name: "Check", icon: Check, usage: "Success, confirm" },
    { name: "X", icon: X, usage: "Close, cancel" },
    { name: "AlertCircle", icon: AlertCircle, usage: "Warning, error" },
    { name: "Info", icon: Info, usage: "Information" },
    { name: "Mail", icon: Mail, usage: "Email, messages" },
    { name: "Phone", icon: Phone, usage: "Phone, call" },
    { name: "MapPin", icon: MapPin, usage: "Location, address" },
    { name: "Heart", icon: Heart, usage: "Favorites, likes" },
    { name: "Share2", icon: Share2, usage: "Share content" },
    { name: "Filter", icon: Filter, usage: "Filter, sort" },
    { name: "MoreHorizontal", icon: MoreHorizontal, usage: "More options" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Back to Home</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-bold text-foreground">SAS IMO Design System</h1>
              <p className="text-xs text-muted-foreground">Version 1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
              <CardDescription>
                The SAS IMO design system provides a consistent visual language for the real estate platform.
                It emphasizes professionalism, trust, and clarity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Professional</h3>
                  <p className="text-sm text-muted-foreground">
                    Clean, sophisticated design that reflects the serious nature of real estate transactions.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Trust-Oriented</h3>
                  <p className="text-sm text-muted-foreground">
                    Warm neutral colors and clear hierarchy build confidence with clients and agencies.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Accessible</h3>
                  <p className="text-sm text-muted-foreground">
                    WCAG compliant contrast ratios and semantic HTML for all users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="colors" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-8">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>
                  A warm neutral palette with dark slate accents creates a professional, trustworthy aesthetic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Core Colors */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Core Colors</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {colors.map((color) => (
                      <div key={color.name} className="group relative">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(color.class, color.name)}
                          className={`flex h-24 w-full items-end justify-between rounded-lg border p-3 transition-all hover:scale-105 ${color.class} ${color.textClass}`}
                        >
                          <span className="text-sm font-medium">{color.name}</span>
                          {copied === color.name ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                          )}
                        </button>
                        <p className="mt-1 text-center text-xs text-muted-foreground font-mono">{color.variable}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Colors */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Chart Colors</h3>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {chartColors.map((color) => (
                      <div key={color.name} className="group relative">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(color.class, color.name)}
                          className={`flex h-16 w-full items-center justify-center rounded-lg transition-all hover:scale-105 ${color.class}`}
                        >
                          <span className="text-sm font-medium text-white drop-shadow-sm">{color.name}</span>
                        </button>
                        <p className="mt-1 text-center text-xs text-muted-foreground font-mono">{color.variable}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Guidelines */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Usage Guidelines</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li><strong>Primary</strong> - Main actions, navigation highlights, brand elements</li>
                      <li><strong>Secondary</strong> - Secondary buttons, subtle backgrounds</li>
                      <li><strong>Accent</strong> - Call-to-action highlights, important indicators</li>
                      <li><strong>Muted</strong> - Backgrounds, disabled states, subtle text</li>
                      <li><strong>Destructive</strong> - Delete actions, error states, warnings</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Geist font family provides excellent readability across all screen sizes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Font Family */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Font Families</h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <p className="mb-2 text-xs text-muted-foreground font-mono">font-sans (Geist)</p>
                        <p className="text-2xl font-sans">The quick brown fox jumps over the lazy dog</p>
                        <p className="mt-2 text-sm text-muted-foreground">Primary font for headings and body text</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="mb-2 text-xs text-muted-foreground font-mono">font-mono (Geist Mono)</p>
                        <p className="text-2xl font-mono">The quick brown fox jumps over the lazy dog</p>
                        <p className="mt-2 text-sm text-muted-foreground">Code, data, and technical content</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Font Weights</h3>
                    <div className="space-y-3 rounded-lg border p-4">
                      <p className="text-lg font-light">Light (300) - Subtle emphasis</p>
                      <p className="text-lg font-normal">Regular (400) - Body text</p>
                      <p className="text-lg font-medium">Medium (500) - Subheadings</p>
                      <p className="text-lg font-semibold">Semibold (600) - Headings</p>
                      <p className="text-lg font-bold">Bold (700) - Strong emphasis</p>
                    </div>
                  </div>
                </div>

                {/* Type Scale */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Type Scale</h3>
                  <div className="space-y-4 rounded-lg border p-6">
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <h1 className="text-4xl font-bold">Heading 1</h1>
                      <span className="text-xs text-muted-foreground font-mono">text-4xl font-bold</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <h2 className="text-3xl font-semibold">Heading 2</h2>
                      <span className="text-xs text-muted-foreground font-mono">text-3xl font-semibold</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <h3 className="text-2xl font-semibold">Heading 3</h3>
                      <span className="text-xs text-muted-foreground font-mono">text-2xl font-semibold</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <h4 className="text-xl font-semibold">Heading 4</h4>
                      <span className="text-xs text-muted-foreground font-mono">text-xl font-semibold</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <h5 className="text-lg font-medium">Heading 5</h5>
                      <span className="text-xs text-muted-foreground font-mono">text-lg font-medium</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <p className="text-base">Body Text</p>
                      <span className="text-xs text-muted-foreground font-mono">text-base</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-3">
                      <p className="text-sm">Small Text</p>
                      <span className="text-xs text-muted-foreground font-mono">text-sm</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs">Extra Small / Caption</p>
                      <span className="text-xs text-muted-foreground font-mono">text-xs</span>
                    </div>
                  </div>
                </div>

                {/* Text Colors */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Text Colors</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border p-4">
                      <p className="text-foreground">Primary Text</p>
                      <p className="text-xs text-muted-foreground font-mono">text-foreground</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-muted-foreground">Secondary Text</p>
                      <p className="text-xs text-muted-foreground font-mono">text-muted-foreground</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-primary">Link / Brand Text</p>
                      <p className="text-xs text-muted-foreground font-mono">text-primary</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-destructive">Error Text</p>
                      <p className="text-xs text-muted-foreground font-mono">text-destructive</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buttons */}
          <TabsContent value="buttons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Button variants for different actions and contexts throughout the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Button Variants */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <Button>Default</Button>
                      <p className="text-xs text-muted-foreground font-mono">variant="default"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="secondary">Secondary</Button>
                      <p className="text-xs text-muted-foreground font-mono">variant="secondary"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="bg-transparent">Outline</Button>
                      <p className="text-xs text-muted-foreground font-mono">variant="outline"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="ghost" className="bg-transparent">Ghost</Button>
                      <p className="text-xs text-muted-foreground font-mono">variant="ghost"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="link" className="bg-transparent">Link</Button>
                      <p className="text-xs text-muted-foreground font-mono">variant="link"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="destructive">Destructive</Button>
                      <p className="text-xs text-muted-foreground font-mono">variant="destructive"</p>
                    </div>
                  </div>
                </div>

                {/* Button Sizes */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Sizes</h3>
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-2">
                      <Button size="sm">Small</Button>
                      <p className="text-xs text-muted-foreground font-mono">size="sm"</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="default">Default</Button>
                      <p className="text-xs text-muted-foreground font-mono">size="default"</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="lg">Large</Button>
                      <p className="text-xs text-muted-foreground font-mono">size="lg"</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground font-mono">size="icon"</p>
                    </div>
                  </div>
                </div>

                {/* Buttons with Icons */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">With Icons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="secondary">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Button States */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">States</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <Button>Normal</Button>
                      <p className="text-xs text-muted-foreground">Default state</p>
                    </div>
                    <div className="space-y-2">
                      <Button disabled>Disabled</Button>
                      <p className="text-xs text-muted-foreground">disabled</p>
                    </div>
                  </div>
                </div>

                {/* Usage Guidelines */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Usage Guidelines</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li><strong>Default</strong> - Primary actions (Submit, Save, Create)</li>
                      <li><strong>Secondary</strong> - Secondary actions (Cancel, Back)</li>
                      <li><strong>Outline</strong> - Tertiary actions, toggles</li>
                      <li><strong>Ghost</strong> - Subtle actions, icon-only buttons</li>
                      <li><strong>Destructive</strong> - Delete, remove, dangerous actions</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms */}
          <TabsContent value="forms" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>
                  Input components for collecting user data with proper validation states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Text Inputs */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Text Inputs</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="default">Default Input</Label>
                        <Input id="default" placeholder="Enter text..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="with-icon">With Icon</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input id="with-icon" placeholder="Search properties..." className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disabled">Disabled</Label>
                        <Input id="disabled" placeholder="Disabled input" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="error" className="text-destructive">With Error</Label>
                        <Input id="error" placeholder="Error state" className="border-destructive" />
                        <p className="text-sm text-destructive">This field is required</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Other Inputs</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="textarea">Textarea</Label>
                        <Textarea id="textarea" placeholder="Enter description..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Select</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection Controls */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Selection Controls</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4 rounded-lg border p-4">
                      <p className="font-medium">Checkbox</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="check1" defaultChecked />
                          <Label htmlFor="check1">Option 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="check2" />
                          <Label htmlFor="check2">Option 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="check3" disabled />
                          <Label htmlFor="check3" className="text-muted-foreground">Disabled</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                      <p className="font-medium">Radio</p>
                      <RadioGroup defaultValue="option1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option1" id="r1" />
                          <Label htmlFor="r1">Option 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option2" id="r2" />
                          <Label htmlFor="r2">Option 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option3" id="r3" disabled />
                          <Label htmlFor="r3" className="text-muted-foreground">Disabled</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                      <p className="font-medium">Switch</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="switch1">Email</Label>
                          <Switch id="switch1" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="switch2">SMS</Label>
                          <Switch id="switch2" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="switch3" className="text-muted-foreground">Disabled</Label>
                          <Switch id="switch3" disabled />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                      <p className="font-medium">Progress</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Profile</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Documents</span>
                            <span>30%</span>
                          </div>
                          <Progress value={30} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Form */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Example Form</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>Fill in your contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="marketing" />
                        <Label htmlFor="marketing" className="text-sm">
                          I agree to receive marketing emails
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" className="bg-transparent">Cancel</Button>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards */}
          <TabsContent value="cards" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>
                  Card components for grouping related content and actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Basic Card */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Card</h3>
                    <Card>
                      <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card description goes here</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Card content with supporting text and information.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button>Action</Button>
                      </CardFooter>
                    </Card>
                  </div>

                  {/* Stat Card */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Stat Card</h3>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Properties
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">248</div>
                        <p className="text-xs text-muted-foreground">
                          +12% from last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Property Card */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Property Card</h3>
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <Badge className="absolute top-3 left-3">For Sale</Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 h-8 w-8 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">Modern Downtown Apartment</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> New York, NY
                            </p>
                          </div>
                          <p className="text-lg font-bold text-primary">$450,000</p>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>3 beds</span>
                          <span>2 baths</span>
                          <span>1,200 sqft</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* User Card */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">User Card</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-sm text-muted-foreground">Senior Agent</p>
                          </div>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold">45</p>
                            <p className="text-xs text-muted-foreground">Listings</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">128</p>
                            <p className="text-xs text-muted-foreground">Sold</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">4.9</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables */}
          <TabsContent value="tables" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Tables</CardTitle>
                <CardDescription>
                  Data tables for displaying lists of records with actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Table */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Basic Table</h3>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Modern Loft</TableCell>
                          <TableCell>New York, NY</TableCell>
                          <TableCell>Apartment</TableCell>
                          <TableCell>$520,000</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Beach Villa</TableCell>
                          <TableCell>Miami, FL</TableCell>
                          <TableCell>Villa</TableCell>
                          <TableCell>$1,200,000</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Studio Unit</TableCell>
                          <TableCell>Chicago, IL</TableCell>
                          <TableCell>Studio</TableCell>
                          <TableCell>$180,000</TableCell>
                          <TableCell>
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Sold</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Table with Selection */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Table with Selection</h3>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">John Doe</span>
                            </div>
                          </TableCell>
                          <TableCell>john@example.com</TableCell>
                          <TableCell>+1 555-1234</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">New Lead</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Checkbox defaultChecked />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>JS</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">Jane Smith</span>
                            </div>
                          </TableCell>
                          <TableCell>jane@example.com</TableCell>
                          <TableCell>+1 555-5678</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>
                  Badges for indicating status, categories, and labels throughout the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Status Badges */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Status Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2 text-center">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
                      <p className="text-xs text-muted-foreground">Success state</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
                      <p className="text-xs text-muted-foreground">Waiting state</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
                      <p className="text-xs text-muted-foreground">Error state</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
                      <p className="text-xs text-muted-foreground">Active state</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Draft</Badge>
                      <p className="text-xs text-muted-foreground">Inactive state</p>
                    </div>
                  </div>
                </div>

                {/* Property Badges */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Property Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge>For Sale</Badge>
                    <Badge variant="secondary">For Rent</Badge>
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent">Featured</Badge>
                    <Badge className="bg-green-600 text-white hover:bg-green-600">New</Badge>
                    <Badge variant="outline" className="bg-transparent">Reduced</Badge>
                  </div>
                </div>

                {/* Category Badges */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Category Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="outline" className="bg-transparent">Apartment</Badge>
                    <Badge variant="outline" className="bg-transparent">House</Badge>
                    <Badge variant="outline" className="bg-transparent">Villa</Badge>
                    <Badge variant="outline" className="bg-transparent">Studio</Badge>
                    <Badge variant="outline" className="bg-transparent">Commercial</Badge>
                  </div>
                </div>

                {/* Contract Status */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Contract Status</h3>
                  <div className="rounded-lg border p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Draft</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Not submitted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-200">
                          <FileText className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending Review</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Signed</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Contract active</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-200">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Contract void</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Status */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Invoice Status</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2 text-center">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" /> Paid
                      </Badge>
                      <p className="text-xs text-muted-foreground">Payment received</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <AlertCircle className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                      <p className="text-xs text-muted-foreground">Awaiting payment</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <X className="mr-1 h-3 w-3" /> Overdue
                      </Badge>
                      <p className="text-xs text-muted-foreground">Past due date</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                        <FileText className="mr-1 h-3 w-3" /> Draft
                      </Badge>
                      <p className="text-xs text-muted-foreground">Not sent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Icons */}
          <TabsContent value="icons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Icons</CardTitle>
                <CardDescription>
                  Lucide icons used throughout the application with consistent sizing and usage patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Icon Grid */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Icon Library</h3>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
                    {icons.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => copyToClipboard(item.name, `icon-${item.name}`)}
                        className="group relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:bg-muted"
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        {copied === `icon-${item.name}` && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs text-background">
                            Copied!
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Sizes */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Icon Sizes</h3>
                  <div className="flex flex-wrap items-end gap-8">
                    <div className="text-center">
                      <Building2 className="h-4 w-4 mx-auto" />
                      <p className="mt-2 text-xs text-muted-foreground font-mono">h-4 w-4</p>
                      <p className="text-xs text-muted-foreground">16px - Inline</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-5 w-5 mx-auto" />
                      <p className="mt-2 text-xs text-muted-foreground font-mono">h-5 w-5</p>
                      <p className="text-xs text-muted-foreground">20px - Default</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto" />
                      <p className="mt-2 text-xs text-muted-foreground font-mono">h-6 w-6</p>
                      <p className="text-xs text-muted-foreground">24px - Large</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-8 w-8 mx-auto" />
                      <p className="mt-2 text-xs text-muted-foreground font-mono">h-8 w-8</p>
                      <p className="text-xs text-muted-foreground">32px - Feature</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-12 w-12 mx-auto" />
                      <p className="mt-2 text-xs text-muted-foreground font-mono">h-12 w-12</p>
                      <p className="text-xs text-muted-foreground">48px - Hero</p>
                    </div>
                  </div>
                </div>

                {/* Icon Colors */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Icon Colors</h3>
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto text-foreground" />
                      <p className="mt-2 text-xs text-muted-foreground">Default</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-xs text-muted-foreground">Muted</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto text-primary" />
                      <p className="mt-2 text-xs text-muted-foreground">Primary</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto text-accent" />
                      <p className="mt-2 text-xs text-muted-foreground">Accent</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto text-destructive" />
                      <p className="mt-2 text-xs text-muted-foreground">Destructive</p>
                    </div>
                  </div>
                </div>

                {/* Usage Guidelines */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Icon Usage Guidelines</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li>Use <strong>16px (h-4 w-4)</strong> for inline icons in text and buttons</li>
                      <li>Use <strong>20px (h-5 w-5)</strong> for navigation and standard UI elements</li>
                      <li>Use <strong>24px (h-6 w-6)</strong> for feature icons and cards</li>
                      <li>Always pair icons with text labels for accessibility</li>
                      <li>Use <code className="bg-muted px-1 rounded">aria-hidden="true"</code> when icon is decorative</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
