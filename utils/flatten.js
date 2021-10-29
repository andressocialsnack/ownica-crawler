const flatten = (arr) => 
  arr.reduce((agg, item) => 
    agg.concat(Array.isArray(item) ?  
      flatten(item) : 
      item
    ), []
  )

module.exports = flatten