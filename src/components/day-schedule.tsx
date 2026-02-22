"use client"

import type { Slot, TimeSlot, LunchSlot, Faculty } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { SlotItem } from '@/components/slot-item'
import { Calendar } from 'lucide-react'

interface DayScheduleProps {
  day: string
  slots: Slot[]
  timeSlots: TimeSlot[]
  lunchSlot: LunchSlot
  facultyList: Faculty[]
}

export function DaySchedule({ day, slots, timeSlots, lunchSlot, facultyList }: DayScheduleProps) {
  const daySlots = slots.filter((s) => s.day === day)

  const sortedSlots = [...daySlots].sort((a, b) => {
    const aTime = timeToMinutes(a.startTime)
    const bTime = timeToMinutes(b.startTime)
    return aTime - bTime
  })

  if (sortedSlots.length === 0) {
    return (
      <Card className="p-6 border-dashed flex items-center justify-center min-h-64 bg-muted/30">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No classes scheduled for {day}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-0 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{day}</h2>
        <span className="text-sm font-medium text-muted-foreground ml-auto">{sortedSlots.length} class{sortedSlots.length !== 1 ? 'es' : ''}</span>
      </div>

      <div className="space-y-3">
        {sortedSlots.map((slot, index) => (
          <SlotItem key={`${slot.day}-${slot.startTime}-${slot.subjectCode}`} slot={slot} facultyList={facultyList} colorIndex={index} />
        ))}

        <SlotItem slot={{ day, startTime: lunchSlot.start, endTime: lunchSlot.end, subjectCode: '', subjectName: '', faculty: [], type: '' }} isLunch={true} colorIndex={0} />
      </div>
    </Card>
  )
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}
