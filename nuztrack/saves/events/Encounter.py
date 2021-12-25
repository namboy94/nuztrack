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
from typing import Optional
from nuztrack.saves.events.Event import Event
from nuztrack.enums import Genders


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
    pass
