import json
import os

import pokebase
from requests.exceptions import HTTPError


def load_pokemon(_cachedir):
    cachedir = os.path.join(_cachedir, "pokemon")
    os.makedirs(cachedir, exist_ok=True)
    pokemon = {}

    try:
        pokedex_number = 0
        while True:
            pokedex_number += 1
            print(pokedex_number)

            pokefile = os.path.join(cachedir, f"{pokedex_number}.json")
            if os.path.isfile(pokefile):
                with open(pokefile) as f:
                    pokemon[pokedex_number] = json.load(f)
                continue

            species = pokebase.pokemon(pokedex_number)
            abilities = {1: None, 2: None, 3: None}
            for ability in species.abilities:
                abilities[ability.slot] = ability.ability.name
            types = {1: None, 2: None}
            for _type in species.types:
                types[_type.slot] = _type.type.name

            sprite = species.sprites.front_default
            pokemon[pokedex_number] = {
                "abilities": abilities,
                "sprite": sprite,
                "name": species.name.title(),
                "types": types
            }

            with open(pokefile, "w") as f:
                json.dump(pokemon[pokedex_number], f)
    except HTTPError:
        return pokemon


def main(cachedir):
    print("pokeapi")
    pokemon = load_pokemon(cachedir)
    cachefile = os.path.join(cachedir, "pokemon.json")

    if os.path.isfile(cachefile):
        return cachefile

    with open(cachefile, "w") as f:
        json.dump(pokemon, f, indent=4)

    return cachefile
