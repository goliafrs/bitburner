/**
* @param {NS} ns
**/
export async function main(ns) {
  const [ server, threads ] = ns.args

  const infiniteLoop = true
  while (infiniteLoop) {
    await ns.weaken(server, { threads })
  }
}
