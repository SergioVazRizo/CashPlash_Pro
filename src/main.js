const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { connectToDatabase } = require('./backend/db-connection');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'backend/preload.js')
    }
  })

  win.loadFile('src/frontend/index.html')
}

app.whenReady().then(async () => {
  try {
    db = await connectToDatabase()
    console.log('connect to database')

    createWindow();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

