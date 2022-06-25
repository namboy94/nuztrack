import copy
import json
import os
from subprocess import Popen, check_output, DEVNULL

COMMIT = "d06cc1cd1987497865307bed0eca6db4143be5e2"
gh_badge_url_base = "https://raw.githubusercontent.com/diballesteros/nuzlocke/master/src/assets/img/badges/"
gamemap = {
    "R_B_Y": ["RED", "BLUE", "YELLOW"],
    "G_S_C": ["GOLD", "SILVER", "CRYSTAL"],
    "R_S_E": ["RUBY", "SAPPHIRE", "EMERALD"],
    "FR_LG": ["FIRERED", "LEAFGREEN"],
    "D_P_PLAT": ["DIAMOND", "PEARL", "PLATINUM"],
    "HG_SS": ["HEARTGOLD", "SOULSILVER"],
    "B_W": ["BLACK", "WHITE"],
    "B_W_2": ["BLACK_2", "WHITE_2"],
    "X_Y": ["X", "Y"],
    "OR_AS": ["OMEGA_RUBY", "ALPHA_SAPPHIRE"],
    "S_M": ["SUN", "MOON"],
    "US_UM": ["ULTRA_SUN", "ULTRA_MOON"],
    "SW_SH": ["SWORD", "SHIELD"],
    "BD_SP": ["BRILLIANT_DIAMOND", "SHINING_PEARL"]
}
badgemap = {
    "REDANDBLUE": ["RED", "BLUE"],
    "YELLOW": ["YELLOW"],
    "GOLDSILVERCRYSTAL": ["GOLD", "SILVER", "CRYSTAL"],
    "RUBYANDSAPPHIRE": ["RUBY", "SAPPHIRE"],
    "EMERALD": ["EMERALD"],
    "FRLG": ["FIRERED", "LEAFGREEN"],
    "DIAMONDANDPEARL": ["DIAMOND", "PEARL"],
    "PLATINUM": ["PLATINUM"],
    "HGSS": ["HEARTGOLD", "SOULSILVER"],
    "BW": ["BLACK", "WHITE"],
    "BW2NORMALMODE": ["BLACK_2", "WHITE_2"],
    "XY": ["X", "Y"],
    "ORAS": ["OMEGA_RUBY", "ALPHA_SAPPHIRE"],
    "SM": ["SUN", "MOON"],
    "USUM": ["ULTRA_SUN", "ULTRA_MOON"],
    "SWSH": ["SWORD", "SHIELD"],
    "BDSP": ["BRILLIANT_DIAMOND", "SHINING_PEARL"]
}
corrected_names = {
    "Spinark": "Spinarak",
    "Milktank": "Miltank",
    "Macargo": "Magcargo",
    "Ledybda": "Ledyba",
    "Dodouo": "Doduo",
    "Konmmo-o": "Kommo-o",
    "Groyvle": "Grovyle",
    "Barrskewda": "Barraskewda",
    "Skowvet": "Skwovet",
    "Kirilia": "Kirlia",
    "Seimsitoad": "Seismitoad",
    "Grappoloct": "Grapploct",
    "Galavantula": "Galvantula",
    "Rhyorn": "Rhyhorn",
    "Rimbombee": "Ribombee",
    "Barbarcle": "Barbaracle",
    "Togedmaru": "Togedemaru",
    "Hakam-o": "Hakamo-o",
    "Hatterne": "Hatterene",
    "Barraskweda": "Barraskewda",
    "Swirilix": "Swirlix",
    "Flaafy": "Flaaffy",
    "Tentracruel": "Tentacruel",
    "Meditie": "Meditite"
}


def execute_typescript(script: str):
    ts_scriptfile = "/tmp/locationprinter.ts"
    js_scriptfile = ts_scriptfile.replace(".ts", ".js")
    with open(ts_scriptfile, "w") as f:
        f.write(script)
    Popen(["tsc", ts_scriptfile], stdout=DEVNULL, stderr=DEVNULL).wait()
    result = check_output(["node", js_scriptfile])
    return json.loads(result.decode("utf-8"))


def read_location_file(basedir: str, identifier: str):
    import_path = os.path.join(basedir, "src/constants/locations", identifier)
    data = execute_typescript(f"import {identifier} from \"{import_path}\"; "
                              f"console.log(JSON.stringify({identifier}))")
    return [{"key": x["filterKey"], "name": x["location"]} for x in data if x["location"].lower() != "starter"]


def read_encounters_file(basedir: str, ):
    import_path = os.path.join(basedir, "src/constants/filters")
    return execute_typescript(f"import FILTERS from \"{import_path}\";"
                              f"console.log(JSON.stringify(FILTERS))")


def read_pokemon_file(basedir: str, ):
    import_path = os.path.join(basedir, "src/constants/pokemon")
    data = execute_typescript(f"import POKEMON from \"{import_path}\";"
                              f"console.log(JSON.stringify(POKEMON))")
    return {x["text"]: x["value"] for x in data}


def fix_badges_file(basedir: str, ):
    badge_file = os.path.join(basedir, "src/constants/badges")
    with open(badge_file + ".ts") as f:
        content = f.read()
    blocks = content.split("import")[-1].split("\n", 1)[1].split(",\n}")
    iconblock = blocks[3]
    icondata = []
    for line in iconblock.split("\n"):
        if "src:" in line:
            icondata.append(line.replace(": ", ": \"").replace(",", "\","))
        else:
            icondata.append(line)
    iconblock = "\n".join(icondata)

    fixed = blocks[0] + "};\n" + blocks[1] + "};\n" + blocks[2] + "};\n" + iconblock + "};\n"
    fixed = fixed.replace("const BADGES", "export const BADGES")

    with open(badge_file + "-fixed.ts", "w") as f:
        f.write(fixed)


def read_badges_file(basedir: str, ):
    fix_badges_file(basedir)
    import_path = os.path.join(basedir, "src/constants/badges-fixed")
    data = {}
    for key in ["BADGES", "GAME_CAP_DICTIONARY", "LEVEL_CAPS", "BADGE_IMAGES"]:
        data[key] = execute_typescript(f"import {'{' + key + '}'} from \"{import_path}\";"
                                       f"console.log(JSON.stringify({key}))")
    return data


def replace_pokemon_names_with_pokedex_numbers_in_encounters(raw_encounters, pokemon):
    encounters = {}
    for location_key in raw_encounters.keys():
        wrong = [
            x for x in raw_encounters[location_key]
            if corrected_names.get(x, x) not in pokemon
        ]
        if len(wrong) > 0:
            print(wrong)
        encounters[location_key] = [pokemon[corrected_names.get(x, x)] for x in raw_encounters[location_key]]
    return encounters


def fill_locations_with_encounters(raw_locations, encounters):
    locations = {}
    for group, data in raw_locations.items():
        locations[group] = [
            {
                "name": x["name"],
                "encounters": encounters.get(x["key"], [])
            }
            for x in data
        ]
    return locations


def generate_locations_for_individual_games(locations):
    new_locations = {}
    for gamegroup, gamelist in gamemap.items():
        gamegroup_locations = locations[gamegroup]
        for game in gamelist:
            new_locations[game] = gamegroup_locations
    return new_locations


def process_badges(badge_data):
    badges = badge_data["BADGES"]
    cap_dict = badge_data["GAME_CAP_DICTIONARY"]
    cap_dict["GOLDSILVERCRYSTAL"].insert(3, 25)  # Missing Fog Badge Data
    caps = badge_data["LEVEL_CAPS"]
    images = badge_data["BADGE_IMAGES"]
    badges = {
        genkey: [
            {
                "name": x["name"],
                "image": gh_badge_url_base + images[genkey][i]["src"] + ".png"
            }
            for (i, x) in enumerate(data)
        ] for genkey, data in badges.items()
    }

    combined = {}
    for genkey, data in badges.items():
        gen_badges = badges[genkey]
        capkeys = [x["value"] for x in caps[genkey]]
        for capkey in capkeys:
            lvl_caps = cap_dict[capkey]
            combined[capkey] = copy.deepcopy(gen_badges)
            for i, cap in enumerate(lvl_caps):
                combined[capkey][i]["level_cap"] = int(cap)
    return combined


def generate_badges_for_individual_games(badges):
    expanded = {}
    for gamegroup, data in badges.items():

        if gamegroup in ["BW2EASYMODE", "BW2CHALLENGEMODE"]:
            continue

        for game in badgemap[gamegroup]:
            expanded[game] = data
    return expanded


def save(obj, path):
    with open(path, "w") as f:
        json.dump(obj, f, indent=4)


def main(basedir, cachedir):
    print("nuzlocke_netlify")
    locations_cache = os.path.join(cachedir, "locations.json")
    badges_cache = os.path.join(cachedir, "badges.json")

    if not os.path.isdir(basedir):
        Popen(["git", "clone", "https://github.com/diballesteros/nuzlocke.git", basedir]).wait()
        current = os.getcwd()
        os.chdir(basedir)
        Popen(["git", "reset", "--hard", COMMIT])
        os.chdir(current)

    if not os.path.isfile(badges_cache):
        badges = read_badges_file(basedir)
        badges = process_badges(badges)
        badges = generate_badges_for_individual_games(badges)
        save(badges, badges_cache)

    if not os.path.isfile(locations_cache):
        pokemon = read_pokemon_file(basedir)
        encounters = read_encounters_file(basedir)
        locations = {group: read_location_file(basedir, group) for group in gamemap.keys()}
        encounters = replace_pokemon_names_with_pokedex_numbers_in_encounters(encounters, pokemon)
        locations = fill_locations_with_encounters(locations, encounters)
        locations = generate_locations_for_individual_games(locations)
        save(locations, locations_cache)

    return locations_cache, badges_cache
