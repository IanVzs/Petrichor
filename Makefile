# 定义变量
DOCKER_IMAGE_NAME := petrichor
GIT_COMMIT := $(shell git rev-parse --short HEAD)
PORT := 9528

build-frontend:
	# export NODE_OPTIONS=--openssl-legacy-provider && npm run build:prod
	npm run build:prod

build-docker:
	docker build -t $(DOCKER_IMAGE_NAME):v$(GIT_COMMIT) .

build: build-frontend build-docker

run:
	docker run -d -p $(PORT):80 --name $(DOCKER_IMAGE_NAME) $(DOCKER_IMAGE_NAME):v$(GIT_COMMIT)

dev:
	# export NODE_OPTIONS=--openssl-legacy-provider && npm run dev
	npm run dev

clean:
	@docker ps -a --filter "name=$(DOCKER_IMAGE_NAME)" --format "{{.ID}}" | xargs -r docker stop
	@docker ps -a --filter "name=$(DOCKER_IMAGE_NAME)" --format "{{.ID}}" | xargs -r docker rm

update:
	npm update

help:
	@echo "Available make commands:"
	@echo "  build-frontend: Build the frontend for production."
	@echo "  build-docker: Build the Docker image with the current Git commit SHA as the tag."
	@echo "  build: Run both build-frontend and build-docker commands."
	@echo "  run: Run the Docker container on port $(PORT) mapping to internal port 80."
	@echo "  dev: Run the development server with the necessary environment variable for newer Node.js versions."
	@echo "  update: 更新前端组件适配高版本npm(主要针对于openssl)`npm update`"
	@echo "  help: Display this help message."
