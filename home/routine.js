/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  const targets = []
  const infiniteLoop = true
  const excludeServers = [ 'home', ...ns.getPurchasedServers() ]
  const scriptHack = 'hack.js'
  const hacknetScripts = [ '/hacknet/purchaseNode.js', '/hacknet/upgradeNode.js' ]
  const serversScripts = [ '/servers/purchaseServers.js', '/servers/upgradeServers.js', '/servers/routine.js' ]

  const recursiveScan = target => {
    for (const server of ns.scan(target)) {
      if (!targets.includes(server) && !excludeServers.includes(server)) {
        targets.push(server)
        recursiveScan(server)
      }
    }
  }
  const getThreads = target => {
    const serverMaxRam = ns.getServerMaxRam(target)
    const serverUsedRam = ns.getServerUsedRam(target)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = ns.getScriptRam(scriptHack)

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
    const hackingLevel = ns.getHackingLevel()
    ns.print(`${timestamp()} Hacking level: ${hackingLevel}`)

    for (const script of hacknetScripts) {
      if (!ns.scriptRunning(script, 'home')) {
        ns.print(`${timestamp()} Running ${script} on home with 1 thread`)
        ns.run(script, 1)
      }
    }

    for (const script of serversScripts) {
      if (!ns.scriptRunning(script, 'home')) {
        ns.print(`${timestamp()} Running ${script} on home with 1 thread`)
        ns.run(script, 1)
      }
    }

    for (const target of targets.filter(server => ns.getServerRequiredHackingLevel(server) <= hackingLevel)) {
      if (!ns.hasRootAccess(target)) {
        ns.print(`${timestamp()} Running nuke.js on ${target} with 1 thread`)
        ns.run('nuke.js', 1, target)
      }

      if (ns.getServerMaxMoney(target) > 0) {
        if (!ns.scriptRunning(scriptHack, target)) {
          const threads = getThreads(target)
          ns.print(`${timestamp()} Running ${scriptHack} on ${target} with ${threads} threads`)
          await ns.scp(scriptHack, target)
          ns.exec(scriptHack, target, threads, target, threads)
        }
      } else {
        ns.killall(target)
      }
    }

    await ns.sleep(1 * 60 * 1000)
  }
}
