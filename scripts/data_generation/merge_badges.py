import json
import os


def load(path):
    with open(path) as f:
        return json.load(f)


location_map = {
    "Elite 4": "Pokemon League",
    "Champion Cup": "Pokemon League",
    "Kanto Badges": "Kanto",
    "Red": "Mt. Silver"
}


def merge(netlify_badges, serebii_badges):
    merged = {}
    for game in netlify_badges:
        base = netlify_badges[game]
        locations = serebii_badges.get(game, [])

        if game in ["HEARTGOLD", "SOULSILVER"]:
            locations.insert(8, None)
            locations.remove("Cerulean City")
            locations.insert(11, "Cerulean City")
        if game in ["RED", "BLUE", "GREEN", "YELLOW", "FIRERED", "LEAFGREEN"]:
            locations[4] = "Saffron City"
            locations[5] = "Fuchsia City"
        if game in ["SUN", "MOON"]:
            locations = [
                "Verdant Cavern",
                "Iki Town",
                "Brooklet Hill",
                "Wela Volcano Park",
                "Lush Jungle",
                "Ruins of Hope",
                "Hokulani Observatory",
                "Route 14",
                "Malie City",
                "Vast Poni Canyon",
                "Vast Poni Canyon"
            ]
        if game in ["ULTRA_SUN", "ULTRA_MOON"]:
            locations = [
                "Verdant Cavern",
                "Iki Town",
                "Brooklet Hill",
                "Wela Volcano Park",
                "Lush Jungle",
                "Ruins of Hope",
                "Hokulani Observatory",
                "Route 14",
                "Malie City",
                "Vast Poni Canyon",
                "Seafolk Village",
                "Poni Island"
            ]

        for i, item in enumerate(base):
            name = location_map.get(item["name"])
            if name is not None:
                item["location"] = name
            elif i < len(locations):
                item["location"] = locations[i]
            else:
                item["location"] = None
        merged[game] = base
    return merged


def main(cachedir, netlify_badges_file, serebii_badges_file):
    netlify_badges = load(netlify_badges_file)
    serebii_badges = load(serebii_badges_file)
    merged = merge(netlify_badges, serebii_badges)

    cachefile = os.path.join(cachedir, "merged_badges.json")
    with open(cachefile, "w") as f:
        json.dump(merged, f, indent=4)
    return cachefile
