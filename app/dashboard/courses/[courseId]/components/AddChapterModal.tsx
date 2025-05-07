"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { Loader2 } from "lucide-react"

// Schemat walidacji dla nowego rozdziału
const chapterSchema = z.object({
  title: z.string().min(3, "Tytuł musi mieć minimum 3 znaki").max(255, "Tytuł może mieć maksymalnie 255 znaków")
})

interface AddChapterModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  chapterName: string
  setChapterName: (name: string) => void
  onAddChapter: () => void
  courseId: string // Dodane courseId jako prop
}

export default function AddChapterModal({
  open,
  setOpen,
  chapterName,
  setChapterName,
  onAddChapter,
  courseId,
}: AddChapterModalProps) {
  const [validationError, setValidationError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Mutacja do dodawania nowego rozdziału
  const addChapterMutation = useMutation({
    mutationFn: async (title: string) => {
      // Walidacja przy użyciu Zod
      const result = chapterSchema.safeParse({ title })
      if (!result.success) {
        const errorMessage = result.error.errors[0]?.message || "Nieprawidłowe dane"
        setValidationError(errorMessage)
        throw new Error(errorMessage)
      }
      
      // Resetuj błąd walidacji jeśli wszystko OK
      setValidationError(null)
      
      // Wysyłamy żądanie do API
      const response = await fetch(`/api/chapters/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          // Możemy też automatycznie wyznaczyć kolejność (API to obsłuży)
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Błąd podczas dodawania rozdziału")
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Odśwież listę rozdziałów
      queryClient.invalidateQueries({ queryKey: ['chapters', courseId] })
      
      // Zamknij modal i wyczyść pole
      setOpen(false)
      setChapterName("")
      
      // Wywołaj callback z rodzica (opcjonalnie)
      onAddChapter()
    },
    onError: (error: Error) => {
      // Błędy są już obsłużone przez ustawienie validationError
      console.error("Błąd podczas dodawania rozdziału:", error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chapterName.trim()) {
      addChapterMutation.mutate(chapterName)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy rozdział</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chapter-name" className="text-right">
                Nazwa rozdziału
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="chapter-name"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  className={validationError ? "border-red-500" : ""}
                  placeholder="Wprowadź nazwę rozdziału"
                />
                {validationError && (
                  <p className="text-sm text-red-500">{validationError}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={addChapterMutation.isPending}
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              disabled={!chapterName.trim() || addChapterMutation.isPending}
            >
              {addChapterMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                'Zapisz'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
