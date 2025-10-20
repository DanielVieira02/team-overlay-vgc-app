import { useTeamDataQuery } from "@/src/hooks/use-players";
import { Button } from "../../ui/button";
import { Pokemon } from "@/src/lib/types";
import { getPokemonIconPath } from "@/src/lib/asset-utils";
import { useState } from "react";

const MAX_POKEMON_ON_BATTLE = 4;

interface BattleManagerTeamPanelProps {
    teamUrl: string,
}

interface PokemonSlot {
    pokemon: string,
    fainted: boolean,
}

export const BattleManagerTeamPanel = ({
    teamUrl,
}: BattleManagerTeamPanelProps) => {
    const [ selectedPokemon, setSelectedPokemon ] = useState<PokemonSlot[]>([]);
    const {
        data: teamData,
        isLoading,
    } = useTeamDataQuery(teamUrl);


    if(isLoading && !teamData) {
        return (<></>);
    }

    const team = teamData.pokemon;

    const addPokemonToBattle = (pokemon: string) => {
        if(selectedPokemon.length < MAX_POKEMON_ON_BATTLE)
            setSelectedPokemon([...selectedPokemon, { pokemon, fainted: false}]);
    }

    return (
        <div>
            <div className="grid gap-6 md:grid-cols-2">
                {team.map((pokemon: Pokemon) => (
                    <Button 
                        className="w-32 h-32"
                        variant="outline"
                        key={pokemon.name}
                        onClick={() => {
                            addPokemonToBattle(pokemon.name);
                        }}
                        disabled={selectedPokemon.some((p) => p.pokemon === pokemon.name)}
                    >
                        <img
                            src={getPokemonIconPath(pokemon.name)}
                            alt={pokemon.name}
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                                // Fallback to Pikachu if image fails to load
                                (e.target as HTMLImageElement).src =
                                "/assets/PokeIcons/025_000.png";
                            }}
                        />
                    </Button>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-4">
                {selectedPokemon.map((pokemon: PokemonSlot) => (
                    <Button 
                        className="w-18 h-18"
                        variant="outline"
                        key={pokemon.pokemon}
                        onClick={() => {
                            pokemon.fainted = !pokemon.fainted;
                        }}
                    >
                        <img
                            src={getPokemonIconPath(pokemon.pokemon)}
                            alt={pokemon.pokemon}
                            className={`w-12 h-12 object-contain`}
                            onError={(e) => {
                                // Fallback to Pikachu if image fails to load
                                (e.target as HTMLImageElement).src =
                                "/assets/PokeIcons/025_000.png";
                            }}
                        />
                    </Button>
                ))}
            </div>
        </div>
    );
}