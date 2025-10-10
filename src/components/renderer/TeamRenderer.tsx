import { TeamSlot } from "./TeamSlot";
import { useTeamDataQuery, parsePokepasteData } from "@/src/hooks/use-players";
import { Pokemon } from "@/src/lib/types";

interface TeamRendererProps {
  pokepasteUrl: string;
}

export const TeamRenderer = ({ pokepasteUrl }: TeamRendererProps) => {
  const {
    data: teamData,
    isLoading,
    isError,
    error,
  } = useTeamDataQuery(pokepasteUrl);

  if (isLoading) return <div></div>;

  const team = teamData.pokemon;

  return (
    <div>
      <svg width="1000px" height="1000px">
        {team.map((pokemon: Pokemon, slotId: number) => (
          <TeamSlot pokemon={pokemon} slotId={slotId} key={pokemon.name} />
        ))}
      </svg>
    </div>
  );
};
