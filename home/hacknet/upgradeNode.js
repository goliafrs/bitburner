const maxLevel = 200
const maxRam = 64
const maxCores = 16
const timeout = 10

/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  for (let index = 0; index < ns.hacknet.numNodes(); index++) {
    const level = () => ns.hacknet.getNodeStats(index).level

    while (level() < maxLevel) {
      ns.hacknet.upgradeLevel(index)
      print(`Upgrading level of node ${index} to ${level()}`)
      await ns.sleep(timeout)
    }
  }

  for (let index = 0; index < ns.hacknet.numNodes(); index++) {
    const ram = () => ns.hacknet.getNodeStats(index).ram

    while (ram() < maxRam) {
      ns.hacknet.upgradeRam(index)
      print(`Upgrading ram of node ${index} to ${ram()}`)
      await ns.sleep(timeout)
    }
  }

  for (let index = 0; index < ns.hacknet.numNodes(); index++) {
    const cores = () => ns.hacknet.getNodeStats(index).cores

    while (cores() < maxCores) {
      ns.hacknet.upgradeCore(index)
      print(`Upgrading cores of node ${index} to ${cores()}`)
      await ns.sleep(timeout)
    }
  }

  print('Done')
}
