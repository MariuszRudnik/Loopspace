"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImageIcon,
  Smile,
  Send,
  ArrowLeft,
  UserCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Przykładowe dane kursów
const courses = [
  { id: "1", name: "Wprowadzenie do programowania" },
  { id: "2", name: "Zaawansowany JavaScript" },
  { id: "3", name: "Podstawy UX/UI Design" },
]

// Przykładowe dane postów
const samplePosts = [
  {
    id: "1",
    author: {
      name: "Anna Kowalska",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Instruktor",
    },
    content:
      "Witajcie wszyscy w naszym kanale! Będziemy tutaj dzielić się ciekawymi materiałami, dyskutować o problemach i wspólnie się uczyć. Nie wahajcie się zadawać pytań i dzielić swoimi przemyśleniami!",
    timestamp: "2 godziny temu",
    likes: 12,
    comments: 3,
    shares: 2,
    commentsList: [
      {
        id: "c1",
        author: {
          name: "Piotr Nowak",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Świetna inicjatywa! Nie mogę się doczekać dyskusji.",
        timestamp: "1 godzina temu",
        likes: 3,
      },
      {
        id: "c2",
        author: {
          name: "Marta Wiśniewska",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Czy będziemy też omawiać najnowsze trendy w tej dziedzinie?",
        timestamp: "45 minut temu",
        likes: 1,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Jan Kowalski",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content:
      "Znalazłem świetny artykuł na temat tego, o czym rozmawialiśmy na ostatnich zajęciach. Polecam wszystkim: https://example.com/article",
    timestamp: "5 godzin temu",
    likes: 8,
    comments: 1,
    shares: 4,
    commentsList: [
      {
        id: "c3",
        author: {
          name: "Anna Kowalska",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Dziękuję za podzielenie się! To bardzo przydatne.",
        timestamp: "4 godziny temu",
        likes: 2,
      },
    ],
  },
  {
    id: "3",
    author: {
      name: "Tomasz Zieliński",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content:
      "Mam problem z zadaniem nr 3 z ostatnich ćwiczeń. Czy ktoś mógłby pomóc? Utknąłem na etapie implementacji algorytmu sortowania.",
    timestamp: "1 dzień temu",
    likes: 3,
    comments: 5,
    shares: 0,
    commentsList: [
      {
        id: "c4",
        author: {
          name: "Karolina Adamska",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Miałam podobny problem. Spróbuj użyć metody .sort() z odpowiednią funkcją porównującą.",
        timestamp: "23 godziny temu",
        likes: 4,
      },
      {
        id: "c5",
        author: {
          name: "Michał Wójcik",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: "Mogę Ci pomóc. Napisz do mnie na priv, to przejdziemy przez to razem.",
        timestamp: "22 godziny temu",
        likes: 2,
      },
    ],
  },
]

// Komponent pojedynczego komentarza
function Comment({ comment }: { comment: any }) {
  return (
    <div className="flex gap-2 mt-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg p-2">
          <div className="font-medium text-sm">{comment.author.name}</div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <button className="hover:text-primary">Lubię to! ({comment.likes})</button>
          <button className="hover:text-primary">Odpowiedz</button>
          <span>{comment.timestamp}</span>
        </div>
      </div>
    </div>
  )
}

// Komponent pojedynczego posta
function Post({ post }: { post: any }) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showAllComments, setShowAllComments] = useState(false)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dodawanie komentarza:", commentText)
    setCommentText("")
    setIsCommenting(false)
    // W rzeczywistej aplikacji tutaj byłoby dodawanie komentarza do bazy danych
  }

  // Pokaż tylko 2 komentarze, chyba że użytkownik kliknie "Pokaż wszystkie"
  const displayedComments = showAllComments ? post.commentsList : post.commentsList.slice(0, 2)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{post.author.role}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{post.timestamp}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Zapisz post</DropdownMenuItem>
              <DropdownMenuItem>Zgłoś post</DropdownMenuItem>
              <DropdownMenuItem>Ukryj post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-3">
        <div className="flex justify-between items-center w-full mb-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" /> {post.likes} osób lubi to
          </div>
          <div className="text-sm text-muted-foreground">
            {post.comments} komentarzy • {post.shares} udostępnień
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center w-full py-1">
          <Button variant="ghost" size="sm" className="flex-1">
            <Heart className="mr-2 h-4 w-4" /> Lubię to
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={() => setIsCommenting(!isCommenting)}>
            <MessageCircle className="mr-2 h-4 w-4" /> Komentarz
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" /> Udostępnij
          </Button>
        </div>

        {/* Sekcja komentarzy */}
        {post.commentsList.length > 0 && (
          <div className="mt-2 w-full">
            {post.commentsList.length > 2 && !showAllComments && (
              <button
                className="text-sm text-muted-foreground hover:text-primary mb-2"
                onClick={() => setShowAllComments(true)}
              >
                Zobacz wszystkie {post.comments} komentarze
              </button>
            )}

            {displayedComments.map((comment: any) => (
              <Comment key={comment.id} comment={comment} />
            ))}

            {showAllComments && (
              <button
                className="text-sm text-muted-foreground hover:text-primary mt-2"
                onClick={() => setShowAllComments(false)}
              >
                Pokaż mniej
              </button>
            )}
          </div>
        )}

        {/* Formularz dodawania komentarza */}
        {isCommenting && (
          <form onSubmit={handleSubmitComment} className="mt-3 w-full">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Twój avatar" />
                <AvatarFallback>JK</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  placeholder="Napisz komentarz..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="sm" disabled={!commentText.trim()}>
                    <Send className="mr-2 h-4 w-4" /> Wyślij
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  )
}

export default function FeedPage() {
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId

  // Znajdź kurs na podstawie ID z parametrów URL
  const course = courses.find((c) => c.id === courseId)
  const courseName = course ? course.name : "Kanał"

  const [postText, setPostText] = useState("")

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dodawanie posta:", postText)
    setPostText("")
    // W rzeczywistej aplikacji tutaj byłoby dodawanie posta do bazy danych
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dashboard/courses/${courseId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{courseName} - Feed</h1>
      </div>

      {/* Formularz dodawania posta */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmitPost}>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Twój avatar" />
                <AvatarFallback>JK</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-col gap-3">
                <Textarea
                  placeholder="Co słychać? Podziel się z innymi..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm">
                      <ImageIcon className="mr-2 h-4 w-4" /> Zdjęcie
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <Smile className="mr-2 h-4 w-4" /> Emoji
                    </Button>
                  </div>
                  <Button type="submit" disabled={!postText.trim()}>
                    Opublikuj
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista postów */}
      <div>
        {samplePosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {/* Sugestie osób do obserwowania */}
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Osoby, które możesz znać</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=U${i}`} />
                    <AvatarFallback>
                      <UserCircle2 />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Użytkownik {i}</div>
                    <div className="text-sm text-muted-foreground">Student</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Obserwuj
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
