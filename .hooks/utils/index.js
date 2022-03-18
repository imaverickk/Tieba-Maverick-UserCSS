module.exports = {

	versionValid: ver=>/^\d+\.\d+$/.test(ver),

	compareVersion: require('./cmpver'),

	getVersionChange(changes){
		let result = {oldVer: '', newVer: ''}
		for(change of changes){
			let versionMatch = change.content.match(/^\s*@version\s+(\S*)\s*$/)
			if(!versionMatch) continue
	
			let ver = versionMatch[1]
			result[change.isDelete ? 'oldVer' : 'newVer'] = ver
		}
		return result
	}

}