import { targets } from 'variables'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { run } = ns

  for (const target of targets) {
    run('nuke.js', 1, target)
  }
}
