# Set concolse encoding
if([console]::InputEncoding.CodePage -ne 65001) {[console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding}

# Run from framework repo directory
node_modules\.bin\jsdoc2md --partial docs\header.hbs --heading-depth 1 --private docs\externals.js --template docs\README.hbs src\system.js src\loader.js src\error.js src\systemEvents.js src\behavior.js src\atomic.js > README.md