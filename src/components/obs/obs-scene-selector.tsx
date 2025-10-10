"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import type { OBSConnection } from "@/src/lib/obs-connection"
import { Check, Clapperboard } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface OBSSceneSelectorProps {
  connection: OBSConnection
  selectedScene?: string
  onSelectScene: (scene: string) => void
}

export function OBSSceneSelector({ connection, selectedScene, onSelectScene }: OBSSceneSelectorProps) {
  const [scenes, setScenes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScenes()
  }, [connection])

  const loadScenes = async () => {
    try {
      const sceneList = await connection.getScenes()
      setScenes(sceneList)
    } catch (error) {
      console.error("[v0] Failed to load scenes:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clapperboard className="h-5 w-5" />
          Select Scene
        </CardTitle>
        <CardDescription>Choose an OBS scene to configure</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading scenes...</p>
        ) : scenes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scenes found</p>
        ) : (
          <div className="space-y-2">
            {scenes.map((scene) => (
              <Button
                key={scene.sceneName}
                variant={selectedScene === scene.sceneName ? "default" : "outline"}
                className={cn("w-full justify-start", selectedScene === scene.sceneName && "bg-primary")}
                onClick={() => onSelectScene(scene.sceneName)}
              >
                {selectedScene === scene.sceneName && <Check className="mr-2 h-4 w-4" />}
                {scene.sceneName}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
