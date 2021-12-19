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

from typing import Dict, Any


class LogEntry:

    def __init__(self, data: Dict[str, Any]):
        self.type = data["type"]
        self.data = data

    def __str__(self) -> str:
        if self.type == "encounter" and self.data["captured"]:
            return f"Caught {self.data['pokemon']}"
        if self.type == "encounter" and not self.data["captured"]:
            return f"Failed to catch {self.data['pokemon']}"
        elif self.type == "death":
            return f"{self.data['pokemon']} died"
        elif self.type == "badge":
            return f"Earned badge #{self.data['number']}"
        else:
            return f"{self.type}"
