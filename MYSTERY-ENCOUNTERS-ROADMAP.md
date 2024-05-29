# Things to (eventually) be done for Mystery Encounters ("MEs"):

- Add MEs to gamemodes Classic and Endless (done by @imperialsympathizer at gamemodes.ts)
- MEs need to have a chance to spawn (done by @asdar) (needs revision, has placeholder at floor 3)

- A MEs should always require:
    - A wave index where they're happening -- each ME takes up a whole wave.
    - A sprite (of a Pokémon or trainer you're interacting with)
    - An opening dialogue (that sits where the enemy HP bars would be)
    - An option panel at the bottom, taking the space of what usually is the game dialogs + controls
    - __At least two "choices"__, and up to four.
    - In what Biomes the ME happens, if applicable.
    - Rarity tier of the ME, common by default. 
        Rarities should follow the tiers of Pokémons in Biomes, so "Common, "Rare", "Super Rare" (SR), and "Ultra Rare" (UR).

- "Choices" can call one simple event or multiple. Some events which should be callable in the choices:
    - Force a fight with a Pokémon. Can be a fixed Pokémon o


- A MEs creation "template" of some sort should exist, probably in a file in where all already written MEs exist








Current "Events" Implementation Roadmap:



# Phase 1: Modifying the framework that decides between static floors and wild/trainer encounters
4) Force floor 3 to always be our custom "battle-stage", which I'll name event.
5) Force floor 3's event to always be a Cosmog battle.

# Phase 2: Creating the first Event -- and exiting from it.
6) Remove battle features one by one until only player sprite, Cosmog and menu remains.
7) Instead of a fight, prompt a dialogue from Cosmog, who offers you a Masterball, if you like it (or any other placeholder text).
8) "Fight" option should be "Accept". "Ball" option should be "Refuse".
9) "Pokémon" and "Run" options should not show.
10) "Accept" rewards you the masterball and ends the Event. "Refuse" simply ends it.
11) Move Cosmog's dialogue to be a box to the left of his sprite -- where the HP bars of enemies would be.
12) Move "Accept and "Refuse" options so that they are in box that takes mostly the lower side of the UI, and is divided by four even if only two options are present.
13) Create a "Response" phase, where Cosmog would say something after you've either accepted or refused, before the Event exits.

By this point, we have something that is a non-battle, where player is doing something else than just hitting spacebar to continue (he can make one of two choices). We have also set WHEN this non-battle event happens. Now, I imagine I can start taking out the constants, like the fact that Cosmog is the sprite that needs to show, or the floor where this happens.