const { get } = require('axios')

const page = async (url) => {
  const result = await get(url)
  const data = result.data

  return data
}

module.exports = page