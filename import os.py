import os
from datetime import datetime
from typing import Dict, List
from dotenv import load_dotenv
import json

load_dotenv()

# Free APIs: Twilio (WhatsApp), SendGrid (Email), requests (Website webhooks)
import requests
from abc import ABC, abstractmethod

class Channel(ABC):
    """Base class for communication channels"""
    @abstractmethod
    def send_message(self, recipient: str, message: str) -> bool:
        pass
    
    @abstractmethod
    def receive_message(self) -> List[Dict]:
        pass

class WhatsAppChannel(Channel):
    """WhatsApp integration using Twilio free trial"""
    def __init__(self, account_sid: str, auth_token: str, from_number: str):
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.from_number = from_number
        self.base_url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}"
    
    def send_message(self, recipient: str, message: str) -> bool:
        url = f"{self.base_url}/Messages.json"
        data = {
            "From": f"whatsapp:{self.from_number}",
            "To": f"whatsapp:{recipient}",
            "Body": message
        }
        try:
            response = requests.post(url, data=data, auth=(self.account_sid, self.auth_token))
            return response.status_code == 201
        except Exception as e:
            print(f"WhatsApp send error: {e}")
            return False
    
    def receive_message(self) -> List[Dict]:
        # Implement webhook receiver
        return []

class EmailChannel(Channel):
    """Email integration using free SMTP or APIs"""
    def __init__(self, smtp_server: str, sender_email: str, sender_password: str):
        self.smtp_server = smtp_server
        self.sender_email = sender_email
        self.sender_password = sender_password
    
    def send_message(self, recipient: str, message: str) -> bool:
        import smtplib
        from email.mime.text import MIMEText
        try:
            msg = MIMEText(message)
            msg['Subject'] = "Automated Response"
            msg['From'] = self.sender_email
            msg['To'] = recipient
            
            with smtplib.SMTP_SSL(self.smtp_server, 465) as server:
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"Email send error: {e}")
            return False
    
    def receive_message(self) -> List[Dict]:
        return []

class WebsiteChannel(Channel):
    """Website contact form/webhook integration"""
    def __init__(self, webhook_url: str = None):
        self.webhook_url = webhook_url
        self.messages = []
    
    def send_message(self, recipient: str, message: str) -> bool:
        if self.webhook_url:
            try:
                requests.post(self.webhook_url, json={"message": message, "to": recipient})
                return True
            except Exception as e:
                print(f"Webhook error: {e}")
                return False
        return False
    
    def receive_message(self) -> List[Dict]:
        return self.messages

class AIAgent:
    """Main AI Agent for automation"""
    def __init__(self, admin_id: str, personality_data: Dict = None):
        self.admin_id = admin_id
        self.personality = personality_data or {}
        self.channels: Dict[str, Channel] = {}
        self.message_history: List[Dict] = []
        self.workflows: Dict[str, Dict] = {}
    
    def register_channel(self, channel_name: str, channel: Channel):
        """Register a communication channel"""
        self.channels[channel_name] = channel
    
    def add_workflow(self, workflow_id: str, workflow_config: Dict):
        """Add automation workflow"""
        self.workflows[workflow_id] = {
            "config": workflow_config,
            "created_at": datetime.now().isoformat(),
            "active": True
        }
    
    def generate_response(self, user_message: str, context: Dict = None) -> str:
        """Generate response based on personality and context"""
        # Use free API like Hugging Face Inference API or local model
        prompt = f"""Based on this personality: {json.dumps(self.personality)}
        User message: {user_message}
        Generate an appropriate response:"""
        
        # TODO: Integrate with free LLM API (HuggingFace, Replicate, etc.)
        return f"Thank you for contacting us. We received: '{user_message}'"
    
    def process_message(self, channel_name: str, sender: str, message: str):
        """Process incoming message"""
        response = self.generate_response(message)
        
        # Store in history
        self.message_history.append({
            "timestamp": datetime.now().isoformat(),
            "channel": channel_name,
            "sender": sender,
            "message": message,
            "response": response
        })
        
        # Send response
        if channel_name in self.channels:
            self.channels[channel_name].send_message(sender, response)
    
    def get_dashboard_data(self) -> Dict:
        """Admin dashboard data"""
        return {
            "total_messages": len(self.message_history),
            "channels": list(self.channels.keys()),
            "workflows": self.workflows,
            "recent_messages": self.message_history[-10:]
        }

# Example Usage
if __name__ == "__main__":
    # Initialize agent
    agent = AIAgent(
        admin_id="jamianil37@gmail.com",
        personality_data={
            "name": "Support Bot",
            "tone": "professional and friendly",
            "expertise": "customer support"
        }
    )
    
    # Register channels
    agent.register_channel("whatsapp", WhatsAppChannel(
        os.getenv("TWILIO_ACCOUNT_SID"),
        os.getenv("TWILIO_AUTH_TOKEN"),
        os.getenv("TWILIO_PHONE")
    ))
    
    agent.register_channel("email", EmailChannel(
        "smtp.gmail.com",
        os.getenv("EMAIL"),
        os.getenv("EMAIL_PASSWORD")
    ))
    
    agent.register_channel("website", WebsiteChannel())
    
    # Add workflow
    agent.add_workflow("greeting", {
        "trigger": "contact_received",
        "action": "send_greeting"
    })
    
    # Example: Process message
    agent.process_message("whatsapp", "+1234567890", "Hello, I need help")
    
    # Admin dashboard
    print(json.dumps(agent.get_dashboard_data(), indent=2))