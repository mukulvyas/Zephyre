.PHONY: install dev test lint build format

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

dev:
	@echo "Run 'make dev-backend' and 'make dev-frontend' in separate terminals."

test: test-backend test-frontend

test-backend:
	cd backend && pytest -v --cov=app/core --cov-report=term-missing

test-frontend:
	cd frontend && npm test -- --run

lint:
	cd backend && ruff check app tests
	cd frontend && npm run lint

format:
	cd backend && ruff format app tests
	cd frontend && npm run format
