/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, exec, killall, scan, sleep, print, disableLog, hasRootAccess, getServerMaxMoney, getHackingLevel, getServerRequiredHackingLevel, getServerMaxRam, getServerUsedRam, getScriptRam } = ns

  disableLog('ALL')

  while (true) {
    const targets = []
    const scriptName = 'hack.js'
    const hackingLevel = getHackingLevel()

    const recursiveScan = target => {
      const servers = scan(target)

      for (const server of servers) {
        const requiredHackingLevel = getServerRequiredHackingLevel(server)
        const maxMoney = getServerMaxMoney(server)

        if (!targets.includes(server) && requiredHackingLevel <= hackingLevel && maxMoney > 0) {
          targets.push(server)
          recursiveScan(server)
        }
      }
    }
    recursiveScan('home')

    for (const target of targets) {
      killall(target)
      print(`Killing ${scriptName} on ${target}`)

      const serverMaxRam = getServerMaxRam(target)
      const serverUsedRam = getServerUsedRam(target)
      const serverRam = serverMaxRam - serverUsedRam
      const scriptRam = getScriptRam(scriptName)

      let threads = Math.floor(serverRam / scriptRam)
      if (threads < 1) {
        threads = 1
      }

      if (!hasRootAccess(target)) {
        print(`Running nuke.js on ${target} with 1 thread`)
        run('nuke.js', 1, target)
      }

      print(`Running ${scriptName} on ${target} with ${threads} threads`)
      exec(scriptName, target, threads, target, threads)
    }

    await sleep(15 * 60 * 1000)
  }
}
