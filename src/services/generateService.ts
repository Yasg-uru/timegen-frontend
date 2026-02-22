import api from '@/lib/api'

export type GenerateAIResult = {
  data: any
  html?: string
}

export const generateWithAI = async (prompt: string) => {
  const res = await api.post('/timetable/generate-ai', { prompt }, { withCredentials: true })
  return res.data as GenerateAIResult
}

export default { generateWithAI }
