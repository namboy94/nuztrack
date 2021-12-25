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
from nuztrack.saves.events.Event import Event


@dataclass
class _Evolution:
    """
    Class that contains the attributes that are specific to an Evolution event.
    """
    old_species: int
    new_species: int
    nickname: str


@dataclass
class Evolution(Event, _Evolution):
    """
    Class that keeps track of an evolution
    """
    pass
