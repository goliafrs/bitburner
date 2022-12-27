const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall, scp, exec, scan, scriptRunning, getPurchasedServers, getServerMaxRam, getServerUsedRam, getScriptRam, getServerMaxMoney, getServerRequiredHackingLevel } = ns

  const foundTargets = []

  const recursiveScan = target => {
    const servers = scan(target)

    for (const server of servers) {
      const maxMoney = getServerMaxMoney(server)
      const requiredHackingLevel = getServerRequiredHackingLevel(server)
      const index = foundTargets.findIndex(target => target.server === server)

      if (!~index && maxMoney > 0) {
        foundTargets.push({
          server,
          requiredHackingLevel
        })
        recursiveScan(server)
      }
    }
  }
  recursiveScan('home')

  const targets = foundTargets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel).map(target => target.server)

  const servers = getPurchasedServers()

  for (let index = 0; index < servers.length; index++) {
    const server = servers[index]

    killall(server)

    const serverMaxRam = getServerMaxRam(server)
    const serverUsedRam = getServerUsedRam(server)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = getScriptRam(scriptName)

    let threads = Math.floor(serverRam / scriptRam)
    if (threads < 1) {
      threads = 1
    }

    await scp(scriptName, server)

    if (targets[index] && !scriptRunning(scriptName, targets[index])) {
      exec(scriptName, server, threads, targets[index], threads)
    }
  }
}
