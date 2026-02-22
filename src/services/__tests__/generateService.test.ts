import { vi, describe, it, expect, beforeEach } from 'vitest'
import api from '@/lib/api'
import { generateWithAI } from '@/services/generateService'

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('generateService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('posts prompt and returns result', async () => {
    const fake = { data: { id: 'abc' }, html: '<div/>' }
    ;(api.post as any).mockResolvedValue({ data: fake })

    const res = await generateWithAI('my prompt')
    expect(res).toEqual(fake)
    expect(api.post).toHaveBeenCalledWith('/timetable/generate-ai', { prompt: 'my prompt' })
  })
})
