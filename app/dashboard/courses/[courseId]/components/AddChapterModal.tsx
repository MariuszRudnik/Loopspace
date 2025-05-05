"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddChapterModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  chapterName: string
  setChapterName: (name: string) => void
  onAddChapter: () => void
}

export default function AddChapterModal({
  open,
  setOpen,
  chapterName,
  setChapterName,
  onAddChapter,
}: AddChapterModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={onAddChapter} disabled={!chapterName.trim()}>
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
