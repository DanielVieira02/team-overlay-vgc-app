import { useMutation, useQuery } from "@tanstack/react-query";
import { OBSConnection } from "../lib/obs-connection";
import { PokemonSlot } from "../lib/types";

interface BattleState {
    pokemon: any[],
    score: number,
}

export function useSetActivePokemonBattle(connection: OBSConnection | null) {
    return useMutation({
        mutationFn: async ({
            species,
            item,
            index,
            fainted,
            isBottomPlayer,
        }: {
            species: string,
            item: string,
            index: number,
            fainted: boolean,
            isBottomPlayer: boolean,
        }) => {
            if (!connection) 
                throw new Error("No OBS connection");
            const slotName = isBottomPlayer ? "bottom_pokemon" : "top_pokemon";
            const existingData = await connection.getPersistentData(slotName);
            const finalData = existingData ?? [];            

            finalData[index + 1] = {
                species,
                item,
                fainted,
            };

            return await connection.setPersistentData(slotName, finalData);
        }
    });
}

export function useGetPlayerBattleData (connection: OBSConnection | null) {
    return useMutation({
        mutationFn: async ({ isBottomPlayer }: {isBottomPlayer: boolean}) => {
            if (!connection)
                return undefined;
            const pokemon = await connection.getPersistentData(isBottomPlayer ? "bottom_pokemon" : "top_pokemon");
            const score = await connection.getPersistentData(isBottomPlayer ? "bottom_score" : "top_score");

            let initialPokemonData = (pokemon) ?
                pokemon.map((p: PokemonSlot) => {
                    return {
                        species: p.species,
                        active: true,
                        item: p.item,
                        fainted: p.fainted,
                    }
                })
            : [];

            while (initialPokemonData.length < 4) {
                initialPokemonData.push({
                    species: undefined,
                    active: false,
                    item: undefined,
                    fainted: false,
                });
            }

            return {
                pokemon: initialPokemonData,
                score,
            };
        },
    })
}

export function useBattleState(
    connection: OBSConnection | null,
    isBottomPlayer?: boolean,
) {
    return useQuery({
        queryKey: ["battle-state", isBottomPlayer],
        queryFn: async (): Promise<BattleState | undefined> => {
            if (!connection)
                return undefined;
            const pokemon = await connection.getPersistentData(isBottomPlayer ? "bottom_pokemon" : "top_pokemon");
            const score = await connection.getPersistentData(isBottomPlayer ? "bottom_score" : "top_score");
            
            return {
                pokemon,
                score,
            };
        },
        enabled: !!connection,
        refetchOnMount: "always",
    })
}

export function useSetIsPokemonFaintedBattle(connection: OBSConnection | null) {
    return useMutation({
        mutationFn: async ({
            pokemonIndex,
            fainted,
            isBottomPlayer,
        }: {
            pokemonIndex: number,
            fainted: boolean,
            isBottomPlayer: boolean,
        }) => {
            if (!connection) 
                throw new Error("No OBS connection");
            const slotName = isBottomPlayer ? "bottom_pokemon" : "top_pokemon";
            const existingData = await connection.getPersistentData(slotName);

            const finalData = existingData.map((p: any, index: number) => {
                if (index !== pokemonIndex) {
                    return p;
                }

                return {
                    ...p,
                    fainted,
                }
            });

            return await connection.setPersistentData(slotName, finalData);
        }
    });
}

export function useCleanActivePokemon(connection: OBSConnection | null) {
    return useMutation({
        mutationFn: async () => {
            if (!connection) 
                throw new Error("No OBS connection");
            await connection.setPersistentData("bottom_pokemon", []);
            await connection.setPersistentData("top_pokemon", []);
        }
    });
}

export function useOBSBattleData(connection: OBSConnection | null, bottom?: boolean) {
    const setActivePokemonBattle = useSetActivePokemonBattle(connection);
    const cleanActivePokemon = useCleanActivePokemon(connection);
    const setIsPokemonFaintedBattle = useSetIsPokemonFaintedBattle(connection);
    const getPlayerBattleData = useGetPlayerBattleData(connection);

    const battleState = useBattleState(connection, bottom);

    return {
        setActivePokemonBattle: setActivePokemonBattle.mutate,
        cleanActivePokemon: cleanActivePokemon.mutate,
        setIsPokemonFaintedBattle: setIsPokemonFaintedBattle.mutate,
        getPlayerBattleData: getPlayerBattleData.mutate,

        battleStateData: battleState.data,
        battleStateLoading: battleState.isLoading,
        battleStateError: battleState.error,
    };
}