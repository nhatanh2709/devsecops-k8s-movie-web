import typer
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from typing import Optional
import json
import os
import subprocess
from botocore.exceptions import ClientError
import boto3
from security import SecurityManager, security_decorator, validate_terraform_file


app = typer.Typer()
console = Console()
security = SecurityManager()

class ValidationAWSCredential: 
    def __init__(self, profile: Optional[str] = None):
        self.profile = profile
        self.session = None

    def validate_credentials(self) -> bool:
        try:
            if self.profile:
                self.session = boto3.Session(profile_name=self.profile)
            else:
                self.session = boto3.Session()

            sts_client = self.session.client('sts')
            sts_client.get_caller_identity()
            console.print(Panel.fit("[bold green]✅ AWS credentials are valid.[/bold green]"))
            return True
        except ClientError as e:
            console.print(Panel.fit(f"[bold red]❌ Invalid AWS credentials: {e}[/bold red]"))
            return False