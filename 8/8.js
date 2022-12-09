/**
 * The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.
 *
 * First, determine whether there is enough tree cover here to keep a tree house hidden. To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.
 *
 * The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:
 *
 * 30373
 * 25512
 * 65332
 * 33549
 * 35390
 *
 * Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.
 *
 *  A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.
 *
 *  All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:
 *
 *  The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
 *  The top-middle 5 is visible from the top and right.
 *  The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
 *  The left-middle 5 is visible, but only from the right.
 *  The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
 *  The right-middle 3 is visible from the right.
 *  In the bottom row, the middle 5 is visible, but the 3 and 4 are not.
 *  With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.
 *
 *  Consider your map; how many trees are visible from outside the grid?
 */

function prepareData(data) {
  return data
    .split(/\r\n/)
    .filter(Boolean)
    .map(row => row.split('').map(Number))
}

function iterateTrees(trees, cb, offset = 1) {
  for (let row = offset; row < trees.length - offset; row++) {
    for (let col = offset; col < trees[0].length - offset; col++) {
      cb(trees[row][col], row, col)
    }
  }
}

function createIndexesMap(trees) {
  const rows = new Map()
  const cols = new Map()

  for (let row = 0; row < trees.length; row++) rows.set(row, new Map())
  for (let col = 0; col < trees[0].length; col++) cols.set(col, new Map())

  iterateTrees(trees, (tree, row, col) => {
    if (!cols.get(col).has(tree)) cols.get(col).set(tree, [])
    if (!rows.get(row).has(tree)) rows.get(row).set(tree, [])

    cols.get(col).get(tree).push(row)
    rows.get(row).get(tree).push(col)
  }, 0)

  const getBlockingTrees = (tree, entries) => ([...entries.keys()].filter(v => v >= tree))

  const checkIfHiddenInEntries = (tree, index, entries) => {
    const higherTrees = getBlockingTrees(tree, entries)

    let hiddenOnLeft = false
    let hiddenOnRight = false

    for (const key of higherTrees) {
      const treeIndexes = entries.get(key)

      for (let idx of treeIndexes) {
        if (idx > index) hiddenOnRight = true
        if (idx < index) hiddenOnLeft = true
      }

      if (hiddenOnLeft && hiddenOnRight) return true
    }

    return false
  }

  const getTreeScenicScore = (tree, row, col) => {
    const getClosestBlockingTreesIndexes = (entries, treeIndex) => {
      const closestTreeEntries = getBlockingTrees(tree, entries)

      if (!closestTreeEntries.length) return []

      const treeIndexes = closestTreeEntries
        .map(key => entries.get(key))
        .flat(1)

      let closestLargestIndex
      let closestSmallestIndex

      for (const index of treeIndexes) {
        if (index === treeIndex) continue

        if (index > treeIndex) closestLargestIndex = Math.min(closestLargestIndex ?? Infinity, index)
        if (index < treeIndex) closestSmallestIndex = Math.max(closestSmallestIndex ?? -Infinity, index)
      }

      return [closestSmallestIndex, closestLargestIndex]
    }

    const [leftIdx = 0, rightIdx = trees[0].length - 1] = getClosestBlockingTreesIndexes(rows.get(row), col)
    const [topIdx = 0, bottomIdx = trees.length - 1] = getClosestBlockingTreesIndexes(cols.get(col), row)

    const topScore = row - topIdx
    const leftScore = col - leftIdx
    const rightScore = rightIdx - col
    const bottomScore = bottomIdx - row

    return leftScore * rightScore * topScore * bottomScore
  }

  const isVisible = (tree, row, col) => {
    const isHiddenOnCol = (tree, row, col) => checkIfHiddenInEntries(tree, row, cols.get(col))
    const isHiddenOnRow = (tree, row, col) => checkIfHiddenInEntries(tree, col, rows.get(row))

    return !(isHiddenOnCol(tree, row, col) && isHiddenOnRow(tree, row, col))
  }

  return {isVisible, getTreeScenicScore}
}

function findVisibleTrees(trees) {
  const {isVisible} = createIndexesMap(trees)
  const perimeter = ((trees.length - 2) + trees[0].length) * 2

  let visibleTress = perimeter
  iterateTrees(trees, (tree, row, col) => {
    if (isVisible(tree, row, col)) visibleTress++
  })

  return visibleTress
}

function findLargestScenicScore(trees) {
  const {getTreeScenicScore} = createIndexesMap(trees)

  let largestScenicScore = -Infinity
  iterateTrees(trees, (tree, row, col) => {
    const treeScenicScore = getTreeScenicScore(tree, row, col)
    largestScenicScore = Math.max(treeScenicScore, largestScenicScore)
  })

  return largestScenicScore
}


function solveTask(data) {
  const trees = prepareData(data)
  return findVisibleTrees(trees)
}

function solveExtended(data) {
  const trees = prepareData(data)
  return findLargestScenicScore(trees)
}

export {
  solveTask, solveExtended
}
