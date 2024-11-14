var express = require('express')
const PALL_NOTICE = require('../../models/pall_notice/pall_notice')
const PALL_COURSE = require('../../models/pall_course/pall_course')
const PALL_VOICE = require('../../models/pall_voice/pall_voice')
const PALL_COLLECTION = require('../../models/pall_collection/pall_collection')
const resJson = require('../../utils/logFun')
const { sequelize } = require('../../models/init')
const { literal, Op } = require('sequelize')
const axios = require('axios')
const uuid = require('uuid')
const moment = require('moment')
// 引入playwright库
const { chromium } = require('playwright')
let config = {
  method: 'post',
  url: `https://www.trans-home.com/api/index/translate?token=aN3ESDGxeVHe4UHerwpo`,
  headers: {
    'Authorization': 'Bearer;' + 'AFsZrl8CIIQSFGD0uUO8FW6127T7hAMx',
    'Resource-Id': 'volc.tts_async.default'
  },
  data: {
    keywords: '',
    sourceLanguage: 'zh-cn',
    targetLanguage: 'en'
  }
}
const router = express.Router()
// 公告信息相关接口
router.post('/noticeList', async (req, res) => {
  const { page, size } = req.body
  let sql = `select * from pall_notices order by id desc limit ${page - 1},${size}`
  let count = `select count(*) from pall_notices`
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  if (list) {
    return resJson(req, res, 5200, { list, total: total[0]['count(*)'] }, 'Success')
  }
})

// 添加公告信息
router.post('/insertNotice', async (req, res) => {
  const { content, startTime, endTime, status } = req.body
  const result = await PALL_NOTICE.create({ content, startTime, endTime, status })
  if (result) {
    return resJson(req, res, 5200, [], '添加成功')
  }
})
// 编辑公告接口
router.post('/updateNotice', async (req, res) => {
  const { content, startTime, endTime, status, id } = req.body
  const result = await PALL_NOTICE.update({ content, startTime, endTime, status }, { where: { id } })
  if (result) {
    return resJson(req, res, 5200, [], '更新成功')
  } else {
    return resJson(req, res, 5500, null, 'System Error')
  }
})
// 删除公告接口
router.post('/delNotice', async (req, res) => {
  const { id } = req.body
  const result = await PALL_NOTICE.destroy({
    where: { id }
  })
  if (result === 1) {
    return resJson(req, res, 5200, [], '删除成功')
  }
})
// 轮播图列表
router.get('/course/list', async (req, res) => {
  const { page, size } = req.query
  let sql = `select * from pall_courses order by id desc limit ${page - 1},${size}`
  let count = `select count(*) from pall_courses`
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  if (list) {
    return resJson(req, res, 5200, { list, total: total[0]['count(*)'] }, 'Success')
  }
})
// 更新轮播图
router.post('/course/update', async (req, res) => {
  const { title, picture, address, endTime, startTime, sort, enabled, id } = req.body
  const result = await PALL_COURSE.update({ title, picture, address, endTime, startTime, sort, enabled }, { where: { id } })
  if (result) {
    return resJson(req, res, 5200, [], '更新成功')
  }
})
// 添加轮播图
router.post('/course/insert', async (req, res) => {
  const { title, picture, address, endTime, startTime, sort, enabled } = req.body
  const result = await PALL_COURSE.create({ title, picture, address, endTime, startTime, sort, enabled })
  if (result) {
    return resJson(req, res, 5200, [], '添加成功')
  }
})

/*
 *@description:删除轮播图接口
 *@author: pf
 *@date: 2022-12-28 19:01:53
 *@version: V1.0.5
*/
router.post('/course/del', async (req, res) => {
  const { id } = req.body
  const result = await PALL_COURSE.destroy({ where: { id } })
  if (result) {
    return resJson(req, res, 5200, [], '删除成功')
  }
})

/*
 *@description:音频采集
 *@author: pf
 *@date: 2022-12-28 19:01:53
 *@version: V1.0.5
*/

router.post('/collect/video', async (req, res) => {
  let data = req.body
  data.reqid = uuid.v4()
  var config = {
    method: 'post',
    url: 'https://openspeech.bytedance.com/api/v1/tts_async/submit',
    headers: {
      'Authorization': 'Bearer;' + 'AFsZrl8CIIQSFGD0uUO8FW6127T7hAMx',
      'Content-Type': 'application/json',
      'Resource-Id': 'volc.tts_async.default'
    },
    data
  }
  const result = await axios(config)
  const paramsConfig = {
    method: 'get',
    url: `https://openspeech.bytedance.com/api/v1/tts_async/query`,
    headers: {
      'Authorization': 'Bearer;' + 'AFsZrl8CIIQSFGD0uUO8FW6127T7hAMx',
      'Resource-Id': 'volc.tts_async.default'
    },
    params: {
      appid: req.body.appid,
      task_id: result.data.task_id
    }
  }
  const timer = setInterval(async () => {
    const info = await axios(paramsConfig)
    if (info.data.task_status == 1) {
      clearInterval(timer)
      return resJson(req, res, 5200, info.data, 'success')
    }
  }, 1000)
})
/*
 *@description:音频管理
 *@author: pf
 *@date: 2022-12-28 19:01:53
 *@version: V1.0.5
*/
router.post('/voice/list', async (req, res) => {
  const { page, size } = req.body
  const list = await PALL_VOICE.findAndCountAll({
    where: {},
    offset: (page - 1) * size,
    limit: size
  }).catch((err) => {
    console.log(err);
  })
  return resJson(req, res, 5200, list, 'Success')
})
router.post('/voice/all', async (req, res) => {
  const list = await PALL_VOICE.findAll()
  return resJson(req, res, 5200, list, 'Success')
})
router.post('/voice/add', async (req, res) => {
  const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const result = await PALL_VOICE.create({ ...req.body, startTime })

  if (result) {
    return resJson(req, res, 5200, [], '添加成功')
  }
})
// 删除
router.post('/voice/del', async (req, res) => {
  const { id } = req.body
  const result = await PALL_VOICE.destroy({ where: { id } })
  if (result) {
    return resJson(req, res, 5200, [], '删除成功')
  }
})
/*-----------------------------自动化平台------------------------------ */
router.post('/collect/goodslist', async (req, res) => {
  const { page, size, goodsName, rangeTime } = req.body

  const list = await PALL_COLLECTION.findAndCountAll({
    where: {
      goodsName: {
        [Op.like]: `%${goodsName || ''}%`,
      }

    },
    offset: (page - 1) * size,
    limit: size,
    order: [['createTime', 'desc']]
  })
  return resJson(req, res, 5200, list, 'Success')
})
/*-----------------------------自动化平台-删除商品------------------------------ */
router.post('/collect/goods/delete', async (req, res) => {
  const { id } = req.body
  const info = await PALL_COLLECTION.destroy({
    where: { id }
  })
  return resJson(req, res, 5200, [], '删除成功')
})
// 执行采集
router.post('/collect/io', async (req, res) => {
  const config = {
    method: 'post',
    headers: {
      'Cookie': ''
    }
  }
})
// 采集商品入库
router.post('/collect/goods', async (req, res) => {
  const { keywords } = req.body
  // console.log(keywords);

  const waitTimeout = (deply) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('等待定时器执行...');
        resolve(6000)
      }, deply)
    })
  }
  // 自动化初始化
  const browser = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const context = await browser.newContext();
  const page = await context.newPage();
  // 访问登录页面
  await page.goto('https://www.1688.com');
  // await page.locator('._turboCom-dialog-close_sm0it_23').click(true)
  await waitTimeout(3000)
  await page.locator('.ali-search-input').nth(1).fill('袜子')
  await page.locator('.input-button').nth(1).click()
  // await page.locator('.search-offer-item').nth(1).click()
  // 等待页面加载完成
  await Promise.all([
    page.waitForNavigation({ timeout: 300000 }),
    // document.querySelectorAll('.search-offer-wrapper')[0].querySelector('a').click()
    page.locator('.search-offer-wrapper').nth(0).locator('a').click()
  ])

  await page.waitForNavigation({ waitUntil: 'load' })
  await page.content()
})
// 单个商品采集到tiktok
router.post('/collect/signgoods', async (req, res) => {

  const { url } = req.body
  const browser = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const context = await browser.newContext();
  const page = await context.newPage();
  // 访问登录页面
  await page.goto('https://erp.91miaoshou.com');
  // 填写登录信息
  await page.fill('.account-input', '15003847929');
  await page.fill('.password-input', 'wspf0514');
  await Promise.all([
    page.waitForNavigation({ timeout: 300000 }),
    page.click('.login-button'),
  ])
  await page.click('.footer .jx-button'),
    await page.click('.novice-guide-dialog .jx-dialog__headerbtn'),

    await page.click('#goods')
  // await page.goto('https://erp.91miaoshou.com/common_collect_box/index')
  await page.fill('.jx-textarea__inner', url)
  await page.click('.pop-footer .J_shopCollectCloseGuidanceTip')
  await page.click('.collect-button')
  await page.click('.footer-right .jx-button--default :nth-child(1)')
  await page.click('.jx-dialog__footer .jx-button--primary')
  await waitTimeout(6000)
  await page.click('.J_TikTok')
  await waitTimeout(12000)
  // 先点击全部
  await page.locator('.jx-radio-group .jx-radio-button').nth(0).click()
  await waitTimeout(3000)
  await page.click('.J_collectBoxEdit :nth-child(1)')
  // 翻译标题
  config.data.keywords = await page.locator('.product-title .el-input__inner').inputValue()
  console.log(config);

  const info = await axios(config)
  console.log(info.data.data.text);

  await page.locator('.product-title .el-input__inner').fill(info.data.data.text)
  // 是否选择类目
  if (await page.locator('.empty-cid-box').nth(0)) {
    await page.locator('.category-item-box .jx-pro-input').click()
    await page.locator('.category-history-list .category-item').nth(0).click()
    await page.locator('.el-message-box__wrapper .el-message-box__btns .el-button--primary').click()
  }
  // 点击sku
  await page.locator('.scroll-menu-nav__item').nth(2).click()
  await page.locator('.jx-pro-virtual-table .jx-pro-button--text').nth(2).click()
  //定价模版选择
  await page.locator('.jx-pro-radio').nth(0).click()
  // 选择下拉
  await page.locator('.price-template-select .jx-pro-select').click()
  // 选择定价
  await page.locator('.price-template-select-popover .el-select-dropdown__item').nth(1).click()
  // 确定
  await page.locator('.modify-footer .jx-pro-button').nth(5).click()
  // 保存并发布
  await page.locator('.edit-box-footer .jx-pro-button').nth(1).click()
  // 发布到选中店铺
  await waitTimeout(10000)
  await page.locator('text="我知道了"').nth(1).click()
  // await page.locator('.jx-pro-button--small').nth(51).click()
  await page.locator('text="可在这里查看新手指南哦~"').locator('i').click()
  await page.locator('text="发布到选中店铺"').click()

  // 关闭
  await page.locator('.el-message-box__btns .el-button').nth(1).click()

  // await page.click('.scroll-menu-nav__item :nth-child(2)')
  // await page.goto('https://erp.91miaoshou.com/common_collect_box/index')
  // 提交登录信息
  // await page.click('.logidialog__headerxn-button');
  // // 等待登录后的操作，比如页面跳转
  // await page.waitForNavigation({ timeout: 0 });
  // 关闭页面接受
  // await page.click('.jx-button')
  // 输出或保存登录后的页面内容


  console.log(await page.content());
})
// 添加商品入库
router.post('/receive/goods', async (req, res) => {
  const { goodsName, goodsPicture, collectUrl, status } = req.body
  const createTime = moment().format('YYYY-MM-DD HH:mm:ss')
  // 查看当前链接是否入库
  const isExist = await PALL_COLLECTION.findOne({
    where: {
      collectUrl: {
        [Op.eq]: collectUrl
      }
    }
  });
  if (!isExist) {
    await PALL_COLLECTION.create({
      goodsName,
      goodsPicture,
      collectUrl,
      createTime,
      status
    })
  }

  return resJson(req, res, 5200, [], '新增记录成功')
})
// 获取全部商品
router.post('/allgoods', async (req, res) => {
  const list = await PALL_COLLECTION.findAll()
  return resJson(req, res, 5200, list, '获取商品')
})
// 更新状态
router.post('/update/goods', async (req, res) => {
  const { collectUrl } = req.body
  try {
    await PALL_COLLECTION.update({
      status: '1'
    }, { where: { collectUrl } })
    return resJson(req, res, 5200, [], '更新成功')
  } catch (error) {
    return resJson(req, res, 5500, null, error)
  }
}

)
// 执行采集
module.exports = router