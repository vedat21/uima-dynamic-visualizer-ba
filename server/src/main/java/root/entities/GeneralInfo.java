package root.entities;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * entity for general information about uima documents stored in one collection.
 */
@Data
@AllArgsConstructor
public class GeneralInfo {

    private int numberOfDocuments;
    private List<String> types;


}
