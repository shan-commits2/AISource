const chatArea = document.getElementById('chatArea');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const loadingBarContainer = document.getElementById('loadingBarContainer');

function parseFormatting(text) {
  text = text.replace(/```([\s\S]+?)```/g, (m, p1) => {
    return `<span class="code">${escapeHtml(p1)}</span>`;
  });
  text = text.replace(/\*\*(.+?)\*\*/g, (m, p1) => {
    return `<span class="bold">${escapeHtml(p1)}</span>`;
  });
  return text;
}

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

function addMessage(sender, text, save = true) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.innerHTML = parseFormatting(text);
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  
  if (save) {
    saveChat();
  }
}

function saveChat() {
  const messages = [];
  chatArea.querySelectorAll('.message').forEach(msgDiv => {
    const sender = msgDiv.classList.contains('user') ? 'user' : 'bot';
    const text = msgDiv.textContent || '';
    messages.push({ sender, text });
  });
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadChat() {
  const saved = localStorage.getItem('chatMessages');
  if (!saved) return;
  
  const messages = JSON.parse(saved);
  messages.forEach(({sender, text}) => {
    addMessage(sender, text, false);
  });
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

function setLoading(isLoading) {
  input.disabled = isLoading;
  sendBtn.disabled = isLoading;
  loadingBarContainer.style.display = isLoading ? 'block' : 'none';
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!input.disabled) send();
  }
});

async function askGemini(prompt) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCFjDmsbbVMA4rQhIiJVuTOYYDajIpIA2w', {
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

loadChat();
