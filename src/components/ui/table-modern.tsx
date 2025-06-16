
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronUp, ChevronDown, Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card-modern"
import { Button } from "@/components/ui/button-modern"
import { Input } from "@/components/ui/input-modern"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/loading"

const tableVariants = cva(
  "w-full border-collapse",
  {
    variants: {
      variant: {
        default: "border-spacing-0",
        striped: "border-spacing-0",
        bordered: "border border-border rounded-lg overflow-hidden"
      },
      size: {
        sm: "text-sm",
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface Column<T = any> {
  key: keyof T | string
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  className?: string
}

export interface ModernTableProps<T = any>
  extends VariantProps<typeof tableVariants> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  sortable?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  selectable?: boolean
  onSelect?: (selectedRows: T[]) => void
  actions?: React.ReactNode
  emptyMessage?: string
  className?: string
}

function ModernTable<T = any>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  sortable = false,
  onSort,
  selectable = false,
  onSelect,
  actions,
  emptyMessage = "No data available",
  variant,
  size,
  className
}: ModernTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [selectedRows, setSelectedRows] = React.useState<T[]>([])

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }, [onSearch])

  const handleSort = React.useCallback((key: string) => {
    if (!sortable) return
    
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }, [sortConfig, sortable, onSort])

  const toggleRowSelection = React.useCallback((row: T) => {
    const newSelection = selectedRows.includes(row)
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row]
    
    setSelectedRows(newSelection)
    onSelect?.(newSelection)
  }, [selectedRows, onSelect])

  const toggleAllSelection = React.useCallback(() => {
    const newSelection = selectedRows.length === data.length ? [] : [...data]
    setSelectedRows(newSelection)
    onSelect?.(newSelection)
  }, [selectedRows, data, onSelect])

  return (
    <Card variant="elevated" padding="none" className={cn("overflow-hidden", className)}>
      {/* Table Header */}
      {(searchable || actions) && (
        <div className="flex items-center justify-between gap-4 p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {searchable && (
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="w-64"
              />
            )}
            <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {actions}
            <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className={cn(tableVariants({ variant, size }))}>
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={toggleAllSelection}
                    className="rounded border-border"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "text-left p-4 font-medium text-muted-foreground",
                    column.sortable && sortable && "cursor-pointer hover:text-foreground transition-colors",
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            "h-3 w-3",
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? "text-primary" 
                              : "text-muted-foreground/50"
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            "h-3 w-3",
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? "text-primary" 
                              : "text-muted-foreground/50"
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  {selectable && (
                    <td className="p-4">
                      <Skeleton className="h-4 w-4 rounded" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={String(column.key)} className="p-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                  <td className="p-4">
                    <Skeleton className="h-4 w-4 rounded" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + 1} 
                  className="p-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-4 w-4" />
                    </div>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "border-b border-border hover:bg-muted/50 transition-colors",
                    variant === "striped" && index % 2 === 1 && "bg-muted/25"
                  )}
                >
                  {selectable && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row)}
                        onChange={() => toggleRowSelection(row)}
                        className="rounded border-border"
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = row[column.key as keyof T]
                    return (
                      <td key={String(column.key)} className={cn("p-4", column.className)}>
                        {column.render ? column.render(value, row, index) : String(value || '')}
                      </td>
                    )
                  })}
                  <td className="p-4">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {data.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-border text-sm text-muted-foreground">
          <div>
            Showing {data.length} results
            {selectedRows.length > 0 && ` (${selectedRows.length} selected)`}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Badge variant="secondary">1</Badge>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export { ModernTable, tableVariants }
