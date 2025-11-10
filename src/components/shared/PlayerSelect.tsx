import { usePlayersQuery } from "@/src/hooks/use-players";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

interface PlayerSelectProps {
  defaultPlayer?: string,
  onValueChange: any,
}

export const PlayerSelect = ({
  defaultPlayer,
  onValueChange,
}: PlayerSelectProps) => {
    const { data: players = [], isLoading, error } = usePlayersQuery();
  
    return (
      <div>
        <Select
          value={defaultPlayer}
          onValueChange={(playerId) =>
            onValueChange(playerId)
          }
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoading ? "Updating..." : "Select a player"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {players.map((player: any) => (
              <SelectItem key={player.id} value={player.id}>
                {player.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
}