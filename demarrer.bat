@echo off
REM Lance le serveur (API) et le client (interface web) dans deux fenêtres séparées.
REM Double-cliquer sur ce fichier depuis l'explorateur Windows, ou l'exécuter depuis un terminal.

cd /d "%~dp0"

start "JDR - Serveur (API)" cmd /k "cd server && npm run dev"
start "JDR - Client (web)" cmd /k "cd client && npm run dev"

echo Serveur et client lances dans des fenetres separees.
echo Client accessible sur http://localhost:5173
