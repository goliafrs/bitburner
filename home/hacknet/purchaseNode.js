const nodesNeed = 32

export async function main(ns) {
  const { hacknet, sleep, getServerMoneyAvailable } = ns
  const { numNodes, getPurchaseNodeCost, purchaseNode } = hacknet

  const money = () => getServerMoneyAvailable('home')
  const nodes = () => numNodes()
  const cost = () => getPurchaseNodeCost()

  while (nodes() < nodesNeed) {
    while (money() < cost()) {
      await sleep(5 * 1000)
    }
    purchaseNode()
  }
}
