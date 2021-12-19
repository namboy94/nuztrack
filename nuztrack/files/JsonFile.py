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


class JsonFile:
    """
    Abstract class that implements a common read/write
    """

    def __init__(self, path: str):
        """
        Initializes the JsonFile object
        :param path: The path to the JSON file
        """
        self.logger = logging.getLogger(self.__class__.__name__)
        self.path = path
        if os.path.isfile(path):
            with open(path, "r") as f:
                self.json = json.load(f)
        else:
            self.json = {}
        self._init()

    def _init(self):
        """
        Additional initialization code by child classes can be done by
        overriding this method
        :return: None
        """
        pass

    def write(self):
        """
        Writes the JSON data to the file.
        :return: None
        """
        with open(self.path, "w") as f:
            json.dump(self.json, f, indent=4)
