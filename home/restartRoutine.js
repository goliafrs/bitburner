const scriptName = 'routine.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, kill, disableLog, scriptRunning } = ns

  disableLog('ALL')

  if (scriptRunning(scriptName, 'home')) {
    kill(scriptName, 'home')
  }

  run(scriptName, 1, 'home')
}
