const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const {
    scp,
    exec,
    scan,
    print,
    killall,
    disableLog,
    hasRootAccess,
    scriptRunning,
    getScriptRam,
    getServerMaxRam,
    getServerUsedRam,
    getServerMaxMoney,
    getServerRequiredHackingLevel,
    getPurchasedServers
  } = ns

  disableLog('ALL')

  const servers = getPurchasedServers()
  const excludeServers = [ 'home', ...servers ]
  const scannedTargets = []
  const recursiveScan = target => {
    print(`Scanning ${target}`)
    const targets = scan(target)
    print(`Found targets: ${targets}`)
    for (const server of targets.filter(server => server !== target)) {
      if (excludeServers.includes(server)) {
        continue
      }

      const requiredHackingLevel = getServerRequiredHackingLevel(server)
      const index = scannedTargets.findIndex(scannedTarget => scannedTarget.server === server)
      print(`Index: ${index} for ${server} (required hacking level: ${requiredHackingLevel})`)

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
  for (const target of scannedTargets) {
    recursiveScan(target.server)
  }

  print(`Scanned targets: ${scannedTargets.map(({ server }) => server)}`)

  const filteredTargets = scannedTargets.filter(({ server }) => getServerMaxMoney(server) > 0)

  print(`Filtered targets: ${filteredTargets.map(({ server }) => server)}`)

  const targets = filteredTargets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel).map(({ server }) => server)

  print(`Targets: ${targets}`)

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
