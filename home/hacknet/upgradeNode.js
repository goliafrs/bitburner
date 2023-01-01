const maxLevel = 200
const maxRam = 64
const maxCores = 16
const timeout = 10

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { hacknet, disableLog, sleep, print } = ns
  const { numNodes, getNodeStats, upgradeLevel, upgradeRam, upgradeCore } = hacknet

  disableLog('ALL')

  for (let index = 0; index < numNodes(); index++) {
    const level = () => getNodeStats(index).level

    while (level() < maxLevel) {
      upgradeLevel(index)
      print(`Upgrading level of node ${index} to ${level()}`)
      await sleep(timeout)
    }
  }

  for (let index = 0; index < numNodes(); index++) {
    const ram = () => getNodeStats(index).ram

    while (ram() < maxRam) {
      upgradeRam(index)
      print(`Upgrading ram of node ${index} to ${ram()}`)
      await sleep(timeout)
    }
  }

  for (let index = 0; index < numNodes(); index++) {
    const cores = () => getNodeStats(index).cores

    while (cores() < maxCores) {
      upgradeCore(index)
      print(`Upgrading cores of node ${index} to ${cores()}`)
      await sleep(timeout)
    }
  }

  print('Done')
}
