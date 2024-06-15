import { PlayerPokemon } from "#app/field/pokemon";
import * as Utils from "../utils";
import BattleScene from "../battle-scene";
import { EncounterPokemonRequirement, EncounterRequirement, EncounterSceneRequirement } from "./mystery-encounter-requirements";

export default interface MysteryEncounterOption {
  requirements?: EncounterSceneRequirement[];
  protagonistPokemonRequirements?: EncounterPokemonRequirement[];
  supportPokemonRequirements ?: EncounterPokemonRequirement[];
  protagonistPokemon?: PlayerPokemon;
  supportingPokemon?: PlayerPokemon[];
  // Executes before any following dialogue or business logic from option. Cannot be async. Usually this will be for calculating dialogueTokens or performing data updates
  onPreOptionPhase?: (scene: BattleScene) => void | boolean;
  // Business logic for option
  onOptionPhase?: (scene: BattleScene) => Promise<void | boolean>;
  // Executes after the encounter is over. Cannot be async. Usually this will be for calculating dialogueTokens or performing data updates
  onPostOptionPhase?: (scene: BattleScene) => void | boolean;
}

export default class MysteryEncounterOption implements MysteryEncounterOption {
  constructor(option: MysteryEncounterOption) {
    Object.assign(this, option);
    this.requirements = this.requirements ? this.requirements : [];
  }

  meetsRequirements?(scene: BattleScene) {
    return !this.requirements.some(requirement => !requirement.meetsRequirement(scene));
  }

  meetsProtagonistRequirementAndProtagonistPokemonSelected?(scene: BattleScene) {
    if (!this.protagonistPokemonRequirements) {
      return true;
    }

    let qualified:PlayerPokemon[] = scene.getParty();
    for (const req of this.protagonistPokemonRequirements) {
      if (req.meetsRequirement(scene)) {
        if (req instanceof EncounterPokemonRequirement)  {
          qualified = qualified.filter(pkmn => req.queryParty(scene.getParty()).includes(pkmn));
        }
      } else {
        this.protagonistPokemon = null;
        return false;
      }
    }
    this.protagonistPokemon = qualified[Utils.randSeedInt(qualified.length, 0)];
    return true;
  }

  meetsSupportingRequirementAndSupportingPokemonSelected?(scene: BattleScene) {
    if (!this.supportPokemonRequirements) {
      return true;
    }

    let qualified:PlayerPokemon[] = scene.getParty();
    for (const req of this.supportPokemonRequirements) {
      if (req.meetsRequirement(scene)) {
        if (req instanceof EncounterPokemonRequirement)  {
          qualified = qualified.filter(pkmn => req.queryParty(scene.getParty()).includes(pkmn));
        }
      } else {
        this.supportingPokemon = [];
        return false;
      }
    }
    this.supportingPokemon = qualified;
    return true;
  }
}

export class MysteryEncounterOptionBuilder implements Partial<MysteryEncounterOption> {
  requirements?: EncounterRequirement[] = [];
  protagonistPokemonRequirements?: EncounterPokemonRequirement[] = [];
  supportPokemonRequirements ?: EncounterPokemonRequirement[] = [];
  onPreOptionPhase?: (scene: BattleScene) => void | boolean;
  onOptionPhase?: (scene: BattleScene) => Promise<void | boolean>;
  onPostOptionPhase?: (scene: BattleScene) => void | boolean;

  withSceneRequirement(requirement: EncounterSceneRequirement): this & Required<Pick<MysteryEncounterOption, "requirements">> {
    this.requirements.push(requirement);
    return Object.assign(this, { requirements: this.requirements });
  }

  withPreOptionPhase(onPreOptionPhase: (scene: BattleScene) => void | boolean): this & Required<Pick<MysteryEncounterOption, "onPreOptionPhase">> {
    return Object.assign(this, { onPreOptionPhase: onPreOptionPhase });
  }

  withOptionPhase(onOptionPhase: (scene: BattleScene) => Promise<void | boolean>): this & Required<Pick<MysteryEncounterOption, "onOptionPhase">> {
    return Object.assign(this, { onOptionPhase: onOptionPhase });
  }

  withPostOptionPhase(onPostOptionPhase: (scene: BattleScene) => void | boolean): this & Required<Pick<MysteryEncounterOption, "onPostOptionPhase">> {
    return Object.assign(this, { onPostOptionPhase: onPostOptionPhase });
  }

  build(this: MysteryEncounterOption) {
    return new MysteryEncounterOption(this);
  }

  withProtagonistPokemonRequirement(requirement: EncounterPokemonRequirement): this & Required<Pick<MysteryEncounterOption, "protagonistPokemonRequirements">> {
    this.protagonistPokemonRequirements.push(requirement);
    return Object.assign(this, { protagonistPokemonRequirements: this.protagonistPokemonRequirements });
  }

  withSupportPokemonRequirement(requirement: EncounterPokemonRequirement): this & Required<Pick<MysteryEncounterOption, "supportPokemonRequirements">> {
    this.supportPokemonRequirements.push(requirement);
    return Object.assign(this, { supportPokemonRequirements: this.supportPokemonRequirements });
  }

}
