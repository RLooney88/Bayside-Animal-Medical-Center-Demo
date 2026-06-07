"""Generate animal images using the official OpenAI Images API."""
import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv(Path(__file__).parent / ".env")

API_KEY = os.environ.get("OPENAI_API_KEY", "")
OUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "images" / "animals"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = {
    "dog-puppy": "A joyful golden retriever puppy on green grass, warm sunlight, professional pet photography, no text, no watermark",
    "dog-adult": "A healthy happy adult labrador retriever in a park, warm afternoon light, professional pet photography, no text",
    "dog-senior": "A gentle senior golden retriever resting peacefully indoors, warm lighting, dignified, professional pet photography, no text",
    "cat-kitten": "An adorable playful tabby kitten on a soft white blanket, warm natural light, professional pet photography, no text",
    "cat-adult": "A healthy adult tabby cat sitting on a windowsill, warm sunlight, professional pet photography, no text",
    "rabbit-adult": "A healthy adult lop rabbit sitting alertly on grass, warm afternoon light, professional pet photography, no text",
}

async def generate_one(client, slug, prompt):
    out = OUT_DIR / f"{slug}.png"
    if out.exists():
        print(f"SKIP {slug} (exists)")
        return
    result = await client.images.generate(model="gpt-image-1", prompt=prompt, size="1024x1024")
    image_b64 = result.data[0].b64_json
    out.write_bytes(base64.b64decode(image_b64))
    print(f"OK {slug} -> {out}")

async def main():
    if not API_KEY:
        raise SystemExit("OPENAI_API_KEY is required")
    client = AsyncOpenAI(api_key=API_KEY)
    for slug, prompt in PROMPTS.items():
        await generate_one(client, slug, prompt)
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
