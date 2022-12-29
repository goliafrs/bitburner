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
  const infiniteLoop = true

  while (infiniteLoop) {
    const serverPrefix = 'arzamas'
    const serverLimit = getPurchasedServerLimit()
    const servers = getPurchasedServers()
    const ramLastServer = serverCount() > 0 ? getServerMaxRam(servers[servers.length - 1]) : 0
    const maxRam = getPurchasedServerMaxRam()

    let ram = ramLastServer || 16
    let flag = true
    while (flag) {
      if (money() < getPurchasedServerCost(ram) * serverLimit) {
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

    print(`Current money is ${money()}$`)
    print(`Current server count is ${serverCount()}`)
    print(`Current server limit is ${serverLimit}`)
    print(`Current max RAM is ${maxRam}GB`)
    print(`Current RAM limit is ${ramLastServer}GB`)
    print(`New RAM limit is ${ram}GB`)

    if (ramLastServer < ram) {
      print(`Destroying all servers with RAM less than ${ram}GB`)

      for (const server of servers) {
        const serverRam = getServerMaxRam(server)
        print(`Server ${server} has ${serverRam}GB RAM`)
        if (serverRam < ram) {
          print(`Destroying server ${server}`)
          killall(server)
          deleteServer(server)
          break
        }
      }

      for (let index = 0; index < serverLimit - serverCount(); ++index) {
        purchaseServer(serverPrefix, ram)
      }
    }

    await sleep(60 * 60 * 1000)
  }
}
