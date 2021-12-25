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
import logging
from InquirerPy import inquirer
from InquirerPy.base import Choice
from nuztrack.enums import NuzlockeRules
from nuztrack.defaults import DEFAULT_NUZLOCKE_RULES
from nuztrack.config.Config import Config
from nuztrack.saves.SaveFile import SaveFile
from nuztrack.exceptions import SaveStateSwitch
from nuztrack.tui.SaveFileTui import SaveFileTui


class NuzlockeTui:
    """
    Class that implements an interactive text-based user interface
    """

    def __init__(self, config: Config):
        """
        Initializes the TUI
        :param config: The config object to use
        """
        self.logger = logging.getLogger("NuzlockeTui")
        self.config = config
        self.pokemon_data = self.config.pokemon_data

    def start(self):
        """
        Starts the TUI
        :return: None
        """
        print("nuztrack - A nuzlocke tracker terminal application")
        save_file = self._select_save_file()
        while True:
            try:
                self.pokemon_data.get_locations(save_file.game)
                SaveFileTui(self.config, self.pokemon_data, save_file).start()
                break
            except SaveStateSwitch:
                save_file.write()
                save_file = self._select_save_file()
            except KeyboardInterrupt:
                break
            finally:
                save_file.write()
                self.pokemon_data.write()

    def _select_save_file(self) -> SaveFile:
        """
        Allows the user to select a save file.
        :return: None
        """
        existing_saves = self.config.get_stored_saves()
        titles = [f"{x.title} ({x.path})" for x in existing_saves]
        paths = [x.path for x in existing_saves]
        selected = inquirer.select(
            "Existing save files:",
            choices=titles + ["New File"]
        ).execute()

        if selected == "New File":
            path = os.path.abspath(inquirer.filepath(
                "Path to file",
                validate=lambda x: os.path.abspath(x) not in paths
            ).execute())
            if not os.path.isfile(path):
                self._create_new_save_file(path)
            self.config.register_save(path)
        else:
            path = paths[titles.index(selected)]

        return SaveFile(path, self.pokemon_data)

    def _create_new_save_file(self, path: str):
        """
        Creates a new save file while prompting the user for the basic
        information for the save file
        :param path: The path in which to store the save file
        :return: None
        """
        title = inquirer.text(
            "Title of the Nuzlocke Run:",
            validate=lambda x: x
        ).execute()
        game = inquirer.select(
            "Game", choices=[x.title() for x in self.pokemon_data.get_games()]
        ).execute().lower()
        rule_options = [
            Choice(x.value, enabled=x in DEFAULT_NUZLOCKE_RULES)
            for x in NuzlockeRules
        ]
        selected_rules = [
            NuzlockeRules(x)
            for x in inquirer.checkbox(
                "Nuzlocke Rules:", choices=rule_options
            ).execute()
        ]
        extra_rules = [
            x.strip()
            for x in inquirer.text(
                "Additional Rules (one rule per line):", multiline=True
            ).execute().split("\n")
            if x.strip()
        ]
        genlocke = inquirer.confirm("Is this part of a genlocke?").execute()
        if genlocke:
            previous_file = inquirer.filepath(
                "Import previous run data "
                "(leave blank to not import anything):"
            ).execute().strip()
        else:
            previous_file = ""
        blacklist_import = previous_file if previous_file else None
        SaveFile.create(
            self.pokemon_data,
            path,
            title,
            game,
            selected_rules,
            extra_rules,
            blacklist_import
        )
