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

from enum import Enum


class NuzlockeRules(Enum):
    """
    An enumeration of pre-installed nuzlocke rules
    """
    DEATH = "Pokemon that faint are considered dead and may no longer be used"
    FIRST_ENCOUNTER = "Only the first encounter of any given " \
                      "area may be caught"
    DUPLICATE_CLAUSE = "Only the first non-duplicate encounter of any " \
                       "given area may be caught"
    DUPLICATE_EVO_CLAUSE = "Encounters with species of the same " \
                           "evolutionary line are considered duplicates"
    NICKNAME_ALL = "The player must nickname every caught Pokemon"
    NICKNAME_TEAM = "The player must nickname every Pokemon that is part " \
                    "of the team at any point"
    NO_TRADES = "No traded Pokemon may be used"
    NO_GIFTS = "No gifted Pokemon may be used"
    NO_LEGENDARIES = "No legendary Pokemon may be used"
    NO_ITEMS = "No Items may be used in battle"
    NO_X_ITEM = "No in-battle stat enhancing items may be used"
    NO_POKEMART = "Pokemarts may not be used"
    NO_POKECENTER = "Pokecenters may not be used"
    WONDERLOCKE = "Any obtained Pokemon must be wonder-traded"
