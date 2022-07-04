using Newtonsoft.Json;

namespace PKHeX.Core;

public class SaveReader
{

    private SaveFile _saveFile;
    private string _targetFile;
    
    public SaveReader(string path, string target)
    {
        this._saveFile = SaveUtil.GetVariantSAV(path)!;
        this._targetFile = target;
    }

    public void printJson()
    {
        var data = new List<Pokemon>();

        foreach (var partyMember in this._saveFile.PartyData)
        {
            var converted = ConvertPKM(partyMember, true);
            if (converted != null)
            {
                data.Add(converted);
            }
        }

        foreach (var boxMember in this._saveFile.BoxData)
        {
            var converted = ConvertPKM(boxMember, false);
            if (converted != null)
            {
                data.Add(converted);
            }
        }
        
        File.WriteAllText(this._targetFile, JsonConvert.SerializeObject(data));
    }

    private Pokemon? ConvertPKM(PKM pkm, bool active)
    {
        if (pkm.Species == 0)
        {
            return null;
        }

        string? gender = _saveFile.Generation < 2
            ? null
            : ((Gender) pkm.Gender).ToString().ToUpper().Replace("GENDERLESS", "NEUTRAL");

        string? nature = _saveFile.Generation < 3 ? null : ((Nature) pkm.Nature).ToString().ToUpper();
        int? abilitySlot = _saveFile.Generation < 3 ? null : pkm.Ability! + 1;
        
        return new Pokemon(
            pkm.Nickname,
            pkm.Species,
            active,
            pkm.CurrentLevel,
            gender,
            nature,
            abilitySlot
        );
        
    }
    
}

class Pokemon
{
    public string nickName { get; set;  }
    public int species { get; set; }
    public bool active { get; set; }
    public int level { get; set; }
    public string? gender { get; set; }
    public string? nature { get; set; }
    public int? abilitySlot { get; set; }

    public Pokemon(string nickName, int species, bool active, int level, string? gender, string? nature, int? abilitySlot)
    {
        this.nickName = nickName;
        this.species = species;
        this.active = active;
        this.level = level;
        this.gender = gender;
        this.nature = nature;
        this.abilitySlot = abilitySlot;
    }
}