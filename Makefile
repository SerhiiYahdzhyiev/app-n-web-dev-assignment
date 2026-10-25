SERVICES = database backend frontend webserver recommend cache embed
DCMD = docker-compose

.PHONY: $(SERVICES)

.env: .env.example
	@cp .env.example .env

all: up

up:
	$(DCMD) up -d

down:
	$(DCMD) down

.PHONY: clean
clean:
	rm -rf frontend/.angular
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -rf backend/logs

$(SERVICES):
	$(DCMD) up -d --build $@

