/**
* @param {NS} ns
**/
export async function main(ns) {
  const [ target ] = ns.args
  const portsRequired = ns.getServerNumPortsRequired(target)
  const scripts = [ 'BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe' ]

  let ports = 0
  for (const script of scripts) {
    if (ns.fileExists(script, 'home')) {
      ports++

      // This switch because dynamic RAM usage calculated to be greater than initial RAM usage.
      // This is probably because you somehow circumvented the static RAM calculation.
      switch (script) {
        case 'BruteSSH.exe':
          ns.brutessh(target)
          break
        case 'FTPCrack.exe':
          ns.ftpcrack(target)
          break
        case 'relaySMTP.exe':
          ns.relaysmtp(target)
          break
        case 'HTTPWorm.exe':
          ns.httpworm(target)
          break
        case 'SQLInject.exe':
          ns.sqlinject(target)
          break
      }
    }
  }

  if (!ns.hasRootAccess(target) && ports >= portsRequired) {
    ns.nuke(target)
  }
}
