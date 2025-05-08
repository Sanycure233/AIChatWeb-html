const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const dataMap=new Map();
const headMap=new Map();

//token 验证
document.addEventListener("DOMContentLoaded", function () {
  const token = cookieGetByKey("token"); // 获取 Token
  if (!token) {
    window.location.href = "login.html";
  } else {
    ajaxCustom('GET', '', null, new Map().set("token", token), (responseJson) => {
      console.log(responseJson)
      console.log('token=',token)
      if (responseJson.code != '200') {
        window.location.href = "login.html";
      }
    })
  }
});

// 获取个人信息并渲染
const userMsg = JSON.parse(localStorage.getItem('userMsg'));
document.querySelector('.user-name').innerHTML=`ID:${userMsg.name}`;
if(userMsg.vip=='1'){
  document.querySelector('.user-vip-0').classList.add('user-vip-1');
}
// 对话功能实现

//  处理回车键
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function addMessage(content, type) {
  // 对话展示
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type === 'user' ? 'user-message' : ''}`;
  // 头像
  const role = document.createElement('div');
  role.className = `role ${type === 'user' ? 'user-role' : 'ai-role'}`;
  // 内容
  const contentDiv = document.createElement('div');
  contentDiv.className = 'content'

  const contentRoleName = document.createElement('div');
  contentRoleName.className = `role-name`;
  contentRoleName.textContent = `${type == 'user' ? '你' : '栗子'}`

  const contentP = document.createElement('p');
  contentP.textContent = content;

  contentDiv.appendChild(contentRoleName);
  contentDiv.appendChild(contentP);
  messageDiv.appendChild(role);
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);

  // 滚动到底部
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
async function sendMessage() {
  const prompt = userInput.value;
  if (!prompt) return;
  addMessage(prompt, 'user');
  userInput.value = '';
  dataMap.set('prompt',prompt);
  dataMap.set('sessionID','1');
  headMap.set('token',cookieGetByKey('token'))
  ajaxCustom('POST','chat/stream/history',dataMap,headMap,(responseJson)=>{
    addMessage(responseJson.data,'ai')
  })
}

// 主题切换功能

// 获取已有的所有主题
const themes = document.querySelectorAll('.section-function .theme');

//设置更换主题的方法
function swichTheme(themeColor) {
  document.querySelector('body').dataset.theme = themeColor;
}

//添加监听
themes.forEach(theme => {
  theme.addEventListener('click', (e) => {
    const color = theme.getAttribute('data-theme');
    this.swichTheme(color);
  })
})

// 退出登录功能
document.querySelector(".log-out").addEventListener("click", () => {
  window.location.href = "Login.html";
  cookieDelete();
})