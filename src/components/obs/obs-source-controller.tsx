"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import type { OBSConnection } from "@/src/lib/obs-connection"
import { getPlayers } from "@/src/lib/player-storage"
import { Monitor, ExternalLink } from "lucide-react"
import { useToast } from "@/src/hooks/use-toast"

interface OBSSourceControllerProps {
  connection: OBSConnection
  sceneName: string
  selectedSource?: string
  onSelectSource: (source: string) => void
}

export function OBSSourceController({
  connection,
  sceneName,
  selectedSource,
  onSelectSource,
}: OBSSourceControllerProps) {
  const [sources, setSources] = useState<any[]>([])
  const [players, setPlayers] = useState(getPlayers())
  const [selectedPlayer, setSelectedPlayer] = useState<string>()
  const [customUrl, setCustomUrl] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadSources()
  }, [sceneName])

  const loadSources = async () => {
    try {
      const sourceList = await connection.getSources(sceneName)
      setSources(sourceList)
    } catch (error) {
      console.error("[v0] Failed to load sources:", error)
    }
  }

  const handleSetUrl = async (url: string) => {
    if (!selectedSource) return
    try {
      await connection.setSourceUrl(selectedSource, url)
      toast({
        title: "URL Updated",
        description: "Browser source URL has been updated",
      })
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Browser Sources
        </CardTitle>
        <CardDescription>Configure browser source URLs for team overlays</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Source</Label>
          <Select value={selectedSource} onValueChange={onSelectSource}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a browser source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((source) => (
                <SelectItem key={source.sourceName} value={source.sourceName}>
                  {source.sourceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSource && (
          <>
            <div className="space-y-2">
              <Label>Select Player Team</Label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPlayer && (
                <Button
                  className="w-full"
                  onClick={() => {
                    const player = players.find((p) => p.id === selectedPlayer)
                    if (player) handleSetUrl(player.teamUrl)
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Load Player Team
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/team"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <Button onClick={() => handleSetUrl(customUrl)}>Set URL</Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
