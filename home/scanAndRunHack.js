const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall, scan, scp, run, exec, print, disableLog, getHackingLevel, getServerMaxRam, getServerUsedRam, getScriptRam, getServerRequiredHackingLevel } = ns

  disableLog('ALL')

  const hackingLevel = getHackingLevel()
  const targets = scan()

  for (const target of targets.filter(t => !~t.indexOf('arzamas'))) {
    killall(target)
    print(`Killed all scripts on ${target}`)

    await scp('hack.js', target)
    await scp('scanAndRunHack.js', target)
    print(`Copied scripts to ${target}`)

    const serverMaxRam = getServerMaxRam(target)
    const serverUsedRam = getServerUsedRam(target)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = getScriptRam(scriptName)

    let threads = Math.floor(serverRam / scriptRam)
    if (threads < 1) {
      threads = 1
    }

    run('nuke.js', 1, target)
    print(`Started nuke on ${target}`)

    if (hackingLevel < getServerRequiredHackingLevel(target)) {
      print(`Skipping ${target} because we don't have the hacking level`)
      continue
    }

    print(`Starting ${threads} threads of ${scriptName} on ${target}`)
    exec(scriptName, target, threads, target)
  }
}
