import { PlayerPokemon } from "#app/field/pokemon";
import { ModifierType, PokemonHeldItemModifierType } from "#app/modifier/modifier-type";
import BattleScene from "../battle-scene";
import { isNullOrUndefined } from "../utils";
import { Abilities } from "./enums/abilities";
import { Moves } from "./enums/moves";
import { Species } from "./enums/species";
import { TimeOfDay } from "./enums/time-of-day";
import { Nature } from "./nature";
import { EvolutionItem, pokemonEvolutions } from "./pokemon-evolutions";
import { FormChangeItem, SpeciesFormChangeItemTrigger, pokemonFormChanges } from "./pokemon-forms";
import { SpeciesFormKey } from "./pokemon-species";
import { Status } from "./status-effect";
import { WeatherType } from "./weather";

export interface EncounterRequirement {
  meetsRequirement(scene: BattleScene): boolean; // Boolean to see if a requirement is met
}

export interface EncounterPokemonRequirement extends EncounterRequirement {
  // TODO: This could probably be an abstract class, since all the meetsRequirements ends up looking the same. Need to figure out generic array typing though
  // One could even abstract everything but the comparator function and just pass that in as a callback.
  minNumberOfPokemon:number;
  invertQuery:boolean;
  // Returns all party members that are compatible with this requirement. For non pokemon related requirements, the entire party is returned..
  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[];

}

export class WaveCountRequirement implements EncounterRequirement {
  waveRange: [number, number];

  /**
   * Used for specifying a unique wave or wave range requirement
   * If minWaveIndex and maxWaveIndex are equivalent, will check for exact wave number
   * @param waveRange - [min, max]
   */
  constructor(waveRange: [number, number]) {
    this.waveRange = waveRange;
  }

  meetsRequirement(scene: BattleScene): boolean {
    if (!isNullOrUndefined(this?.waveRange) && this.waveRange?.[0] <= this.waveRange?.[1]) {
      const waveIndex = scene.currentBattle.waveIndex;
      if (waveIndex >= 0 && (this?.waveRange?.[0] >= 0 && this.waveRange?.[0] > waveIndex) || (this?.waveRange?.[1] >= 0 && this.waveRange?.[1] < waveIndex)) {
        return false;
      }
    }


    return true;
  }
}

export class TimeOfDayRequirement implements EncounterRequirement {
  requiredTimeOfDay?: TimeOfDay[];

  constructor(timeOfDay: TimeOfDay | TimeOfDay[]) {
    if (timeOfDay instanceof Array) {
      this.requiredTimeOfDay = timeOfDay;
    } else {
      this.requiredTimeOfDay.push(timeOfDay);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const timeOfDay = scene.arena?.getTimeOfDay();
    if (!isNullOrUndefined(timeOfDay) && this?.requiredTimeOfDay?.length > 0 && !this.requiredTimeOfDay.includes(timeOfDay)) {
      return false;
    }

    return true;
  }
}

export class WeatherRequirement implements EncounterRequirement {
  requiredWeather?: WeatherType[];

  constructor(weather: WeatherType | WeatherType[]) {
    if (weather instanceof Array) {
      this.requiredWeather = weather;
    } else {
      this.requiredWeather.push(weather);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const currentWeather = scene.arena?.weather?.weatherType;
    if (!isNullOrUndefined(currentWeather) && this?.requiredWeather?.length > 0 && !this.requiredWeather.includes(currentWeather)) {
      return false;
    }

    return true;
  }
}
export class PartySizeRequirement implements EncounterRequirement {
  partySizeRange: [number, number];

  /**
   * Used for specifying a party size requirement
   * If min and max are equivalent, will check for exact size
   * @param partySizeRange - [min, max]
   */
  constructor(partySizeRange: [number, number]) {
    this.partySizeRange = partySizeRange;
  }

  meetsRequirement(scene: BattleScene): boolean {
    if (!isNullOrUndefined(this?.partySizeRange) && this.partySizeRange?.[0] <= this.partySizeRange?.[1]) {
      const partySize = scene.getParty().length;
      if (partySize >= 0 && (this?.partySizeRange?.[0] >= 0 && this.partySizeRange?.[0] > partySize) || (this?.partySizeRange?.[1] >= 0 && this.partySizeRange?.[1] < partySize)) {
        return false;
      }
    }

    return true;
  }
}

export class PersistentModifierRequirement implements EncounterRequirement {
  requiredItems?: ModifierType[]; // TODO: not implemented
  constructor(item: ModifierType | ModifierType[]) {
    if (item instanceof Array) {
      this.requiredItems = item;
    } else {
      this.requiredItems.push(item);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const items = scene.modifiers;

    if (!isNullOrUndefined(items) && this?.requiredItems.length > 0 && this.requiredItems.filter((searchingMod) =>
      items.filter((itemInScene) => itemInScene.type.id === searchingMod.id).length > 0).length === 0) {
      return false;
    }
    return true;
  }
}

export class MoneyRequirement implements EncounterRequirement {
  requiredMoney: number;

  constructor(requiredMoney: number) {
    this.requiredMoney = requiredMoney;
  }

  meetsRequirement(scene: BattleScene): boolean {
    const money = scene.money;
    if (!isNullOrUndefined(money) && this?.requiredMoney > 0 && this.requiredMoney > money) {
      return false;
    }
    return true;
  }
}

export class SpeciesRequirement implements EncounterPokemonRequirement {
  requiredSpecies: Species[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(species: Species | Species[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (species instanceof Array) {
      this.requiredSpecies = species;
    } else {
      this.requiredSpecies.push(species);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredSpecies?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredSpecies.filter((species) => pokemon.species.speciesId === species).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed speciess
      return partyPokemon.filter((pokemon) => this.requiredSpecies.filter((species) => pokemon.species.speciesId === species).length === 0);
    }
  }
}


export class NatureRequirement implements EncounterPokemonRequirement {
  requiredNature: Nature[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(nature: Nature | Nature[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (nature instanceof Array) {
      this.requiredNature = nature;
    } else {
      this.requiredNature.push(nature);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredNature?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredNature.filter((nature) => pokemon.nature === nature).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed natures
      return partyPokemon.filter((pokemon) => this.requiredNature.filter((nature) => pokemon.nature === nature).length === 0);
    }
  }
}


export class MoveRequirement implements EncounterPokemonRequirement {
  requiredMoves: Moves[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(moves: Moves | Moves[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (moves instanceof Array) {
      this.requiredMoves = moves;
    } else {
      this.requiredMoves.push(moves);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredMoves?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredMoves.filter((reqMove) => pokemon.moveset.filter((move) => move.moveId === reqMove).length > 0).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed moves
      return partyPokemon.filter((pokemon) => this.requiredMoves.filter((reqMove) => pokemon.moveset.filter((move) => move.moveId === reqMove).length === 0).length === 0);
    }
  }
}

/**
 * Find out if Pokemon in the party are able to learn one of many specific moves by TM.
 * NOTE: Egg moves are not included as learnable.
 * NOTE: If the Pokemon already knows the move, this requirement will fail, since it's not technically learnable.
 */
export class CanLearnMoveRequirement implements EncounterPokemonRequirement {
  requiredMoves: Moves[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(learnableMove: Moves | Moves[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (learnableMove instanceof Array) {
      this.requiredMoves = learnableMove;
    } else {
      this.requiredMoves.push(learnableMove);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredMoves?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredMoves.filter((learnableMove) => pokemon.compatibleTms.filter(tm => !pokemon.moveset.find(m => m.moveId === tm)).includes(learnableMove)).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed learnableMoves
      return partyPokemon.filter((pokemon) => this.requiredMoves.filter((learnableMove) => pokemon.compatibleTms.filter(tm => !pokemon.moveset.find(m => m.moveId === tm)).includes(learnableMove)).length === 0);
    }
  }

}

export class EvolutionTargetSpeciesRequirement implements EncounterPokemonRequirement {
  requiredEvolutionTargetSpecies: Species[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(evolutionTargetSpecies: Species | Species[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (evolutionTargetSpecies instanceof Array) {
      this.requiredEvolutionTargetSpecies = evolutionTargetSpecies;
    } else {
      this.requiredEvolutionTargetSpecies.push(evolutionTargetSpecies);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredEvolutionTargetSpecies?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredEvolutionTargetSpecies.filter((evolutionTargetSpecies) => pokemon.getEvolution().speciesId === evolutionTargetSpecies).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed evolutionTargetSpeciess
      return partyPokemon.filter((pokemon) => this.requiredEvolutionTargetSpecies.filter((evolutionTargetSpecies) => pokemon.getEvolution().speciesId === evolutionTargetSpecies).length === 0);
    }
  }

}

export class AbilityRequirement implements EncounterPokemonRequirement {
  requiredAbilities: Abilities[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(abilities: Abilities | Abilities[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (abilities instanceof Array) {
      this.requiredAbilities = abilities;
    } else {
      this.requiredAbilities.push(abilities);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredAbilities?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredAbilities.filter((abilities) => pokemon.hasAbility(abilities)).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed abilitiess
      return partyPokemon.filter((pokemon) => this.requiredAbilities.filter((abilities) => pokemon.hasAbility(abilities)).length === 0);
    }
  }
}

export class StatusRequirement implements EncounterPokemonRequirement {
  requiredStatus: Status[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(status: Status | Status[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (status instanceof Array) {
      this.requiredStatus = status;
    } else {
      this.requiredStatus.push(status);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredStatus?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredStatus.filter((status) => pokemon.status === status).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed statuss
      return partyPokemon.filter((pokemon) => this.requiredStatus.filter((status) => pokemon.status === status).length === 0);
    }
  }
}

/**
 * Finds if there are pokemon that can form change with a given item.
 * Notice that we mean specific items, like Charizardite, not the Mega Bracelet.
 * If you want to trigger the event based on the form change enabler, use PersistentModifierRequirement.
 */
export class CanFormChangeWithItemRequirement implements EncounterPokemonRequirement {
  requiredFormChangeItem: FormChangeItem[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(formChangeItem: FormChangeItem | FormChangeItem[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (formChangeItem instanceof Array) {
      this.requiredFormChangeItem = formChangeItem;
    } else {
      this.requiredFormChangeItem.push(formChangeItem);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredFormChangeItem?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    const filterByForm = (pokemon, formChangeItem) =>  {
      if (pokemonFormChanges.hasOwnProperty(pokemon.species.speciesId)
      // Get all form changes for this species with an item trigger, including any compound triggers
      && pokemonFormChanges[pokemon.species.speciesId].filter(fc => fc.trigger.hasTriggerType(SpeciesFormChangeItemTrigger))
      // Returns true if any form changes match this item
        .map(fc => fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger)
        .flat().flatMap(fc => fc.item).includes(formChangeItem))  {
        return true;
      } else {
        return false;
      }
    };

    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredFormChangeItem.filter((formChangeItem) => filterByForm(pokemon, formChangeItem)).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed formChangeItems
      return partyPokemon.filter((pokemon) => this.requiredFormChangeItem.filter((formChangeItem) => filterByForm(pokemon, formChangeItem)).length === 0);
    }
  }

}

export class CanEvolveWithItemRequirement implements EncounterPokemonRequirement {
  requiredEvolutionItem: EvolutionItem[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(evolutionItems: EvolutionItem | EvolutionItem[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (evolutionItems instanceof Array) {
      this.requiredEvolutionItem = evolutionItems;
    } else {
      this.requiredEvolutionItem.push(evolutionItems);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredEvolutionItem?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    const filterByEvo = (pokemon, evolutionItem) =>  {
      if (pokemonEvolutions.hasOwnProperty(pokemon.species.speciesId) && pokemonEvolutions[pokemon.species.speciesId].filter(e => e.item === evolutionItem
        && (!e.condition || e.condition.predicate(pokemon))).length && (pokemon.getFormKey() !== SpeciesFormKey.GIGANTAMAX)) {
        return true;
      } else if (pokemon.isFusion() && pokemonEvolutions.hasOwnProperty(pokemon.fusionSpecies.speciesId) && pokemonEvolutions[pokemon.fusionSpecies.speciesId].filter(e => e.item === evolutionItem
      && (!e.condition || e.condition.predicate(pokemon))).length && (pokemon.getFusionFormKey() !== SpeciesFormKey.GIGANTAMAX)) {
        return true;
      }
      return false;
    };

    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredEvolutionItem.filter((evolutionItem) => filterByEvo(pokemon, evolutionItem)).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed evolutionItemss
      return partyPokemon.filter((pokemon) => this.requiredEvolutionItem.filter((evolutionItems) => filterByEvo(pokemon, evolutionItems)).length === 0);
    }
  }
}

export class HeldItemRequirement implements EncounterPokemonRequirement {
  requiredHeldItemModifier: PokemonHeldItemModifierType[];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(heldItem: PokemonHeldItemModifierType | PokemonHeldItemModifierType[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    if (heldItem instanceof Array) {
      this.requiredHeldItemModifier = heldItem;
    } else {
      this.requiredHeldItemModifier.push(heldItem);
    }
  }

  meetsRequirement(scene: BattleScene): boolean {
    const partyPokemon = scene.getParty();
    if (!isNullOrUndefined(partyPokemon) && this?.requiredHeldItemModifier?.length > 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => this.requiredHeldItemModifier.filter((heldItem) => pokemon.getHeldItems().filter((it) => it.type.id === heldItem.id).length > 0).length > 0);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed heldItems
      return partyPokemon.filter((pokemon) => this.requiredHeldItemModifier.filter((heldItem) => pokemon.getHeldItems().filter((it) => it.type.id === heldItem.id).length === 0).length === 0);
    }
  }

}


export class LevelRequirement implements EncounterPokemonRequirement {
  requiredLevelRange?: [number, number];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(requiredLevelRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredLevelRange = requiredLevelRange;

  }

  meetsRequirement(scene: BattleScene): boolean {
    // Party Pokemon inside required level range
    if (!isNullOrUndefined(this?.requiredLevelRange) && this.requiredLevelRange?.[0] <= this.requiredLevelRange?.[1]) {
      const partyPokemon = scene.getParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => pokemon.level >= this.requiredLevelRange[0] && pokemon.level <= this.requiredLevelRange[1]);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredLevelRanges
      return partyPokemon.filter((pokemon) => pokemon.level < this.requiredLevelRange[0] || pokemon.level > this.requiredLevelRange[1]);
    }
  }
}

export class FriendshipRequirement implements EncounterPokemonRequirement {
  requiredFriendshipRange?: [number, number];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(requiredFriendshipRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredFriendshipRange = requiredFriendshipRange;
  }

  meetsRequirement(scene: BattleScene): boolean {
    // Party Pokemon inside required friendship range
    if (!isNullOrUndefined(this?.requiredFriendshipRange) && this.requiredFriendshipRange?.[0] <= this.requiredFriendshipRange?.[1]) {
      const partyPokemon = scene.getParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => pokemon.friendship >= this.requiredFriendshipRange[0] && pokemon.friendship <= this.requiredFriendshipRange[1]);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredFriendshipRanges
      return partyPokemon.filter((pokemon) => pokemon.friendship < this.requiredFriendshipRange[0] || pokemon.friendship > this.requiredFriendshipRange[1]);
    }
  }
}

/**
 * .1 -> 10% hp
 * .5 -> 50% hp
 * 1 -> 100% hp
 */
export class HealthRatioRequirement implements EncounterPokemonRequirement {
  requiredHealthRange?: [number, number];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(requiredHealthRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredHealthRange = requiredHealthRange;
  }

  meetsRequirement(scene: BattleScene): boolean {
    // Party Pokemon inside required level range
    if (!isNullOrUndefined(this?.requiredHealthRange) && this.requiredHealthRange?.[0] <= this.requiredHealthRange?.[1]) {
      const partyPokemon = scene.getParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => pokemon.getHpRatio() >= this.requiredHealthRange[0] && pokemon.getHpRatio() <= this.requiredHealthRange[1]);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredHealthRanges
      return partyPokemon.filter((pokemon) => pokemon.getHpRatio() < this.requiredHealthRange[0] || pokemon.getHpRatio() > this.requiredHealthRange[1]);
    }
  }
}

export class WeightRequirement implements EncounterPokemonRequirement {
  requiredWeightRange?: [number, number];
  minNumberOfPokemon:number;
  invertQuery:boolean;

  constructor(requiredWeightRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredWeightRange = requiredWeightRange;
  }

  meetsRequirement(scene: BattleScene): boolean {
    // Party Pokemon inside required friendship range
    if (!isNullOrUndefined(this?.requiredWeightRange) && this.requiredWeightRange?.[0] <= this.requiredWeightRange?.[1]) {
      const partyPokemon = scene.getParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => pokemon.getWeight() >= this.requiredWeightRange[0] && pokemon.getWeight() <= this.requiredWeightRange[1]);
    } else {
      // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredWeightRanges
      return partyPokemon.filter((pokemon) => pokemon.getWeight() < this.requiredWeightRange[0] || pokemon.getWeight() > this.requiredWeightRange[1]);
    }
  }
}
