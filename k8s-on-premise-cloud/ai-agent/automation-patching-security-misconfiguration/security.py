import re
import time
from typing import Dict, List, Optional, Callable
from pathlib import Path
import os
import json
import hashlib
from functools import wraps
from rich.console import Console
import boto3
from botocore.exceptions import ClientError

console = Console()

class SecurityManager:
    def __init__(self):
        self.rate_limits: Dict[str, List[float]] = {}
        self.max_requests = 100  # Maximum requests per minute
        self.credential_cache: Dict[str, str] = {}

    def sanitize_input(self, input_str: str) -> str:
        """Sanitize user input to prevent command injection."""
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[;&|`$]', '', input_str)
        # Remove any attempts at command injection
        sanitized = re.sub(r'\b(rm|wget|curl|bash|sh)\b', '', sanitized, flags=re.IGNORECASE)
        return sanitized.strip()

    def validate_file_path(self, file_path: Path) -> bool:
        """Validate file path for security concerns."""
        try:
            # Convert to absolute path
            abs_path = file_path.resolve()
            
            # Check for path traversal attempts
            if '..' in str(file_path):
                console.print("[red]Path traversal detected[/red]")
                return False
                
            # Check file permissions
            if file_path.exists():
                if not os.access(file_path, os.R_OK):
                    console.print(f"[red]Insufficient permissions to read: {file_path}[/red]")
                    return False
                    
            return True
        except Exception as e:
            console.print(f"[red]Error validating file path: {e}[/red]")
            return False

    def rate_limit(self, key: str) -> bool:
        """Implement rate limiting for API calls."""
        current_time = time.time()
        if key not in self.rate_limits:
            self.rate_limits[key] = []
            
        # Remove requests older than 1 minute
        self.rate_limits[key] = [t for t in self.rate_limits[key] if current_time - t < 60]
        
        if len(self.rate_limits[key]) >= self.max_requests:
            console.print(f"[red]Rate limit exceeded for {key}[/red]")
            return False
            
        self.rate_limits[key].append(current_time)
        return True

    def secure_credentials(self, credentials: Dict[str, str]) -> Dict[str, str]:
        """Securely handle credentials."""
        try:
            # Hash sensitive values
            secure_creds = {}
            for key, value in credentials.items():
                if any(sensitive in key.lower() for sensitive in ['key', 'secret', 'password', 'token']):
                    # Store hash of sensitive values
                    secure_creds[key] = hashlib.sha256(value.encode()).hexdigest()
                    # Cache original value temporarily
                    self.credential_cache[key] = value
                else:
                    secure_creds[key] = value
            return secure_creds
        except Exception as e:
            console.print(f"[red]Error securing credentials: {e}[/red]")
            return {}

    def validate_aws_credentials(self) -> bool:
        """Validate AWS credentials and permissions."""
        try:
            session = boto3.Session()
            sts = session.client('sts')
            
            # Test credentials
            sts.get_caller_identity()
            identity = sts.get_caller_identity()
            if ':root' in identity['Arn']:
                console.print("[yellow]Using root credentials - IAM user operations not available[/yellow]")
                # Root has full permissions, so we can skip detailed IAM checks
                return True
            
            # Check for required permissions
            required_permissions = [
                'pricing:GetProducts',
                'ec2:DescribeInstances',
                'rds:DescribeDBInstances',
                's3:ListBuckets'
            ]
            
            iam = session.client('iam')
            console.print(f"[blue]iam credentials: {iam}[/blue]")
            user = iam.get_user()
            attached_policies = iam.list_attached_user_policies(UserName=user['User']['UserName'])
            console.print(f"[blue]iam attached policies: {attached_policies}[/blue]")
            # TODO: Implement proper permission checking
            # This is a simplified check
            return True
        except ClientError as e:
            console.print(f"[red]AWS credentials validation failed: {e}[/red]")
            return False
        except Exception as e:
            console.print(f"[red]Error validating AWS credentials: {e}[/red]")
            return False

    def validate_github_token(self, token: str) -> bool:
        """Validate GitHub token."""
        try:
            # TODO: Implement GitHub token validation
            # This is a placeholder
            return bool(token and len(token) > 0)
        except Exception as e:
            console.print(f"[red]Error validating GitHub token: {e}[/red]")
            return False

def security_decorator(func: Callable) -> Callable:
    """Decorator to add security checks to functions."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        security = SecurityManager()
        
        # Sanitize string inputs
        for key, value in kwargs.items():
            if isinstance(value, str):
                kwargs[key] = security.sanitize_input(value)
                
        # Rate limit API calls
        if not security.rate_limit(func.__name__):
            raise Exception("Rate limit exceeded")
            
        return func(*args, **kwargs)
    return wrapper

def validate_terraform_file(file_path: Path) -> bool:
    """Validate Terraform file for security best practices."""
    try:
        if not file_path.exists():
            return False
            
        content = file_path.read_text()
        
        # Check for hardcoded credentials
        credential_patterns = [
            r'aws_access_key\s*=\s*["\'][^"\']+["\']',
            r'aws_secret_key\s*=\s*["\'][^"\']+["\']',
            r'password\s*=\s*["\'][^"\']+["\']',
            r'token\s*=\s*["\'][^"\']+["\']'
        ]
        
        for pattern in credential_patterns:
            if re.search(pattern, content):
                console.print(f"[red]Hardcoded credentials found in {file_path}[/red]")
                return False
                
        # Check for overly permissive security groups
        permissive_patterns = [
            r'cidr_blocks\s*=\s*\[["\']0\.0\.0\.0/0["\']\]',
            r'from_port\s*=\s*0',
            r'to_port\s*=\s*65535'
        ]
        
        for pattern in permissive_patterns:
            if re.search(pattern, content):
                console.print(f"[yellow]Warning: Overly permissive security configuration in {file_path}[/yellow]")
                
        return True
    except Exception as e:
        console.print(f"[red]Error validating Terraform file: {e}[/red]")
        return False