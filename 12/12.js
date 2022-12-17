// For this task correct order of coordinates is [y , x]
function parseData(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
}

const START = 'S'
const END = 'E'

const heights = 'abcdefghijklmnopqrstuvwxyz'

function getHeight(val) {
  if (val === START) return getHeight('a')
  if (val === END) return getHeight('z')
  return heights.indexOf(val)
}

const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]

function createCell(row, col, dist) {
  return {row, col, dist}
}

function BFS(start, maze) {
  const queue = []
  const seen = maze.map(() => new Array(maze[0].length).fill(false))

  queue.push(start)

  while (queue.length) {
    const {row, col, dist} = queue.shift()

    if (seen[row][col]) {
      continue
    }

    if (maze[row][col] === END) {
      return dist
    }

    for (let [dy, dx] of directions) {
      const newRow = row + dy
      const newCol = col + dx

      if (newRow < 0 || newCol < 0 ||
        newRow >= maze.length ||
        newCol >= maze[0].length
      ) {
        continue
      }

      if (getHeight(maze[newRow][newCol]) - getHeight(maze[row][col]) > 1) {
        continue
      }

      queue.push(createCell(row + dy, col + dx, dist + 1))

    }

    seen[row][col] = true
  }

  return -1
}

function findPoints(maze, predicate) {
  const result = []
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[0].length; col++) {
      if (predicate(maze[row][col])) result.push([row, col])
    }
  }

  return result
}

function solveTask(data) {
  const maze = parseData(data)
  const [row, col] = findPoints(maze, (point) => point === START)[0]

  return BFS(createCell(row, col, 0), maze)
}

function solveExtended(data) {
  const maze = parseData(data)
  const startingPoints = findPoints(maze, (point) => point === 'a' || point === START)

  return startingPoints
    .map(([row, col]) => BFS(createCell(row, col, 0), maze))
    .filter((v) => v > 0)
    .sort((a, z) => a - z)[0]
}

export {
  solveTask,
  solveExtended
}
