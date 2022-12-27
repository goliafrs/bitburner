/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, fileExists, nuke, brutessh, ftpcrack, relaysmtp, httpworm, sqlinject, hasRootAccess, getServerNumPortsRequired } = ns
  const [ target ] = args
  const portsRequired = getServerNumPortsRequired(target)
  const scripts = [ 'BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe' ]

  let ports = 0
  for (const script of scripts) {
    if (fileExists(script, 'home')) {
      ports++

      // This switch because dynamic RAM usage calculated to be greater than initial RAM usage.
      // This is probably because you somehow circumvented the static RAM calculation.
      switch (script) {
        case 'BruteSSH.exe':
          brutessh(target)
          break
        case 'FTPCrack.exe':
          ftpcrack(target)
          break
        case 'relaySMTP.exe':
          relaysmtp(target)
          break
        case 'HTTPWorm.exe':
          httpworm(target)
          break
        case 'SQLInject.exe':
          sqlinject(target)
          break
      }
    }
  }

  if (!hasRootAccess(target) && ports >= portsRequired) {
    nuke(target)
  }
}
