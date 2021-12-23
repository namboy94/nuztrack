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
import sys
from InquirerPy import inquirer
from puffotter.init import argparse_add_verbosity
from argparse import ArgumentParser, Namespace
from nuztrack.config.Config import Config
from nuztrack.tui.NuzlockeTui import NuzlockeTui


def main(args: Namespace):
    """
    The main method of the nuztrack program
    :param args: The command line arguments
    :return: None
    """
    config = Config()
    try:
        config.lock()
    except OSError as e:
        print(e)
        if inquirer.confirm("Delete lockfile and continue?").execute():
            os.remove(config.lockfile)
            config.lock()
        else:
            sys.exit(1)

    try:
        if args.mode == "tui":
            NuzlockeTui(config).start()
        elif args.mode == "cli":
            print("CLI not yet implemented")
        elif args.mode == "gui":
            print("GUI not yet implemented")
        elif args.mode == "web":
            print("Web UI not yet implemented")
        else:
            print("No valid mode selected")
    finally:
        config.unlock()
        config.write()


def define_parser() -> ArgumentParser:
    """
    Defines the parser for the program
    :return: None
    """
    parser = ArgumentParser()
    parser.add_argument("mode", choices={"cli", "tui", "cli", "web"})
    argparse_add_verbosity(parser)
    return parser
