const toggleBtn = document.getElementById("toggleChatbot");
const chatbot = document.getElementById("chatbot-container");
const closeBtn = document.getElementById("closeChatbot");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

// 🔑 OpenRouter API Key
const OPENROUTER_API_KEY =
  "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"; // Replace with your actual key

toggleBtn.onclick = () => {
  chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
  chatbot.style.flexDirection = "column";
};

closeBtn.onclick = () => {
  chatbot.style.display = "none";
};

userInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const userText = userInput.value.trim();
    if (userText) {
      appendMessage("You", userText);
      userInput.value = "";

      const botReply = await getBotReply(userText);
      appendMessage("Assistant of Hardik", botReply);
    }
  }
});

function appendMessage(sender, text) {
  const message = document.createElement("div");
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  message.classList.add("animate-fadeIn");
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 🌐 OpenRouter Chat API
async function getBotReply(message) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful and professional AI assistant developed and trained by Hardik Thakor, a passionate full stack developer from Ahmedabad, India. 
Hardik is a continuous learner, tech enthusiast, and AI explorer who enjoys building innovative solutions. He is currently studying at GLS University, Ahmedabad.

Always communicate with clarity, respect, and professionalism. Your goal is to assist general visitors, collaborators, or recruiters in learning about Hardik’s work, skills, and projects.

Hardik's technical expertise includes Python, React, SQL, C, C++, Java, and full stack web development.

His key projects include:
- MockMateAI: An AI-powered interview system that generates smart questions, conducts interviews, provides scores out of 10, and delivers AI-driven feedback.
- A weather detection system using sensors and machine learning.
- A radar-based system for environmental data tracking and automation.

Only mention these projects if a user asks about them. Do not engage in topics unrelated to Hardik, such as photography or personal matters.

If someone asks about unrelated topics, politely respond:
"I'm here to assist you with information about Hardik Thakor’s work and projects. Feel free to ask anything tech-related!"

If someone greets you (e.g., "hi"), reply with a friendly greeting. If someone says goodbye, respond warmly and respectfully. 

Avoid answering anything not related to Hardik Thakor. Stay focused, friendly, and accurate.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("🧠 API Raw Response:", JSON.stringify(data, null, 2));
    const reply =
      data.choices?.[0]?.message?.content || "Sorry, I didn't understand that.";
    return reply;
  } catch (error) {
    console.error("API Error:", error);
    return "Oops! Something went wrong while talking to OpenRouter.";
  }
}
