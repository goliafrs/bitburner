/**
* @param {NS} ns
**/
export async function main(ns) {
  const {
    sleep,
    print,
    disableLog,
    purchaseServer,
    getPurchasedServers,
    getPurchasedServerLimit,
    getPurchasedServerCost,
    getPurchasedServerMaxRam,
    getServerMoneyAvailable,
    getServerMaxRam
  } = ns

  disableLog('ALL')

  const money = () => getServerMoneyAvailable('home').toFixed(2)
  const serverCount = () => getPurchasedServers().length

  const serverPrefix = 'arzamas'
  const serverLimit = getPurchasedServerLimit()
  const servers = getPurchasedServers()
  const ramLastServer = serverCount() > 0 ? getServerMaxRam(servers[servers.length - 1]) : 0
  const ram = ramLastServer || 16

  while (serverCount() < serverLimit) {
    print(`Purchased servers: ${serverCount()}/${serverLimit}`)
    const serverCost = getPurchasedServerCost(ram)
    if (money() < serverCost) {
      print(`Not enough money: ${money()}/${serverCost}`)
      await sleep(1 * 60 * 1000)
      continue
    }

    for (let index = serverCount(); index < serverLimit; ++index) {
      const server = purchaseServer(serverPrefix, ram)
      print(`Purchased server ${server} with ${ram}GB RAM`)
    }
  }

  if (serverCount() === serverLimit) {
    print(`Server limit reached: ${serverCount()}/${serverLimit}`)
  }

  print('Done')
}
