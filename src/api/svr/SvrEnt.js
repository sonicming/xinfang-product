import ajax from '../../libs/Ajax'

export default {
  // 查询数据列表
  queryEnt (params) {
    return ajax.get('/svr/ent/queryEnt', {
      params: params
    })
  },

  // 保存数据
  saveEnt (Ent) {
    return ajax.post('/svr/ent/saveEnt', Ent)
  },

  // 删除数据
  delEnt (uuid) {
    return ajax.delete('/svr/ent/delEnt', { params: { uuid: uuid } })
  },

  // 获取一条数据记录
  getEnt (uuid) {
    return ajax.get('/svr/ent/getEnt', { params: { uuid: uuid } })
  },

  // 获取下拉框数据
  queryEntSelect (params) {
    return ajax.get('/svr/ent/queryEntSelect', { params: params })
  }
}
