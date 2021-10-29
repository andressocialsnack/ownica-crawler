const regex = new RegExp(/\(([^)]+)\)/)

const extract = (text) => {
  const results = regex.exec(text)
  if(results) {
    return results[1]
  }

  return ''
}

module.exports = extract