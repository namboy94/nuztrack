import json

from datetime import datetime

from nuztrack.saves.OwnedPokemon import OwnedPokemon

from nuztrack.saves.events.Note import Note

from nuztrack.saves.events.Death import Death

from nuztrack.saves.events.Milestone import Milestone

from nuztrack.saves.events.Evolution import Evolution

from nuztrack.saves.events.Encounter import Encounter

from nuztrack.config.Config import Config
from nuztrack.saves.SaveFile import SaveFile
from nuztrack.enums import NuzlockeRules, Genders

old_path = "/home/hermann/nas/Main/Storage/Games/Saves/Pokemon/Genlockes/50281 - Hermann/Part 3 - Emerald/nuztrack.json"
new_path = "emerald.json"

config = Config()
pokedata = config.pokemon_data

with open(old_path) as f:
    old_data = json.load(f)

SaveFile.create(
    pokedata,
    new_path,
    old_data["title"],
    old_data["game"],
    [
        NuzlockeRules.DEATH,
        NuzlockeRules.FIRST_ENCOUNTER,
        NuzlockeRules.NICKNAME_TEAM,
        NuzlockeRules.DUPLICATE_CLAUSE,
        NuzlockeRules.DUPLICATE_CLAUSE_ENCOUNTERS,
        NuzlockeRules.NO_LEGENDARIES,
        NuzlockeRules.NO_TRADES,
        NuzlockeRules.NO_X_ITEM
    ],
    [],
    "yellow.json"
)

save = SaveFile(new_path, pokedata)

old_pokemon = {}
for nick, pokemon in old_data["pokemon"].items():
    pokemon["nick"] = nick
    old_pokemon[pokemon["location"]] = pokemon

for entry in old_data["log"]:
    if entry["type"] == "encounter":

        pokemon = None
        if entry["location"] in old_pokemon:
            pokemon = old_pokemon[entry["location"]]

        save.register_encounter(Encounter(
            location=entry["location"],
            obtained=entry["captured"],
            level=entry["level"],
            gender={"m": Genders.MALE, "f": Genders.FEMALE, "n": Genders.NEUTRAL}[entry["gender"]],
            pokedex_number=pokedata.get_pokedex_number(entry["pokemon"]),
            timestamp=datetime.fromtimestamp(entry["timestamp"]).strftime("%Y-%m-%d:%H-%M-%S"),
            nickname=None if pokemon is None else pokemon["nick"]
        ))
        if pokemon is not None:
            save.register_catch(OwnedPokemon(
                pokedex_number=pokedata.get_pokedex_number(pokemon["pokemon"]),
                nickname=pokemon["nick"],
                level=pokemon["level"],
                gender={"m": Genders.MALE, "f": Genders.FEMALE, "n": Genders.NEUTRAL}[pokemon["gender"]],
                nature=pokemon["nature"],
                ability=pokemon["ability"],
                in_team=False,
                deceased=False
            ))
    elif entry["type"] == "evolution":
        save.register_evolution(Evolution(
            nickname=entry["nickname"],
            old_species=pokedata.get_pokedex_number(entry["old"]),
            new_species=pokedata.get_pokedex_number(entry["new"]),
            timestamp=datetime.fromtimestamp(entry["timestamp"]).strftime("%Y-%m-%d:%H-%M-%S")
        ))
    elif entry["type"] == "badge":
        number = entry['number']
        if number == 9:
            desc = "Pokemon League"
        elif 9 < number < 18:
            desc = f"Kanto Badge #{number-9}"
        elif number == 18:
            desc = "Defeated Red"
        else:
            desc = f"Badge #{number}"

        save.register_milestone(Milestone(
            description=desc,
            timestamp=datetime.fromtimestamp(entry["timestamp"]).strftime("%Y-%m-%d:%H-%M-%S"))
        )
    elif entry["type"] == "death":
        save.register_death(Death(
            nickname=entry["pokemon"],
            location=entry["location"],
            level=save.get_pokemon(entry["pokemon"]).level,
            opponent=entry["opponent"],
            description=entry["description"],
            timestamp=datetime.fromtimestamp(entry["timestamp"]).strftime("%Y-%m-%d:%H-%M-%S")
        ))
    elif entry["type"] == "text":
        save.register_note(Note(
            text=entry["text"],
            timestamp=datetime.fromtimestamp(entry["timestamp"]).strftime("%Y-%m-%d:%H-%M-%S")
        ))

for nick, pokemon in old_data["pokemon"].items():
    poke = save.get_pokemon(nick)
    poke.in_team = nick in old_data["team"]
    save.update_pokemon(poke)

save.write()
