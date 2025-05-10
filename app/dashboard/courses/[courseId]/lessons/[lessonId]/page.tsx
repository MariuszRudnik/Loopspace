"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

// ...existing mock data...

// Pomocnicza funkcja do znalezienia poprzedniej i następnej lekcji
function findAdjacentLessons(lessons: any[], lessonId: string) {
  const idx = lessons.findIndex((l) => l.id === lessonId)
  return {
    prev: idx > 0 ? lessons[idx - 1] : null,
    next: idx !== -1 && idx < lessons.length - 1 ? lessons[idx + 1] : null,
  }
}

export default function LessonPage() {
  // Rozpakowanie params z hooka useParams (zgodnie z nowym API Next.js)
  const params = useParams() as { courseId: string; lessonId: string }
  const courseId = params.courseId
  const lessonId = params.lessonId

  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  // Pobierz listę kursów
  const { data: coursesData, isLoading } = useQuery<{data: any[]}>({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      if (!res.ok) {
        throw new Error("Błąd pobierania kursów")
      }
      return res.json()
    }
  })

  // Pobierz listę lekcji (jeśli lessonsData nie jest mockiem)
  // const { data: lessonsData } = useQuery<{data: any[]}>({
  //   queryKey: ["lessons", courseId],
  //   queryFn: async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/lessons`)
  //     if (!res.ok) {
  //       throw new Error("Błąd pobierania lekcji")
  //     }
  //     return res.json()
  //   }
  // })

  // Sprawdź czy użytkownik ma dostęp do kursu
  useEffect(() => {
    if (coursesData?.data) {
      const courseExists = coursesData.data.some(course => course.id === courseId)
      setHasAccess(courseExists)
    }
  }, [coursesData, courseId])

  // Znajdź kurs i lekcję na podstawie ID z parametrów URL
  const course = coursesData?.data?.find((c) => c.id === courseId)
  // Jeśli lessonsData jest mockiem, użyj go, jeśli nie - pobierz z API jak wyżej
  // const lessonData = lessonsData?.data?.find((l) => l.id === lessonId)
  const lessonData = typeof lessonsData !== "undefined"
    ? lessonsData.find((l: any) => l.id === lessonId)
    : undefined

  // Stan ukończenia lekcji
  const [isCompleted, setIsCompleted] = useState(lessonData?.completed || false)

  // Znajdź poprzednią i następną lekcję
  // Dodaj obsługę, gdy lessonsData nie istnieje
  const lessonsList = typeof lessonsData !== "undefined" ? lessonsData : []
  const { prev, next } = findAdjacentLessons(lessonsList, lessonId)

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Ładowanie...</h1>
      </div>
    )
  }

  if (hasAccess === false) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Brak uprawnień</h1>
        <p className="mt-2 text-muted-foreground">Nie masz dostępu do tego kursu.</p>
        <Link href="/dashboard" className="mt-4">
          <Button>Powrót do dashboardu</Button>
        </Link>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Nie znaleziono lekcji</h1>
        <p className="mt-2 text-muted-foreground">Lekcja o podanym ID nie istnieje.</p>
        <Link href={`/dashboard/courses/${courseId}/lessons`} className="mt-4">
          <Button>Powrót do listy lekcji</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/courses/${courseId}/lessons`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{lessonData.title}</h1>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: lessonData.content }} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {prev ? (
            <Link href={`/dashboard/courses/${courseId}/lessons/${prev.id}`}>
              <Button variant="outline">Poprzednia lekcja</Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Poprzednia lekcja
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Button
            variant={isCompleted ? "default" : "outline"}
            className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={() => {
              setIsCompleted(!isCompleted)
              console.log(`Lekcja ${lessonId} oznaczona jako ${!isCompleted ? "ukończona" : "nieukończona"}`)
            }}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Oznacz jako nieukończoną
              </>
            ) : (
              <>
                <Circle className="mr-2 h-4 w-4" />
                Oznacz jako ukończoną
              </>
            )}
          </Button>

          {next ? (
            <Link href={`/dashboard/courses/${courseId}/lessons/${next.id}`}>
              <Button variant="outline">Następna lekcja</Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Następna lekcja
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
