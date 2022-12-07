function prepareData(data) {
	return data.split(/\r\n/).filter(Boolean).reverse()
}

const COMMAND_MARKER = '$ '

function isCommand(str) {
	if (!str) return false
	return str.startsWith(COMMAND_MARKER)
}

const paths = {
	root: '/',
	up: '..'
}

const types = {
	directory: 'dir',
	file: 'file'
}

const commands = {
	cd: 'cd',
	ls: 'ls'
}

class FileTree {
	root = new Dir(paths.root)
	currentRoot = this.root


	addNode(node) {
		node.root = this.currentRoot
		this.currentRoot.children.push(node)
	}

	search(predicate) {
		const result = []

		const seen = new Set()
		const queue = [this.root]

		while (queue.length) {
			const node = queue.shift()

			if (seen.has(node)) continue;
			seen.add(node)

			if (node.type === types.directory) {
				queue.push(...node.children)
			}

			if (predicate(node)) result.push(node)
		}

		return result;
	}

	goUp() {
		this.currentRoot = this.currentRoot.root || this.root
	}

	goRoot() {
		this.currentRoot = this.root
	}

	goToChild(name) {
		this.currentRoot = this.currentRoot.getNode(name)
	}

	printTree() {
		const logs = this.root.display()
		console.log(logs.join('\n'))
	}

}

class Node {
	constructor(name, type, root) {
		this.name = name
		this.type = type
		this.root = root
	}

	getSize() {
		return 0
	}

	display() {
		return [`${this.name}`]
	}
}

function createNode(line) {
	const tokens = line.split(' ')

	if (tokens[0] === types.directory) {
		const name = tokens[1]
		return new Dir(name)
	}

	const [size, name] = tokens
	return new File(name, size)
}

class Dir extends Node {
	constructor(name, root = null, children = []) {
		super(name, types.directory, root);
		this.children = children
	}

	getSize() {
		return this.children.reduce((size, currentNode) => size + currentNode.getSize(), 0)
	}

	getNode(name) {
		return this.children.find(node => node.name === name)
	}

	display() {
		const dirLine = `- ${this.name} (dir)`
		const children = this.children.map(child => child.display()).flat(1).map(child => `  ${child}`)

		return [dirLine, ...children]
	}
}

class File extends Node {
	constructor(name, size, root = null) {
		super(name, types.file, root)
		this.size = size
	}

	getSize() {
		return Number(this.size);
	}

	display() {
		return [`- ${this.name} (file, size = ${this.getSize()})`]
	}
}

function parseTree(input) {
	const tree = new FileTree()

	const commandsExecution = {
		[commands.cd]: (tree, path) => {
			switch (path) {
				case paths.root:
					return tree.goRoot();
				case paths.up:
					return tree.goUp();
				default:
					return tree.goToChild(path);
			}
		},
		[commands.ls]: (tree, input) => {
			while (input.length && !isCommand(input.at(-1))) {
				const line = input.pop()
				const node = createNode(line)

				tree.addNode(node)
			}
		}
	}

	function getCdPath(line) {
		return line.split(' ')[2]
	}

	function parseCommand(line) {
		return line.split(' ')[1]
	}

	function getCommandArgs(command, line) {
		switch (command) {
			case commands.cd:
				return [tree, getCdPath(line)]
			case commands.ls:
				return [tree, input]
			default:
				console.error(`Invalid command type - ${command}`)
		}
	}

	while (input.length > 0) {
		const line = input.pop()

		const type = parseCommand(line)
		const args = getCommandArgs(type, line)

		commandsExecution[type](...args)
	}

	return tree
}

const lessThen100K = (node) => {
	if (node.type !== types.directory) return false;
	return node.getSize() < 100000
}


function solveTask(data) {
	const input = prepareData(data)

	const tree = parseTree(input)
	const dirs = tree.search(lessThen100K)

	return dirs.reduce((size, current) => size + current.getSize(), 0)
}

const TOTAL_DISK_SPACE = 70_000_000
const NEEDED_DISK_SPACE = 30_000_000

function moreThan(size) {
	return (node) => {
		if (node.type !== types.directory) return false;
		return node.getSize() >= size;
	}
}

function solveExtended(data) {
	const input = prepareData(data)

	const tree = parseTree(input)

	const totalUsedDiskSpace = tree.root.getSize()
	const neededDirectorySize = Math.abs(TOTAL_DISK_SPACE - NEEDED_DISK_SPACE - totalUsedDiskSpace)

	const dirs = tree.search(moreThan(neededDirectorySize))

	dirs.sort((a, z) => a.getSize() - z.getSize())
	return dirs[0].getSize()
}

export {
	solveTask,
	solveExtended
}
