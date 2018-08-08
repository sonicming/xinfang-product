import ajax from '../../libs/Ajax'

export default {
  // 查询数据列表
  queryDxp (params) {
    return ajax.get('/svr/dxp/queryDxp', {
      params: params
    })
  },

  // 保存数据
  saveDxp (Dxp) {
    return ajax.post('/svr/dxp/saveDxp', Dxp)
  },

  // 删除数据
  delDxp (uuid) {
    return ajax.delete('/svr/dxp/delDxp', { params: { uuid: uuid } })
  },

  // 获取一条数据记录
  getDxp (uuid) {
    return ajax.get('/svr/dxp/getDxp', { params: { uuid: uuid } })
  }
}
