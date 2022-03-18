const simpleGit = require('simple-git')
const gitDiffParser = require('gitdiff-parser')
const {versionValid, getVersionChange} = require('./utils')

const git = simpleGit()

async function main(){
	const diffText = await git.diff(['HEAD~1', 'HEAD'])
	const diffFiles = gitDiffParser.parse(diffText)

	for(let file of diffFiles){
		if(file.type !== 'modify') continue
		if(file.newPath === 'tieba-maverick.user.css'){

			let changes = file.hunks.map(hunk=>hunk.changes).flat()
			let {oldVer,newVer} = getVersionChange(changes)

			if(oldVer !== newVer && versionValid(newVer)){
				git.addTag(`ver.${newVer}`)
				git.pushTags()
			}

			return
		}
	}
}

main()