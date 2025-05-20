import { Plus, Folder } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

// Add a button to the menu section of the header that links to the document management page
// This will allow users to easily navigate to the knowledge base from the conversation flow builder

export function FlowHeader() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3 h-16">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Share
        </Button>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="outline" size="sm">
          Import
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/document-management">
            <Folder className="h-4 w-4 mr-1" />
            Knowledge Base
          </Link>
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Node
        </Button>
      </div>
    </header>
  )
}
