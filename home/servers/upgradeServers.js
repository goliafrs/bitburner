/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  const money = () => ns.getServerMoneyAvailable('home').toFixed(2)
  const serverCount = () => ns.getPurchasedServers().length
  const infiniteLoop = true

  while (infiniteLoop) {
    const serverPrefix = 'arzamas'
    const serverLimit = ns.getPurchasedServerLimit()
    const servers = ns.getPurchasedServers()
    const ramLastServer = serverCount() > 0 ? ns.getServerMaxRam(servers[servers.length - 1]) : 0
    const maxRam = ns.getPurchasedServerMaxRam()

    let ram = ramLastServer || 16
    let flag = true
    while (flag) {
      if (money() < ns.getPurchasedServerCost(ram) * (serverLimit / 2)) {
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

    ns.print(`Current max RAM is    ${maxRam}GB`)
    ns.print(`Current RAM limit is  ${ramLastServer}GB`)
    ns.print(`New RAM limit is      ${ram}GB`)

    for (const server of servers) {
      const serverRam = ns.getServerMaxRam(server)
      ns.print(`Server ${server} has ${serverRam}GB RAM`)
      if (serverRam < ram) {
        ns.print(`Destroying server ${server}`)
        ns.killall(server)
        ns.deleteServer(server)
        break
      }
    }

    for (let index = 0; index < serverLimit - serverCount(); ++index) {
      const server = ns.purchaseServer(serverPrefix, ram)
      ns.print(`Purchasing server ${server} with RAM ${ram}`)
    }

    await ns.sleep(5 * 60 * 1000)
  }
}
