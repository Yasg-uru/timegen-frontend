import React, { useEffect, useState } from 'react'
import api from '../lib/api'

type TimetableMeta = {
  _id: string
  department?: string
  semester?: string
  timeTableMonth?: string
  effectiveDate?: string
  createdAt?: string
  createdBy?: { _id?: string; name?: string; email?: string }
}

export default function Timetables() {
  const [list, setList] = useState<TimetableMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [selected, setSelected] = useState<TimetableMeta | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/timetable/generated')
      .then(res => setList(res.data.data || []))
      .catch(err => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false))
  }, [])

  const viewHtml = async (id: string) => {
    setHtml(null)
    setError(null)
    try {
      const res = await api.get(`/timetable/generated/${id}/html`, { responseType: 'text' })
      setHtml(res.data)
      const meta = list.find(x => x._id === id) || null
      setSelected(meta)
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message)
    }
  }

  const downloadHtml = () => {
    if (!html || !selected) return
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const name = `${selected.department || 'timetable'}-${selected.timeTableMonth || ''}.html`
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <h2>Generated Timetables</h2>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Department</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Semester</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Month</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Created By</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item._id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{item.department}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{item.semester}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{item.timeTableMonth}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{item.createdBy?.name || item.createdBy?.email || '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <button onClick={() => viewHtml(item._id)} style={{ marginRight: 8 }}>View</button>
                    <a href={`/api/timetable/generated/${item._id}/html`} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </td>
                </tr>
              ))}
              {list.length === 0 && !loading && (
                <tr><td colSpan={4} style={{ padding: 8 }}>No timetables found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Preview</strong>
            <div>
              <button onClick={downloadHtml} disabled={!html} style={{ marginRight: 8 }}>Download</button>
              <button onClick={() => { setHtml(null); setSelected(null); }}>Close</button>
            </div>
          </div>

          {html ? (
            <iframe
              title="timetable-preview"
              srcDoc={html}
              style={{ width: '100%', height: '70vh', border: '1px solid #ccc' }}
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <div style={{ padding: 12, border: '1px dashed #ccc', minHeight: 400 }}>
              {selected ? <div>Preview not loaded.</div> : <div>Select a timetable to preview</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
