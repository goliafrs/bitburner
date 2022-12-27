/**
* @param {NS} ns
**/
export async function main(ns) {
  const { scan, tprint, disableLog, getServerMaxMoney, getServerRequiredHackingLevel } = ns

  disableLog('ALL')

  const targets = []

  const recursiveScan = target => {
    const servers = scan(target)

    for (const server of servers) {
      const maxMoney = getServerMaxMoney(server)
      const requiredHackingLevel = getServerRequiredHackingLevel(server)
      const index = targets.findIndex(target => target.server === server)

      if (!~index && maxMoney > 0) {
        targets.push({
          server,
          requiredHackingLevel
        })
        recursiveScan(server)
      }
    }
  }
  recursiveScan('home')

  targets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel)
  tprint(targets.map(target => target.server).join('\n'))
}
