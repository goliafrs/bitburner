/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  const money = () => ns.getServerMoneyAvailable('home').toFixed(2)
  const serverCount = () => ns.getPurchasedServers().length

  const serverPrefix = 'arzamas'
  const serverLimit = ns.getPurchasedServerLimit()
  const servers = ns.getPurchasedServers()
  const ramLastServer = serverCount() > 0 ? ns.getServerMaxRam(servers[servers.length - 1]) : 0
  const ram = ramLastServer || 16

  while (serverCount() < serverLimit) {
    print(`Purchased servers: ${serverCount()}/${serverLimit}`)
    const serverCost = ns.getPurchasedServerCost(ram)
    if (money() < serverCost) {
      print(`Not enough money: ${money()}/${serverCost}`)
      await ns.sleep(1 * 60 * 1000)
      continue
    }

    for (let index = serverCount(); index < serverLimit; ++index) {
      const server = ns.purchaseServer(serverPrefix, ram)
      print(`Purchased server ${server} with ${ram}GB RAM`)
    }
  }

  if (serverCount() === serverLimit) {
    print(`Server limit reached: ${serverCount()}/${serverLimit}`)
  }

  print('Done')
}
