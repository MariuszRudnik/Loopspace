"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddLessonModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  lessonName: string
  setLessonName: (name: string) => void
  lessonContent: string
  setLessonContent: (content: string) => void
  currentChapterTitle: string
  onAddLesson: () => void
}

export default function AddLessonModal({
  open,
  setOpen,
  lessonName,
  setLessonName,
  lessonContent,
  setLessonContent,
  currentChapterTitle,
  onAddLesson,
}: AddLessonModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Dodaj nową lekcję
            {currentChapterTitle && (
              <span className="font-normal text-muted-foreground text-sm block mt-1">
                do rozdziału: {currentChapterTitle}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] pr-1">
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-name" className="text-right">
                Nazwa lekcji
              </Label>
              <Input
                id="lesson-name"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                className="col-span-3"
                placeholder="Wprowadź nazwę lekcji"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="lesson-content">Zawartość lekcji (HTML)</Label>
              <Textarea
                id="lesson-content"
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="<h2>Tytuł lekcji</h2><p>Treść lekcji...</p>"
              />
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Podgląd zawartości:</h3>
              <div
                className="prose max-w-none dark:prose-invert border rounded-md p-4 bg-white dark:bg-gray-900"
                dangerouslySetInnerHTML={{ __html: lessonContent }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={onAddLesson} disabled={!lessonName.trim()}>
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
