const { BrowserWindow, app }  = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('../dist/index.html')
}

app.whenReady().then(createWindow)
