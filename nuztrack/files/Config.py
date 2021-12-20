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
from typing import List, Optional
from nuztrack.files.JsonFile import JsonFile
from nuztrack.files.SaveFile import SaveFile


class Config(JsonFile):
    """
    Class that stores the configuration of the nuzlocke application
    """

    def _init(self):
        """
        Performs checks when initializing the Config file object
        :return:
        """
        self.json["save_files"] = self.json.get("save_files", [])
        for path in list(self.json["save_files"]):
            if not os.path.isfile(path):
                self.json["save_files"].remove(path)
        self.write()

    @property
    def fifo_save_file_history(self) -> List[str]:
        """
        :return: A list of paths to save files in a FIFO order.
        """
        return self.json["save_files"]

    def load_save_file(self, path: str) -> SaveFile:
        """
        Loads a save file and stores the path in the configuration
        :param path: The path to the save file
        :return: None
        """
        path = os.path.abspath(path)
        if path in self.fifo_save_file_history:
            self.json["save_files"].remove(path)
        self.json["save_files"].append(path)
        self.write()
        return SaveFile(path)

    def load_latest_save_file(self) -> Optional[SaveFile]:
        """
        Loads the latest save file, if available.
        :return: The SaveFile object if available, None otherwise.
        """
        if len(self.fifo_save_file_history) == 0:
            return None
        else:
            path = self.json["save_files"][-1]
            if not os.path.isfile(path):
                return None
            else:
                return SaveFile(path)
