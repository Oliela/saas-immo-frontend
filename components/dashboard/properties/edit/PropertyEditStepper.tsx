import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Dispatch, SetStateAction } from "react"

type PropertyEditStepperProps = {
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

const steps = [
  { id: 1, name: "Informations" },
  { id: 2, name: "Localisation" },
  { id: 3, name: "Détails" },
  { id: 4, name: "Médias" },
  { id: 5, name: "Propriétaire" },
]

export default function PropertyEditStepper({ currentStep, setCurrentStep }: PropertyEditStepperProps) {

  const progress = (currentStep / steps.length) * 100

  return (
     <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Étape {currentStep} sur {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complet</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className="flex flex-col items-center cursor-pointer"
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