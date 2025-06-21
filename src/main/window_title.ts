import { execSync } from "child_process";

const psScript = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();

  [DllImport("user32.dll", SetLastError=true)]
  public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
}
"@
$hwnd = [Win32]::GetForegroundWindow()
$title = New-Object System.Text.StringBuilder 256
[Win32]::GetWindowText($hwnd, $title, $title.Capacity)
$title.ToString()
`;

export function getForemostWindowTitle() {
  try {
    if (process.platform !== "darwin") {
      return execSync(
        `powershell -Command "${psScript.replace(/\n/g, ";")}"`,
        {
          encoding: "utf8",
          stdio: ["pipe", "pipe", "ignore"],
        },
      ).trim();
    }

    // return execSync(
    //   `osascript -e 'tell application "System Events" to get title of first window of (first process whose frontmost is true)'`,
    //   {
    //     encoding: "utf8",
    //     stdio: ["pipe", "pipe", "ignore"],
    //   },
    // ).toString().trim();

    const script = `
        try
          tell application "System Events"
            set frontApp to name of first application process whose frontmost is true
          end tell

          tell application frontApp
            if (count of windows) > 0 then
              get name of front window
            else
              return "No window"
            end if
          end tell
        on error errMsg
          return "Error: " & errMsg
        end try
      `.replace(/"/g, '\\"').replace(/\n/g, " ");

    const cmd = `osascript -e "${script}"`;
    const result = execSync(cmd, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    return result.trim();
  } catch {
    return "";
  }
}
