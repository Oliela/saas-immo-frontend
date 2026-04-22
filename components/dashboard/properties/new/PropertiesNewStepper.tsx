import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

export default function PropertiesNewStepper({ currentStep, steps, setCurrentStep }: { currentStep: number, steps: { id: number, name: string, description: string }[], setCurrentStep: React.Dispatch<React.SetStateAction<number>> }) {
  const progress = (currentStep / steps.length) * 100

  return (
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  className={cn(
                    "flex flex-col items-center",
                    currentStep > step.id && "cursor-pointer"
                  )}
                  disabled={currentStep <= step.id}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      currentStep === step.id && "border-primary bg-primary text-primary-foreground",
                      currentStep > step.id && "border-primary bg-primary text-primary-foreground",
                      currentStep < step.id && "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium hidden sm:block",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 sm:w-16 lg:w-24 mx-2",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}
