import * as Utils from "../utils";
import {MysteryEncounterTier} from "#app/data/mystery-encounter";
import {MysteryEncounterType} from "#enums/mystery-encounter-type";

export class MysteryEncounterFlags {
  encounteredEvents: [MysteryEncounterType, MysteryEncounterTier][] = [];
  encounterSpawnChance: number = 0;

  constructor(flags: MysteryEncounterFlags) {
    if (!Utils.isNullOrUndefined(flags)) {
      Object.assign(this, flags);
    }
  }
}
