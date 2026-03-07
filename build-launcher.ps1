$code = @"
using System;
using System.Diagnostics;
using System.Net;
using System.Threading;
using System.IO;

class Launcher {
    [STAThread]
    static void Main() {
        string appDir = AppDomain.CurrentDomain.BaseDirectory;
        string url = "http://localhost:5173";

        // Install dependencies if node_modules is missing
        string nodeModules = Path.Combine(appDir, "node_modules");
        if (!Directory.Exists(nodeModules)) {
            var install = new Process();
            install.StartInfo.FileName = "cmd.exe";
            install.StartInfo.Arguments = "/c cd /d \"" + appDir + "\" && npm install";
            install.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
            install.StartInfo.UseShellExecute = false;
            install.Start();
            install.WaitForExit();
        }

        // Start dev server if not already running
        if (!IsServerUp(url)) {
            var npm = new Process();
            npm.StartInfo.FileName = "cmd.exe";
            npm.StartInfo.Arguments = "/c cd /d \"" + appDir + "\" && npm run dev";
            npm.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            npm.StartInfo.CreateNoWindow = true;
            npm.StartInfo.UseShellExecute = false;
            npm.Start();

            for (int i = 0; i < 30; i++) {
                Thread.Sleep(1000);
                if (IsServerUp(url)) break;
            }
        }

        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }

    static bool IsServerUp(string url) {
        try {
            var req = (HttpWebRequest)WebRequest.Create(url);
            req.Timeout = 2000;
            req.AllowAutoRedirect = true;
            using (var resp = (HttpWebResponse)req.GetResponse()) {
                return true;
            }
        } catch {
            return false;
        }
    }
}
"@

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputPath = Join-Path $scriptDir "EasyKPI.exe"

Add-Type `
    -TypeDefinition $code `
    -OutputAssembly $outputPath `
    -OutputType WindowsApplication

Write-Host "Done! EasyKPI.exe created at $outputPath"
