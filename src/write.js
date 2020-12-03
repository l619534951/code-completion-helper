const fs = require('fs')
const path = require('path')

function ensureDirectoryExists (filePath) {
  const folderPath = path.resolve(path.dirname(filePath))
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
}

function writeJsonFile (obj, file) {
  ensureDirectoryExists(file)
  const stream = fs.createWriteStream(file)

  stream.once('open', () => {
    stream.write(JSON.stringify(obj, null, 2))
    stream.end()
  })
}

module.exports = { writeJsonFile }
