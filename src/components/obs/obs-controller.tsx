"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { OBSConnectionForm } from "./obs-connection-form"
import { OBSSceneSelector } from "./obs-scene-selector"
import { OBSSourceController } from "./obs-source-controller"
import { useOBSConnection } from "@/src/hooks/use-obs-connection"
import { Button } from "@/src/components/ui/button"
import { Wifi, WifiOff } from "lucide-react"

export function OBSController() {
  const { connection, isConnected, disconnect } = useOBSConnection()
  const [selectedScene, setSelectedScene] = useState<string>()
  const [selectedSource, setSelectedSource] = useState<string>()

  if (!isConnected) {
    return <OBSConnectionForm />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                OBS Connected
              </CardTitle>
              <CardDescription>Manage your OBS scenes and sources</CardDescription>
            </div>
            <Button variant="outline" onClick={disconnect}>
              <WifiOff className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <OBSSceneSelector
          connection={connection!}
          selectedScene={selectedScene}
          onSelectScene={(scene) => {
            setSelectedScene(scene)
            setSelectedSource(undefined)
          }}
        />

        {selectedScene && (
          <OBSSourceController
            connection={connection!}
            sceneName={selectedScene}
            selectedSource={selectedSource}
            onSelectSource={setSelectedSource}
          />
        )}
      </div>
    </div>
  )
}
