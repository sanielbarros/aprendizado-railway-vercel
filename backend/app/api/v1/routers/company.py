from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.company import CompanyCreate, CompanyResponse
from app.services.company import CompanyService

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("", response_model=CompanyResponse, status_code=201)
def create_company(company_data: CompanyCreate, db: Session = Depends(get_db)):
    try:
        return CompanyService.create_company(db, company_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: UUID, db: Session = Depends(get_db)):
    try:
        return CompanyService.get_company(db, company_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("", response_model=list[CompanyResponse])
def list_companies(db: Session = Depends(get_db)):
    return CompanyService.list_companies(db)
