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
import logging
from typing import List, Optional, Dict, Any
from nuztrack.saves.events.Death import Death
from nuztrack.saves.events.Encounter import Encounter
from nuztrack.enums import NuzlockeRules, RunState
from nuztrack.data.PokemonData import PokemonData
from nuztrack.saves.OwnedPokemon import OwnedPokemon
from nuztrack.saves.events.Event import Event
from nuztrack.saves.events.Evolution import Evolution
from nuztrack.saves.events.Milestone import Milestone
from nuztrack.saves.events.Note import Note


class SaveFile:
    """
    Class that encapsulates the save data for a single nuzlocke run
    """

    def __init__(self, path: str, pokemon_data: PokemonData):
        """
        Initializes the SaveFile object
        :param path: The path to the file path
        :param pokemon_data: The pokemon data fetching object
        """
        self.logger = logging.getLogger("SaveFile")
        self.path = path
        self.pokemon_data = pokemon_data
        self.__json = {}
        if os.path.isfile(path):
            with open(path, "r") as f:
                self.__json = json.load(f)

        for list_key in [
            "encounters",
            "owned_pokemon",
            "nickname_blacklist",
            "species_blacklist",
            "deaths",
            "evolutions",
            "milestones",
            "notes"
        ]:
            if list_key not in self.__json:
                self.__json[list_key] = []

    def write(self):
        """
        Writes the data to file
        :return: None
        """
        with open(self.path, "w") as f:
            json.dump(self.__json, f, indent=4)

    @classmethod
    def create(
            cls,
            pokemon_data: PokemonData,
            path: str,
            title: str,
            game: str,
            selected_rules: List[NuzlockeRules],
            extra_rules: List[str],
            genlocke_import_file: Optional[str]
    ):
        """
        Creates a new SaveFile object based on some parameters
        :param pokemon_data: The PokemonData object to use
        :param path: The path to the file
        :param title: The title of the save file
        :param game: The game title used
        :param selected_rules: The selected nuzlocke rules
        :param extra_rules: Any extra rules in text form
        :param genlocke_import_file: Allows import of another save file to
                                     continue a genlocke file
        :return: None
        """
        data: Dict[str, Any] = {
            "title": title,
            "game": game,
            "state": RunState.ONGOING.value,
            "selected_rules": [x.name for x in selected_rules],
            "extra_rules": extra_rules,
            "nickname_blacklist": [],
            "species_blacklist": [],
            "encounters": []
        }
        if genlocke_import_file is not None:
            old_save = cls(genlocke_import_file, pokemon_data)
            for pokemon in old_save.team + old_save.dead_pokemon:
                data["nickname_blacklist"].append(pokemon.nickname)
                if NuzlockeRules.DUPLICATE_CLAUSE in selected_rules:
                    data["species_blacklist"].append(pokemon.pokedex_number)
            data["nickname_blacklist"] += old_save.nickname_blacklist
            data["species_blacklist"] += old_save.species_blacklist

        with open(path, "w") as f:
            json.dump(data, f, indent=4)

        if genlocke_import_file is not None:
            new_save = cls(path, pokemon_data)
            old_save = cls(genlocke_import_file, pokemon_data)
            for i, pokemon in enumerate(old_save.team):
                species = pokemon_data.get_pokemon(pokemon.pokedex_number)
                pokemon.level = 5
                pokemon.pokedex_number = species.related_species[0]
                new_save.register_encounter(Encounter(
                    f"Import {i + 1}",
                    pokemon.pokedex_number,
                    level=pokemon.level,
                    gender=pokemon.gender,
                    obtained=True,
                    nickname=pokemon.nickname
                ))
                new_save.register_catch(pokemon)
            new_save.write()

    @property
    def title(self) -> str:
        """
        :return: The title of the save file
        """
        return self.__json["title"]

    @property
    def title_with_path(self) -> str:
        """
        :return: The title of the save file and the path to the save file
        """
        return f"{self.__json['title']} ({self.path})"

    @property
    def state(self) -> RunState:
        """
        :return: The state of the nuzlocke run
        """
        return RunState(self.__json["state"])

    @state.setter
    def state(self, state: RunState):
        """
        Sets the state of the nuzlocke run
        :param state: The state to set
        :return: None
        """
        self.__json["state"] = state.value

    @property
    def game(self) -> str:
        """
        :return: The game which this save file keeps track of
        """
        return self.__json["game"]

    @property
    def generation(self) -> int:
        """
        :return: The generation of the game
        """
        return self.pokemon_data.get_generation(self.game)

    @property
    def enforced_rules(self) -> List[NuzlockeRules]:
        """
        :return: A list of enforced nuzlocke rules
        """
        return [NuzlockeRules[x] for x in self.__json["selected_rules"]]

    @property
    def species_blacklist(self) -> List[int]:
        """
        :return: A list of blacklisted species
        """
        return self.__json["species_blacklist"]

    @property
    def nickname_blacklist(self) -> List[str]:
        """
        :return: A list of blacklisted nicknames
        """
        return self.__json["nickname_blacklist"]

    @property
    def encounters(self) -> List[Encounter]:
        """
        :return: All registered encounters
        """
        return [Encounter.from_json(x) for x in self.__json["encounters"]]

    @property
    def custom_locations(self) -> List[str]:
        """
        :return: A list of custom locations
        """
        default_locations = self.pokemon_data.get_locations(self.game)
        encounter_locations = [x.location for x in self.encounters]
        return [x for x in encounter_locations if x not in default_locations]

    @property
    def owned_pokemon(self) -> List[OwnedPokemon]:
        """
        :return: The list of owned Pokemon objects, sorted by team members,
                 reserves and deceased
        """
        team_pokemon = []
        reserve_pokemon = []
        dead_pokemon = []
        for pokemon_data in self.__json["owned_pokemon"]:
            pokemon = OwnedPokemon.from_json(pokemon_data)
            if pokemon.in_team:
                team_pokemon.append(pokemon)
            elif pokemon.deceased:
                dead_pokemon.append(pokemon)
            else:
                reserve_pokemon.append(pokemon)
        return team_pokemon + reserve_pokemon + dead_pokemon

    @property
    def team(self) -> List[OwnedPokemon]:
        """
        :return: A list of Pokemon that are currently in the team
        """
        return [x for x in self.owned_pokemon if x.in_team]

    @property
    def boxed_pokemon(self) -> List[OwnedPokemon]:
        """
        :return: A list of Pokemon that are currently in the PC box
        """
        return [
            x for x in self.owned_pokemon if not x.in_team and not x.deceased
        ]

    @property
    def dead_pokemon(self) -> List[OwnedPokemon]:
        """
        :return: A list of Pokemon that are deceased
        """
        return [x for x in self.owned_pokemon if x.deceased]

    @property
    def unvisited_locations(self) -> List[str]:
        """
        :return: A list of locations that have not been visited yet
        """
        all_locations = self.pokemon_data.get_locations(self.game)
        visited = [x.location for x in self.encounters]
        return [x for x in all_locations if x not in visited]

    @property
    def milestones(self) -> List[Milestone]:
        """
        :return: The milestones (badges/league/trial pokemon etc)
                 that have been registered
        """
        return [Milestone.from_json(x) for x in self.__json["milestones"]]

    @property
    def max_milestones(self) -> int:
        """
        :return: The maximum amount of milestones for the game
        """
        if self.generation == 2:
            return 8 + 1 + 8 + 1
        elif self.generation == 7:
            if self.game in ["sun", "moon"]:
                return 6 + 4 + 1
            else:
                return 7 + 5 + 1
        else:
            return 8 + 1

    @property
    def notes(self) -> List[Note]:
        """
        :return: The notes that have been registered
        """
        return [Note.from_json(x) for x in self.__json["notes"]]

    @property
    def events(self) -> List[Event]:
        """
        :return: A list of all events, sorted by their timestamp
        """
        events: List[Event] = self.encounters
        events += self.milestones
        events += self.notes
        events += [Evolution.from_json(x) for x in self.__json["evolutions"]]
        events += [Death.from_json(x) for x in self.__json["deaths"]]
        events.sort(key=lambda x: x.timestamp)
        return events

    def get_pokemon(self, nickname: str) -> OwnedPokemon:
        """
        Retrieves an OwnedPokemon object based on a nickname
        :param nickname: The nickname
        :return: The associated Pokemon
        """
        return {
            x.nickname: x for x in self.owned_pokemon
        }[nickname]

    def is_capture_allowed(self, species: int) -> bool:
        """
        Checks if a capture is allowed
        :param species: The species to check
        :return: None
        """
        rules = self.enforced_rules

        blacklist = list(self.species_blacklist)

        if NuzlockeRules.NO_LEGENDARIES in rules:
            blacklist += \
                [144, 145, 146, 150, 151] + \
                [243, 244, 245, 249, 250, 251] + \
                list(range(377, 387)) + \
                list(range(480, 495)) + \
                list(range(638, 650)) + \
                list(range(716, 722)) + \
                [772, 773] + list(range(785, 810)) + \
                list(range(888, 899))

        if NuzlockeRules.DUPLICATE_CLAUSE in rules:
            blacklist += [
                x.pokedex_number
                for x in self.encounters
                if x.obtained or
                NuzlockeRules.DUPLICATE_CLAUSE_ENCOUNTERS in rules
            ]
        if NuzlockeRules.DUPLICATE_CLAUSE_EVOLUTIONS:
            for pokedex_number in list(blacklist):
                blacklist += self.pokemon_data.get_pokemon(
                    pokedex_number
                ).related_species

        return species not in blacklist

    def is_nickname_allowed(self, nickname: str) -> bool:
        """
        Checks if a nickname is allowed
        :param nickname: The nickname to check
        :return: True if the nickname is allowed, False otherwise
        """
        existing_nicknames = [
            x.nickname for x in self.owned_pokemon
            if x.nickname.lower() !=
            self.pokemon_data.get_pokemon(x.pokedex_number).name
        ]
        return nickname not in existing_nicknames + self.nickname_blacklist

    def register_encounter(self, encounter: Encounter):
        """
        Registers an encounter
        :param encounter: The encounter to register
        :return: None
        """
        self.__json["encounters"].append(encounter.to_json())

    def register_catch(self, pokemon: OwnedPokemon):
        """
        Registers a Pokemon capture
        :param pokemon: The caught Pokemon
        :return: None
        """
        if len(self.team) < 6:
            pokemon.in_team = True
        self.__json["owned_pokemon"].append(pokemon.to_json())

    def register_evolution(self, evolution: Evolution):
        """
        Registers the evolution of a Pokemon
        :param evolution: The evolution to register
        :return: None
        """
        self.__json["evolutions"].append(evolution.to_json())
        pokemon = self.get_pokemon(evolution.nickname)
        pokemon.pokedex_number = evolution.new_species
        self.update_pokemon(pokemon)

    def register_death(self, death: Death):
        """
        Registers a Pokemon's death
        :param death: The death to register
        :return: None
        """
        self.__json["deaths"].append(death.to_json())
        pokemon = self.get_pokemon(death.nickname)
        pokemon.deceased = True
        pokemon.in_team = False
        pokemon.level = death.level
        self.update_pokemon(pokemon)

    def register_milestone(self, milestone: Milestone):
        """
        Adds a milestone
        :param milestone: The milestone to register
        :return: None
        """
        self.__json["milestones"].append(milestone.to_json())

    def register_note(self, note: Note):
        """
        Adds a note
        :param note: The note to register
        :return: None
        """
        self.__json["notes"].append(note.to_json())

    def update_pokemon(self, pokemon: OwnedPokemon, nickname: Optional[str] = None):
        """
        Updates a Pokemon.
        If no explicit nickname is provided, the nickname of the Pokemon
        object is used, in which case the nickname may not have been changed
        :param pokemon: The new pokemon data
        :param nickname: The explicit nickname
        :return: None
        """
        if nickname is None:
            nickname = pokemon.nickname

        nicknames = [
            OwnedPokemon.from_json(x).nickname
            for x in self.__json["owned_pokemon"]
        ]
        index = nicknames.index(nickname)
        self.__json["owned_pokemon"][index] = pokemon.to_json()
