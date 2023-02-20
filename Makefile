run:
	export NODE_OPTIONS=--openssl-legacy-provider && npm run dev

help:
	@echo "run: run server -- node version >= 17.0.0 need forced openssl==1.0.0"
