package root.helper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;

import de.tudarmstadt.ukp.dkpro.core.api.lexmorph.type.pos.*;
import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;




// hier sollen alle typen(klassen) gepseichert sein um drauf zuzugerifen zu können
@Data
public class DocumentTypes {

  private Map<String, Object> allTypes = new HashMap<>();

  public DocumentTypes(){
    allTypes.put("pos", "...");
    allTypes.put("Named Entity", "...");
    allTypes.put("Token","...");
  }

}
