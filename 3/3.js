function prepareListOfRucksacks(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
}

function findRepeatedItems(line1, line2) {
  const seen = new Set()
  const result = new Set()

  for (let item of line1) {
    seen.add(item)
  }

  for (let item of line2) {
    if (seen.has(item)) result.add(item)
  }

  return [...result]
}

const priorities = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function getPriorityOfItem(item) {
  return priorities.indexOf(item)
}

function solveTask(data) {
  return prepareListOfRucksacks(data)
    .map((rucksack) => {
      const half = rucksack.length / 2
      const firstHalf = rucksack.slice(0, half)
      const secondHalf = rucksack.slice(half)

      return findRepeatedItems(firstHalf, secondHalf)
    })
    .map(items => items.flat(1))
    .reduce((acc, cur) => acc + getPriorityOfItem(cur), 0)
}

function findBadge(line1, line2, line3) {
  return findRepeatedItems(findRepeatedItems(line1, line2), line3)
}

function solveExtended(data) {
  let result = 0
  const rucksacks = prepareListOfRucksacks(data)

  for (let idx = 0; idx < rucksacks.length; idx += 3) {
    const line1 = rucksacks[idx]
    const line2 = rucksacks[idx + 1]
    const line3 = rucksacks[idx + 2]

    const badge = findBadge(line1, line2, line3)
    const badgePriority = getPriorityOfItem(badge)

    result += badgePriority;
  }

  return result
}

export {
  solveTask,
  solveExtended
}
