import type { TeamData } from "./types";
import { Koffing, PokemonTeam, PokemonTeamSet } from "koffing";

export async function fetchTeamData(pokePasteUrl: string): Promise<TeamData> {
  try {
    // Extract the paste ID from the URL
    const url = new URL(pokePasteUrl);
    const pasteId = url.pathname.split("/").pop();

    if (!pasteId) {
      throw new Error("Invalid Pokepaste URL");
    }

    // Construct the raw data URL
    const rawUrl = `https://pokepast.es/${pasteId}/raw`;

    const response = await fetch(rawUrl, {
      headers: {
        Accept: "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.statusText}`);
    }

    const rawData = await response.text();

    // Parse the team data
    const teamData = parsePokepasteData(rawData);

    return {
      ...teamData,
      rawData,
    };
  } catch (error) {
    console.error("Error fetching team data:", error);
    throw error;
  }
}

function parsePokepasteData(rawData: string): Omit<TeamData, "rawData"> {
  const response = Koffing.parse(rawData) as PokemonTeamSet;
  const pokemonTeam: any[] = [];
  let title = "";
  let author = "";
  let format = "VGC";

  response.teams[0].pokemon.forEach((pokemon) => {
    pokemonTeam.push({
      ...pokemon,
      species: pokemon.name,
    });
  });

  return {
    title: title || "Untitled Team",
    author: author || "",
    format,
    pokemon: pokemonTeam,
  };
}
