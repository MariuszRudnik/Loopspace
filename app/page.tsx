import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Loopspace</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Zaloguj się</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Witaj w Loopspace</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Platforma edukacyjno-społecznościowa, która łączy naukę z interakcją społeczną. Twórz, zarządzaj i
              uczestniczy w kursach online w jednym miejscu.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg">Zaloguj się</Button>
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                <Github className="mr-2 h-4 w-4" />
                Zobacz na GitHubie
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Loopspace. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  )
}
