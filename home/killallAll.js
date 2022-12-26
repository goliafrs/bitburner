import { targets } from 'variables'

/**
* @param {NS} ns
**/
export async function main(ns) {
  const { killall } = ns

  for (const target of targets) {
    killall(target)
  }
}
