/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, hack, grow, weaken, disableLog, print, getServerMinSecurityLevel, getServerMaxMoney, getServerSecurityLevel, getServerMoneyAvailable } = ns
  const [ target, threads ] = args

  disableLog('ALL')

  const moneyThreshold = getServerMaxMoney(target)
  const securityThreshold = getServerMinSecurityLevel(target)

  while (true) {
    const money = getServerMoneyAvailable(target).toFixed(2)
    const security = getServerSecurityLevel(target).toFixed(2)

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
