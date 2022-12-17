function prepareData(data) {
  return data
    .split(/\r\n\r\n/)
    .filter(Boolean)
    .map(str => str.split(/\r\n/).slice(0, 2))
    .map(([left, right]) => ([parsePairEL(left), parsePairEL(right)]))
}

const START_ARR = '['
const END_ARR = ']'
const COMMA = ','

/**
 *
 * @param str{string}
 * @returns {*[]}
 */
function parsePairEL(str) {
  const result = []
  const tokens = str.split('')

  const pushCurrentNumber = () => {
    if (currentNum.length > 0) {
      currentArr.push(Number(currentNum))
      currentNum = ''
    }
  }

  let currentNum = ''
  let currentArr = result

  const stack = [result]

  const operations = {
    [START_ARR]: () => {
      const arr = []

      currentArr.push(arr)
      stack.push(currentArr)

      currentArr = arr
    },
    [END_ARR]: () => {
      pushCurrentNumber()
      currentArr = stack.pop()
    },
    [COMMA]: () => {
      pushCurrentNumber()
    }
  }

  for (const token of tokens) {
    if (!isNaN(+token)) {
      currentNum += token
    } else {
      operations[token]()
    }
  }

  return result[0]
}

function coerseToArray(el) {
  return Array.isArray(el) ? el : [el]
}

function checkPairElementsOrder(left, right) {
  if (Number.isInteger(left) && Number.isInteger(right)) {
    const leftNum = Number(left)
    const rightNum = Number(right)

    if (leftNum === rightNum) {
      return 0
    }

    return rightNum > leftNum
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    return comparePair([coerseToArray(left), coerseToArray(right)])
  }

  return 0
}

function comparePair([left, right]) {
  const copyLeft = structuredClone(left)
  const copyRight = structuredClone(right)

  while (copyLeft.length && copyRight.length) {
    const isInRightOrder = checkPairElementsOrder(copyLeft.shift(), copyRight.shift())

    if (isInRightOrder !== 0) {
      return isInRightOrder
    }
  }

  if (copyLeft.length === copyRight.length) {
    return 0
  }

  return copyRight.length > copyLeft.length
}

function getFirstNum(el) {
  if (!el) return 0
  if (Number.isInteger(el)) return el
  return getFirstNum(el[0])
}

function displayPair([left, right]) {
  console.log(JSON.stringify(left))
  console.log(JSON.stringify(right))
  console.log()
}

function solveTask(data) {
  const pairs = prepareData(data)

  let result = 0
  for (let idx = 0; idx < pairs.length; idx++) {
    const isPairInCorrectOrder = comparePair(pairs[idx])
    if (isPairInCorrectOrder !== false) {
      result += idx + 1
    }
  }

  return result
}

function solveExtended(data) {
  const signals = prepareData(data).flat(1)

  const divider1 = [[2]]
  const divider2 = [[6]]

  signals.push(divider1, divider2)
  signals.sort((a, z) => {
    const result = comparePair([a, z])

    if (result === 0) {
      return 0
    }

    return result ? -1 : 1
  })

  return (signals.lastIndexOf(divider1) + 1) * (signals.lastIndexOf(divider2) + 1)
}

export {
  solveTask,
  solveExtended
}
