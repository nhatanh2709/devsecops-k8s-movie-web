from flask import Flask, request, jsonify
import logging
import boto3
from botocore.exceptions import ClientError
import functools
import subprocess
import os
import tempfile
import json
from ai_agents import AIAgents

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# AWS Session Manager
class AWSSessionManager:
    def __init__(self):
        self.session = None
        self.initialize_session()
    
    def initialize_session(self):
        try:
            self.session = boto3.Session()
            sts = self.session.client('sts')
            sts.get_caller_identity()  # Validate credentials
            logger.info("✅ AWS session initialized")
            return True
        except Exception as e:
            logger.error(f"❌ AWS session failed: {e}")
            return False
    
    def get_client(self, service):
        return self.session.client(service) if self.session else None

aws_manager = AWSSessionManager()

def read_config_file_content(git_url, file_path):
    temp_dir = tempfile.mkdtemp()
    try:
        subprocess.run(['git', 'clone', git_url, temp_dir], check=True, capture_output=True)
        
        full_path = os.path.join(temp_dir, file_path)
        if not os.path.exists(full_path):
            logger.error(f"❌ File not found: {file_path}")
            return None
        
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        logger.info(f"📄 Read file content from {content}")
        return {
            'file_path': file_path,
            'content': content
        }
        
    except Exception as e:
        logger.error(f"❌ Error reading file: {e}")
        return None
    finally:
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)

def with_aws_session(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        kwargs['aws_manager'] = aws_manager
        return func(*args, **kwargs)
    return wrapper

def get_git_repo_content(git_url):
    temp_dir = tempfile.mkdtemp()
    try:
        subprocess.run(['git', 'clone', git_url, temp_dir], check=True, capture_output=True)
        logger.info(f"📂 Cloned repository to {temp_dir}")
        logger.info("📄 Changed files:", git_url)
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                if file.endswith(('.yaml', '.yml')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            print(f"📄 {file_path.replace(temp_dir, '')}")
                            print(content)
                            print("-" * 50)
                    except:
                        pass
                        
    except Exception as e:
        print(f"❌ Errror: {e}")

def get_changed_config_files(git_url):
    temp_dir = tempfile.mkdtemp()
    try:
        subprocess.run(['git', 'clone', git_url, temp_dir], check=True, capture_output=True)
        result = subprocess.run(
            ['git', 'diff', '--name-only', 'HEAD~1', 'HEAD'],
            cwd=temp_dir,
            capture_output=True,
            text=True,
            check=True
        )
        
        changed_files = [f for f in result.stdout.strip().split('\n') if f]
        config_files = [f for f in changed_files if f.endswith(('.yaml', '.yml', '.json'))]
        read_config_file_content(git_url=git_url, file_path=config_files[0]) if config_files else None
        return config_files
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        return []
    finally:
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)


@with_aws_session
def get_changed_files(git_url, aws_manager=None):
    """Get changed files from git repository."""
    if aws_manager and aws_manager.session:
        logger.info(f"🔗 Using AWS session in {aws_manager.session.region_name}")
    logger.info(f"Processing changes for: {git_url}")
    get_git_repo_content(git_url=git_url)
    return {"status": "processed"}

@app.route('/webhook/argocd', methods=['POST'])
@with_aws_session
def argocd_webhook(aws_manager=None):
    """Handle ArgoCD webhook requests."""
    try:
        data = request.get_json()
        logger.info(f"🔔 Received ArgoCD webhook event: {json.dumps(data, indent=2)}")
        if aws_manager:
            logger.info(f"🌍 AWS Region: {aws_manager.session.region_name}")
        
        if data and 'repo' in data:
            git_url = data['repo']
            logger.info(f"📥 Processing repository: {git_url}")
            AIAgents_instance = AIAgents()
            AIAgents_instance.get_best_configuration(git_url=git_url)
            
            return jsonify({
                "status": "success",
                "aws_region": aws_manager.session.region_name if aws_manager else None,
                # "result": result
            }), 200
            
    except Exception as e:
        logger.error(f"❌ Webhook error: {e}")
        return jsonify({"status": "error"}), 500

@app.route('/health')
@with_aws_session
def health_check(aws_manager=None):
    aws_status = "healthy" if aws_manager and aws_manager.session else "unhealthy"
    return jsonify({"aws": aws_status, "status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)