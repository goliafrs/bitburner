/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  for (const server of ns.getPurchasedServers()) {
    ns.print(`Killing all scripts on ${server}`)
    ns.killall(server)
  }

  ns.print('Done')
}
