package root.entities.sub;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * entity for an element of uima type
 */
@Data
@AllArgsConstructor
@Document
public class UimaEntitiy {

    String value;
    String text;
    int begin;
    int end;

}