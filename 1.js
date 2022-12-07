function splitByElves(data) {
    return data.split(/\r\n\r\n/)
}

function countCaloriesPerElv(caloriesList) {
    return caloriesList
        .split(/\r\n/)
        .map(Number)
        .reduce((acc, cur) => acc + Number(cur), 0)
}

function findMostCalories(acc, cur) {
    return acc > cur ? acc : cur
}

function solveTask(data) {
    return splitByElves(data)
        .map(countCaloriesPerElv)
        .reduce(findMostCalories, -Infinity)
}

function solveExtended(data) {
    return splitByElves(data)
        .map(countCaloriesPerElv)
        .sort((a, z) => z - a)
        .splice(0, 3)
        .reduce((acc, cur) => acc + cur, 0)

}

export {
    solveTask,
    solveExtended
}



