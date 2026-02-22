"use client"

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { GeneratedTimetable } from '@/lib/types'
import { getGeneratedTimetableById } from '@/services/timetableService'
import { TimetableHeader } from '@/components/timetable-header'
import { DaySchedule } from '@/components/day-schedule'
import { SubjectsList } from '@/components/subjects-list'
import { FacultyList } from '@/components/faculty-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'

export default function Generated() {
  const { id } = useParams()
  const [timetable, setTimetable] = useState<GeneratedTimetable | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getGeneratedTimetableById(id)
      .then(data => setTimetable(data))
      .catch(err => setError(err?.response?.data?.error || err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  const handlePrint = () => window.print()

  const handleDownload = () => {
    if (!timetable) return
    const content = `\n${timetable.semester} Semester - ${timetable.department}\n${timetable.room}\nValid from: ${new Date(timetable.effectiveDate).toLocaleDateString()}\n\nCoordinator: ${timetable.classCoordinator?.name}\nCo-Coordinator: ${timetable.classCoCoordinator?.name}\n\nSUBJECTS\n${timetable.subjects.map((s) => `${s.code}: ${s.name} (${s.type})`).join('\n')}\n\nFACULTY\n${timetable.facultyList.map((f) => `${f.abbreviation}: ${f.fullName}`).join('\n')}\n`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timetable-${timetable.semester}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const days = useMemo(() => timetable?.days || [], [timetable])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Timetable</h1>
            <p className="text-muted-foreground text-lg">Academic Schedule Preview & Management</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={handlePrint} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {timetable ? (
            <>
              <TimetableHeader timetable={timetable} />

              <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto">
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="subjects">Subjects</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-6 mt-6">
                  {days.map((day) => (
                    <DaySchedule key={day} day={day} slots={timetable.slots} lunchSlot={timetable.lunchSlot} facultyList={timetable.facultyList} />
                  ))}
                </TabsContent>

                <TabsContent value="subjects" className="mt-6">
                  <SubjectsList subjects={timetable.subjects} />
                </TabsContent>

                <TabsContent value="faculty" className="mt-6">
                  <FacultyList facultyList={timetable.facultyList} />
                </TabsContent>
              </Tabs>

              <Card className="p-6 bg-muted/30 border-0">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Last Updated: {timetable.updatedAt ? new Date(timetable.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  <p className="mt-2 text-xs">For any changes or issues, please contact the class coordinator</p>
                </div>
              </Card>
            </>
          ) : (
            <div className="p-6">No timetable selected.</div>
          )}
        </div>
      </div>
    </div>
  )
}
