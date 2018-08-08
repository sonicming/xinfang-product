import ajax from "@/libs/Ajax";
import CacheStores from "@/service/module/CacheStores";

export default {
  /**
   * 获取字典表数据,返回的数据经过包装,只适用于下拉选择,通常会缓存到本地存储
   * @param {String} codeType  字典类型
   * @param {Boolean } force  强制刷新,不经过缓存
   */
  getAllCodes(codeType, force) {
    return ajax
      .get(`/base/code/getAllCodes`, {
        force,
        cache: codeType,
        cacheStore: CacheStores.codeListStore,
        params: { codeType }
      })
      .then(data => data || [])
      .then(data => {
        let wrapData = [];
        for (let dataProp in data) {
          let oneData = data[dataProp];
          let key = oneData.codekey;
          let label = oneData.codeval;
          let value = oneData.codekey;
          let wrapValue = { label, key, value };
          wrapData.push(wrapValue);
          // 这里放个map 快速取值用
        }
        return wrapData;
      });
  },

  /**
   * 查询字典树,懒加载
   * @param {String} treeKey  查询的树类型
   * @param {String} pid  父节点ID
   * @param {String} keyword  搜索关键字
   * @param {String} field  查询搜索字段
   * @param {Boolean } force  强制刷新,不经过缓存
   */
  getTree(treeKey, pid, keyword, field, force) {
    if (keyword) {
      return ajax
        .get(`/base/tree/getTreeMatchingNodes`, {
          cache: treeKey,
          force,
          cacheStore: CacheStores.codeTreeStore,
          params: { treeKey, fieldKey: field, keyWordKey: keyword }
        })
        .then(data => data || []);
    } else {
      return ajax
        .get(`/base/tree/getTreeNodes`, {
          cache: treeKey,
          force,
          cacheStore: CacheStores.codeTreeStore,
          params: { treeKey, pid, lazy: true }
        })
        .then(data => data || []);
    }
  },
  /**
   * 查询对应的数据选择器数据
   * @param {String} dataType  数据类型
   * @param {Object} params  查询参数
   */
  querySelectorData(dataType, params) {
    return ajax
      .get(`/base/select/${dataType}`, { params, cache: false })
      .then(data => data || []);
  }
};
