import { vi, describe, it, expect, beforeEach } from 'vitest'
import api from '@/lib/api'
import { getGeneratedTimetables } from '@/services/timetableService'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('timetableService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches generated timetables', async () => {
    const fake = [{ id: '1', department: 'CS' }]
    ;(api.get as any).mockResolvedValue({ data: { data: fake } })

    const res = await getGeneratedTimetables()
    expect(res).toEqual(fake)
    expect(api.get).toHaveBeenCalledWith('/timetable/generated')
  })
})
