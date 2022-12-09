function prepareData(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
    .map(str => str.split(' '))
    .map(([direction, move]) => ([direction, Number(move)]))
}

const directions = {
  U: [0, 1],
  D: [0, -1],
  R: [1, 0],
  L: [-1, 0]
}

function checkIfShouldMoveTail([x1, y1], [x2, y2]) {
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)

  return dx >= 2 || dy >= 2
}

function getCoordsString([x, y]) {
  return `${x};${y}`
}

const START = [0, 0]

function simulateMotions(motions) {
  let headPosition = START
  let tailPosition = START

  const visited = new Set([getCoordsString(tailPosition)])

  for (const [direction, count] of motions) {
    const [dx, dy] = directions[direction]

    for (let i = 0; i < count; i++) {
      const [x, y] = headPosition
      headPosition = [x + dx, y + dy]

      const shouldMoveTail = checkIfShouldMoveTail(tailPosition, headPosition)

      if (shouldMoveTail) {
        tailPosition = [x, y]
      }

      visited.add(getCoordsString(tailPosition))
    }
  }

  return visited
}

function solveTask(data) {
  const motions = prepareData(data)
  const visitedPositions = simulateMotions(motions)

  return visitedPositions.size
}

export {
  solveTask
}
