/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall, getPurchasedServers, deleteServer } = ns
  const servers = getPurchasedServers()

  for (const server of servers) {
    killall(server)
    deleteServer(server)
  }
}
