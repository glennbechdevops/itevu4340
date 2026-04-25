# Dev Container Configuration

This project includes a VS Code Dev Container configuration for a consistent development environment.

## What's Included

### Tools
- **Terraform** - Infrastructure as Code
- **AWS CLI** - AWS command-line interface
- **Go 1.21** - Lambda function development
- **Docker-in-Docker** - Run ToxiProxy containers
- **Node.js** - JavaScript tools

### VS Code Extensions
- **Claude Code** - AI pair programming
- **HashiCorp Terraform** - Terraform syntax and validation
- **Go** - Go language support
- **AWS Toolkit** - AWS resource management
- **Docker** - Container management

### Port Forwarding
- **8000** - ToxiProxy (webapp traffic)
- **8474** - ToxiProxy API (control plane)

## Usage

### Option 1: GitHub Codespaces

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for container to build and setup to complete
3. Configure AWS credentials:
   ```bash
   aws configure
   ```
4. Start the lab:
   ```bash
   cd lambda && make package
   ```

### Option 2: Local VS Code

1. Install VS Code and the "Dev Containers" extension
2. Open this folder in VS Code
3. Click "Reopen in Container" when prompted
4. Wait for container to build
5. Configure AWS credentials (will use your local ~/.aws if mounted)

## AWS Credentials

The devcontainer mounts your local `~/.aws` directory, so your existing AWS credentials will be available.

If you don't have credentials configured:

```bash
aws configure
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`
- Default output format: `json`

## Verify Setup

After the container is ready:

```bash
# Check all tools
terraform version
aws sts get-caller-identity
go version
docker ps

# Build Lambda
cd lambda
make package

# Should see function.zip created
ls -lh function.zip
```

## Troubleshooting

### AWS credentials not found

If running in Codespaces or container doesn't mount ~/.aws:

```bash
aws configure
# Enter your credentials
```

### Docker daemon not running

The devcontainer uses Docker-in-Docker. If docker commands fail:

```bash
sudo service docker start
```

### Go module errors

Download dependencies:

```bash
cd lambda
go mod download
```

### Terraform not found

Rebuild the container:
- VS Code: Cmd/Ctrl+Shift+P → "Dev Containers: Rebuild Container"
- Codespaces: Rebuild in settings

## Customization

To add more tools, edit `.devcontainer/devcontainer.json`:

```json
{
  "features": {
    "ghcr.io/devcontainers/features/your-tool:1": {}
  }
}
```

See available features: https://containers.dev/features
