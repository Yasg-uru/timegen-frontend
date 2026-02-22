import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        pathname === to
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "hover:bg-gray-200 dark:hover:bg-gray-800"
      )}
    >
      {children}
    </Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white text-black dark:bg-black dark:text-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold">
              TimeGen
            </Link>

            <nav className="hidden sm:flex items-center gap-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/generate">Generate timetable</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:block">
                  <span className="px-3 py-2 rounded-md text-sm font-medium">
                    {user.name || user.email}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <button
                    onClick={async () => {
                      try {
                        await logout()
                      } finally {
                        navigate('/')
                      }
                    }}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="hidden sm:block">
                  <NavLink to="/login">Login</NavLink>
                </div>
                <div className="hidden sm:block">
                  <NavLink to="/register">Register</NavLink>
                </div>
              </>
            )}

            <ThemeToggle />

            <div className="sm:hidden">
              <Button variant="ghost" size="icon" aria-label="menu">
                ≡
              </Button>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      document.documentElement.classList.contains("dark"))

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
    >
      {isDark ? (
        <Sun size={16} className="text-yellow-400" />
      ) : (
        <Moon size={16} />
      )}
    </button>
  )
}
