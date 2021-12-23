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

import logging
from InquirerPy import inquirer
from typing import List, Callable
from nuztrack.data.PokemonData import PokemonData
from nuztrack.export.Exporter import Exporter
from nuztrack.saves.events.Death import Death
from nuztrack.saves.events.Encounter import Encounter
from nuztrack.enums import Genders
from nuztrack.config.Config import Config
from nuztrack.saves.OwnedPokemon import OwnedPokemon
from nuztrack.saves.SaveFile import SaveFile
from nuztrack.exceptions import SaveStateSwitch
from nuztrack.saves.events.Evolution import Evolution
from nuztrack.saves.events.Milestone import Milestone
from nuztrack.saves.events.Note import Note
from nuztrack.tui.Printer import Printer


class SaveFileTui:
    """
    Class that implements an interactive text-based user interface
    to manipulate save files
    """

    def __init__(
            self,
            config: Config,
            pokemon_data: PokemonData,
            save_file: SaveFile
    ):
        """
        Initializes the TUI
        :param config: The config object to use
        :param save_file: The SaveFile object
        """
        self.logger = logging.getLogger("NuzlockeTui")
        self.config = config
        self.pokemon_data = pokemon_data
        self.save_file = save_file
        self.printer = Printer(self.save_file)
        self.exporter = Exporter(self.save_file)

    # noinspection PyMethodMayBeStatic
    def start(self):
        """
        Executes one iteration of the main loop of the TUI
        Traverses a tree-like structure to do this.
        :return: None
        """
        selection_options = {
            "Log Event": {
                "Encounter": lambda: self._register_encounter(),
                "Evolution": lambda: self._register_evolution(),
                "Death": lambda: self._register_death(),
                "Milestone": lambda: self._register_milestone(),
                "Note": lambda: self._register_note()
            },
            "Edit Pokemon": lambda: self._edit_pokemon(),
            "Print": {
                "Overview": lambda: self.printer.print_overview(),
                "Log": lambda: self.printer.print_log()
            },
            "Export": {
                "Overview Image": lambda: self.exporter.export_overview_image(
                    inquirer.filepath("Destination:").execute()
                ),
                "Log": lambda: self.exporter.export_log(
                    inquirer.filepath("Destination:").execute()
                ),
                "Blacklist": lambda: self.exporter.export_blacklists(
                    inquirer.filepath("Destination:").execute()
                )
            },
            "Switch Save": lambda _: self._switch_save(),
            "Quit": lambda _: self._quit()
        }

        def __traverse(keys: List[str]) -> Callable[[], None]:
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

        while True:
            __traverse([])()

    def _register_encounter(self):
        """
        Registers a new encounter
        :return: None
        """
        location = inquirer.select(
            "Location of the encounter",
            choices=self.save_file.unvisited_locations + ["Custom Location"]
        ).execute()
        if location == "Custom Location":
            location = inquirer.text("Location Name").execute()

        encounters = [x.title() for x in self.pokemon_data.get_encounters(
            self.save_file.game, location
        ) + ["Other"]]
        encounters.sort()
        species = inquirer.select(
            "Which Pokemon?",
            choices=encounters,
            validate=lambda x: self.save_file.is_capture_allowed(x),
            invalid_message="Invalid Pokemon selected"
        ).execute().lower()
        if species == "Other":
            all_pokemon = {
                x.title(): None
                for x in self.pokemon_data.get_all_pokemon_names()
            }
            species = inquirer.text(
                "Which Pokemon?",
                completer=all_pokemon,
                validate=lambda x:
                    x in all_pokemon and self.save_file.is_capture_allowed(x),
                invalid_message="Invalid Pokemon selected"
            ).execute().lower()
        pokedex_number = self.pokemon_data.get_pokedex_number(species)
        level = int(inquirer.number(
            "Level?",
            min_allowed=1,
            max_allowed=100,
            default=5
        ).execute())

        if self.save_file.generation == 1:
            gender = Genders.NEUTRAL
        else:
            gender = Genders(inquirer.select(
                "Gender?", choices=[x.value for x in Genders]
            ).execute())

        caught = inquirer.confirm("Caught?").execute()

        encounter = Encounter(
            location=location,
            pokedex_number=pokedex_number,
            level=level,
            gender=gender,
            obtained=caught,
            timestamp=self.save_file.create_timestamp()
        )
        self.save_file.register_encounter(encounter)

        if caught:
            self._register_capture(encounter)

    def _register_capture(self, encounter: Encounter):
        """
        Registers a new
        :param encounter:
        :return:
        """
        species = self.pokemon_data.get_pokemon(encounter.pokedex_number)
        default_nick = \
            species.name.upper() if self.save_file.generation < 4 else species
        nickname = inquirer.text(
            "Nickname?",
            validate=lambda x: x and self.save_file.is_nickname_allowed(x),
            default=default_nick
        ).execute()

        if self.save_file.generation >= 3:
            natures = {
                x: None for x in sorted(self.pokemon_data.get_natures())
            }
            nature = inquirer.text(
                "Nature?",
                completer=natures,
                validate=lambda x: x in natures
            ).execute()
            ability = inquirer.select(
                "Ability?",
                choices=species.abilities + ["Other"]
            ).execute()
            if ability == "Other":
                all_abilities = {
                    x: None for x in self.pokemon_data.get_abilities()
                }
                ability = inquirer.text(
                    "Ability?",
                    completer=all_abilities,
                    validate=lambda x: x in all_abilities
                ).execute()
        else:
            nature, ability = "N/A", "N/A"

        pokemon = OwnedPokemon(
            location=encounter.location,
            pokedex_number=encounter.pokedex_number,
            nickname=nickname,
            level=encounter.level,
            gender=encounter.gender,
            nature=nature,
            ability=ability,
            in_team=False,
            deceased=False
        )
        self.save_file.register_catch(pokemon)

    def _register_evolution(self):
        """
        Allows the user to register the evolution of a Pokemon
        :return: None
        """
        pokemon = self._select_pokemon()
        species = self.pokemon_data.get_pokemon(pokemon.pokedex_number)
        evo_target = inquirer.select(
            "Evolve into:",
            choices=[
                self.pokemon_data.get_pokemon(x).name.title()
                for x in species.next_evolutions
            ]
        ).execute().lower()
        evolution = Evolution(
            old_species=species.pokedex_number,
            new_species=self.pokemon_data.get_pokedex_number(evo_target),
            nickname=pokemon.nickname,
            timestamp=self.save_file.create_timestamp()
        )
        self.save_file.register_evolution(evolution)

    def _register_death(self):
        """
        Allows the user to register the death of one of the Pokemon
        :return: None
        """
        selected = self._select_pokemon()
        locations = self.pokemon_data.get_locations(self.save_file.game) + \
            self.save_file.custom_locations
        completer = {x: None for x in locations}
        location = inquirer.text(
            f"Where did {selected.nickname} die?", completer=completer
        ).execute()
        level = int(inquirer.number(
            "Level?", min_allowed=1,
            max_allowed=100,
        ).execute())
        opponent = inquirer.text("Opponent?", validate=lambda x: x).execute()
        description = inquirer.text(
            "Description", validate=lambda x: x
        ).execute()

        death = Death(
            nickname=selected.nickname,
            location=location,
            level=level,
            opponent=opponent,
            description=description,
            timestamp=self.save_file.create_timestamp()
        )
        self.save_file.register_death(death)

    def _register_milestone(self):
        """
        Allows the user to register a milestone
        :return: None
        """
        description = \
            inquirer.text("Description:", validate=lambda x: x).execute()
        milestone = Milestone(
            description=description,
            timestamp=self.save_file.create_timestamp()
        )
        self.save_file.register_milestone(milestone)

    def _register_note(self):
        """
        Allows the user to register a note
        :return: None
        """
        text = inquirer.text("Text:", validate=lambda x: x).execute()
        note = Note(
            text=text,
            timestamp=self.save_file.create_timestamp()
        )
        self.save_file.register_note(note)

    def _edit_pokemon(self):
        """
        Allows the user to edit a Pokemon
        :return: None
        """
        pokemon = self._select_pokemon()
        choices = ["Adjust Level"]
        if pokemon.in_team:
            choices.append("Remove from team")
        elif not pokemon.deceased and len(self.save_file.team) < 6:
            choices.append("Add to team")
        mode = inquirer.select(
            "What would you like to edit?", choices=choices
        ).execute()

        if mode == "Adjust Level":
            pokemon.level = int(inquirer.number(
                "Level?", min_allowed=1, max_allowed=100
            ).execute())
        elif mode == "Add to team":
            pokemon.in_team = True
        elif mode == "Remove from team":
            pokemon.in_team = False
        self.save_file.update_pokemon(pokemon)

    def _switch_save(self):
        """
        Allows the user to switch the active save file
        :return: None
        """
        raise SaveStateSwitch()

    def _quit(self):
        """
        Quits the application
        :return: None
        """
        raise KeyboardInterrupt()

    def _select_pokemon(self) -> OwnedPokemon:
        """
        Allows the user to select a Pokemon from the owned Pokemon
        :return: The selected Pokemon
        """
        owned_pokemon = self.save_file.owned_pokemon
        choices = [x.as_line(self.pokemon_data) for x in owned_pokemon]
        selection = \
            inquirer.select("Which Pokemon?", choices=choices).execute()
        selected = owned_pokemon[choices.index(selection)]
        return selected
