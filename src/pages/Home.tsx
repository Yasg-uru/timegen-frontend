import React from 'react'
import { Link } from 'react-router-dom'
import { getGeneratedTimetables } from '@/services/timetableService'
import type { GeneratedTimetable } from '@/types/generatedTimetable'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [items, setItems] = React.useState<GeneratedTimetable[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    getGeneratedTimetables()
      .then(data => {
        if (!mounted) return
        // guard against malformed / undefined responses
        if (Array.isArray(data)) setItems(data)
        else setItems([])
      })
      .catch(err => {
        if (mounted) setError(err?.message || 'Failed to load')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen pt-20 px-4 bg-white dark:bg-black text-black dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Generated Timetables</h1>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && items.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">No timetables found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => {
            const id = item.id || item._id || ''
            const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleString() : ''
            return (
              <Card key={id} className="shadow rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardHeader className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">{item.department || 'Untitled'}</CardTitle>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.semester || ''} {item.room ? `· ${item.room}` : ''}</div>
                  </div>
                </CardHeader>

                <CardContent className="py-2">
                  <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{item.prompt || ''}</div>
                  <div className="text-xs text-muted-foreground">
                    <div>Coordinator: {item.classCoordinator?.name || '—'}</div>
                    <div>Faculty: {item.facultyList?.slice(0,3).map(f => f.abbreviation).join(', ') || '—'}</div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {(() => {
                      const creator = item.createdBy as any
                      const name = typeof creator === 'string' ? creator : (creator?.name || creator?.email || 'Unknown')
                      return <div>Created by: {name}</div>
                    })()}
                    {createdAt && <div className="text-xs">{createdAt}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/generated/${id}`}> 
                      <Button className="h-9 bg-black text-white dark:bg-white dark:text-black">View</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
