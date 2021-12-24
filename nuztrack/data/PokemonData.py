"""LICENSE
Copyright 2021 Hermann Krumrey <hermann@krumreyh.com>

This file is part of nuztrack.

nuztrack is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

nuztrack is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with nuztrack.  If not, see <http://www.gnu.org/licenses/>.
LICENSE"""

import os
import json
import logging
import pokebase
from typing import List

from nuztrack.data.Pokemon import Pokemon


class PokemonData:
    """
    Class that handles fetching and caching any Pokemon-related data
    """

    def __init__(self, path: str):
        """
        Initializes the PokemonData object
        :param path: The path to the associated cache file
        """
        self.logger = logging.getLogger("PokemonData")
        self.path = path
        self.__json = {}
        if os.path.isfile(path):
            with open(path, "r") as f:
                self.__json = json.load(f)
        self._load_pokedex_data()

    def write(self):
        """
        Writes the currently cached data to file
        :return: None
        """
        with open(self.path, "w") as f:
            json.dump(self.__json, f, indent=4)

    def get_games(self) -> List[str]:
        """
        :return: A list of available mainline Pokemon games
        """
        if "games" not in self.__json:
            self.__json["games"] = []
            for entry in pokebase.version("").results:
                self.__json["games"].append(entry.name)
        return self.__json["games"]

    def get_generation(self, game: str) -> int:
        """
        Retrieves the generation for a game
        :param game: The game
        :return: The game's generation
        """
        self._load_game_data(game)
        return self.__json["game_data"][game]["generation"]

    def get_locations(self, game: str) -> List[str]:
        """
        Retrieves a list of locations for a game
        :param game: The game for which to receive the locations
        :return: The locations of the game
        """
        self._load_game_data(game)
        return self.__json["game_data"][game]["locations"]

    def get_encounters(self, game: str, location: str) -> List[str]:
        """
        Retrieves a list of encounters for an area in a game
        :param game: The game for which to receive the encounter data
        :param location: The location for which to retrieve the encounter data
        :return: A list of Pokemon that can be encountered
        """
        self._load_game_data(game)
        return self.__json["game_data"][game]["encounters"].get(location, [])

    def get_natures(self) -> List[str]:
        """
        :return: A list of possible Pokemon natures
        """
        if "natures" not in self.__json:
            self.__json["natures"] = []
            for entry in pokebase.nature("").results:
                self.__json["natures"].append(entry.name)
            self.__json["natures"].sort()
        return self.__json["natures"]

    def get_abilities(self) -> List[str]:
        """
        :return: A list of possible Pokemon abilities
        """
        if "abilities" not in self.__json:
            self.__json["abilities"] = []
            for entry in pokebase.ability("").results:
                self.__json["abilities"].append(entry.name)
            self.__json["abilities"].sort()
        return self.__json["abilities"]

    def get_all_pokemon_names(self) -> List[str]:
        """
        :return: A list containing the names of all Pokemon
        """
        self._load_pokedex_data()
        return [
            Pokemon.from_json(x[1]).name
            for x in sorted(self.__json["pokedex"].items())
        ]

    def get_pokedex_number(self, species_name: str) -> int:
        """
        Retrieves the pokedex number for a species name
        :param species_name: The species name
        :return: The associated pokedex number
        """
        name_map = {
            Pokemon.from_json(y).name: x
            for x, y in self.__json["pokedex"].items()
        }
        return name_map[species_name]

    def get_pokemon(self, pokedex_number: int) -> Pokemon:
        """
        Retrieves data about a Pokemon based on its Pokedex number
        :param pokedex_number:
        :return: The Pokemon data
        """
        self._load_pokedex_data()
        return Pokemon.from_json(self.__json["pokedex"][pokedex_number])

    def _load_game_data(self, game: str):
        """
        Loads game-specific data
        :param game: The game to fetch data for
        :return: The game-specific data
        """
        if "game_data" not in self.__json:
            self.__json["game_data"] = {}

        if game not in self.__json["game_data"]:
            locations = []
            encounters = {}

            version_group = pokebase.version(game).version_group
            generation = version_group.generation.id
            regions = version_group.regions

            for region in reversed(regions):
                # Only Silver/Gold/Crystal/HG/SS have two regions,
                # with Kanto appearing first.
                # Therefore, the order is reversed to show Johto routes first

                region_locations = []
                extra_locations = []
                for location in region.locations:
                    if len(location.game_indices) > 0:
                        region_locations.append(location)
                    else:
                        extra_locations.append(location)
                region_locations.sort(
                    key=lambda x: x.game_indices[0].game_index
                )
                region_locations += extra_locations

                for location in region_locations:
                    location_encounters = set()
                    for area in location.areas:
                        for encounter in area.pokemon_encounters:
                            location_encounters.add(encounter.pokemon.name)
                    locations.append(location.name)
                    encounters[location.name] = list(location_encounters)

            game_data = {
                "locations": locations,
                "encounters": encounters,
                "generation": generation
            }
            self.__json["game_data"][game] = game_data
            self.write()

    def _load_pokedex_data(self):
        """
        Loads data for all pokemon in the Pokedex and caches the data locally
        :return: None
        """
        if "pokedex" in self.__json:
            return

        self.logger.info("Loading Pokedex Data...")
        self.__json["pokedex"] = {}
        for entry in pokebase.pokedex(1).pokemon_entries:
            pokedex_number = entry.entry_number
            self.logger.debug(f"Loading Pokemon #{pokedex_number}")
            species = entry.pokemon_species
            evo_chain = species.evolution_chain.chain
            pokemon_info = pokebase.pokemon(pokedex_number)

            def traverse_next_evos(chain):
                if chain.species.name == species:
                    return [x.species.id for x in chain.evolves_to]
                else:
                    evos = []
                    for next_chain in chain.evolves_to:
                        evos += traverse_next_evos(next_chain)
                    return evos

            def traverse_all_evos(chain):
                evos = [chain.species.id]
                for next_chain in chain.evolves_to:
                    evos += traverse_all_evos(next_chain)
                return evos

            all_evolutions = traverse_all_evos(evo_chain)
            all_evolutions.remove(pokedex_number)

            pokemon = Pokemon(
                pokedex_number=pokedex_number,
                name=species.name,
                sprite=pokemon_info.sprites.front_default,
                types=[x.type.name for x in pokemon_info.types],
                abilities=[x.ability.name for x in pokemon_info.abilities],
                colour=species.color.name,
                related_species=all_evolutions,
                next_evolutions=traverse_next_evos(evo_chain)
            )
            self.__json["pokedex"][pokedex_number] = pokemon.to_json()
        self.logger.info("Pokedex Data loaded.")
        self.write()
