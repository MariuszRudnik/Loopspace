"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface AddPageModalProps {
  courseId: string
}

export default function AddPageModal({ courseId }: AddPageModalProps) {
  const [open, setOpen] = useState(false)
  const [pageName, setPageName] = useState("")
  const queryClient = useQueryClient()

  const addCourseMutation = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          channelId: courseId,
        }),
      })
      if (!res.ok) {
        throw new Error("Nie udało się dodać kursu")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      setOpen(false)
      setPageName("")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCourseMutation.mutate({ title: pageName })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start px-3 py-1 text-sm">
          Dodaj nową podstronę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową podstronę</DialogTitle>
          <DialogDescription>
            W tej chwili możesz dodać tylko kurs. Inne opcje będą dostępne w przyszłości.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="page-type" className="text-right">
                Typ
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="text-muted-foreground">Kurs</span>
              </div>
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
                placeholder="Wprowadź nazwę kursu"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!pageName.trim() || addCourseMutation.isPending}>
              Dodaj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
