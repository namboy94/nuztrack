using CommandLine;

namespace NuztrackSaves;

internal class NuztrackSaveModifier
{
    private static void Main(string[] args)
    {
        CliOptions.Parse(args).WithParsed(options =>
        {
            var transporter = new Transporter(
                new NuztrackSave(options.RunFile), 
                options.SourceFile, 
                options.TargetFile
            );
            transporter.Transport();
        });
    }
}
