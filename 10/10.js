function prepareData(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
    .map(command => command.split(" "))
}

function createSubject() {
  let listener = null
  const addListener = (cb) => listener = cb
  const next = (val) => listener(val)

  return {
    next,
    addListener
  }
}

function createCpuCommandsProcessor() {
  let cycle = 0
  let value = 1

  const subject = createSubject()
  const incrementCycle = () => subject.next([++cycle, value])


  const commands = {
    noop: incrementCycle,
    addx: (val) => {
      for (let i = 0; i < 2; i++) incrementCycle()
      value += Number(val)
    }
  }
  const processCommand = ([commandKey, arg]) => commands[commandKey](arg)
  const onCycleTick = subject.addListener

  return {
    onCycleTick,
    processCommand
  }
}

function solveTask(data) {
  const commands = prepareData(data)
  const searchedCycleValues = [20, 60, 100, 140, 180, 220]

  const {processCommand, onCycleTick} = createCpuCommandsProcessor()

  let sum = 0
  onCycleTick(([cycle, value]) => {
    if (searchedCycleValues.includes(cycle)) {
      sum += value * cycle
    }
  })

  commands.forEach(processCommand)

  return sum
}

const SCREEN_HEIGHT = 6
const SCREEN_WIDTH = 40

function createDrawingScreen() {
  const row = [...new Array(SCREEN_WIDTH)].map(() => '.')
  const board = [...new Array(SCREEN_HEIGHT)].map(() => [...row])

  return board
}

function createDrawer() {
  let spritePosition = [0, 1, 2]
  let board = createDrawingScreen()

  const getCyclePosition = (cycle) => {
    const y = Math.floor(cycle / SCREEN_WIDTH)
    const x = (cycle - 1) % SCREEN_WIDTH

    return [x, y]
  }

  const updateSpritePosition = (register) => spritePosition = [register - 1, register, register + 1]
  const drawPixel = (x, y) => board[y][x] = '#'

  const acceptCycle = ([cycle, register]) => {
    const [x, y] = getCyclePosition(cycle)
    updateSpritePosition(register)

    if (spritePosition.includes(x)) {
      drawPixel(x, y)
    }
  }

  const displayBoard = () => {
    console.log(board.map(el => el.join(' ')).join('\n'))
  }

  return {acceptCycle, displayBoard}
}


function solveExtended(data) {
  const commands = prepareData(data)

  const {acceptCycle, displayBoard} = createDrawer()
  const {onCycleTick, processCommand} = createCpuCommandsProcessor()

  onCycleTick(acceptCycle)
  commands.forEach(processCommand)

  displayBoard()
}

export {
  solveTask,
  solveExtended
}
