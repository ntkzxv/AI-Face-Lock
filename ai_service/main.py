from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import base64
import numpy as np
import cv2
from deepface import DeepFace
import uvicorn

app = FastAPI()

# เปิด CORS ให้ Next.js (Localhost) และที่อื่นๆ เข้าถึงได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
        print(f"📸 Received {len(images_base64)} images. Processing with SFace...")
        
        for idx, img_str in enumerate(images_base64):
            # 1. แปลงจาก Base64 เป็นรูปภาพ
            encoded_data = img_str.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # 3. ใช้โมเดล SFace (เบาและกินแรมน้อยกว่า ArcFace มาก)
            # ไม่ต้อง Resize เอง ปล่อยให้ DeepFace จัดการเพื่อความแม่นยำสูงสุด
            objs = DeepFace.represent(
                img_path=img, 
                model_name='SFace', 
                enforce_detection=False,
                detector_backend='opencv' # หรือใช้ 'retinaface' ถ้าต้องการความแม่นยำสูงสุด
            )
            
            if len(objs) > 0:
                embedding = objs[0]["embedding"]
                all_embeddings.append(embedding)
                print(f"✅ Image {idx+1} processed (Vector size: {len(embedding)})")
            else:
                print(f"⚠️ Image {idx+1}: No face detected")

        if not all_embeddings:
            return JSONResponse(status_code=400, content={"error": "No face detected in any images"})

        # 4. หาค่าเฉลี่ยของ Vector
        avg_vector = np.mean(all_embeddings, axis=0).tolist()
        
        print(f"🚀 Success! Sending vector of length: {len(avg_vector)}")
        
        return {"vector": avg_vector}

    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        # คืนค่า error พร้อมสถานะ 500
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)