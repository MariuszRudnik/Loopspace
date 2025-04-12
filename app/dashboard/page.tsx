import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CourseCard from "@/components/course-card"

// Przykładowe dane kursów/kanałów
const courses = [
  {
    id: "1",
    name: "Wprowadzenie do programowania",
    description: "Podstawy programowania dla początkujących. Poznaj fundamenty i rozpocznij swoją przygodę z kodem.",
  },
  {
    id: "2",
    name: "Zaawansowany JavaScript",
    description: "Poznaj zaawansowane koncepcje JavaScript, asynchroniczność, ES6+ i nowoczesne frameworki.",
  },
  {
    id: "3",
    name: "Podstawy UX/UI Design",
    description: "Naucz się projektować intuicyjne i atrakcyjne interfejsy użytkownika.",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategorie</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj nowy kanał
        </Button>
      </div>

      {courses.length === 0 ? (
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
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
