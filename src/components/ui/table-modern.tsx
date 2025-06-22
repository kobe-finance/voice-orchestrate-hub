import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tableVariants = cva(
  "w-full border border-border rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background",
        striped: "divide-y divide-border",
      },
      size: {
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TableColumn<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface ModernTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[]
  columns: TableColumn<T>[]
  variant?: VariantProps<typeof tableVariants>["variant"]
  size?: VariantProps<typeof tableVariants>["size"]
  searchable?: boolean
  onSearch?: (searchTerm: string) => void
  searchPlaceholder?: string
  pageSize?: number
}

export function ModernTable<T extends Record<string, any>>({
  data,
  columns,
  variant,
  size,
  searchable = true,
  onSearch,
  searchPlaceholder = "Search...",
  pageSize = 10,
  className,
  ...props
}: ModernTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = React.useState(1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data
    const lowerSearch = searchTerm.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key as keyof T]
        if (value === undefined || value === null) return false
        return String(value).toLowerCase().includes(lowerSearch)
      })
    )
  }, [data, searchTerm, columns])

  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData
    const col = columns.find((c) => c.key === sortKey)
    if (!col) return filteredData
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortKey as keyof T]
      const bVal = b[sortKey as keyof T]
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
    return sorted
  }, [filteredData, sortKey, sortDirection, columns])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {searchable && (
        <div className="flex items-center justify-between">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            {sortedData.length} result{sortedData.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      <Card variant="default" className="overflow-x-auto">
        <table className={cn(tableVariants({ variant, size }))}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "cursor-pointer select-none whitespace-nowrap px-4 py-2 text-left font-semibold text-muted-foreground",
                    col.sortable && "hover:text-primary"
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.title}
                    {col.sortable && sortKey === col.key && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                          "h-4 w-4 transition-transform",
                          sortDirection === "asc" ? "rotate-180" : ""
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={variant === "striped" ? "divide-y divide-border" : ""}>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-muted-foreground">
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={variant === "striped" && rowIndex % 2 === 1 ? "bg-muted/50" : ""}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="whitespace-nowrap px-4 py-2">
                      {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
