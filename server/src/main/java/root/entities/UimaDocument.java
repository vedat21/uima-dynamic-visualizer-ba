package root.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import java.io.BufferedInputStream;
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
import org.apache.uima.jcas.cas.AnnotationBase;
import org.apache.uima.jcas.cas.TOP;
import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.util.CasIOUtils;
import org.apache.uima.util.XmlCasDeserializer;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;
import root.entities.sub.UimaEntitiy;
import root.helper.DocumentTypes;


/**
 * entity for one uima document
 */
@Data
@Document(collection = "uimadocuments")
@NoArgsConstructor
public class UimaDocument {

  @JsonIgnore
  @Transient // ignoriere jcas in api und mongodb
  private JCas jCas;
  @JsonIgnore
  @Transient
  private MultipartFile xmlDocument;
  @Id
  private String id;
  private String name;
  private DocumentTypes documentTypes;
  private Map<String, Object> types = new HashMap<>();
  private Map<String, List<JSONObject>> testTypes = new HashMap<>();
  private String group;

  public UimaDocument(MultipartFile xmlDocument, String group) throws UIMAException {
    this.xmlDocument = xmlDocument;
    this.documentTypes = new DocumentTypes();
    this.jCas = JCasFactory.createJCas();
    this.name = xmlDocument.getOriginalFilename();
    this.group = group;

    //  deserialization of jcas from xmi. All information of document is stored in jcas.
    try {

      CasIOUtils.load(new BufferedInputStream(xmlDocument.getInputStream()), jCas.getCas());

      this.testTypes = this.getElementsFromJCas(this.jCas);
      System.out.println(this.testTypes);

      // extract all information
      this.extraxtNamedEntity();
      this.extraxtPos();

    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void extraxtNamedEntity() {

    for (int i=0 ; i < 30 ; i++){

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

      types.put("entities"+i, entities);
    }
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

  /**
   *
   * @param pCas
   * @return
   * @author Giuessepe Abrami
   */
  public Map<String, List<JSONObject>> getElementsFromJCas(JCas pCas){
    Map<String, List<org.json.JSONObject>> resultMap = new HashMap<>();

    JCasUtil.select(pCas, TOP.class).stream().forEach(a->{

      String sType = a.getType().getName();

      List<JSONObject> pList = new ArrayList<>(0);

      if(resultMap.containsKey(sType)){
        pList = resultMap.get(sType);
      }

      pList.add(getDataFromObject(a));

      resultMap.put(sType, pList);

    });

    Map<String, List<JSONObject>> resultMapChangedKeys = new HashMap<>();
    for (String key : resultMap.keySet()){
      resultMapChangedKeys.put(key.replace(".", "_"), resultMap.get(key));
    }

    return resultMapChangedKeys;

  }

  /**
   *
   * @param pTop
   * @return
   * @author Giuessepe Abrami
   */
  JSONObject getDataFromObject(TOP pTop){

    JSONObject rObject = new JSONObject();
    rObject.put("id", pTop.getAddress());
    pTop.getType().getFeatures().stream().forEach(f->{
      Object pObject = null;
      if(f.getRange().isPrimitive()){

        switch (f.getRange().toString()) {
          case ("uima.cas.String"): {
            pObject = pTop.getStringValue(f);
            break;
          }
          case ("uima.cas.Integer"): {
            pObject = pTop.getIntValue(f);
            break;
          }
          case ("uima.cas.Float"): {
            pObject = pTop.getFloatValue(f);
            break;
          }
          case ("uima.cas.Long"): {
            pObject = pTop.getLongValue(f);
            break;
          }
          case "uima.cas.Boolean": {
            pObject = pTop.getBooleanValue(f);
            break;
          }
          case "uima.cas.Short": {
            pObject = pTop.getShortValue(f);
            break;
          }
          case "uima.cas.Double": {
            pObject = pTop.getDoubleValue(f);
            break;
          }
          case "uima.cas.Byte": {
            pObject = pTop.getByteValue(f);
            break;
          }
        }
      }
      else if(f.getRange() instanceof AnnotationBase){
        //     System.out.println(pTop.getFeatureValue(f));
      }
      else{
        Object oValue = pTop.getFeatureValue(f);
        if(oValue instanceof Annotation){
          rObject.put(f.getShortName(), ((Annotation)oValue).getAddress());
        }
      }

      if(pObject!=null){
        rObject.put(f.getShortName(), pObject);
      }
    });

    return rObject;
  }

}
