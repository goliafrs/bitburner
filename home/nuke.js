/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, fileExists, nuke, hasRootAccess, getServerNumPortsRequired } = ns
  const [ target ] = args
  const portsRequired = getServerNumPortsRequired(target)
  const scripts = {
    brutessh: 'BruteSSH.exe',
    ftpcrack: 'FTPCrack.exe',
    relaysmtp: 'relaySMTP.exe',
    httpworm: 'HTTPWorm.exe',
    sqlinject: 'SQLInject.exe'
  }

  let ports = 0
  for (const key in scripts) {
    if (fileExists(scripts[key], 'home')) {
      ports++
      ns[key](target)
    }
  }

  if (!hasRootAccess(target) && ports >= portsRequired) {
    nuke(target)
  }
}
