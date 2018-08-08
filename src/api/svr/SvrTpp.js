import ajax from '../../libs/Ajax'

export default {
  // 查询列表
  queryTpp (params) {
    return ajax.get('/svr/tpp/queryTpp', { params: params })
  },
  // 保存数据
  saveTpp (data) {
    return ajax.post('/svr/tpp/saveTpp', data)
  },
  // 删除数据
  delTpp (uuid) {
    return ajax.delete('/svr/tpp/delTpp', { params: { uuid: uuid } })
  },
  // 获取一条数据
  getTpp (uuid) {
    return ajax.get('/svr/tpp/getTpp', { params: { uuid: uuid } })
  },
  // 获取下拉框数据
  queryTppSelect (params) {
    return ajax.get('/svr/tpp/queryTppSelect', { params: params })
  }
}
