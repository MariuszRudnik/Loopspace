"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditLessonModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  editedLessonName: string
  setEditedLessonName: (name: string) => void
  editedLessonContent: string
  setEditedLessonContent: (content: string) => void
  chapterTitle: string
  onSaveLesson: () => void
}

export default function EditLessonModal({
  open,
  setOpen,
  editedLessonName,
  setEditedLessonName,
  editedLessonContent,
  setEditedLessonContent,
  chapterTitle,
  onSaveLesson,
}: EditLessonModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Edytuj lekcję
            {chapterTitle && (
              <span className="font-normal text-muted-foreground text-sm block mt-1">
                w rozdziale: {chapterTitle}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] pr-1">
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-lesson-name" className="text-right">
                Nazwa lekcji
              </Label>
              <Input
                id="edit-lesson-name"
                value={editedLessonName}
                onChange={(e) => setEditedLessonName(e.target.value)}
                className="col-span-3"
                placeholder="Wprowadź nazwę lekcji"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="edit-lesson-content">Zawartość lekcji (HTML)</Label>
              <Textarea
                id="edit-lesson-content"
                value={editedLessonContent}
                onChange={(e) => setEditedLessonContent(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="<h2>Tytuł lekcji</h2><p>Treść lekcji...</p>"
              />
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Podgląd zawartości:</h3>
              <div
                className="prose max-w-none dark:prose-invert border rounded-md p-4 bg-white dark:bg-gray-900"
                dangerouslySetInnerHTML={{ __html: editedLessonContent }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={onSaveLesson} disabled={!editedLessonName.trim()}>
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
