using CommandLine;

namespace NuztrackSaves;

public class CliOptions
{
    [Option("source", Required = true, HelpText = "The source save file to use")]
    public string SourceFile { get; set; } = null!;
    
    [Option("target", Required = true, HelpText = "The target save file to use")]
    public string TargetFile { get; set; } = null!;

    [Option("run", Required = true, HelpText = "The path to the exported Nuzlocke run file")]
    public string RunFile { get; set; } = null!;

    public static ParserResult<CliOptions> Parse(string[] args)
    {
        return Parser.Default.ParseArguments<CliOptions>(args);
    }
}