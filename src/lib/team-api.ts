import type { TeamData } from "./types";

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
  const lines = rawData.split("\n").map((line) => line.trim());
  const pokemon: any[] = [];
  let currentPokemon: any = null;
  let title = "";
  let author = "";
  let format = "VGC";

  // Extract metadata from first few lines
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (line.includes("===") || line.includes("---")) {
      title = line.replace(/[=\-]/g, "").trim();
    }
    if (
      line.toLowerCase().includes("author") ||
      line.toLowerCase().includes("by:")
    ) {
      author = line.replace(/author:?|by:?/i, "").trim();
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) {
      // Empty line indicates end of current Pokemon
      if (currentPokemon) {
        pokemon.push(currentPokemon);
        currentPokemon = null;
      }
      continue;
    }

    // Check if this is a new Pokemon entry (contains @ or starts with capital letter and not a known attribute)
    const isNewPokemon =
      line.includes("@") ||
      (/^[A-Z]/.test(line) &&
        !line.startsWith("Ability:") &&
        !line.startsWith("Level:") &&
        !line.startsWith("Shiny:") &&
        !line.startsWith("Tera Type:") &&
        !line.startsWith("EVs:") &&
        !line.startsWith("IVs:") &&
        !line.endsWith("Nature") &&
        !line.startsWith("-") &&
        !line.startsWith("•"));

    if (isNewPokemon) {
      // Save previous Pokemon
      if (currentPokemon) {
        pokemon.push(currentPokemon);
      }

      // Parse new Pokemon
      let pokemonPart: string;
      let item: string | undefined;

      if (line.includes("@")) {
        const parts = line.split("@").map((p) => p.trim());
        pokemonPart = parts[0];
        item = parts[1] || undefined;
      } else {
        pokemonPart = line;
        item = undefined;
      }

      // Extract nickname and species
      let name = pokemonPart;
      let species = pokemonPart;

      // Handle format: "Nickname (Species)"
      const nicknameMatch = pokemonPart.match(/^(.+?)\s*\((.+?)\)$/);
      if (nicknameMatch) {
        name = nicknameMatch[1].trim();
        species = nicknameMatch[2].trim();
      }

      // Handle format: "Species-Form"
      if (species.includes("-") && !species.includes("(")) {
        // Keep the full form name for species lookup
        name = species;
      }

      currentPokemon = {
        name,
        species,
        item,
        moves: [],
        level: 50, // Default VGC level
      };
    }
    // Parse Pokemon attributes
    else if (currentPokemon) {
      if (line.startsWith("Ability:")) {
        currentPokemon.ability = line.replace("Ability:", "").trim();
      } else if (line.startsWith("Level:")) {
        const level = parseInt(line.replace("Level:", "").trim());
        if (!isNaN(level)) {
          currentPokemon.level = level;
        }
      } else if (line.startsWith("Shiny:")) {
        currentPokemon.shiny =
          line.replace("Shiny:", "").trim().toLowerCase() === "yes";
      } else if (line.startsWith("Tera Type:")) {
        currentPokemon.teraType = line.replace("Tera Type:", "").trim();
      } else if (line.startsWith("EVs:")) {
        const evs: Record<string, number> = {};
        const evString = line.replace("EVs:", "").trim();

        // Parse format: "244 HP / 36 Def / 4 SpA / 220 SpD / 4 Spe"
        const evPairs = evString.split("/");

        for (const pair of evPairs) {
          const match = pair.trim().match(/(\d+)\s+(.+)/);
          if (match) {
            const value = parseInt(match[1]);
            const stat = match[2].trim();
            if (!isNaN(value)) {
              evs[stat] = value;
            }
          }
        }
        currentPokemon.evs = evs;
      } else if (line.startsWith("IVs:")) {
        const ivs: Record<string, number> = {};
        const ivString = line.replace("IVs:", "").trim();
        const ivPairs = ivString.split("/");

        for (const pair of ivPairs) {
          const match = pair.trim().match(/(\d+)\s+(.+)/);
          if (match) {
            const value = parseInt(match[1]);
            const stat = match[2].trim();
            if (!isNaN(value)) {
              ivs[stat] = value;
            }
          }
        }
        currentPokemon.ivs = ivs;
      } else if (line.endsWith("Nature")) {
        currentPokemon.nature = line.replace("Nature", "").trim();
      } else if (line.startsWith("-") || line.startsWith("•")) {
        // Move entry
        const move = line.replace(/^[-•]\s*/, "").trim();
        if (move && currentPokemon.moves.length < 4) {
          currentPokemon.moves.push(move);
        }
      }
    }
  }

  // Add the last Pokemon if exists
  if (currentPokemon) {
    pokemon.push(currentPokemon);
  }

  return {
    title: title || "Untitled Team",
    author: author || "",
    format,
    pokemon,
  };
}
