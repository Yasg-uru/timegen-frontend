import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach } from 'vitest'
import GenerateAI from '@/pages/GenerateAI'
import * as service from '@/services/generateService'

vi.mock('@/services/generateService')

describe('GenerateAI page', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('shows validation and calls service', async () => {
    ;(service.generateWithAI as any).mockResolvedValue({ data: { id: 'xyz' } })

    render(<GenerateAI />)

    const button = screen.getByRole('button', { name: /generate with ai/i })
    fireEvent.click(button)

    expect(await screen.findByText(/please provide a prompt/i)).toBeInTheDocument()

    const textarea = screen.getByPlaceholderText(/describe days, periods/i)
    fireEvent.change(textarea, { target: { value: 'generate a 5-day timetable' } })
    fireEvent.click(button)

    await waitFor(() => expect(service.generateWithAI).toHaveBeenCalled())
  })
})
