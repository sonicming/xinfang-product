import ajax from '../../libs/Ajax'

export default {
  // 查询
  initlist (params) {
    return ajax.get(`/svr/client/queryList`, { params: params })
  },
  // 保存客户端数据
  saveClient (data) {
    return ajax.post(`/svr/client/saveClient`, data)
  },
  //  // 查询一条数据
  getClient (uuid) {
    return ajax.get(`/svr/client/getClient`, { params: { uuid: uuid } })
  },
  // 保存客户端数据
  deleteClient (uuid) {
    return ajax.delete(`/svr/client/deleteClient`, { params: { uuid: uuid } })
  }
}
