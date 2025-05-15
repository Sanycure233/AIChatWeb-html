const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const headMap = new Map();
const token = cookieGetByKey("token"); // 获取 Token
headMap.set("token", token)
//token 验证
document.addEventListener("DOMContentLoaded", function () {
  if (!token) {
    window.location.href = "login.html";
  } else {
    ajaxCustom('GET', '', null, headMap, (responseJson) => {
      console.log(responseJson)
      console.log('token=', token)
      if (responseJson.code != '200') {
        window.location.href = "login.html";
      }
    })
  }
});

// 获取个人信息并渲染
const userID = cookieGetByKey("userID");
let avatarUrl;
let aiAvatarUrl;
ajaxCustom('GET', `chat/getUserMessage/${userID}`, null
  , headMap
  , (responseJson) => {
    const userMsg = responseJson.data;
    console.log("userMsg.avatar=", userMsg.avatar)
    avatarUrl = userMsg.avatar;
    aiAvatarUrl = userMsg.aiAvatar;
    // 个人信息渲染
    document.querySelector('.section-user .avatar').style.backgroundImage = `url(${userMsg.avatar})`;
    document.querySelector('.user-name').innerHTML = `ID:${userMsg.name}`;
    if (userMsg.vip == '1') {
      document.querySelector('.user-vip-0').classList.add('user-vip-1');
    }
    document.querySelector('.user-count').innerHTML = `${userMsg.count}`;
    document.querySelector('.user-message-count').innerHTML = `剩余对话次数：${userMsg.messageCount}`
  })
//渲染历史对话
ajaxCustom('GET', `chat/getConversations/${userID}`, null, headMap, (responseJson) => {
  let sessionIds = responseJson.data;
  for (let i = 0; i < sessionIds.length; i++) {
    let historyCoversation = document.getElementById("history-conversation");
    historyCoversation.appendChild(createConversationItem("AI", "对话", sessionIds[i]));
  }
})

//更换头像功能实现

function openModal() {
  document.getElementById('modalMask').style.display = 'flex';

  // 绑定图片选择事件
  document.getElementById('previewArea').addEventListener('click', () => {
    document.getElementById('avatar-input').click();
  });

  // 预览图片
  document.getElementById('avatar-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const preview = document.getElementById('previewArea');
      preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;"/>`;
    }

    reader.readAsDataURL(file);
  });
}

function closeModal() {
  document.getElementById('modalMask').style.display = 'none';
}

async function uploadAvatar() {
  const fileInput = document.getElementById('avatar-input');
  const file = fileInput.files[0];

  if (!file) {
    alert('请先选择图片');
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userID', cookieGetByKey('userID'));
  // 替换为你的上传接口
  ajaxCustomFile("chat/update/useravatar", formData, headMap, (responseJson) => {
    if (responseJson.code === "200") {
      alert('上传成功！');
      closeModal();
    } else {
      alert('上传失败，请重试');
    }
  })
}
// 点击遮罩层关闭窗口
document.getElementById('modalMask').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalMask')) {
    closeModal();
  }
});


//自定义性格功能实现
const customAi = document.getElementById('custom-ai');
const customForm = document.getElementById('custom-form');
const closeBtn = document.getElementById('closeBtn');
const submitForm = document.getElementById('submitForm');
customAi.addEventListener('click', () => {
  customForm.style.display = 'block';
})
closeBtn.addEventListener('click', () => {
  customForm.style.display = 'none';
});
// 表单提交处理
customForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.set("userID", cookieGetByKey('userID'))
  ajaxCustomFile(`chat/update/aidescription`, formData
    , headMap
    , (responseJson) => {
      console.log(responseJson)
    })
})

// 添加对话功能
document.getElementById("add-conversation").addEventListener('click', () => {
  // 当对话超过三个时禁止添加
  ajaxCustom('GET', `chat/getConversationsNumber/${userID}`, null, headMap, (responseJson) => {
    if (responseJson.data >= 3) {
      alert("已达到最大对话数上限");
      return;
    } else {
      //获取新的sessionId
      ajaxCustom('GET', `chat/insertConversation/${cookieGetByKey("userID")}`, null, headMap, (responseJson) => {
        const sessionId = responseJson.data;
        let historyCoversation = document.getElementById("history-conversation");
        historyCoversation.appendChild(createConversationItem("AI", "对话", sessionId));
      })
    }
  })
})

function createConversationItem(title, desc, sessionId) {
  // 创建外层容器
  const container = document.createElement("div");
  container.className = "history-child";
  container.dataset.sessionId = sessionId;
  container.addEventListener("click", () => {
    //先展示输入框
    document.querySelector(".input-container").style.display = "block";

    cookieAdd('sessionId', sessionId)
    let containers = document.querySelectorAll('.history-child');
    containers.forEach(element => {
      element.style.backgroundColor = 'whitesmoke';
    });
    event.currentTarget.style.backgroundColor = 'rgb(0, 162, 255)'
    deleteConversation();
    showConversation(userID, container.dataset.sessionId);
  })

  // 创建头像
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.backgroundImage = `url(${aiAvatarUrl})`;
  container.appendChild(avatar);

  // 创建描述区域
  const descWrapper = document.createElement("div");
  descWrapper.className = "description";

  const aiName = document.createElement("div");
  aiName.className = "ai-name";
  aiName.textContent = title; // 动态标题
  descWrapper.appendChild(aiName);

  const aiDesc = document.createElement("div");
  aiDesc.className = "ai-description";
  aiDesc.textContent = desc; // 动态描述
  descWrapper.appendChild(aiDesc);
  container.appendChild(descWrapper);

  // 创建删除按钮
  const deleteBtn = document.createElement("div");
  deleteBtn.className = "delete-conversation";
  deleteBtn.textContent = "—";
  deleteBtn.addEventListener("click", () => {
    ajaxCustom("GET", `chat/conversation/delete/${sessionId}`, null, headMap, (responseJson) => {
      if (responseJson.code === '200')
        alert("删除成功")
    })
    container.remove(); // 点击删除
  });

  container.appendChild(deleteBtn);

  return container;
}

// 对话功能实现

//删除对话
function deleteConversation() {
  let messages = document.querySelectorAll('.message')
  messages.forEach((message) => {
    message.remove();
  })
}

//通过userId和sessionId获取展示对话
function showConversation(userId, sessionId) {
  ajaxCustom("GET", `chat/getConversationList/${userId}/${sessionId}`, null, headMap, (responseJson) => {
    let messages = responseJson.data;
    messages.forEach((message) => {
      addMessage(message.content, message.senderRole);
    })
  })
}

//  处理回车键
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
// 发送消息
function addMessage(content, type) {
  // 对话展示
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type === 'user' ? 'user-message' : ''}`;
  // 头像
  const role = document.createElement('div');
  if (type === 'user') {
    role.className = `role user-role`;
    role.style.backgroundImage = `url(${avatarUrl})`
  } else {
    role.className = `role ai-role`;
    role.style.backgroundImage = `url(${aiAvatarUrl})`
  }

  // 内容
  const contentDiv = document.createElement('div');
  contentDiv.className = 'content'

  const contentRoleName = document.createElement('div');
  contentRoleName.className = `role-name`;
  contentRoleName.textContent = `${type == 'user' ? '你' : 'AI'}`

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
  ajaxCustom('GET', `chat/getUserMessage/${userID}`, null
    , headMap
    , (responseJson) => {
      const messageCount = responseJson.data.messageCount
      if (messageCount <= 0) {
        alert("对话次数不足");
      } else {
        addMessage(prompt, 'user');
        userInput.value = '';
        const dataMap = new Map();
        dataMap.set('prompt', prompt);
        dataMap.set('sessionId', cookieGetByKey('sessionId'));
        dataMap.set('userId', cookieGetByKey('userID'));
        headMap.set('token', cookieGetByKey('token'))
        ajaxCustom('POST', 'chat/sendMessage', dataMap, headMap, (responseJson) => {
          addMessage(responseJson.data, 'ai')
        })
        document.querySelector('.user-message-count').innerHTML = `剩余对话次数：${responseJson.data.messageCount - 1}`
      }
    })
}

//开通VIP
// 弹窗控制
function getVIP() {
  const modal = document.getElementById('activationModal');
  modal.style.display = "block";
  document.getElementById('activationCode').focus(); // 自动聚焦输入框
}

// 关闭弹窗逻辑
document.querySelector('.close-vip').onclick = function () {
  document.getElementById('activationModal').style.display = "none";
}

window.onclick = function (event) {
  if (event.target == document.getElementById('activationModal')) {
    document.getElementById('activationModal').style.display = "none";
  }
}

// 验证函数（需要接入实际验证接口）
function validateCode() {
  const code = document.getElementById('activationCode').value.trim();
  const errorElement = document.getElementById('errorMsg');

  if (!code) {
    errorElement.textContent = "请输入激活码";
    return;
  }

  // 这里可以接入实际验证接口
  if (code === "SanyQAQ") { // 示例验证
    ajaxCustom("GET", `chat/getvip/${userID}`, null, headMap, (responseJson) => {
      alert("激活成功！欢迎加入VIP！");
      document.getElementById('activationModal').style.display = "none";
      addMessageCount(userID);
    })
  } else {
    errorElement.textContent = "激活码无效，请重新输入";
  }
}

//添加次数
function addMessageCount(userId){
  ajaxCustom("GET",`chat/addMessageCount/${userId}`,null,headMap,(responseJson)=>{
    console.log("添加次数成功")
  })
}

// 回车键支持
document.getElementById('activationCode').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') validateCode();
});

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