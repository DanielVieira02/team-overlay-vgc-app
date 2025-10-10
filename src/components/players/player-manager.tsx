"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { PlayerForm } from "./player-form"
import { PlayerList } from "./player-list"
import { usePlayersQuery } from "@/src/hooks/use-players"
import { Users, Loader2 } from "lucide-react"

export function PlayerManager() {
  const { data: players = [], isLoading, error } = usePlayersQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading players...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading players</p>
          </CardContent>
        </Card>
      </div>
    )
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
          <PlayerForm />
        </CardContent>
      </Card>

      <PlayerList players={players} />
    </div>
  )
}
