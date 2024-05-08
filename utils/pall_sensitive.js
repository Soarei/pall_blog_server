
class Sensiteive {
  // data从敏感词表中获取的数据,value是用户传来的敏感词
  constructor(data, value) {
    this.data = data
    this.value = value
  }
  /**
    * @description
    * 构造敏感词map
    * @parma sensitiveWordList array  自定义的敏感词数组
    */
  makeSensitiveMap() {
    const sensitiveWordList = this.data
    const result = new Map();
    for (const word of sensitiveWordList) {
      let map = result;
      for (let i = 0; i < word.length; i++) {
        // 依次获取字
        const char = word.charAt(i);
        // 判断是否存在
        if (map.get(char)) {
          // 获取下一层节点
          map = map.get(char);
        } else {
          // 将当前节点设置为非结尾节点
          if (map.get('laster') === true) {
            map.set('laster', false);
          }
          const item = new Map();
          // 新增节点默认为结尾节点
          item.set('laster', true);
          map.set(char, item);
          map = map.get(char);
        }
      }

    }
    return result;
  }
  /**
  * @description
  * 检验敏感词
  * @parma sensitiveWordList array  返回敏感词语句
  */
  checkSensitiveWord() {
    let sensitiveMap = this.makeSensitiveMap()
    const value = this.value
    let flag = false
    let num = 0 //记录含有敏感词的个数
    let senstiveString = '' // 记录包含哪些敏感词
    for (let i = 0; i < value.length; i++) {
      const word = value[i];
      sensitiveMap = sensitiveMap.get(word)
      if (sensitiveMap) {
        num++
        senstiveString += word
        if (sensitiveMap.get("laster")) {
          flag = true
          break;
        }
      } else {
        break;
      }
      console.log(num);
      // 判断敏感词的位数大于两位 则敏感词成立
      flag = num < 2 ? false : true
    }
    return { flag, senstiveString }
  }
}

module.exports = Sensiteive