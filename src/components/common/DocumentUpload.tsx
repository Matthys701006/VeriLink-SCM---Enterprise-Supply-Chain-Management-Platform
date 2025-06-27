
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Trash2, FileText, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

interface DocumentUploadProps {
  entityId: string
  entityType: string
  documents: Document[]
  onDocumentUploaded?: (document: Document) => void
  onDocumentDeleted?: (documentId: string) => void
}

export function DocumentUpload({
  entityId,
  entityType,
  documents,
  onDocumentUploaded,
  onDocumentDeleted
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        // Mock upload - in real implementation would upload to Supabase Storage
        const mockDocument: Document = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date()
        }

        toast({
          title: "Document Uploaded",
          description: `${file.name} has been uploaded successfully`,
        })

        onDocumentUploaded?.(mockDocument)
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleDownload = (document: Document) => {
    const link = window.document.createElement('a')
    link.href = document.url
    link.download = document.name
    link.click()
  }

  const handleDelete = (documentId: string) => {
    onDocumentDeleted?.(documentId)
    toast({
      title: "Document Deleted",
      description: "Document has been removed",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${entityId}`}
          />
          <Button
            onClick={() => window.document.getElementById(`file-upload-${entityId}`)?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Documents"}
          </Button>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(document.size)}</span>
                      <Badge variant="outline">{document.type}</Badge>
                      <span>{document.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {documents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
