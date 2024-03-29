package root.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
public class UIMATypesSummation {

    private int count;
    private String group;
    @Id
    private String id;
    private String PosValue;
    private String value;
    private String begin;
    private String end;

}
