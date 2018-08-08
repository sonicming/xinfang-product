import querystring from "querystring";
import moment from "moment";
import config from "../resources/config";

//  文件下载
const downFileIframe = function(url, params) {
  const id = "iframe_to_download_file_hidden";
  let fullURL = url + "?" + querystring.stringify(params);
  let iframe = document.getElementById(id);
  if (iframe === null) {
    iframe = document.createElement("iframe");
  }
  iframe.id = id;
  iframe.src = fullURL;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    document.body.removeChild(iframe);
  };
};

/**
 * 数据安全处理
 */
const safety = {
  // 防止非法数据
  safeData(data) {
    if (typeof data !== "object") {
      return;
    }

    if (data) {
      //  过滤非法数据
      delete data.opDesc;
      delete data.opUuid;
      delete data.crUserUuid;
      delete data.crTime;
      delete data.opUserUuid;
      delete data.opUserName;
      delete data.opUserName;
      delete data.opTime;

      for (let key in data) {
        //  字符串去掉空白
        if (typeof data[key] === "string") {
          data[key] = data[key].trim();
        }

        //  过滤 空字符串 和null 不传递
        if (key === "uuid") {
          // uuid不能穿 空白等
          if (
            data[key] === "" ||
            data[key] == null ||
            data[key] === undefined
          ) {
            delete data[key];
          }
        }

        // 处理日期类型
        if (moment.isDate(data[key])) {
          data[key] = moment(data[key]).format("x");
        }
      }
    }
    return data;
  },
  // 递归预处理数据提交
  preSubmit(data) {
    this.safeData(data);
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === "object") {
          data[key] = this.preSubmit(data[key]);
        }
      }
    }
    return data;
  }
};

export default { downFileIframe, safety };
