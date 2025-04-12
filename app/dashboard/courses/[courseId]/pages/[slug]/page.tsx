import { redirect } from "next/navigation"

export default function ArticlePage({ params }: { params: { courseId: string; slug: string } }) {
  // Przekieruj do strony artykułu w głównym widoku
  redirect(`/dashboard/courses/${params.courseId}/pages`)
  return null
}
