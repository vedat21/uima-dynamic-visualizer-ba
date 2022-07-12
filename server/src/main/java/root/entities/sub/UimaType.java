package root.entities.sub;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@Document
public class UimaType{

    private List<UimaEntitiy> data;
    private String type;

}
