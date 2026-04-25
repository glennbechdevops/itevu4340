# Example Deployment

This is an example of how to use the Chaos Coffee Terraform module.

## Usage

1. Copy this directory to create your own deployment:

```bash
cp -r infra/example my-deployment
cd my-deployment
```

2. Edit `main.tf` and change `student_id`:

```hcl
student_id = "your-name-here"
```

3. Make sure Lambda is built:

```bash
cd ../../lambda
make package
cd ../../my-deployment
```

4. Deploy:

```bash
terraform init
terraform apply
```

5. Copy the `lambda_function_url` from outputs

6. Update webapp configuration:
   - `webapp/app.js` - Set `LAMBDA_URL`
   - `webapp/toxiproxy-config.json` - Set `upstream`

## Cleanup

```bash
terraform destroy
```

## Multiple Students

Each student should:
1. Create their own deployment directory
2. Use a unique `student_id`
3. Run `terraform apply` independently

Example:
```bash
# Student 1
mkdir alice-deployment
cd alice-deployment
# Create main.tf with student_id = "alice"
terraform apply

# Student 2
mkdir bob-deployment
cd bob-deployment
# Create main.tf with student_id = "bob"
terraform apply
```

This creates isolated resources per student.
