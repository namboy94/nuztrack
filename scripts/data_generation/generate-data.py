import os
import shutil

from bundle import main as bundle_location_data
from merge_badges import main as merge_badges
from nuzlocke_netlify import main as nuzlocke_netlify
from pokeapi import main as pokeapi
from serebii_badge_data import main as serebii_badge_data

basedir = "/tmp/nuzlocke/"
cachedir = "cache"


def main():
    os.makedirs(cachedir, exist_ok=True)
    locations_file, badges_file = nuzlocke_netlify(basedir, cachedir)
    pokemon_file = pokeapi(cachedir)
    serebii_badges = serebii_badge_data(cachedir)
    merged_badges = merge_badges(cachedir, badges_file, serebii_badges)
    bundled = bundle_location_data(cachedir, locations_file, merged_badges)

    shutil.copyfile(pokemon_file, "../../src/main/resources/data/pokemon.json")
    shutil.copyfile(bundled, "../../src/main/resources/data/locations.json")


if __name__ == '__main__':
    main()