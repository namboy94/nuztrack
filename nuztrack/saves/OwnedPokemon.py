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

from dataclasses import dataclass
from dataclasses_json import dataclass_json
from nuztrack.data.PokemonData import PokemonData
from nuztrack.enums import Genders


@dataclass_json
@dataclass
class OwnedPokemon:
    """
    Class that encapsulates information about an encounter
    """
    location: str
    pokedex_number: int
    nickname: str
    level: int
    gender: Genders
    nature: str
    ability: str
    in_team: bool
    deceased: bool

    def as_line(self, pokemon_data: PokemonData) -> str:
        """
        Formats the data into a line that can be displayed as a list
        :param pokemon_data: A PokemonData object to retrieve pokemon species
        :return: The formatted string
        """
        pokemon_info = pokemon_data.get_pokemon(self.pokedex_number)
        return f"{self.nickname.ljust(12)} " \
               f"({pokemon_info.name.ljust(12)} | " \
               f"Lvl. {str(self.level).ljust(2)})"
