package root.entities;

import lombok.Data;

/**
 * entity for types to map from json
 */
@Data
public class GeneralTypeDTO {

  Integer id;
  Integer begin;
  Integer end;
  String coarseValue;
  String Lemma;
  String laguage;
  String documentId;
  String documentBaseUri;
  String value;

}
