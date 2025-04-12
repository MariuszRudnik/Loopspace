import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Logowanie</CardTitle>
          <CardDescription>Wprowadź swoje dane, aby zalogować się do konta</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nazwa@przykład.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link href="#" className="text-sm text-muted-foreground underline">
                    Zapomniałeś hasła?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Link href="/dashboard">
                <Button className="w-full">Zaloguj się</Button>
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">{/* Usunięto opcję rejestracji */}</CardFooter>
      </Card>
    </div>
  )
}
