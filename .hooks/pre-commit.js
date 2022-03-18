const simpleGit = require('simple-git')
const gitDiffParser = require('gitdiff-parser')
const {versionValid, compareVersion, getVersionChange} = require('./utils')

const git = simpleGit()

const pass = ()=>process.exit(0)
const exception = (err)=>{
	console.log(err)
	process.exit(1)
}

async function main(){
	const diffText = await git.diff(['HEAD'])
	const diffFiles = gitDiffParser.parse(diffText)
	const errors = []

	for(let file of diffFiles){
		if(file.type !== 'modify') continue
		if(!file.oldPath.endsWith('.user.css')) continue

		let filePath = file.newPath

		let changes = file.hunks.map(hunk=>hunk.changes).flat()

		let {oldVer,newVer} = getVersionChange(changes)

		let cmp = compareVersion(newVer, oldVer)

		if(!cmp){
			errors.push(`${filePath} 发生了改动且未修改版本号`)
			continue
		}

		if(!versionValid(newVer)){
			errors.push(`${filePath} 定义了无效的版本号: ${newVer}`)
			continue
		}

		if(cmp<0){
			errors.push(`${filePath} 定义了更低的版本号: ${oldVer} ——> ${newVer}`)
			continue
		}
	}

	errors.length ? exception(errors.join('\n')) : pass()
}

main()