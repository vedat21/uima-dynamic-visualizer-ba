package root.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

// custom
import root.api.repositories.UimaDocumentRepository;
import root.entities.GeneralInfo;
import root.entities.UimaEntitySummation;
import root.entities.UimaDocument;

@Service
public class UimaDocumentService {

  // both variables are used for crud operation on mongodb
  @Autowired
  private MongoTemplate mongoTemplate;
  @Autowired
  private UimaDocumentRepository uimaDocumentRepository;


  /**
   * returns all documents stored in collection.
   *
   * @return
   */
  public List<UimaDocument> findAll() {
    return uimaDocumentRepository.findAll();
  }


  public Object getTextFromOne(String name) {
    Optional<UimaDocument> uimaDocument = uimaDocumentRepository.findByName(name);

    if (uimaDocument.isPresent()) {
      for (String type : uimaDocument.get().getTypesNames()) {
        if (type.toLowerCase().contains("lemma")) {
          return uimaDocument.get().getTypes().get(type);
        }
      }
    }

    return "No Text";
  }


  /**
   * returns document with specific id from collection
   *
   * @param id
   * @return
   */
  public Optional<UimaDocument> findById(String id) {
    return uimaDocumentRepository.findById(id);
  }

  public List<UimaDocument> getAllDocumentNamesAndGroups() {
    Query query = new Query();
    query.fields().include("name").include("group");
    return mongoTemplate.find(query, UimaDocument.class);
  }

  public void deleteCollection() {
    mongoTemplate.remove(new Query(), "uimadocuments");
  }


  /**
   * put new uima document in db
   *
   * @param uimaDocument
   * @return
   */
  public UimaDocument putNewUimaDocument(UimaDocument uimaDocument) {
    return uimaDocumentRepository.save(uimaDocument);
  }

  /**
   * returns all documents but only data for the given keys is available .others are null
   *
   * @param types
   * @return
   */
  public List<UimaDocument> findAllWithKeys(List<String> types) {

    // types has always only one element
    // cast List to array because of include function (takes array as arg).
    String[] typesAsArray = types.get(0).split(",");

    Query query = new Query();
    query.fields().include(typesAsArray[0]);

    return mongoTemplate.find(query, UimaDocument.class);
  }

  /**
   * returns document with given id but only data for the given keys is available. others are null
   *
   * @param types
   * @return
   */
  public List<UimaDocument> findByIdWithKeys(List<String> types, String id) {
    Query query = new Query();

    String[] typesAsArray = types.get(0).split(",");
    query.fields().include(typesAsArray); // only return included keys (types)
    query.addCriteria(Criteria.where("_id").is(id)); // find document with id

    return mongoTemplate.find(query, UimaDocument.class);
  }

  /**
   * to get general information about the documents in collection. e.g how many documents are
   * stored, what are the available uima types
   *
   * @return
   */
  public GeneralInfo getGeneralInfo() {

    List<String> allKeys = new ArrayList<>();
    Query query = new Query();
    query.fields().include("typesNames");
    List<UimaDocument> uimaDocuments = mongoTemplate.find(query, UimaDocument.class);

    // gets all types from types key
    uimaDocuments.forEach((uimaDocument -> {
      uimaDocument.getTypesNames().forEach((type) -> {
        if ((type.toLowerCase().contains("pos") || type.toLowerCase().contains("entity")
            || type.toLowerCase().contains("lemma"))
            && (!allKeys.contains(type))) {
          allKeys.add(type + "_TokenValue");
          allKeys.add(type);
        }
      });
    }));

    return new GeneralInfo(uimaDocumentRepository.countAll(), allKeys);
  }


  /**
   * same function as getTypesSummation but gets values of tokenValue instead of value
   *
   * @param types
   * @param limit
   * @param names
   * @return
   */
  public List getTypesSummation(String[] types, int limit, String[] names,
      Optional<String> begin, Optional<String> end, String valueString) {

    /*
    param types is saved in two variable. One is a string and the other an array.
    Because of build in aggregation "concatarray". All types are stored in objects types.
    */
    String firstType = "types." + types[0]; // first entered type
    String[] remainingTypes = new String[types.length - 1]; // rest of them
    for (int i = 0; i < remainingTypes.length; i++) {
      remainingTypes[i] = "types." + types[i + 1];
    }

    // to store all aggregate operations
    List<AggregationOperation> operations = new ArrayList<>();

    // query by name
    operations.add(Aggregation.match(Criteria.where("name").in(Arrays.stream(names).toArray())));
    // concat all selected types to one list named data
    operations.add(
        project("types").and(firstType).concatArrays(remainingTypes).as("data")
    );
    operations.add(unwind("data")); // unwind the list
    if (begin.isPresent() && end.isPresent()) {
      operations.add(match(new Criteria("data.end").lt(Integer.parseInt(end.get()))));
      operations.add(match(new Criteria("data.begin").gt(
          Integer.parseInt(begin.get())))); // include only lemma in begin and end
    }
    operations.add(group("data." + valueString).count().as("count")); // count
    operations.add(match(new Criteria("count").gte(limit))); // limit
    operations.add(sort(Sort.by(Sort.Direction.DESC, "count"))); // sort

    Aggregation aggregation = newAggregation(operations);
    AggregationResults<UimaEntitySummation> results = mongoTemplate.aggregate(aggregation,
        "uimadocuments", UimaEntitySummation.class);

    return results.getMappedResults();
  }


}