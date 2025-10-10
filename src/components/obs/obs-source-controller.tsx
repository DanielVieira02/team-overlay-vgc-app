"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import type { OBSConnection } from "@/src/lib/obs-connection";
import { getPlayers } from "@/src/lib/player-storage";
import { convertToTeamlistUrl } from "@/src/lib/url-utils";
import { Monitor, RefreshCw } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface OBSSourceControllerProps {
  connection: OBSConnection;
}

export function OBSSourceController({ connection }: OBSSourceControllerProps) {
  const [players] = useState(getPlayers());
  const { toast } = useToast();

  const {
    sources,
    sourcesLoading,
    sourcesError,
    selectedScene,
    updateSourceUrl,
    isUpdatingUrl,
    updateUrlError,
    refetchSources,
    setSourceAssignment,
    getSceneAssignments,
  } = useOBSState(connection);

  // Get assignments for the current scene
  const sceneAssignments = selectedScene
    ? getSceneAssignments(selectedScene)
    : {};

  // Don't render if no scene is selected
  if (!selectedScene) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Browser Sources
          </CardTitle>
          <CardDescription>
            Select a scene first to configure sources
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handlePlayerChange = (sourceName: string, playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    if (player && selectedScene) {
      // Update persistent state immediately for UI feedback
      setSourceAssignment(selectedScene, sourceName, playerId);

      // Convert pokepaste URL to app teamlist route
      const appUrl = convertToTeamlistUrl(player.teamUrl);

      updateSourceUrl(
        { sourceName, url: appUrl },
        {
          onSuccess: () => {
            toast({
              title: "Player Assigned",
              description: `${player.name} assigned to ${sourceName}`,
            });
            console.log(`Source ${sourceName} URL set to: ${appUrl}`);
          },
          onError: (error: any) => {
            // Revert persistent state on error
            setSourceAssignment(selectedScene, sourceName, undefined);
            toast({
              title: "Assignment Failed",
              description: error.message || "Failed to assign player",
              variant: "destructive",
            });
          },
        },
      );
    }
  };

  const clearSource = (sourceName: string) => {
    if (!selectedScene) return;

    // Get current assignment to restore on error
    const currentPlayerId = sceneAssignments[sourceName];

    // Update persistent state immediately for UI feedback
    setSourceAssignment(selectedScene, sourceName, undefined);

    updateSourceUrl(
      { sourceName, url: "" },
      {
        onSuccess: () => {
          toast({
            title: "Source Cleared",
            description: `${sourceName} has been cleared`,
          });
        },
        onError: (error: any) => {
          // Restore previous assignment on error
          if (currentPlayerId) {
            setSourceAssignment(selectedScene, sourceName, currentPlayerId);
          }
          toast({
            title: "Clear Failed",
            description: error.message || "Failed to clear source",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Browser Sources
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchSources()}
            disabled={sourcesLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${sourcesLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
        <CardDescription>
          Assign players to browser sources in {selectedScene}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sourcesError && (
          <div className="text-sm text-destructive">
            Failed to load sources: {sourcesError.message}
          </div>
        )}

        {updateUrlError && (
          <div className="text-sm text-destructive">
            Error: {updateUrlError.message}
          </div>
        )}

        {sourcesLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading sources...
          </div>
        ) : sources.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No browser sources found in this scene
          </div>
        ) : (
          <div className="space-y-3">
            {sources.toSorted().map((source) => {
              const assignedPlayerId = sceneAssignments[source.sourceName];
              const assignedPlayer = assignedPlayerId
                ? players.find((p) => p.id === assignedPlayerId)
                : null;

              return (
                <div
                  key={source.sourceName}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium w-max">{source.sourceName}</h4>
                    </div>
                    <Select
                      value={sceneAssignments[source.sourceName] || ""}
                      onValueChange={(playerId) =>
                        handlePlayerChange(source.sourceName, playerId)
                      }
                      disabled={isUpdatingUrl}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isUpdatingUrl ? "Updating..." : "Select a player"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearSource(source.sourceName)}
                      disabled={isUpdatingUrl || !assignedPlayer}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
