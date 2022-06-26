using CommandLine;
using PKHeX.Core;

namespace Nuztrack
{
    class NuztrackSaveModifier
    {
        public class Options
        {
            [Option("savefile", Required = true, HelpText = "The ave file to use")]
            public String SaveFile { get; set; } = null!;
        }

        static void Main(string[] args)
        {
            Parser.Default.ParseArguments<Options>(args).WithParsed<Options>(o =>
            {
                var sav = SaveUtil.GetVariantSAV(o.SaveFile);
                var allPokemon = sav.PartyData.Concat(sav.BoxData);
                
                foreach (var pokemon in allPokemon)
                {
                    if (pokemon.Nickname == "")
                    {
                        continue;
                    }

                    

                    Console.WriteLine(pokemon.Nickname);
                    Console.WriteLine(pokemon.CurrentLevel);
                    Console.WriteLine(pokemon.EV_SPD);
                    
                    pokemon.CurrentLevel = 5;
                    
                    Console.WriteLine(pokemon.CurrentLevel);
                    Console.WriteLine("-----------------------");
                }

            });
        }
    }
}
