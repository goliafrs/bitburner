/**
* @param {NS} ns
**/
export async function main(ns) {
  const [ target, threads ] = ns.args

  ns.disableLog('ALL')

  const infiniteLoop = true
  const moneyThreshold = ns.getServerMaxMoney(target) * 0.9
  const securityThreshold = ns.getServerMinSecurityLevel(target) * 1.1

  while (infiniteLoop) {
    const money = ns.getServerMoneyAvailable(target).toFixed(2)
    const security = ns.getServerSecurityLevel(target).toFixed(2)

    if (security > securityThreshold) {
      ns.print('Run weaken, security is to high: ' + security + ' > ' + securityThreshold.toFixed(2) + '')
      await ns.weaken(target, { threads })
    } else if (money < moneyThreshold) {
      ns.print('Run grow, money is to low: ' + money + ' < ' + moneyThreshold.toFixed(2) + '')
      await ns.grow(target, { threads })
    } else {
      ns.print(`Hacking ${target}`)
      await ns.hack(target, { threads })
    }
  }
}
