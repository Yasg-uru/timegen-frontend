"use client"

import * as React from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const schema = z.object({ token: z.string().min(1), password: z.string().min(6) })

export default function ResetPassword() {
  const search = useSearchParams()[0]
  const tokenFromUrl = search.get('token') || ''
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { token: tokenFromUrl, password: '' } })
  const { handleSubmit, register, formState: { errors, isSubmitting } } = form
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null)
    try {
      const resp = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      if (!resp.ok) {
        const d = await resp.json().catch(() => ({}))
        throw new Error(d?.message || 'Failed')
      }
      navigate('/login')
    } catch (err: any) {
      setError(err?.message || 'Failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Enter a new password using the reset token</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="rp-token">Reset Token</FieldLabel>
                  <Input id="rp-token" {...register('token')} />
                  {errors.token && <FieldError className="text-red-600 dark:text-red-400" errors={[errors.token]} />}
                </Field>
                <Field>
                  <FieldLabel htmlFor="rp-password">New Password</FieldLabel>
                  <Input id="rp-password" type="password" {...register('password')} />
                  {errors.password && <FieldError className="text-red-600 dark:text-red-400" errors={[errors.password]} />}
                </Field>
              </FieldGroup>
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Reset password</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
