import ajax from '../../libs/Ajax'

export default {
  // 保存数据
  saveSvrMaint (SvrMaint) {
    return ajax.post('/svr/maint/saveSvrMaint', SvrMaint)
  },
  // 查询
  querySvrMaint (params) {
    return ajax.get(`/svr/maint/querySvrMaint`, { params })
  },
  //  // 查询一条数据
  getSvrMaint (uuid) {
    return ajax.get(`/svr/maint/getSvrMaint`, { params: { uuid } })
  },
  // 删除数据
  delSvrMaint (uuid) {
    return ajax.delete(`/svr/maint/delSvrMaint`, { params: { uuid } })
  }
}
