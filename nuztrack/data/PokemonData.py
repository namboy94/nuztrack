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

import os
import json
import logging
import pokebase
from typing import List


class PokemonData:
    """
    Class that handles fetching and caching any Pokemon-related data
    """

    def __init__(self, path: str):
        """
        Initializes the PokemonData object
        :param path: The path to the associated cache file
        """
        self.logger = logging.getLogger("PokemonData")
        self.path = path
        self.__json = {}
        if os.path.isfile(path):
            with open(path, "r") as f:
                self.__json = json.load(f)

    def write(self):
        """
        Writes the currently cached data to file
        :return: None
        """
        with open(self.path, "w") as f:
            json.dump(self.__json, f, indent=4)

    def get_games(self) -> List[str]:
        """
        :return: A list of available mainline Pokemon games
        """
        if "games" not in self.__json:
            self.__json["games"] = []
            for entry in pokebase.version("").results:
                self.__json["games"].append(entry.name)
        return self.__json["games"]
