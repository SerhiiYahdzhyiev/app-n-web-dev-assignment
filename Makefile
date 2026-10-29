SERVICES = database backend frontend webserver recommend cache embed
DCMD = docker compose

.PHONY: $(SERVICES)

all: up

up:
	@$(DCMD) up -d

down:
	@$(DCMD) down --remove-orphans

.PHONY: clean
clean:
	@$(DCMD) down --remove-orphans --rmi all -v

$(SERVICES):
	$(DCMD) up -d --build $@

