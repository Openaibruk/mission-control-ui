const { execSync } = require('child_process');
const os = require('os');

console.log("=== OpenClaw System Self-Audit ===\n");

let isCritical = false;
let criticalAlerts = [];

// 1. Memory
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMemPercent = ((totalMem - freeMem) / totalMem) * 100;
console.log(`Memory Usage: ${usedMemPercent.toFixed(1)}% (${(freeMem/1024/1024/1024).toFixed(2)} GB free)`);
if (usedMemPercent > 90) {
    isCritical = true;
    criticalAlerts.push(`High memory usage: ${usedMemPercent.toFixed(1)}%`);
}

// 2. Disk Space
try {
    const diskPercentStr = execSync("df -h / | awk 'NR==2 {print $5}'").toString().trim().replace('%', '');
    const diskPercent = parseInt(diskPercentStr, 10);
    const diskFree = execSync("df -h / | awk 'NR==2 {print $4}'").toString().trim();
    console.log(`Disk Usage (/): ${diskPercent}% (${diskFree} free)`);
    if (diskPercent > 90) {
        isCritical = true;
        criticalAlerts.push(`High disk usage: ${diskPercent}%`);
    }
} catch (e) {
    console.log("Disk Usage: Could not determine");
}

// 3. CPU Load
const load = os.loadavg();
console.log(`CPU Load Average (1m, 5m, 15m): ${load[0].toFixed(2)}, ${load[1].toFixed(2)}, ${load[2].toFixed(2)}`);

// 4. Gateway Service Status
try {
    const gwStatus = execSync("systemctl --user is-active openclaw-gateway").toString().trim();
    console.log(`Gateway Status: ${gwStatus.toUpperCase()}`);
} catch (e) {
    console.log("Gateway Status: INACTIVE/ERROR");
    isCritical = true;
    criticalAlerts.push("OpenClaw gateway service is down or failing");
}

console.log("\n=== Final Assessment ===");
if (isCritical) {
    console.log("STATUS: CRITICAL");
    console.log("ALERTS: " + criticalAlerts.join(", "));
} else {
    console.log("STATUS: HEALTHY");
    console.log("All monitored systems are operating normally.");
}