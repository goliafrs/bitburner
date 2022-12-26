/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, hack, grow, weaken, disableLog, print, getServerMinSecurityLevel, getServerMaxMoney, getServerSecurityLevel, getServerMoneyAvailable } = ns
  const [ target, threads ] = args

  disableLog('ALL')

  const moneyThreshold = getServerMaxMoney(target) / 1.5
  const securityThreshold = getServerMinSecurityLevel(target) + 0.5

  while (true) {
    const money = getServerMoneyAvailable(target)
    const security = getServerSecurityLevel(target)

    if (security > securityThreshold) {
      print('Run weaken, security is to high: ' + security + ' > ' + securityThreshold + '')
      await weaken(target, { threads })
    } else if (money < moneyThreshold) {
      print('Run grow, money is to low: ' + money + ' < ' + moneyThreshold + '')
      await grow(target, { threads })
    } else {
      print(`Hacking ${target}`)
      await hack(target, { threads })
    }
  }
}
