const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
const fs = require('fs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({webPreferences: {nodeIntegration: true}});

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/flappy.html`);
  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    /* setTimeout(function () {
      createWindow();
    }, 100); /**/
    
  });

  // const BrowserWindow = require('electron').remote.BrowserWindow
  const path = require('path');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*
var Webcast = function(options) {
    
  var lame = require('lame');
  var audio = require('osx-audio');
  var fs = require('fs');
  
  // create the Encoder instance
  var encoder = new lame.Encoder({
      // input
      channels: 1,        // 2 channels (left and right)
      bitDepth: 16,       // 16-bit samples
      sampleRate: 44100,  // 44,100 Hz sample rate
      
      // output
      bitRate: options.bitrate,
      outSampleRate: options.samplerate,
      mode: (options.mono ? lame.MONO : lame.STEREO) // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
  });
  
 set up an express app
  var express = require('express')
  var app = express()

  var input = new audio.Input();
  input.pipe(encoder);


  setInterval(function(){

      console.log("\nEncoder:")
      console.log(encoder._readableState.buffer.length);
  },1000);
  
  app.get('/stream.mp3', function (req, res) {
      res.set({
          'Content-Type': 'audio/mpeg3',
          'Transfer-Encoding': 'chunked'
      });        
      encoder.pipe(res);
  });
  app.get('/page.html', function (req, res) {
      data = fs.readFileSync("page.html").toString();

      res.end(data)
  });
  
  var server = app.listen(options.port);
}

w = Webcast({bitrate: 96000, samplerate: 44100, port: 3000, mono: true})
*/