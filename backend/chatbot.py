"""
AgroGuard AI - Intelligent Farming Chatbot
Helps farmers with crop disease questions, treatment advice, and farming guidance
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

# Comprehensive farming knowledge base
DISEASE_KNOWLEDGE = {
    "tomato_early_blight": {
        "keywords": ["tomato", "early", "blight", "brown", "spots", "rings"],
        "description": "Early blight is a common fungal disease affecting tomatoes caused by Alternaria solani.",
        "symptoms": "Dark brown spots with concentric rings (target pattern) on lower leaves, yellowing around spots, leaf drop.",
        "causes": "High humidity, warm temperatures (24-29°C), poor air circulation, overhead watering.",
        "treatment": [
            "Apply copper-based fungicide every 7-10 days",
            "Remove and destroy infected leaves immediately",
            "Improve air circulation by proper spacing",
            "Avoid overhead watering - water at the base",
            "Apply mulch to prevent soil splash"
        ],
        "prevention": [
            "Use disease-resistant varieties",
            "Rotate crops (don't plant tomatoes in same spot for 3 years)",
            "Space plants properly for air circulation",
            "Remove plant debris at end of season",
            "Water in the morning to allow leaves to dry"
        ]
    },
    "tomato_late_blight": {
        "keywords": ["tomato", "late", "blight", "water", "soaked", "white", "mold"],
        "description": "Late blight is a devastating disease caused by Phytophthora infestans that can destroy entire crops quickly.",
        "symptoms": "Water-soaked dark lesions on leaves and stems, white mold on leaf undersides, rapid plant death.",
        "causes": "Cool, wet weather (15-25°C), high humidity, spreads rapidly by wind and rain.",
        "treatment": [
            "Apply chlorothalonil or mancozeb fungicide immediately",
            "Remove all infected plants and destroy (burn or bury)",
            "Do not compost infected plants",
            "Apply fungicide to nearby healthy plants preventatively"
        ],
        "prevention": [
            "Plant resistant varieties if available",
            "Avoid planting tomatoes near potatoes",
            "Ensure good air circulation",
            "Apply preventive fungicides in cool, wet weather",
            "Monitor plants daily during risky weather"
        ]
    },
    "potato_early_blight": {
        "keywords": ["potato", "early", "blight", "brown", "spots"],
        "description": "Early blight affects potato plants, reducing yield and quality.",
        "symptoms": "Brown circular spots with concentric rings on lower leaves, yellowing, premature leaf drop.",
        "causes": "Similar to tomato early blight - warm, humid conditions.",
        "treatment": [
            "Apply azoxystrobin or chlorothalonil fungicide",
            "Remove lower infected leaves",
            "Ensure adequate potassium fertilization",
            "Improve drainage"
        ],
        "prevention": [
            "Practice crop rotation (3-4 year cycle)",
            "Plant disease-free seed potatoes",
            "Maintain proper nutrition, especially potassium",
            "Avoid water stress"
        ]
    },
    "bacterial_spot": {
        "keywords": ["bacterial", "spot", "pepper", "tomato", "yellow", "halo"],
        "description": "Bacterial spot is caused by Xanthomonas bacteria affecting peppers and tomatoes.",
        "symptoms": "Small water-soaked spots that turn brown with yellow halos, leaf drop, fruit spotting.",
        "causes": "Warm, wet weather, spreads through water splash and contaminated tools.",
        "treatment": [
            "Apply copper bactericide spray",
            "Remove heavily infected plants",
            "Avoid working in wet fields",
            "Disinfect tools between plants"
        ],
        "prevention": [
            "Use disease-free certified seeds",
            "Avoid overhead irrigation",
            "Space plants for air circulation",
            "Remove plant debris"
        ]
    }
}

# General farming advice
FARMING_ADVICE = {
    "watering": {
        "keywords": ["water", "irrigation", "how much", "when"],
        "advice": [
            "Water deeply but less frequently to encourage deep root growth",
            "Best time: Early morning (6-10 AM) to reduce disease risk",
            "Tomatoes need 1-2 inches per week",
            "Potatoes need consistent moisture, especially during tuber formation",
            "Check soil moisture 2-3 inches deep before watering",
            "Use drip irrigation or soaker hoses instead of overhead sprinklers"
        ]
    },
    "fertilization": {
        "keywords": ["fertilizer", "nutrition", "nutrients", "feed", "npk"],
        "advice": [
            "Tomatoes: Use balanced fertilizer (10-10-10) or high phosphorus for fruiting",
            "Potatoes: Need high potassium (K) - use 5-10-10 formula",
            "Peppers: Moderate nitrogen, higher phosphorus and potassium",
            "Apply fertilizer every 2-3 weeks during growing season",
            "Avoid over-fertilizing - can cause excessive foliage, fewer fruits",
            "Use organic compost for slow-release nutrients"
        ]
    },
    "pest_control": {
        "keywords": ["pest", "insect", "bug", "aphid", "worm", "caterpillar"],
        "advice": [
            "Inspect plants daily for early pest detection",
            "Use neem oil for soft-bodied insects (aphids, whiteflies)",
            "Bt (Bacillus thuringiensis) for caterpillars",
            "Encourage beneficial insects (ladybugs, lacewings)",
            "Use yellow sticky traps for monitoring",
            "Remove affected plant parts immediately",
            "Rotate crops to break pest cycles"
        ]
    },
    "soil_health": {
        "keywords": ["soil", "compost", "ph", "organic", "mulch"],
        "advice": [
            "Test soil pH - tomatoes/peppers prefer 6.0-6.8, potatoes 5.0-6.0",
            "Add compost to improve soil structure and nutrients",
            "Use organic mulch (straw, leaves) to retain moisture",
            "Mulch also prevents soil-borne diseases from splashing",
            "Rotate crops to prevent nutrient depletion",
            "Add lime to raise pH, sulfur to lower pH"
        ]
    },
    "planting": {
        "keywords": ["plant", "transplant", "spacing", "depth", "when"],
        "advice": [
            "Tomatoes: Plant after last frost, 24-36 inches apart",
            "Potatoes: Plant 2-4 weeks before last frost, 12 inches apart",
            "Peppers: Plant after soil warms (15°C+), 18-24 inches apart",
            "Plant tomatoes deep - bury 2/3 of stem for stronger roots",
            "Harden off transplants for 7-10 days before planting",
            "Water well after planting"
        ]
    },
    "harvesting": {
        "keywords": ["harvest", "ripe", "ready", "pick", "when"],
        "advice": [
            "Tomatoes: Harvest when fully colored but still firm",
            "Potatoes: Harvest 2-3 weeks after vines die back",
            "Peppers: Can harvest green or wait for full color",
            "Harvest in the morning when plants are crisp",
            "Use clean, sharp tools to avoid disease spread",
            "Handle produce gently to avoid bruising"
        ]
    }
}

# Common questions and answers
FAQ = {
    "how_to_login": {
        "keywords": ["login", "log in", "sign in", "signin", "access", "enter"],
        "answer": "**To Login:**\n\n1. Click the **'Login'** button in the top-right corner of the homepage\n2. Enter your **email address** and **password**\n3. Click **'Sign In'** button\n4. You'll be redirected to your dashboard\n\nIf you don't have an account yet, click **'Create Account'** on the login page to register first!"
    },
    "how_to_register": {
        "keywords": ["register", "sign up", "signup", "create account", "new account", "join"],
        "answer": "**To Create an Account:**\n\n1. Click **'Create Account'** button on the homepage or login page\n2. Fill in your details:\n   - Full Name\n   - Email Address\n   - Password (minimum 6 characters)\n3. Click **'Create Account'** button\n4. You'll be automatically logged in and redirected to your dashboard\n\nIt's completely **FREE** - no payment required!"
    },
    "forgot_password": {
        "keywords": ["forgot", "password", "reset", "recover", "can't login"],
        "answer": "If you forgot your password, please contact the system administrator. The password reset feature will be available in the next update. For now, you can:\n\n1. Try remembering your password\n2. Create a new account if needed\n3. Contact support for assistance"
    },
    "account_help": {
        "keywords": ["account", "profile", "email", "settings"],
        "answer": "**Account Features:**\n\n📊 **Dashboard** - View your detection history and analytics\n👤 **Profile** - Update your name and account details\n⚙️ **Settings** - Customize your preferences\n📜 **History** - Access all your past disease detections\n\nTo access these, login and use the sidebar menu!"
    },
    "what_crops_supported": {
        "keywords": ["support", "crops", "plants", "which crop", "what crop"],
        "answer": "Our system currently supports **3 crops**: Tomatoes 🍅, Potatoes 🥔, and Peppers 🌶️. We can detect **15 different diseases** across these crops including early blight, late blight, bacterial spot, leaf mold, mosaic virus, and more."
    },
    "how_to_use": {
        "keywords": ["how use", "how work", "detect", "upload", "detection"],
        "answer": "**How to Use Disease Detection:**\n\n1. **Login** to your account\n2. Go to **'Disease Detection'** page from sidebar\n3. **Take or upload** a clear photo of the affected leaf\n4. Click **'Analyze Image'** button\n5. Get instant results with:\n   - Disease diagnosis\n   - Confidence score\n   - Treatment recommendations\n   - Weather-based advice\n\nTip: Take photos in good lighting for best results!"
    },
    "accuracy": {
        "keywords": ["accurate", "accuracy", "reliable", "trust", "confidence"],
        "answer": "Our system uses advanced AI with **85-95% accuracy**. It's trained on thousands of images using deep learning. However, for critical decisions, we recommend confirming with a local agricultural expert or agronomist."
    },
    "offline": {
        "keywords": ["offline", "internet", "network", "connection"],
        "answer": "Currently, you need an **internet connection** to use the app. The AI model runs on our servers for faster processing. We're working on an offline version for remote farming areas."
    },
    "cost": {
        "keywords": ["cost", "price", "free", "payment", "charge", "money"],
        "answer": "AgroGuard AI is **completely FREE** for farmers! 🎉\n\nNo hidden charges, no subscription fees. Our mission is to help farmers protect their crops and increase yields using AI technology. Just create an account and start detecting!"
    },
    "weather": {
        "keywords": ["weather", "temperature", "humidity", "rain", "climate"],
        "answer": "We integrate **real-time weather data** to give you location-specific advice. Many diseases spread faster in certain weather conditions (high humidity, cool/warm temps), so we alert you to risks and provide preventive recommendations based on your local weather."
    }
}


class FarmingChatbot:
    """Intelligent chatbot for farming advice"""
    
    def __init__(self):
        self.conversation_history = []
        
    def get_response(self, user_message: str) -> Dict:
        """
        Generate intelligent response to user question
        Returns: dict with answer, suggestions, and related topics
        """
        user_message = user_message.lower().strip()
        
        # Store in conversation history
        self.conversation_history.append({
            "role": "user",
            "message": user_message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Check for greetings
        if self._is_greeting(user_message):
            response = self._get_greeting_response()
        
        # Check FAQ
        elif faq_response := self._check_faq(user_message):
            response = faq_response
        
        # Check disease-specific questions
        elif disease_response := self._check_disease_knowledge(user_message):
            response = disease_response
        
        # Check general farming advice
        elif farming_response := self._check_farming_advice(user_message):
            response = farming_response
        
        # Default response with suggestions
        else:
            response = self._get_default_response(user_message)
        
        # Store bot response
        self.conversation_history.append({
            "role": "bot",
            "message": response["answer"],
            "timestamp": datetime.now().isoformat()
        })
        
        return response
    
    def _is_greeting(self, message: str) -> bool:
        """Check if message is a greeting"""
        greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste"]
        return any(greet in message for greet in greetings)
    
    def _get_greeting_response(self) -> Dict:
        """Return friendly greeting"""
        return {
            "answer": "Hello! 👋 I'm AgroGuard AI Assistant, here to help you with:\n\n🔐 **Account Help** - Login, registration, and account management\n🌱 **Crop Diseases** - Information about tomato, potato & pepper diseases\n💊 **Treatment Advice** - How to treat and prevent diseases\n🚜 **Farming Tips** - Watering, fertilization, pest control\n📸 **System Guide** - How to use the detection system\n\nHow can I help you today?",
            "suggestions": [
                "How do I login?",
                "How to create an account?",
                "What crops can you detect?",
                "How to use disease detection?"
            ],
            "type": "greeting"
        }
    
    def _check_faq(self, message: str) -> Optional[Dict]:
        """Check if message matches FAQ"""
        for faq_key, faq_data in FAQ.items():
            if any(keyword in message for keyword in faq_data["keywords"]):
                return {
                    "answer": faq_data["answer"],
                    "suggestions": [
                        "Tell me more about disease detection",
                        "How to upload images?",
                        "What should I do if disease detected?"
                    ],
                    "type": "faq"
                }
        return None
    
    def _check_disease_knowledge(self, message: str) -> Optional[Dict]:
        """Check disease-specific knowledge"""
        for disease_key, disease_data in DISEASE_KNOWLEDGE.items():
            if any(keyword in message for keyword in disease_data["keywords"]):
                # Determine what user is asking about
                if any(word in message for word in ["treat", "cure", "fix", "how", "control"]):
                    answer = f"**{disease_data['description']}**\n\n"
                    answer += "**Treatment:**\n"
                    for i, step in enumerate(disease_data["treatment"], 1):
                        answer += f"{i}. {step}\n"
                    
                    suggestions = [
                        f"How to prevent {disease_key.replace('_', ' ')}?",
                        "What causes this disease?",
                        "Show me symptoms"
                    ]
                
                elif any(word in message for word in ["prevent", "avoid", "stop"]):
                    answer = f"**Preventing {disease_data['description']}**\n\n"
                    for i, step in enumerate(disease_data["prevention"], 1):
                        answer += f"{i}. {step}\n"
                    
                    suggestions = [
                        "What are the symptoms?",
                        "How to treat if already infected?",
                        "What causes this disease?"
                    ]
                
                elif any(word in message for word in ["symptom", "sign", "look", "identify"]):
                    answer = f"**{disease_data['description']}**\n\n"
                    answer += f"**Symptoms:** {disease_data['symptoms']}\n\n"
                    answer += f"**Causes:** {disease_data['causes']}"
                    
                    suggestions = [
                        "How to treat this?",
                        "How to prevent this?",
                        "Upload image for detection"
                    ]
                
                elif any(word in message for word in ["cause", "why", "reason"]):
                    answer = f"**{disease_data['description']}**\n\n"
                    answer += f"**Causes:** {disease_data['causes']}"
                    
                    suggestions = [
                        "How to prevent this?",
                        "What are symptoms?",
                        "How to treat?"
                    ]
                
                else:
                    # General information
                    answer = f"**{disease_data['description']}**\n\n"
                    answer += f"**Symptoms:** {disease_data['symptoms']}\n\n"
                    answer += f"**Treatment:** {', '.join(disease_data['treatment'][:2])}\n\n"
                    answer += "Would you like detailed treatment or prevention steps?"
                    
                    suggestions = [
                        "How to treat this disease?",
                        "How to prevent this disease?",
                        "What causes this?"
                    ]
                
                return {
                    "answer": answer,
                    "suggestions": suggestions,
                    "type": "disease_info",
                    "disease": disease_key
                }
        
        return None
    
    def _check_farming_advice(self, message: str) -> Optional[Dict]:
        """Check general farming advice"""
        for advice_key, advice_data in FARMING_ADVICE.items():
            if any(keyword in message for keyword in advice_data["keywords"]):
                answer = f"**{advice_key.replace('_', ' ').title()} Tips:**\n\n"
                for i, tip in enumerate(advice_data["advice"], 1):
                    answer += f"{i}. {tip}\n"
                
                suggestions = [
                    "Tell me about fertilization",
                    "How to control pests?",
                    "When to harvest?"
                ]
                
                return {
                    "answer": answer,
                    "suggestions": suggestions,
                    "type": "farming_advice",
                    "topic": advice_key
                }
        
        return None
    
    def _get_default_response(self, message: str) -> Dict:
        """Default response when no match found"""
        # Try to be helpful by suggesting topics
        answer = "I'm not sure I understand your question. I can help you with:\n\n"
        answer += "🔐 **Account Help:** Login, registration, password, profile\n"
        answer += "🌱 **Crop Diseases:** Tomato, Potato, and Pepper diseases\n"
        answer += "💊 **Treatment Advice:** How to treat and prevent diseases\n"
        answer += "🚜 **Farming Tips:** Watering, fertilization, pest control, soil health\n"
        answer += "📸 **Disease Detection:** Upload images for AI analysis\n\n"
        answer += "Try asking a specific question!"
        
        suggestions = [
            "How do I login?",
            "How to create an account?",
            "What diseases can you detect?",
            "How to treat tomato blight?",
            "When should I water plants?",
            "How to prevent pests?"
        ]
        
        return {
            "answer": answer,
            "suggestions": suggestions[:4],  # Show only 4 suggestions
            "type": "default"
        }
    
    def get_conversation_history(self) -> List[Dict]:
        """Get conversation history"""
        return self.conversation_history
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []


# Predefined quick questions for UI
QUICK_QUESTIONS = [
    {
        "id": 1,
        "question": "How do I login?",
        "category": "account",
        "icon": "🔐"
    },
    {
        "id": 2,
        "question": "How to create an account?",
        "category": "account",
        "icon": "👤"
    },
    {
        "id": 3,
        "question": "What crops can you detect?",
        "category": "general",
        "icon": "🌱"
    },
    {
        "id": 4,
        "question": "How to use disease detection?",
        "category": "general",
        "icon": "📸"
    },
    {
        "id": 5,
        "question": "How to treat tomato blight?",
        "category": "disease",
        "icon": "🍅"
    },
    {
        "id": 6,
        "question": "When should I water my plants?",
        "category": "farming",
        "icon": "💧"
    },
    {
        "id": 7,
        "question": "How to prevent bacterial spot?",
        "category": "disease",
        "icon": "🛡️"
    },
    {
        "id": 8,
        "question": "Is this system free?",
        "category": "general",
        "icon": "💰"
    }
]


if __name__ == "__main__":
    # Test the chatbot
    bot = FarmingChatbot()
    
    print("AgroGuard AI Chatbot - Test Mode")
    print("=" * 50)
    
    test_questions = [
        "Hello!",
        "How do I login?",
        "How to create an account?",
        "What diseases can you detect?",
        "How to treat tomato early blight?",
        "When should I water my plants?"
    ]
    
    for question in test_questions:
        print(f"\nUser: {question}")
        response = bot.get_response(question)
        print(f"Bot: {response['answer']}")
        print(f"Suggestions: {response['suggestions']}")
