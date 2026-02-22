import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { generateWithAI } from '@/services/generateService'
import { Textarea } from '@/components/ui/textarea'

export default function GenerateAI() {
  const [prompt, setPrompt] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    if (!prompt || prompt.trim().length === 0) {
      setError('Please provide a prompt describing the timetable requirements.')
      return
    }

    setLoading(true)
    try {
      const res = await generateWithAI(prompt.trim())
      const id = res?.data?.id || res?.data?._id
      if (id) navigate(`/generated/${id}`)
      else setError('Generated but no id returned; check server response.')
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">

            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">Generate Timetable (AI)</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provide a prompt and we'll generate a timetable for you</p>
            </CardHeader>

            <CardContent className="space-y-6 py-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="gen-prompt">Prompt</FieldLabel>
                  <Textarea
                    id="gen-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe days, periods, subjects, constraints, faculty availability..."
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>
                {error && <FieldError className="text-red-600 dark:text-red-400">{error}</FieldError>}
              </FieldGroup>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {loading ? 'Generating...' : 'Generate with AI'}
              </Button>

            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              {/* optional footer link could go here */}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
