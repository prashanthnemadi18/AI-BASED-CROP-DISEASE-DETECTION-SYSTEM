"""
Hey Agri - Kannada Voice Assistant
Handles speech recognition, text-to-speech, and Kannada language support
"""

import os
import logging
from typing import Dict, Optional
from chatbot import FarmingChatbot

logger = logging.getLogger(__name__)

# Kannada Knowledge Base
KANNADA_RESPONSES = {
    "greeting": {
        "welcome": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?",
        "help": "ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?"
    },
    "login": {
        "how_to": "Login ಪುಟಕ್ಕೆ ಹೋಗಿ. ನಿಮ್ಮ registered email ಮತ್ತು password ನಮೂದಿಸಿ. ನಂತರ Login ಬಟನ್ ಒತ್ತಿ.",
        "forgot_password": "ಕ್ಷಮಿಸಿ, password reset feature ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಹೊಸ account create ಮಾಡಬಹುದು ಅಥವಾ ನಿಮ್ಮ password remember ಮಾಡಲು ಪ್ರಯತ್ನಿಸಿ."
    },
    "register": {
        "how_to": "ಮೊದಲು Register ಅಥವಾ Sign Up ಆಯ್ಕೆಯನ್ನು ಒತ್ತಿ. ನಿಮ್ಮ ಹೆಸರು, email ಮತ್ತು password ನಮೂದಿಸಿ. ನಂತರ Create Account ಬಟನ್ ಒತ್ತಿ. ಇದು ಸಂಪೂರ್ಣ ಉಚಿತ!",
        "details": "ನಿಮಗೆ ಹೆಸರು, email address ಮತ್ತು ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳ password ಬೇಕಾಗುತ್ತದೆ."
    },
    "dashboard": {
        "info": "Dashboard ನಲ್ಲಿ ನೀವು disease detection, prediction history ಮತ್ತು ನಿಮ್ಮ profile ಸೇರಿದಂತೆ ಮುಖ್ಯ ಆಯ್ಕೆಗಳನ್ನು ನೋಡಬಹುದು.",
        "navigate": "Sidebar ನಲ್ಲಿ menu ಇದೆ. ಅಲ್ಲಿಂದ ನೀವು ಯಾವುದೇ ಪುಟಕ್ಕೆ ಹೋಗಬಹುದು."
    },
    "upload": {
        "how_to": "Disease Detection ಪುಟಕ್ಕೆ ಹೋಗಿ. Upload Image ಆಯ್ಕೆ ಮಾಡಿ. ನಂತರ ಗಿಡದ ಎಲೆಯ clear photo ಆಯ್ಕೆ ಮಾಡಿ. ಎಲೆ ಸಂಪೂರ್ಣವಾಗಿ ಕಾಣುವಂತೆ ಮತ್ತು ಬೆಳಕು ಸರಿಯಾಗಿರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.",
        "tips": "ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ, ಎಲೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ, blurry ಇಲ್ಲದೆ photo ತೆಗೆದುಕೊಳ್ಳಿ. Background ಸಾಧ್ಯವಾದಷ್ಟು simple ಇರಲಿ.",
        "accepted": "ನಾವು Tomato, Potato ಮತ್ತು Pepper ಗಿಡಗಳ ಎಲೆಯ ಫೋಟೋಗಳನ್ನು ಮಾತ್ರ ಸ್ವೀಕರಿಸುತ್ತೇವೆ."
    },
    "camera": {
        "how_to": "Camera ಆಯ್ಕೆ ಮಾಡಿ. ಎಲೆಯನ್ನು ಕ್ಯಾಮೆರಾದ ಮುಂದೆ ಸರಿಯಾಗಿ ಹಿಡಿದು, ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಸ್ಪಷ್ಟವಾದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ.",
        "position": "ಎಲೆಯನ್ನು frame ನ ಮಧ್ಯದಲ್ಲಿ ಇರಿಸಿ. ಕ್ಯಾಮೆರಾವನ್ನು steady ಆಗಿ ಹಿಡಿದುಕೊಳ್ಳಿ."
    },
    "detection": {
        "how_it_works": "ಈ application AI ಬಳಸಿ ಗಿಡದ ಎಲೆಯ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಿ, ತರಬೇತಿ ಪಡೆದ model ಆಧಾರದ ಮೇಲೆ ಸಾಧ್ಯವಾದ crop disease ಅನ್ನು ಗುರುತಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        "process": "ನೀವು photo upload ಮಾಡಿದ ನಂತರ, AI model ಕೆಲವೇ ಸೆಕೆಂಡುಗಳಲ್ಲಿ disease ಅನ್ನು ಗುರುತಿಸುತ್ತದೆ ಮತ್ತು result ತೋರಿಸುತ್ತದೆ.",
        "supported": "ನಾವು Tomato, Potato ಮತ್ತು Pepper ಗಿಡಗಳಲ್ಲಿ 15 ವಿಧದ diseases ಅನ್ನು ಗುರುತಿಸಬಲ್ಲೆವು."
    },
    "confidence": {
        "explain": "Confidence score ಅಂದರೆ AI ನೀಡಿರುವ prediction ಎಷ್ಟು ವಿಶ್ವಾಸಾರ್ಹವಾಗಿದೆ ಎಂಬುದನ್ನು ಸೂಚಿಸುವ ಅಂಕೆ. Confidence ಕಡಿಮೆ ಇದ್ದರೆ, ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಸ್ಪಷ್ಟವಾದ ಎಲೆಯ ಫೋಟೋವನ್ನು ಮತ್ತೆ upload ಮಾಡುವುದು ಉತ್ತಮ.",
        "low": "Confidence ಕಡಿಮೆ ಇರುವುದರ ಅರ್ಥ photo ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ ಅಥವಾ ಬೆಳಕು ಸರಿಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು better photo ತೆಗೆದುಕೊಂಡು ಮತ್ತೆ try ಮಾಡಿ."
    },
    "result": {
        "general": "ಈ result ಆಧಾರದ ಮೇಲೆ ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ. ಖಚಿತ ಸಲಹೆಗಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಗಳು ಅಥವಾ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
        "next_steps": "Result ನೋಡಿದ ನಂತರ, ನೀವು treatment information, symptoms ಮತ್ತು prevention tips ನೋಡಬಹುದು. Result ಅನ್ನು save ಮಾಡಬಹುದು history ನಲ್ಲಿ."
    },
    "history": {
        "view": "ನಿಮ್ಮ ಹಿಂದಿನ disease predictions ಅನ್ನು Prediction History ವಿಭಾಗದಲ್ಲಿ ನೋಡಬಹುದು. Sidebar ನಲ್ಲಿ History ಆಯ್ಕೆ ಒತ್ತಿ.",
        "clear": "History ಅನ್ನು clear ಮಾಡಲು History page ನಲ್ಲಿ Clear All button ಇದೆ."
    },
    "profile": {
        "view": "ನಿಮ್ಮ profile ನೋಡಲು Sidebar ನಲ್ಲಿ Profile ಆಯ್ಕೆ ಒತ್ತಿ. ಅಲ್ಲಿ ನೀವು ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು email information ನೋಡಬಹುದು.",
        "update": "Profile page ನಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರನ್ನು update ಮಾಡಬಹುದು."
    },
    "logout": {
        "how_to": "Logout ಮಾಡಲು Profile ಅಥವಾ Menu ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ ಮತ್ತು Logout ಆಯ್ಕೆಯನ್ನು ಒತ್ತಿ.",
        "confirm": "ನೀವು logout ಮಾಡಿದ ನಂತರ login page ಗೆ redirect ಆಗುತ್ತೀರಿ."
    },
    "app_info": {
        "purpose": "ಈ application AI ತಂತ್ರಜ್ಞಾನ ಬಳಸಿ ರೈತರಿಗೆ ತಮ್ಮ ಬೆಳೆಗಳ diseases ಅನ್ನು ಗುರುತಿಸಲು ಮತ್ತು ಸರಿಯಾದ treatment ಪಡೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        "free": "ಈ application ಸಂಪೂರ್ಣ ಉಚಿತ! ಯಾವುದೇ payment ಅಗತ್ಯವಿಲ್ಲ.",
        "accuracy": "ನಮ್ಮ AI model 85-95% accuracy ಹೊಂದಿದೆ. ಆದರೆ ಮುಖ್ಯ decisions ಗಾಗಿ local agricultural expert ಅನ್ನು consult ಮಾಡುವುದು ಉತ್ತಮ."
    },
    "diseases": {
        "tomato_early_blight": {
            "name": "Tomato Early Blight",
            "info": "ಇದು fungal disease. ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ spots ಕಾಣುತ್ತವೆ. Copper-based fungicide apply ಮಾಡಿ. Infected ಎಲೆಗಳನ್ನು remove ಮಾಡಿ."
        },
        "tomato_late_blight": {
            "name": "Tomato Late Blight",
            "info": "ಇದು ತುಂಬಾ ಅಪಾಯಕಾರಿ disease. Water-soaked dark spots ಕಾಣುತ್ತವೆ. Immediately fungicide spray ಮಾಡಿ. Infected plants ಅನ್ನು destroy ಮಾಡಿ."
        },
        "potato_early_blight": {
            "name": "Potato Early Blight",
            "info": "ಎಲೆಗಳ ಮೇಲೆ ಕಂದು circular spots. Fungicide apply ಮಾಡಿ ಮತ್ತು infected ಎಲೆಗಳನ್ನು remove ಮಾಡಿ."
        },
        "bacterial_spot": {
            "name": "Bacterial Spot",
            "info": "Bacteria ದಿಂದ ಬರುವ disease. Yellow halo ಇರುವ spots. Copper bactericide spray ಮಾಡಿ. Overhead watering avoid ಮಾಡಿ."
        },
        "healthy": {
            "name": "Healthy Plant",
            "info": "ನಿಮ್ಮ ಗಿಡ ಆರೋಗ್ಯಕರವಾಗಿದೆ! ಯಾವುದೇ disease ಕಾಣಿಸುತ್ತಿಲ್ಲ. Regular watering ಮತ್ತು monitoring ಮುಂದುವರಿಸಿ."
        }
    },
    "error": {
        "not_understand": "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಮಾತು ಸರಿಯಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        "network": "ಕ್ಷಮಿಸಿ, ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        "permission": "Voice Assistant ಬಳಸಲು microphone permission ಅಗತ್ಯವಿದೆ. ದಯವಿಟ್ಟು microphone permission ಅನ್ನು Allow ಮಾಡಿ.",
        "unsupported": "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ browser voice features ಅನ್ನು support ಮಾಡುತ್ತಿಲ್ಲ. Chrome ಅಥವಾ Edge browser ಬಳಸಿ."
    }
}


class KannadaVoiceAssistant:
    """Kannada Voice Assistant - Hey Agri"""
    
    def __init__(self):
        self.chatbot = FarmingChatbot()
        self.wake_word = "hey agri"
        
    def process_voice_query(self, query: str, context: Optional[Dict] = None) -> Dict:
        """
        Process voice query and return Kannada response
        
        Args:
            query: User's voice input (text from STT)
            context: Application context (current page, prediction data, etc.)
        
        Returns:
            dict with Kannada response and metadata
        """
        query_lower = query.lower().strip()
        
        # Check if it's a greeting
        if self._is_greeting(query_lower):
            return self._greeting_response()
        
        # Check for login/register help
        if any(word in query_lower for word in ["login", "ಲಾಗಿನ್", "sign in"]):
            return self._login_help()
        
        if any(word in query_lower for word in ["register", "ರಿಜಿಸ್ಟರ್", "signup", "account", "ಖಾತೆ"]):
            return self._register_help()
        
        # Check for upload/camera help
        if any(word in query_lower for word in ["upload", "photo", "ಫೋಟೋ", "ಚಿತ್ರ", "image"]):
            return self._upload_help()
        
        if any(word in query_lower for word in ["camera", "ಕ್ಯಾಮೆರಾ", "take photo"]):
            return self._camera_help()
        
        # Check for detection/result queries
        if any(word in query_lower for word in ["detect", "detection", "disease", "ರೋಗ"]):
            if context and context.get("prediction"):
                return self._result_help(context["prediction"])
            return self._detection_help()
        
        # Check for confidence questions
        if any(word in query_lower for word in ["confidence", "ಕಾನ್ಫಿಡೆನ್ಸ್", "accurate", "ನಂಬಿಕೆ"]):
            if context and context.get("prediction"):
                return self._confidence_help(context["prediction"])
            return self._confidence_general()
        
        # Check for history
        if any(word in query_lower for word in ["history", "ಹಿಂದಿನ", "previous", "past"]):
            return self._history_help()
        
        # Check for profile
        if any(word in query_lower for word in ["profile", "ಪ್ರೊಫೈಲ್", "account"]):
            return self._profile_help()
        
        # Check for logout
        if any(word in query_lower for word in ["logout", "ಲಾಗೌಟ್", "sign out"]):
            return self._logout_help()
        
        # Check for app information
        if any(word in query_lower for word in ["what is", "ಏನು", "how work", "ಹೇಗೆ ಕೆಲಸ"]):
            return self._app_info()
        
        # Check for specific disease questions
        disease_response = self._check_disease_query(query_lower)
        if disease_response:
            return disease_response
        
        # Context-aware responses
        if context:
            context_response = self._context_aware_response(query_lower, context)
            if context_response:
                return context_response
        
        # Fallback to English chatbot with Kannada wrapper
        return self._fallback_response(query)
    
    def _is_greeting(self, query: str) -> bool:
        """Check if query is a greeting"""
        greetings = ["hello", "hi", "hey", "namaste", "ನಮಸ್ಕಾರ", "ಹಲೋ"]
        return any(greet in query for greet in greetings)
    
    def _greeting_response(self) -> Dict:
        """Return Kannada greeting"""
        return {
            "response": KANNADA_RESPONSES["greeting"]["welcome"],
            "language": "kn",
            "suggestions": [
                "ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?",
                "Photo upload ಹೇಗೆ ಮಾಡೋದು?",
                "ಯಾವ diseases detect ಮಾಡಬಹುದು?"
            ],
            "type": "greeting"
        }
    
    def _login_help(self) -> Dict:
        """Login help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["login"]["how_to"],
            "language": "kn",
            "suggestions": [
                "Password forgot ಮಾಡಿದ್ದೇನೆ",
                "Account ಹೇಗೆ create ಮಾಡೋದು?",
                "Dashboard ಎಲ್ಲಿದೆ?"
            ],
            "type": "help"
        }
    
    def _register_help(self) -> Dict:
        """Registration help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["register"]["how_to"],
            "language": "kn",
            "suggestions": [
                "Login ಹೇಗೆ ಮಾಡಬೇಕು?",
                "ಯಾವ details ಬೇಕು?",
                "ಇದು free ಇದೆಯಾ?"
            ],
            "type": "help"
        }
    
    def _upload_help(self) -> Dict:
        """Upload help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["upload"]["how_to"] + "\n\n" + KANNADA_RESPONSES["upload"]["tips"],
            "language": "kn",
            "suggestions": [
                "Camera ಇಂದ photo ತೆಗೆಯಬಹುದಾ?",
                "ಯಾವ plants support ಇದೆ?",
                "Photo unclear ಆಗಿದ್ದರೆ?"
            ],
            "type": "help"
        }
    
    def _camera_help(self) -> Dict:
        """Camera help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["camera"]["how_to"] + "\n\n" + KANNADA_RESPONSES["camera"]["position"],
            "language": "kn",
            "suggestions": [
                "Gallery ಇಂದ upload ಮಾಡಬಹುದಾ?",
                "Photo ಸ್ಪಷ್ಟ ಇಲ್ಲದಿದ್ದರೆ?"
            ],
            "type": "help"
        }
    
    def _detection_help(self) -> Dict:
        """Detection help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["detection"]["how_it_works"] + "\n\n" + KANNADA_RESPONSES["detection"]["supported"],
            "language": "kn",
            "suggestions": [
                "Photo upload ಹೇಗೆ?",
                "Result ಬಂದ ನಂತರ ಏನು?",
                "Confidence ಅಂದರೇನು?"
            ],
            "type": "help"
        }
    
    def _result_help(self, prediction: Dict) -> Dict:
        """Result-specific help in Kannada"""
        disease = prediction.get("disease", "")
        confidence = prediction.get("confidence", 0)
        
        response = f"ನಿಮ್ಮ ಚಿತ್ರದಲ್ಲಿ AI ಗುರುತಿಸಿರುವ ರೋಗ: {disease}. Confidence: {confidence}%.\n\n"
        response += KANNADA_RESPONSES["result"]["general"]
        
        return {
            "response": response,
            "language": "kn",
            "suggestions": [
                "ಈ disease ಹೇಗೆ treat ಮಾಡೋದು?",
                "History ಎಲ್ಲಿ ನೋಡೋದು?",
                "ಮತ್ತೊಂದು photo upload ಮಾಡಬೇಕಾ?"
            ],
            "type": "result_info",
            "disease": disease
        }
    
    def _confidence_help(self, prediction: Dict) -> Dict:
        """Confidence explanation for current result"""
        confidence = prediction.get("confidence", 0)
        
        response = KANNADA_RESPONSES["confidence"]["explain"]
        if confidence < 70:
            response += "\n\n" + KANNADA_RESPONSES["confidence"]["low"]
        
        return {
            "response": response,
            "language": "kn",
            "suggestions": [
                "Better photo ಹೇಗೆ ತೆಗೆಯೋದು?",
                "Result accurate ಇದೆಯಾ?"
            ],
            "type": "help"
        }
    
    def _confidence_general(self) -> Dict:
        """General confidence explanation"""
        return {
            "response": KANNADA_RESPONSES["confidence"]["explain"],
            "language": "kn",
            "suggestions": [
                "Photo upload ಹೇಗೆ?",
                "System ಎಷ್ಟು accurate?"
            ],
            "type": "help"
        }
    
    def _history_help(self) -> Dict:
        """History help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["history"]["view"],
            "language": "kn",
            "suggestions": [
                "History clear ಹೇಗೆ ಮಾಡೋದು?",
                "Dashboard ಗೆ ಹೇಗೆ ಹೋಗೋದು?"
            ],
            "type": "help"
        }
    
    
    def _profile_help(self) -> Dict:
        """Profile help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["profile"]["view"] + "\n\n" + KANNADA_RESPONSES["profile"]["update"],
            "language": "kn",
            "suggestions": [
                "ಹೆಸರು update ಹೇಗೆ?",
                "Logout ಹೇಗೆ ಮಾಡೋದು?"
            ],
            "type": "help"
        }
    
    def _logout_help(self) -> Dict:
        """Logout help in Kannada"""
        return {
            "response": KANNADA_RESPONSES["logout"]["how_to"],
            "language": "kn",
            "suggestions": [
                "Login ಮತ್ತೆ ಹೇಗೆ ಮಾಡೋದು?",
                "Account safe ಇದೆಯಾ?"
            ],
            "type": "help"
        }
    
    def _app_info(self) -> Dict:
        """App information in Kannada"""
        response = KANNADA_RESPONSES["app_info"]["purpose"] + "\n\n"
        response += KANNADA_RESPONSES["app_info"]["free"] + "\n\n"
        response += KANNADA_RESPONSES["app_info"]["accuracy"]
        
        return {
            "response": response,
            "language": "kn",
            "suggestions": [
                "ಹೇಗೆ ಬಳಸೋದು?",
                "ಯಾವ diseases detect ಮಾಡಬಹುದು?",
                "Offline ಬಳಸಬಹುದಾ?"
            ],
            "type": "info"
        }
    
    def _check_disease_query(self, query: str) -> Optional[Dict]:
        """Check if query is about specific disease"""
        disease_keywords = {
            "early blight": "tomato_early_blight",
            "late blight": "tomato_late_blight",
            "bacterial spot": "bacterial_spot",
            "healthy": "healthy"
        }
        
        for keyword, disease_key in disease_keywords.items():
            if keyword in query or keyword.replace(" ", "_") in query:
                disease_info = KANNADA_RESPONSES["diseases"].get(disease_key, {})
                if disease_info:
                    return {
                        "response": f"{disease_info['name']}\n\n{disease_info['info']}",
                        "language": "kn",
                        "suggestions": [
                            "ಇನ್ನೊಂದು disease ಬಗ್ಗೆ",
                            "Prevention tips ಏನು?",
                            "Photo upload ಹೇಗೆ?"
                        ],
                        "type": "disease_info"
                    }
        
        return None
    
    def _context_aware_response(self, query: str, context: Dict) -> Optional[Dict]:
        """Context-aware responses based on current page/state"""
        current_page = context.get("currentPage", "")
        
        # If user says "ಇದು ಏನು?" or "this" on prediction page
        if any(word in query for word in ["ಇದು", "this", "result", "ಫಲಿತಾಂಶ"]):
            if "prediction" in current_page or context.get("prediction"):
                prediction = context.get("prediction", {})
                return self._result_help(prediction)
        
        # If user asks "ಇಲ್ಲಿಂದ ಮುಂದೆ" or "next"
        if any(word in query for word in ["ಮುಂದೆ", "next", "ಏನು ಮಾಡೋದು"]):
            if "detection" in current_page:
                return {
                    "response": "Photo upload ಮಾಡಿ ಅಥವಾ camera ಇಂದ ತೆಗೆಯಿರಿ. ನಂತರ Analyze ಬಟನ್ ಒತ್ತಿ.",
                    "language": "kn",
                    "type": "navigation"
                }
            elif "result" in current_page or context.get("prediction"):
                return {
                    "response": "Result ಅನ್ನು History ನಲ್ಲಿ save ಮಾಡಬಹುದು. Treatment information ಓದಿ. ಅಥವಾ ಮತ್ತೊಂದು detection ಮಾಡಬಹುದು.",
                    "language": "kn",
                    "type": "navigation"
                }
        
        return None
    
    def _fallback_response(self, query: str) -> Dict:
        """Fallback to existing chatbot with Kannada wrapper"""
        # Get English response from existing chatbot
        chatbot_response = self.chatbot.get_response(query)
        
        # Wrap with Kannada introduction
        response = "ಕ್ಷಮಿಸಿ, ನಾನು Kannada ನಲ್ಲಿ ಉತ್ತರಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿದ್ದೇನೆ:\n\n"
        response += chatbot_response["answer"]
        
        return {
            "response": response,
            "language": "mixed",
            "suggestions": [
                "ಸರಳ Kannada ನಲ್ಲಿ ಹೇಳಿ",
                "Help ಬೇಕು",
                "Dashboard ಗೆ ಹೋಗೋದು ಹೇಗೆ?"
            ],
            "type": "fallback"
        }


# Initialize assistant
kannada_assistant = KannadaVoiceAssistant()


def process_voice_input(text: str, context: Optional[Dict] = None) -> Dict:
    """
    Main entry point for voice processing
    
    Args:
        text: Transcribed text from speech recognition
        context: Application context
    
    Returns:
        Kannada response dict
    """
    try:
        return kannada_assistant.process_voice_query(text, context)
    except Exception as e:
        logger.error(f"Voice processing error: {e}")
        return {
            "response": KANNADA_RESPONSES["error"]["network"],
            "language": "kn",
            "type": "error",
            "error": str(e)
        }


if __name__ == "__main__":
    # Test the voice assistant
    print("Hey Agri - Kannada Voice Assistant Test")
    print("=" * 50)
    
    test_queries = [
        ("Hello", None),
        ("ನಾನು ಹೇಗೆ login ಮಾಡಬೇಕು?", None),
        ("Photo upload ಹೇಗೆ ಮಾಡೋದು?", None),
        ("ಇದು ಏನು?", {"prediction": {"disease": "Tomato_Early_blight", "confidence": 92.5}}),
    ]
    
    for query, context in test_queries:
        print(f"\nUser: {query}")
        if context:
            print(f"Context: {context}")
        response = process_voice_input(query, context)
        print(f"Assistant: {response['response']}")
        print(f"Suggestions: {response.get('suggestions', [])}")
