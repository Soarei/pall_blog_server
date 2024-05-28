var express = require('express')
const resJson = require('../../utils/logFun')
const { sequelize } = require('../../models/init')
const moment = require('moment')
const router = express.Router()
const PALL_SYSTEM_ROLE = require('../../models/pall_system_role/pall_system_role')
const PALL_SYSTEM_ROLE_USER = require('../../models/pall_system_role_user/pall_system_role_user')
const PALL_SYSTEM_ROLE_MENU = require('../../models/pall_system_role_menu/pall_system_role_menu')
const Pall_Blog = require('../../models/pall_user/pall_user')
const PALL_USER = require('../../models/pall_user/pall_user')
router.post('/rolelist', async (req, res) => {
  /*
    先查询用户表 根据用户表id去查询用户角色表 查询对应的角色信息

  */
  const { page, size } = req.body
  let sql = `select * from pall_system_roles order by id desc limit ${page - 1},${size}`
  let count = 'select count(*) from  pall_system_roles'
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  let obj = { rows: list, count: total[0]['count(*)'] }
  if (list) {
    return resJson(req, res, 5200, obj, 'Success!')
  }
  return resJson(req, res, 5500, null, 'System Error')
})

router.post('/userlist', async (req, res) => {
  var { page, size, user_account } = req.body
  let sql = `select *, (select group_concat(sr.name) from pall_system_role_users sur,pall_system_roles sr 
  where sur.user_id = ssu.user_id AND sur.role_id = sr.id ) roles from pall_users ssu where concat(ssu.user_name, ssu.user_account) like concat('%',"${user_account}",'%') ORDER BY ssu.user_id DESC LIMIT ${page - 1},${size}`
  let count = 'select count(*) from  pall_users'
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  if (list) {
    let obj = { rows: list, count: total[0]['count(*)'] }
    return resJson(req, res, 5200, obj, 'Success!')
  }
  return resJson(req, res, 5500, null, 'System Error')
})

// 添加角色
router.post('/addroles', async (req, res) => {
  const { name, code } = req.body
  /* 
    1:判断角色名是否存在,判断用户标识是否存在
  */
  const model = await PALL_SYSTEM_ROLE.findOne({ where: { name } })
  const codeModal = await PALL_SYSTEM_ROLE.findOne({ where: { code } })
  if (model) {
    return resJson(req, res, 5500, null, '角色名称已存在')
  }
  if (codeModal) {
    return resJson(req, res, 5500, null, '角色标识已存在')
  }
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const update_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const result = await PALL_SYSTEM_ROLE.create({
    name,
    code,
    create_time,
    update_time
  })
  if (result) {
    return resJson(req, res, 5200, [], '创建角色成功')
  } else {
    return resJson(req, res, 5500, null, '创建角色失败')
  }


})
// 更新角色
router.post('/editroles', async (req, res) => {
  const { name, code, id } = req.body
  const update_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const result = await PALL_SYSTEM_ROLE.update({
    name,
    code,
    update_time,
  }, { where: { id } })
  if (result) {
    return resJson(req, res, 5200, [], '更新角色成功')
  } else {
    return resJson(req, res, 5500, null, '更新角色失败')
  }
})
// 删除角色
router.post('/deleteroles', async (req, res) => {
  const { id } = req.body
  const result = await PALL_SYSTEM_ROLE.destroy({ where: { id } })
  if (result === 1) {
    return resJson(req, res, 5200, [], '删除角色成功')
  }
  return resJson(req, res, 5500, null, '删除角色失败')
})
// 冻结管理员账户
router.post('/frozen', async (req, res) => {
  const { user_id, status } = req.body
  const result = await Pall_Blog.update({ status }, { where: { user_id } })
  if (result[0] < 0) {
    return resJson(req, res, 5500, null, '更新状态失败')
  }
  return resJson(req, res, 5200, null, '更新成功')
})
// 查看角色ID
router.post('/distribu', async (req, res) => {
  const { user_id } = req.body
  let sql = `select GROUP_CONCAT(sru.role_id) roleIds from pall_system_role_users sru WHERE user_id = ${user_id}`
  const result = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  if (result) {
    return resJson(req, res, 5200, result[0], 'Success')
  }
  return resJson(req, res, 5500, null, 'System Error')
})
// 获取角色包含的菜单信息
router.post('/authmenus', async (req, res) => {
  const { id } = req.body
  let sql = `select *, (select group_concat(sm.id) from pall_system_role_menus srm,pall_system_menus sm  where srm.role_id = sr.id AND srm.menu_id = sm.id ) menus from pall_system_roles sr where sr.id = ${id}`
  const result = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  if (result) {
    return resJson(req, res, 5200, result[0], 'Success')
  }
  return resJson(req, res, 5500, null, '失败')
})
//分配角色
router.post('/distribute', async (req, res) => {
  const { roleIds, userId } = req.body
  try {
    const user = await PALL_USER.findByPk(userId)
    if (!user) {
      throw new Error('未找到该用户')
    }
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    const update_time = moment().format('YYYY-MM-DD HH:mm:ss')
    const userRoles = roleIds.map(roleIds => (
      {
        id: 3,
        user_id: userId,
        create_time,
        update_time,
        role_id: roleIds
      }
    ))
    await PALL_SYSTEM_ROLE_USER.bulkCreate({ userRoles, updateOnDuplicate: true })
    // const result = await PALL_SYSTEM_ROLE_USER.update({

    // })
  } catch (error) {
    console.log(error);
  }
  // let {roleIds, userId } = await PALL_SYSTEM_ROLE.update({
  //   where: {
  //     user_id: userId
  //   }
  // })
})
// 更新管理员角色
router.post('/updateuserroles', async (req, res) => {
  const { list } = req.body
  // 先删除用户角色表的数据
  const result = await PALL_SYSTEM_ROLE_MENU.destroy({
    where: { role_id: roleId }
  })
  let temp = []
  for (let i = 0; i < list.length; i++) {
    const obj = {
      user_id: user_id,
      menu_id: list[i]
    }
    temp.push(obj)
  }
  const saveResult = await PALL_SYSTEM_ROLE_MENU.bulkCreate(temp, {
    updateOnDuplicate: ['role_id', 'menu_id']
  })
})

// 更新角色菜单
router.post('/updateroles', async (req, res) => {
  const { list, roleId } = req.body
  /*
    1.删除角色权限表中role_id = 1 的全部数据
    2.将获取的数据全部更新到角色权限表中
    3.over
  */
  const result = await PALL_SYSTEM_ROLE_MENU.destroy({
    where: { role_id: roleId }
  })
  let temp = []
  for (let i = 0; i < list.length; i++) {
    const obj = {
      role_id: roleId,
      menu_id: list[i]
    }
    temp.push(obj)
  }
  const saveResult = await PALL_SYSTEM_ROLE_MENU.bulkCreate(temp, {
    updateOnDuplicate: ['role_id', 'menu_id']
  })
  if (saveResult) {
    return resJson(req, res, 5200, null, '更新权限成功')
  }
  return resJson(req, res, 5500, null, '更新权限失败')
})


module.exports = router