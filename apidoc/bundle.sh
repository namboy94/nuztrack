swagger-cli validate openapi.yaml
redoc-cli build -o index.html openapi.yaml
cp index.html ../backend/src/main/resources/static/index.html