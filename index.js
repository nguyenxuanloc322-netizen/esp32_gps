import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// 🟢 Lấy chuỗi kết nối MongoDB từ biến môi trường Railway
const mongoURI = process.env.MONGO_URL;

// 🧠 Kết nối tới MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Đã kết nối MongoDB thành công!"))
  .catch(err => console.error("❌ Lỗi MongoDB:", err));

// 📦 Định nghĩa cấu trúc dữ liệu GPS
const gpsSchema = new mongoose.Schema({
  device_id: String,
  latitude: Number,
  longitude: Number,
  speed: Number,
  timestamp: { type: Date, default: Date.now }
});
const GPS = mongoose.model("GPS", gpsSchema);

// 📡 API nhận dữ liệu GPS từ ESP32
app.post("/gps", async (req, res) => {
  try {
    const { device_id, latitude, longitude, speed } = req.body;
    const data = new GPS({ device_id, latitude, longitude, speed });
    await data.save();
    res.json({ success: true, message: "✅ Đã lưu GPS vào MongoDB!" });
  } catch (error) {
    console.error("❌ Lỗi khi lưu dữ liệu:", error);
    res.status(500).json({ success: false, message: "Lỗi khi lưu dữ liệu" });
  }
});

// 🏠 Trang chủ test server
app.get("/", (req, res) => {
  res.send("🚗 ESP32 GPS Server đang hoạt động!");
});

// 🚀 Railway tự cấp PORT động
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));
