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
                abilities[ability.slot] = ability.ability.name.replace("-", " ").title()
            types = {1: None, 2: None}
            for _type in species.types:
                types[_type.slot] = _type.type.name.upper()

            sprite = species.sprites.front_default
            evolutions = [x.species.id for x in species.species.evolution_chain.chain.evolves_to]

            pokemon[pokedex_number] = {
                "abilities": {
                    "primary": abilities[1],
                    "secondary": abilities[2],
                    "hidden": abilities[3],
                },
                "sprite": sprite,
                "name": species.name.title(),
                "types": {
                    "primary": types[1],
                    "secondary": types[2]
                },
                "evolutions": evolutions
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
