import Link from "next/link"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseCardProps {
  course: {
    id: string
    name: string
    description: string
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{course.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-3">
        <div className="flex w-full items-center justify-between">
          <Link href={`/dashboard/courses/${course.id}/lessons`}>
            <Button variant="outline" size="sm">
              Lekcje
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
