/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, exec, scan, sleep, print, scp, killall, disableLog, scriptRunning, hasRootAccess, getHackingLevel, getServerRequiredHackingLevel, getServerMaxRam, getServerUsedRam, getScriptRam, getPurchasedServers, getServerMaxMoney } = ns

  disableLog('ALL')

  const targets = []
  const infiniteLoop = true
  const excludeServers = [ 'home', ...getPurchasedServers() ]
  const scriptHack = 'hack.js'
  const hacknetScripts = [ '/hacknet/purchaseNode.js', '/hacknet/upgradeNode.js' ]
  const serversScripts = [ '/servers/purchaseServers.js', '/servers/upgradeServers.js', '/servers/routine.js' ]

  const recursiveScan = target => {
    for (const server of scan(target)) {
      if (!targets.includes(server) && !excludeServers.includes(server)) {
        targets.push(server)
        recursiveScan(server)
      }
    }
  }
  const getThreads = target => {
    const serverMaxRam = getServerMaxRam(target)
    const serverUsedRam = getServerUsedRam(target)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = getScriptRam(scriptHack)

    let threads = Math.floor(serverRam / scriptRam)
    if (threads < 1) {
      threads = 1
    }

    return threads
  }

  recursiveScan('home')

  const timestamp = () => {
    const date = new Date()
    const timeParts = [ date.getHours(), date.getMinutes(), date.getSeconds() ].map(part => part.toString().padStart(2, '0'))

    return `[${timeParts.join(':')}]`
  }

  while (infiniteLoop) {
    const hackingLevel = getHackingLevel()
    print(`${timestamp()} Hacking level: ${hackingLevel}`)

    for (const script of hacknetScripts) {
      if (!scriptRunning(script, 'home')) {
        print(`${timestamp()} Running ${script} on home with 1 thread`)
        run(script, 1)
      }
    }

    for (const script of serversScripts) {
      if (!scriptRunning(script, 'home')) {
        print(`${timestamp()} Running ${script} on home with 1 thread`)
        run(script, 1)
      }
    }

    for (const target of targets.filter(server => getServerRequiredHackingLevel(server) <= hackingLevel)) {
      if (!hasRootAccess(target)) {
        print(`${timestamp()} Running nuke.js on ${target} with 1 thread`)
        run('nuke.js', 1, target)
      }

      if (getServerMaxMoney(target) > 0) {
        if (!scriptRunning(scriptHack, target)) {
          const threads = getThreads(target)
          print(`${timestamp()} Running ${scriptHack} on ${target} with ${threads} threads`)
          await scp(scriptHack, target)
          exec(scriptHack, target, threads, target, threads)
        }
      } else {
        killall(target)
      }
    }

    await sleep(1 * 60 * 1000)
  }
}
