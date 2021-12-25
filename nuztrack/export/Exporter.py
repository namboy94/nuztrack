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
from nuztrack.saves.SaveFile import SaveFile
from jinja2 import Environment, PackageLoader, select_autoescape


class Exporter:
    """
    Class that exports data in various formats based on a save file
    """

    def __init__(self, save_file: SaveFile):
        """
        Intializes the Exporter object
        :param save_file: The save file to analyze
        """
        self.save_file = save_file

    def export_overview_image(self, path: str):
        """
        Generates an image of the overview of the nuzlocke run
        :param path: The path to the file to which the export is saved to
        :return: None
        """
        env = Environment(
            loader=PackageLoader("nuztrack"),
            autoescape=select_autoescape()
        )
        template = env.get_template("stats.html")

        data = template.render(save_file=self.save_file)
        tmpfile = "/tmp/export.html"
        with open(tmpfile, "w") as f:
            f.write(data)
        imgkit.from_string(data, path)

    def export_log(self, path: str):
        """
        Exports the log as an image
        :param path: The path to the file to which the export is saved to
        :return: None
        """
        pass

    def export_blacklists(self, path: str):
        """
        Exports the blacklists of the save file into a JSON file
        :param path: The path to the file to which the export is saved to
        :return: None
        """
        pass
