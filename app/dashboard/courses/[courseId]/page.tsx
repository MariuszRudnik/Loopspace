"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Przykładowe dane rozdziałów/lekcji
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
          "<h2>Ćwiczenia praktyczne</h2><p>W tej lekcji wykonasz serię ćwiczeń praktycznych, które pomogą Ci utrwalić zdobytą wiedzę.</p>",
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

export default function CourseLessonsPage({ params }: { params: { courseId: string } }) {
  // Znajdź kurs na podstawie ID z parametrów URL
  const course = courses.find((c) => c.id === params.courseId)
  const courseName = course ? course.name : "Kurs"

  // Stan dla modalu dodawania rozdziału
  const [openChapterModal, setOpenChapterModal] = useState(false)
  const [chapterName, setChapterName] = useState("")

  // Stan dla modalu dodawania lekcji
  const [openLessonModal, setOpenLessonModal] = useState(false)
  const [lessonName, setLessonName] = useState("")
  const [lessonContent, setLessonContent] = useState("")
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null)

  // Stan dla modalu edycji lekcji
  const [openEditLessonModal, setOpenEditLessonModal] = useState(false)
  const [editedLessonName, setEditedLessonName] = useState("")
  const [editedLessonContent, setEditedLessonContent] = useState("")
  const [editingLessonInfo, setEditingLessonInfo] = useState<{
    chapterIndex: number
    lessonIndex: number
  } | null>(null)
  // const [activeTab, setActiveTab] = useState("basic")

  // Stan dla rozdziałów (teraz możemy je modyfikować)
  const [chapters, setChapters] = useState(initialChapters)

  // Funkcja do dodawania nowego rozdziału
  const handleAddChapter = () => {
    if (chapterName.trim()) {
      console.log("Dodawanie rozdziału:", chapterName)
      // Tutaj byłaby logika dodawania rozdziału do bazy danych
      // Po dodaniu rozdziału, zamknij modal i wyczyść pole
      setOpenChapterModal(false)
      setChapterName("")
    }
  }

  // Funkcja do dodawania nowej lekcji do rozdziału
  const handleAddLesson = () => {
    if (lessonName.trim() && currentChapterIndex !== null) {
      console.log(`Dodawanie lekcji "${lessonName}" do rozdziału "${chapters[currentChapterIndex].title}"`)

      // Tutaj byłaby logika dodawania lekcji do bazy danych
      // W tym przykładzie dodajemy lekcję lokalnie do stanu
      const newChapters = [...chapters]
      const newLessonId = `lesson-${Date.now()}`
      newChapters[currentChapterIndex].lessons.push({
        id: newLessonId,
        title: lessonName,
        content: lessonContent || "<p>Treść lekcji</p>",
      })
      setChapters(newChapters)

      // Zamknij modal i wyczyść pole
      setOpenLessonModal(false)
      setLessonName("")
      setLessonContent("")
      setCurrentChapterIndex(null)
    }
  }

  // Funkcja do otwierania modalu dodawania lekcji
  const openAddLessonModal = (chapterIndex: number) => {
    setCurrentChapterIndex(chapterIndex)
    setLessonName("")
    setLessonContent("")
    setOpenLessonModal(true)
  }

  // Funkcja do otwierania modalu edycji lekcji
  const handleOpenEditLessonModal = (chapterIndex: number, lessonIndex: number) => {
    const lesson = chapters[chapterIndex].lessons[lessonIndex]
    setEditingLessonInfo({ chapterIndex, lessonIndex })
    setEditedLessonName(lesson.title)
    setEditedLessonContent(lesson.content || "")
    // setActiveTab("basic")
    setOpenEditLessonModal(true)
  }

  // Funkcja do zapisywania edytowanej lekcji
  const handleSaveEditedLesson = () => {
    if (editedLessonName.trim() && editingLessonInfo) {
      const { chapterIndex, lessonIndex } = editingLessonInfo
      console.log(`Edycja lekcji z "${chapters[chapterIndex].lessons[lessonIndex].title}" na "${editedLessonName}"`)

      // Tutaj byłaby logika aktualizacji lekcji w bazie danych
      // W tym przykładzie aktualizujemy lekcję lokalnie w stanie
      const newChapters = [...chapters]
      newChapters[chapterIndex].lessons[lessonIndex].title = editedLessonName
      newChapters[chapterIndex].lessons[lessonIndex].content = editedLessonContent
      setChapters(newChapters)

      // Zamknij modal i wyczyść stan
      setOpenEditLessonModal(false)
      setEditedLessonName("")
      setEditedLessonContent("")
      setEditingLessonInfo(null)
    }
  }

  // Funkcja do przesuwania rozdziału w górę
  const moveChapterUp = (index: number) => {
    if (index > 0) {
      const newChapters = [...chapters]
      const temp = newChapters[index]
      newChapters[index] = newChapters[index - 1]
      newChapters[index - 1] = temp
      setChapters(newChapters)
    }
  }

  // Funkcja do przesuwania rozdziału w dół
  const moveChapterDown = (index: number) => {
    if (index < chapters.length - 1) {
      const newChapters = [...chapters]
      const temp = newChapters[index]
      newChapters[index] = newChapters[index + 1]
      newChapters[index + 1] = temp
      setChapters(newChapters)
    }
  }

  // Funkcja do przesuwania lekcji w górę
  const moveLessonUp = (chapterIndex: number, lessonIndex: number) => {
    if (lessonIndex > 0) {
      const newChapters = [...chapters]
      const temp = newChapters[chapterIndex].lessons[lessonIndex]
      newChapters[chapterIndex].lessons[lessonIndex] = newChapters[chapterIndex].lessons[lessonIndex - 1]
      newChapters[chapterIndex].lessons[lessonIndex - 1] = temp
      setChapters(newChapters)
    }
  }

  // Funkcja do przesuwania lekcji w dół
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
        <Dialog open={openChapterModal} onOpenChange={setOpenChapterModal}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj rozdział
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy rozdział</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapter-name" className="text-right">
                  Nazwa rozdziału
                </Label>
                <Input
                  id="chapter-name"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  className="col-span-3"
                  placeholder="Wprowadź nazwę rozdziału"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenChapterModal(false)}>
                Anuluj
              </Button>
              <Button onClick={handleAddChapter} disabled={!chapterName.trim()}>
                Zapisz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal dodawania lekcji */}
      <Dialog open={openLessonModal} onOpenChange={setOpenLessonModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Dodaj nową lekcję
              {currentChapterIndex !== null && (
                <span className="font-normal text-muted-foreground text-sm block mt-1">
                  do rozdziału: {chapters[currentChapterIndex]?.title}
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
            <Button variant="outline" onClick={() => setOpenLessonModal(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddLesson} disabled={!lessonName.trim()}>
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal edycji lekcji */}
      <Dialog open={openEditLessonModal} onOpenChange={setOpenEditLessonModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Edytuj lekcję
              {editingLessonInfo && (
                <span className="font-normal text-muted-foreground text-sm block mt-1">
                  w rozdziale: {chapters[editingLessonInfo.chapterIndex]?.title}
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
            <Button variant="outline" onClick={() => setOpenEditLessonModal(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSaveEditedLesson} disabled={!editedLessonName.trim()}>
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveChapterUp(chapterIndex)}
                    disabled={chapterIndex === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span className="sr-only">Przesuń rozdział w górę</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveChapterDown(chapterIndex)}
                    disabled={chapterIndex === chapters.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Przesuń rozdział w dół</span>
                  </Button>
                </div>
                <h2 className="text-xl font-semibold">{chapter.title}</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => openAddLessonModal(chapterIndex)}>
                Dodaj lekcję do rozdziału
              </Button>
            </div>
            <div className="rounded-md border">
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 ${
                    lessonIndex !== chapter.lessons.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col mr-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveLessonUp(chapterIndex, lessonIndex)}
                        disabled={lessonIndex === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                        <span className="sr-only">Przesuń lekcję w górę</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveLessonDown(chapterIndex, lessonIndex)}
                        disabled={lessonIndex === chapter.lessons.length - 1}
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
                      onClick={() => handleOpenEditLessonModal(chapterIndex, lessonIndex)}
                    >
                      Edytuj
                    </Button>
                    <Link href={`/dashboard/courses/${params.courseId}/lessons/${lesson.id}`}>
                      <Button variant="ghost" size="sm">
                        Podgląd
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {chapters.length === 0 ? (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-2xl font-semibold">Ten kurs nie ma jeszcze żadnych lekcji</h2>
          <p className="mt-2 text-muted-foreground">Rozpocznij tworzenie kursu dodając pierwszą lekcję.</p>
          <Button className="mt-6">
            <PlusCircle className="mr-2 h-4 w-4" />
            Dodaj pierwszą lekcję
          </Button>
        </div>
      ) : null}
    </div>
  )
}
