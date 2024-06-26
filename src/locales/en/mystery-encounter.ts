import { SimpleTranslationEntries } from "#app/plugins/i18n";

export const mysteryEncounter: SimpleTranslationEntries = {

  // Mysterious Encounters -- Common Tier

  "mysterious_chest_intro_message": "You keep going and find...@d{64}\na chest?",
  "mysterious_chest_title": "The Mysterious Chest",
  "mysterious_chest_description": "A beautifully ornamented chest stands on the ground. There must be something good inside... right?",
  "mysterious_chest_query": "Will you open it?",
  "mysterious_chest_option_1_label": "Open it",
  "mysterious_chest_option_1_tooltip": "(?) What could be inside?",
  "mysterious_chest_option_2_label": "It's too risky, leave",
  "mysterious_chest_option_2_tooltip": "(-) No Rewards",
  "mysterious_chest_option_1_selected_message": "You open the chest to find...",
  "mysterious_chest_option_2_selected_message": "You hurry along your way,\nwith a slight feeling of regret.",
  "mysterious_chest_option_1_normal_result": "Just some normal tools and items.",
  "mysterious_chest_option_1_good_result": "Some pretty nice tools and items.",
  "mysterious_chest_option_1_great_result": "A couple great tools and items!",
  "mysterious_chest_option_1_amazing_result": "Whoa! An amazing item!",
  "mysterious_chest_option_1_bad_result": `Oh no!@d{32}\nThe chest was trapped!
  $Your @ec{pokeName} jumps in front of you\nbut is KOed in the process.`,

  // Mysterious Encounters -- Rare Tier

  "mysterious_challengers_intro_message": "Mysterious challengers have appeared!",
  "mysterious_challengers_title": "Mysterious Challengers",
  "mysterious_challengers_description": "If you defeat a challenger, you might impress them enough to receive a boon. But some look tough, are you up to the challenge?",
  "mysterious_challengers_query": "Who will you battle?",
  "mysterious_challengers_option_1_label": "A weak, clever foe",
  "mysterious_challengers_option_1_tooltip": "(+) Standard Battle\n(+) Standard Reward",
  "mysterious_challengers_option_2_label": "A strong foe",
  "mysterious_challengers_option_2_tooltip": "(+) Hard Battle\n(+) Good Reward",
  "mysterious_challengers_option_3_label": "The mightiest foe",
  "mysterious_challengers_option_3_tooltip": "(+) Brutal Battle\n(+) Great Reward",
  "mysterious_challengers_option_selected_message": "The trainer steps forward...",
  "mysterious_challengers_outro_win": "The mysterious challenger was defeated!",

  // Mysterious Encounters -- Epic Tier
  // Gholdengo Gang

  // Mysterious Encounters -- Legendary Tier

  "dark_deal_intro_message": "A strange man in a tattered coat stands in your way...",
  "dark_deal_speaker": "Shady Guy",
  "dark_deal_intro_dialogue": `Hey, you!
    $I've been working on a new device\nto bring out a Pokémon's latent power!
    $It completely rebinds the Pokémon's atoms\nat a molecular level into a far more powerful form.
    $Hehe...@d{64} I just need some sac-@d{32}\nErr, test subjects, to prove it works.`,
  "dark_deal_title": "Dark Deal",
  "dark_deal_description": "The disturbing fellow holds up some Pokéballs.\n\"I'll make it worth your while! You can have these strong Pokéballs as payment, All I need is a Pokémon from your team! Hehe...\"",
  "dark_deal_query": "What will you do?",
  "dark_deal_option_1_label": "Accept", // Give player 10 rogue balls. Remove a random Pokémon from player's party. Fight a legendary Pokémon as a boss
  "dark_deal_option_1_tooltip": "(+) 10 Rogue Balls\n(?) Enhance a Random Pokémon", // Give player 10 rogue balls. Remove a random Pokémon from player's party. Fight a legendary Pokémon as a boss
  "dark_deal_option_2_label": "Refuse",
  "dark_deal_option_2_tooltip": "(-) No Rewards",
  "dark_deal_option_1_selected": `Let's see, that @ec{pokeName} will do nicely!
  $Remember, I'm not responsible\nif anything bad happens!@d{32} Hehe...`,
  "dark_deal_option_1_selected_message": `The man hands you 10 Rogue Balls.
  $@ec{pokeName} hops into the strange machine...
  $Flashing lights and weird noises\nstart coming from the machine!
  $...@d{96} Something emerges\nfrom the device, raging wildly!`,
  "dark_deal_option_2_selected": "Not gonna help a poor fellow out?\nPah!",
  "dark_deal_outro": "After the harrowing encounter,\nyou collect yourself and depart.",

  "fight_or_flight_intro_message": "Something shiny is sparkling on the ground near that Pokémon!",
  "fight_or_flight_title": "Fight or Flight",
  "fight_or_flight_description": "It looks like there's a strong Pokémon guarding an item. Fighting is the straightforward approach, but this Pokémon looks strong. You could also try to sneak around, but the Pokémon may catch you.",
  "fight_or_flight_query": "What will you do?",
  "fight_or_flight_option_1_label": "Fight it",
  "fight_or_flight_option_1_tooltip": "(+) Strong Pokémon Battle\n(+) New Item",
  "fight_or_flight_option_2_label": "Sneak around",
  "fight_or_flight_option_2_tooltip": "(?%) New Item\n(?%) Hard Battle\n(?%) No Rewards",
  "fight_or_flight_option_3_label": "Leave",
  "fight_or_flight_option_3_tooltip": "(-) No Rewards",
  "fight_or_flight_option_1_selected_message": "You approach the\nPokémon without fear.",
  "fight_or_flight_option_2_good_result": `.@d{32}.@d{32}.@d{32}
  $You manage to sneak your way\npast and grab the item!`,
  "fight_or_flight_option_2_bad_result": `.@d{32}.@d{32}.@d{32}
  $The Pokémon catches you\nas you try to sneak around!
  $The item is tossed\nfar into the distance...`,
  "fight_or_flight_option_3_selected": "You leave the strong Pokémon\nwith its prize and continue on.",
  // "fight_or_flight_outro_win": "The mysterious challengers were defeated!",

  "sleeping_snorlax_intro_message": `As you walk down a narrow pathway, you see a towering silhouette blocking your path.
  $You get closer to see a Snorlax sleeping peacefully.\nIt seems like there's no way around it.`,
  "sleeping_snorlax_title": "Sleeping Snorlax",
  "sleeping_snorlax_description": "Do you attack it to try and get it to move, or wait for it to wake up?",
  "sleeping_snorlax_query": "What will you do?",
  "sleeping_snorlax_option_1_label": "Fight it",
  "sleeping_snorlax_option_1_tooltip": "(+) Fight Sleeping Snorlax",
  "sleeping_snorlax_option_2_label": "Wait for it to move",
  "sleeping_snorlax_option_2_tooltip": "(75%) Party member falls asleep\n(25%) All Pokémon healed",
  "sleeping_snorlax_option_3_label": "Steal",
  "sleeping_snorlax_option_3_tooltip": "(+) Leftovers",
  "sleeping_snorlax_option_1_selected_message": "You approach the\nPokémon without fear.",
  "sleeping_snorlax_option_2_selected_message": `.@d{32}.@d{32}.@d{32}
  $You wait for a time, but the Snorlax's yawns make your party sleepy.`,
  "sleeping_snorlax_option_2_good_result": "When you all awaken, the Snorlax is no where to be found - but your Pokémon are all healed!",
  "sleeping_snorlax_option_2_bad_result": `Your @ec{option2ProtagonistName} is still asleep...
  $But on the bright side, the Snorlax left something behind...
  $@s{item_fanfare}You gained a Leftovers!\nApply it to one of your Pokémon.`,
  "sleeping_snorlax_option_3_good_result": "Your @ec{option3ProtagonistName} uses @ec{option3ProtagonistMove}! It steals Leftovers off the sleeping Snorlax and you make out like bandits!",
  // "sleeping_snorlax_outro_win": "The mysterious challengers were defeated!",

} as const;
