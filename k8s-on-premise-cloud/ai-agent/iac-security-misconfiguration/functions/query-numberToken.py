import boto3
import json

client = boto3.client("bedrock-runtime", region_name="us-east-1")

def count_tokens(text):
    response = client.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        contentType="application/json",
        accept="application/json",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1,
            "messages": [
                {
                    "role": "user",
                    "content": [{"type": "text", "text": text}]
                }
            ]
        })
    )
    
    response_body = json.loads(response['body'].read())
    return response_body['usage']['input_tokens']

# Sử dụng hàm
text = "Explain quantum computing in simple terms"
token_count = count_tokens(text)
print(f"Số tokens: {token_count}")
print(f"Chi phí ước tính: ${token_count * 3 / 1000000:.6f}")