const rock = 'rock'
const paper = 'paper'
const scissors = 'scissors'

const pointsForSelection = {
  [rock]: 1,
  [paper]: 2,
  [scissors]: 3
}

const win = 'WIN'
const draw = 'DRAW'
const lose = 'LOSE'

const pointsForResult = {
  [win]: 6,
  [draw]: 3,
  [lose]: 0
}

const turnResult = {
  [rock]: {
    [rock]: draw,
    [paper]: win,
    [scissors]: lose
  },
  [paper]: {
    [rock]: lose,
    [paper]: draw,
    [scissors]: win
  },
  [scissors]: {
    [rock]: win,
    [paper]: lose,
    [scissors]: draw
  }
}

function calculateResult(turn, response) {
  const result = turnResult[turn][response]
  return pointsForResult[result]
}


function getTurnsFromData(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
    .map(pair => pair.split(' '))
}

function countPointsForTurn(turn, response) {
  const pointsForResult = calculateResult(turn, response)
  const pointsForResponse = pointsForSelection[response]

  return pointsForResponse + pointsForResult
}

const turnFigures = {
  'A': [rock],
  'B': [paper],
  'C': [scissors]
}

function solveTask(data) {
  const responseFigures = {
    'X': [rock],
    'Y': [paper],
    'Z': [scissors]
  }

  return getTurnsFromData(data)
    .map(([turn, response]) => ([turnFigures[turn], responseFigures[response]]))
    .reduce((acc, [turn, response]) => acc + countPointsForTurn(turn, response), 0)
}


function findTurnByResult(searchedResult) {
  return function (turnFigure) {
    const possibleTurns = turnResult[turnFigure]
    const turnEntries = Object.entries(possibleTurns)

    return turnEntries.find(([, result]) => result === searchedResult)[0]
  }
}

function solveExtended(data) {
  const responseStrategy = {
    'X': findTurnByResult(lose),
    'Y': findTurnByResult(draw),
    'Z': findTurnByResult(win)
  }

  return getTurnsFromData(data).map(([turn, response]) => {
    const turnFigure = turnFigures[turn]
    const responseFigureFinder = responseStrategy[response]
    const responseFigure = responseFigureFinder(turnFigure)

    return [turnFigure, responseFigure]
  }).reduce((acc, [turn, response]) => acc + countPointsForTurn(turn, response), 0)
}

export {
  solveTask,
  solveExtended
}
