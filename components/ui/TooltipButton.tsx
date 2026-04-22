// components/ui/TooltipButton.tsx
"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { forwardRef } from "react"

interface TooltipButtonProps extends React.ComponentProps<typeof Button> {
  tooltip: string
}

export const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltip, children, ...props }, ref) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)

TooltipButton.displayName = "TooltipButton"