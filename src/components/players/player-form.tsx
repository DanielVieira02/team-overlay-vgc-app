"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { savePlayer } from "@/src/lib/player-storage"
import { useToast } from "@/src/hooks/use-toast"
import { UserPlus } from "lucide-react"

interface PlayerFormProps {
  onPlayerAdded: () => void
}

export function PlayerForm({ onPlayerAdded }: PlayerFormProps) {
  const [name, setName] = useState("")
  const [teamUrl, setTeamUrl] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !teamUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    savePlayer(name, teamUrl)
    setName("")
    setTeamUrl("")
    onPlayerAdded()

    toast({
      title: "Player Added",
      description: `${name} has been registered successfully`,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="playerName">Player Name</Label>
          <Input
            id="playerName"
            type="text"
            placeholder="Enter player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamUrl">Team URL (Pokepaste)</Label>
          <Input
            id="teamUrl"
            type="url"
            placeholder="https://pokepast.es/..."
            value={teamUrl}
            onChange={(e) => setTeamUrl(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        <UserPlus className="mr-2 h-4 w-4" />
        Add Player
      </Button>
    </form>
  )
}
