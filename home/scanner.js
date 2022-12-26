const toStringAndPadStart = (value, length) => value.toString().padStart(length, ' ')
const toStringAndPadEnd = (value, length) => value.toString().padEnd(length, ' ')

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { scan, sleep, tprint, disableLog, getServerSecurityLevel, getServerMinSecurityLevel, getServerMaxMoney, getServerMoneyAvailable, getServerMaxRam, getServerUsedRam } = ns

  disableLog('ALL')

  const targets = []

  const recursiveScan = target => {
    tprint(`Scanning ${target}`)

    const servers = scan(target)

    for (const server of servers) {
      if (!targets.includes(server)) {
        targets.push(server)
        recursiveScan(server)
      }
    }
  }
  recursiveScan('home')

  const clearTerminal = () => {
    for (let i = 0; i < 100; i++) {
      tprint('')
    }
  }

  const uniqTargets = [ ...new Set(targets.filter(t => getServerMaxMoney(t) > 0)) ]

  while (true) {
    const cols = [ 'Server', 'Security', 'Money', 'RAM' ]
    tprint(cols[0].padEnd(18, ' ') + cols[1].padEnd(14, ' ') + cols[2].padEnd(30, ' ') + cols[3])
    tprint(''.padEnd(80, '-'))

    for (const target of uniqTargets) {
      const security = Math.floor(getServerSecurityLevel(target))
      const minSecurity = getServerMinSecurityLevel(target)
      const maxMoney = getServerMaxMoney(target)
      const money = Math.floor(getServerMoneyAvailable(target))
      const serverMaxRam = getServerMaxRam(target)
      const serverUsedRam = getServerUsedRam(target)

      const targetString = target.padEnd(18, ' ')
      const securityString = `[ ${toStringAndPadStart(minSecurity, 2)} | ${toStringAndPadEnd(security, 2)} ]`.padEnd(14, ' ')
      const moneyString = `[ ${toStringAndPadStart(money, 10)} | ${toStringAndPadEnd(maxMoney, 10)} ]`.padEnd(30, ' ')
      const ramString = `[ ${toStringAndPadStart(serverUsedRam, 4)} | ${toStringAndPadEnd(serverMaxRam, 4)} ]`

      tprint(`${targetString}${securityString}${moneyString}${ramString}`)
    }

    await sleep(1000)
    clearTerminal()
  }
}
