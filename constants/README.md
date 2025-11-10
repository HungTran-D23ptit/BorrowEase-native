# Thư mục `constants`

Mục đích: chứa các hằng số dùng xuyên suốt ứng dụng (theme, routes, keys).

Cách dùng chuẩn:

- `constants/theme.js` — màu sắc và spacing chung.
- `constants/routes.js` — tên route constants.
- `constants/admin/` và `constants/user/` — nếu có cấu hình riêng cho từng role (ví dụ permission keys).

Quy tắc:

- Chỉ chứa dữ liệu tĩnh hoặc cấu hình; không đưa logic vào đây.
