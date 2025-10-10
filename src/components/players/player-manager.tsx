"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { PlayerForm } from "./player-form"
import { PlayerList } from "./player-list"
import { getPlayers } from "@/src/lib/player-storage"
import type { Player } from "@/src/lib/types"
import { Users } from "lucide-react"

export function PlayerManager() {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    setPlayers(getPlayers())
  }, [])

  const handlePlayerAdded = () => {
    setPlayers(getPlayers())
  }

  const handlePlayerDeleted = () => {
    setPlayers(getPlayers())
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Player Management
          </CardTitle>
          <CardDescription>Register players and their team compositions</CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerForm onPlayerAdded={handlePlayerAdded} />
        </CardContent>
      </Card>

      <PlayerList players={players} onPlayerDeleted={handlePlayerDeleted} />
    </div>
  )
}
