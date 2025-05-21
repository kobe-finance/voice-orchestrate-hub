
import { ArrowLeft, Save, Plus, Folder } from "lucide-react"
import { Link } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FlowHeaderProps {
  flowName: string;
  setFlowName: Dispatch<SetStateAction<string>>;
  onSave: () => void;
  unsavedChanges: boolean;
  onBack: () => void;
}

export function FlowHeader({ flowName, setFlowName, onSave, unsavedChanges, onBack }: FlowHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3 h-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Input 
            className="h-9 w-auto max-w-[200px] font-medium bg-transparent focus-visible:bg-background"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
          />
          {unsavedChanges && <span className="text-xs text-muted-foreground">(Unsaved changes)</span>}
        </div>
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
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </header>
  )
}
