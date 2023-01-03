const scriptName = 'routine.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')
  ns.killall('home')
  ns.run(scriptName, 1)
}
