# CVE allows atttackers to bypass path-based restrictions and access unauthorized endpoints
# Tiêm arbitrary directives vào cấu hình NGINX sau đó được kiểm tra bởi nginx -t 
# vì chỉ nginx -t chứ ko có quyền restart nên directives sẽ khó thực thi => Tìm directive thực thi code khi kiểm tra (Directive liên quan đến external modules)

# 1: Sử dụng load_module directive nhưng nó phải được cài đặt khi bắt đầu quá trinh cài đặt NGINX (helm, thủ công) => ko làm được
# 2: Sử dụng giải pháp thay thế là ssl_engine directive khác phục được điểm yếu trên và có thể đặt bất kì vị trí nào => cần kiếm cách inject được shared library
# 3: Nếu có HTTP request body size lớn hơn 8KB thì NGINX sẽ lưu vào 1 file tạm thời nhưng sau tạo xong thì nó sẽ xóa ngay lập tức 
# nhưng có 1 tệp mô tả (file descriptor) được trõ đến tệp có thể truy cập được qua ProcFS => tạo Content-Length header cục lớn để NGINX sẽ tiếp tục treo để chờ gửi dữ liệu 
# khiển file descriptor mở lâu hơn nhưng vì tệp này được tạo trong 1 quy trình khác nên ko dùng /proc/self truy cập được và cần phải đoán PID và FD
# nhưng đây là container nên tương đối nhanh

