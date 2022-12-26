/**
* @param {NS} ns
**/
export async function main(ns) {
  const { sleep, print, disableLog, getPurchasedServers, getPurchasedServerLimit, getPurchasedServerCost, getServerMoneyAvailable, purchaseServer } = ns

  disableLog('ALL')

  const ram = 32
  const serverPrefix = 'arzamas'
  const serverLimit = getPurchasedServerLimit()
  const serverCost = getPurchasedServerCost(ram)

  const serverCount = () => getPurchasedServers().length

  while (serverCount() < serverLimit) {
    print(`Purchased servers: ${serverCount()}/${serverLimit}`)
    const money = () => getServerMoneyAvailable('home')
    if (money() < serverCost) {
      print(`Not enough money: ${money()}/${serverCost}`)
      await sleep(1000)
      continue
    }

    for (let index = serverCount(); index < serverLimit; ++index) {
      purchaseServer(serverPrefix, ram)
    }
  }

  print('Done')
}
