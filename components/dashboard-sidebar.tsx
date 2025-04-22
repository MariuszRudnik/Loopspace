"use client"

import type React from "react"

import Link from "next/link"
import { BookOpen, Home, ChevronRight, CheckCircle, Circle, Plus } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useSidebarStore } from "@/lib/store"

// Przykładowe dane kursów
const courses = [
  { id: "1", name: "Wprowadzenie do programowania" },
  { id: "2", name: "Zaawansowany JavaScript" },
  { id: "3", name: "Podstawy UX/UI Design" },
]

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

// Komponent modalu do dodawania nowej podstrony
function AddPageModal({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false)
  const [pageType, setPageType] = useState("lessons")
  const [pageName, setPageName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dodawanie nowej podstrony:", { courseId, pageType, pageName })
    // Tutaj byłoby wywołanie API do dodania nowej podstrony
    setOpen(false)
    setPageName("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start px-3 py-1 text-sm">
          <Plus className="mr-2 h-4 w-4" />
          Dodaj podstronę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową podstronę</DialogTitle>
          <DialogDescription>Wybierz typ podstrony i nadaj jej nazwę. Kliknij Dodaj, gdy skończysz.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="page-type" className="text-right">
                Typ
              </Label>
              <Select value={pageType} onValueChange={setPageType}>
                <SelectTrigger id="page-type" className="col-span-3">
                  <SelectValue placeholder="Wybierz typ podstrony" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lessons">Lekcje</SelectItem>
                  <SelectItem value="feed">Feed</SelectItem>
                  <SelectItem value="events">Eventy</SelectItem>
                  <SelectItem value="discussions">Rozmowy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="page-name" className="text-right">
                Nazwa
              </Label>
              <Input
                id="page-name"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="col-span-3"
                placeholder="Wprowadź nazwę podstrony"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!pageName.trim()}>
              Dodaj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function DashboardSidebar() {
  const { open, openMobile, isMobile, setOpenMobile, openChapters, toggleChapter } = useSidebarStore()
  const pathname = usePathname()

  // Check if we're on a lessons page
  const isLessonsPage = pathname?.includes("/lessons")

  // Check if we're on a specific lesson page
  const isSpecificLessonPage = pathname?.match(/\/courses\/(\d+)\/lessons\/(\d+)/)

  // Extract courseId and lessonId if we're on a specific lesson page
  const courseId = isSpecificLessonPage ? isSpecificLessonPage[1] : null
  const lessonId = isSpecificLessonPage ? isSpecificLessonPage[2] : null

  // Find the current course
  const currentCourse = courses.find((c) => c.id === courseId)

  // Initialize chapters as open by default when first viewing a lesson
  useEffect(() => {
    if (isSpecificLessonPage && lessonId) {
      // Find which chapter contains this lesson
      const chapterWithLesson = chapters.find((chapter) => chapter.lessons.some((lesson) => lesson.id === lessonId))

      if (chapterWithLesson && openChapters[chapterWithLesson.id] === undefined) {
        // If this is the first time seeing this chapter and it contains the current lesson,
        // open it by default
        toggleChapter(chapterWithLesson.id)
      }
    }
  }, [isSpecificLessonPage, lessonId, openChapters, toggleChapter])

  // Sidebar content that's shared between mobile and desktop
  const SidebarContent = () => (
    <>
      <div className="flex flex-col gap-4 p-4">
        {isSpecificLessonPage ? (
          // Show course-specific navigation when on a lesson page
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-2">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-sm font-semibold">{currentCourse?.name || "Kurs"}</h2>
            </div>

            <div className="flex flex-col gap-2">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="flex flex-col gap-1">
                  <div
                    className="flex items-center gap-2 px-3 py-1 text-sm font-medium cursor-pointer hover:bg-muted rounded-md"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${openChapters[chapter.id] ? "rotate-90" : ""}`}
                    />
                    <span>{chapter.title}</span>
                  </div>
                  {openChapters[chapter.id] && (
                    <div className="ml-6 flex flex-col gap-1 border-l pl-2">
                      {chapter.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                          className={`rounded-md px-3 py-1 text-sm ${
                            lesson.id === lessonId ? "bg-muted font-medium" : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{lesson.title}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              {lesson.completed ? (
                                <>
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Ukończono</span>
                                </>
                              ) : (
                                <>
                                  <Circle className="h-3 w-3" />
                                  <span>Nieukończono</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Show regular dashboard navigation when not on a lesson page
          <>
            <div className="flex flex-col gap-1">
              <Link href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </div>

            <div className="py-2">
              <h2 className="mb-2 px-3 text-lg font-semibold tracking-tight">Twoje kursy</h2>
              <div className="flex flex-col gap-1">
                {courses.map((course) => (
                  <div key={course.id} className="flex flex-col">
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.name}</span>
                    </div>
                    <div className="ml-6 flex flex-col gap-1 border-l pl-2">
                      <Link
                        href={`/dashboard/courses/${course.id}/lessons`}
                        className="rounded-md px-3 py-1 text-sm hover:bg-muted"
                      >
                        Lekcje
                      </Link>
                      <Link
                        href={`/dashboard/courses/${course.id}/feed`}
                        className="rounded-md px-3 py-1 text-sm hover:bg-muted"
                        prefetch={true}
                        onClick={(e) => {
                          // Ensure navigation works properly
                          console.log(`Navigating to feed for course ${course.id}`)
                        }}
                      >
                        Podstrona Feed
                      </Link>
                      <Link
                        href={`/dashboard/courses/${course.id}/events`}
                        className="rounded-md px-3 py-1 text-sm hover:bg-muted"
                      >
                        Event
                      </Link>
                      <Link
                        href={`/dashboard/courses/${course.id}/pages`}
                        className="rounded-md px-3 py-1 text-sm hover:bg-muted"
                      >
                        Pages
                      </Link>
                      <AddPageModal courseId={course.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )

  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[250px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop sidebar
  return (
    <div className={`border-r bg-background transition-all duration-300 ${open ? "w-[250px]" : "w-0 overflow-hidden"}`}>
      <SidebarContent />
    </div>
  )
}
