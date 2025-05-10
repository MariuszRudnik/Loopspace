"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronUp, ChevronDown, Pencil, Trash2, Check, X } from "lucide-react"
import LessonItem from "./LessonItem"

interface ChapterItemProps {
  chapter: {
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      content?: string
    }>
  }
  chapterIndex: number
  courseId: string
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onAddLesson: () => void
  onEditLesson: (chapterIndex: number, lessonIndex: number) => void
  onMoveLessonUp: (chapterIndex: number, lessonIndex: number) => void
  onMoveLessonDown: (chapterIndex: number, lessonIndex: number) => void
}

export default function ChapterItem({
  chapter,
  chapterIndex,
  courseId,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onAddLesson,
  onEditLesson,
  onMoveLessonUp,
  onMoveLessonDown,
}: ChapterItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(chapter.title)
  const queryClient = useQueryClient()

  const updateChapterMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const res = await fetch(`/api/chapters/edit/${chapter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      })
      if (!res.ok) {
        throw new Error("Błąd podczas edycji rozdziału")
      }
      return res.json()
    },
    onSuccess: () => {
      setIsEditing(false)
      // Odśwież listę rozdziałów po edycji
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] })
    },
  })

  const deleteChapterMutation = useMutation({
    mutationFn: async () => {
      // Poprawny endpoint dla usuwania rozdziału to /api/chapters/edit/[id] (zgodnie z Twoją strukturą API)
      const res = await fetch(`/api/chapters/edit/${chapter.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        throw new Error("Błąd podczas usuwania rozdziału")
      }
      return res.json()
    },
    onSuccess: () => {
      // Odśwież listę rozdziałów po usunięciu
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] })
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Przesuń rozdział w górę</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Przesuń rozdział w dół</span>
            </Button>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-2 py-1 text-base"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                autoFocus
              />
              <Button
                size="icon"
                variant="outline"
                aria-label="Zapisz"
                onClick={() => updateChapterMutation.mutate(editTitle)}
                disabled={updateChapterMutation.isPending}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Anuluj"
                onClick={() => {
                  setIsEditing(false)
                  setEditTitle(chapter.title)
                }}
                disabled={updateChapterMutation.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h2 className="text-xl font-semibold">{chapter.title}</h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Edytuj rozdział"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            aria-label="Usuń rozdział"
            onClick={() => deleteChapterMutation.mutate()}
            disabled={deleteChapterMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onAddLesson}>
            Dodaj lekcję do rozdziału
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        {chapter.lessons.length > 0 ? (
          chapter.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              lessonIndex={lessonIndex}
              chapterIndex={chapterIndex}
              courseId={courseId}
              totalLessons={chapter.lessons.length}
              onEditLesson={onEditLesson}
              onMoveUp={onMoveLessonUp}
              onMoveDown={onMoveLessonDown}
            />
          ))
        ) : (
          <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
            <div>
              <p>Ten rozdział nie ma jeszcze żadnych lekcji.</p>
              <Button variant="link" onClick={onAddLesson} className="mt-2">
                Dodaj pierwszą lekcję
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

