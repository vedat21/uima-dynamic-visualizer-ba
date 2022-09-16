package root.entities;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;

public class DocumentFile {

    @Id
    private String id;

    private String title;

    private Binary file;
}
