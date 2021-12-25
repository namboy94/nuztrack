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

from colorama import Fore
from dataclasses import dataclass
from typing import Optional, TYPE_CHECKING
from nuztrack.saves.events.Event import Event
from nuztrack.enums import Genders
if TYPE_CHECKING:
    from nuztrack.saves.SaveFile import SaveFile


@dataclass
class _Encounter:
    """
    Class that contains the attributes that are specific to an Encounter event.
    """
    location: str
    pokedex_number: int
    level: int
    gender: Genders
    obtained: bool
    nickname: Optional[str]


@dataclass
class Encounter(Event, _Encounter):
    """
    Class that contains information about an encounter
    """

    def format_description(self, save: "SaveFile") -> str:
        """
        Creates a human-readable description of the event
        :param save: The save file containing this event
        :return: A human-readable description of the event
        """
        pokemon = save.pokemon_data.get_pokemon(self.pokedex_number)
        return f"Encountered {'and caught ' if self.obtained else ''}" \
               f"a level {self.level} {pokemon.name} at {self.location}"

    @property
    def event_colour(self) -> str:
        """
        :return: A fitting colour for the event
        """
        return Fore.LIGHTGREEN_EX if self.obtained else Fore.LIGHTYELLOW_EX
