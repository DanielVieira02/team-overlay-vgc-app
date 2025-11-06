import { useTeamDataQuery } from "@/src/hooks/use-players";
import { Button } from "../../../ui/button";
import { Pokemon, PokemonSlot } from "@/src/lib/types";
import { getPokemonIconPath } from "@/src/lib/asset-utils";
import { useEffect, useState } from "react";
import { OBSConnection } from "@/src/lib/obs-connection";
import { useOBSState } from "@/src/hooks/use-obs-state";
import { useOBSBattleData } from "@/src/hooks/use-obs-battle-data";
import { BattleManagerPokemonController } from "./BattleManagerPokemonController";

const MAX_POKEMON_ON_BATTLE = 4;

interface BattleManagerTeamPanelProps {
    connection: OBSConnection | null,
    teamUrl: string,
    initialSelectedPokemon?: PokemonSlotStatus[],
    bottom?: boolean,
}

interface PokemonSlotStatus {
    species: string,
    item: string | undefined,
    fainted: boolean,
}

export const BattleManagerTeamPanel = ({
    connection,
    teamUrl,
    bottom = false,
    initialSelectedPokemon = [],
}: BattleManagerTeamPanelProps) => {
    const {
        data: teamData,
        isLoading,
    } = useTeamDataQuery(teamUrl);
    const {
        broadcastCustomEvent,
        addEventListener,
        removeEventListener,
    } = useOBSState(connection);
    const { 
        setActivePokemonBattle,
        setIsPokemonFaintedBattle,
    } = useOBSBattleData(connection);

    const [ selectedPokemon, setSelectedPokemon ] = useState<PokemonSlotStatus[]>(initialSelectedPokemon);

    const handleCustomEvent = (eventData: any) => {
        const eventName = eventData.eventName;

        switch(eventName) {
            case "ResetBattle":
                setSelectedPokemon([]);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        addEventListener(connection, "CustomEvent", handleCustomEvent);
        return () => {
            removeEventListener(connection, "CustomEvent", handleCustomEvent);
        };
    });

    if(isLoading && !teamData) {
        return (<></>);
    }

    const team = teamData.pokemon;

    const addPokemonToBattle = (pokemon: Pokemon) => {
        if(selectedPokemon.length >= MAX_POKEMON_ON_BATTLE)
            return;
        
        broadcastCustomEvent({
            eventData: {
                eventName: "BattlePokemonActive",
                pokemonSpecies: pokemon.species,
                item: pokemon.item ?? "",
                bottom: bottom ? bottom : false,
            },
        });

        setSelectedPokemon([...selectedPokemon, { species: pokemon.species, item: pokemon.item, fainted: false}]);
        setActivePokemonBattle({
            species: pokemon.species,
            item: pokemon.item ?? "",
            fainted: false,
            index: selectedPokemon.length - 1,
            isBottomPlayer: bottom,
        })
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
        setIsPokemonFaintedBattle({
            pokemonIndex,
            fainted,
            isBottomPlayer: bottom
        });
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-6">
                {team.map((pokemon: Pokemon) => (
                    <Button 
                        className="w-16 h-16"
                        variant="outline"
                        key={pokemon.name}
                        onClick={() => {
                            addPokemonToBattle(pokemon);
                        }}
                        disabled={!selectedPokemon || selectedPokemon.some((p) => p.species === pokemon.name)}
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
            <div className="grid gap-2 grid-cols-2 space-y-2">
                {selectedPokemon?.map((pokemon: PokemonSlotStatus, index: number) => (
                    <BattleManagerPokemonController 
                        pokemon={{ ...pokemon, item: undefined, active: true}}
                        onToggleFainted={(fainted: boolean) => togglePokemonFainted(index, fainted)}
                    />
                ))}
            </div>
        </div>
    );
}