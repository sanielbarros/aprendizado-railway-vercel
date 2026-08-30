from uuid import UUID

from sqlalchemy.orm import Session

from app.models.company import Company
from app.repositories.company import CompanyRepository
from app.schemas.company import CompanyCreate


class CompanyService:
    @staticmethod
    def create_company(db: Session, company_data: CompanyCreate) -> Company:
        # Verificar se slug já existe
        existing = CompanyRepository.get_by_slug(db, company_data.slug)
        if existing:
            raise ValueError(f"Slug '{company_data.slug}' já existe")

        return CompanyRepository.create(
            db, name=company_data.name, slug=company_data.slug
        )

    @staticmethod
    def get_company(db: Session, company_id: UUID) -> Company:
        company = CompanyRepository.get_by_id(db, company_id)
        if not company:
            raise ValueError(f"Empresa com ID {company_id} não encontrada")
        return company

    @staticmethod
    def list_companies(db: Session) -> list[Company]:
        return CompanyRepository.list_active(db)
