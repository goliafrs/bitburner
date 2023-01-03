/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')

  const money = () => ns.getServerMoneyAvailable('home')
  const nodesCount = () => ns.hacknet.numNodes()
  const cost = () => ns.hacknet.getPurchaseNodeCost()

  const infiniteLoop = true

  while (infiniteLoop) {
    print(`Nodes: ${nodesCount()} Money: ${money().toFixed(2)} Cost: ${cost().toFixed(2)}`)
    while (money() < cost()) {
      print(`Waiting for money: ${money().toFixed(2)} < ${cost().toFixed(2)}`)
      await ns.sleep(1 * 60 * 1000)
    }

    print('Purchasing node')
    ns.hacknet.purchaseNode()
  }

  print('Done')
}
