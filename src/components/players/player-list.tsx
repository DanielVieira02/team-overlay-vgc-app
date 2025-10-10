"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import type { Player } from "@/src/lib/types"
import { deletePlayer } from "@/src/lib/player-storage"
import { Trash2, ExternalLink } from "lucide-react"
import { useToast } from "@/src/hooks/use-toast"

interface PlayerListProps {
  players: Player[]
  onPlayerDeleted: () => void
}

export function PlayerList({ players, onPlayerDeleted }: PlayerListProps) {
  const { toast } = useToast()

  const handleDelete = (id: string, name: string) => {
    deletePlayer(id)
    onPlayerDeleted()
    toast({
      title: "Player Removed",
      description: `${name} has been removed`,
    })
  }

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No players registered yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Players</CardTitle>
        <CardDescription>
          {players.length} {players.length === 1 ? "player" : "players"} registered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent/5 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{player.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    VGC
                  </Badge>
                </div>
                <a
                  href={player.teamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  {player.teamUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(player.id, player.name)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
