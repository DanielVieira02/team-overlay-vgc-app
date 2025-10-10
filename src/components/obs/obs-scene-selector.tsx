"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import type { OBSConnection } from "@/src/lib/obs-connection";
import { Check, Clapperboard, RefreshCw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface OBSSceneSelectorProps {
  connection: OBSConnection;
}

export function OBSSceneSelector({ connection }: OBSSceneSelectorProps) {
  const {
    scenes,
    scenesLoading,
    scenesError,
    selectedScene,
    setSelectedScene,
    refetchScenes,
  } = useOBSState(connection);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clapperboard className="h-5 w-5" />
          Select Scene
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchScenes()}
            disabled={scenesLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${scenesLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
        <CardDescription>Choose an OBS scene to configure</CardDescription>
      </CardHeader>
      <CardContent>
        {scenesError && (
          <div className="text-sm text-destructive mb-4">
            Failed to load scenes: {scenesError.message}
          </div>
        )}

        {scenesLoading ? (
          <p className="text-sm text-muted-foreground">Loading scenes...</p>
        ) : scenes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scenes found</p>
        ) : (
          <div className="space-y-2">
            {scenes.toSorted().map((scene) => (
              <Button
                key={scene.sceneName}
                variant={
                  selectedScene === scene.sceneName ? "default" : "outline"
                }
                className={cn(
                  "w-full justify-start",
                  selectedScene === scene.sceneName && "bg-primary",
                )}
                onClick={() => setSelectedScene(scene.sceneName)}
              >
                {selectedScene === scene.sceneName && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {scene.sceneName}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
