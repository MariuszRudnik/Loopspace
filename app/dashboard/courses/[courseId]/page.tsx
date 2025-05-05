"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import AddChapterModal from "./components/AddChapterModal"
import AddLessonModal from "./components/AddLessonModal"
import EditLessonModal from "./components/EditLessonModal"
import ChapterItem from "./components/ChapterItem"
import EmptyChaptersMessage from "./components/EmptyChaptersMessage"
import { useQuery } from "@tanstack/react-query"

const initialChapters = [
  {
    id: "1",
    title: "Wprowadzenie do kursu",
    lessons: [
      {
        id: "1",
        title: "Powitanie i omówienie programu",
        content:
          "<h2>Witamy w kursie!</h2><p>W tej lekcji omówimy cały program kursu i przedstawimy, czego się nauczysz w kolejnych modułach.</p>",
      },
      {
        id: "2",
        title: "Jak korzystać z platformy",
        content:
          "<h2>Korzystanie z platformy</h2><p>W tej lekcji dowiesz się, jak efektywnie korzystać z naszej platformy edukacyjnej.</p>",
      },
    ],
  },
  {
    id: "2",
    title: "Podstawy teoretyczne",
    lessons: [
      {
        id: "3",
        title: "Kluczowe pojęcia",
        content:
          "<h2>Kluczowe pojęcia</h2><p>W tej lekcji poznasz najważniejsze pojęcia, które będą używane w trakcie całego kursu.</p>",
      },
      {
        id: "4",
        title: "Historia i rozwój dziedziny",
        content:
          "<h2>Historia i rozwój dziedziny</h2><p>W tej lekcji poznasz historię i rozwój dziedziny, której dotyczy kurs.</p>",
      },
    ],
  },
  {
    id: "3",
    title: "Praktyczne zastosowania",
    lessons: [
      {
        id: "5",
        title: "Studium przypadku #1",
        content:
          "<h2>Studium przypadku #1</h2><p>W tej lekcji przeanalizujemy pierwszy przypadek praktyczny, który pomoże Ci zrozumieć zastosowanie teorii w praktyce.</p>",
      },
      {
        id: "6",
        title: "Ćwiczenia praktyczne",
        content:
          "<h2>Ćwiczenia praktyczne</h2><p>W tej lekcji wykonasz serię ćwiczeń praktycznych, które pomogą Ci utrwalić zdobytą wiedz��.</p>",
      },
      {
        id: "7",
        title: "Projekt grupowy",
        content:
          "<h2>Projekt grupowy</h2><p>W tej lekcji dowiesz się, jak będzie wyglądał projekt grupowy, który będzie zwieńczeniem kursu.</p>",
      },
    ],
  },
]

// Przykładowe dane kursów do pobrania nazwy kursu
const courses = [
  { id: "1", name: "Wprowadzenie do programowania" },
  { id: "2", name: "Zaawansowany JavaScript" },
  { id: "3", name: "Podstawy UX/UI Design" },
]

export default function CourseLessonsPage({ params: serverParams }: { params: { courseId: string } }) {
  // Używamy hooka useParams zamiast bezpośredniego dostępu do params.courseId
  const params = useParams()
  const courseId = params.courseId as string

  // Dodajemy zapytanie Tanstack Query do pobierania listy rozdziałów
  const { data: chaptersData, isLoading } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/chapters/${courseId}`);
      if (!res.ok) {
        throw new Error('Problem z pobraniem rozdziałów');
      }
      const data = await res.json();
      console.log('Pobrane rozdziały:', data);
      return data;
    }
  });

  const course = courses.find((c) => c.id === courseId)
  const courseName = course ? course.name : "Kurs"

  // Stan dla modali
  const [openChapterModal, setOpenChapterModal] = useState(false)
  const [openLessonModal, setOpenLessonModal] = useState(false)
  const [openEditLessonModal, setOpenEditLessonModal] = useState(false)
  
  // Stan dla danych formularzy
  const [chapterName, setChapterName] = useState("")
  const [lessonName, setLessonName] = useState("")
  const [lessonContent, setLessonContent] = useState("")
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null)
  const [editedLessonName, setEditedLessonName] = useState("")
  const [editedLessonContent, setEditedLessonContent] = useState("")
  const [editingLessonInfo, setEditingLessonInfo] = useState<{
    chapterIndex: number
    lessonIndex: number
  } | null>(null)

  // Stan dla rozdziałów - używamy danych z API jeśli są dostępne, w przeciwnym razie korzystamy z danych mockowych
  const [chapters, setChapters] = useState(initialChapters)

  // Po załadowaniu danych z API, aktualizujemy stan rozdziałów
  useEffect(() => {
    if (chaptersData?.data) {
      setChapters(chaptersData.data);
    }
  }, [chaptersData]);

  // Funkcje obsługujące operacje CRUD
  const handleAddChapter = () => {
    if (chapterName.trim()) {
      console.log("Dodawanie rozdziału:", chapterName)
      // Tutaj byłaby logika dodawania rozdziału do bazy danych
      setOpenChapterModal(false)
      setChapterName("")
    }
  }

  const handleAddLesson = () => {
    if (lessonName.trim() && currentChapterIndex !== null) {
      console.log(`Dodawanie lekcji "${lessonName}" do rozdziału "${chapters[currentChapterIndex].title}"`)

      const newChapters = [...chapters]
      const newLessonId = `lesson-${Date.now()}`
      newChapters[currentChapterIndex].lessons.push({
        id: newLessonId,
        title: lessonName,
        content: lessonContent || "<p>Treść lekcji</p>",
      })
      setChapters(newChapters)

      setOpenLessonModal(false)
      setLessonName("")
      setLessonContent("")
      setCurrentChapterIndex(null)
    }
  }

  const openAddLessonModal = (chapterIndex: number) => {
    setCurrentChapterIndex(chapterIndex)
    setLessonName("")
    setLessonContent("")
    setOpenLessonModal(true)
  }

  const handleOpenEditLessonModal = (chapterIndex: number, lessonIndex: number) => {
    const lesson = chapters[chapterIndex].lessons[lessonIndex]
    setEditingLessonInfo({ chapterIndex, lessonIndex })
    setEditedLessonName(lesson.title)
    setEditedLessonContent(lesson.content || "")
    setOpenEditLessonModal(true)
  }

  const handleSaveEditedLesson = () => {
    if (editedLessonName.trim() && editingLessonInfo) {
      const { chapterIndex, lessonIndex } = editingLessonInfo
      console.log(`Edycja lekcji z "${chapters[chapterIndex].lessons[lessonIndex].title}" na "${editedLessonName}"`)

      const newChapters = [...chapters]
      newChapters[chapterIndex].lessons[lessonIndex].title = editedLessonName
      newChapters[chapterIndex].lessons[lessonIndex].content = editedLessonContent
      setChapters(newChapters)

      setOpenEditLessonModal(false)
      setEditedLessonName("")
      setEditedLessonContent("")
      setEditingLessonInfo(null)
    }
  }

  // Funkcje do zmiany kolejności
  const moveChapterUp = (index: number) => {
    if (index > 0) {
      const newChapters = [...chapters]
      const temp = newChapters[index]
      newChapters[index] = newChapters[index - 1]
      newChapters[index - 1] = temp
      setChapters(newChapters)
    }
  }

  const moveChapterDown = (index: number) => {
    if (index < chapters.length - 1) {
      const newChapters = [...chapters]
      const temp = newChapters[index]
      newChapters[index] = newChapters[index + 1]
      newChapters[index + 1] = temp
      setChapters(newChapters)
    }
  }

  const moveLessonUp = (chapterIndex: number, lessonIndex: number) => {
    if (lessonIndex > 0) {
      const newChapters = [...chapters]
      const temp = newChapters[chapterIndex].lessons[lessonIndex]
      newChapters[chapterIndex].lessons[lessonIndex] = newChapters[chapterIndex].lessons[lessonIndex - 1]
      newChapters[chapterIndex].lessons[lessonIndex - 1] = temp
      setChapters(newChapters)
    }
  }

  const moveLessonDown = (chapterIndex: number, lessonIndex: number) => {
    if (lessonIndex < chapters[chapterIndex].lessons.length - 1) {
      const newChapters = [...chapters]
      const temp = newChapters[chapterIndex].lessons[lessonIndex]
      newChapters[chapterIndex].lessons[lessonIndex] = newChapters[chapterIndex].lessons[lessonIndex + 1]
      newChapters[chapterIndex].lessons[lessonIndex + 1] = temp
      setChapters(newChapters)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{courseName}</h1>
        <Button onClick={() => setOpenChapterModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj rozdział
        </Button>
      </div>

      {/* Wskaźnik ładowania podczas pobierania danych */}
      {isLoading && (
        <div className="text-center py-4">
          <p>Ładowanie rozdziałów...</p>
        </div>
      )}

      {/* Modały */}
      <AddChapterModal
        open={openChapterModal}
        setOpen={setOpenChapterModal}
        chapterName={chapterName}
        setChapterName={setChapterName}
        onAddChapter={handleAddChapter}
      />

      <AddLessonModal
        open={openLessonModal}
        setOpen={setOpenLessonModal}
        lessonName={lessonName}
        setLessonName={setLessonName}
        lessonContent={lessonContent}
        setLessonContent={setLessonContent}
        currentChapterTitle={currentChapterIndex !== null ? chapters[currentChapterIndex]?.title : ""}
        onAddLesson={handleAddLesson}
      />

      <EditLessonModal
        open={openEditLessonModal}
        setOpen={setOpenEditLessonModal}
        editedLessonName={editedLessonName}
        setEditedLessonName={setEditedLessonName}
        editedLessonContent={editedLessonContent}
        setEditedLessonContent={setEditedLessonContent}
        chapterTitle={editingLessonInfo ? chapters[editingLessonInfo.chapterIndex]?.title : ""}
        onSaveLesson={handleSaveEditedLesson}
      />

      {/* Lista rozdziałów */}
      <div className="space-y-8">
        {chapters.map((chapter, chapterIndex) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            chapterIndex={chapterIndex}
            courseId={courseId} // Użycie courseId zamiast params.courseId
            isFirst={chapterIndex === 0}
            isLast={chapterIndex === chapters.length - 1}
            onMoveUp={() => moveChapterUp(chapterIndex)}
            onMoveDown={() => moveChapterDown(chapterIndex)}
            onAddLesson={() => openAddLessonModal(chapterIndex)}
            onEditLesson={handleOpenEditLessonModal}
            onMoveLessonUp={moveLessonUp}
            onMoveLessonDown={moveLessonDown}
          />
        ))}
      </div>

      {/* Komunikat o braku rozdziałów */}
      {chapters.length === 0 && (
        <EmptyChaptersMessage onAddChapter={() => setOpenChapterModal(true)} />
      )}
    </div>
  )
}
