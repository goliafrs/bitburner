const scriptName = 'routine.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, killall, disableLog } = ns

  disableLog('ALL')

  killall('home')
  run(scriptName, 1)
}
