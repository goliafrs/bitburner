/**
* @param {NS} ns
**/
export async function main(ns) {
  const [ target, threads ] = ns.args

  const infiniteLoop = true
  while (infiniteLoop) {
    await ns.grow(target, { threads })
  }
}
