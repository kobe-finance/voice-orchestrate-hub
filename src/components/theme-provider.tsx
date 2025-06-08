
import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderContextType | undefined>(undefined)

export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  ...props 
}: { 
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  console.log('ThemeProvider rendering with theme:', theme)

  const value = React.useMemo(() => ({
    theme,
    setTheme,
  }), [theme])

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    console.warn("useTheme must be used within a ThemeProvider, returning default values")
    return { theme: "system" as Theme, setTheme: () => {} }
  }

  return context
}
