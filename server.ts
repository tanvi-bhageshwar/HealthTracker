import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or uses placeholder. AI features will run in Demo/Rule-based mode.");
      return null;
    }
    try {
      aiInstance = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
      return null;
    }
  }
  return aiInstance;
}

// ------------------- API ROUTES -------------------

// 1. Chatbot API endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getAI();
  if (!ai) {
    // Elegant fallback simulation
    const msgLower = message.toLowerCase();
    let reply = "I am currently in Demo Mode. To activate my full Gemini intelligence, please add a valid GEMINI_API_KEY in the AI Studio Settings.";
    if (msgLower.includes("water")) {
      reply = "Staying hydrated is crucial! Generally, it is recommended to drink between 2 to 3 liters of water per day. For active workouts, aim for an extra 500ml for every 30 minutes of exercise.";
    } else if (msgLower.includes("protein")) {
      reply = "Excellent question! High-quality protein sources include lean meats, poultry, eggs, seafood, dairy (cottage cheese, Greek yogurt), and plant-based alternatives like lentils, tofu, quinoa, and chickpeas. Try to aim for 1.2 to 2.0g of protein per kg of body weight.";
    } else if (msgLower.includes("bmi")) {
      reply = "Body Mass Index (BMI) evaluates weight relative to height. Under 18.5 is Underweight, 18.5 - 24.9 is Normal, 25 - 29.9 is Overweight, and 30+ is Obese. Let me know your height and weight if you want tips on reaching a balanced BMI!";
    } else if (msgLower.includes("calorie") || msgLower.includes("deficit")) {
      reply = "For weight loss, a safe and sustainable calorie deficit of 300-500 kcal below your Total Daily Energy Expenditure (TDEE) is usually ideal. Prioritize volume-dense, low-calorie foods like green vegetables and lean proteins to feel full!";
    } else if (msgLower.includes("breakfast")) {
      reply = "A healthy breakfast sets the tone for the day! Consider oats topped with chia seeds and berries, scrambled eggs with spinach and whole-wheat toast, or a high-protein fruit smoothie.";
    }
    return res.json({ text: reply, isDemo: true });
  }

  try {
    // Prime the model as a strict nutrition coach in general
    const systemInstruction = 
      "You are a professional, motivating, and scientifically-grounded Nutrition & Health Coach. " +
      "You are the central AI of a 3rd-year final year college project called the 'Community Health & Nutrition Tracker'. " +
      "Provide short, actionable, and structured advice on diet, hydration, water intake, BMI, physical activities, and wellness. " +
      "Keep answers clean, using bullet points where appropriate, and always encourage healthy choices.";

    // Convert history format if present, otherwise call generateContent directly
    // Using gemini-3.5-flash as specified in guidelines for basic text tasks
    const prompt = `${systemInstruction}\n\nUser: ${message}`;
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = result.text || "I apologize, I processed your query but could not construct a text response.";
    res.json({ text: responseText, isDemo: false });
  } catch (error: any) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ 
      error: "Error processing your request with the AI model.", 
      details: error.message 
    });
  }
});

// 2. Meal Planner AI Generator
app.post("/api/generate-meal-plan", async (req, res) => {
  const { calories, preference, age, gender, height, weight } = req.body;
  
  const targetCalories = calories || 2000;
  const dietPref = preference || "Balanced";

  const ai = getAI();
  if (!ai) {
    // Provide a robust static fallback plan
    const fallbackPlan = {
      breakfast: "Double-protein berry smoothie with chia seeds, banana, and Greek yogurt (approx. 450 kcal)",
      lunch: "Mediterranean grilled chicken bowl with brown rice, cherry tomatoes, sliced cucumbers, and tzatziki (approx. 650 kcal)",
      snack: "Slices of medium apple with 2 tablespoons of natural almond butter (approx. 250 kcal)",
      dinner: "Pan-seared lemon-herb salmon with roasted sweet potatoes and asparagus (approx. 550 kcal)",
      summary: {
        calories: targetCalories,
        protein: Math.round(targetCalories * 0.045),
        carbs: Math.round(targetCalories * 0.11),
        fats: Math.round(targetCalories * 0.028)
      }
    };
    return res.json({ plan: fallbackPlan, isDemo: true });
  }

  try {
    const prompt = 
      `Act as a clinical sports dietician. Generate a detailed, highly nutritious 1-day meal plan targeting exactly ${targetCalories} calories with a preference for a '${dietPref}' diet. ` +
      `User attributes: Gender=${gender || "not specified"}, Age=${age || "not specified"}, Height=${height || "not specified"}cm, Weight=${weight || "not specified"}kg. ` +
      `You MUST output your response strictly as a single JSON object. Do not include any markdown format tags like \`\`\`json or \`\`\` around it. ` +
      `The JSON structure must match this scheme exactly: ` +
      `{
        "breakfast": "Description of breakfast including ingredients and estimated calories",
        "lunch": "Description of lunch including ingredients and estimated calories",
        "snack": "Description of evening snack including ingredients and estimated calories",
        "dinner": "Description of dinner including ingredients and estimated calories",
        "summary": {
          "calories": ${targetCalories},
          "protein": number,
          "carbs": number,
          "fats": number
        }
      }`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let rawText = result.text || "";
    // Clean up any potential markdown wrapper in case model ignored instruction
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    const planData = JSON.parse(rawText);
    res.json({ plan: planData, isDemo: false });
  } catch (error: any) {
    console.error("Meal planner generation failed:", error);
    // In case of any error (or JSON parsing error), serve the fallback nicely
    const fallbackPlan = {
      breakfast: "Classic oatmeal with berries, dynamic mix of seeds, and a glass of soy/skimmed milk (approx. 400 kcal)",
      lunch: "Power quinoa salad with diced avocado, grilled tofu/chicken, chickpeas, and lemon vinaigrette (approx. 600 kcal)",
      snack: "A handful of mixed raw walnuts and 1 orange (approx. 200 kcal)",
      dinner: "Stir-fried ginger turkey/paneer with green beans, broccoli, and jasmine rice (approx. 500 kcal)",
      summary: {
        calories: targetCalories,
        protein: 85,
        carbs: 220,
        fats: 55
      }
    };
    res.json({ plan: fallbackPlan, isDemo: true, note: "Fell back to templates due to parse warning." });
  }
});

// ------------------- VITE OR STATIC MIDDLEWARE -------------------

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static files serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully booted and listening at http://localhost:${PORT}`);
  });
}

setupServer();
