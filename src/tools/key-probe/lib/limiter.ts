export function createLimiter(concurrency: number) {
  let active = 0
  const queue: (() => void)[] = []

  function next() {
    if (queue.length === 0 || active >= concurrency) return
    active++
    const run = queue.shift()!
    run()
  }

  return function run<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task = () => {
        fn().then(
          (val) => { active--; resolve(val); next() },
          (err) => { active--; reject(err); next() },
        )
      }
      queue.push(task)
      next()
    })
  }
}
