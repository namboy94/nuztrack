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
from typing import List, Callable
from nuztrack.enums import NuzlockeRules
from nuztrack.defaults import DEFAULT_NUZLOCKE_RULES
from nuztrack.config.Config import Config
from nuztrack.saves.SaveFile import SaveFile
from nuztrack.exceptions import SaveStateSwitch


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
        self.pokemon_data = self.config.create_pokemon_data()

    def start(self):
        """
        Starts the TUI
        :return: None
        """
        print("nuztrack - A nuzlocke tracker terminal application")
        save_file = self._select_save_file()
        self._main_loop(save_file)

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
        else:
            path = paths[titles.index(selected)]

        return SaveFile(path)

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
            path,
            title,
            game,
            selected_rules,
            extra_rules,
            blacklist_import
        )

    def _main_loop(self, save_file: SaveFile):
        """
        The main loop of the TUI
        :param save_file: The save file object to use
        :return: None
        """
        try:
            while True:
                try:
                    self._iteration(save_file)
                except SaveStateSwitch as e:
                    save_file = e.new_save
        except KeyboardInterrupt:
            pass
        finally:
            save_file.write()

    # noinspection PyMethodMayBeStatic
    def _iteration(self, save_file: SaveFile):
        """
        Executes one iteration of the main loop of the TUI
        Traverses a tree-like structure to do this.
        :return: None
        """
        selection_options = {
            "Log Event": {
                "Encounter": lambda x: None,
                "Evolution": lambda x: None,
                "Death": lambda x: None,
                "Badge": lambda x: None,
                "Note": lambda x: None
            },
            "Edit Pokemon": lambda x: None,
            "Print": {
                "Overview": lambda x: None,
                "Log": lambda x: None
            },
            "Export": {
                "Overview Image": lambda x: None,
                "Log": lambda x: None,
                "Blacklist": lambda x: None
            },
            "Switch Save": lambda x: None,
            "Quit": lambda x: None
        }

        def __traverse(keys: List[str]) -> Callable[[SaveFile], None]:
            """
            Traverses the dictionary recursively until a callable function
            is reached
            :param keys: The previously visited dictionary keys
            :return: The callable function
            """
            tree = dict(selection_options)
            for key in keys:
                tree = tree[key]
            if isinstance(tree, Callable):
                return tree
            else:
                selected_key = inquirer.select(
                    "", choices=list(tree.keys())
                ).execute()
                return __traverse(keys + [selected_key])

        __traverse([])(save_file)
