#!/bin/bash

echo "Setting up Chaos Engineering Lab environment..."

# Install additional tools
sudo apt-get update
sudo apt-get install -y curl zip unzip jq

# Verify installations
echo ""
echo "Installed versions:"
terraform version
aws --version
go version
docker --version

# Setup Go workspace
echo ""
echo "Setting up Go workspace..."
cd /workspaces/*/lambda
go mod download || true

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Build Lambda: cd lambda && make package"
echo "3. Deploy infrastructure: see QUICKSTART.md"
echo ""
