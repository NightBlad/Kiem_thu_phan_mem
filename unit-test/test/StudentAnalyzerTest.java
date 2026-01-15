import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class StudentAnalyzerTest {
    @Test
    public void testCountExcellentStudents() {
        StudentAnalyzer analyzer = new StudentAnalyzer();
        
        // Trường hợp bình thường: Danh sách có nhiều điểm hợp lệ và không hợp lệ.
        assertEquals(2, analyzer.countExcellentStudents(Arrays.asList(9.0, 8.5, 7.0, 11.0, -1.0)));
        
        // Trường hợp bình thường: Danh sách toàn bộ hợp lệ.
        assertEquals(3, analyzer.countExcellentStudents(Arrays.asList(8.0, 9.0, 10.0)));
        
        // Trường hợp biên: Danh sách trống.
        assertEquals(0, analyzer.countExcellentStudents(Collections.emptyList()));
        
        // Trường hợp biên: Danh sách chỉ chứa giá trị 0 hoặc 10.
        assertEquals(1, analyzer.countExcellentStudents(Arrays.asList(0.0, 10.0)));
        
        // Trường hợp ngoại lệ: Có điểm < 0 hoặc > 10.
        assertEquals(0, analyzer.countExcellentStudents(Arrays.asList(-5.0, 15.0, 12.0)));

        // Null list
        assertEquals(0, analyzer.countExcellentStudents(null));
    }

    @Test
    public void testCalculateValidAverage() {
        StudentAnalyzer analyzer = new StudentAnalyzer();
        
        // Trường hợp bình thường: Danh sách có nhiều điểm hợp lệ và không hợp lệ.
        // Hợp lệ: 9.0, 8.5, 7.0 -> Avg: (24.5 / 3) = 8.1666... -> 8.17
        assertEquals(8.17, analyzer.calculateValidAverage(Arrays.asList(9.0, 8.5, 7.0, 11.0, -1.0)), 0.01);
        
        // Trường hợp bình thường: Danh sách toàn bộ hợp lệ.
        assertEquals(8.0, analyzer.calculateValidAverage(Arrays.asList(7.0, 8.0, 9.0)), 0.01);
        
        // Trường hợp biên: Danh sách trống.
        assertEquals(0.0, analyzer.calculateValidAverage(Collections.emptyList()), 0.01);
        
        // Trường hợp biên: Danh sách chỉ chứa giá trị 0 hoặc 10.
        assertEquals(5.0, analyzer.calculateValidAverage(Arrays.asList(0.0, 10.0)), 0.01);
        
        // Trường hợp ngoại lệ: Có điểm < 0 hoặc > 10.
        assertEquals(0.0, analyzer.calculateValidAverage(Arrays.asList(-1.0, 11.0)), 0.01);

        // Null list
        assertEquals(0.0, analyzer.calculateValidAverage(null), 0.01);
    }
}
