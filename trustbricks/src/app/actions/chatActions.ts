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
  
  // Gemini API strictly requires the conversation history to start with a 'user' message.
  // If the frontend passes the bot's initial greeting, we need to remove it.
  const filteredHistory = [...history];
  while (filteredHistory.length > 0 && filteredHistory[0].role === "model") {
    filteredHistory.shift();
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: filteredHistory,
          systemInstruction: {
            parts: [{
              text: "You are Ada, a premium, professional mortgage and customer support advisor for TrustBricks Properties. " +
                    "Your primary goal is to help Nigerian professionals unlock up to 25% of their Retirement Savings Account (RSA) for home equity contributions under the Nigerian Pension Mortgage Scheme. " +
                    "You do NOT search the outside web. You strictly rely on the following internal database and PFA rules to answer questions:\n\n" +
                    "### TRUSTBRICKS INTERNAL DATABASE:\n" +
                    "- **Supported PFAs and their Minimum RSA Balance Requirements:**\n" +
                    "  * Stanbic IBTC Nominees: ₦5,000,000\n" +
                    "  * GT Pension: ₦1,000,000\n" +
                    "  * Citizens Pensions (Tier 1): ₦500,000\n" +
                    "  * Citizens Pensions (Tier 2): ₦200,000\n" +
                    "  * Trustfund Pensions, NUPEMCO, Tangerine APT, Norrenberger, NLPC Pensions, Premium Pensions, AccessARM Pensions, Leadway Pensure, Oak Pensions: All require ₦500,000 minimum balance.\n" +
                    "- **General Requirements:** Users must have a verifiable RSA balance. The maximum allowed for withdrawal is 25% of their RSA balance towards their home equity.\n" +
                    "- **Our Role:** We simplify the verification, banking matches, and PFA approvals.\n\n" +
                    "Keep your responses very concise (1-3 sentences max), highly polite, and strictly grounded in this database. " +
                    "If a user asks something not covered in this database, politely inform them you don't have that information but can connect them to a human agent. " +
                    "At the end of your response, if relevant or after 2-3 messages, suggest they can transition to WhatsApp to talk to a live officer by clicking the button below."
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
