import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  // Initialize theme state from localStorage or fallback to defaultTheme
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored
      }
    }
    return defaultTheme
  })

  // Handler to update theme in both state and localStorage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme)
      }
    },
    [storageKey]
  )

  // Effect to update the document class and respond to system theme changes
  useEffect(() => {
    const root = window.document.documentElement

    const applyTheme = (themeToSet: Theme) => {
      root.classList.remove("light", "dark")
      if (themeToSet === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.classList.add(isDark ? "dark" : "light")
      } else {
        root.classList.add(themeToSet)
      }
    }

    applyTheme(theme)

    let media: MediaQueryList | null = null
    const systemThemeListener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    if (theme === "system") {
      media = window.matchMedia("(prefers-color-scheme: dark)")
      media.addEventListener("change", systemThemeListener)
    }

    return () => {
      if (media) {
        media.removeEventListener("change", systemThemeListener)
      }
    }
  }, [theme])

  // Effect to sync theme state if storage changes (e.g., other tabs)
  useEffect(() => {
    const syncTheme = (e: StorageEvent) => {
      if (e.key === storageKey && (e.newValue === "light" || e.newValue === "dark" || e.newValue === "system")) {
        setThemeState(e.newValue)
      }
    }
    window.addEventListener("storage", syncTheme)
    return () => window.removeEventListener("storage", syncTheme)
  }, [storageKey])

  const value: ThemeProviderContextType = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
