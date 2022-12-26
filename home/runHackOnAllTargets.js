import { targets } from 'variables'

const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall, scp, run, exec, getHackingLevel, getServerMaxRam, getServerUsedRam, getScriptRam, getServerRequiredHackingLevel } = ns

  const hackingLevel = getHackingLevel()

  for (const target of targets) {
    killall(target)
    await scp(scriptName, target)

    const serverMaxRam = getServerMaxRam(target)
    const serverUsedRam = getServerUsedRam(target)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = getScriptRam(scriptName)

    let threads = Math.floor(serverRam / scriptRam)
    if (threads < 1) {
      threads = 1
    }

    run('nuke.js', 1, target)

    if (hackingLevel < getServerRequiredHackingLevel(target)) {
      continue
    }

    exec(scriptName, target, threads, target, threads)
  }
}
