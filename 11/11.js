function parseData(data) {
  const monkeysInput = data.split(/\r\n\r\n/).filter(Boolean)
  return monkeysInput.map(parseMonkey)
}

function parseMonkey(input) {
  const [, ...data] = input.split(/\r\n/)
  const getLastNumber = (str) => Number(str.split(' ').at(-1))

  const startingItems = data[0].split(':')[1].split(', ').map(Number)
  const operation = parseOperation(data[1].trim().split(' ').slice(3))
  const divider = getLastNumber(data[2])

  const ifTrue = getLastNumber(data[3])
  const ifFalse = getLastNumber(data[4])

  return createMonkey({startingItems, operation, divider, ifTrue, ifFalse})
}

function parseOperation([a, operator, b]) {
  const operations = {
    '*': (a, b) => a * b,
    '+': (a, b) => a + b
  }

  return (val) => {
    const operation = operations[operator]
    const parseOperand = (operand) => operand === 'old' ? val : Number(operand)
    return operation(parseOperand(a), parseOperand(b))
  }
}

let modulo = 1
let monkeys = []

function createMonkey({startingItems, operation, divider, ifTrue, ifFalse}) {
  return {
    count: 0,
    items: startingItems,
    divider,
    test(cb) {
      while (this.items.length) {
        this.count++
        const item = this.items.shift()

        const newItem = cb(operation(item)) % modulo
        const receiver = newItem % this.divider === 0 ? ifTrue : ifFalse

        monkeys[receiver].items.push(newItem)
      }
    }
  }
}

function countItems(rounds, cb) {
  return (data) => {
    monkeys = parseData(data)
    modulo = monkeys.reduce((a, b) => a * b.divider, 1)

    for (let round = 0; round < rounds; round++) {
      monkeys.forEach(m => m.test(cb))
    }

    const topMonkeys = monkeys
      .map(m => m.count)
      .sort((a, z) => z - a)

    return topMonkeys[0] * topMonkeys[1]
  }
}

const solveTask = countItems(20, (item) => Math.floor(item / 3))
const solveExtended = countItems(10000, (item) => item)

export {
  solveTask,
  solveExtended
}
