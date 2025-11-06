import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getPokemonIconPath } from "@/src/lib/asset-utils";
import { PokemonSlot } from "@/src/lib/types";

interface BattleManagerPokemonControllerProps {
    pokemon: PokemonSlot,
    onToggleFainted: any,
}

export const BattleManagerPokemonController = ({
    pokemon,
    onToggleFainted,
}: BattleManagerPokemonControllerProps) => {
    return (
        <Card className="h-[100%]">
            <CardContent>
                <div className="col-span-1">
                    <Button
                        className="w-[100%] h-32"
                        variant="outline"
                        key={pokemon.species}
                        onClick={() => {
                            onToggleFainted(!pokemon.fainted);
                        }}
                    >
                        <img
                            src={getPokemonIconPath(pokemon.species ?? "")}
                            alt={pokemon.species}
                            className={`w-18 h-18 object-contain ${pokemon.fainted ? "opacity-50" : "opacity-100"}`}
                            onError={(e) => {
                                // Fallback to Pikachu if image fails to load
                                (e.target as HTMLImageElement).src =
                                    "/assets/PokeIcons/025_000.png";
                            }}
                        />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}