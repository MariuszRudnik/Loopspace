"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { z } from "zod"

interface EditLessonModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  editedLessonName: string
  setEditedLessonName: (name: string) => void
  editedLessonContent: string
  setEditedLessonContent: (content: string) => void
  chapterTitle: string
  lessonId?: string | null
  onSaveLesson: () => void
}

const lessonSchema = z.object({
  title: z.string().min(3, "Nazwa lekcji musi mieć co najmniej 3 znaki"),
  content: z.string().min(1, "Zawartość lekcji nie może być pusta"),
})

export default function EditLessonModal({
  open,
  setOpen,
  editedLessonName,
  setEditedLessonName,
  editedLessonContent,
  setEditedLessonContent,
  chapterTitle,
  lessonId,
  onSaveLesson,
}: EditLessonModalProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  // PUT: aktualizacja lekcji
  const updateMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!lessonId) throw new Error("Brak ID lekcji")
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || "Błąd podczas aktualizacji lekcji")
      }
      return res.json()
    },
    onSuccess: () => {
      setOpen(false)
      setError(null)
      queryClient.invalidateQueries({ queryKey: ["chapters"] })
    },
    onError: (err: any) => {
      setError(err.message || "Błąd podczas aktualizacji lekcji")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!lessonId) throw new Error("Brak ID lekcji")
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || "Błąd podczas usuwania lekcji")
      }
      return res.json()
    },
    onSuccess: () => {
      setOpen(false)
      setError(null)
      queryClient.invalidateQueries({ queryKey: ["chapters"] })
    },
    onError: (err: any) => {
      setError(err.message || "Błąd podczas usuwania lekcji")
    },
  })

  const handleDelete = () => {
    setError(null)
    if (!lessonId) {
      setError("Brak ID lekcji")
      return
    }
    deleteMutation.mutate()
  }

  const handleSave = () => {
    setError(null)
    const validation = lessonSchema.safeParse({ title: editedLessonName, content: editedLessonContent })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }
    updateMutation.mutate({ title: editedLessonName, content: editedLessonContent })
  }

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
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </div>
        <DialogFooter className="flex flex-col w-full gap-4 justify-between">
          <div>
            {lessonId && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className=""
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Usuwanie..." : "Usuń lekcję"}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Anuluj
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!editedLessonName.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
