swagger-cli validate openapi.yaml
redoc-cli build -o index.html openapi.yaml
cp index.html ../src/main/resources/static/index.html