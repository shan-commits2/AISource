# CoreAI

CoreAI is an open-source AI assistant powered by the [Google Gemini API](https://aistudio.google.com/app/apikey). This lightweight AI interface is built with HTML, CSS, and JavaScript, allowing you to send prompts and receive AI-generated responses right in your browser.

---

## 🚀 Features

- Uses Google's Gemini 2.0 Flash model
- Simple browser-based interface
- 100% client-side — no backend required
- Easy to set up with your own API key

---

## 🔧 How to Set It Up

Follow these steps to get CoreAI working with your own Gemini API key:

### 1. Get Your Gemini API Key

1. Go to the official Gemini API key page:  
   👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Log in** or **Sign up** with your Google account  
3. Click on **"Create API Key"** under the "API Keys" section  
4. **Copy** the newly created key

---

### 2. Plug Your API Key into the Code

1. Open the project folder (e.g. `CoreAI`)  
2. Open the `script.js` file in a text editor  
3. Find this line:

```js
const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_API_HERE');
