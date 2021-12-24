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

    def print_overview(self):
        """
        Prints an overview of the nuzlocke run
        :return: None
        """
        string = f"{self.save_file.title} ({self.save_file.game})\n" \
                 f"{'-' * 80}\nCaptured Pokemon:\n"

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
        string = f"{self.save_file.title} ({self.save_file.game})\n" \
                 f"{'-' * 80}\nLog:\n"

        for entry in self.json["log"]:
            string += f"  {LogEntry(entry).__str__(True)}\n"

        for group_name, group in [
            ("Team", self.team_pokemon),
            ("Box", self.boxed_pokemon),
            ("Dead", self.dead_pokemon)
        ]:
            string += f"{'-' * 80}\n{group_name}:\n"
            for nickname in group:
                pokemon = self.get_pokemon(nickname)
                level = str(pokemon["level"]).ljust(2)
                species = pokemon["pokemon"].title().ljust(12)
                string += f"  {nickname.ljust(12)} ({species}| Lvl. {level})\n"
        string += f"{'-' * 80}\n"
        return string
