"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import api from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const schema = z.object({ email: z.string().email("Invalid email") })

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } })
  const { handleSubmit, register, formState: { errors, isSubmitting } } = form
  const [token, setToken] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null)
    try {
      const resp = await api.post('/auth/forgot-password', values)
      const data = resp.data
      if (!resp || resp.status >= 400) throw new Error(data?.message || 'Failed')
      setToken(data.token)
    } catch (err: any) {
      setError(err?.message || 'Failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Card className="shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">

          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">Forgot Password</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email to receive a reset token</p>
          </CardHeader>

          <CardContent className="space-y-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fp-email">Email</FieldLabel>
                  <Input
                    id="fp-email"
                    type="email"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                    autoComplete="username"
                    className="h-11 bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                  />
                  {errors.email && <FieldError className="text-red-600 dark:text-red-600" errors={[errors.email]} />}
                </Field>
              </FieldGroup>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              )}

              {token && (
                <div className="text-sm mt-2">Reset token (dev): <code className="bg-muted/20 px-2 py-1 rounded">{token}</code></div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {isSubmitting ? "Sending..." : "Send reset"}
              </Button>

            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 underline">Back to login</Link>
          </CardFooter>

        </Card>
      </div>
    </div>
  )
}
