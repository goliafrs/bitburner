/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  for (const server of ns.getPurchasedServers()) {
    print(`Killing all scripts on ${server}`)
    ns.killall(server)
  }

  print('Done')
}
