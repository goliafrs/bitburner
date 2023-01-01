/**
* @param {NS} ns
**/
export async function main(ns) {
  const {
    print,
    killall,
    disableLog,
    getPurchasedServers
  } = ns

  disableLog('ALL')

  for (const server of getPurchasedServers()) {
    print(`Killing all scripts on ${server}`)
    killall(server)
  }

  print('Done')
}
