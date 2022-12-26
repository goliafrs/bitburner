import { targets } from 'variables'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, weaken } = ns

  let [ threads ] = args
  if (!threads || threads < 1) {
    threads = 1
  }

  while (true) {
    for (const target of targets) {
      await weaken(target, { threads })
    }
  }
}
