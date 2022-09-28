package root.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
public class UimaEntitySummation {

    @Id
    String id;
    String value;
    int count;
    String PosValue;

}
