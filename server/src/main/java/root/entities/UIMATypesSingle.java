package root.entities;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
public class UIMATypesSingle {

    private String group;
    @Id
    private String id;
    private String PosValue;
    private String value;
    private String begin;
    private String end;
    private String gender;
    private String pos;
    private String sentiment;
    private String sentimentCategory;
    private int count;
}
