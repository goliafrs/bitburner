const scriptName = 'routine.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  ns.disableLog('ALL')
  ns.kill(scriptName, 'home')
  ns.run(scriptName, 1, 'home')
}
