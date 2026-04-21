// คำนวณความพร้อมของ AI (Health/Confidence) จากข้อมูลจริง
export const calculateAIHealth = (faceCount: number, userCount: number): string => {
  if (userCount === 0) return "0.0";
  
  const healthScore = (faceCount / userCount) * 100;

  const finalScore = Math.min(99.9, healthScore);
  
  return finalScore.toFixed(1);
};

// ดึงสถานะการเชื่อมต่อ
export const getSystemStatus = (loading: boolean, error: any): string => {
  if (loading) return "Syncing...";
  if (error) return "Neural Link Interrupted";
  return "Optimal";
};