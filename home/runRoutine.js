const scriptName = 'routine.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, kill, disableLog } = ns

  disableLog('ALL')

  kill(scriptName, 'home')
  run(scriptName, 1, 'home')
}
