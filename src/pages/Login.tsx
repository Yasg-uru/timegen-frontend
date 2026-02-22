"use client"

import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "../context/AuthContext"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function Login() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  async function onSubmit(data: LoginValues) {
    setServerError(null)
    try {
      await auth.login(data.email, data.password)
      navigate("/dashboard")
    } catch (err: any) {
      setServerError(err?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Card className="shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">

          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">
              Login
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to your TimeGen account
            </p>
          </CardHeader>

          <CardContent className="space-y-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-email">
                        Email
                      </FieldLabel>
                      <Input
                        id="login-email"
                        type="email"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="username"
                        className="h-11 bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                      />
                      {fieldState.invalid && (
                        <FieldError className="text-red-600 dark:text-red-600" errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-password">
                        Password
                      </FieldLabel>
                      <Input
                        id="login-password"
                        type="password"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                        className="h-11 bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                      />
                      {fieldState.invalid && (
                        <FieldError className="text-red-600 dark:text-red-600" errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {serverError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

            </form>
          </CardContent>

          <CardFooter className="flex justify-between items-center pb-6">
            <Link
              to="/forgot"
              className="text-sm text-gray-600 dark:text-gray-400 underline"
            >
              Forgot password?
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-600 dark:text-gray-400 underline"
            >
              Create account
            </Link>
          </CardFooter>

        </Card>
      </div>
    </div>
  )
}
