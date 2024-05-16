var express = require('express')
const PALL_TASK = require('../../models/pall_task/pall_task')
// 引入生成和验证token的类
const resJson = require('../../utils/logFun')
const router = express.Router()
// 获取任务列表
router.post('/list', async (req, res) => {
  console.log(req);
  const { page, size } = req.body
  const list = await PALL_TASK.findAll({
    where: {},
    offset: (page - 1) * size,
    limit: size
  }).catch((err) => {
    console.log(err);
  })
  return resJson(req, res, 5200, list, '成功')
})

// 添加任务
router.post('/addtask', async (req, res) => {
  console.log(req.body);
  const { taskname } = req.body
  console.log(taskname);
  const result = await PALL_TASK.create({
    taskname
  })
  console.log(result);
})
// 用户日志 (包含用户行为)



module.exports = router