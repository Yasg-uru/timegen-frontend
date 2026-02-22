"use client"

import type { Subject } from '@/lib/types'
import { Card } from '@/components/ui/card'

import { BookOpen } from 'lucide-react'
import { Badge } from './ui/badge'

interface SubjectsListProps {
  subjects: Subject[]
}

export function SubjectsList({ subjects }: SubjectsListProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <BookOpen className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Subjects ({subjects.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subjects.map((subject) => (
          <div key={subject.code} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors duration-200 group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{subject.code}</p>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{subject.name}</h3>
              </div>
              <Badge variant="outline" className="flex-shrink-0 ml-2">{subject.type}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
