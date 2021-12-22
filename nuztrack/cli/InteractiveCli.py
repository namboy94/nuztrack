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
from InquirerPy import inquirer
from nuztrack.export.Exporter import Exporter
from nuztrack.files.Config import Config
from nuztrack.files.PokemonData import PokemonData
from nuztrack.files.SaveFile import SaveFile


class InteractiveCli:
    """
    Class that implements an interactive command line interface for the
    nuzlocke tracker.
    """

    def __init__(self, config: Config, pokemon_data: PokemonData):
        """
        Initializes the InteractiveCli object
        :param config: The config to use
        """
        self.config = config
        self.pokemon_data = pokemon_data
        self.save_file = config.load_latest_save_file()

    def start(self):
        """
        Starts the interactive command line interface
        :return: None
        """

        print("nuztrack - A nuzlocke tracker terminal application")

        if self.save_file is None:
            self.__select_save()
        else:
            self.config.lock_file(self.save_file.path)

        print(f"{self.save_file.game.title()} - {self.save_file.title}")
        self.__main_loop()

    def __select_save(self):
        """
        Allows the user to select a save file
        :return: None
        """
        history = self.config.fifo_save_file_history
        history = [x for x in history if not self.config.is_locked(x)]
        saves = [f"{SaveFile(x).title} ({x})" for x in history]
        selected = inquirer.select(
            "Existing save files:",
            choices=saves + ["New File"]
        ).execute()

        if selected == "New File":
            path = os.path.abspath(inquirer.filepath(
                "Path to file",
                validate=lambda x: not self.config.is_locked(os.path.abspath(x))
            ).execute())
            if not os.path.isfile(path):
                game = inquirer.select(
                    "Game", choices=self.pokemon_data.games
                ).execute()
                title = inquirer.text("Save Title").execute()
                SaveFile.create(path, game, title)
        else:
            path = history[saves.index(selected)]

        self.save_file = self.config.load_save_file(path)
        self.pokemon_data.get_locations(self.save_file.game)
        self.config.lock_file(path)

    def __main_loop(self):
        """
        The main loop of the interactive CLI
        :return: None
        """
        try:
            while True:
                choices = [
                    "Log Event",
                    "Edit Pokemon",
                    "Print Overview",
                    "Export",
                    "Switch Save",
                    "Quit"
                ]
                mode = inquirer.select(
                    "What would you like to do?", choices=choices
                ).execute()

                if mode == "Log Event":
                    self.__add_log_entry()
                elif mode == "Edit Pokemon":
                    self.__edit_pokemon()
                elif mode == "Change State":
                    self.save_file.state = inquirer.select(
                        "New state",
                        choices=["Ongoing", "Completed", "Failed"]
                    ).execute().lower()
                elif mode == "Print Overview":
                    print(self.save_file)
                elif mode == "Export":
                    self.__export()
                elif mode == "Switch Save":
                    self.save_file.write()
                    self.config.unlock_file(self.save_file.path)
                    self.__select_save()
                else:
                    raise KeyboardInterrupt()
                self.save_file.write()

        except KeyboardInterrupt:
            pass
        finally:
            self.save_file.write()
            self.config.unlock_file(self.save_file.path)

    def __add_log_entry(self):
        """
        Adds a log entry
        :return: None
        """
        options = ["Encounter", "Death", "Badge", "Note"]
        mode = inquirer.select(
            "Select the event type to log", choices=options
        ).execute()

        if mode == "Encounter":
            self.__log_encounter()
        elif mode == "Death":
            self.__log_death()
        elif mode == "Note":
            self.save_file.log_text(inquirer.text("Note:").execute())
        else:
            if inquirer.confirm(
                    f"Add another badge? (Current: {self.save_file.badges})"
            ).execute():
                self.save_file.add_badge()

    def __log_encounter(self):
        """
        Logs an encounter with a wild Pokemon
        :return: None
        """
        all_locations = self.pokemon_data.get_locations(self.save_file.game)
        unvisited = self.save_file.get_unvisited_locations(all_locations)
        location = inquirer.select(
            "Location of the encounter",
            choices=unvisited + ["Custom Location"]
        ).execute()
        if location == "Custom Location":
            location = inquirer.text("Location Name").execute()

        encounters = self.pokemon_data.get_encounters(
            self.save_file.game, location
        ) + ["Other"]
        pokemon = inquirer.select(
            "Which Pokemon?",
            choices=encounters,
            validate=lambda x: x not in self.save_file.duplicate_clause_blacklist
        ).execute()
        if pokemon == "Other":
            all_pokemon = {x: None for x in self.pokemon_data.pokemon}
            pokemon = inquirer.text(
                "Which Pokemon?",
                completer=all_pokemon,
                validate=lambda x: x in all_pokemon and x not in self.save_file.duplicate_clause_blacklist
            ).execute()
        level = int(inquirer.number(
            "Level?", min_allowed=1, max_allowed=100, default=5
        ).execute())
        gender = inquirer.select(
            "Gender?", choices=["M", "F", "N"]
        ).execute().lower()
        caught = inquirer.confirm("Caught?").execute()

        if not caught:
            self.save_file.log_encounter(
                location, False, pokemon, level, gender
            )
            return

        existing_nicknames = self.save_file.owned_pokemon + \
            self.save_file.blacklist
        nickname = inquirer.text(
            "Nickname?",
            validate=lambda x: (x and x not in existing_nicknames) or
                               (not x and pokemon.upper()
                                not in existing_nicknames)
        ).execute()
        if not nickname:
            nickname = pokemon.upper()
        if self.save_file.game not in [
            "red", "blue", "yellow", "gold", "silver", "crystal"
        ]:
            natures = {x: None for x in sorted(self.pokemon_data.natures)}
            nature = inquirer.text(
                "Nature?",
                completer=natures,
                validate=lambda x: x in natures
            ).execute()
            abilities = {x: None for x in sorted(self.pokemon_data.abilities)}
            ability = inquirer.text(
                "Ability?",
                completer=abilities,
                validate=lambda x: x in abilities
            ).execute()
        else:
            nature, ability = "N/A", "N/A"
        self.save_file.log_capture(
            location, pokemon, level, nickname, gender, nature, ability
        )

    def __log_death(self):
        """
        Allows the user to log a death
        :return: None
        """
        active_pokemon = self.save_file.active_pokemon
        pokemon = inquirer.select(
            "Who died?", choices=active_pokemon
        ).execute()

        locations = self.pokemon_data.get_locations(self.save_file.game) + \
            self.save_file.logged_locations
        completer = {x: None for x in locations}
        location = inquirer.text(
            f"Where did {pokemon} die?", completer=completer
        ).execute()
        level = int(inquirer.number(
            "Level?", min_allowed=1,
            max_allowed=100,
        ).execute())
        opponent = inquirer.text("Opponent?", validate=lambda x: x).execute()
        description = inquirer.text(
            "Description", validate=lambda x: x
        ).execute()
        self.save_file.log_death(
            pokemon, location, level, opponent, description
        )

    def __edit_pokemon(self):
        """
        Allows the user to edit a Pokemon
        :return: None
        """
        pokemon_list = []
        for category, members in [
            ("Team", self.save_file.team_pokemon),
            ("Box", self.save_file.boxed_pokemon),
            ("Dead", self.save_file.dead_pokemon)
        ]:
            for member in members:
                member_data = self.save_file.get_pokemon(member)
                pokemon_list.append(
                    f"[{(category + ']').ljust(5)} {member.ljust(12)} "
                    f"({member_data['pokemon'].title().ljust(12)}| "
                    f"Lvl.{str(member_data['level']).ljust(2)})"
                )

        if len(pokemon_list) == 0:
            print("No Pokemon caught yet")
            return

        pokemon = inquirer.select(
            "Select the Pokemon to modify", choices=pokemon_list
        ).execute().split("]")[1].split("(")[0].strip()
        pokemon_data = self.save_file.get_pokemon(pokemon)

        options = ["Evolve", "Level Up", "Rename"]
        team = self.save_file.team_pokemon
        box = self.save_file.boxed_pokemon
        if pokemon in team and len(team) > 1:
            options.append("Remove from Team")
        if pokemon in box and len(team) < 6:
            options.append("Add to Team")

        mode = inquirer.select(
            "Select the modification to perform", choices=options
        ).execute()

        if mode == "Evolve":
            species = pokemon_data["pokemon"]
            evo_options = self.pokemon_data.get_next_evolutions(species)
            evo_target = inquirer.select(
                "Evolve into:", choices=evo_options
            ).execute()
            self.save_file.evolve(pokemon, evo_target)
        elif mode == "Level Up":
            level = int(inquirer.number(
                "Which level?",
                min_allowed=1,
                max_allowed=100
            ).execute())
            self.save_file.level_up(pokemon, level)
        elif mode == "Remove from Team":
            self.save_file.remove_from_team(pokemon)
        elif mode == "Add to Team":
            self.save_file.add_to_team(pokemon)
        elif mode == "Rename":
            self.save_file.rename_pokemon(
                pokemon,
                inquirer.text(
                    "New Name:",
                    validate=lambda x: x not in self.save_file.active_blacklist
                ).execute()
            )

    def __export(self):
        options = ["Blacklist", "Summary Image"]
        mode = inquirer.select("Export what?", choices=options).execute()

        if mode == "Blacklist":
            print(json.dumps(self.save_file.active_blacklist))
            species = self.save_file.species_blacklist
            for nickname in self.save_file.active_blacklist:
                if nickname in self.save_file.owned_pokemon:
                    species.append(
                        self.save_file.get_pokemon(nickname)["pokemon"]
                    )
            print(json.dumps(species))
        elif mode == "Summary Image":
            path = inquirer.filepath("Export to:").execute()
            exporter = Exporter(self.save_file, self.pokemon_data)
            exporter.export(path)
