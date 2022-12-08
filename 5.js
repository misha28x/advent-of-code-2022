function prepareData(data) {  const [cargo, turnsString] = data.split(/\r\n\r\n/)  const [stacksLine, ...cargoContent] = cargo.split(/\r\n/).reverse()  const cargoStacks = prepareStackRow(stacksLine)  const turns = turnsString.split(/\r\n/)  return [cargoStacks, cargoContent, turns]}const CARGO_SEPARATOR = '   'function prepareStackRow(stacksLine) {  return stacksLine.trim().split(CARGO_SEPARATOR)}function createCargoStore(cargoStacks) {  const cargoStore = {}  for (let stack of cargoStacks) {    cargoStore[stack] = []  }  return cargoStore}function fillCargoStore(store, content) {  const rows = content.length - 1  const cols = content[0].length - 1  let rowIdx = 0  let colIdx = 1  let stackIdx = 1  const nextRow = () => rowIdx++  const nextColumn = () => {    colIdx += 4;    rowIdx = 0;    stackIdx++;  }  const hasContent = (col) => Boolean(col) && col !== ' '  while (colIdx <= cols && rowIdx <= rows) {    const cellContent = content[rowIdx][colIdx]    if (hasContent(cellContent)) {      store[stackIdx].push(cellContent)      if (rowIdx <= rows) nextRow()      if (rowIdx > rows) nextColumn()    } else {      nextColumn()    }  }}function getTopElementsFromStore(store) {  const keys = Object.keys(store)  const result = []  for (let key of keys) {    const lastEl = store[key].at(-1)    result.push(lastEl)  }  return result.join('')}function parseTurn(turn) {  const [, count, , from, , to] = turn.split(' ')  return {    count, from, to  }}function processTurn(store, turn) {  const {count, from, to} = parseTurn(turn)  const startStack = store[from]  const destination = store[to]  for (let i = 0; i < count; i++) {    destination.push(startStack.pop())  }}function CRATE9001MOVE(store, turn) {  const {count, from, to} = parseTurn(turn)  const startStack = store[from]  const destination = store[to]  const holder = []  for (let i = 0; i < count; i++) {    holder.push(startStack.pop())  }  for (let item of holder.reverse()) {    destination.push(item)  }}function solveTask(data) {  const [stacks, initialContent, turns] = prepareData(data)  const store = createCargoStore(stacks)  fillCargoStore(store, initialContent)  turns.forEach(turn => processTurn(store, turn))  return getTopElementsFromStore(store)}function solveExtended(data) {  const [stacks, initialContent, turns] = prepareData(data)  const store = createCargoStore(stacks)  fillCargoStore(store, initialContent)  turns.forEach(turn => CRATE9001MOVE(store, turn))  return getTopElementsFromStore(store)}export {  solveTask,  solveExtended}