import ajax from '../../libs/Ajax'

export default {
  // 查询节点
  queryMsgType (params) {
    return ajax.get(`/svr/msgtype/queryMsgType`, { params: params })
  },
  // 保存节点数据
  saveMsgType (data) {
    return ajax.post(`/svr/msgtype/saveMsgType`, data)
  },
  // 删除节点数据
  delMsgType (uuid) {
    return ajax.delete(`/svr/msgtype/delMsgType`, { params: { uuid: uuid } })
  }
}
