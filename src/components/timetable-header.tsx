"use client"

import type { GeneratedTimetable } from '@/lib/types'
import { Card } from '@/components/ui/card'

import { User, BookOpen, Building2, Calendar } from 'lucide-react'
import { Badge } from './ui/badge'

interface TimetableHeaderProps {
  timetable: GeneratedTimetable
}

export function TimetableHeader({ timetable }: TimetableHeaderProps) {
  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-sm">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Class Schedule</h1>
          <p className="text-muted-foreground text-lg">{timetable.semester} Semester - {timetable.department}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase">Room</p>
              <p className="text-sm font-semibold text-foreground truncate">{timetable.room}</p>
              {timetable.section && <p className="text-xs text-muted-foreground">Section: {timetable.section}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase">Valid From</p>
              <p className="text-sm font-semibold text-foreground">{new Date(timetable.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase">Coordinator</p>
              <p className="text-sm font-semibold text-foreground truncate">{timetable.classCoordinator?.name}</p>
              <p className="text-xs text-muted-foreground">{timetable.classCoordinator?.abbreviation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase">Co-Coordinator</p>
              <p className="text-sm font-semibold text-foreground truncate">{timetable.classCoCoordinator?.name}</p>
              <p className="text-xs text-muted-foreground">{timetable.classCoCoordinator?.abbreviation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase">Subjects</p>
              <p className="text-sm font-semibold text-foreground">{timetable.subjects?.length || 0}</p>
              <p className="text-xs text-muted-foreground">courses</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground uppercase">Schedule Days:</span>
          <div className="flex flex-wrap gap-2">
            {timetable.days?.map((day) => (
              <Badge key={day} variant="secondary" className="font-medium">{day}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
