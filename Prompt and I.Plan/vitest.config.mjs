export default {
  test: {
    environment: 'node',
    passWithNoTests: false,
    pool: 'threads',
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
  },
}
