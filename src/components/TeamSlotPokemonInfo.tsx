import "./TeamSlot.css";
import { Pokemon } from "koffing"
import ItemTranslator from "../assets/TranslatorItems.json"

type ItemFile = {
    [key: string]: string
}

interface TeamSlotPokemonInfo {
    pokemon: Pokemon,
}

const allData: ItemFile = ItemTranslator;

export const TeamSlotPokemonInfo = ({
    pokemon
}: TeamSlotPokemonInfo) => {
    const itemHref = pokemon.item ? `/assets/ItemsIcons/${allData[pokemon.item]}.png` : "/assets/Pokeballs/pokeballA.png";

    return (
        <g>
            <path 
                d="M 503 161 C 517 174 467 195 459 216 H 108 C 75 216 75 161 108 161 Z" 
                className="teamSlotAbility"
            />
            <path 
                d="M 890 161 V 216 H 487 C 495 197 546 174 533 161 Z" 
                className="teamSlotItem"
            />
            <circle 
                cx="890"
                cy="186"
                r="36"
                className="teamSlotItemBackground"
            />
            <image
                x="858"
                y="154"
                className="itemIcon"
                href={itemHref}
            />  
            <text 
                x="264"
                y="201"
                className="textPokemonInfo"
            >
                {pokemon.ability}
            </text>
            <text 
                x="696"
                y="201"
                className="textPokemonInfo"
            >
                {pokemon.item}
            </text>
        </g>
    )
}