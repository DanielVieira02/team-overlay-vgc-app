import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTeamData } from '../lib/team-api'
import { getPlayers, savePlayer, deletePlayer, updatePlayer } from '../lib/player-storage'
import type { Player, TeamData } from '../lib/types'

export const usePlayersQuery = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
    staleTime: 0, // Always refetch when component mounts
  })
}

export const useTeamDataQuery = (teamUrl: string, enabled = true) => {
  return useQuery({
    queryKey: ['teamData', teamUrl],
    queryFn: () => fetchTeamData(teamUrl),
    enabled: enabled && !!teamUrl,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAddPlayerMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name, teamUrl }: { name: string; teamUrl: string }) => {
      return Promise.resolve(savePlayer(name, teamUrl))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export const useDeletePlayerMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (playerId: string) => {
      deletePlayer(playerId)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export const useUpdatePlayerMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Player> }) => {
      updatePlayer(id, updates)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}