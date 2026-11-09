Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
htmlPath = scriptDir & "\TransMac_App.html"
WshShell.Run "msedge --app=""file:///" & htmlPath & """ --new-window", 1, False
