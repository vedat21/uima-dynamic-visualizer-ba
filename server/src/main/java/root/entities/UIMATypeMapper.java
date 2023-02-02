package root.entities;

import lombok.Data;

/**
 * entity for types to map from json
 */
@Data
public class UIMATypeMapper {

    Integer begin;
    Integer end;
    Integer id;
    String coarseValue;
    String comment;
    String dateDay;
    String dateMonth;
    String dateYear;
    String definiteness;
    String degree;
    String DependencyType;
    String Dependent;
    String documentBaseUri;
    String documentId;
    String documentTitle;
    String documentUri;
    String flavor;
    String gender;
    String Governor;
    String isLastSegment;
    String language;
    String lemma;
    String mood;
    String morph;
    String number;
    String order;
    String pos;
    String PosValue;
    String pronType;
    String reference;
    String subtitle;
    String tense;
    String timestamp;
    String tokenValue;
    String value;
    String verbForm;
    String version;
}
