"use client"

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { GeneratedTimetable } from '@/lib/types'
import { getGeneratedTimetableById } from '@/services/timetableService'
import { TimetableHeader } from '@/components/timetable-header'
import { DaySchedule } from '@/components/day-schedule'
import { SubjectsList } from '@/components/subjects-list'
import { FacultyList } from '@/components/faculty-list'
import api from '../lib/api'
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



  const days = useMemo(() => timetable?.days || [], [timetable])

  const [htmlPreview, setHtmlPreview] = useState<string | null>(null)
  const [loadingHtml, setLoadingHtml] = useState(false)

  async function fetchHtml() {
    if (!id) return null
    if (htmlPreview) return htmlPreview
    try {
      setLoadingHtml(true)
      const res = await api.get(`/timetable/generated/${id}/html`, { responseType: 'text' })
      setHtmlPreview(res.data)
      return res.data
    } catch (err) {
      return null
    } finally {
      setLoadingHtml(false)
    }
  }

  // Print rendered HTML (fetch if needed)
  async function printHtml() {
    const html = await fetchHtml()
    if (!html) {
      // fallback to page print
      window.print()
      return
    }
    const w = window.open('', '_blank')
    if (!w) {
      // popup blocked, fallback
      window.print()
      return
    }
    w.document.open()
    w.document.write(html)
    w.document.close()
    // give browser a moment to render
    setTimeout(() => { w.print(); }, 300)
  }

  // Download rendered HTML (fetch if needed)
  async function downloadHtml() {
    const html = await fetchHtml()
    if (!html) return
    const blob = new Blob([html], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timetable-${timetable?.semester || id}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white p-4">
      <div className="w-full max-w-5xl mx-auto">
        <Card className="shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="p-6 md:p-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Timetable</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Academic Schedule Preview & Management</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={printHtml} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={downloadHtml} size="sm" className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={async () => { await fetchHtml(); }} variant={htmlPreview ? 'default' : 'ghost'} size="sm" className="hidden sm:inline-flex">
                  {loadingHtml ? 'Loading...' : (htmlPreview ? 'Rendered HTML Loaded' : 'Load Rendered HTML')}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
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

                  {/* Rendered HTML preview */}
                  {htmlPreview ? (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Rendered HTML Preview</h3>
                      <iframe title="timetable-render" srcDoc={htmlPreview} style={{ width: '100%', height: '70vh', border: '1px solid #ccc' }} sandbox="allow-same-origin allow-scripts" />
                    </div>
                  ) : null}

                  <Card className="p-6 bg-muted/30 border-0 mt-6">
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
        </Card>
      </div>
    </div>
  )
}
