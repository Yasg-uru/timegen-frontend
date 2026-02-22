"use client"

import type { Slot, Faculty } from '@/lib/types'
import { Clock, Users, Code } from 'lucide-react'
import { Badge } from './ui/badge'

interface SlotItemProps {
  slot: Slot
  isLunch?: boolean
  facultyList?: Faculty[]
  colorIndex?: number
}

const classColors = [
  { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
  { bg: 'bg-pink-50 dark:bg-pink-950', border: 'border-pink-200 dark:border-pink-800', text: 'text-pink-700 dark:text-pink-300' },
  { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-200 dark:border-cyan-800', text: 'text-cyan-700 dark:text-cyan-300' },
  { bg: 'bg-teal-50 dark:bg-teal-950', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
]

const lunchColors = { bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' }

export function SlotItem({ slot, isLunch = false, facultyList = [], colorIndex = 0 }: SlotItemProps) {
  const colors = isLunch ? lunchColors : classColors[colorIndex % classColors.length]

  const getFacultyNames = () => {
    if (!slot.faculty || slot.faculty.length === 0) return []
    return slot.faculty.map((fCode) => {
      const faculty = facultyList.find((f) => f.abbreviation === fCode)
      return faculty ? faculty.fullName : fCode
    })
  }

  return (
    <div className={` ${colors.bg} border-l-4 ${colors.border} rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${colors.text}`} />
        <span className="text-sm font-bold text-foreground">{slot.startTime} - {slot.endTime}</span>
      </div>

      {isLunch ? (
        <div>
          <h3 className={`text-lg font-bold ${colors.text} mb-1`}>Lunch Break</h3>
          <p className="text-sm text-muted-foreground">Rest and Refreshment</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-1">
              <Code className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{slot.subjectCode}</p>
                <h3 className={`text-lg font-bold ${colors.text} line-clamp-2`}>{slot.subjectName}</h3>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-3">
            <Users className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Faculty</p>
              <div className="flex flex-wrap gap-1">
                {getFacultyNames().length > 0 ? (
                  getFacultyNames().map((name, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-background/50">{name}</Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs bg-background/50">{slot.faculty.join(', ')}</Badge>
                )}
              </div>
            </div>
          </div>

          <Badge variant="secondary" className={`inline-block text-xs ${colors.text} border-0`}>{slot.type}</Badge>
        </>
      )}
    </div>
  )
}
