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
from typing import List, Optional
from nuztrack.enums import NuzlockeRules


class SaveFile:
    """
    Class that encapsulates the save data for a single nuzlocke run
    """

    def __init__(self, path: str):
        """
        Initializes the SaveFile object
        :param path: The path to the file path
        """
        self.logger = logging.getLogger("SaveFile")
        self.path = path
        self.__json = {}
        if os.path.isfile(path):
            with open(path, "r") as f:
                self.__json = json.load(f)

    def write(self):
        """
        Writes the data to file
        :return: None
        """
        with open(self.path, "w") as f:
            json.dump(self.__json, f, indent=4)

    @classmethod
    def create(
            cls,
            path: str,
            title: str,
            game: str,
            selected_rules: List[NuzlockeRules],
            extra_rules: List[str],
            genlocke_import_file: Optional[str]
    ):
        """
        Creates a new SaveFile object based on some parameters
        :param path: The path to the file
        :param title: The title of the save file
        :param game: The game title used
        :param selected_rules: The selected nuzlocke rules
        :param extra_rules: Any extra rules in text form
        :param genlocke_import_file: Allows import of another save file to
                                     continue a genlocke file
        :return: None
        """
        data = {
            "title": title,
            "game": game,
            "selected_rules": [x.name for x in selected_rules],
            "extra_rules": extra_rules,
            "nickname_blacklist": [],
            "species_blacklist": [],
            "encounters": []
        }
        if genlocke_import_file is not None:
            pass
            # TODO blacklist logic
        with open(path, "w") as f:
            json.dump(data, f, indent=4)

    @property
    def title(self) -> str:
        """
        :return: The title of the save file
        """
        return self.__json["title"]

    @property
    def game(self) -> str:
        """
        :return: The game which this save file keeps track of
        """
        return self.__json["game"]
