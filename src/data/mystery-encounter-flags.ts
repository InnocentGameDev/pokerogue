import * as Utils from "../utils";

export class MysteryEncounterFlags {
  encounteredEvents: number[] = [];
  encounterSpawnChance: number = 0;

  constructor(flags: MysteryEncounterFlags) {
    if (!Utils.isNullOrUndefined(flags)) {
      Object.assign(this, flags);
    }
  }
}
