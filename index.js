/*
 * License: MIT
 * LukeAz => https://github.com/LukeAz
*/
let config = require('./config.json');
const EXPRESS_PORT = config.EXPRESS_PORT || 3000;
const WS_PORT = config.WS_PORT || 8280;
const HOST = config.HOST || '127.0.0.1';
const MAX_TEMP = config.MAX_TEMP || 50;

const functions = require('./functions');
const app = functions.initExpress(EXPRESS_PORT, HOST);
const wss = functions.initWebsocket(WS_PORT, HOST);

let maxTemp = 0;

//WEBSOCKET Server
wss.on('connection', (ws) => {
    ws.on('message', async () => {
      ws.isAlive = true;
      let temp = await functions.execute('/opt/vc/bin/vcgencmd measure_temp');
      temp = functions.parseTemp(temp);
      maxTemp = (temp>maxTemp) ? temp : maxTemp;
      let data = await functions.getInformation(maxTemp, temp);
      ws.send(JSON.stringify(data));
    });
});

//Detect and close broken websocket connections every 2 minutes
let intervalWebSocket = setInterval(()=> {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
    });
  }, 120000);

//EXPRESS
app.get('/', async (req, res) => {
    let data = await functions.getStaticInformation();
    res.render('interface', {ws: `ws://${HOST}:${WS_PORT}`, maxTemp: MAX_TEMP, sysInfo: data.sysInfo, cpuModel: data.cpuModel, cpuThread: data.cpuThread});
})

process.on('SIGHUP', () => {
    clearInterval(intervalWebSocket);
    process.exit();
});
