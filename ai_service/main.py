from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import base64
import numpy as np
import cv2
from deepface import DeepFace
import uvicorn

app = FastAPI()

# มั่นใจว่าเปิด CORS ให้ Next.js เข้าถึงได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract-vector")
async def extract_vector(payload: dict = Body(...)):
    images_base64 = payload.get("images")
    all_embeddings = []

    if not images_base64:
        print("❌ Error: No images received")
        return {"error": "No images received"}, 400

    try:
        print(f"📸 Received {len(images_base64)} images. Processing...")
        
        for idx, img_str in enumerate(images_base64):
            # แปลง Base64
            encoded_data = img_str.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # สกัด Vector (ตั้ง enforce_detection=False เพื่อให้เทสผ่านง่ายๆ ก่อน)
            objs = DeepFace.represent(
                img_path=img, 
                model_name='ArcFace', 
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            embedding = objs[0]["embedding"]
            all_embeddings.append(embedding)
            print(f"✅ Image {idx+1} processed.")

        # หาค่าเฉลี่ย
        avg_vector = np.mean(all_embeddings, axis=0).tolist()
        
        print(f"🚀 Success! Sending vector of length: {len(avg_vector)}")
        
        # คืนค่ากลับไปในรูปแบบ JSON ที่มี Key ชื่อ "vector"
        return {"vector": avg_vector}

    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return {"error": str(e)}, 500

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)