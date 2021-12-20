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

import pokebase
from typing import List
from nuztrack.files.JsonFile import JsonFile


class PokemonData(JsonFile):
    """
    Class that keeps a locally cached version of various Pokemon data
    """

    def _init(self):
        """
        Downloads Pokemon data if it does not exist yet
        :return: None
        """
        if "pokedex" not in self.json:
            self.json["pokedex"] = {}
            for entry in pokebase.pokedex(1).pokemon_entries:
                self.json["pokedex"][entry.entry_number] = \
                    entry.pokemon_species.name

        if "natures" not in self.json:
            self.json["natures"] = []
            for entry in pokebase.nature("").results:
                self.json["natures"].append(entry.name)

        if "abilities" not in self.json:
            self.json["abilities"] = []
            for entry in pokebase.ability("").results:
                self.json["abilities"].append(entry.name)

        if "games" not in self.json:
            self.json["games"] = []
            for entry in pokebase.version("").results:
                self.json["games"].append(entry.name)

        if "game_data" not in self.json:
            self.json["game_data"] = {}

        if "sprites" not in self.json:
            self.json["sprites"] = {}

        self.write()

    @property
    def pokemon(self) -> List[str]:
        """
        :return: A list containing the names of all Pokemon
        """
        entries = []
        for _, name in sorted(
                self.json["pokedex"].items(), key=lambda x: x[0]
        ):
            entries.append(name)
        return entries

    @property
    def games(self) -> List[str]:
        """
        :return: A list of supported games
        """
        return self.json["games"]

    @property
    def natures(self) -> List[str]:
        """
        :return: A list of Pokemon natures
        """
        return self.json["natures"]

    @property
    def abilities(self) -> List[str]:
        """
        :return: A list of Pokemon abilities
        """
        return self.json["abilities"]

    def load_game_data(self, game: str):
        """
        Loads game-specific data
        :param game: The game to fetch data for
        :return: The game-specific data
        """
        if game not in self.json:
            locations = []
            encounters = {}
            regions = pokebase.version(game).version_group.regions
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
            game_data = {"locations": locations, "encounters": encounters}
            self.json["game_data"][game] = game_data
            self.write()
        return self.json["game_data"][game]

    def get_locations(self, game: str) -> List[str]:
        """
        Retrieves a list of locations for a game
        :param game: The game for which to receive the locations
        :return: The locations of the game
        """
        if game not in self.json["game_data"]:
            self.load_game_data(game)
        return self.json["game_data"][game]["locations"]

    def get_encounters(self, game: str, location: str) -> List[str]:
        """
        Retrieves a list of encounters for an area in a game
        :param game: The game for which to receive the encounter data
        :param location: The location for which to retrieve the encounter data
        :return: A list of Pokemon that can be encountered
        """
        if game not in self.json["game_data"]:
            self.load_game_data(game)
        return self.json["game_data"][game]["encounters"].get(location, [])

    def get_sprite(self, pokemon: str) -> str:
        """
        Fetches a URL to a sprite of a Pokemon
        :param pokemon: The Pokemon to get a sprite for
        :return: A URL to the sprite
        """
        if pokemon not in self.json["sprites"]:
            self.json["sprites"][pokemon] = \
                pokebase.pokemon(pokemon).sprites.front_default
            self.write()
        return self.json["sprites"][pokemon]

    @staticmethod
    def get_evolutions(species: str) -> List[str]:
        """
        Retrieves a list of possible evolutions for a Pokemon
        :param species: The species to analyze
        :return: The possible evolutions
        """
        species_data = pokebase.pokemon_species(species)
        evo_chain = species_data.evolution_chain.chain

        def traverse_chain(chain):
            if chain.species.name == species:
                return [x.species.name for x in chain.evolves_to]
            else:
                evos = []
                for next_chain in chain.evolves_to:
                    evos += traverse_chain(next_chain)
                return evos

        return traverse_chain(evo_chain)
