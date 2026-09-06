# 💰 Expense Tracker

Ứng dụng quản lý chi tiêu cá nhân được xây dựng với **React** và **Tailwind CSS**, giúp theo dõi các khoản chi một cách trực quan và nhanh chóng. Toàn bộ dữ liệu được lưu trên **localStorage**, không cần backend hay cơ sở dữ liệu.

## ✨ Tính năng nổi bật

### Quản lý khoản chi
- ➕ Thêm khoản chi với tên, số tiền, danh mục, **ngày chi tiêu** và **ghi chú**.
- ✏️ Chỉnh sửa khoản chi ngay tại danh sách.
- 🗑️ Xoá khoản chi với hộp thoại xác nhận hiện đại (thay cho `window.confirm`).
- 🔍 Tìm kiếm theo tên, ghi chú hoặc danh mục (không phân biệt dấu/hoa thường).
- ↕️ Sắp xếp: mới nhất, cũ nhất, cao → thấp, thấp → cao.
- 🏷️ Lọc theo danh mục + 8 danh mục chi tiêu phong phú.

### Thống kê & biểu đồ
- 📊 4 thẻ thống kê: tổng chi tiêu, số khoản chi, trung bình, danh mục lớn nhất.
- 🍩 Biểu đồ tròn tỷ trọng theo danh mục (kèm bảng tỷ lệ %).
- 📈 Biểu đồ cột xu hướng chi tiêu 7 ngày gần nhất.
- 📅 Lọc theo: tất cả, hôm nay, tuần này, tháng này, năm nay.

### Ngân sách & dữ liệu
- 🎯 Đặt ngân sách hàng tháng, cảnh báo khi gần chạm hoặc vượt ngân sách.
- ⬇️ Xuất dữ liệu ra **JSON** hoặc **CSV**.
- ⬆️ Nhập dữ liệu từ file JSON (đã sao lưu).
- 💾 Tự động lưu dữ liệu bằng **localStorage**, giữ nguyên sau khi tải lại trang.
- 🔔 Thông báo toast khi thêm / sửa / xoá / xuất / nhập.

## 🛠️ Công nghệ sử dụng

- ⚛️ React (`useState`, `useEffect`, `useRef`, `useMemo`)
- 🎨 Tailwind CSS (v4)
- 📈 Recharts
- ⚡ Vite + vite-plugin-pwa

## 🚀 Chạy thử

```bash
npm install
npm run dev      # Chạy môi trường dev
npm run build    # Build production
npm run lint     # Kiểm tra code
```

## 📷 Giao diện
https://expense-tracker-pdp.vercel.app/
Giao diện Dark Mode + Glassmorphism, tối ưu cho cả mobile và desktop (responsive 2 cột trên màn hình lớn).
