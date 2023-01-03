/**
* @param {NS} ns
**/
export async function main(ns) {
  const [ server ] = ns.args

  ns.killall(server)
}
