from uuid import UUID

from sqlalchemy.orm import Session

from app.models.company import Company


class CompanyRepository:
    @staticmethod
    def create(db: Session, name: str, slug: str) -> Company:
        company = Company(name=name, slug=slug)
        db.add(company)
        db.commit()
        db.refresh(company)
        return company

    @staticmethod
    def get_by_id(db: Session, company_id: UUID) -> Company | None:
        return db.query(Company).filter(Company.id == company_id).first()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Company | None:
        return db.query(Company).filter(Company.slug == slug).first()

    @staticmethod
    def list_active(db: Session) -> list[Company]:
        return db.query(Company).filter(Company.is_active == True).all()
