'use server';

export async function sendMessageToGemini(history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable.");
    return { 
      success: false, 
      text: "I'm having a configuration issue. Would you like to transition to WhatsApp to talk to our human agents directly?" 
    };
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: history,
          systemInstruction: {
            parts: [{
              text: "You are Ada, a premium, professional mortgage advisor for TrustBricks Properties. " +
                    "We help Nigerian professionals use up to 25% of their Retirement Savings Account (RSA) as equity contribution to own a home under the Nigerian Pension Mortgage Scheme. " +
                    "Keep your responses concise (1-3 sentences max), highly polite, and professional. " +
                    "Refer to PenCom guidelines where appropriate. " +
                    "At the end of your response, if relevant or after 3 messages, suggest they can transition to WhatsApp to talk to a live officer by clicking the button."
            }]
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[GEMINI ERROR]", errText);
      return { 
        success: false, 
        text: "I'm having a brief connection issue. Would you like to transition to WhatsApp to talk to our human agents directly?" 
      };
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'd love to help you with that. Let's get you connected with a human agent on WhatsApp to discuss details!";
    
    return { success: true, text: replyText };
  } catch (error) {
    console.error("[GEMINI CATCH ERROR]", error);
    return { 
      success: false, 
      text: "Connection lost. Let's move this chat to WhatsApp where our team can assist you immediately!" 
    };
  }
}
