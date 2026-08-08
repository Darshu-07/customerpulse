from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./customerpulse.db"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    SECRET_KEY: str = "supersecretkey"
    CORS_ORIGINS_STR: str = "*"
    MAX_UPLOAD_SIZE_MB: int = 50
    AI_PROVIDER: str = "none"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    DEMO_MODE: bool = False
    DATA_DIR: str = "data"
    MODELS_DIR: str = "models"
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(",")]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
