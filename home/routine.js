/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, exec, scan, sleep, print, scp, disableLog, scriptRunning, hasRootAccess, getServerMaxMoney, getHackingLevel, getServerRequiredHackingLevel, getServerMaxRam, getServerUsedRam, getScriptRam } = ns

  disableLog('ALL')

  const targets = []
  const scriptName = 'hack.js'
  const hacknetScripts = [ '/hacknet/purchaseNode.js', '/hacknet/upgradeNode.js' ]
  const serversScripts = [ '/servers/purchaseServers.js', '/servers/runHackOnServers.js' ]

  const recursiveScan = target => {
    const servers = scan(target)

    for (const server of servers) {
      const maxMoney = getServerMaxMoney(server)

      if (!targets.includes(server) && maxMoney > 0) {
        targets.push(server)
        recursiveScan(server)
      }
    }
  }
  const getThreads = target => {
    const serverMaxRam = getServerMaxRam(target)
    const serverUsedRam = getServerUsedRam(target)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = getScriptRam(scriptName)

    let threads = Math.floor(serverRam / scriptRam)
    if (threads < 1) {
      threads = 1
    }

    return threads
  }

  recursiveScan('home')

  while (true) {
    const hackingLevel = getHackingLevel()

    for (const script of hacknetScripts) {
      if (!scriptRunning(script, 'home')) {
        print(`Running ${script} on home with 1 thread`)
        run(script, 1, 'home')
      }
    }

    for (const script of serversScripts) {
      if (!scriptRunning(script, 'home')) {
        print(`Running ${script} on home with 1 thread`)
        run(script, 1, 'home')
      }
    }

    for (const target of targets.filter(target => getServerRequiredHackingLevel(target) <= hackingLevel)) {
      if (!scriptRunning(scriptName, target)) {
        const threads = getThreads(target)

        if (!hasRootAccess(target)) {
          print(`Running nuke.js on ${target} with 1 thread`)
          run('nuke.js', 1, target)
        }

        print(`Running ${scriptName} on ${target} with ${threads} threads`)
        await scp(scriptName, target)
        exec(scriptName, target, threads, target, threads)
      }
    }

    await sleep(15 * 60 * 1000)
  }
}
