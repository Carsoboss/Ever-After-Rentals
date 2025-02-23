import * as React from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={`p-6 ${className}`} {...props} />
} 