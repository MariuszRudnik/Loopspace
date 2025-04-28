'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CourseCard from "@/components/course-card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [channelName, setChannelName] = useState('')
  const [channelDescription, setChannelDescription] = useState('')

  const queryClient = useQueryClient()

  const { data: channelsList } = useQuery<any[], Error, any[], ["channels"]>({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/channels/list")
      if (!res.ok) {
        throw new Error("Błąd pobierania kanałów")
      }
      return res.json()
    },
  })

  const addChannelMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string, description: string }) => {
      const res = await fetch("http://localhost:3000/api/channels/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      })
      if (!res.ok) {
        throw new Error("Błąd dodawania kanału")
      }
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channels"] }) // zmienione
      setModalOpen(false)
      setChannelName('')
      setChannelDescription('')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addChannelMutation.mutate({ name: channelName, description: channelDescription })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kanały</h1>
        <Button onClick={() => setModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj nowy kanał
        </Button>
      </div>

      {(!channelsList || channelsList.length === 0) ? (
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
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {channelsList.map((channel) => (
            <CourseCard key={channel.id} course={channel} />
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-4">Dodaj nowy kanał</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="channel-name" className="block mb-1">Nazwa</label>
                <input
                  id="channel-name"
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="channel-description" className="block mb-1">Opis</label>
                <input
                  id="channel-description"
                  type="text"
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  Zapisz
                </Button>
              </div>
            </form>
            <button onClick={() => setModalOpen(false)} className="mt-4 text-sm text-blue-500 underline">
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
