import fs from "fs/promises";

function getArguments() {
  const [, , type, taskNumber] = process.argv
  const getValue = (arg) => arg.split(':')[1]
  return [getValue(type), Number(taskNumber)]
}

function solveTask(data, solvers) {
  const {solveTask, solveExtended} = solvers
  const results = {result: null, extended: null}

  if (solveTask) {
    results.result = solveTask(data)
  }

  if (solveExtended) {
    results.extended = solveExtended(data)
  }

  return results;
}

function displayResults({result, extended}) {
  if (result) console.log(`Task result: ${result}`)
  if (extended) console.log(`Part two result: ${extended}`)
}

async function getTaskData(taskNumber, type = 'prod') {
  try {
    const path = `./${taskNumber}/${type}.txt`
    return await fs.readFile(path, {encoding: 'utf-8'})
  } catch (e) {
    throw new Error(`No ${type} data for this task`)
  }
}

async function getSolver(taskNumber) {
  try {
    const solverPath = `./${taskNumber}/${taskNumber}.js`
    return await import(solverPath)
  } catch (e) {
    throw new Error(`Error while executing solver - ${e.message}`)
  }
}

try {
  const [type, task] = getArguments()

  const solvers = await getSolver(task)
  const data = await getTaskData(task, type)

  const results = solveTask(data, solvers)

  displayResults(results)
} catch (e) {
  console.error(e)
}
