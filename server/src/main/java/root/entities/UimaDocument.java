package root.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import lombok.*;

import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;

import java.io.IOException;
import java.util.*;

import org.apache.uima.UIMAException;
import org.apache.uima.util.XmlCasDeserializer;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.xml.sax.SAXException;
import root.entities.sub.UimaEntitiy;
import root.helper.DocumentTypes;


/**
 * entity for one uima document
 */
@Data
@Document(collection = "uimadocuments")
public class UimaDocument {

  @JsonIgnore
  @Transient // ignoriere jcas in api und mongodb
  private JCas jCas;

  @Id
  private String id;
  private DocumentTypes documentTypes;
  private Map<String, Object> types = new HashMap<>();


  public UimaDocument(File xmlDocument) throws UIMAException {
    this.documentTypes = new DocumentTypes();
    this.jCas = JCasFactory.createJCas();

    //  deserialization of jcas from xmi. All information of document is stored in jcas.
    try {
      XmlCasDeserializer.deserialize(new FileInputStream(xmlDocument), this.jCas.getCas(), true);

      // extract all information
      this.extraxtNamedEntity();
      this.extraxtPos();


    } catch (SAXException | IOException e) {
      e.printStackTrace();
    }
  }


  /**
   * Noch am Testen. Soll für generic Type möglich sein.
   */
/*
    public void extractAllTypes(Jcas jcas) {
        for (Class<T> type : this.documentTypes.getAllTypes()){
            for (type.getClass() namedEntity : JCasUtil.select(this.jCas, type)) {

                UimaEntitiy uimaEntitiy = new UimaEntitiy(
                    namedEntity.getValue(),
                    namedEntity.getCoveredText(),
                    namedEntity.getBegin(),
                    namedEntity.getEnd()

                );

                this.entities.add(uimaEntitiy);
            }
        }
    }
 */
  public void extraxtNamedEntity() {
    List<UimaEntitiy> entities = new ArrayList<>();
    for (NamedEntity namedEntity : JCasUtil.select(this.jCas, NamedEntity.class)) {

      UimaEntitiy uimaEntitiy = new UimaEntitiy(
          namedEntity.getValue(),
          namedEntity.getCoveredText(),
          namedEntity.getBegin(),
          namedEntity.getEnd()
      );

      entities.add(uimaEntitiy);
    }

    types.put("entities", entities);
  }

  public void extraxtPos() {
    List<UimaEntitiy> pos = new ArrayList<>();
    for (Token token : JCasUtil.select(this.jCas, Token.class)) {
      UimaEntitiy uimaEntitiy = new UimaEntitiy(
          token.getPosValue(),
          token.getCoveredText(),
          token.getBegin(),
          token.getEnd()
      );

      pos.add(uimaEntitiy);
    }
    types.put("pos", pos);
  }

}
