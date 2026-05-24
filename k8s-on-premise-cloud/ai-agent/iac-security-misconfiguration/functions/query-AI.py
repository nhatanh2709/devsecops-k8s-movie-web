import boto3
import json

client = boto3.client("bedrock-runtime", region_name="us-west-2")

# Định dạng đúng cho Claude 3
body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 20,
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": "Explain quantum computing in simple terms"}]
        }
    ]
})

response = client.invoke_model(
    modelId="anthropic.claude-3-haiku-20240307-v1:0",
    body=body
)

# Parse response
response_body = json.loads(response['body'].read())
print(response_body['content'][0]['text'])

# Để xem số lượng tokens sử dụng
print(f"\n--- Token Usage ---")
print(f"Input tokens: {response_body['usage']['input_tokens']}")
print(f"Output tokens: {response_body['usage']['output_tokens']}")
print(f"Total tokens: {response_body['usage']['input_tokens'] + response_body['usage']['output_tokens']}")