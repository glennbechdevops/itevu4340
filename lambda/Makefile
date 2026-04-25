.PHONY: build clean deploy

BINARY_NAME=bootstrap
LAMBDA_ZIP=function.zip

build:
	@echo "Building Lambda function..."
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o $(BINARY_NAME) main.go
	@echo "Build complete: $(BINARY_NAME)"

clean:
	@echo "Cleaning up..."
	rm -f $(BINARY_NAME) $(LAMBDA_ZIP)
	@echo "Clean complete"

package: build
	@echo "Creating deployment package..."
	zip $(LAMBDA_ZIP) $(BINARY_NAME)
	@echo "Package created: $(LAMBDA_ZIP)"

deploy: package
	@echo "Deploy the function using Terraform from the infra directory"
	@echo "The function.zip file is ready for deployment"
