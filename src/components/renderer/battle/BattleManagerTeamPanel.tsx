import { useTeamDataQuery } from "@/src/hooks/use-players";
import { Button } from "../../ui/button";
import { Pokemon } from "@/src/lib/types";
import { getPokemonIconPath } from "@/src/lib/asset-utils";
import { useState } from "react";
import { OBSConnection } from "@/src/lib/obs-connection";
import { useOBSState } from "@/src/hooks/use-obs-state";

const MAX_POKEMON_ON_BATTLE = 4;

interface BattleManagerTeamPanelProps {
    connection: OBSConnection | null,
    teamUrl: string,
    bottom?: boolean,
}

interface PokemonSlot {
    pokemon: string,
    fainted: boolean,
}

export const BattleManagerTeamPanel = ({
    connection,
    teamUrl,
    bottom = false,
}: BattleManagerTeamPanelProps) => {
    const [ selectedPokemon, setSelectedPokemon ] = useState<PokemonSlot[]>([]);
    const {
        data: teamData,
        isLoading,
    } = useTeamDataQuery(teamUrl);
    const {
        broadcastCustomEvent,
    } = useOBSState(connection);


    if(isLoading && !teamData) {
        return (<></>);
    }

    const team = teamData.pokemon;

    const addPokemonToBattle = (pokemon: string) => {
        if(selectedPokemon.length >= MAX_POKEMON_ON_BATTLE)
            return;
        
        broadcastCustomEvent({
            eventData: {
                eventName: "BattlePokemonActive",
                pokemonSpecies: pokemon,
                bottom: bottom ? bottom : false,
            },
        });
        setSelectedPokemon([...selectedPokemon, { pokemon, fainted: false}]);
    }

    const togglePokemonFainted = (pokemonIndex: number, fainted: boolean) => {
        if(selectedPokemon.length < pokemonIndex)
            return;
        
        broadcastCustomEvent({
            eventData: {
                eventName: "BattlePokemonFainted",
                pokemonIndex: pokemonIndex,
                fainted,
                bottom: bottom ? bottom : false,
            },
        });

        const auxSelectedPokemon = selectedPokemon;
        auxSelectedPokemon[pokemonIndex].fainted = fainted;
        setSelectedPokemon(auxSelectedPokemon);
    }

    return (
        <div>
            <div className="grid gap-6 md:grid-cols-6">
                {team.map((pokemon: Pokemon) => (
                    <Button 
                        className="w-16 h-16"
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
                {selectedPokemon.map((pokemon: PokemonSlot, index: number) => (
                    <Button 
                        className="w-32 h-32"
                        variant="outline"
                        key={pokemon.pokemon}
                        onClick={() => {
                            togglePokemonFainted(index, !pokemon.fainted);
                        }}
                    >
                        <img
                            src={getPokemonIconPath(pokemon.pokemon)}
                            alt={pokemon.pokemon}
                            className={`w-24 h-24 object-contain ${pokemon.fainted ? "opacity-50" : "opacity-100"}`}
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