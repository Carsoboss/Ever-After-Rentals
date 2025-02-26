"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, "selected" | "onSelect"> & {
  mode?: "single"
  selected?: Date | null | undefined
  onSelect?: (date: Date | null) => void
  disabled?: (date: Date) => boolean
  defaultMonth?: Date
  showOutsideDays?: boolean
  className?: string
  _classNames?: Record<string, string>
}

function Calendar({
  mode: _mode = "single",
  selected,
  onSelect,
  disabled,
  defaultMonth: _defaultMonth,
  showOutsideDays = true,
  className,
  _classNames,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(_defaultMonth ?? new Date())

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  const endDate = new Date(lastDayOfMonth)
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))

  const weeks: Date[][] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(week)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    return date.toDateString() === selected.toDateString()
  }

  const isDisabled = (date: Date) => {
    if (disabled) return disabled(date)
    return false
  }

  const isOutsideMonth = (date: Date) => {
    return date.getMonth() !== currentMonth.getMonth()
  }

  const handleDateSelect = (date: Date) => {
    if (isDisabled(date)) return
    onSelect?.(date)
  }

  return (
    <div className={cn("w-[318px] rounded-md border bg-white shadow", className)}>
      <div className="p-3">
        <div className="flex items-center justify-between px-1 mb-4">
          <button
            onClick={handlePreviousMonth}
            className="flex h-7 w-7 items-center justify-center rounded-md border bg-white text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="font-medium text-sm">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </div>
          <button
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-md border bg-white text-gray-500 hover:text-gray-900"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-muted-foreground text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dateIndex) => {
                const isCurrentDate = isSelected(date)
                const dateDisabled = isDisabled(date)
                const outsideMonth = !showOutsideDays && isOutsideMonth(date)

                return (
                  <button
                    key={dateIndex}
                    onClick={() => handleDateSelect(date)}
                    disabled={dateDisabled}
                    className={cn(
                      "h-8 w-8 rounded-md text-sm p-0 font-normal",
                      isCurrentDate ?
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" : "",
                      dateDisabled ? "text-muted-foreground opacity-50 cursor-not-allowed" : "",
                      !dateDisabled && !isCurrentDate ? "hover:bg-accent hover:text-accent-foreground" : "",
                      outsideMonth ? "invisible" : "",
                      isOutsideMonth(date) ? "text-muted-foreground opacity-50" : "",
                    )}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

