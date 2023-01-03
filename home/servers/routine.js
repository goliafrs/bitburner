const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  const servers = ns.getPurchasedServers()
  const excludeServers = [ 'home', ...servers ]
  const scannedTargets = []
  const recursiveScan = target => {
    ns.print(`Scanning ${target}`)
    const targets = ns.scan(target)
    ns.print(`Found targets: ${targets}`)
    for (const server of targets.filter(server => server !== target)) {
      if (excludeServers.includes(server)) {
        continue
      }

      const requiredHackingLevel = ns.getServerRequiredHackingLevel(server)
      const index = scannedTargets.findIndex(scannedTarget => scannedTarget.server === server)
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

  ns.print(`Scanned targets: ${scannedTargets.map(({ server }) => server)}`)

  const filteredTargets = scannedTargets.filter(({ server }) => ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel())
  ns.print(`Filtered targets: ${filteredTargets.map(({ server }) => server)}`)

  const targets = filteredTargets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel).map(({ server }) => server)
  ns.print(`Targets: ${targets}`)

  const getMostExpensiveTarget = () => {
    let mostExpensiveTarget = null
    let mostExpensiveTargetMoney = 0
    for (const target of targets) {
      const targetMoney = ns.getServerMaxMoney(target)
      if (targetMoney > mostExpensiveTargetMoney && ns.hasRootAccess(target)) {
        mostExpensiveTarget = target
        mostExpensiveTargetMoney = targetMoney
      }
    }

    return mostExpensiveTarget
  }

  for (const server of servers) {
    const target = getMostExpensiveTarget()
    ns.print(`Target: ${target}`)

    if (!ns.scriptRunning(scriptName, server)) {
      ns.killall(server)

      const serverMaxRam = ns.getServerMaxRam(server)
      const serverUsedRam = ns.getServerUsedRam(server)
      const serverRam = serverMaxRam - serverUsedRam
      const scriptRam = ns.getScriptRam(scriptName)

      let threads = Math.floor(serverRam / scriptRam)
      if (threads < 1) {
        threads = 1
      }

      ns.print(`Copying ${scriptName} to ${server}`)
      await ns.scp(scriptName, server)

      ns.print(`Running ${scriptName} on ${server} (RAM: ${serverRam}) with ${threads} threads`)
      ns.exec(scriptName, server, threads, target, threads)
    } else {
      ns.print(`Script ${scriptName} is already running on ${server}`)
    }
  }

  ns.print('Done')
}
