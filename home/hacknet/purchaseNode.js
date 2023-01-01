/**
* @param {NS} ns
**/
export async function main(ns) {
  const { hacknet, sleep, print, disableLog, getServerMoneyAvailable } = ns
  const { numNodes, getPurchaseNodeCost, purchaseNode } = hacknet

  disableLog('ALL')

  const money = () => getServerMoneyAvailable('home')
  const nodesCount = () => numNodes()
  const cost = () => getPurchaseNodeCost()

  const infiniteLoop = true

  while (infiniteLoop) {
    print(`Nodes: ${nodesCount()} Money: ${money().toFixed(2)} Cost: ${cost().toFixed(2)}`)
    while (money() < cost()) {
      print(`Waiting for money: ${money().toFixed(2)} < ${cost().toFixed(2)}`)
      await sleep(1 * 60 * 1000)
    }

    print('Purchasing node')
    purchaseNode()
  }

  print('Done')
}
