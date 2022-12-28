/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, hack, grow, weaken, disableLog, print, getServerMinSecurityLevel, getServerMaxMoney, getServerSecurityLevel, getServerMoneyAvailable } = ns
  const [ target, threads ] = args

  disableLog('ALL')

  const infiniteLoop = true
  const moneyThreshold = getServerMaxMoney(target) * 0.9
  const securityThreshold = getServerMinSecurityLevel(target) * 1.1

  while (infiniteLoop) {
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
