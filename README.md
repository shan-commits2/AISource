# CoreAI

CoreAI is an open-source AI project that leverages the Gemini API to provide powerful AI functionalities. This project is designed to be easy to set up and customize so you can integrate advanced AI features into your own applications.

---

## Features

- Lightweight AI powered by Gemini API
- Simple JavaScript interface for making AI requests
- Fully customizable by replacing your Gemini API key

---

## Getting Started

Follow the steps below to get CoreAI up and running:

### 1. Create a Gemini API Key

1. Go to the [Gemini API website](https://developers.gemini.com)  
2. Sign up for a free account or log in if you already have one  
3. Navigate to your account dashboard and find the **API Keys** section  
4. Create a new API key  
5. Copy the generated API key — you will need it in the next steps

### 2. Configure CoreAI

1. Open the project folder on your computer  
2. Open the `script.js` file with a text editor (like VS Code, Notepad++, or even a simple text editor)  
3. Find the function or variable called `AskGemini`  
4. Replace the placeholder text `"YOUR_GEMINI_API_HERE"` with the API key you copied earlier. It should look something like this:

``js
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_API_HERE;``
