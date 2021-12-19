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

from InquirerPy import inquirer
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

        print(f"{self.save_file.game.title()} - {self.save_file.title}")
        self.__main_loop()

    def __select_save(self):
        """
        Allows the user to select a save file
        :return: None
        """
        history = self.config.fifo_save_file_history
        path = inquirer.select("Existing save files:", choices=history + ["New File"]).execute()

        if path == "New File":
            path = inquirer.filepath("Path to file").execute()
            game = inquirer.select(
                "Game", choices=self.pokemon_data.games
            ).execute()
            title = inquirer.text("Save Title").execute()
            SaveFile.create(path, game, title)

        self.save_file = self.config.load_save_file(path)

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
                elif mode == "Print Overview":
                    print(self.save_file)
                elif mode == "Switch Save":
                    self.save_file.write()
                    self.__select_save()
                else:
                    raise KeyboardInterrupt()

        except KeyboardInterrupt:
            pass
        finally:
            self.save_file.write()

    def __add_log_entry(self):
        """
        Adds a log entry
        :return: None
        """
        options = ["Encounter", "Death", "Badge"]
        mode = inquirer.select(
            "Select the event type to log", choices=options
        ).execute()

        if mode == "Encounter":
            self.__log_encounter()
        elif mode == "Death":
            self.__log_death()
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
        pokemon = inquirer.select("Which Pokemon?", choices=encounters).execute()
        if pokemon == "Other":
            all_pokemon = {x: None for x in self.pokemon_data.pokemon}
            pokemon = inquirer.text(
                "Which Pokemon?",
                completer=all_pokemon,
                validate=lambda x: x in all_pokemon
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

        existing_nicknames = self.save_file.owned_pokemon
        nickname = inquirer.text(
            "Nickname?",
            validate=lambda x: x and x not in existing_nicknames
        ).execute()
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

        pokemon_data = self.save_file.get_pokemon(pokemon)

        locations = self.pokemon_data.get_locations(self.save_file.game) + \
            self.save_file.logged_locations
        completer = {x: None for x in locations}
        location = inquirer.text(
            f"Where did {pokemon} die?", completer=completer
        ).execute()
        level = int(inquirer.number(
            "Level?", min_allowed=pokemon_data["level"],
            max_allowed=100, default=5
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
        active_pokemon = self.save_file.active_pokemon
        pokemon = inquirer.select(
            "Select the Pokemon to modify", choices=active_pokemon
        ).execute()
        pokemon_data = self.save_file.get_pokemon(pokemon)

        options = ["Evolve", "Level Up"]
        mode = inquirer.select(
            "Select the modification to perform", choices=options
        ).execute()

        if mode == "Evolve":
            species = pokemon_data["pokemon"]
            evo_options = self.pokemon_data.get_evolutions(species)
            evo_target = inquirer.select(
                "Evolve into:", choices=evo_options
            ).execute()
            self.save_file.evolve(pokemon, evo_target)
        elif mode == "Level Up":
            level = int(inquirer.number(
                "Which level?", min_allowed=pokemon_data["level"],
                max_allowed=100
            ).execute())
            self.save_file.level_up(pokemon, level)
