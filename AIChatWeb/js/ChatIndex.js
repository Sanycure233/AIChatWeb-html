const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');


//token 验证
// 通过key获取 Cookie
function cookieGetByKey(key) {
  const name = `${key}=`;
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    const map = cookieArray[i].split('=');
    if (map[0] === key) {
      return map[1];
    }
  }
  return null;  // 如果没有找到指定的 Cookie，返回 null
}

document.addEventListener("DOMContentLoaded", function () {
  const token = cookieGetByKey("token"); // 获取 Token
  if (!token) {
    // 如果没有 Token，跳转到登录页，并记录当前 URL
    window.location.href = "login.html";
  } else {
    console.log("用户已登录，允许访问");
  }
});
// 对话功能实现

// 处理回车键
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
  role.className = `role ${type === 'user' ? '' : 'ai-role'}`;
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

  axios({
    url: 'http://localhost:8080/chat/stream/history',
    method: 'get',
    params: {
      prompt: `${prompt}`,
      sessionID: `1`
    }
  }).then(res => {
    addMessage(res.data, 'ai');
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
})