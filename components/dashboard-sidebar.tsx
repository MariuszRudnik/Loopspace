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
import { useQuery } from "@tanstack/react-query"
import AddPageModal from "@/components/AddPageModal"
const API_URL = process.env.NEXT_PUBLIC_API_URL

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

export default function DashboardSidebar() {
  const { open, openMobile, isMobile, setOpenMobile, openChapters, toggleChapter } = useSidebarStore()
  const pathname = usePathname()

  const { data: channelsList } = useQuery<any[], Error, any[], ["channels"]>({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/channels/list`)
      if (!res.ok) {
        throw new Error("Błąd pobierania kanałów")
      }
      return res.json()
    },
  })
  console.log(channelsList)

  const isSpecificLessonPage = pathname?.match(/\/channels\/(\d+)\/lessons\/(\d+)/)
  const channelId = isSpecificLessonPage ? isSpecificLessonPage[1] : null
  const lessonId = isSpecificLessonPage ? isSpecificLessonPage[2] : null

  const currentChannel = channelsList?.find((c) => c.id === channelId)

  useEffect(() => {
    if (isSpecificLessonPage && lessonId) {
      const chapterWithLesson = chapters.find((chapter) =>
        chapter.lessons.some((lesson) => lesson.id === lessonId)
      )
      if (chapterWithLesson && openChapters[chapterWithLesson.id] === undefined) {
        toggleChapter(chapterWithLesson.id)
      }
    }
  }, [isSpecificLessonPage, lessonId, openChapters, toggleChapter])

  const SidebarContent = () => (
    <>
      <div className="flex flex-col gap-4 p-4">
        {isSpecificLessonPage ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-2">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-sm font-semibold">{currentChannel?.dname || "Kanał"}</h2>
            </div>
            {chapters.map((chapter) => (
              <div key={chapter.id} className="flex flex-col gap-1">
                <div
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium cursor-pointer hover:bg-muted rounded-md"
                  onClick={() => toggleChapter(chapter.id)}
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${openChapters[chapter.id] ? "rotate-90" : ""}`} />
                  <span>{chapter.title}</span>
                </div>
                {openChapters[chapter.id] && (
                  <div className="ml-6 flex flex-col gap-1 border-l pl-2">
                    {chapter.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/dashboard/channels/${channelId}/lessons/${lesson.id}`}
                        className={`rounded-md px-3 py-1 text-sm ${lesson.id === lessonId ? "bg-muted font-medium" : "hover:bg-muted"}`}
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
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <Link href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </div>
            <div className="py-2">
              <h2 className="mb-2 px-3 text-lg font-semibold tracking-tight">Twoje kanały</h2>
              <div className="flex flex-col gap-1">
                {channelsList?.map((channel) => (
                  <div key={channel.id} className="flex flex-col">
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium">
                      <BookOpen className="h-4 w-4" />
                      <span>{channel.name}</span>
                    </div>
                    <div className="ml-6 flex flex-col gap-1 border-l pl-2">
                    {/*tu będzie lista lekcji*/}

                      <AddPageModal courseId={channel.id} />
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

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[250px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={`border-r bg-background transition-all duration-300 ${open ? "w-[250px]" : "w-0 overflow-hidden"}`}>
      <SidebarContent />
    </div>
  )
}

