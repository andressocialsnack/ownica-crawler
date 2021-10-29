const meta = ($, name='description') => {
  const selector = `meta[name="${name}"]`
  const desc = $(selector).attr('content')
  return desc
}

module.exports = meta