const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall, scp, exec, scan, print, disableLog, hasRootAccess, scriptRunning, getPurchasedServers, getServerMaxRam, getServerUsedRam, getScriptRam, getServerMaxMoney, getServerRequiredHackingLevel } = ns

  disableLog('ALL')

  const servers = getPurchasedServers()
  const excludeServers = [ 'home', ...servers ]
  const scannedTargets = []
  const recursiveScan = target => {
    for (const server of scan(target)) {
      if (excludeServers.includes(server)) {
        continue
      }

      const requiredHackingLevel = getServerRequiredHackingLevel(server)
      const index = scannedTargets.findIndex(({ server }) => server === target)

      if (!~index) {
        scannedTargets.push({
          server,
          requiredHackingLevel
        })
        recursiveScan(server)
      }
    }
  }
  recursiveScan('home')

  const filteredTargets = scannedTargets.filter(({ server }) => getServerMaxMoney(server) > 0)
  const targets = filteredTargets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel).map(({ server }) => server)

  for (let index = 0; index < targets.length; index++) {
    const server = servers[index]
    const target = targets[index] || targets[targets.length - 1]

    if (!server) {
      print('No more servers to hack')
      break
    }

    if (!scriptRunning(scriptName, server)) {
      killall(server)

      const serverMaxRam = getServerMaxRam(server)
      const serverUsedRam = getServerUsedRam(server)
      const serverRam = serverMaxRam - serverUsedRam
      const scriptRam = getScriptRam(scriptName)

      let threads = Math.floor(serverRam / scriptRam)
      if (threads < 1) {
        threads = 1
      }

      print(`Copying ${scriptName} to ${server}`)
      await scp(scriptName, server)

      if (target && hasRootAccess(target)) {
        print(`Running ${scriptName} on ${server} (RAM: ${serverRam}) with ${threads} threads`)
        exec(scriptName, server, threads, target, threads)
      }
    } else {
      print(`Script ${scriptName} is already running on ${server}`)
    }
  }

  print('Done')
}
