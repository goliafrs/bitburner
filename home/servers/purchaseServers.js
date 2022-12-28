/**
* @param {NS} ns
**/
export async function main(ns) {
  const {
    sleep,
    print,
    killall,
    disableLog,
    deleteServer,
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
  const ramLastServer = getServerMaxRam(servers[servers.length - 1])
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

  if (ramLastServer && ramLastServer < ram) {
    for (const server of servers) {
      const serverRam = getServerMaxRam(server)
      if (serverRam < ram) {
        print(`Destroying server ${server}`)
        killall(server)
        deleteServer(server)
      }
    }
  }

  while (serverCount() < serverLimit) {
    print(`Purchased servers: ${serverCount()}/${serverLimit}`)
    const serverCost = getPurchasedServerCost(ram)
    if (money() < serverCost) {
      print(`Not enough money: ${money()}/${serverCost}`)
      await sleep(1 * 60 * 1000)
      continue
    }

    for (let index = serverCount(); index < serverLimit; ++index) {
      purchaseServer(serverPrefix, ram)
    }
  }

  print('Done')
}
