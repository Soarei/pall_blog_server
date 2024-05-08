var express = require('express')
const PALL_CATEGORY = require('../../models/pall_category/pall_category')
// 引入生成和验证token的类
const resJson = require('../../utils/logFun')
const router = express.Router()
const moment = require('moment')
router.post('/list', async (req, res) => {
  const { page, size } = req.body
  const list = await PALL_CATEGORY.findAndCountAll({
    where: {},
    offset: (page - 1) * size,
    limit: size
  }).catch((err) => {
    console.log(err);
  })
  return resJson(req, res, 5200, list, 'Success')
})

router.post('/add', async (req, res) => {
  const { catgory_name, catgory_icon, catgory_rank } = req.body
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const result = await PALL_CATEGORY.findOne(({ where: { catgory_name } }))
  if (result) {
    return resJson(req, res, 5500, null, '分类已经存在')
  }
  await PALL_CATEGORY.create({ catgory_name, catgory_icon, catgory_rank, create_time })
  return resJson(req, res, 5200, [], '添加成功')
})

router.post('/edit', async (req, res) => {
  const { catgory_name, catgory_icon, catgory_rank, catgory_id } = req.body
  const update_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const result = await PALL_CATEGORY.update({ catgory_name, catgory_icon, catgory_rank, update_time }, {
    where: { catgory_id }
  })
  try {
    if (result[0] < 0) return resJson(req, res, 5500, null, error)
    return resJson(req, res, 5200, null, '修改成功')
  } catch (error) {
    throw error
  }
})
router.post('/del', async (req, res) => {
  const { catgory_id } = req.body
  const result = await PALL_CATEGORY.destroy({
    where: { catgory_id }
  })
  if (result == 1) return resJson(req, res, 5200, [], '删除成功')
})

module.exports = router