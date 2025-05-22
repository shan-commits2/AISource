const chatArea = document.getElementById('chatArea');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const loadingBarContainer = document.getElementById('loadingBarContainer');

const tabsContainer = document.getElementById('tabsContainer');
const newChatBtn = document.getElementById('newChatBtn');

let chats = []; // { id, title, messages: [{sender, text}] }
let activeChatId = null;

// UTILITIES

function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>"']/g, function(m) {
    switch(m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
    }
  });
}

function parseFormatting(text) {
  text = text.replace(/```([\s\S]+?)```/g, (m, p1) => {
    return `<span class="code">${escapeHtml(p1)}</span>`;
  });
  text = text.replace(/\*\*(.+?)\*\*/g, (m, p1) => {
    return `<span class="bold">${escapeHtml(p1)}</span>`;
  });
  return text;
}

// CHAT MANAGEMENT

function saveChats() {
  localStorage.setItem('chatTabs', JSON.stringify(chats));
  localStorage.setItem('activeChatId', activeChatId);
}

function loadChats() {
  const saved = localStorage.getItem('chatTabs');
  const savedActive = localStorage.getItem('activeChatId');

  if (saved) {
    chats = JSON.parse(saved);
    activeChatId = savedActive || (chats.length ? chats[0].id : null);
  } else {
    // Init default chat
    chats = [{ id: generateId(), title: "New Chat", messages: [] }];
    activeChatId = chats[0].id;
  }
}

function generateId() {
  return 'chat-' + Math.random().toString(36).substr(2, 9);
}

function renderTabs() {
  tabsContainer.innerHTML = '';
  chats.forEach(chat => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (chat.id === activeChatId ? ' active' : '');
    tab.textContent = chat.title;
    tab.title = chat.title;

    // Close button for tabs except first one
    if (chats.length > 1) {
      const closeBtn = document.createElement('span');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = e => {
        e.stopPropagation();
        deleteChat(chat.id);
      };
      tab.appendChild(closeBtn);
    }

    tab.onclick = () => {
      if (chat.id !== activeChatId) {
        activeChatId = chat.id;
        renderTabs();
        renderChatArea();
        saveChats();
      }
    };

    tabsContainer.appendChild(tab);
  });
}

function deleteChat(id) {
  const index = chats.findIndex(c => c.id === id);
  if (index === -1) return;
  chats.splice(index, 1);

  // If deleted active chat, switch to another
  if (id === activeChatId) {
    activeChatId = chats.length ? chats[0].id : null;
  }

  renderTabs();
  renderChatArea();
  saveChats();
}

function renderChatArea() {
  chatArea.innerHTML = '';
  if (!activeChatId) return;

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  chat.messages.forEach(({sender, text}) => {
    addMessage(sender, text, false);
  });
}

function addMessage(sender, text, save = true) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.innerHTML = parseFormatting(text);
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;

  if (save && activeChatId) {
    const chat = chats.find(c => c.id === activeChatId);
    chat.messages.push({ sender, text });
    saveChats();
  }
}

function setLoading(isLoading) {
  input.disabled = isLoading;
  sendBtn.disabled = isLoading;
  loadingBarContainer.style.display = isLoading ? 'block' : 'none';
}

async function send() {
  let text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  input.value = '';
  setLoading(true);

  try {
    const botReply = await askGemini(text);
    addMessage('bot', botReply);
  } catch (e) {
    addMessage('bot', '[Error]: ' + e.message);
  }

  setLoading(false);
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!input.disabled) send();
  }
});

async function askGemini(prompt) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_API_HERE', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  console.log("Gemini API Response:", data);

  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].content.parts[0].text;
  } else if (data.error) {
    return `[Error]: ${data.error.message}`;
  } else {
    return '[Error]: No valid response from Gemini.';
  }
}

newChatBtn.onclick = () => {
  const newChat = {
    id: generateId(),
    title: `Chat ${chats.length + 1}`,
    messages: []
  };
  chats.push(newChat);
  activeChatId = newChat.id;
  renderTabs();
  renderChatArea();
  saveChats();
};

loadChats();
renderTabs();
renderChatArea();
