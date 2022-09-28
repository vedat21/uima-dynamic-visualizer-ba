package root.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import java.io.BufferedInputStream;
import java.util.Map.Entry;
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
  private Map<String, List<GeneralTypeDTO>> types = new TreeMap<>();
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
   * For splitting documents in multiple documents if the data is too large to save in one.
   * @param xmlDocument
   * @param group
   * @param number current document
   * @param split number of documents to split into
   * @throws UIMAException
   */
  public UimaDocument(MultipartFile xmlDocument, String group, Integer number , Integer split) throws UIMAException {
    this.gson = new Gson();
    this.xmlDocument = xmlDocument;
    this.jCas = JCasFactory.createJCas();
    this.name = xmlDocument.getOriginalFilename();
    this.group = group;

    try {
      CasIOUtils.load(new BufferedInputStream(xmlDocument.getInputStream()), jCas.getCas());
      Map<String, List<GeneralTypeDTO>> typesAll = this.getElementsFromJCas(this.jCas);

      int numberCopy = number;
      for (Entry<String, List<GeneralTypeDTO>> entry : typesAll.entrySet()) {
        if (numberCopy == split) {
          this.types.put(entry.getKey(), entry.getValue());
          numberCopy = 1;
        }
        else {
          numberCopy++;

        }
      }

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

    return this.addPosValues(resultMapChangedKeys);

  }

  public Map<String, List<GeneralTypeDTO>> addPosValues(Map<String, List<GeneralTypeDTO>> resultMap){

    List<GeneralTypeDTO> lemmas = resultMap.get("de_tudarmstadt_ukp_dkpro_core_api_segmentation_type_Lemma");
    Map<String, List<GeneralTypeDTO>> start = new HashMap<>();

    for (Map.Entry<String, List<GeneralTypeDTO>> entry : resultMap.entrySet()) {

      List<GeneralTypeDTO> type = entry.getValue();

      if (entry.getKey().toLowerCase().contains("pos")){
        for (GeneralTypeDTO typeValue : type){
          for(GeneralTypeDTO lemma : lemmas){
            if(lemma.getBegin().equals(typeValue.getBegin())){
              typeValue.setTokenValue(lemma.getValue());
            }
          }
        }
      }

      start.put(entry.getKey(), type);
    }

    return start;
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
