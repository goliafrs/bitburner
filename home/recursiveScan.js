/**
* @param {NS} ns
**/
export async function main(ns) {
  const { scan, tprint, disableLog, getServerMaxMoney } = ns

  disableLog('ALL')

  const targets = []

  const recursiveScan = target => {
    const servers = scan(target)

    for (const server of servers) {
      if (!targets.includes(server)) {
        targets.push(server)
        recursiveScan(server)
      }
    }
  }
  recursiveScan('home')

  const filteredTargets = targets.filter(t => getServerMaxMoney(t) > 0)
  tprint('Found servers: ', filteredTargets.length)
  tprint(filteredTargets.join('\n'))

  return filteredTargets
}
