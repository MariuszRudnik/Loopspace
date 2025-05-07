"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Bot, Send, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Cześć! Jestem twoim asystentem AI. Jak mogę pomóc w twoich projektach?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  // Mutacja do wysyłania wiadomości do API
  const chatMutation = useMutation({
    mutationFn: async (messages: { role: "user" | "assistant"; content: string }[]) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error?.message || "Błąd AI")
      }
      const data = await res.json()
      // Odpowiedź AI może być w różnych formatach, zależnie od modelu
      return data?.message?.content || data?.choices?.[0]?.message?.content || "Brak odpowiedzi AI"
    },
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Wyślij wiadomości do API i dodaj odpowiedź AI
    try {
      const aiContent = await chatMutation.mutateAsync([
        ...messages,
        { role: "user", content: input },
      ])
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: err.message || "Wystąpił błąd podczas komunikacji z AI.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }
  }

  return (
    <>
      {/* Ikona robota w prawym dolnym rogu */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        variant={isOpen ? "secondary" : "default"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {/* Dymek czatu */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 md:w-96 shadow-xl border animate-in fade-in zoom-in-95 duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Asystent AI
            </CardTitle>
          </CardHeader>
          <ScrollArea className="h-80">
            <CardContent>
              <div className="space-y-4 pt-2">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="h-8 w-8">
                        {message.role === "assistant" ? (
                          <AvatarImage src="/futuristic-helper-bot.png" />
                        ) : (
                          <AvatarImage src="/vibrant-street-market.png" />
                        )}
                        <AvatarFallback>{message.role === "assistant" ? "AI" : "U"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Spinner ładowania odpowiedzi AI */}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[80%] flex-row">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/futuristic-helper-bot.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">AI myśli...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </ScrollArea>
          <CardFooter className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Napisz wiadomość..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={chatMutation.isPending}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || chatMutation.isPending}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Wyślij</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

