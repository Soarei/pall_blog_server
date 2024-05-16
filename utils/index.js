
// 取值uuid后位数

const formatUUIDV4 = (subfix, str) => {
  console.log(str);
  return subfix + (str ? str.slice(-6) : '')
}

module.exports = {
  formatUUIDV4
}