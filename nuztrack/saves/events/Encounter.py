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
from nuztrack.enums import Genders


@dataclass_json
@dataclass
class Encounter:
    """
    Class that encapsulates information about an encounter
    """
    location: str
    pokedex_number: int
    level: int
    gender: Genders
    obtained: bool
    timestamp: str
