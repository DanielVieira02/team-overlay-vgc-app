"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAddPlayerMutation } from "@/src/hooks/use-players";
import { useToast } from "@/src/hooks/use-toast";
import { UserPlus, Loader2 } from "lucide-react";

export function PlayerForm() {
  const [name, setName] = useState("");
  const [teamUrl, setTeamUrl] = useState("");
  const { toast } = useToast();
  const addPlayerMutation = useAddPlayerMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !teamUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addPlayerMutation.mutate(
      { name, teamUrl },
      {
        onSuccess: () => {
          setName("");
          setTeamUrl("");
          toast({
            title: "Player Added",
            description: `${name} has been registered successfully`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to add player. Please try again.",
            variant: "destructive",
          });
          console.error("Error adding player:", error);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="playerName">Player Name</Label>
          <Input
            id="playerName"
            type="text"
            placeholder="Enter player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamUrl">Team URL (Pokepaste)</Label>
          <Input
            id="teamUrl"
            type="url"
            placeholder="https://pokepast.es/..."
            value={teamUrl}
            onChange={(e) => setTeamUrl(e.target.value)}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={addPlayerMutation.isPending}
      >
        {addPlayerMutation.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        {addPlayerMutation.isPending ? "Adding..." : "Add Player"}
      </Button>
    </form>
  );
}
