# 📝 Most immediate things to-do list

- ### High priority
    - 🐛 [Should be fixed] Picking up certain items in Fight or Flight is still broken. Workaround is leave encounter. 
    - 🐛 [Should be fixed] Modifiers that are applied to pokemon get skipped in Fight or Flight.
    - ⚙️ Dark deal boss fight should have rewards phase to allow for healing after it 🛠️
    - ⚖️ Determine whether Dark Deal should exclude egg-locked mythicals from pool (mew, deoxys, manaphy, etc.) 🛠️

- ### Medium priority
    - 🐛 [Should be fixed] Wave seed generates different encounter data if you roll to a new wave, see the spawned stuff, and refresh the app
    - 🐛 [Should be fixed] Type-buffing items (like Silk Scarf) get swapped around when offered as a reward in Fight or Flight
    - ⚙️ Boss gets +1 to all stats if it catches you stealing (Fight or Flight ME) ️✔️
    - ⚙️ Add some spacing logic to MEs spawning so you don't get floods/droughts of MEs ️✔️
    - ⚙️ Hardcode that the same ME can't happen twice in a row -- boring and sometimes too rough 🛠️

- ### Low priority
    - 🐛 Mysterious Challengers can spawn two trainers (or three) of the same type [Dev comment: not a bug]
    - 🐛 Fight or Flight intro visuals may show different gender from the actual spawned pokemon
    - 🐛 [Should be fixed] Tooltip bug in Events. When showing the tooltip of the 2nd or later Event you've found, the tooltip for the first option will match whatever option you selected in the previous Event. This wrong tooltip gets overriden once you move the cursor.
      - Example: if you chose the hardest battle in Mysterious Challenger, and then roll into a 'Fight or Flight' Event, the option 'Fight' will show 'Brutal Battle, Great Reward'.


# 📝 Things to be done before Mystery Encounters ("MEs/Events") MVP is finished:
  All the things on this list should be done before the merge as a MVP (Minimum Viable Product) release.

- ## Bugless implementation of the MVP MEs
  - Establish placeholder waves for MEs to happen ✔️
  - Bug-free implementation of Common ME 1 ('Mysterious Chest')✔️
  - Bug-free implementation of Common ME 2 ('Fight or Flight')✔️
  - Bug-free implementation of Rare ME 1 ('Mysterious Challenger')✔️
  - Bug-free implementation of Rare ME 2 ('Sleeping Snorlax') 🛠️
  - Bug-free implementation of Legendary ME 1 ('Dark Deal') ✔️

- ## First round of playtesting (Alpha)
  - Establish a placeholder odd for MEs to happen closer to real implementation ❌
  - Find and eliminate as many bugs as possible 🛠️
  - Tweak odds of ME spawn if needed ❌
  - Tweak difficulty/rewards balance in MEs 🛠️

  ## Translation of MEs after playtest/balance
  - EN localisation 🛠️
  - ES localisation 🛠️


# 🧬 Deep dive into Events and what has been done so far

Events (referred to as 'Mysterious Encounters, MEs' in the code) aim to be an addition to PokeRogue that will fundamentally shift the way PokéRogue feels. It looks to improve the bet of the game into the RogueLike genre without touching the core gameplay loop of Pokémon battles/collection that we know and love already in this game. Below there are some specifications that clarify what's being worked on for ease of access for the devs, balance team, artists and others who may be interested. Beware of spoilers!

## An Event __**always has**__:
  ### #️⃣ A wave index where they're happening -- each ME takes up a whole wave (means you miss a combat!).

  ### 💬 Dialogue:
    - Dialogue/Message content populated in relevant locales files (namely locales/mystery-encounter.ts) 
    - An associated EncounterTypeDialogue object populated in allMysteryEncounterDialogue (see data/mystery-ecounter-dialogue.ts) 
      - This will require certain content, such as encounter description window text and option button labels, while some other fields will be optional
      - Key content to be aware of when writing encounter dialogue:
        - Intro dialogue or messages (shown before anything appears on screen) 
        - A title (shown in description box) 
        - A description (shown in description box) 
        - A prompt/query to the player, to choose the options (shown in description box) 
        - An option panel at the bottom, taking the space of what usually is the game dialogs + controls 
          - Containing at least two options, and up to four. 
    - ❗❗ To view what dialogue content is __**mandatory**__ for encounters, check the schema in data/mystery-ecounter-dialogue.ts

  ### 🕺 Intro Visuals:
    - One or multiple sprites may be used. They will slide onto the field when the encounter starts 
      - 📚 This could be anything from a group of trainers, to a Pokemon, to a static sprite of an inanimate object
    - ❗❗ To populate an encounter with intro visuals, see "Encounter Class Extending MysteryEncounterWrapper" section
      - 📚 Technically, the encounter will still work if Intro Visuals are not provided, but your encounter will look very strange when an empty field slides onto the screen

  ### 📋 Encounter Class Implementing MysteryEncounterWrapper
    - ❗❗ All encounters should have their own class files organized in the src/data/mystery-encounters folder
    - ❗❗ Encounter classes can be named anything, but **must implement MysteryEncounterWrapper**
      - Refer to existing MEs for examples
    - ❗❗ As part of MysteryEncounterWrapper, they should implement their own get() function
      - 📚 The get() function should return an object that is some concrete extension of class MysteryEncounter
        - Example: can return a new OptionSelectMysteryEncounter()
      - ❗❗ **This MysteryEncounter type class will be where all encounter functional/business logic will reside**
        - 📚 That includes things like, what intro visuals to display, what each option does (is it a battle, getting items, skipping the encounter, etc.)
        - 📚 It will also serve as the way to pull data from the encounter class when starting the game
    - ❗❗ A new instance of this encounter class should be added to the initMysteryEncounters() function inside data/mystery-encounter.ts
  
  ### 🌟 **Rarity** tier of the ME, common by default.
    - ⚪ Common pool 
    - 🔵 Rare pool 
    - 🟣 Epic pool
    - 🟡 Legendary pool

  ### **Optional Requirements** for Mystery Encounters.
  - 🛠️ They give granular control over whether encounters will spawn in certain situations
  - Requirements might include: 
    - Being within a wave range
    - Being a range of wave X-Y
    - Having X amount of $$$
    - Having X-Y party members (similar to catching logic?) ✔️/❌ (PARTIALLY COMPLETE)

  ### **MysteryEncounterOptions** 
    When selected, execute the custom logic passed in the **onSelect** function. Some **MysteryEncounterOptions** could be as simple as giving the player a pokéball, and others could be a few functions chained together, like "fight a battle, and get an item if you win"

  ### **Functions/ Helper functions** defined in __/utils/mystery-encounter-utils.ts__ for ME to happen, if applicable. They can be:
    - Giving the player X item ✔️
    - Giving the player X item from a certain tier ✔️
    - Letting the player choose from items ✔️
    - Letting the player choose from X items from a certain tier ✔️
    - Start a combat encounter with a trainer ✔️
    - Start a combat encounter with a wild pokémon (from biome) ✔️
    - Start a combat encounter with a boss wild pokémon ✔️
    - XP to the whole party ✔️
    - Remove a PKMN from the player's party ✔️
    - Steal from player ❌

# 📝 Known bugs (squash 'em all!):
  - ## 🔴 __**Really bad ones**__
    - 🐛 Picking up certain items in Fight or Flight is still broken. Workaround is leave encounter.
    - 🐛 Modifiers that are applied to pokemon get skipped in Fight or Flight.

  - ## 🟡 __**Bad ones under certain circumstances**__
    - 🐛 Needs further replication : At wave 51, wild PKMN encounter caused a freezed after pressing "ESC" key upon being asked to switch PKMNs
    - 🐛 Wave seed generates different encounter data if you roll to a new wave, see the spawned stuff, and refresh the app
    - 🐛 Type-buffing items (like Silk Scarf) get swapped around when offered as a reward in Fight or Flight

  - ## 🟢 __**Non-game breaking**__
    - Both of these bugs seem to have in common that they don't "forget" their last passed string:
      - 🐛 Scientist will remember the first PKMN it "did the thing on" and never ever forget it, even in future runs. Only affects dialogue.
      - 🐛 Tooltip bug in Events. When showing the tooltip of the 2nd or later Event you've found, the tooltip for the first option will match whatever option you selected in the previous Event. This wrong tooltip gets overriden once you move the cursor.

# 🗿 Other cool things/functionalities that won't make it in the MVP but are planned to accomodate future MEs:

### QoL improvements
- Dialogue references to __**good**__ outcomes will be colored 🟢,  __**bad**__ ones in 🔴 and __**ambiguous**__ or __**mixed**__, in 🟡
  - Helps with quick glances when 5x speed

#### More requirements (with helper functions)
- Having X item
- Having Y amount of X item
- Being in a specific Biome
- A Pokémon X in player's party can learn Y move
- A Pokémon X in player's party knows Y move
- A Pokémon X in player's party has Y ability
- A Pokémon X in player's party belongs to a pre-defined pool (ie. "Ultrabeasts")

#### More outcomes (with helper functions)
- Status one or many Pokémon if your party -- if they can be statused 
- Damage one or many Pokémon in your party 
- Set a hazard (ally or foe side)
- Set a weather 
- Give the player a Pokémon from a pool (useful for reg. professors/traders) 
- XP to a Pokémon (similar to rare candy?) 
- Add logic for choosing a Pokémon from party for some effect (trades, sacrifices, etc) 
- Add logic for awarding exp to the party (outside of a normal combat)
- Encounter/pull a PKMN from a pre-defined pool (ie. "Ultrabeasts")


# Log Documentation

## 12th-13th June
- The 🐛 "Opening the chest simply moves you to a wild battle against nothingness, which you can escape after you get bored of it." is fixed.
- The 🐛 "PKMN Sprites and their HP/lvl bar doesn't get properly recalled when finding an ME or when meeting Rival." is fixed. 
- The 🐛 "Weaker trainers from Mysterious Challenger crashes the game when the reward screen should come out" is fixed.
- The 🐛 "If a ME spawns on the first floor of a new biome (NewBiomeEncounterPhase), intro visuals do not spawn properly" is fixed.
- The 🐛 "Any ME that procs at wave (?)(?)(1) has its sprite removed. Only the sprite is affected." is fixed.
- The 🐛 "Picking a double battle trainer (ie Twins) as your challenge results in a game over, including loss of save." should be fixed.
- Allowed catch in "Fight or Flight" -- it was counterintuitive to not allow it as it __is__ a wild PKMN fight.
- More minor 🐛 squashed.
- Pushed Dark Deal ME to a higher wave requirement (+30) as it seems to be functioning (mostly) bugless.
