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
            install.StartInfo.Arguments = "/c cd /d \"" + appDir + "\" && npm install --legacy-peer-deps";
            install.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
            install.StartInfo.UseShellExecute = false;
            install.Start();
            install.WaitForExit();
        }

        // Build the web bundle if dist is missing
        string dist = Path.Combine(appDir, "apps", "web", "dist");
        if (!Directory.Exists(dist)) {
            var build = new Process();
            build.StartInfo.FileName = "cmd.exe";
            build.StartInfo.Arguments = "/c cd /d \"" + appDir + "\" && npm run build --workspace=@easykpi/web";
            build.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
            build.StartInfo.UseShellExecute = false;
            build.Start();
            build.WaitForExit();
        }

        // Start the Fastify api (SQLite-backed) in the background
        string apiDb = Path.Combine(appDir, "apps", "api", "dev.db");
        if (!File.Exists(apiDb)) {
            var dbInit = new Process();
            dbInit.StartInfo.FileName = "cmd.exe";
            dbInit.StartInfo.Arguments = "/c cd /d \"" + appDir + "\\apps\\api\" && set DATABASE_URL=file:./dev.db && npx prisma db push --skip-generate";
            dbInit.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            dbInit.StartInfo.CreateNoWindow = true;
            dbInit.StartInfo.UseShellExecute = false;
            dbInit.Start();
            dbInit.WaitForExit();
        }

        var api = new Process();
        api.StartInfo.FileName = "cmd.exe";
        api.StartInfo.Arguments = "/c cd /d \"" + appDir + "\" && set DATABASE_URL=file:./apps/api/dev.db && set PORT=8787 && npm run dev --workspace=@easykpi/api";
        api.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
        api.StartInfo.CreateNoWindow = true;
        api.StartInfo.UseShellExecute = false;
        api.Start();

        // Serve the built web bundle with `vite preview` (no dev server, no HMR, PWA-friendly)
        if (!IsServerUp(url)) {
            var web = new Process();
            web.StartInfo.FileName = "cmd.exe";
            web.StartInfo.Arguments = "/c cd /d \"" + appDir + "\" && npm run preview --workspace=@easykpi/web";
            web.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            web.StartInfo.CreateNoWindow = true;
            web.StartInfo.UseShellExecute = false;
            web.Start();

            for (int i = 0; i < 40; i++) {
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
Write-Host "Launch sequence: install -> build -> db push -> start api -> vite preview -> open browser"
