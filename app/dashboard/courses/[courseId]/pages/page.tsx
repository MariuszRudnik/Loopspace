"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit, Save, MessageSquare, Send, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Przykładowe dane kursów
const courses = [
  { id: "1", name: "Wprowadzenie do programowania" },
  { id: "2", name: "Zaawansowany JavaScript" },
  { id: "3", name: "Podstawy UX/UI Design" },
]

// Przykładowy artykuł
const sampleArticle = {
  id: "1",
  title: "Wprowadzenie do programowania obiektowego",
  slug: "wprowadzenie-do-programowania-obiektowego",
  excerpt:
    "Programowanie obiektowe to paradygmat programowania, który wykorzystuje obiekty – instancje klas – do modelowania danych i zachowań. Poznaj podstawowe koncepcje OOP.",
  content: `
    <h2>Czym jest programowanie obiektowe?</h2>
    <p>Programowanie obiektowe (Object-Oriented Programming, OOP) to paradygmat programowania, który wykorzystuje koncepcję "obiektów" – struktur danych zawierających zarówno dane, jak i procedury do operowania na tych danych. Procedury te nazywane są metodami.</p>
    
    <h2>Podstawowe koncepcje OOP</h2>
    <h3>1. Klasy i obiekty</h3>
    <p>Klasa to szablon definiujący strukturę i zachowanie obiektów. Obiekt to instancja klasy, konkretny byt posiadający właściwości i metody zdefiniowane przez klasę.</p>
    <pre><code>
    class Samochod {
      constructor(marka, model, rok) {
        this.marka = marka;
        this.model = model;
        this.rok = rok;
      }
      
      wyswietlInfo() {
        return \`\${this.marka} \${this.model} (\${this.rok})\`;
      }
    }
    
    const mojSamochod = new Samochod("Toyota", "Corolla", 2020);
    console.log(mojSamochod.wyswietlInfo()); // Toyota Corolla (2020)
    </code></pre>
    
    <h3>2. Dziedziczenie</h3>
    <p>Dziedziczenie pozwala na tworzenie nowych klas na podstawie istniejących. Klasa pochodna (dziecko) dziedziczy właściwości i metody klasy bazowej (rodzica) i może je rozszerzać lub modyfikować.</p>
    <pre><code>
    class SamochodSportowy extends Samochod {
      constructor(marka, model, rok, przyspieszenie) {
        super(marka, model, rok);
        this.przyspieszenie = przyspieszenie;
      }
      
      wyswietlInfo() {
        return \`\${super.wyswietlInfo()}, Przyspieszenie: \${this.przyspieszenie}s (0-100km/h)\`;
      }
    }
    
    const mojSportowiec = new SamochodSportowy("Ferrari", "F8", 2021, 2.9);
    console.log(mojSportowiec.wyswietlInfo()); // Ferrari F8 (2021), Przyspieszenie: 2.9s (0-100km/h)
    </code></pre>
    
    <h3>3. Enkapsulacja</h3>
    <p>Enkapsulacja to mechanizm ukrywania szczegółów implementacji i udostępniania tylko niezbędnego interfejsu. Pozwala to na kontrolowanie dostępu do danych i zapewnia, że dane są używane w sposób bezpieczny.</p>
    <pre><code>
    class KontoBankowe {
      #saldo; // Prywatne pole (dostępne tylko wewnątrz klasy)
      
      constructor(poczatkoweSaldo) {
        this.#saldo = poczatkoweSaldo;
      }
      
      wplac(kwota) {
        if (kwota > 0) {
          this.#saldo += kwota;
          return true;
        }
        return false;
      }
      
      wyplac(kwota) {
        if (kwota > 0 && kwota <= this.#saldo) {
          this.#saldo -= kwota;
          return true;
        }
        return false;
      }
      
      sprawdzSaldo() {
        return this.#saldo;
      }
    }
    
    const mojeKonto = new KontoBankowe(1000);
    mojeKonto.wplac(500);
    console.log(mojeKonto.sprawdzSaldo()); // 1500
    // mojeKonto.#saldo = 1000000; // Błąd! Pole #saldo jest prywatne
    </code></pre>
    
    <h3>4. Polimorfizm</h3>
    <p>Polimorfizm pozwala na traktowanie obiektów różnych klas w jednolity sposób. Umożliwia to pisanie kodu, który może działać z obiektami różnych typów, o ile implementują one wymagany interfejs.</p>
    <pre><code>
    class Zwierze {
      wydajDzwiek() {
        return "Jakiś dźwięk";
      }
    }
    
    class Pies extends Zwierze {
      wydajDzwiek() {
        return "Hau hau!";
      }
    }
    
    class Kot extends Zwierze {
      wydajDzwiek() {
        return "Miau!";
      }
    }
    
    function odtworzDzwiek(zwierze) {
      console.log(zwierze.wydajDzwiek());
    }
    
    odtworzDzwiek(new Pies()); // Hau hau!
    odtworzDzwiek(new Kot()); // Miau!
    </code></pre>
    
    <h2>Zalety programowania obiektowego</h2>
    <ul>
      <li>Modularność – kod jest podzielony na niezależne moduły (klasy), co ułatwia zarządzanie i rozwój</li>
      <li>Wielokrotne użycie – klasy mogą być używane wielokrotnie w różnych częściach aplikacji</li>
      <li>Łatwość utrzymania – zmiany w jednej klasie nie wpływają na inne, o ile interfejs pozostaje niezmieniony</li>
      <li>Naturalne modelowanie – obiekty często odpowiadają rzeczywistym bytom, co ułatwia projektowanie</li>
    </ul>
    
    <h2>Podsumowanie</h2>
    <p>Programowanie obiektowe to potężny paradygmat, który pomaga organizować kod w sposób modularny i intuicyjny. Zrozumienie podstawowych koncepcji OOP – klas, obiektów, dziedziczenia, enkapsulacji i polimorfizmu – jest kluczowe dla efektywnego wykorzystania tego podejścia w tworzeniu oprogramowania.</p>
  `,
  author: {
    name: "Jan Kowalski",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Instruktor",
    isAdmin: true,
  },
  publishedAt: "2025-04-10T14:30:00Z",
  readTime: "8 min",
  tags: ["programowanie", "OOP", "podstawy"],
  comments: [
    {
      id: "c1",
      author: {
        name: "Anna Nowak",
        avatar: "/placeholder.svg?height=32&width=32",
        isAdmin: false,
      },
      content:
        "Świetny artykuł! Bardzo jasno wyjaśnione podstawy OOP. Czy planujesz napisać więcej na temat wzorców projektowych?",
      timestamp: "2025-04-10T15:45:00Z",
      likes: 5,
    },
    {
      id: "c2",
      author: {
        name: "Piotr Wiśniewski",
        avatar: "/placeholder.svg?height=32&width=32",
        isAdmin: false,
      },
      content:
        "Dziękuję za ten artykuł. Mam pytanie odnośnie enkapsulacji - czy w JavaScript prywatne pola z # są już dobrze wspierane przez przeglądarki?",
      timestamp: "2025-04-10T16:20:00Z",
      likes: 3,
    },
    {
      id: "c3",
      author: {
        name: "Jan Kowalski",
        avatar: "/placeholder.svg?height=32&width=32",
        isAdmin: true,
      },
      content:
        "Dziękuję za komentarze! @Anna - tak, planuję serię artykułów o wzorcach projektowych. @Piotr - prywatne pola są już dobrze wspierane w nowoczesnych przeglądarkach, ale warto używać Babela lub podobnych narzędzi dla kompatybilności wstecznej.",
      timestamp: "2025-04-10T17:10:00Z",
      likes: 7,
    },
  ],
}

// Komponent komentarza
function Comment({ comment, onLike }: { comment: any; onLike: (commentId: string) => void }) {
  // Formatowanie daty
  const formattedDate = new Date(comment.timestamp).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.author.name}</span>
          {comment.author.isAdmin && (
            <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900">
              Admin
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="mt-1 text-sm">{comment.content}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onLike(comment.id)}>
            <ThumbsUp className="mr-1 h-3 w-3" />
            Polub ({comment.likes})
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PagesPage() {
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId

  // Znajdź kurs na podstawie ID z parametrów URL
  const course = courses.find((c) => c.id === courseId)
  const courseName = course ? course.name : "Kanał"

  // Stan dla artykułu i komentarzy
  const [article, setArticle] = useState(sampleArticle)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(article.content)
  const [commentText, setCommentText] = useState("")

  // Symulacja sprawdzenia, czy użytkownik jest adminem
  const [currentUser] = useState({
    name: "Twoje Imię",
    avatar: "/placeholder.svg?height=32&width=32",
    isAdmin: true, // Zmień na false, aby zasymulować zwykłego użytkownika
  })

  // Formatowanie daty
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Funkcja do dodawania komentarza
  const handleAddComment = () => {
    if (!commentText.trim()) return

    const newComment = {
      id: `c${article.comments.length + 1}`,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        isAdmin: currentUser.isAdmin,
      },
      content: commentText,
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    setArticle((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }))
    setCommentText("")
  }

  // Funkcja do polubienia komentarza
  const handleLikeComment = (commentId: string) => {
    setArticle((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
      ),
    }))
  }

  // Funkcja do zapisywania zmian w artykule
  const handleSaveArticle = () => {
    setArticle((prev) => ({
      ...prev,
      content: editedContent,
    }))
    setIsEditing(false)
  }

  // Efekt do aktualizacji stanu edycji przy zmianie artykułu
  useEffect(() => {
    setEditedContent(article.content)
  }, [article])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/courses/${courseId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{courseName} - Artykuł</h1>
        </div>
        {currentUser.isAdmin && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edytuj artykuł
          </Button>
        )}
        {currentUser.isAdmin && isEditing && (
          <Button onClick={handleSaveArticle}>
            <Save className="mr-2 h-4 w-4" />
            Zapisz zmiany
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div>
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{article.author.name}</span>
                    <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900">
                      {article.author.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formattedDate} • {article.readTime} czytania
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Treść artykułu */}
          <div className="mb-8">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
              />
            ) : (
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}
          </div>

          {/* Sekcja komentarzy */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Komentarze
              <Badge variant="secondary">{article.comments.length}</Badge>
            </h2>

            <div className="mb-6">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Dodaj komentarz..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Dodaj komentarz
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="mt-4 space-y-1">
              {article.comments.map((comment) => (
                <div key={comment.id}>
                  <Comment comment={comment} onLike={handleLikeComment} />
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{article.comments.length} komentarzy</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
