// text1
function swapeButton() {
  console.log(1)
  let xhr = new XMLHttpRequest();
  // 配置AJAX请求：GET 请求从服务器获取数据
  xhr.open("GET", "http://localhost:8080/test/hello", true)
  // 当请求完成时触发
  xhr.onreadystatechange = function () {
    console.log(2)
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.responseText);
    }
  }
  //发送请求，当前理解就是执行xhr.onreadystatechange这个里面的函数
  xhr.send();
}