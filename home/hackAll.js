import { targets } from 'variables'

const scriptName = 'hack.js'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run, args, kill, getHostname } = ns
  const [ threads ] = args

  kill(scriptName, getHostname())

  for (const target of targets) {
    run(scriptName, threads, target, threads)
  }
}
