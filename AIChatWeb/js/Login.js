let switchCtn = document.querySelector("#switch-ctn");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

// 定义一个操作Cookie的方法,后面的是默认参数，如果不输入就是默认值
function cookieAdd(key, value, expiresInDays = 1, path = '/') {
  const date = new Date();
  date.setTime(date.getTime() + (expiresInDays * 24 * 60 * 60 * 1000)); // 设置过期时间
  const expires = "expires=" + date.toUTCString(); // 转换为 UTC 格式
  document.cookie = `${key}=${value}; ${expires}; path=${path};`;
  console.log(`Cookie Added: ${key}=${value}`);
}

// 删除 Cookie
function cookieDelete(path = '/') {
  // 通过设置过期时间为过去的时间来删除 Cookie
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

//阻止默认行为发生，比如页面跳转，或者表单提交刷新界面
let getButtons = (e) => e.preventDefault();

let changeForm = (e) => {
  switchCtn.classList.toggle("is-txr");
  switchC1.classList.toggle("is-hidden");
  switchC2.classList.toggle("is-hidden");

  aContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-z");
}

let shell = (e) => {
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", getButtons);
  }
  for (var i = 0; i < switchBtn.length; i++) {
    switchBtn[i].addEventListener("click", changeForm);
  }
}
window.addEventListener("load", shell)

// 实现登录跳转功能
const xhr = new XMLHttpRequest();
const urlPre = "http://localhost:8080/"

document.querySelector("#b-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  xhr.open("POST", urlPre + "login", true);
  xhr.setRequestHeader("Content-Type", "application/json")
  // 处理响应
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        responseJson = JSON.parse(xhr.responseText)
        if (responseJson.code === '200') {
          // //将用户信息存放进浏览器本地存储中
          // localStorage.setItem('userMsg', responseJson)
          console.log(responseJson)

          //这里有点问题
          cookieAdd('token', responseJson.token);
          alert("登录成功")
          window.location.href = "ChatIndex.html"
        } else {
          alert(responseJson.msg);
          document.querySelector("#b-form").reset();
        }
      } else {
        console.error('请求失败:', xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify({
    count: formData.get("count"),
    password: formData.get("password")
  }))

});

//注册功能实现
document.querySelector("#a-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  xhr.open("POST", urlPre + "register", true);
  xhr.setRequestHeader("Content-Type", "application/json")
  // 处理响应
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        responseJson = JSON.parse(xhr.responseText)
        if (responseJson.code === '200') {
          alert("注册成功")
          window.location.href = "Login.html"
        } else {
          alert(responseJson.msg);
          document.querySelector("#a-form").reset();
        }
      } else {
        console.error('请求失败:', xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify({
    name: formData.get("name"),
    count: formData.get("count"),
    password: formData.get("password")
  }))

});
