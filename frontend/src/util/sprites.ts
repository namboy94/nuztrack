import {Game} from "../data/games/games.model";

export function getSpriteUrl(speciesName: string, game: Game, shiny: boolean) {
    const gameKeys = new Map<string, string>([
        ["RED", "red-blue"],
        ["BLUE", "red-blue"],
        ["YELLOW", "yellow"],
        ["SILVER", "silver"],
        ["GOLD", "gold"],
        ["CRYSTAL", "crystal"],
        ["RUBY", "ruby-sapphire"],
        ["SAPPHIRE", "ruby-sapphire"],
        ["FIRERED", "firered-leafgreen"],
        ["LEAFGREEN", "firered-leafgreen"],
        ["EMERALD", "emerald"],
        ["DIAMOND", "diamond-pearl"],
        ["PEARL", "diamond-pearl"],
        ["PLATINUM", "platinum"],
        ["HEARTGOLD", "heartgold-soulsilver"],
        ["SOULSILVER", "heartgold-soulsilver"],
        ["BLACK", "black-white"],
        ["WHITE", "black-white"],
        ["BLACK_2", "black-white"],
        ["WHITE_2", "black-white"],
        ["X", "x"],
        ["Y", "y"],
        ["OMEGA_RUBY", "omega-ruby-alpha-sapphire"],
        ["ALPHA_SAPPHIRE", "omega-ruby-alpha-sapphire"]
    ])
    const gameKey = gameKeys.get(game.key) ?? (game.generation === 7 ? "bank" : "home")
    const shinyKey = shiny ? "shiny" : "normal"
    const colorExtra = game.generation == 1 ? "-color" : ""
    return `https://img.pokemondb.net/sprites/${gameKey}/${shinyKey}/${speciesName.toLowerCase()}${colorExtra}.png`
}