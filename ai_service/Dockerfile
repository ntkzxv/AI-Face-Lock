# ใช้ Python เวอร์ชันที่เสถียรกับงาน AI
FROM python:3.10-slim

# ติดตั้ง lib สำหรับ OpenCV (ตัวนี้สำคัญมาก ไม่งั้นรัน AI ไม่ขึ้น)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# ตั้งโฟลเดอร์ทำงานใน Container
WORKDIR /app

# ก๊อปไฟล์ requirements ไปลงก่อนเพื่อประหยัดเวลา Build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ก๊อปโค้ดทั้งหมดตามเข้าไป
COPY . .

# สั่งรัน FastAPI ด้วย Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]