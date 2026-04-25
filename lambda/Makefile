.PHONY: all build clean package

BINARY_NAME=bootstrap
LAMBDA_ZIP=function.zip

# Default target creates the deployment package
all: package

build:
	@echo "Installing dependencies..."
	go mod tidy
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
	@echo "Ready for Terraform deployment"
