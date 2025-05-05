"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronUp, ChevronDown } from "lucide-react"
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
          <h2 className="text-xl font-semibold">{chapter.title}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onAddLesson}>
          Dodaj lekcję do rozdziału
        </Button>
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
