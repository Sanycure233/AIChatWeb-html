// 定义一个操作Cookie的方法,后面的是默认参数，如果不输入就是默认值
function cookieAdd(key, value, expiresInDays = 1, path = '/') {
  const date = new Date();
  date.setTime(date.getTime() + (expiresInDays * 24 * 60 * 60 * 1000)); // 设置过期时间
  const expires = "expires=" + date.toUTCString(); // 转换为 UTC 格式
  document.cookie = `${key}=${value}; ${expires}; path=${path};`;
  console.log(`Cookie Added: ${key}=${value}`);
}

// 删除 Cookie
function cookieDelete(key='token',path = '/') {
  // 通过设置过期时间为过去的时间来删除 Cookie
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

// 通过key获取 Cookie
function cookieGetByKey(key) {
  const cookieArray = document.cookie.split('; ');
  for (let i = 0; i < cookieArray.length; i++) {
    const map = cookieArray[i].split('=');
    if (map[0] === key) {
      return map[1]
    }
  }
  return null;  // 如果没有找到指定的 Cookie，返回 null
}

// 前端向后端发送请求的方法

const urlPrefix = "http://localhost:8080/"
function ajaxCustom(method
  , urlSuffix
  , dataMap
  , headMap
  // 传入一个回调函数防止异步请求拿不到数据
  , callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, urlPrefix + urlSuffix, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText)
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error('请求失败:', xhr.status);
      }
    }
  };
  if (headMap && headMap.has("token")) {
    xhr.setRequestHeader("token", headMap.get("token"));
  }
  //设置请求体为Json
  if (method === 'POST') {
    console.log("发送了POST请求")
    xhr.setRequestHeader("Content-Type", "application/json")
    // 将 Map 转换为对象
    const obj = Object.fromEntries(dataMap);
    // 将对象转换为 JSON 字符串
    const jsonString = JSON.stringify(obj);
    xhr.send(jsonString)
    console.log(jsonString)
  } else {
    console.log(`发送了${method}请求`)
    xhr.send()
  }
}
// 传输文件
function ajaxCustomFile(urlSuffix
  , formData
  , headMap
  // 传入一个回调函数防止异步请求拿不到数据
  , callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', urlPrefix + urlSuffix, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText)
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error('请求失败:', xhr.status);
      }
    }
  };
  if (headMap && headMap.has("token")) {
    xhr.setRequestHeader("token", headMap.get("token"));
  }
  //设置请求体为Json
    xhr.send(formData);
}