using System.Globalization;
using PKHeX.Core;

namespace NuztrackSaves;

public class Transporter
{
    private readonly NuztrackSave _nuztrackSave;
    private readonly string _sourceSaveFile;
    private readonly string _targetSaveFile;

    public Transporter(NuztrackSave nuztrackSave, string sourceSaveFile, string targetSaveFile)
    {
        _nuztrackSave = nuztrackSave;
        _sourceSaveFile = sourceSaveFile;
        _targetSaveFile = targetSaveFile;
    }

    public void Transport()
    {
        var sourceGame = SaveUtil.GetVariantSAV(_sourceSaveFile)!;
        var targetGame = SaveUtil.GetVariantSAV(_targetSaveFile)!;
        
        if (sourceGame.Generation > targetGame.Generation)
        {
            throw new ArgumentException("Can't convert from newer generation to older generation");
        }
        
        var party = sourceGame.PartyData;
        var box = sourceGame.BoxData;

        AdjustPartyToNuztrackSave(party);

        AdjustPartyToNuztrackSave(box);
        FillBoxWithParty(box, party);
        targetGame.BoxData = box;
        AdjustTrainerData(targetGame, sourceGame);
        
        File.WriteAllBytes(_targetSaveFile, targetGame.Write());
    }

    private void AdjustTrainerData(SaveFile targetGame, SaveFile sourceGame)
    {
        targetGame.OT = sourceGame.OT;
        targetGame.TrainerID7 = sourceGame.TrainerID7;
        targetGame.TrainerSID7 = sourceGame.TrainerSID7;
        targetGame.Gender = sourceGame.Gender;
        targetGame.SID = sourceGame.SID;
        targetGame.TID = sourceGame.TID;
    }

    private void FillBoxWithParty(IList<PKM> box, IList<PKM> party)
    {
        var partyIndex = 0;
        for (var i = 0; i < box.Count && partyIndex < party.Count; i++)
            if (box[i].Species == 0)
            {
                box[i] = party[partyIndex];
                partyIndex++;
            }
    }

    private void AdjustPartyToNuztrackSave(IList<PKM> party)
    {
        for (var i = 0; i < party.Count; i++)
        {
            var pokemon = party[i];
            if (pokemon.Species == 0)
            {
                continue;
            }
            AdjustPokemonToNuztrackSave(pokemon);
            party[i] = pokemon;
        }
    }

    private void AdjustPokemonToNuztrackSave(PKM pokemon)
    {
        var nuztrackPokemon = _nuztrackSave.GetPokemon(pokemon.Nickname);
        if (nuztrackPokemon == null)
        {
            Console.WriteLine("Missing nuztrack data for: " + pokemon.Nickname);
            return;
        }
        
        pokemon.Species = nuztrackPokemon.Species;
        if (pokemon.CurrentLevel != nuztrackPokemon.Level)
        {
            pokemon.CurrentLevel = -1;
            pokemon.Moves = new LegalityAnalysis(pokemon).GetSuggestedCurrentMoves();
            pokemon.CurrentLevel = nuztrackPokemon.Level;
            pokemon.EVs = new[] {0, 0, 0, 0, 0, 0};
        }

        var textInfo = new CultureInfo("en-US", false).TextInfo;
        if (nuztrackPokemon.Gender != null)
        {
            var genderName = textInfo.ToTitleCase(nuztrackPokemon.Gender.ToLower());
            if (genderName == "Neutral")
            {
                genderName = "Genderless";
            }

            pokemon.Gender = (int) (Gender) Enum.Parse(typeof(Gender), genderName);
        }

        if (nuztrackPokemon.Nature != null)
        {
            var natureName = textInfo.ToTitleCase(nuztrackPokemon.Nature.ToLower());
            pokemon.Nature = (int) (Nature) Enum.Parse(typeof(Nature), natureName);
        }

        if (nuztrackPokemon.AbilitySlot != null)
        {
            pokemon.SetAbilityIndex((int)nuztrackPokemon.AbilitySlot - 1);
        }
    }
}