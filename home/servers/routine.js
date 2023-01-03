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
    print(`Scanning ${target}`)
    const targets = ns.scan(target)
    print(`Found targets: ${targets}`)
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

  print(`Scanned targets: ${scannedTargets.map(({ server }) => server)}`)

  const filteredTargets = scannedTargets.filter(({ server }) => ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel())
  print(`Filtered targets: ${filteredTargets.map(({ server }) => server)}`)

  const targets = filteredTargets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel).map(({ server }) => server)
  print(`Targets: ${targets}`)

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
    print(`Target: ${target}`)

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

      print(`Copying ${scriptName} to ${server}`)
      await ns.scp(scriptName, server)

      print(`Running ${scriptName} on ${server} (RAM: ${serverRam}) with ${threads} threads`)
      ns.exec(scriptName, server, threads, target, threads)
    } else {
      print(`Script ${scriptName} is already running on ${server}`)
    }
  }

  print('Done')
}
