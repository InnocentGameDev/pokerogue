import BattleScene from "../../battle-scene";
import { AddPokeballModifierType } from "../../modifier/modifier-type";
import { EnemyPartyConfig, initBattleWithEnemyConfig, getRandomSpeciesByEggTier, leaveEncounterWithoutBattle, getRandomPlayerPokemon } from "../../utils/mystery-encounter-utils";
import MysteryEncounter, { MysteryEncounterBuilder } from "../mystery-encounter";
import {ModifierRewardPhase} from "#app/phases";
import { getPokemonSpecies } from "../pokemon-species";
import { Species } from "../enums/species";
import { MysteryEncounterType } from "../enums/mystery-encounter-type";
import { PokeballType } from "../pokeball";
import { EggTier } from "../enums/egg-type";
import {PartySizeRequirement, WaveCountRequirement} from "../mystery-encounter-requirements";
import { MysteryEncounterOptionBuilder } from "../mystery-encounter-option";

export const DarkDealEncounter: MysteryEncounter = new MysteryEncounterBuilder()
  .withEncounterType(MysteryEncounterType.DARK_DEAL)
  .withIntroSpriteConfigs([
    {
      spriteKey: "mad_scientist_m",
      fileRoot: "mystery-encounters",
      hasShadow: true
    },
    {
      spriteKey: Species.PORYGON.toString(),
      fileRoot: "pokemon",
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
    })
    .withOptionPhase(async (scene: BattleScene) => {
      // Give the player 10 Rogue Balls
      scene.unshiftPhase(new ModifierRewardPhase(scene, () => new AddPokeballModifierType("rb", PokeballType.ROGUE_BALL, 5)));

      // Start encounter with random legendary (7-10 starter strength) at +50% level strength
      const bossSpecies = getPokemonSpecies(getRandomSpeciesByEggTier(scene, [EggTier.ULTRA, EggTier.MASTER]));
      const config: EnemyPartyConfig = {
        levelAdditiveMultiplier: 1,
        pokemonBosses: [bossSpecies]
      };
      return initBattleWithEnemyConfig(scene, config);
      //initBattleFromEncounter(scene);
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
