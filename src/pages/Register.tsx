"use client"

import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function Register() {
  const auth = useAuth()
  const navigate = useNavigate()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const [serverError, setServerError] = React.useState<string | null>(null)

  async function onSubmit(data: RegisterValues) {
    setServerError(null)
    try {
      await auth.register(data.email, data.password, data.name)
      navigate("/dashboard")
    } catch (err: any) {
      setServerError(err?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">

          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Register
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="register-name">Name</FieldLabel>
                  <Input
                    id="register-name"
                    {...formRegister("name")}
                    aria-invalid={!!errors.name}
                    autoComplete="name"
                    className="h-11 bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                  />
                  {errors.name && <FieldError className="text-red-600 dark:text-red-600" errors={[errors.name]} />}
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    id="register-email"
                    type="email"
                    {...formRegister("email")}
                    aria-invalid={!!errors.email}
                    autoComplete="username"
                    className="h-11 bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                  />
                  {errors.email && <FieldError className="text-red-600 dark:text-red-600" errors={[errors.email]} />}
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <Input
                    id="register-password"
                    type="password"
                    {...formRegister("password")}
                    aria-invalid={!!errors.password}
                    autoComplete="new-password"
                    className="h-11 bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                  />
                  {errors.password && <FieldError className="text-red-600 dark:text-red-600" errors={[errors.password]} />}
                </Field>

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
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Link
              to="/login"
              className="text-sm text-gray-600 dark:text-gray-400 underline"
            >
              Already have an account?
            </Link>
          </CardFooter>

        </Card>
      </div>
    </div>
  )
}
