package root.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;

import java.io.BufferedInputStream;
import java.lang.reflect.Field;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
public class UIMADocument {

    @JsonIgnore
    @Transient
    Gson gson;
    @JsonIgnore
    @Transient
    private JCas jCas;
    @JsonIgnore
    @Transient
    private MultipartFile xmlDocument;

    @Id
    private String id;
    private String name;
    private String date;
    private Map<String, List<UIMATypeMapper>> types = new TreeMap<>();
    private String group;
    private Set<String> typesNames;
    private Map<String, List> typesAttributes;

    /**
     * For splitting documents in multiple documents if the data is too large to save in one.
     *
     * @param xmlDocument
     * @param group
     * @param number      current document
     * @param split       number of documents to split into
     * @throws UIMAException
     */
    public UIMADocument(MultipartFile xmlDocument, String group, Integer number, Integer split) throws UIMAException {
        this.gson = new Gson();
        this.xmlDocument = xmlDocument;
        this.jCas = JCasFactory.createJCas();
        this.name = xmlDocument.getOriginalFilename();
        this.group = group;

        try {
            CasIOUtils.load(new BufferedInputStream(xmlDocument.getInputStream()), jCas.getCas());
            Map<String, List<UIMATypeMapper>> allTypes = this.getTypesFromJcas(this.jCas);

            // for splitting large documents into half till it doesnt exceed 16mb per document
            int numberCopy = number;
            for (Entry<String, List<UIMATypeMapper>> entry : allTypes.entrySet()) {

                // get date of document from metadata with regex
                if (entry.getKey().toLowerCase().contains("documentmetadata")) {
                    System.out.println(entry.getValue().get(0));
                    Pattern p = Pattern.compile("\\d{2}.\\d{2}.\\d{4}");
                    Matcher m = p.matcher(entry.getValue().get(0).getDocumentId().toString());

                    if (m.find()) {
                        this.date = m.group(0);
                    }
                }

                if (numberCopy == split) {
                    this.types.put(entry.getKey(), entry.getValue());
                    this.setTypesNamesAndTypesAttributes(this.types);
                    numberCopy = 1;

                } else {
                    numberCopy++;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();

        }
    }

    /**
     * @param pCas
     * @return
     * @author Giuessepe Abrami
     * @modified Vedat Yildiz
     */
    public Map<String, List<UIMATypeMapper>> getTypesFromJcas(JCas pCas) {
        Map<String, List<UIMATypeMapper>> result = new HashMap<>();

        JCasUtil.select(pCas, TOP.class).stream().forEach(a -> {

            List<UIMATypeMapper> pList = new ArrayList<>(0);
            String sType = a.getType().getName();

            if (result.containsKey(sType)) {
                pList = result.get(sType);
            }

            pList.add(this.getDataFromTypeObject(a));

            result.put(sType, pList);

        });

        Map<String, List<UIMATypeMapper>> resultMapChangedKeys = new HashMap<>();

        // For saving in DB
        for (String key : result.keySet()) {
            resultMapChangedKeys.put(key.replace(".", "_"), result.get(key));
        }

        return this.addPosValues(resultMapChangedKeys);
    }

    /**
     * @param pTop
     * @return
     * @author Giuessepe Abrami
     * @modified Vedat Yildiz
     */
    UIMATypeMapper getDataFromTypeObject(TOP pTop) {

        JSONObject rObject = new JSONObject();
        rObject.put("id", pTop.getAddress());
        pTop.getType().getFeatures().stream().forEach(f -> {
            Object pObject = null;
            if (f.getRange().isPrimitive()) {

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
            } else if (f.getRange() instanceof AnnotationBase) {
                System.out.println(pTop.getFeatureValue(f));
            } else {
                Object oValue = pTop.getFeatureValue(f);
                if (oValue instanceof Annotation) {
                    rObject.put(f.getShortName(), ((Annotation) oValue).getAddress());
                }
            }

            if (pObject != null) {
                rObject.put(f.getShortName(), pObject);
            }
        });

        // to have standards in DB
        if (rObject.has("PosValue")) {
            rObject.put("value", rObject.get("PosValue"));
        }

        return gson.fromJson(rObject.toString(), UIMATypeMapper.class);
    }

    /**
     * To add extra attributes
     *
     * @param result
     * @return Map
     */
    public Map<String, List<UIMATypeMapper>> addPosValues(Map<String, List<UIMATypeMapper>> result) {

        if (result.get("de_tudarmstadt_ukp_dkpro_core_api_segmentation_type_Lemma") == null) {
            return result;
        }

        List<UIMATypeMapper> lemmas = result.get("de_tudarmstadt_ukp_dkpro_core_api_segmentation_type_Lemma");
        Map<String, List<UIMATypeMapper>> newResult = new HashMap<>();

        for (Map.Entry<String, List<UIMATypeMapper>> entry : result.entrySet()) {

            List<UIMATypeMapper> type = entry.getValue();

            if (entry.getKey().toLowerCase().contains("pos") || entry.getKey().toLowerCase().contains("entity")) {
                for (UIMATypeMapper typeValue : type) {
                    for (UIMATypeMapper lemma : lemmas) {
                        if (lemma.getBegin().equals(typeValue.getBegin())) {
                            typeValue.setTokenValue(lemma.getValue());
                        }
                    }
                }
            } else if (entry.getKey().toLowerCase().contains("sentence")) {
                for (UIMATypeMapper typeValue : type) {
                    for (UIMATypeMapper lemma : lemmas) {
                        if (lemma.getBegin().equals(typeValue.getBegin())) {
                            typeValue.setTokenValue(lemma.getValue());
                        }
                    }
                }
            } else if (entry.getKey().toLowerCase().contains("sentiment")) {
                for (UIMATypeMapper typeValue : type) {
                    for (UIMATypeMapper lemma : lemmas) {
                        if (lemma.getBegin().equals(typeValue.getBegin())) {
                            if (Double.parseDouble(typeValue.getSentiment()) > 0) {
                                typeValue.setSentimentCategory("positiv");
                            } else if (Double.parseDouble(typeValue.getSentiment()) < 0) {
                                typeValue.setSentimentCategory("negativ");
                            } else if (Double.parseDouble(typeValue.getSentiment()) == 0) {
                                typeValue.setSentimentCategory("neutral");
                            } else {
                                typeValue.setSentimentCategory("neutral");
                            }
                        }
                    }
                    if(typeValue.getSentimentCategory() == null){
                        typeValue.setSentimentCategory("neutral");
                        System.out.println(typeValue.getSentimentCategory());
                    }
                }
            }



            newResult.put(entry.getKey(), type);
        }

        return newResult;
    }

    /**
     * To know which types are included in the UIMA document.
     *
     * @param types
     */
    public void setTypesNamesAndTypesAttributes(Map<String, List<UIMATypeMapper>> types) {
        Set<String> typesNames = new HashSet<>();
        Map<String, List> typesAttributes = new HashMap<>();

        for (String type : types.keySet()) {
            typesNames.add(type);

            UIMATypeMapper uimaTypeMapper = types.get(type).get(0);
            List<String> attributes = new ArrayList<>();
            Field[] fields = uimaTypeMapper.getClass().getDeclaredFields();
            for (Field field : fields) {
                try {
                    if (field.get(uimaTypeMapper) != null) {
                        attributes.add(field.getName());
                    }
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }
            typesAttributes.put(type, attributes);
        }

        this.typesAttributes = typesAttributes;
        this.typesNames = typesNames;

    }
}
