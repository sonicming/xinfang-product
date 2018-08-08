import ajax from '../../libs/Ajax'

export default {
  // 查询系统ic卡
  queryIccard (params) {
    return ajax.get(`/svr/iccard/queryIccard`, { params: params })
  },
  // 保存IC卡数据
  saveIccard (data) {
    return ajax.post(`/svr/iccard/saveIccard`, data)
  },
  // 查询一条用户
  getIccard (uuid) {
    return ajax.get(`/svr/iccard/getIccard`, { params: { uuid: uuid } })
  },
  // 保存IC卡数据
  deleteIccard (uuid) {
    return ajax.delete(`/svr/iccard/deleteIccard`, { params: { uuid: uuid } })
  }
}
