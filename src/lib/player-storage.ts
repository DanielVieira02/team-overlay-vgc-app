import type { Player } from "./types";

const STORAGE_KEY = "vgc_players";

export function getPlayers(): Player[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function savePlayer(name: string, teamUrl: string): Player {
  const players = getPlayers();
  const newPlayer: Player = {
    id: crypto.randomUUID(),
    name,
    teamUrl,
    createdAt: new Date(),
  };
  players.push(newPlayer);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  return newPlayer;
}

export function deletePlayer(id: string): void {
  const players = getPlayers().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

export function updatePlayer(id: string, updates: Partial<Player>): void {
  const players = getPlayers();
  const index = players.findIndex((p) => p.id === id);
  if (index !== -1) {
    players[index] = { ...players[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }
}
