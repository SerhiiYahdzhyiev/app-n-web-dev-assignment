SERVICES = database backend frontend webserver recommend cache embed
DCMD = docker-compose

all: up

up:
	$(DCMD) up -d

down:
	$(DCMD) down

$(SERVICES):
	$(DCMD) up -d --build $@

.PHONY: $(SERVICES)
