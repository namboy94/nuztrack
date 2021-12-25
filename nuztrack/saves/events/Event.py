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

from typing import TYPE_CHECKING
from datetime import datetime
from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
if TYPE_CHECKING:
    from nuztrack.saves.SaveFile import SaveFile


@dataclass_json
@dataclass
class Event:
    """
    Class that defines default values for events and common methods
    """
    timestamp: str = field(
        default_factory=lambda: datetime.now().strftime("%Y-%m-%d:%H-%M-%S")
    )

    def format_description(self, save: "SaveFile") -> str:
        """
        Creates a human-readable description of the event
        :param save: The save file containing this event
        :return: A human-readable description of the event
        """
        raise NotImplementedError()

    @property
    def event_colour(self) -> str:
        """
        :return: A fitting colour for the event
        """
        raise NotImplementedError()
