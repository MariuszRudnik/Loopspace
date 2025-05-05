"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface EmptyChaptersMessageProps {
  onAddChapter: () => void
}

export default function EmptyChaptersMessage({ onAddChapter }: EmptyChaptersMessageProps) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <h2 className="text-2xl font-semibold">Ten kurs nie ma jeszcze żadnych rozdziałów</h2>
      <p className="mt-2 text-muted-foreground">Rozpocznij tworzenie kursu dodając pierwszy rozdział.</p>
      <Button className="mt-6" onClick={onAddChapter}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Dodaj pierwszy rozdział
      </Button>
    </div>
  )
}
