"use client";

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CourseCard from "@/components/course-card"
import { useQuery } from "@tanstack/react-query"

export default function ChannelsList() {
  const { data: channels, isLoading, error } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/channels/list")
      if (!res.ok) {
        throw new Error("Błąd podczas pobierania kanałów")
      }
      return res.json()
    },
  })

  if (isLoading) return <div>Ładowanie...</div>
  if (error) return <div>Błąd: {(error as Error).message}</div>

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategorie</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj nowy kanał
        </Button>
      </div>

      {(!channels || channels.length === 0)
        ? (
            <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h2 className="text-2xl font-semibold">Nie masz jeszcze żadnych kanałów</h2>
              <p className="mt-2 text-muted-foreground">
                Rozpocznij swoją przygodę edukacyjną dodając swój pierwszy kanał.
              </p>
              <Button className="mt-6">
                <PlusCircle className="mr-2 h-4 w-4" />
                Dodaj pierwszy kanał
              </Button>
            </div>
          )
        : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((channel: any) => (
                <CourseCard key={channel.id} course={channel} />
              ))}
            </div>
          )
      }
    </>
  )
}
