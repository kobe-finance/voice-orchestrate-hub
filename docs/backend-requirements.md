
# Backend Requirements Document
## Multi-Tenant Voice Agent Platform

### Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Authentication & Multi-Tenancy](#authentication--multi-tenancy)
4. [API Endpoints Specification](#api-endpoints-specification)
5. [Data Models & Formats](#data-models--formats)
6. [Integration Requirements](#integration-requirements)
7. [Security & Encryption](#security--encryption)
8. [Error Handling](#error-handling)
9. [Development Guidelines](#development-guidelines)
10. [Deployment Considerations](#deployment-considerations)

---

## 1. Project Overview

### What You're Building
A Python backend service that powers a multi-tenant voice agent platform. The platform allows organizations to create AI-powered voice agents that can handle phone calls, integrate with external services (CRM, telephony, AI providers), and maintain complete data isolation between tenants.

### Why This Backend is Needed
- **Frontend Integration**: The React frontend needs secure API endpoints for all voice agent operations
- **Supabase Integration**: Bridge between frontend and Supabase with additional business logic
- **External Service Management**: Handle complex integrations with AI providers, telephony services, and CRMs
- **Security Layer**: Implement encryption, credential management, and secure API communications
- **Business Logic**: Process voice calls, manage conversations, and handle tenant-specific configurations

### Key Components You'll Build
1. **Authentication Service** - JWT validation and tenant isolation
2. **Integration Management** - Secure credential storage and external API communication
3. **Voice Agent Engine** - Call processing and conversation management
4. **Webhook Handlers** - Real-time event processing from external services
5. **Analytics Service** - Call metrics and performance tracking

---

## 2. Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Python Backend │    │   Supabase      │
│   (Frontend)    │◄──►│   (Your Code)   │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       ▼                       │
        │              ┌─────────────────┐              │
        └──────────────►│  External APIs  │◄─────────────┘
                       │  (AI, CRM, Tel)  │
                       └─────────────────┘
```

### Technology Stack Requirements
- **Framework**: FastAPI (recommended) or Flask
- **Database ORM**: SQLAlchemy with Supabase PostgreSQL
- **Authentication**: JWT validation with Supabase Auth
- **Encryption**: Fernet (symmetric) for credentials, bcrypt for passwords
- **HTTP Client**: httpx or requests for external API calls
- **Async Support**: asyncio for concurrent operations
- **Validation**: Pydantic models for request/response validation

---

## 3. Authentication & Multi-Tenancy

### JWT Token Validation
Every API request must validate the Supabase JWT token:

```python
# Expected JWT payload structure
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "user_metadata": {
    "tenant_id": "organization_uuid"
  },
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Tenant Isolation Implementation
```python
class TenantService:
    def get_tenant_id(self, jwt_token: str) -> str:
        """Extract tenant_id from JWT token"""
        
    def verify_tenant_access(self, tenant_id: str, resource_id: str) -> bool:
        """Verify user can access resource within their tenant"""
```

### Required Environment Variables
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_SERVICE_KEY=your-service-role-key
ENCRYPTION_KEY=your-fernet-key
DATABASE_URL=postgresql://...
```

---

## 4. API Endpoints Specification

### Base Configuration
- **Base URL**: `https://api.yourdomain.com/v1`
- **Authentication**: Bearer token (Supabase JWT) in Authorization header
- **Content-Type**: `application/json`
- **Rate Limiting**: 1000 requests/minute per tenant

### 4.1 Integration Management Endpoints

#### POST /integrations/credentials
Create new integration credential for tenant.

**Request:**
```json
{
  "integration_id": "uuid",
  "credential_name": "string",
  "credential_type": "api_key|oauth|basic_auth",
  "credentials": {
    "api_key": "encrypted_value",
    "endpoint_url": "https://api.provider.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "credential_id": "uuid",
    "status": "created",
    "last_test_status": "not_tested"
  },
  "message": "Credential created successfully"
}
```

#### POST /integrations/test-credential
Test integration credential connectivity.

**Request:**
```json
{
  "credential_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success|failed",
    "response_time_ms": 250,
    "error_details": null
  },
  "message": "Connection test completed"
}
```

#### POST /integrations/install
Install integration for tenant.

**Request:**
```json
{
  "integration_id": "uuid",
  "credential_id": "uuid",
  "config": {
    "webhook_url": "https://your-backend.com/webhooks/provider",
    "custom_settings": {}
  }
}
```

### 4.2 Voice Agent Endpoints

#### POST /voice-agents
Create new voice agent.

**Request:**
```json
{
  "name": "Customer Support Agent",
  "description": "Handles customer inquiries",
  "voice_config": {
    "provider": "elevenlabs",
    "voice_id": "voice_uuid",
    "language": "en-US"
  },
  "ai_config": {
    "provider": "openai",
    "model": "gpt-4",
    "instructions": "You are a helpful customer support agent..."
  },
  "integrations": ["crm_uuid", "telephony_uuid"]
}
```

#### POST /voice-agents/{agent_id}/calls
Initiate outbound call.

**Request:**
```json
{
  "phone_number": "+1234567890",
  "campaign_id": "uuid",
  "context": {
    "customer_name": "John Doe",
    "custom_data": {}
  }
}
```

### 4.3 Conversation Management

#### GET /conversations
List conversations for tenant.

**Query Parameters:**
- `page`: int (default: 1)
- `limit`: int (default: 50, max: 100)
- `agent_id`: uuid (optional)
- `status`: active|completed|failed (optional)
- `date_from`: ISO date (optional)
- `date_to`: ISO date (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "total_pages": 3
    }
  }
}
```

#### GET /conversations/{conversation_id}
Get detailed conversation data.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "agent_id": "uuid",
    "customer_phone": "+1234567890",
    "status": "completed",
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T10:05:30Z",
    "duration_seconds": 330,
    "transcript": [
      {
        "speaker": "agent",
        "text": "Hello, how can I help you today?",
        "timestamp": "2024-01-01T10:00:05Z"
      }
    ],
    "sentiment": "positive",
    "outcome": "resolved",
    "tags": ["billing", "resolved"]
  }
}
```

### 4.4 Analytics Endpoints

#### GET /analytics/dashboard
Get dashboard metrics for tenant.

**Query Parameters:**
- `period`: 7d|30d|90d (default: 7d)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_calls": 1250,
    "successful_calls": 1100,
    "failed_calls": 150,
    "average_duration": 180,
    "satisfaction_score": 4.2,
    "top_outcomes": [
      {"outcome": "resolved", "count": 800},
      {"outcome": "callback_scheduled", "count": 200}
    ]
  }
}
```

### 4.5 Webhook Endpoints

#### POST /webhooks/twilio
Handle Twilio call events.

#### POST /webhooks/vonage
Handle Vonage call events.

#### POST /webhooks/deepgram
Handle Deepgram transcription events.

---

## 5. Data Models & Formats

### 5.1 Core Models

```python
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class IntegrationProvider(str, Enum):
    OPENAI = "openai"
    CLAUDE = "claude"
    DEEPGRAM = "deepgram"
    ELEVENLABS = "elevenlabs"
    TWILIO = "twilio"
    SALESFORCE = "salesforce"

class CredentialType(str, Enum):
    API_KEY = "api_key"
    OAUTH = "oauth"
    BASIC_AUTH = "basic_auth"

class CallStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"
    RINGING = "ringing"

class IntegrationCredential(BaseModel):
    id: str
    tenant_id: str
    integration_id: str
    credential_name: str
    credential_type: CredentialType
    encrypted_credentials: Dict[str, Any]
    last_test_status: Optional[str] = "not_tested"
    created_at: datetime
    expires_at: Optional[datetime] = None

class VoiceAgent(BaseModel):
    id: str
    tenant_id: str
    name: str
    description: Optional[str] = None
    voice_config: Dict[str, Any]
    ai_config: Dict[str, Any]
    integrations: List[str]
    is_active: bool = True
    created_at: datetime

class Conversation(BaseModel):
    id: str
    tenant_id: str
    agent_id: str
    customer_phone: str
    status: CallStatus
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    transcript: List[Dict[str, Any]]
    sentiment: Optional[str] = None
    outcome: Optional[str] = None
    metadata: Dict[str, Any] = {}
```

### 5.2 Request/Response Models

```python
class CreateCredentialRequest(BaseModel):
    integration_id: str = Field(..., description="UUID of the integration")
    credential_name: str = Field(..., min_length=1, max_length=100)
    credential_type: CredentialType
    credentials: Dict[str, str] = Field(..., description="Raw credential data to be encrypted")

class TestCredentialRequest(BaseModel):
    credential_id: str = Field(..., description="UUID of the credential to test")

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginatedResponse(BaseModel):
    data: List[Any]
    pagination: Dict[str, int]
```

### 5.3 Error Response Format

```python
class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Standard error codes
ERROR_CODES = {
    "AUTH_INVALID": "Invalid or expired authentication token",
    "TENANT_ACCESS_DENIED": "Access denied for tenant resource",
    "CREDENTIAL_NOT_FOUND": "Integration credential not found",
    "INTEGRATION_TEST_FAILED": "Integration connectivity test failed",
    "EXTERNAL_API_ERROR": "External service API error",
    "VALIDATION_ERROR": "Request validation failed",
    "RATE_LIMITED": "Rate limit exceeded",
    "SERVER_ERROR": "Internal server error"
}
```

---

## 6. Integration Requirements

### 6.1 Supabase Integration

```python
class SupabaseService:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY")
        self.client = create_client(self.url, self.service_key)
    
    async def get_tenant_integrations(self, tenant_id: str) -> List[Dict]:
        """Fetch all integrations for tenant from Supabase"""
        
    async def create_conversation_record(self, conversation: Conversation) -> str:
        """Create conversation record in Supabase"""
        
    async def update_credential_test_status(self, credential_id: str, status: str, error: Optional[str] = None):
        """Update credential test results in Supabase"""
```

### 6.2 External Service Integrations

#### OpenAI Integration
```python
class OpenAIService:
    async def generate_response(self, messages: List[Dict], model: str = "gpt-4") -> str:
        """Generate AI response for conversation"""
        
    async def test_connection(self, api_key: str, org_id: Optional[str] = None) -> bool:
        """Test OpenAI API connectivity"""
```

#### Twilio Integration
```python
class TwilioService:
    async def initiate_call(self, to_number: str, from_number: str, webhook_url: str) -> str:
        """Start outbound call via Twilio"""
        
    async def handle_webhook(self, request_data: Dict) -> Dict:
        """Process Twilio webhook events"""
```

#### ElevenLabs Integration
```python
class ElevenLabsService:
    async def text_to_speech(self, text: str, voice_id: str) -> bytes:
        """Convert text to speech audio"""
        
    async def get_available_voices(self, api_key: str) -> List[Dict]:
        """Fetch available voices for tenant"""
```

### 6.3 Integration Testing Framework

```python
class IntegrationTester:
    async def test_credential(self, credential: IntegrationCredential) -> TestResult:
        """Test integration credential based on provider type"""
        
    def get_test_handler(self, provider: IntegrationProvider):
        """Return appropriate test handler for provider"""
        handlers = {
            IntegrationProvider.OPENAI: self._test_openai,
            IntegrationProvider.TWILIO: self._test_twilio,
            IntegrationProvider.ELEVENLABS: self._test_elevenlabs,
            # ... other providers
        }
        return handlers.get(provider)
```

---

## 7. Security & Encryption

### 7.1 Credential Encryption
All sensitive credentials must be encrypted at rest using Fernet encryption:

```python
from cryptography.fernet import Fernet

class CredentialEncryption:
    def __init__(self):
        self.key = os.getenv("ENCRYPTION_KEY").encode()
        self.cipher = Fernet(self.key)
    
    def encrypt_credentials(self, credentials: Dict[str, str]) -> str:
        """Encrypt credential dictionary to string"""
        json_data = json.dumps(credentials)
        encrypted = self.cipher.encrypt(json_data.encode())
        return base64.b64encode(encrypted).decode()
    
    def decrypt_credentials(self, encrypted_data: str) -> Dict[str, str]:
        """Decrypt string back to credential dictionary"""
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted = self.cipher.decrypt(encrypted_bytes)
        return json.loads(decrypted.decode())
```

### 7.2 JWT Validation
```python
import jwt
from jwt.exceptions import InvalidTokenError

class AuthService:
    def __init__(self):
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    
    def validate_token(self, token: str) -> Dict[str, Any]:
        """Validate Supabase JWT token and extract user data"""
        try:
            payload = jwt.decode(
                token, 
                self.jwt_secret, 
                algorithms=["HS256"],
                audience="authenticated"
            )
            return payload
        except InvalidTokenError as e:
            raise AuthenticationError(f"Invalid token: {str(e)}")
    
    def get_tenant_id(self, token: str) -> str:
        """Extract tenant_id from JWT token"""
        payload = self.validate_token(token)
        return payload.get("user_metadata", {}).get("tenant_id")
```

### 7.3 API Key Management
```python
class APIKeyService:
    def generate_tenant_api_key(self, tenant_id: str) -> str:
        """Generate API key for tenant external access"""
        
    def validate_api_key(self, api_key: str) -> str:
        """Validate API key and return tenant_id"""
```

---

## 8. Error Handling

### 8.1 Exception Hierarchy
```python
class VoiceAgentException(Exception):
    """Base exception for voice agent platform"""
    pass

class AuthenticationError(VoiceAgentException):
    """Authentication/authorization errors"""
    pass

class TenantAccessError(VoiceAgentException):
    """Tenant isolation violations"""
    pass

class IntegrationError(VoiceAgentException):
    """External integration errors"""
    pass

class ValidationError(VoiceAgentException):
    """Request validation errors"""
    pass
```

### 8.2 Global Error Handler
```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

async def global_exception_handler(request: Request, exc: Exception):
    """Global error handler for all exceptions"""
    
    if isinstance(exc, AuthenticationError):
        return JSONResponse(
            status_code=401,
            content=ErrorResponse(
                message=str(exc),
                error_code="AUTH_INVALID"
            ).dict()
        )
    
    elif isinstance(exc, TenantAccessError):
        return JSONResponse(
            status_code=403,
            content=ErrorResponse(
                message=str(exc),
                error_code="TENANT_ACCESS_DENIED"
            ).dict()
        )
    
    # ... handle other exception types
    
    # Default server error
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="Internal server error",
            error_code="SERVER_ERROR"
        ).dict()
    )
```

### 8.3 Logging Strategy
```python
import structlog

logger = structlog.get_logger()

class RequestLoggingMiddleware:
    async def __call__(self, request: Request, call_next):
        """Log all requests with tenant context"""
        
        tenant_id = extract_tenant_id(request)
        
        logger.info(
            "api_request",
            method=request.method,
            path=request.url.path,
            tenant_id=tenant_id,
            user_agent=request.headers.get("user-agent")
        )
        
        response = await call_next(request)
        
        logger.info(
            "api_response",
            status_code=response.status_code,
            tenant_id=tenant_id
        )
        
        return response
```

---

## 9. Development Guidelines

### 9.1 Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app setup
│   ├── config.py              # Configuration management
│   ├── middleware/            # Custom middleware
│   ├── auth/                  # Authentication services
│   ├── integrations/          # External service integrations
│   │   ├── __init__.py
│   │   ├── base.py           # Base integration class
│   │   ├── openai.py         # OpenAI integration
│   │   ├── twilio.py         # Twilio integration
│   │   └── elevenlabs.py     # ElevenLabs integration
│   ├── models/               # Pydantic models
│   ├── services/             # Business logic services
│   ├── api/                  # API route handlers
│   │   ├── v1/
│   │   │   ├── integrations.py
│   │   │   ├── voice_agents.py
│   │   │   ├── conversations.py
│   │   │   └── analytics.py
│   └── utils/                # Utility functions
├── tests/                    # Test files
├── requirements.txt          # Python dependencies
├── Dockerfile               # Container configuration
└── docker-compose.yml      # Local development setup
```

### 9.2 Required Dependencies
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
asyncpg==0.29.0
supabase==2.0.0
httpx==0.25.2
cryptography==41.0.8
pyjwt==2.8.0
structlog==23.2.0
python-multipart==0.0.6
python-dotenv==1.0.0
pytest==7.4.3
pytest-asyncio==0.21.1
```

### 9.3 Configuration Management
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_key: str
    
    # Database
    database_url: str
    
    # Security
    encryption_key: str
    api_key_secret: str
    
    # External Services
    openai_api_key: Optional[str] = None
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    
    # App Config
    debug: bool = False
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 9.4 Testing Strategy
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers():
    """Generate valid JWT token for testing"""
    token = generate_test_jwt(
        user_id="test-user-id",
        tenant_id="test-tenant-id"
    )
    return {"Authorization": f"Bearer {token}"}

class TestIntegrations:
    def test_create_credential(self, client, auth_headers):
        """Test credential creation endpoint"""
        
    def test_tenant_isolation(self, client):
        """Test that tenants cannot access each other's data"""
        
    def test_credential_encryption(self):
        """Test credential encryption/decryption"""
```

---

## 10. Deployment Considerations

### 10.1 Environment Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
      - DATABASE_URL=${DATABASE_URL}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    depends_on:
      - redis
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
      
  worker:
    build: .
    command: celery worker -A app.worker
    environment:
      - CELERY_BROKER_URL=redis://redis:6379
```

### 10.2 Health Checks
```python
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers"""
    checks = {
        "database": await check_database_connection(),
        "supabase": await check_supabase_connection(),
        "redis": await check_redis_connection()
    }
    
    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503
    
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if all_healthy else "unhealthy",
            "checks": checks,
            "timestamp": datetime.utcnow().isoformat()
        }
    )
```

### 10.3 Monitoring & Observability
```python
from prometheus_client import Counter, Histogram, generate_latest

# Metrics
api_requests_total = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    """Collect metrics for monitoring"""
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    request_duration.observe(duration)
    
    api_requests_total.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    return response

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type="text/plain")
```

---

## Integration Checklist

### ✅ Before You Start
- [ ] Set up Python 3.11+ environment
- [ ] Install required dependencies
- [ ] Configure environment variables
- [ ] Set up Supabase connection
- [ ] Generate encryption keys

### ✅ Core Implementation
- [ ] Implement JWT authentication middleware
- [ ] Create tenant isolation service
- [ ] Build credential encryption system
- [ ] Implement integration testing framework
- [ ] Create external service connectors

### ✅ API Development
- [ ] Build integration management endpoints
- [ ] Implement voice agent endpoints
- [ ] Create conversation management API
- [ ] Add analytics endpoints
- [ ] Set up webhook handlers

### ✅ Security & Quality
- [ ] Add comprehensive error handling
- [ ] Implement rate limiting
- [ ] Add request/response logging
- [ ] Create comprehensive tests
- [ ] Set up monitoring and health checks

### ✅ Deployment Ready
- [ ] Configure Docker containers
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Test tenant isolation thoroughly
- [ ] Verify all integrations work

---

## Support & Documentation

### Key Integration Points with Frontend
1. **Authentication**: Frontend sends Supabase JWT, backend validates and extracts tenant_id
2. **API Calls**: All frontend requests go through your Python backend API
3. **Real-time Updates**: Backend updates Supabase, frontend gets real-time notifications
4. **File Uploads**: Backend handles file processing and storage

### Key Integration Points with Supabase
1. **Database Operations**: Use Supabase client for all database interactions
2. **Authentication**: Validate JWT tokens from Supabase Auth
3. **Real-time**: Trigger real-time updates via Supabase
4. **Storage**: Use Supabase storage for file uploads

### External Service Integration Patterns
1. **Credential Management**: Encrypt/decrypt credentials for each API call
2. **Error Handling**: Graceful handling of external service failures
3. **Rate Limiting**: Respect external service rate limits
4. **Webhook Security**: Validate webhook signatures from external services

This document provides everything needed to build a production-ready Python backend for the multi-tenant voice agent platform. Focus on security, tenant isolation, and robust error handling throughout your implementation.
