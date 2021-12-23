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

import imgkit
from nuztrack._export.Pokemon import Pokemon
from nuztrack.files.PokemonData import PokemonData
from nuztrack.files.SaveFile import SaveFile
from jinja2 import Environment, PackageLoader, select_autoescape


class Exporter:
    def __init__(self, save_file: SaveFile, pokemon_data: PokemonData):
        self.save_file = save_file
        self.pokemon_data = pokemon_data

    def export(self, path: str):
        env = Environment(loader=PackageLoader("nuztrack"), autoescape=select_autoescape())
        template = env.get_template("stats.html")

        team_pokemon = []
        box_pokemon = []
        dead_pokemon = []
        for nickname in self.save_file.owned_pokemon:
            pokemon_data = self.save_file.get_pokemon(nickname)
            sprite = self.pokemon_data.get_sprite(pokemon_data["pokemon"])
            obj = Pokemon(
                pokemon_data["pokemon"],
                nickname,
                sprite
            )
            if nickname in self.save_file.team_pokemon:
                team_pokemon.append(obj)
            elif nickname in self.save_file.boxed_pokemon:
                box_pokemon.append(obj)
            else:
                dead_pokemon.append(obj)

        data = template.render(
            title=self.save_file.title,
            state=self.save_file.state.title(),
            game=self.save_file.game.title(),
            team_pokemon=team_pokemon,
            box_pokemon=box_pokemon,
            dead_pokemon=dead_pokemon,
            log_entries=self.save_file.log_messages,
            badges=self.save_file.badges
        )
        tmpfile = "/tmp/export.html"
        with open(tmpfile, "w") as f:
            f.write(data)
        imgkit.from_string(data, path)
