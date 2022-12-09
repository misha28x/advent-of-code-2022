function prepareData(data) {
  return data.split('').filter(Boolean)
}

function checkMarker(marker) {
  for (let i = 0; i < marker.length - 1; i++) {
    const checkedEl = marker[i]

    for (let j = i + 1; j < marker.length; j++) {
      if (checkedEl === marker[j]) return false
    }
  }

  return true
}

function getMarker(chars, startIdx, length = 4) {
  const result = []
  const endIdx = startIdx + length

  for (let idx = startIdx; idx < endIdx; idx++) {
    result.push(chars[idx])
  }

  return result
}

const markersLength = {
  start: 4,
  message: 14
}

function findFirstMarker(chars, length) {
  let startIdx = 0

  while (startIdx <= chars.length - length) {
    const marker = getMarker(chars, startIdx, length)
    const isValidMarker = checkMarker(marker)

    if (isValidMarker) {
      return startIdx + length
    } else {
      startIdx++
    }
  }
}

function solveTask(data) {
  const chars = prepareData(data)
  return findFirstMarker(chars, markersLength.start)
}

function solveExtended(data) {
  const chars = prepareData(data)
  return findFirstMarker(chars, markersLength.message)
}

export {
  solveTask,
  solveExtended
}

