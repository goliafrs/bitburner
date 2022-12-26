/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, fileExists, nuke, brutessh, ftpcrack, relaysmtp, httpworm, sqlinject, hasRootAccess } = ns
  const [ target ] = args

  if (fileExists('BruteSSH.exe', 'home')) {
    brutessh(target)
  }

  if (fileExists('FTPCrack.exe', 'home')) {
    ftpcrack(target)
  }

  if (fileExists('relaySMTP.exe', 'home')) {
    relaysmtp(target)
  }

  if (fileExists('HTTPWorm.exe', 'home')) {
    httpworm(target)
  }

  if (fileExists('SQLInject.exe', 'home')) {
    sqlinject(target)
  }

  if (hasRootAccess(target) == false) {
    nuke(target)
  }
}
