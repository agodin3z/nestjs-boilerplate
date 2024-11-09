dev:
	docker compose -f docker-compose-dev.yml up --build -V

deploy:
	docker compose up -d
