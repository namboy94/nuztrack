import json
import os.path


def load(path):
    with open(path) as f:
        return json.load(f)


def combine(locations, badges):
    combined = {}
    for game in locations.keys():
        game_locations = locations[game]
        game_badges = badges[game]
        adjusted = []

        for location in game_locations:
            milestone_indexes = []
            for i, badge in reversed(list(enumerate(game_badges))):
                if location["name"] == badge["location"]:
                    milestone_indexes.append(i)

            milestones = []
            for index in milestone_indexes:
                to_add = game_badges.pop(index)
                to_add.pop("location")
                milestones.append(to_add)
            location["milestones"] = milestones

            # Remove special forms of Pokemon, TODO integrate those at some point
            location["encounters"] = [abs(x) for x in location["encounters"]]

            adjusted.append(location)

        for badge in game_badges:
            adjusted.append({
                "name": badge.pop("location"),
                "milestones": [badge],
                "encounters": []
            })
        combined[game] = adjusted
    return combined


def main(cachedir, locations_file, badges_file):
    locations = load(locations_file)
    badges = load(badges_file)
    combined = combine(locations, badges)

    cachefile = os.path.join(cachedir, "locations.json")
    with open(cachefile, "w") as f:
        json.dump(combined, f, indent=4)

    return cachefile
