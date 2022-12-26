/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, killall } = ns
  const [ server ] = args

  killall(server)
}
