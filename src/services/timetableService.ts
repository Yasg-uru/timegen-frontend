import api from '@/lib/api'
import type { GeneratedTimetable } from '@/types/generatedTimetable'

export const getGeneratedTimetables = async () => {
  const res = await api.get('/timetable/generated')
  return res.data.data as GeneratedTimetable[]
}

export const getGeneratedTimetableById = async (id: string) => {
  const res = await api.get(`/timetable/generated/${id}`)
  return res.data.data as GeneratedTimetable
}

export default {
  getGeneratedTimetables,
  getGeneratedTimetableById
}
