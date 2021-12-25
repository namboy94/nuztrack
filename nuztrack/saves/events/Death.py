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
from typing import TYPE_CHECKING
from dataclasses import dataclass
from nuztrack.saves.events.Event import Event
if TYPE_CHECKING:
    from nuztrack.saves.SaveFile import SaveFile


@dataclass
class _Death:
    """
    Class that contains the attributes that are specific to a Death event.
    """
    location: str
    nickname: str
    level: int
    opponent: str
    description: str


@dataclass
class Death(Event, _Death):
    """
    Class that contains information about the death of a Pokemon
    """

    def format_description(self, save: "SaveFile") -> str:
        """
        Creates a human-readable description of the event
        :param save: The save file containing this event
        :return: A human-readable description of the event
        """
        return f"{self.nickname} died fighting against " \
               f"{self.opponent} at level {self.level}"

    @property
    def event_colour(self) -> str:
        """
        :return: A fitting colour for the event
        """
        return Fore.LIGHTRED_EX
