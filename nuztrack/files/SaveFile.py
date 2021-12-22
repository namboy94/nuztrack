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

import time
from typing import List, Dict, Any
from nuztrack.files.JsonFile import JsonFile
from nuztrack.files.PokemonData import PokemonData
from nuztrack.files.log.LogEntry import LogEntry


class SaveFile(JsonFile):
    """
    Class that stores the data for a Nuzlocke run.
    """

    @classmethod
    def create(cls, path: str, game: str, title: str) -> "SaveFile":
        """
        Creates a new SaveFile object and saves it to disk
        :param path: The path to the save file
        :param game: The game for which this save file is used
        :param title: The title of the Save File
        :return: The generated SaveFile object
        """
        save_file = SaveFile(path)
        save_file.json["game"] = game
        save_file.json["title"] = title
        save_file.json["log"] = []
        save_file.json["pokemon"] = {}
        save_file.json["team"] = []
        save_file.json["badges"] = 0
        save_file.json["state"] = "ongoing"
        save_file.json["blacklist"] = []
        save_file.json["species_blacklist"] = []
        save_file.json["duplicate_clause"] = False
        save_file.json["duplicate_clause_blacklist"] = []
        save_file.write()
        return save_file

    @property
    def title(self) -> str:
        """
        :return: The title of the save file
        """
        return self.json["title"]

    @property
    def game(self) -> str:
        """
        :return: The game which this save file keeps track of
        """
        return self.json["game"]

    @property
    def badges(self) -> int:
        """
        :return: The current amount of badges
        """
        return self.json["badges"]

    @property
    def owned_pokemon(self) -> List[str]:
        """
        :return: A list of nicknames of all owned Pokemon
        """
        return list(self.json["pokemon"].keys())

    @property
    def active_pokemon(self) -> List[str]:
        """
        :return: A list of nicknames of Pokemon that are still alive
        """
        active_pokemon = self.owned_pokemon
        for log_entry in self.json["log"]:
            if log_entry["type"] == "death":
                active_pokemon.remove(log_entry["pokemon"])
        return active_pokemon

    @property
    def team_pokemon(self) -> List[str]:
        """
        :return: The nicknames of the pokemon currently in the team
        """
        return self.json["team"]

    @property
    def boxed_pokemon(self) -> List[str]:
        """
        :return: The nicknames of the pokemon currently in the box
        """
        return [x for x in self.active_pokemon if x not in self.team_pokemon]

    @property
    def dead_pokemon(self) -> List[str]:
        """
        :return: A list of nicknames of Pokemon that have died
        """
        dead_pokemon = []
        for log_entry in self.json["log"]:
            if log_entry["type"] == "death":
                dead_pokemon.append(log_entry["pokemon"])
        return dead_pokemon

    @property
    def logged_locations(self) -> List[str]:
        """
        :return: A list of locations that were logged
        """
        locations = set()
        for entry in self.json["log"]:
            if "location" in entry:
                locations.add(entry["location"])
        return list(locations)

    @property
    def state(self) -> str:
        """
        :return: The current state of the run
        """
        return self.json["state"]

    @state.setter
    def state(self, new_state: str):
        """
        Sets the state of the nuzlocke run
        :param new_state: The new state
        :return: None
        """
        self.json["state"] = new_state

    @property
    def log_messages(self) -> List[str]:
        """
        :return: A list of log messages
        """
        return [str(LogEntry(x)) for x in self.json["log"]]

    @property
    def blacklist(self) -> List[str]:
        """
        :return: A list of blacklisted nicknames
        """
        return self.json["blacklist"]

    @property
    def species_blacklist(self) -> List[str]:
        """
        :return: A list of blacklisted species
        """
        return self.json["species_blacklist"]

    @property
    def active_blacklist(self) -> List[str]:
        """
        :return: A list of nicknames that may not be used anymore because the
                 associated Pokemon have been actively used.
                 Useful for genlockes.
        """
        return self.team_pokemon + self.dead_pokemon + self.blacklist

    @property
    def duplicate_clause_blacklist(self) -> List[str]:
        """
        :return: A list of pokemon species that are affected by the
                 duplicate clause
        """
        return self.json["duplicate_clause_blacklist"]

    def get_unvisited_locations(self, all_locations: List[str]) -> List[str]:
        """
        Analyzes which locations have not been visited yet.
        :param all_locations: All locations in the game
        :return: The names of the unvisited locations
        """
        unvisited = list(all_locations)
        for entry in self.json["log"]:
            if entry["type"] in ["encounter"] and \
                    entry["location"] in unvisited:
                unvisited.remove(entry["location"])
        return unvisited

    def get_pokemon(self, nickname: str) -> Dict[str, Any]:
        """
        Retrieves data about a Pokemon
        :param nickname: The Pokemon's nickname
        :return: Data about the Pokemon
        """
        return self.json["pokemon"][nickname]

    def _log(self, _type: str, data: Dict[str, Any]):
        """
        Adds a log entry
        :param _type: The type of the data to log
        :param data: The data to log
        :return: None
        """
        data["type"] = _type
        data["timestamp"] = time.time()
        self.json["log"].append(data)

    def log_text(self, text: str):
        """
        Logs some custom text
        :param text: The text to log
        :return: None
        """
        self._log("text", {"text": text})

    def log_encounter(self, location: str, captured: bool, pokemon: str, level: int, gender: str):
        """
        Logs an encounter with a Pokemon
        :param location: The location the encounter took place in
        :param captured: Whether the Pokemon was caught or not
        :param pokemon: The Pokemon that was encountered
        :param level: The level of the encountered Pokemon
        :param gender: The gender of the encountered Pokemon
        :return: None
        """
        self._log("encounter", {
            "location": location,
            "captured": captured,
            "pokemon": pokemon,
            "level": level,
            "gender": gender
        })

    def log_capture(
            self,
            location: str,
            pokemon: str,
            level: int,
            nickname: str,
            gender: str,
            nature: str,
            ability: str
    ):
        """
        Logs an encounter that was caught successfully
        :param location: The location in which the encounter took place
        :param pokemon: The encountered Pokemon species
        :param level: The level of the encountered Pokemon
        :param nickname: The nickname of the captured Pokemon
        :param gender: The gender of the captured Pokemon
        :param nature: The nature of the captured Pokemon
        :param ability: The ability of the captured Pokemon
        :return: None
        """
        self.log_encounter(location, True, pokemon, level, gender)
        self.json["pokemon"][nickname] = {
            "location": location,
            "pokemon": pokemon,
            "level": level,
            "gender": gender,
            "nature": nature,
            "ability": ability,
            "in_team": False,
            "deceased": True
        }
        if len(self.json["team"]) < 6:
            self.add_to_team(nickname)
        self.populate_duplicate_clause_blacklist()

    def log_death(
            self,
            nickname: str,
            location: str,
            level: int,
            opponent: str,
            description: str
    ):
        """
        Logs the death of a Pokemon
        :param nickname: The nickname of the deceased Pokemon
        :param location: The location in which the Pokemon died
        :param level: The level at which the Pokemon died
        :param opponent: The opponent against which the Pokemon died
        :param description: A description of the death
        :return: None
        """
        self._log("death", {
            "location": location,
            "pokemon": nickname,
            "opponent": opponent,
            "description": description
        })
        self.json["pokemon"][nickname]["deceased"] = True
        self.json["pokemon"][nickname]["level"] = level
        if nickname in self.json["team"]:
            self.json["team"].remove(nickname)

    def add_badge(self):
        """
        Adds a badge
        :return: None
        """
        self.json["badges"] += 1
        self._log("badge", {"number": self.badges})

    def evolve(self, nickname: str, species: str):
        """
        Evolves a Pokemon
        :param nickname: The nickname of the Pokemon that evolved
        :param species: The new species of the Pokemon
        :return: None
        """
        pokemon = self.get_pokemon(nickname)
        old_species = pokemon["pokemon"]
        pokemon["pokemon"] = species
        self._log("evolution", {
            "nickname": nickname, "old": old_species, "new": species
        })

    def level_up(self, nickname: str, level: int):
        """
        Increases the level of a Pokemon
        :param nickname: The nickname of the Pokemon that levelled up
        :param level: The new level of the Pokemon
        :return: None
        """
        pokemon = self.get_pokemon(nickname)
        pokemon["level"] = level

    def __str__(self) -> str:
        """
        Prints a representation of the save file
        :return: None
        """
        string = f"{self.title} ({self.game})\n{'-'*80}\nLog:\n"
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

    def add_to_team(self, nickname: str):
        """
        Adds a Pokemon to the team
        :param nickname: The nickname of the Pokemon
        :return: None
        """
        self.json["team"].append(nickname)

    def remove_from_team(self, nickname: str):
        """
        Removes a Pokemon to the team
        :param nickname: The nickname of the Pokemon
        :return: None
        """
        self.json["team"].remove(nickname)

    def populate_duplicate_clause_blacklist(self):
        """
        Populates the duplicate clause blacklist
        :return: None
        """
        current = self.duplicate_clause_blacklist
        species = self.species_blacklist
        for nickname in self.owned_pokemon:
            pokemon_data = self.get_pokemon(nickname)
            species.append(pokemon_data["pokemon"])

        for pokemon in species:
            if pokemon not in current:
                for evo in PokemonData.get_evolutions(pokemon):
                    current.append(evo)
        self.json["duplicate_clause_blacklist"] = current

    def rename_pokemon(self, old_name: str, new_name: str):
        """
        Renames a Pokemon
        :param old_name: The old nickname of the Pokemon
        :param new_name: The new nickname of the Pokemon
        :return: None
        """
        pokemon = self.get_pokemon(old_name)
        self.json["pokemon"].pop(old_name)
        self.json["pokemon"][new_name] = pokemon
        if old_name in self.team_pokemon:
            self.json["team"].remove(old_name)
            self.json["team"].append(new_name)
