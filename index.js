import * as fs from 'fs/promises'
import * as readline from 'node:readline/promises'
import {stdin as input, stdout as output} from 'node:process'

const rl = readline.createInterface({input, output})
const PROMPT_QUESTION = 'Number of AC task: '

async function listenForTask() {
  const task = await rl.question(PROMPT_QUESTION)

  const data = await getTaskData(task)
  const solvers = await getSolver(task)

  const results = solveTask(data, solvers)

  displayResults(results)
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


while (true) {
  try {
    await listenForTask()
  } catch (e) {
    console.error(e)
  }
}

async function getTaskData(taskNumber) {
  try {
    const path = `./data/${taskNumber}.txt`
    return await fs.readFile(path, {encoding: 'utf-8'})
  } catch (e) {
    throw new Error('No data for this task')
  }
}


async function getSolver(taskNumber) {
  try {
    const solverPath = `./${taskNumber}.js`
    const solver = await import(solverPath)

    if (!solver) throw new Error('No solver for the task')

    return solver
  } catch (e) {
    throw new Error(`Error while executing solver - ${e.message}`)
  }
}
