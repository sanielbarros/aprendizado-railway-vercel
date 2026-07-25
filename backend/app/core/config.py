from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FeedbackHub API"
    environment: str = "development"
    database_url: str

    class Config:
        env_file = ".env"


settings = Settings()
