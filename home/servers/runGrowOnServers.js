const scriptName = 'grow.js'
const threads = 2

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { kill, scp, exec, getPurchasedServers } = ns
  const servers = getPurchasedServers()

  for (const server of servers) {
    kill(scriptName, server)
    await scp(scriptName, server)
    exec(scriptName, server, threads, threads)
  }
}
