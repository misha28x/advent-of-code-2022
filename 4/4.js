function prepareList(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
    .map(item => item.split(','))
    .map(pair => pair.map(item => item.split('-').map(Number)))
}

function checkIfOneRangeIsContained(ranges) {
  const [a, b] = ranges[0]
  const [c, d] = ranges[1]

  return (a <= c && b >= d) || (c <= a && d >= b)
}

function checkIfRangesOverlap(ranges) {
  const [a, b] = ranges[0]
  const [c, d] = ranges[1]

  return !(c > b || a > d)
}

function solveTask(data) {
  return prepareList(data).reduce((acc, ranges) => acc + (checkIfOneRangeIsContained(ranges) ? 1 : 0), 0)
}

function solveExtended(data) {
  return prepareList(data).reduce((acc, ranges) => acc + (checkIfRangesOverlap(ranges) ? 1 : 0), 0)
}

export {
  solveTask,
  solveExtended
}
