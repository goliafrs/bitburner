import { targets } from './variables'

const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall, scp, exec, getPurchasedServers, getServerMaxRam, getServerUsedRam, getScriptRam } = ns

  const servers = getPurchasedServers()

  for (const server of servers) {
    killall(server)

    const serverMaxRam = getServerMaxRam(server)
    const serverUsedRam = getServerUsedRam(server)
    const serverRam = serverMaxRam - serverUsedRam
    const scriptRam = getScriptRam(scriptName)

    let threads = Math.floor(serverRam / scriptRam / targets.length)
    if (threads < 1) {
      threads = 1
    }

    await scp(scriptName, server)

    for (const target of targets) {
      exec(scriptName, server, threads, target, threads)
    }
  }
}
