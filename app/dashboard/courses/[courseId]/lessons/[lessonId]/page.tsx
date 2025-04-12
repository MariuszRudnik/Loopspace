"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"

// Przykładowe dane rozdziałów/lekcji
const chapters = [
  {
    id: "1",
    title: "Wprowadzenie do kursu",
    lessons: [
      { id: "1", title: "Powitanie i omówienie programu", completed: true },
      { id: "2", title: "Jak korzystać z platformy", completed: true },
    ],
  },
  {
    id: "2",
    title: "Podstawy teoretyczne",
    lessons: [
      { id: "3", title: "Kluczowe pojęcia", completed: true },
      { id: "4", title: "Historia i rozwój dziedziny", completed: false },
    ],
  },
  {
    id: "3",
    title: "Praktyczne zastosowania",
    lessons: [
      { id: "5", title: "Studium przypadku #1", completed: false },
      { id: "6", title: "Ćwiczenia praktyczne", completed: false },
      { id: "7", title: "Projekt grupowy", completed: false },
    ],
  },
]

// Przykładowe dane lekcji
const lessonsData = [
  {
    id: "1",
    title: "Powitanie i omówienie programu",
    content: `
      <h2>Witamy w kursie!</h2>
      <p>W tej lekcji omówimy cały program kursu i przedstawimy, czego się nauczysz w kolejnych modułach.</p>
      <h3>Cele kursu</h3>
      <ul>
        <li>Zrozumienie podstawowych koncepcji</li>
        <li>Nabycie praktycznych umiejętności</li>
        <li>Przygotowanie do samodzielnej pracy</li>
      </ul>
      <p>Kurs składa się z części teoretycznej oraz praktycznej. W części teoretycznej poznasz najważniejsze pojęcia i koncepcje, natomiast w części praktycznej będziesz mógł zastosować zdobytą wiedzę w praktyce.</p>
    `,
    completed: true,
  },
  {
    id: "2",
    title: "Jak korzystać z platformy",
    content: `
      <h2>Korzystanie z platformy edukacyjnej</h2>
      <p>W tej lekcji dowiesz się, jak efektywnie korzystać z naszej platformy edukacyjnej.</p>
      <h3>Funkcje platformy</h3>
      <ul>
        <li>Przeglądanie materiałów</li>
        <li>Wykonywanie zadań</li>
        <li>Udział w dyskusjach</li>
        <li>Śledzenie postępów</li>
      </ul>
      <p>Platforma została zaprojektowana tak, aby zapewnić Ci jak najlepsze doświadczenie edukacyjne. Znajdziesz tu wszystkie potrzebne materiały, zadania oraz możliwość interakcji z innymi uczestnikami kursu.</p>
    `,
    completed: true,
  },
  {
    id: "3",
    title: "Kluczowe pojęcia",
    content: `
      <h2>Kluczowe pojęcia</h2>
      <p>W tej lekcji poznasz najważniejsze pojęcia, które będą używane w trakcie całego kursu.</p>
      <h3>Słownik pojęć</h3>
      <dl>
        <dt>Pojęcie 1</dt>
        <dd>Definicja pojęcia 1 i jego zastosowanie w praktyce.</dd>
        <dt>Pojęcie 2</dt>
        <dd>Definicja pojęcia 2 i jego zastosowanie w praktyce.</dd>
        <dt>Pojęcie 3</dt>
        <dd>Definicja pojęcia 3 i jego zastosowanie w praktyce.</dd>
      </dl>
      <p>Zrozumienie tych pojęć jest kluczowe dla dalszej nauki i praktycznego zastosowania wiedzy z kursu.</p>
    `,
    completed: true,
  },
  {
    id: "4",
    title: "Historia i rozwój dziedziny",
    content: `
      <h2>Historia i rozwój dziedziny</h2>
      <p>W tej lekcji poznasz historię i rozwój dziedziny, której dotyczy kurs.</p>
      <h3>Kamienie milowe</h3>
      <ol>
        <li>Początki dziedziny - lata 50. XX wieku</li>
        <li>Rozwój w latach 70. i 80.</li>
        <li>Rewolucja lat 90.</li>
        <li>Współczesne trendy i kierunki rozwoju</li>
      </ol>
      <p>Zrozumienie historycznego kontekstu pomoże Ci lepiej zrozumieć obecny stan dziedziny i przewidywać przyszłe trendy.</p>
    `,
    completed: false,
  },
  {
    id: "5",
    title: "Studium przypadku #1",
    content: `
      <h2>Studium przypadku #1</h2>
      <p>W tej lekcji przeanalizujemy pierwszy przypadek praktyczny, który pomoże Ci zrozumieć zastosowanie teorii w praktyce.</p>
      <h3>Opis przypadku</h3>
      <p>Firma XYZ stanęła przed wyzwaniem... [opis problemu]</p>
      <h3>Analiza</h3>
      <p>Analizując sytuację, możemy zauważyć następujące kluczowe czynniki:</p>
      <ul>
        <li>Czynnik 1 i jego wpływ</li>
        <li>Czynnik 2 i jego wpływ</li>
        <li>Czynnik 3 i jego wpływ</li>
      </ul>
      <h3>Rozwiązanie</h3>
      <p>Firma XYZ zdecydowała się na... [opis rozwiązania]</p>
      <h3>Wnioski</h3>
      <p>Z tego przypadku możemy wyciągnąć następujące wnioski...</p>
    `,
    completed: false,
  },
  {
    id: "6",
    title: "Ćwiczenia praktyczne",
    content: `
      <h2>Ćwiczenia praktyczne</h2>
      <p>W tej lekcji wykonasz serię ćwiczeń praktycznych, które pomogą Ci utrwalić zdobytą wiedzę.</p>
      <h3>Ćwiczenie 1</h3>
      <p>Instrukcje do ćwiczenia 1...</p>
      <h3>Ćwiczenie 2</h3>
      <p>Instrukcje do ćwiczenia 2...</p>
      <h3>Ćwiczenie 3</h3>
      <p>Instrukcje do ćwiczenia 3...</p>
      <p>Po wykonaniu wszystkich ćwiczeń, będziesz miał solidne podstawy praktyczne, które będziesz mógł wykorzystać w projekcie końcowym.</p>
    `,
    completed: false,
  },
  {
    id: "7",
    title: "Projekt grupowy",
    content: `
      <h2>Projekt grupowy</h2>
      <p>W tej lekcji dowiesz się, jak będzie wyglądał projekt grupowy, który będzie zwieńczeniem kursu.</p>
      <h3>Cele projektu</h3>
      <p>Głównym celem projektu jest...</p>
      <h3>Wymagania</h3>
      <ul>
        <li>Wymaganie 1</li>
        <li>Wymaganie 2</li>
        <li>Wymaganie 3</li>
      </ul>
      <h3>Harmonogram</h3>
      <ol>
        <li>Etap 1: Planowanie (1 tydzień)</li>
        <li>Etap 2: Implementacja (2 tygodnie)</li>
        <li>Etap 3: Testowanie (1 tydzień)</li>
        <li>Etap 4: Prezentacja (1 dzień)</li>
      </ol>
      <p>Projekt grupowy pozwoli Ci zastosować wszystkie zdobyte umiejętności w praktycznym kontekście oraz nauczy Cię pracy zespołowej.</p>
    `,
    completed: false,
  },
]

// Przykładowe dane kursów
const courses = [
  { id: "1", name: "Wprowadzenie do programowania" },
  { id: "2", name: "Zaawansowany JavaScript" },
  { id: "3", name: "Podstawy UX/UI Design" },
]

// Funkcja do znajdowania poprzedniej i następnej lekcji
function findAdjacentLessons(currentLessonId: string) {
  // Spłaszczona lista wszystkich lekcji
  const allLessons = chapters.flatMap((chapter) => chapter.lessons)

  // Znajdź indeks bieżącej lekcji
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === currentLessonId)

  if (currentIndex === -1) return { prev: null, next: null }

  // Znajdź poprzednią lekcję (jeśli istnieje)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null

  // Znajdź następną lekcję (jeśli istnieje)
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return { prev: prevLesson, next: nextLesson }
}

export default function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  // Znajdź kurs i lekcję na podstawie ID z parametrów URL
  const course = courses.find((c) => c.id === params.courseId)
  const lessonData = lessonsData.find((l) => l.id === params.lessonId)

  // Stan ukończenia lekcji
  const [isCompleted, setIsCompleted] = useState(lessonData?.completed || false)

  // Znajdź poprzednią i następną lekcję
  const { prev, next } = findAdjacentLessons(params.lessonId)

  // Funkcja do przełączania stanu ukończenia lekcji
  const toggleCompletion = () => {
    setIsCompleted(!isCompleted)
    // W rzeczywistej aplikacji tutaj byłoby wywołanie API do zapisania stanu
    console.log(`Lekcja ${params.lessonId} oznaczona jako ${!isCompleted ? "ukończona" : "nieukończona"}`)
  }

  if (!lessonData) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Nie znaleziono lekcji</h1>
        <p className="mt-2 text-muted-foreground">Lekcja o podanym ID nie istnieje.</p>
        <Link href={`/dashboard/courses/${params.courseId}/lessons`} className="mt-4">
          <Button>Powrót do listy lekcji</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/courses/${params.courseId}/lessons`}>
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
            <Link href={`/dashboard/courses/${params.courseId}/lessons/${prev.id}`}>
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
            onClick={toggleCompletion}
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
            <Link href={`/dashboard/courses/${params.courseId}/lessons/${next.id}`}>
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
