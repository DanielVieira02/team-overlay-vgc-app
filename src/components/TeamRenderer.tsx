import { Koffing, Pokemon, PokemonTeamSet } from "koffing";
import { useEffect, useState } from "react";
import { TeamSlot } from "./TeamSlot";

interface TeamRendererProps {
    pokepasteUrl: string
};

export const TeamRenderer = ({
    pokepasteUrl,
}: TeamRendererProps) => {

    const [team, setTeam] = useState<Pokemon[]>([]);

    useEffect(() => {
        fetch(pokepasteUrl)
            .then((response) => response.text())
            .then((data) => {
                const pokemonTeam = Koffing.parse(data);
                setTeam((pokemonTeam as PokemonTeamSet).teams[0].pokemon);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <div>
            <svg width="1000px" height="1000px">
                {team.map((pokemon: Pokemon, slotId: number) => (
                    <TeamSlot pokemon={pokemon} slotId={slotId} key={pokemon.name} />
                ))}
            </svg>
        </div>
    )
}