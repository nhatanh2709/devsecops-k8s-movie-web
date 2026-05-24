import boto3
from typing import List, Dict, Optional
from dataclasses import dataclass
from .error_collector import NormalizedError
import json

@dataclass
class FixPlan:
    error_type: str
    description: str
    changes: List[Dict[str, str]]
    confidence: float
    reasoning: str

class BedrockAgent:
    def __init__(self, region_name: str = "us-west-2"):
        self.bedrock = boto3.client(
            service_name="bedrock-runtime",
            region_name=region_name
        )
        self.model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    def analyze_errors(self, errors: List[NormalizedError]) -> List[FixPlan]:
        """Analyze errors and generate fix plans using Bedrock."""
        fix_plans = []
        
        for error in errors:
            # Prepare the prompt for Bedrock
            prompt = self._create_analysis_prompt(error)
            
            # Get response from Bedrock
            response = self._get_bedrock_response(prompt)
            
            # Parse the response into a fix plan
            fix_plan = self._parse_fix_plan(response, error)
            if fix_plan:
                fix_plans.append(fix_plan)
        
        return fix_plans

    def _create_analysis_prompt(self, error: NormalizedError) -> str:
        """Create a prompt for error analysis."""
        return f"""Analyze the following Terraform error and provide a fix plan:

Error Type: {error.error_type}
Message: {error.message}
Location: Line {error.location['line']}, Column {error.location['column']}
Context:
{error.context['surrounding_code']}

Please provide:
1. A description of the issue
2. The necessary changes to fix it
3. Your confidence level (0-1)
4. Your reasoning for the fix

Format your response as JSON with the following structure:
{{
    "description": "string",
    "changes": [
        {{
            "file": "string",
            "line": number,
            "content": "string"
        }}
    ],
    "confidence": number,
    "reasoning": "string"
}}"""

    def _get_bedrock_response(self, prompt: str) -> str:
        """Get response from Bedrock."""
        try:
            response = self.bedrock.invoke_model(
                modelId=self.model_id,
                body=prompt
            )
            return response['body'].read().decode('utf-8')
        except Exception as e:
            print(f"Error getting Bedrock response: {e}")
            return ""

    def _parse_fix_plan(self, response: str, error: NormalizedError) -> Optional[FixPlan]:
        """Parse Bedrock response into a FixPlan."""
        try:
            data = json.loads(response)
            return FixPlan(
                error_type=error.error_type,
                description=data.get("description", "No description provided"),
                changes=data.get("changes", []),
                confidence=float(data.get("confidence", 0.0)),
                reasoning=data.get("reasoning", "No reasoning provided")
            )
        except Exception as e:
            print(f"Error parsing fix plan: {e}\nRaw response: {response}")
            return None 