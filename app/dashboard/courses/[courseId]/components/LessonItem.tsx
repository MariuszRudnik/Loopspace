"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LessonItemProps {
  lesson: {
    id: string
    title: string
    content?: string
  }
  lessonIndex: number
  chapterIndex: number
  courseId: string
  totalLessons: number
  onEditLesson: (chapterIndex: number, lessonIndex: number) => void
  onMoveUp: (chapterIndex: number, lessonIndex: number) => void
  onMoveDown: (chapterIndex: number, lessonIndex: number) => void
}

export default function LessonItem({
  lesson,
  lessonIndex,
  chapterIndex,
  courseId,
  totalLessons,
  onEditLesson,
  onMoveUp,
  onMoveDown,
}: LessonItemProps) {
  const router = useRouter();

  const handlePreview = () => {
    console.log("Podgląd lekcji, id:", lesson.id);
    // Poprawny adres do podglądu lekcji: /dashboard/courses/[courseId]/lessons/[lessonId]
    router.push(`/dashboard/courses/${courseId}/lessons/${lesson.id}`);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 ${
        lessonIndex !== totalLessons - 1 ? "border-b" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col mr-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMoveUp(chapterIndex, lessonIndex)}
            disabled={lessonIndex === 0}
          >
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">Przesuń lekcję w górę</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMoveDown(chapterIndex, lessonIndex)}
            disabled={lessonIndex === totalLessons - 1}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Przesuń lekcję w dół</span>
          </Button>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {lessonIndex + 1}
        </span>
        <span>{lesson.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditLesson(chapterIndex, lessonIndex)}
        >
          Edytuj
        </Button>
        {/*<Button*/}
        {/*  variant="ghost"*/}
        {/*  size="sm"*/}
        {/*  onClick={handlePreview}*/}
        {/*>*/}
        {/*  Podgląd*/}
        {/*</Button>*/}
      </div>
    </div>
  )
}

