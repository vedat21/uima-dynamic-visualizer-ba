package root.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import java.io.BufferedInputStream;
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
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;


/**
 * entity for one uima document
 */
@Data
@Document(collection = "uimadocuments")
@NoArgsConstructor
public class UimaDocument {

  @JsonIgnore
  @Transient // ignoriere jcas in api und mongodb
  Gson gson;

  @JsonIgnore
  @Transient // ignoriere jcas in api und mongodb
  private JCas jCas;
  @JsonIgnore
  @Transient
  private MultipartFile xmlDocument;
  @Id
  private String id;
  private String name;
  private Map<String, List<GeneralTypeDTO>> types = new HashMap<>();
  private String group;

  public UimaDocument(MultipartFile xmlDocument, String group) throws UIMAException {
    this.gson = new Gson();
    this.xmlDocument = xmlDocument;
    this.jCas = JCasFactory.createJCas();
    this.name = xmlDocument.getOriginalFilename();
    this.group = group;

    try {
      CasIOUtils.load(new BufferedInputStream(xmlDocument.getInputStream()), jCas.getCas());
      this.types = this.getElementsFromJCas(this.jCas);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /**
   *
   * @param pCas
   * @return
   * @author Giuessepe Abrami
   */
  public Map<String, List<GeneralTypeDTO>> getElementsFromJCas(JCas pCas){
    Map<String, List<GeneralTypeDTO>> resultMap = new HashMap<>();

    JCasUtil.select(pCas, TOP.class).stream().forEach(a->{

      List<GeneralTypeDTO> pList = new ArrayList<>(0);
      String sType = a.getType().getName();

      if(resultMap.containsKey(sType)){
        pList = resultMap.get(sType);
      }

      pList.add(this.getDataFromObject(a));

      resultMap.put(sType, pList);

    });

    Map<String, List<GeneralTypeDTO>> resultMapChangedKeys = new HashMap<>();

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
  GeneralTypeDTO getDataFromObject(TOP pTop){

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

    // to have standards in db
    if (rObject.has("PosValue")){
      rObject.put("value", rObject.get("PosValue"));
    }

    return gson.fromJson(rObject.toString(), GeneralTypeDTO.class);
  }

}
