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
  const maxRam = getPurchasedServerMaxRam()

  let ram = ramLastServer || 16
  let flag = true
  while (flag) {
    if (money() < getPurchasedServerCost(ram)) {
      flag = false
      break
    }
    if (ram < maxRam) {
      ram = ram * 2
    } else {
      flag = false
      break
    }
  }

  print(`Current RAM limit is ${ramLastServer}GB`)
  print(`New RAM limit is ${ram}GB`)

  while (serverCount() < serverLimit) {
    print(`Purchased servers: ${serverCount()}/${serverLimit}`)
    const serverCost = getPurchasedServerCost(ram)
    if (money() < serverCost) {
      print(`Not enough money: ${money()}/${serverCost}`)
      await sleep(1000)
      continue
    }

    for (let index = serverCount(); index < serverLimit; ++index) {
      purchaseServer(serverPrefix, ram)
    }
  }

  if (serverCount() === serverLimit) {
    print(`Server limit reached: ${serverCount()}/${serverLimit}`)
  }

  print('Done')
}
