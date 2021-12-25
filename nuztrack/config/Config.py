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
from json.decoder import JSONDecodeError
from typing import Optional, List
from nuztrack.data.PokemonData import PokemonData
from nuztrack.saves.SaveFile import SaveFile


class Config:
    """
    Class that handles Configuration data
    """

    def __init__(
            self,
            config_dir: Optional[str] = None,
            refresh_data: bool = False
    ):
        """
        Initializes the Config object
        :param config_dir: The configuration directory path
        :param refresh_data: If set to True, deletes the data file
        """
        self.logger = logging.getLogger("Config")
        self.config_dir = config_dir
        self.config_dir = os.path.join(
            os.path.expanduser("~"), ".config/nuztrack"
        ) if config_dir is None else config_dir
        os.makedirs(self.config_dir, exist_ok=True)

        self.config_file = os.path.join(self.config_dir, "config.json")
        self.data_file = os.path.join(self.config_dir, "data.json")
        self.lockfile = os.path.join(self.config_dir, "lockfile")
        if os.path.isfile(self.data_file) and refresh_data:
            os.remove(self.data_file)
        self.pokemon_data = PokemonData(self.data_file)

        self.__json = {}
        if os.path.isfile(self.config_file):
            with open(self.config_file, "r") as f:
                self.__json = json.load(f)
        if "saves" not in self.__json:
            self.__json["saves"] = []
        if "previous_save" not in self.__json:
            self.__json["previous_save"] = None

    def write(self):
        """
        Writes the data to file
        :return: None
        """
        with open(self.config_file, "w") as f:
            json.dump(self.__json, f, indent=4)

    def register_save(self, path: str):
        """
        Registers a save file
        :param path: The path to the save file
        :return: None
        """
        self.__json["saves"].append(os.path.abspath(path))

    def get_stored_saves(self) -> List[SaveFile]:
        """
        Retrieves any stored save files
        :return: The list of save files that were found
        """
        saves = []
        for path in self.__json["saves"]:
            if os.path.isfile(path):
                try:
                    saves.append(SaveFile(path, self.pokemon_data))
                except JSONDecodeError:
                    self.logger.warning(f"Failed to load {path}")
        return saves

    def lock(self):
        """
        Creates a lockfile to ensure that only one instance of the
        application runs on a single system to avoid conflicts
        :return: None
        """
        if self.is_locked():
            raise OSError("Only one instance of nuztrack allowed")
        with open(self.lockfile, "w") as f:
            f.write("")

    def unlock(self):
        """
        Deletes the lockfile
        :return: None
        """
        if self.is_locked():
            os.remove(self.lockfile)

    def is_locked(self) -> bool:
        """
        Checks if a lock is currently in place
        :return: None
        """
        return os.path.isfile(self.lockfile)

    @property
    def previous_save(self) -> Optional[str]:
        """
        :return: A path to the previously used save file, or None if no
                 save file has been registered so far
        """
        path = self.__json["previous_save"]
        return path if os.path.isfile(path) else None

    @previous_save.setter
    def previous_save(self, path: str):
        """
        Sets the previous save file path
        :param path: The path to store
        :return: None
        """
        self.__json["previous_save"] = path

    def open_save_file(self, path: str) -> SaveFile:
        """
        Opens a save file based on a file path and stores it as the
        last used save file
        :param path: The path to open
        :return: The opened SaveFile object
        """
        self.previous_save = path
        save_file = SaveFile(path, self.pokemon_data)
        return save_file
