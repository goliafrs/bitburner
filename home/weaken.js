/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, weaken } = ns
  const [ server, threads ] = args

  while (true) {
    await weaken(server, { threads })
  }
}
