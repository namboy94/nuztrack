using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CommandLine;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PKHeX.Core;

namespace Nuztrack
{
    class NuztrackSaveModifier
    {
        public class Options
        {
            [Option("source", Required = true, HelpText = "The source save file to use")]
            public string SourceFile { get; set; } = null!;
            [Option("target", Required = true, HelpText = "The target save file to use")]
            public string TargetFile { get; set; } = null!;
        }

        static void Convert(string source, string target)
        {
            var sourceSave = SaveUtil.GetVariantSAV(source);
            var targetSave = SaveUtil.GetVariantSAV(target);

            var party = sourceSave.PartyData;
            var box = sourceSave.BoxData;
            
            ConvertPokemonParty(party);
            ConvertPokemonParty(box);
            
            targetSave.PartyData = party;
            targetSave.BoxData = box;
            targetSave.OT = sourceSave.OT;
            targetSave.TrainerID7 = sourceSave.TrainerID7;

            targetSave.SetBoxData(sourceSave.GetBoxData(sourceSave.BoxCount - 1), targetSave.BoxCount - 1);
            
            File.WriteAllBytes(target, targetSave.Write());
        }

        static void ConvertPokemonParty(IList<PKM> party)
        {
            string pokedexData =
                System.IO.File.ReadAllText("../../src/main/resources/data/pokemon.json");
            dynamic pokedex = JsonConvert.DeserializeObject(pokedexData);
            for (int i = 0; i < party.Count; i++)
            {
                var pokemon = party[i];

                if (pokemon.Species == 0)
                {
                    continue;
                }

                var species = pokemon.Species;
                var newSpecies = pokedex[pokemon.Species.ToString()].baseSpecies;
                while (newSpecies > species)
                {
                    JArray evos = pokedex[newSpecies.ToString()].evolutions;
                    if (evos.ToList().Contains(species))
                    {
                        newSpecies = species;
                    }
                    else
                    {
                        newSpecies = evos[0];
                    }
                }

                pokemon.CurrentLevel = -1;
                pokemon.Species = newSpecies;
                
                pokemon.Moves = new LegalityAnalysis(pokemon).GetSuggestedCurrentMoves();
                pokemon.CurrentLevel = 5;

                pokemon.EVs = new int[] { 0, 0, 0, 0, 0, 0 }; 
                party[i] = pokemon;

            }
        }

        static void Main(string[] args)
        {
            Parser.Default.ParseArguments<Options>(args).WithParsed<Options>(o =>
            {
                Convert(o.SourceFile, o.TargetFile);
            });
        }
    }
}
