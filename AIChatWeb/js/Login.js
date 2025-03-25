let switchCtn = document.querySelector("#switch-ctn");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

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
document.querySelector("#b-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  let dataMap = new Map();
  dataMap.set("count", formData.get("count"))
  dataMap.set("password", formData.get("password"))
  // 处理响应
  ajaxCustom('POST', 'login', dataMap, null, (responseJson) => {
    if (responseJson.code === '200') {
      // //将用户信息存放进浏览器本地存储中
      // localStorage.setItem('userMsg', responseJson)
      //加问号防止data为空报错
      cookieAdd('token', String(responseJson.data?.token));
      alert("登录成功")
      window.location.href = "ChatIndex.html"
    } else {
      alert(responseJson.msg);
      document.querySelector("#b-form").reset();
    }
  })
});

//注册功能实现
document.querySelector("#a-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  let dataMap = new Map();
  dataMap.set("name", formData.get("name"))
  dataMap.set("count", formData.get("count"))
  dataMap.set("password", formData.get("password"))
  // 处理响应
  ajaxCustom('POST', 'register', dataMap, null, (responseJson) => {
    if (responseJson.code === '200') {
      alert("注册成功")
      window.location.href = "Login.html"
    } else {
      alert(responseJson.msg);
      document.querySelector("#a-form").reset();
    }
  });
});
