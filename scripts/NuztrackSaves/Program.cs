using CommandLine;
using PKHeX.Core;

namespace NuztrackSaves;

internal class NuztrackSaveModifier
{
    private static void Main(string[] args)
    {
        CliOptions.Parse(args).WithParsed(options =>
        {
            if (options.Mode == "PRINT")
            {
                new SaveReader(options.SourceFile, options.TargetFile).printJson();
            }
            else
            {
                new Transporter(
                    new NuztrackSave(options.RunFile!), 
                    options.SourceFile, 
                    options.TargetFile
                ).Transport();
            }
        });
    }
}
