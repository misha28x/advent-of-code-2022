function parseData(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
    .map((line) => line
      .split(' -> ')
      .map((el) => el.split(',').map(Number)
      )
    )
}

const EMPTY_CELL = '.'
const OBSTRUCTION = '#'
const SAND = 'o'

function getRoomDimension(coordinates, hasFloor) {
  let smallestX = Infinity
  let largestX = -Infinity
  let height = -Infinity

  for (let i = 0; i < coordinates.length; i++) {
    for (const [x, y] of coordinates[i]) {
      smallestX = Math.min(smallestX, x)
      largestX = Math.max(largestX, x)
      height = Math.max(height, y)
    }
  }

  if (hasFloor) {
    smallestX = 0
    largestX = 1000
  }

  return {
    end: largestX,
    offset: smallestX,
    height: height + 1,
  }
}


function createRoom({height, offset, end}, hasFloor = false) {
  const result = []

  const width = hasFloor ? end - offset : end - offset + 1
  const roomHeight = hasFloor ? height + 2 : height

  for (let i = 0; i < roomHeight; i++) {
    result.push(Array(width).fill(EMPTY_CELL))
  }

  result[0][SAND_STARTING_POINT - offset] = 'S'

  if (hasFloor) {
    result[roomHeight - 1] = Array(width).fill(OBSTRUCTION)
  }

  return result
}

function addObstructions(rocks, room, {offset}) {
  for (const path of rocks) {
    for (let i = 1; i < path.length; i++) {
      const [toX, toY] = path[i]
      const [fromX, fromY] = path[i - 1]

      if (toX === fromX) {
        const start = Math.min(fromY, toY)
        const end = Math.max(fromY, toY)

        for (let y = start; y <= end; y++) room[y][toX - offset] = OBSTRUCTION
      }

      if (toY === fromY) {
        const start = Math.min(fromX, toX)
        const end = Math.max(fromX, toX)

        for (let x = start; x <= end; x++) room[toY][x - offset] = OBSTRUCTION
      }
    }
  }
}

const SAND_STARTING_POINT = 500

function addSand(room, start, stopCondition) {
  const startingPosition = [SAND_STARTING_POINT - start, 0]
  let currentSandPosition = startingPosition

  const isInBound = () => currentSandPosition[1] < room.length
  const isCellFree = ([x, y]) => room[y][x] !== OBSTRUCTION && room[y][x] !== SAND

  let count = 0
  while (isInBound()) {
    const [x, y] = currentSandPosition

    const down = [x, y + 1]
    const downLeft = [x - 1, y + 1]
    const downRight = [x + 1, y + 1]

    if (stopCondition?.()) {
      return count
    }

    if (y + 1 >= room.length) {
      return count
    } else if (isCellFree(down)) {
      currentSandPosition = down
    } else if (isCellFree(downLeft)) {
      currentSandPosition = downLeft
    } else if (isCellFree(downRight)) {
      currentSandPosition = downRight
    } else {
      currentSandPosition = startingPosition
      room[y][x] = SAND
      count++
    }
  }
}

function solveTask(data) {
  const coordinates = parseData(data)
  const roomDimensions = getRoomDimension(coordinates)
  const room = createRoom(roomDimensions)

  addObstructions(coordinates, room, roomDimensions)
  return addSand(room, roomDimensions.offset, (x, y) => y + 1 >= room.length)
}

function solveExtended(data) {
  const coordinates = parseData(data)
  const roomDimensions = getRoomDimension(coordinates, true)
  const room = createRoom(roomDimensions, true)

  addObstructions(coordinates, room, roomDimensions)
  const count = addSand(room, roomDimensions.offset, (x, y) => room[0][SAND_STARTING_POINT - roomDimensions.offset] === SAND)
  return count
}

export {
  solveTask,
  solveExtended
}

