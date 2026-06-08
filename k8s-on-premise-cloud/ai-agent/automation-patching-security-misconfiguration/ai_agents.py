import boto3
from typing import Optional, Dict, Any, Union, Tuple
from dataclasses import dataclass
from collections import Counter
from datetime import datetime
import json
import time
from pathlib import Path
import os
import json
import subprocess
import requests
import time
import re 
import random
import string
import glob
import logging
import tempfile
import typer
import yaml
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = typer.Typer()


class AIAgents:
    services_total_cost = 0 
    def __init__(self, region_name: str = "us-east-1", ollama_host="http://171.235.190.178:8081"):
        self.pricing_client = boto3.client('pricing', region_name=region_name)
        self.bedrock = boto3.client('bedrock-runtime', region_name=region_name)
        self.ollama_host = ollama_host
        self.region = region_name
        
    def _get_ec2_pricing_key(self, instance_type: str, os: str = 'Linux', tenancy: str = 'Shared') -> str:
        """Create a hashable key for pricing cache."""
        return f"{instance_type}-{os}-{tenancy}"

    def read_tf_files(self, directory_path):
        tf_files_data = {}
        
        tf_files = [f for f in os.listdir(directory_path) if f.endswith('.tf')]
        
        for file_name in tf_files:
            file_path = os.path.join(directory_path, file_name)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    tf_files_data[file_name] = file.read()
            except Exception as e:
                print(f"Lỗi khi đọc file {file_name}: {e}")
                tf_files_data[file_name] = None
    
        return tf_files_data


    def generate_random_string(self, length: int = 12) -> str:
        return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length))
    
    def load_config_from_file(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data

    def sanitize_json_output(self, text: str) -> str:
        try:
            json.loads(text)
            return text
        except json.JSONDecodeError:
            pass
        json_patterns = [
            r'\{[\s\S]*\}',  # Tìm { ... }
            r'\[[\s\S]*\]',  # Tìm [ ... ]
        ]
        
        for pattern in json_patterns:
            matches = re.findall(pattern, text, re.DOTALL)
            for match in matches:
                try:
                    json.loads(match)
                    return match
                except json.JSONDecodeError:
                    cleaned = self._clean_json_string(match)
                    try:
                        json.loads(cleaned)
                        return cleaned
                    except json.JSONDecodeError:
                        continue
        return self._extract_json_from_code_blocks(text)

    def _clean_json_string(self, json_str: str) -> str:
        json_str = re.sub(r',\s*([}\]])', r'\1', json_str)
        json_str = re.sub(r'//.*', '', json_str)
        json_str = re.sub(r'/\*[\s\S]*?\*/', '', json_str)
        json_str = re.sub(r"'(.*?)'", r'"\1"', json_str)
        json_str = ''.join(char for char in json_str if ord(char) < 128)
        json_str = re.sub(r'\s+', ' ', json_str).strip()
        return json_str
    
    def read_config_file_content(self, git_url, file_path):
        temp_dir = tempfile.mkdtemp()
        try:
            subprocess.run(['git', 'clone', git_url, temp_dir], check=True, capture_output=True)
            
            full_path = os.path.join(temp_dir, file_path)
            if not os.path.exists(full_path):
                logger.error(f"❌ File not found: {file_path}")
                return None
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
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

    def get_list_of_config_changes_file(self, git_url):
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
            return config_files
        except Exception as e:
            logger.error(f"❌ Error: {e}")
            return []
        finally:
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)

    def get_changed_config_files(self, git_url):
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
            data_configuration = ""
            for sub_file_path in config_files:
                file_content = self.read_config_file_content(git_url=git_url, file_path=sub_file_path)
                data_configuration += file_content['content'] + "\n"
            return data_configuration;
            
        except Exception as e:
            logger.error(f"❌ Error: {e}")
            return []
        finally:
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)

    def blue_to_green(self, data):
        if isinstance(data, dict):
            return {blue_to_green(k): blue_to_green(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [blue_to_green(item) for item in data]
        elif isinstance(data, str):
            return data.replace('blue', 'green').replace('Blue', 'Green')
        else:
            return data

    def push_to_gitlab_directly(self, file_content, gitlab_url, access_token, branch="main"):
        try:
            # Đổi từ blue sang green trong URL
            gitlab_url = gitlab_url.replace('movie-web-frontend-blue', 'movie-web-frontend-green')
            
            project_path = gitlab_url.replace('https://gitlab.com/', '').replace('.git', '')
            project_path_encoded = project_path.replace('/', '%2F')
            
            api_url = f"https://gitlab.com/api/v4/projects/{project_path_encoded}/repository/files/frontend-deployment.yaml"
            
            headers = {
                "Private-Token": access_token,
                "Content-Type": "application/json"
            }
            
            data = {
                "branch": branch,
                "content": file_content,
                "commit_message": "Update frontend-deployment.yaml with security improvements",
                "encoding": "text"
            }
            
            check_response = requests.get(api_url, headers=headers, params={"ref": branch})
            
            if check_response.status_code == 200:
                response = requests.put(api_url, headers=headers, json=data)
                action = "updated"
            else:
                response = requests.post(api_url, headers=headers, json=data)
                action = "created"
            
            if response.status_code in [200, 201]:
                print(f"✅ File đã được {action} thành công trên GitLab")
                return True
            else:
                print(f"❌ Lỗi: {response.status_code} - {response.text}")
                return False
                    
        except Exception as e:
            print(f"❌ Lỗi khi push: {e}")
            return False
    
    def get_git_repo_content(self, git_url):
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
        
    def _extract_json_from_code_blocks(self, text: str) -> str:
        code_block_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
        matches = re.findall(code_block_pattern, text, re.IGNORECASE)
        
        for match in matches:
            try:
                json.loads(match)
                return match
            except json.JSONDecodeError:
                cleaned = self._clean_json_string(match)
                try:
                    json.loads(cleaned)
                    return cleaned
                except json.JSONDecodeError:
                    continue
        lines = text.split('\n')
        json_candidates = []
        
        for line in lines:
            line = line.strip()
            if (line.startswith('{') and line.endswith('}')) or \
            (line.startswith('[') and line.endswith(']')):
                json_candidates.append(line)
        
        for candidate in json_candidates:
            try:
                json.loads(candidate)
                return candidate
            except json.JSONDecodeError:
                continue
        return '{}'
    
    def extract_yaml_from_response(self, response_text: str, gitlab_url: str):
        """Trích xuất cấu hình YAML từ response"""
        try:
            yaml_match = re.search(r'```(?:yaml)?\s*(apiVersion:.+?)\n```', response_text, re.DOTALL)
            if not yaml_match:
                yaml_match = re.search(r'(apiVersion:.+?)(?=\n\s*\n|$)', response_text, re.DOTALL)
            
            if yaml_match:
                yaml_content = yaml_match.group(1).strip()
                yaml_content = re.sub(r'^```yaml|^```|\n```$', '', yaml_content).strip()
                logger.info(f"Extracted YAML Content: {yaml_content}")
                gitlab_url = gitlab_url
                access_token = ""
                self.push_to_gitlab_directly(
                    file_content=yaml_content,
                    gitlab_url=gitlab_url,
                    access_token=access_token,
                    branch="main"
                )
                return yaml.dump(yaml.safe_load(yaml_content), dèfault_flow_style=False, indent=2)
            return None
        except Exception:
            return None
    
    
    def get_best_configuration(self, git_url) -> Any:
        try: 
            logger.info("Starting security best configuration generation...")
            policy_configuration_file = (
                glob.glob('./opa-rule/network/*.yaml') + 
                glob.glob('./opa-rule/runtime/*.yaml')
            )
            AIAgents_instance = AIAgents()  
            all_configurations = ""
            data_trainning = AIAgents_instance.get_changed_config_files(git_url=git_url)
            logger.info(f"Data tranning: {git_url}")
            for file_path in policy_configuration_file:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        network_checks = f.read()
                        all_configurations += f"=== Policy File: {file_path} ===\n{network_checks}\n\n"
                except Exception as e:
                    logger.warning(f"Could not read policy file {file_path}: {str(e)}")
                    continue
            print(all_configurations)
            prompt = f"""
            You are a senior Kubernetes infrastructure and DevSecOps engineer with expertise in:
            - Production-grade Kubernetes deployments
            - OPA/Gatekeeper compliance
            - Security, resource management, and operational best practices

            === TASK ===
            Analyze the provided Kubernetes configuration and **update only existing resources**
            to make them production-ready and fully compliant with all active policies.

            INPUTS:
            1. Current Kubernetes manifests:
            {data_trainning}

            2. Active OPA/Gatekeeper policies:
            {all_configurations}

            === OBJECTIVE ===
            Update **only the existing workloads** in the input:
            - Do NOT create any new ServiceAccounts, Deployments, ConfigMaps, Secrets, or other resources.
            - Only modify and optimize the current configuration for production readiness and policy compliance.

            === REQUIREMENTS ===
            1. ✅ **Resource optimization (MANDATORY)**
            - Every container **MUST define**:
            - `resources.requests.cpu`
            - `resources.requests.memory`
            - `resources.requests.ephemeral-storage`
            - `resources.limits.cpu`
            - `resources.limits.memory`
            - `resources.limits.ephemeral-storage`
            - Values must comply with OPA/Gatekeeper constraints and be production-safe.
            - No container may omit `ephemeral-storage` requests or limits.

            2. ⚡ **OPA/Gatekeeper Compliance**
            - Apply **all** listed policies strictly.
            - Respect image exemptions and namespace selectors.
            - Automatically fix any violations **only within existing resources**.
            - Do not weaken or bypass any policy constraints.

            3. 🛡 **Production hardening**
            - Preserve all existing:
            - ServiceAccounts
            - Volumes
            - Volume mounts
            - imagePullSecrets
            - Labels and selectors
            - Namespace and rollout strategies
            - Maintain rolling update strategies and operational best practices.

            4. 📋 **OUTPUT REQUIREMENTS**
            - Output **only** the updated Kubernetes YAML manifests.
            - No explanations, no comments, no markdown.
            - No new resources.
            - Manifests must be fully deployable and OPA-compliant.

            5. 🔄 **Consistent renaming**
            - Rename all `blue` → `green` references consistently in:
            - `metadata.name`
            - labels (`version`, `app.kubernetes.io/version`, etc.)
            - selectors
            - ConfigMap, Secret, and volume references

            === FINAL CHECK ===
            Ensure **every container** has CPU, memory, and **ephemeral-storage**
            defined for both `requests` and `limits`,
            and all changes are applied **in-place** without introducing new resources.
            Don't add any CRD Configurations

            === ABSOLUTE OUTPUT CONSTRAINT (NON-NEGOTIABLE) ===
            This task is strictly **IN-PLACE MODIFICATION ONLY**.

            You are **NOT ALLOWED** to introduce, generate, or infer ANY new Kubernetes resources.

            🚫 FORBIDDEN ACTIONS:
            - Adding new YAML documents (`---`)
            - Adding any new `kind`, including but not limited to:
            Service, ConfigMap, Secret, Ingress, ServiceAccount,
            HorizontalPodAutoscaler, PodDisruptionBudget, Job, CronJob
            - Adding new volumes that reference ConfigMaps or Secrets
            - Adding new annotations or labels that did not already exist

            ⚠️ HARD FAILURE CONDITIONS:
            - If the output contains ANY resource not present in the input
            - If the number of Kubernetes manifests differs from the input
            - If any `kind` appears that was not in the original manifests

            If a policy violation cannot be fixed **without creating a new resource**,
            you MUST leave that violation unfixed and keep the original configuration unchanged.

            Only modify existing fields inside existing resources.
            """



            response = AIAgents_instance.bedrock.converse(
                        modelId="us.meta.llama4-scout-17b-instruct-v1:0",
                        messages=[{"role": "user", "content": [{"text": prompt}]}],
                        inferenceConfig={
                            "maxTokens": 1000,
                            "temperature": 0.1,
                            "topP": 0.9,
                        }
                    )
            best_configuration = response['output']['message']['content'][0]['text'].strip()
            logger.info(f"Best Configuration Response: {best_configuration}")
            yaml_config = AIAgents_instance.extract_yaml_from_response(best_configuration, gitlab_url=git_url)
            return
        except Exception as e:
            print(f"Error in get_security_best_configiuration_generation: {str(e)}")
            return {
                "error": str(e)
            }
            
@app.command()  
def get_best_configuration(self, git_url) -> Any:
    try: 
        logger.info("Starting security best configuration generation...")
        policy_configiuration_file = (
            glob.glob('./opa-rule/network/*.yaml') + 
            glob.glob('./opa-rule/runtime/*.yaml')
        )
        AIAgents_instance = AIAgents()  
        all_configurations = ""
        data_trainning = AIAgents_instance.get_changed_config_files(git_url=git_url)
        logger.info(f"Data tranning: {git_url}")
        for file_path in policy_configiuration_file:
            network_checks = open(file_path, 'r', encoding='utf-8').read()
            all_configurations += network_checks + "\n"
        prompt = f"""
            You are a Kubernetes infrastructure engineer. Analyze and optimize this configuration for production infrastructure.

            TASK:
            - Input configuration: {data_trainning}
            - Infrastructure requirements: {all_configurations}
            - OUTPUT: Production-ready infrastructure YAML

            FOCUS: Infrastructure hardening & production readiness
            APPROACH: Apply infrastructure best practices
            OUTPUT: Optimized YAML for production use
            """    
        response = AIAgents_instance.bedrock.converse(
                    modelId="us.meta.llama4-scout-17b-instruct-v1:0",
                    messages=[{"role": "user", "content": [{"text": prompt}]}],
                    inferenceConfig={
                        "maxTokens": 1000,
                        "temperature": 0.1,
                        "topP": 0.9,
                    }
                )
        best_configuration = response['output']['message']['content'][0]['text'].strip()
        yaml_config = AIAgents_instance.extract_yaml_from_response(response_text=best_configuration, gitlab_url=git_url)
        
        return
    except Exception as e:
        print(f"Error in get_security_best_configiuration_generation: {str(e)}")
        return {
            "error": str(e)
        }

if __name__ == "__main__":
    app()
