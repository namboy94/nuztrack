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
from colorama import Fore, Style


class LogEntry:

    def __init__(self, data: Dict[str, Any]):
        self.type = data["type"]
        self.data = data

    def __str__(self, coloured: bool = False) -> str:
        colour = ""
        if self.type == "encounter" and self.data["captured"]:
            string = f"Caught a {self.data['pokemon'].title()} " \
                     f"at level {self.data['level']} " \
                     f"(@{self.data['location']})"
            colour = Fore.GREEN
        elif self.type == "encounter" and not self.data["captured"]:
            string = f"Failed to catch a {self.data['pokemon'].title()} " \
                     f"(@{self.data['location']})"
            colour = Fore.YELLOW
        elif self.type == "death":
            string = f"{self.data['pokemon']} died"
            colour = Fore.RED
        elif self.type == "badge":
            string = f"Earned badge #{self.data['number']}"
            colour = Fore.BLUE
        elif self.type == "evolution":
            string = f"{self.data['nickname']} evolved into a " \
                     f"{self.data['new'].title()}"
            colour = Fore.MAGENTA
        elif self.type == "text":
            string = self.data["text"]
        else:
            string = f"{self.type}"
        if coloured:
            return colour + string + Style.RESET_ALL
        else:
            return string
