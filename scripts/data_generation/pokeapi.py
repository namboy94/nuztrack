import json
import os

import pokebase
from requests.exceptions import HTTPError


def load_evolutions(pokedex_number, chain):
    species_chain = traverse_evolution_chain(chain)[pokedex_number]
    return [x.species.id for x in species_chain.evolves_to]


def traverse_evolution_chain(chain):
    ids = {chain.species.id: chain}
    for subchain in chain.evolves_to:
        ids.update(traverse_evolution_chain(subchain))
    return ids


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

            if species.species.evolution_chain is None:
                break

            abilities = {1: None, 2: None, 3: None}
            for ability in species.abilities:
                abilities[ability.slot] = ability.ability.name.replace("-", " ").title()
            types = {1: None, 2: None}
            for _type in species.types:
                types[_type.slot] = _type.type.name.upper()

            sprite = species.sprites.front_default
            evolutions = load_evolutions(species.id, species.species.evolution_chain.chain)

            pokemon[pokedex_number] = {
                "abilities": {
                    1: abilities[1],
                    2: abilities[2],
                    3: abilities[3],
                },
                "pokedexNumber": pokedex_number,
                "sprite": sprite,
                "name": species.name.title(),
                "types": {
                    "primary": types[1],
                    "secondary": types[2]
                },
                "baseSpecies": species.species.evolution_chain.chain.species.id,
                "evolutions": evolutions,
                "genderRate": species.species.gender_rate,
                "isLegendary": species.species.is_legendary or species.species.is_mythical,
                "generation": species.species.generation.id
            }

            with open(pokefile, "w") as f:
                json.dump(pokemon[pokedex_number], f)
    except HTTPError:
        pass
    finally:
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
