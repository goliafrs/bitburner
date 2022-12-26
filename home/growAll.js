import { targets } from 'variables'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, grow } = ns

  let [ threads ] = args
  if (!threads || threads < 1) {
    threads = 1
  }

  while (true) {
    for (const target of targets) {
      await grow(target, { threads })
    }
  }
}
