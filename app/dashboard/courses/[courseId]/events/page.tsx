"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Filter,
  Search,
  CheckCircle,
  CalendarDays,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Przykładowe dane kursów
const courses = [
  { id: "1", name: "Wprowadzenie do programowania" },
  { id: "2", name: "Zaawansowany JavaScript" },
  { id: "3", name: "Podstawy UX/UI Design" },
]

// Przykładowe dane wydarzeń
const sampleEvents = [
  {
    id: "1",
    title: "Warsztaty programowania",
    description:
      "Praktyczne warsztaty programowania, podczas których będziemy rozwiązywać rzeczywiste problemy i implementować rozwiązania w czasie rzeczywistym.",
    date: "2025-05-15",
    time: "18:00 - 20:00",
    location: "Online (Zoom)",
    organizer: {
      name: "Anna Kowalska",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Instruktor",
    },
    participants: 12,
    maxParticipants: 20,
    isRegistered: false,
    type: "workshop",
    tags: ["programowanie", "praktyka", "warsztaty"],
  },
  {
    id: "2",
    title: "Webinar: Najnowsze trendy w branży",
    description:
      "Webinar poświęcony najnowszym trendom w branży. Omówimy aktualne technologie, narzędzia i metodologie, które zyskują na popularności.",
    date: "2025-05-20",
    time: "19:00 - 20:30",
    location: "Online (YouTube Live)",
    organizer: {
      name: "Jan Nowak",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Ekspert branżowy",
    },
    participants: 45,
    maxParticipants: 100,
    isRegistered: true,
    type: "webinar",
    tags: ["trendy", "technologie", "webinar"],
  },
  {
    id: "3",
    title: "Spotkanie integracyjne uczestników kursu",
    description:
      "Nieformalne spotkanie uczestników kursu, podczas którego będziemy mogli się lepiej poznać, wymienić doświadczeniami i nawiązać kontakty.",
    date: "2025-05-25",
    time: "17:00 - 19:00",
    location: "Kawiarnia 'Programista', ul. Kodowa 15, Warszawa",
    organizer: {
      name: "Piotr Wiśniewski",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Koordynator kursu",
    },
    participants: 8,
    maxParticipants: 15,
    isRegistered: false,
    type: "meetup",
    tags: ["integracja", "networking", "spotkanie"],
  },
]

export default function EventsPage() {
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId

  // Znajdź kurs na podstawie ID z parametrów URL
  const course = courses.find((c) => c.id === courseId)
  const courseName = course ? course.name : "Kanał"

  // Stan dla wydarzeń
  const [events, setEvents] = useState(sampleEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [openEventDetailsModal, setOpenEventDetailsModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [openCreateEventModal, setOpenCreateEventModal] = useState(false)
  const [newEventData, setNewEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 20,
    type: "workshop",
    tags: "",
  })

  // Funkcja do zapisywania się na wydarzenie
  const handleRegister = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, isRegistered: true, participants: event.participants + 1 } : event,
      ),
    )
  }

  // Funkcja do otwierania modalu ze szczegółami wydarzenia
  const handleOpenEventDetails = (event: any) => {
    setSelectedEvent(event)
    setOpenEventDetailsModal(true)
  }

  // Funkcja do tworzenia nowego wydarzenia
  const handleCreateEvent = () => {
    const newEvent = {
      id: `${events.length + 1}`,
      ...newEventData,
      participants: 0,
      isRegistered: false,
      organizer: {
        name: "Ty",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Organizator",
      },
      tags: newEventData.tags.split(",").map((tag) => tag.trim()),
    }
    setEvents((prevEvents) => [newEvent, ...prevEvents])
    setOpenCreateEventModal(false)
    setNewEventData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxParticipants: 20,
      type: "workshop",
      tags: "",
    })
  }

  // Funkcja do aktualizacji danych nowego wydarzenia
  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEventData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Filtrowanie wydarzeń
  const filteredEvents = events.filter((event) => {
    // Filtrowanie według wyszukiwania
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filtrowanie według zakładki
    if (activeTab === "all") return matchesSearch
    if (activeTab === "registered") return matchesSearch && event.isRegistered
    if (activeTab === "upcoming") {
      const eventDate = new Date(event.date)
      const today = new Date()
      return matchesSearch && eventDate >= today
    }
    if (activeTab === "past") {
      const eventDate = new Date(event.date)
      const today = new Date()
      return matchesSearch && eventDate < today
    }

    return matchesSearch
  })

  // Komponent karty wydarzenia
  const EventCard = ({ event }: { event: any }) => {
    // Formatowanie daty
    const formattedDate = new Date(event.date).toLocaleDateString("pl-PL", { dateStyle: "long" })

    // Określenie statusu wydarzenia (pełne, zapisany, dostępne)
    let statusBadge
    if (event.isRegistered) {
      statusBadge = (
        <Badge className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="mr-1 h-3 w-3" /> Zapisany/a
        </Badge>
      )
    } else if (event.participants >= event.maxParticipants) {
      statusBadge = <Badge variant="outline">Brak miejsc</Badge>
    } else {
      statusBadge = <Badge variant="outline">Dostępne miejsca</Badge>
    }

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>
                {formattedDate} • {event.time}
              </CardDescription>
            </div>
            {statusBadge}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{event.organizer.name}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {event.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.participants}/{event.maxParticipants} uczestników
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-primary" onClick={() => handleOpenEventDetails(event)}>
              Zobacz szczegóły
            </Button>
            {!event.isRegistered && event.participants < event.maxParticipants && (
              <Button size="sm" onClick={() => handleRegister(event.id)}>
                Zapisz się
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/courses/${courseId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{courseName} - Wydarzenia</h1>
        </div>
        <Button onClick={() => setOpenCreateEventModal(true)}>
          <Calendar className="mr-2 h-4 w-4" /> Utwórz wydarzenie
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Wyszukiwarka i filtry */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Szukaj wydarzeń..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filtry
          </Button>
        </div>

        {/* Zakładki */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">Wszystkie</TabsTrigger>
            <TabsTrigger value="registered">Zapisane</TabsTrigger>
            <TabsTrigger value="upcoming">Nadchodzące</TabsTrigger>
            <TabsTrigger value="past">Minione</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Brak wydarzeń</h3>
                  <p className="text-muted-foreground mt-1">
                    Nie znaleziono żadnych wydarzeń pasujących do wybranych kryteriów.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="registered" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Brak zapisanych wydarzeń</h3>
                  <p className="text-muted-foreground mt-1">
                    Nie jesteś zapisany/a na żadne wydarzenia. Przeglądaj dostępne wydarzenia i zapisz się na te, które
                    Cię interesują.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Brak nadchodzących wydarzeń</h3>
                  <p className="text-muted-foreground mt-1">
                    Nie ma żadnych nadchodzących wydarzeń. Sprawdź ponownie później lub utwórz własne wydarzenie.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Brak minionych wydarzeń</h3>
                  <p className="text-muted-foreground mt-1">
                    Nie ma żadnych minionych wydarzeń w historii. Gdy wydarzenia się zakończą, będą widoczne tutaj.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal ze szczegółami wydarzenia */}
      <Dialog open={openEventDetailsModal} onOpenChange={setOpenEventDetailsModal}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Organizowane przez {selectedEvent.organizer.name} ({selectedEvent.organizer.role})
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString("pl-PL", { dateStyle: "long" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedEvent.participants}/{selectedEvent.maxParticipants} uczestników
                    </span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="mb-2 font-medium">Opis wydarzenia</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Tagi</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedEvent.type === "workshop" && (
                  <div>
                    <h4 className="mb-2 font-medium">Co należy przygotować</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Własny laptop z zainstalowanym środowiskiem programistycznym</li>
                      <li>Podstawowa znajomość języka programowania</li>
                      <li>Dostęp do stabilnego łącza internetowego</li>
                    </ul>
                  </div>
                )}
                <Separator />
                <div>
                  <h4 className="mb-2 font-medium">Uczestnicy ({selectedEvent.participants})</h4>
                  <ScrollArea className="h-[100px]">
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: selectedEvent.participants }).map((_, i) => (
                        <Avatar key={i} className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=U${i}`} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                {selectedEvent.isRegistered ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Jesteś zapisany/a na to wydarzenie</span>
                  </div>
                ) : selectedEvent.participants >= selectedEvent.maxParticipants ? (
                  <Button disabled>Brak miejsc</Button>
                ) : (
                  <Button onClick={() => handleRegister(selectedEvent.id)}>Zapisz się</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal tworzenia wydarzenia */}
      <Dialog open={openCreateEventModal} onOpenChange={setOpenCreateEventModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Utwórz nowe wydarzenie</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby utworzyć nowe wydarzenie dla uczestników kursu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm">
                Tytuł
              </label>
              <Input
                id="title"
                name="title"
                value={newEventData.title}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm">
                Opis
              </label>
              <Input
                id="description"
                name="description"
                value={newEventData.description}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm">
                Data
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newEventData.date}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right text-sm">
                Czas
              </label>
              <Input
                id="time"
                name="time"
                placeholder="np. 18:00 - 20:00"
                value={newEventData.time}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right text-sm">
                Lokalizacja
              </label>
              <Input
                id="location"
                name="location"
                placeholder="np. Online (Zoom) lub adres fizyczny"
                value={newEventData.location}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="maxParticipants" className="text-right text-sm">
                Maks. uczestników
              </label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                value={newEventData.maxParticipants}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm">
                Typ wydarzenia
              </label>
              <Input
                id="type"
                name="type"
                placeholder="np. warsztat, webinar, spotkanie"
                value={newEventData.type}
                onChange={handleNewEventChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="tags" className="text-right text-sm">
                Tagi
              </label>
              <Input
                id="tags"
                name="tags"
                placeholder="Tagi oddzielone przecinkami"
                value={newEventData.tags}
                onChange={handleNewEventChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateEventModal(false)}>
              Anuluj
            </Button>
            <Button onClick={handleCreateEvent}>Utwórz wydarzenie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
