using Newtonsoft.Json;

namespace NuztrackSaves;

public class NuztrackSave
{
    private Dictionary<string, NuztrackPokemon> _team = new();

    public NuztrackSave(string nuztrackSaveFilePath)
    {
        var saveFileContent = File.ReadAllText(nuztrackSaveFilePath);
        dynamic saveData = JsonConvert.DeserializeObject(saveFileContent)!;
        FillTeam(saveData.team.active!);
        FillTeam(saveData.team.boxed!);
        FillTeam(saveData.team.dead!);
    }

    private void FillTeam(dynamic teamMembers)
    {
        foreach (var teamMember in teamMembers)
        {
            NuztrackPokemon pokemon = new NuztrackPokemon(
                (string) teamMember.nickname,
                (int) teamMember.level,
                (int) teamMember.pokedexNumber,
                teamMember.abilitySlot == null ? null : (int) teamMember.abilitySlot,
                teamMember.nature == null ? null : (string) teamMember.nature,
                teamMember.gender == null ? null : (string) teamMember.gender
                );
            _team.Add(pokemon.Nickname, pokemon);
        }
    }

    public NuztrackPokemon? GetPokemon(string nickname)
    {
        return _team.GetValueOrDefault(nickname);
    }
}

public class NuztrackPokemon
{
    public string Nickname { get; }
    public int Level { get; }
    public int Species { get; }
    public int? AbilitySlot { get; }
    public string? Nature { get; }
    public string? Gender { get; }

    public NuztrackPokemon(string nickname, int level, int species, int? abilitySlot, string? nature, string? gender)
    {
        Nickname = nickname;
        Level = level;
        Species = species;
        AbilitySlot = abilitySlot;
        Nature = nature;
        Gender = gender;
    }
}