package root.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


/**
 * entity for a presentation
 */
@Data
@Document(collection = "presentations")
public class Presentation {


    private List documents;
    private List layout;
    private List visualizations;
    @Id
    private String id;
    private String title;
}
