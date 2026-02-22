"use client"

import type { Faculty } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface FacultyListProps {
  facultyList: Faculty[]
}

export function FacultyList({ facultyList }: FacultyListProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Users className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Faculty ({facultyList.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {facultyList.map((faculty) => (
          <div key={faculty.abbreviation} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors duration-200 group">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">{faculty.abbreviation}</p>
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">{faculty.fullName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
