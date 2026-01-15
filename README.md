# StudentAnalyzer Project

## Mô tả bài toán
Chương trình `StudentAnalyzer` cung cấp các công cụ để phân tích điểm số của học sinh:
1. `countExcellentStudents(List<Double> scores)`: Đếm số lượng học sinh đạt điểm Giỏi (điểm từ 8.0 đến 10.0). Các điểm không hợp lệ (nhỏ hơn 0 hoặc lớn hơn 10) sẽ bị bỏ qua.
2. `calculateValidAverage(List<Double> scores)`: Tính điểm trung bình của các điểm số hợp lệ (từ 0 đến 10). Kết quả được làm tròn đến 2 chữ số thập phân.

## Cấu trúc thư mục
- `src/`: Chứa mã nguồn `StudentAnalyzer.java`.
- `test/`: Chứa mã nguồn kiểm thử `StudentAnalyzerTest.java`.

## Cách chạy chương trình
1. Biên dịch và chạy nhanh bằng file batch (Windows):
   - Chạy file `run_tests.bat` trong thư mục `unit-test/`.
   
2. Chạy thủ công:
   - Di chuyển vào thư mục `unit-test/`: `cd unit-test`
   - Biên dịch:
     ```bash
     javac -d bin src/StudentAnalyzer.java
     javac -d bin -cp "junit-platform-console-standalone-1.10.2.jar;bin" test/StudentAnalyzerTest.java
     ```
   - Chạy kiểm thử:
     ```bash
     java -jar junit-platform-console-standalone-1.10.2.jar -cp bin --select-class StudentAnalyzerTest
     ```

## Kết quả kiểm thử
Các trường hợp kiểm thử bao gồm:
- Danh sách điểm bình thường (có cả điểm hợp lệ và không hợp lệ).
- Danh sách điểm toàn bộ hợp lệ.
- Danh sách trống.
- Danh sách chứa các giá trị biên (0.0 và 10.0).
- Danh sách chỉ chứa điểm không hợp lệ.
