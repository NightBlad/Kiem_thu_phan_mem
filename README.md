# Báo cáo Kiểm thử Hiệu năng với JMeter

## 1. Mục tiêu
Thực hiện kiểm thử hiệu năng trên trang web [Wikipedia](https://www.wikipedia.org) sử dụng Apache JMeter để đo lường thời gian phản hồi và khả năng chịu tải.

## 2. Môi trường kiểm thử
- **Công cụ**: Apache JMeter 5.6.3
- **Hệ điều hành**: Windows
- **Website mục tiêu**: https://www.wikipedia.org

## 3. Kịch bản kiểm thử (Test Plan)
Test Plan bao gồm 3 Thread Group với cấu hình như sau:

| Thread Group | Mô tả | Số lượng Users | Ramp-up | Loop/Duration | Hành vi |
|---|---|---|---|---|---|
| **1. Basic** | Kịch bản cơ bản | 10 | 5s | 5 lần lặp | GET Homepage |
| **2. Heavy Load** | Kịch bản tải nặng | 50 | 30s | 1 lần lặp | GET Homepage + Search Page |
| **3. Custom** | Kịch bản duy trì | 20 | 10s | 60 giây | GET Main Page + Portal:Science |

**Cấu hình bổ sung:**
- **HTTP Header Manager**: Thêm `User-Agent` giả lập trình duyệt Chrome để tránh bị chặn (403 Forbidden).
- **HTTP Cookie Manager**: Quản lý session/cookie.

## 4. Kết quả kiểm thử (Summary Report)

**Thời gian thực hiện**: ~63 giây
**Tổng số yêu cầu (Samples)**: 1156

| Chỉ số | Giá trị |
|---|---|
| **Average Response Time** | 2635 ms (2.6s) |
| **Min Response Time** | 59 ms |
| **Max Response Time** | 23711 ms |
| **Error Rate** | 0.00% |
| **Throughput** | ~18.3 requests/sec |

### Phân tích
- **Độ tin cậy**: Tỷ lệ lỗi là 0%, cho thấy hệ thống (Wikipedia) xử lý tốt các yêu cầu khi có User-Agent hợp lệ. Trước đó, khi không có User-Agent, tỷ lệ lỗi là 100% do cơ chế chống bot.
- **Thời gian phản hồi**: Trung bình 2.6s là khá cao, có thể do mạng internet từ máy client đến server Wikipedia, hoặc do cơ chế rate limiting mềm của Wikipedia làm chậm phản hồi khi nhận thấy traffic bất thường từ một IP.
- **Khả năng chịu tải**: Với 50 users đồng thời (Heavy Load), hệ thống vẫn phản hồi (dù chậm ở một số request lên tới 23s).

## 5. Kết luận
- JMeter đã được cấu hình thành công để bypass cơ chế bảo mật cơ bản.
- Website Wikipedia hoạt động ổn định dưới tải giả lập nhẹ đến trung bình, không có lỗi HTTP 500 hay timeout kết nối, tuy nhiên response time có biến động lớn.

## 6. File đính kèm
- `test_plan.jmx`: File kịch bản JMeter.
- `results.csv`: File kết quả thô.
- `report/`: Thư mục chứa báo cáo HTML chi tiết.
