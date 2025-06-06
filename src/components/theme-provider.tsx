
import * as React from "react"

export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}
