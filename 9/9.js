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

function getDiff([x1, y1], [x2, y2]) {
  const dx = x2 - x1
  const dy = y2 - y1

  return [dx, dy]
}

function getMiddleCords([x1, y1], [x2, y2]) {
  return [(x1 + x2) / 2, (y1 + y2) / 2]
}

function serializePosition([x, y]) {
  return `${x};${y}`
}

const START = [12, 6]

function createRope(length) {
  return [...new Array(length)].map(() => START)
}

function moveRope(rope, motions) {
  const visited = new Set([serializePosition(START)])
  const savePosition = (coords) => {
    visited.add(serializePosition(coords))
  }
  const updateHead = ([dx, dy]) => {
    const [x, y] = rope[0]
    rope[0] = [x + dx, y + dy]
  }

  const moveTailToHead = (knotIdx = 1) => {
    const prev = rope[knotIdx - 1]
    const current = rope[knotIdx]

    const isLast = knotIdx === rope.length - 1

    const [dx, dy] = getDiff(current, prev)
    const shouldMove = Math.abs(dx) >= 2 || Math.abs(dy) >= 2

    const oneOf = (a, b) => {
      return Math.abs(dx) === a && Math.abs(dy) === b || Math.abs(dy) === a && Math.abs(dx) === b
    }

    if (shouldMove) {
      let newPosition
      const [x, y] = current

      if (oneOf(0, 2)) {1
        newPosition = getMiddleCords(prev, current)
      }

      if (oneOf(1, 2)) {
        if (Math.abs(dx) > Math.abs(dy)) {
          newPosition = [x + dx / 2, y + dy]
        } else {
          newPosition = [x + dx, y + dy / 2]
        }
      }

      if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
        newPosition = [x + dx / 2, y + dy / 2]
      }

      rope[knotIdx] = newPosition
    }

    if (!isLast) moveTailToHead(knotIdx + 1)
  }

  for (const [direction, count] of motions) {
    const diff = directions[direction]

    for (let i = 0; i < count; i++) {
      updateHead(diff)
      moveTailToHead()
      savePosition(rope.at(-1))
    }
  }
  return visited
}

function solveTask(data) {
  const motions = prepareData(data)

  const rope = createRope(2)
  const visitedPositions = moveRope(rope, motions)
  return visitedPositions.size
}

function solveExtended(data) {
  const motions = prepareData(data)
  const rope = createRope(10)

  const visitedPositions = moveRope(rope, motions)
  return visitedPositions.size
}

export {
  solveTask,
  solveExtended
}
