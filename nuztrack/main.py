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
from argparse import ArgumentParser
from nuztrack.cli.InteractiveCli import InteractiveCli
from nuztrack.files.Config import Config
from nuztrack.files.PokemonData import PokemonData


def main():
    """
    The main method of the nuztrack program
    :return: None
    """
    parser = ArgumentParser()
    parser.add_argument("mode", choices={"cli"})
    args = parser.parse_args()

    config_dir = os.path.join(os.path.expanduser("~"), ".config/nuztrack")
    os.makedirs(config_dir, exist_ok=True)
    config = Config(os.path.join(config_dir, "config.json"))
    pokemon_data = PokemonData(os.path.join(config_dir, "pokemon_data.json"))

    if args.mode == "cli":
        InteractiveCli(config, pokemon_data).start()
    else:
        print("No valid mode selected")
