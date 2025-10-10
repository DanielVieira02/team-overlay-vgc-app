"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { useOBSConnection } from "@/src/hooks/use-obs-connection";
import { Loader2, Wifi } from "lucide-react";

export function OBSConnectionForm() {
  const [url, setUrl] = useState("ws://localhost:4455");
  const [password, setPassword] = useState("");
  const { connect, isConnecting } = useOBSConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await connect(url, password || undefined);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Connect to OBS
        </CardTitle>
        <CardDescription>
          Enter your OBS WebSocket connection details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">WebSocket URL</Label>
            <Input
              id="url"
              type="text"
              placeholder="ws://localhost:4455"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password (optional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password if required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect to OBS"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
