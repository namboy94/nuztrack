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

from colorama import Style
from nuztrack.saves.SaveFile import SaveFile


class Printer:
    """
    Class that prints formatted messages based on a save file
    """

    def __init__(self, save_file: SaveFile):
        """
        Intializes the Printer object
        :param save_file: The save file to analyze
        """
        self.save_file = save_file

    def print_all(self):
        """
        Prints all data for the nuzlocke run
        :return: None
        """
        print(f"{self.save_file.title} ({self.save_file.game.title()}) "
              f"[{self.save_file.state.value.title()}]")
        print(f"{'-' * 80}")
        self.print_captured_pokemon()
        self.print_log()

    def print_captured_pokemon(self):
        """
        Prints all captured Pokemon
        :return: None
        """
        string = f"Captured Pokemon:"

        previous = None
        for pokemon in self.save_file.owned_pokemon:
            species = self.save_file.pokemon_data.get_pokemon(
                pokemon.pokedex_number
            )
            if pokemon.in_team:
                category = "Team"
            elif pokemon.deceased:
                category = "Dead"
            else:
                category = "Box"

            if previous != category:
                if previous is not None:
                    string += f"{'-' * 80}\n"
                string += f"{category}:\n"
                previous = category

            level = str(pokemon.level).ljust(2)
            species = species.name.title().ljust(12)
            string += f"  {pokemon.nickname.ljust(12)} " \
                      f"({species}| Lvl. {level})\n"
        string += f"{'-' * 80}\n"
        print(string)

    def print_log(self):
        """
        Prints the event log of the save file
        :return: None
        """
        print(f"Event Log:")
        for event in self.save_file.events:
            print(event.timestamp + "   ", end="")
            print(event.event_colour +
                  event.format_description(self.save_file) +
                  Style.RESET_ALL)
        print(f"{'-' * 80}")
