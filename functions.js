/*
 * License: MIT
 * LukeAz => https://github.com/LukeAz
*/
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express');
const WebSocket = require('ws');
const os = require('node-os-utils')

module.exports = {
    initExpress: (PORT, HOST) => {  
        let app = express();
        app.listen(PORT, HOST, () => {
            console.log(`RaspStatApp listening at http://${HOST}:${PORT}`)
        });
        app.use(express.static('public'))
        app.set('view engine', 'ejs');
        return app;
    },
    initWebsocket: (PORT, HOST) => {
        return new WebSocket.Server({port: PORT, host: HOST});
    },
    readTemperature: () => {
        let temperature = Number(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', {encoding:'utf8', flag:'r'}));
        return (isNaN(temperature)) ? false : (temperature/1000).toFixed(1); 
    },
    getStaticInformation: async () => {
        return {
            sysInfo: await os.os.oos(),
            cpuModel: await os.cpu.model(),
            cpuThread: await os.cpu.count()
        }
    },
    getInformation: async (maxTemp, temp) => {
        let mem = await os.mem.info();
        let disk = await os.drive.free();
        let uptime = await os.os.uptime();
        return {
            maxTemperature: `${maxTemp}°C`, 
            freeMem: `${mem.freeMemMb} MB`,
            totMem: `${mem.totalMemMb} MB`,
            freeDisk: `${disk.freeGb} GB`,
            totDisk: `${disk.totalGb} GB`,
            uptime: `${Math.floor(uptime/(3600*24))} days, ${Math.floor(uptime % (3600*24) / 3600)} hours, ${Math.floor(uptime % 3600 / 60)} min, ${Math.floor(uptime % 60)} sec.`,
            numProcess: await os.proc.totalProcesses(),
            tempnow: {
                value: temp, 
                symbol: "°C",
                limit: 120,
                text: "TEMP"
            },
            cpu: {
                value: Math.round(await os.cpu.usage()),
                symbol: "%",
                limit: 100,
                text: "CPU"
            },
            ram: {
                value: Math.round(100-mem.freeMemPercentage),
                symbol: "%",
                limit: 100,
                text: "RAM"
            },
            disk : {
                value: Math.round(100-disk.freePercentage),
                symbol: "%",
                limit: 100,
                text: "DISK"
            }
        }
    }
}
