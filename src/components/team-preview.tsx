"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { usePlayersQuery, useTeamDataQuery } from "@/src/hooks/use-players"
import { getPokemonIconPath, getItemIconPath } from "@/src/lib/asset-utils"
import { Loader2, Users, ExternalLink, Sparkles, Zap, Shield } from "lucide-react"
import type { Player, Pokemon } from "@/src/lib/types"

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const pokemonIcon = getPokemonIconPath(pokemon.species)
  const itemIcon = pokemon.item ? getItemIconPath(pokemon.item) : null
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={pokemonIcon} 
              alt={pokemon.species}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback to Pikachu if image fails to load
                (e.target as HTMLImageElement).src = '/assets/PokeIcons/025_000.png'
              }}
            />
            {pokemon.shiny && (
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {pokemon.name || pokemon.species}
            </CardTitle>
            {pokemon.name !== pokemon.species && (
              <CardDescription className="truncate">{pokemon.species}</CardDescription>
            )}
            <div className="flex items-center gap-1 mt-1">
              {pokemon.level && pokemon.level !== 50 && (
                <Badge variant="outline" className="text-xs">
                  Lv. {pokemon.level}
                </Badge>
              )}
              {pokemon.nature && (
                <Badge variant="secondary" className="text-xs">
                  {pokemon.nature}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Item and Ability */}
        <div className="flex flex-wrap gap-2">
          {pokemon.item && (
            <div className="flex items-center gap-1 bg-secondary/50 rounded-md px-2 py-1">
              {itemIcon && (
                <img 
                  src={itemIcon} 
                  alt={pokemon.item}
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/ItemsIcons/0.png'
                  }}
                />
              )}
              <span className="text-xs font-medium">{pokemon.item}</span>
            </div>
          )}
          {pokemon.ability && (
            <div className="flex items-center gap-1 bg-primary/10 rounded-md px-2 py-1">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-medium">{pokemon.ability}</span>
            </div>
          )}
        </div>

        {/* Tera Type */}
        {pokemon.teraType && (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 text-xs">
              Tera {pokemon.teraType}
            </Badge>
          </div>
        )}

        {/* Moves */}
        {pokemon.moves && pokemon.moves.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span>Moves</span>
              <Badge variant="outline" className="text-xs">
                {pokemon.moves.length}/4
              </Badge>
            </h4>
            <div className="grid gap-1">
              {pokemon.moves.slice(0, 4).map((move, index) => (
                <div 
                  key={index} 
                  className="text-sm bg-muted/50 rounded px-2 py-1 truncate"
                  title={move}
                >
                  {move}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVs */}
        {pokemon.evs && Object.keys(pokemon.evs).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">EVs</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(pokemon.evs).map(([stat, value]) => (
                <div key={stat} className="flex justify-between bg-muted/30 rounded px-2 py-1">
                  <span className="font-medium">{stat}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IVs (if different from 31) */}
        {pokemon.ivs && Object.keys(pokemon.ivs).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">IVs</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(pokemon.ivs)
                .filter(([_, value]) => value !== 31) // Only show non-perfect IVs
                .map(([stat, value]) => (
                  <div key={stat} className="flex justify-between bg-muted/30 rounded px-2 py-1">
                    <span className="font-medium">{stat}:</span>
                    <span>{value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TeamDisplay({ player }: { player: Player }) {
  const { data: teamData, isLoading, isError, error } = useTeamDataQuery(player.teamUrl)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading team data...</p>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {player.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-destructive mb-2">Failed to load team data</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || 'Unknown error occurred'}
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href={player.teamUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!teamData) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6" />
                {player.name}
              </CardTitle>
              <CardDescription className="text-base">
                {teamData.title}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="flex items-center gap-1">
                  {teamData.pokemon.length} Pokémon
                </Badge>
                {teamData.format && (
                  <Badge variant="outline">
                    {teamData.format}
                  </Badge>
                )}
                {teamData.author && (
                  <Badge variant="secondary">
                    by {teamData.author}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={player.teamUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original
                </a>
              </Button>
              <div className="flex gap-1">
                {teamData.pokemon.slice(0, 6).map((pokemon, index) => (
                  <img 
                    key={index}
                    src={getPokemonIconPath(pokemon.species)} 
                    alt={pokemon.species}
                    className="w-8 h-8 object-contain rounded border bg-white/50"
                    title={pokemon.species}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/PokeIcons/025_000.png'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamData.pokemon.map((pokemon, index) => (
          <PokemonCard key={index} pokemon={pokemon} />
        ))}
      </div>
    </div>
  )
}

export function TeamPreview() {
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

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">No players registered</p>
              <p className="text-sm text-muted-foreground">
                Add players in the Players tab to see their teams here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Preview</h2>
          <p className="text-muted-foreground">
            View all registered teams for the tournament
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {players.length} {players.length === 1 ? 'Player' : 'Players'}
        </Badge>
      </div>

      {players.map((player) => (
        <TeamDisplay key={player.id} player={player} />
      ))}
    </div>
  )
}