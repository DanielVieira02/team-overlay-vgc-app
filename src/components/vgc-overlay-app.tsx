"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { OBSController } from "@/src/components/obs/obs-controller";
import { PlayerManager } from "@/src/components/players/player-manager";
import { TeamPreview } from "@/src/components/team-preview";
import { Gamepad2, Users, Settings } from "lucide-react";

export function VGCOverlayApp() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          VGC Team Overlay
        </h1>
        <p className="text-muted-foreground text-lg">
          Professional Pokemon tournament overlay system for OBS
        </p>
      </header>

      <Tabs defaultValue="obs" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="obs" className="gap-2">
            <Settings className="h-4 w-4" />
            OBS Control
          </TabsTrigger>
          <TabsTrigger value="players" className="gap-2">
            <Users className="h-4 w-4" />
            Players
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Gamepad2 className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="obs" className="space-y-4">
          <OBSController />
        </TabsContent>

        <TabsContent value="players" className="space-y-4">
          <PlayerManager />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <TeamPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
