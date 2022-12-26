/**
* @param {NS} ns
**/
export async function main(ns) {
  const { args, grow } = ns
  const [ target, threads ] = args

  while (true) {
    await grow(target, { threads })
  }
}
