import fs from "fs/promises";

function getArguments() {
  const [, , type, taskNumber] = process.argv
  const getValue = (arg) => arg.split(':')[1]
  return [getValue(type), getValue(taskNumber)]
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
    const solver = await import(solverPath)

    if (!solver) throw new Error('No solver for the task')

    return solver
  } catch (e) {
    throw new Error(`Error while executing solver - ${e.message}`)
  }
}

try {
  const [type, task] = getArguments()

  const data = await getTaskData(task, type)
  const solvers = await getSolver(task)

  const results = solveTask(data, solvers)

  displayResults(results)
} catch (e) {
  console.error(e)
}
