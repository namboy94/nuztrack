import json
import os.path

import requests
from bs4 import BeautifulSoup

serebii_badge_game_mapping = {
    "rb": ["RED", "BLUE", "YELLOW", "FIRERED", "LEAFGREEN"],
    "gs": ["GOLD", "SILVER", "CRYSTAL", "SOULSILVER", "HEARTGOLD"],
    "rubysapphire": ["RUBY", "SAPPHIRE", "EMERALD", "OMEGA_RUBY", "ALPHA_SAPPHIRE"],
    "platinum": ["PLATINUM", "PEARL", "DIAMOND", "BRILLIANT_DIAMOND", "SHINING_PEARL"],
    "blackwhite": ["BLACK", "WHITE"],
    "black2white2": ["BLACK_2", "WHITE_2"],
    "xy": ["X", "Y"],
    "swordshield": ["SWORD", "SHIELD"]
}


def load_badge_names(gamegroup):
    if gamegroup == "platinum":
        return load_platinum()

    url = f"https://www.serebii.net/{gamegroup}/gyms.shtml"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    headings = soup.select(".fooleft")
    cities = [x.text.replace(": ", " - ").split("- ")[1].split(" Gym")[0] for x in headings]

    if gamegroup == "swordshield":
        cities.pop(6)
        cities.pop(4)

    return cities


def load_platinum():
    url = f"https://www.serebii.net/platinum/gyms.shtml"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    headings = [x for x in soup.select("b") if "Gym" in x.text]
    cities = [x.text.split("- ")[1].split(" Gym")[0] + " City" for x in headings]
    return cities


def map_to_games(badge_data):
    badges = {}
    for key, data in badge_data.items():
        for game in serebii_badge_game_mapping[key]:
            badges[game] = data
    return badges


def main(basedir):
    print("serebii_badge_data")
    cachefile = os.path.join(basedir, "serebii_badges.json")

    if os.path.isfile(cachefile):
        return cachefile

    badge_data = {}
    for key in serebii_badge_game_mapping.keys():
        badge_data[key] = load_badge_names(key)
    badge_data = map_to_games(badge_data)

    with open(cachefile, "w") as f:
        json.dump(badge_data, f, indent=4)

    return cachefile
