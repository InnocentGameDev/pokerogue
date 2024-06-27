import BattleScene from "../../battle-scene";
import { AddPokeballModifierType } from "../../modifier/modifier-type";
import {
  EnemyPartyConfig,
  initBattleWithEnemyConfig,
  getRandomSpeciesByEggTier,
  leaveEncounterWithoutBattle,
  getRandomPlayerPokemon
} from "./mystery-encounter-utils";
import MysteryEncounter, { MysteryEncounterBuilder } from "../mystery-encounter";
import {ModifierRewardPhase} from "#app/phases";
import { getPokemonSpecies } from "../pokemon-species";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { PokeballType } from "../pokeball";
import {PartySizeRequirement, WaveCountRequirement} from "../mystery-encounter-requirements";
import { MysteryEncounterOptionBuilder } from "../mystery-encounter-option";
import {EggTier} from "#enums/egg-type";
import {Type} from "#app/data/type";

export const DarkDealEncounter: MysteryEncounter = new MysteryEncounterBuilder()
  .withEncounterType(MysteryEncounterType.DARK_DEAL)
  .withIntroSpriteConfigs([
    {
      spriteKey: "mad_scientist_m",
      fileRoot: "mystery-encounters",
      hasShadow: true
    },
    {
      spriteKey: "dark_deal_porygon",
      fileRoot: "mystery-encounters",
      hasShadow: true,
      repeat: true
    }
  ])
  .withRequirement(new WaveCountRequirement([30, 180])) // waves 30 to 180
  .withRequirement(new PartySizeRequirement([2, 6])) // Must have at least 2 pokemon in party
  .withCatchAllowed(true)
  .withOption(new MysteryEncounterOptionBuilder()
    .withPreOptionPhase((scene: BattleScene) => {
      // Removes random pokemon (including fainted) from party and adds name to dialogue data tokens
      // Will never return last battle able mon and instead pick fainted/unable to battle
      const removedPokemon = getRandomPlayerPokemon(scene, false, true);
      scene.removePokemonFromPlayerParty(removedPokemon);
      scene.currentBattle.mysteryEncounter.dialogueTokens.push([/@ec\{pokeName\}/gi, removedPokemon.name]);

      // Store removed pokemon types
      scene.currentBattle.mysteryEncounter.misc = [removedPokemon.species.type1];
      if (removedPokemon.species.type2) {
        scene.currentBattle.mysteryEncounter.misc.push(removedPokemon.species.type2);
      }
    })
    .withOptionPhase(async (scene: BattleScene) => {
      // Give the player 5 Rogue Balls
      scene.unshiftPhase(new ModifierRewardPhase(scene, () => new AddPokeballModifierType("rb", PokeballType.ROGUE_BALL, 5)));

      // Start encounter with random legendary (7-10 starter strength) that has level additive
      const bossTypes = scene.currentBattle.mysteryEncounter.misc as Type[];
      const bossSpecies = getPokemonSpecies(getRandomSpeciesByEggTier(scene, [EggTier.ULTRA, EggTier.MASTER], bossTypes));
      const config: EnemyPartyConfig = {
        levelAdditiveMultiplier: 1,
        pokemonConfigs: [{species: bossSpecies, isBoss: true}]
      };
      return initBattleWithEnemyConfig(scene, config);
    })
    .build())
  .withOption(new MysteryEncounterOptionBuilder()
    .withOptionPhase(async (scene: BattleScene) => {
      // Leave encounter with no rewards or exp
      leaveEncounterWithoutBattle(scene);
      return true;
    })
    .build())
  .build();
