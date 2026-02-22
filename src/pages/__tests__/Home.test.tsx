import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach } from 'vitest'
import Home from '@/pages/Home'
import * as service from '@/services/timetableService'

vi.mock('@/services/timetableService')

describe('Home page', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders list from service', async () => {
    const fake = [{ id: '1', department: 'Math' }]
    ;(service.getGeneratedTimetables as any).mockResolvedValue(fake)

    render(<Home />)

    await waitFor(() => expect(service.getGeneratedTimetables).toHaveBeenCalled())

    expect(screen.getByText('Generated Timetables')).toBeInTheDocument()
    expect(screen.getByText('Math')).toBeInTheDocument()
  })
})
