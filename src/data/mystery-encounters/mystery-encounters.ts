import MysteryEncounter from "../mystery-encounter";
import {DarkDealEncounter} from "./dark-deal";
import {MysteriousChallengersEncounter} from "./mysterious-challengers";
import {MysteriousChestEncounter} from "./mysterious-chest";
import {FightOrFlightEncounter} from "#app/data/mystery-encounters/fight-or-flight";
import { Biome } from "../enums/biome";


// Only add your MysterEncounter here if you want it to be in every biome.
// We recommend designing biome-specific encounters for better flavor and variance
export function initMysteryEncounters() {
  for (const biome of mysteryEncountersByBiome.keys()) {
    mysteryEncountersByBiome.get(biome).push(
      MysteriousChallengersEncounter,
      MysteriousChestEncounter,
      DarkDealEncounter,
      FightOrFlightEncounter
    );
  }
}


// Add your MysteryEncounter to a biome to enable it to show up in that biome.
export const mysteryEncountersByBiome = new Map<Biome, MysteryEncounter[]>([
  [Biome.TOWN, [

  ]],
  [Biome.PLAINS,[

  ]],
  [Biome.GRASS, [

  ]],
  [Biome.TALL_GRASS, [

  ]],
  [Biome.METROPOLIS, [

  ]],
  [Biome.FOREST, [
  ]],
  [Biome.SEA, [

  ]],
  [Biome.SWAMP, [

  ]],
  [Biome.BEACH, [

  ]],
  [Biome.LAKE, [

  ]],
  [Biome.SEABED, [

  ]],
  [Biome.MOUNTAIN, [
  ]],
  [Biome.BADLANDS, [

  ]],
  [Biome.CAVE, [

  ]],
  [Biome.DESERT, [

  ]],
  [Biome.ICE_CAVE, [

  ]],
  [Biome.MEADOW, [

  ]],
  [Biome.POWER_PLANT, [

  ]],
  [Biome.VOLCANO, [

  ]],
  [Biome.GRAVEYARD, [

  ]],
  [Biome.DOJO, [

  ]],
  [Biome.FACTORY, [

  ]],
  [Biome.RUINS, [

  ]],
  [Biome.WASTELAND, [

  ]],
  [Biome.ABYSS, [

  ]],
  [Biome.SPACE, [

  ]],
  [Biome.CONSTRUCTION_SITE, [

  ]],
  [Biome.JUNGLE, [
  ]],
  [Biome.FAIRY_CAVE, [

  ]],
  [Biome.TEMPLE, [

  ]],
  [Biome.SLUM, [

  ]],
  [Biome.SNOWY_FOREST, [

  ]],
  [Biome.ISLAND, [

  ]],
  [Biome.LABORATORY, [

  ]]
]);


