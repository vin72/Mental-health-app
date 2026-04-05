.PHONY: check setup-env run-backend run-mobile

check:
	python scripts/check_setup.py

setup-env:
	cp -n backend/.env.example backend/.env || true
	cp -n mobile/.env.example mobile/.env || true
	@echo "Env templates copied (existing files kept)."

run-backend:
	./scripts/start_backend.sh

run-mobile:
	./scripts/start_mobile.sh
