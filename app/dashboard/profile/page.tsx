"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, BookOpen, Bell, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Przykładowe dane użytkownika
const initialUserData = {
  name: "Jan Kowalski",
  email: "jan.kowalski@example.com",
  phone: "+48 123 456 789",
  location: "Warszawa, Polska",
  bio: "Pasjonat programowania i nowych technologii. Uczę się i rozwijam swoje umiejętności każdego dnia.",
  occupation: "Software Developer",
  joinDate: "Styczeń 2023",
  avatar: "/placeholder.svg?height=128&width=128",
  coursesCompleted: 5,
  coursesInProgress: 2,
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  privacy: {
    profilePublic: true,
    showCourses: true,
    showActivity: false,
  },
}

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(initialUserData)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  // Funkcja do rozpoczęcia edycji
  const handleStartEditing = () => {
    setEditedData(userData)
    setIsEditing(true)
  }

  // Funkcja do anulowania edycji
  const handleCancelEditing = () => {
    setIsEditing(false)
  }

  // Funkcja do zapisywania zmian
  const handleSaveChanges = () => {
    setUserData(editedData)
    setIsEditing(false)
    // Tutaj byłoby wywołanie API do zapisania zmian w bazie danych
    console.log("Zapisano zmiany:", editedData)
  }

  // Funkcja do aktualizacji danych podczas edycji
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Funkcja do aktualizacji ustawień powiadomień
  const handleNotificationChange = (key: keyof typeof userData.notifications, value: boolean) => {
    setEditedData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  // Funkcja do aktualizacji ustawień prywatności
  const handlePrivacyChange = (key: keyof typeof userData.privacy, value: boolean) => {
    setEditedData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  // Modal do zmiany hasła
  const PasswordChangeModal = () => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      // Walidacja
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("Wszystkie pola są wymagane")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("Nowe hasła nie są identyczne")
        return
      }

      // Tutaj byłoby wywołanie API do zmiany hasła
      console.log("Zmiana hasła:", { currentPassword, newPassword })

      // Zamknij modal i wyczyść formularz
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setError("")
      setIsPasswordModalOpen(false)
    }

    return (
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Zmień hasło</DialogTitle>
            <DialogDescription>Wprowadź swoje obecne hasło oraz nowe hasło, aby dokonać zmiany.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {error && <div className="text-sm font-medium text-destructive">{error}</div>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-password" className="text-right">
                  Obecne hasło
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  Nowe hasło
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Potwierdź hasło
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit">Zapisz zmiany</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Renderuj modal
  const passwordModal = <PasswordChangeModal />

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profil użytkownika</h1>
        {!isEditing ? (
          <Button onClick={handleStartEditing}>Edytuj profil</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEditing}>
              Anuluj
            </Button>
            <Button onClick={handleSaveChanges}>Zapisz zmiany</Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="security">Bezpieczeństwo i prywatność</TabsTrigger>
        </TabsList>

        {/* Zakładka Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacje osobiste</CardTitle>
              <CardDescription>Zarządzaj swoimi danymi osobowymi i informacjami kontaktowymi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Zmień zdjęcie
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Imię i nazwisko</Label>
                      {isEditing ? (
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            value={editedData.name}
                            onChange={handleInputChange}
                            placeholder="Imię i nazwisko"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{userData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            value={editedData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{userData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      {isEditing ? (
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            value={editedData.phone}
                            onChange={handleInputChange}
                            placeholder="Numer telefonu"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{userData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Lokalizacja</Label>
                      {isEditing ? (
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            name="location"
                            value={editedData.location}
                            onChange={handleInputChange}
                            placeholder="Miasto, kraj"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{userData.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation">Zawód</Label>
                      {isEditing ? (
                        <div className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="occupation"
                            name="occupation"
                            value={editedData.occupation}
                            onChange={handleInputChange}
                            placeholder="Zawód"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{userData.occupation}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Data dołączenia</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userData.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">O mnie</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editedData.bio}
                        onChange={handleInputChange}
                        placeholder="Napisz coś o sobie..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{userData.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Postępy w nauce</CardTitle>
              <CardDescription>Przegląd Twoich kursów i postępów w nauce.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ukończone kursy</p>
                    <h3 className="text-2xl font-bold">{userData.coursesCompleted}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kursy w trakcie</p>
                    <h3 className="text-2xl font-bold">{userData.coursesInProgress}</h3>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Ostatnio przeglądane kursy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Wprowadzenie do programowania</p>
                        <p className="text-sm text-muted-foreground">Ostatnio: wczoraj</p>
                      </div>
                    </div>
                    <Badge>75% ukończone</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Zaawansowany JavaScript</p>
                        <p className="text-sm text-muted-foreground">Ostatnio: 3 dni temu</p>
                      </div>
                    </div>
                    <Badge>30% ukończone</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Zobacz wszystkie kursy
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Zakładka Powiadomienia */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia powiadomień</CardTitle>
              <CardDescription>Dostosuj sposób otrzymywania powiadomień z platformy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Powiadomienia email</p>
                      <p className="text-sm text-muted-foreground">
                        Otrzymuj powiadomienia o nowych lekcjach, komentarzach i aktualizacjach kursów.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEditing ? editedData.notifications.email : userData.notifications.email}
                    onCheckedChange={isEditing ? (value) => handleNotificationChange("email", value) : undefined}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Powiadomienia push</p>
                      <p className="text-sm text-muted-foreground">
                        Otrzymuj powiadomienia w przeglądarce o ważnych wydarzeniach.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEditing ? editedData.notifications.push : userData.notifications.push}
                    onCheckedChange={isEditing ? (value) => handleNotificationChange("push", value) : undefined}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Powiadomienia marketingowe</p>
                      <p className="text-sm text-muted-foreground">
                        Otrzymuj informacje o nowych kursach, promocjach i wydarzeniach.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEditing ? editedData.notifications.marketing : userData.notifications.marketing}
                    onCheckedChange={isEditing ? (value) => handleNotificationChange("marketing", value) : undefined}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zakładka Bezpieczeństwo i prywatność */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bezpieczeństwo konta</CardTitle>
              <CardDescription>Zarządzaj hasłem i zabezpieczeniami swojego konta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Zmień hasło</p>
                      <p className="text-sm text-muted-foreground">
                        Aktualizuj swoje hasło regularnie, aby zwiększyć bezpieczeństwo konta.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
                    Zmień hasło
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ustawienia prywatności</CardTitle>
              <CardDescription>Kontroluj, kto może widzieć Twoje informacje i aktywność.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Profil publiczny</p>
                      <p className="text-sm text-muted-foreground">
                        Pozwól innym użytkownikom zobaczyć Twój profil i podstawowe informacje.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEditing ? editedData.privacy.profilePublic : userData.privacy.profilePublic}
                    onCheckedChange={isEditing ? (value) => handlePrivacyChange("profilePublic", value) : undefined}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pokaż ukończone kursy</p>
                      <p className="text-sm text-muted-foreground">
                        Pozwól innym użytkownikom zobaczyć, jakie kursy ukończyłeś.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEditing ? editedData.privacy.showCourses : userData.privacy.showCourses}
                    onCheckedChange={isEditing ? (value) => handlePrivacyChange("showCourses", value) : undefined}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pokaż aktywność</p>
                      <p className="text-sm text-muted-foreground">
                        Pozwól innym użytkownikom zobaczyć Twoją aktywność na platformie.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEditing ? editedData.privacy.showActivity : userData.privacy.showActivity}
                    onCheckedChange={isEditing ? (value) => handlePrivacyChange("showActivity", value) : undefined}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {passwordModal}
    </div>
  )
}
