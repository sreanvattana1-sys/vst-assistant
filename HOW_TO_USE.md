# 🚀 VST Assistant — គម្រោង Web App ពេញលេញ

---

## 📂 ទីតាំងគម្រោងលើម៉ាស៊ីនបង៖
👉 **`D:\vst-assistant`**

---

## 🛠️ រចនាសម្ព័ន្ធ Folder (Project Structure):

```text
D:\vst-assistant\
├── .env.local             <-- File រក្សាទុក Gemini API Key & Webhook Token
├── package.json           <-- បញ្ជី dependencies គម្រោង
├── public\
│   └── vst-logo.jpg       <-- រូបភាព Logo VST Assistant ពិតប្រាកដ
├── src\
│   ├── app\
│   │   ├── api\
│   │   │   ├── ai-chat\   <-- API Backend ភ្ជាប់ Google Gemini 3.5 AI
│   │   │   └── webhook\   <-- API Facebook Webhook Receiver (Verify & Events)
│   │   ├── globals.css    <-- Styling & Google Fonts Noto Sans Khmer
│   │   ├── layout.tsx     <-- Root Layout & Metadata
│   │   └── page.tsx       <-- ផ្ទាំង Dashboard, Bot Settings & Floating Chatbot
│   └── lib\
│       └── facebook.ts    <-- Meta Graph API Client (Comment Reply & Send DM)
└── README.md              <-- ឯកសារណែនាំការប្រើប្រាស់
```

---

## ⚡ របៀបដំណើរការលើកុំព្យូទ័រ (Local Run):

១. បើកកម្មវិធី **Terminal** ឬ **Command Prompt** (ឬ PowerShell)
២. ចូលទៅកាន់ Folder គម្រោង៖
```bash
cd D:\vst-assistant
```
៣. ដំឡើង packages (ប្រសិនបើបើកលើម៉ាស៊ីនថ្មី)៖
```bash
npm install
```
៤. ដំណើរការ Server៖
```bash
npm run dev
```
៥. បើក Browser ចូលមើល៖ 👉 **[http://localhost:3000](http://localhost:3000)**
