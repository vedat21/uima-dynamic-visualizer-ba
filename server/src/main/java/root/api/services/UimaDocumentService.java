package root.api.services;

import java.util.stream.Collectors;

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
import root.entities.UIMATypesSummation;
import root.entities.UIMADocument;

@Service
public class UimaDocumentService {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UimaDocumentRepository uimaDocumentRepository;

    /**
     * returns all documents stored in collection.
     *
     * @return
     */
    public List<UIMADocument> findAll() {
        return uimaDocumentRepository.findAll();
    }

    /**
     * returns document with specific id from collection
     *
     * @param id
     * @return
     */
    public Optional<UIMADocument> findById(String id) {
        return uimaDocumentRepository.findById(id);
    }

    public Optional<UIMADocument> findByNameGetOnlyDate(String name, String group) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        query.fields().include(group);
        List<UIMADocument> uimaDocuments = mongoTemplate.find(query, UIMADocument.class);
        return Optional.ofNullable(uimaDocuments.get(0));
    }

    public Object getTextFromOne(String name) {
        Optional<UIMADocument> uimaDocument = uimaDocumentRepository.findByName(name);

        if (uimaDocument.isPresent()) {
            for (String type : uimaDocument.get().getTypesNames()) {
                if (type.toLowerCase().contains("lemma")) {
                    return uimaDocument.get().getTypes().get(type);
                }
            }
        }

        return "No available Text";
    }

    /**
     * @return
     */
    public List<UIMADocument> getAllDocumentNamesAndGroups() {
        Query query = new Query();
        query.fields().include("name").include("group");
        return mongoTemplate.find(query, UIMADocument.class);
    }

    /**
     * To delete the collection.
     */
    public void removeCollection() {
        mongoTemplate.remove(new Query(), "uimadocuments");
    }

    /**
     * To put a new UIMA Document in the database.
     *
     * @param uimaDocument
     * @return
     */
    public UIMADocument putNewUimaDocument(UIMADocument uimaDocument) {
        return uimaDocumentRepository.save(uimaDocument);
    }

    /**
     * To get general information about the documents in collection. e.g how many documents are
     * stored, what are the available uima types etc.
     *
     * @return
     */
    public GeneralInfo getGeneralInfo() {
        Query query = new Query();
        query.fields().include("typesNames");
        query.fields().include("typesAttributes");

        List<String> allKeys = new ArrayList<>();
        List<UIMADocument> uimaDocuments = mongoTemplate.find(query, UIMADocument.class);

        // gets all types from types key
        uimaDocuments.forEach((uimaDocument -> {
            uimaDocument.getTypesNames().forEach((type) -> {
                if (!allKeys.contains(type)) {
                    allKeys.add(type);
                }
            });
        }));

        return new GeneralInfo(uimaDocumentRepository.countAll(),
            allKeys.stream().sorted().collect(Collectors.toList()), uimaDocuments.get(0).getTypesAttributes());
    }

    /**
     * To get all information of a given type.
     *
     * @param types
     * @param names
     * @return
     */
    public List getTypes(String[] types, String[] names) {

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
        operations.add(project("types").and(firstType).concatArrays(remainingTypes).as("data"));
        operations.add(unwind("data")); // unwind the list

        operations.add(group("data.tokenValue").count().as("count"));
        AggregationResults<UIMATypesSummation> results =
            mongoTemplate.aggregate(newAggregation(operations), "uimadocuments", UIMATypesSummation.class);

        return results.getMappedResults();
    }

    /**
     * To get the summed data of the given parameters.
     *
     * @param types
     * @param limit
     * @param names
     * @param begin
     * @param end
     * @return
     */
    public List getTypesSummation(String[] names, String[] types, String[] attributes, int limit,
        Optional<String> begin, Optional<String> end, boolean isLocation) {

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
        operations.add(project("types").and(firstType).concatArrays(remainingTypes).as("data"));
        operations.add(unwind("data")); // unwind the list

        // only when exactly one document is selected and part of text is selected
        if (begin.isPresent() && end.isPresent()) {
            operations.add(match(new Criteria("data.end").lte(Integer.parseInt(end.get()))));
            operations.add(match(
                new Criteria("data.begin").gte(Integer.parseInt(begin.get())))); // include only lemma in begin and end
        }

        // Only When Counts the Length of Token, Sentence, ..
        if (attributes.length == 2 && Arrays.asList(attributes).contains("begin") && Arrays.asList(attributes)
            .contains("end")) {
            operations.add(project("data.end", "data.begin").and("data.end").minus("data.begin").as("length"));
            operations.add(group("length").count().as("count"));
            operations.add(
                sort(Sort.by(Sort.Direction.DESC, "length").and(Sort.by(Sort.Direction.DESC, "count")))); // sortierung
        }
        // Standard Summation
        else {
            if (isLocation){
                operations.add(match(new Criteria("data.value").is("LOC"))); // only named entity locations
            }
            operations.add(group("data." + attributes[0]).count().as("count"));
            operations.add(sort(Sort.by(Sort.Direction.DESC, "count"))); // sortierung
        }


        operations.add(match(new Criteria("count").gte(limit))); // limit

        AggregationResults<UIMATypesSummation> results =
            mongoTemplate.aggregate(newAggregation(operations), "uimadocuments", UIMATypesSummation.class);

        return results.getMappedResults();
    }

    /**
     * To get the summed data by date of the given parameters .
     *
     * @param types
     * @param limit
     * @param names
     * @param begin
     * @param end
     * @return
     */
    public List<UIMATypesSummation> getTypesSummationByGroup(String[] names, String[] types, String[] attributes,
        int limit, Optional<String> begin, Optional<String> end) {

    /*
    param types is saved in two variable. One is a string and the other an array.
    Because of build in aggregation "concatarray". All types are stored in objects types.
    */
        String firstType = "types." + types[0]; // first entered type
        String[] remainingTypes = new String[types.length - 1]; // rest of them
        for (int i = 0; i < remainingTypes.length; i++) {
            remainingTypes[i] = "types." + types[i + 1];
        }

        // do aggregation for each document include date in aggregation
        List result = new ArrayList();
        for (int i = 0; i < names.length; i++) {

            // to store all aggregate operations
            List<AggregationOperation> operations = new ArrayList<>();
            // query by name
            operations.add(Aggregation.match(Criteria.where("name").in(names[i])));
            // concat all selected types to one list named data
            operations.add(project("types").and(firstType).concatArrays(remainingTypes).as("data"));
            operations.add(unwind("data")); // unwind the list

            // when one document is selected and part of text is selected
            if (begin.isPresent() && end.isPresent()) {
                operations.add(match(new Criteria("data.end").lt(Integer.parseInt(end.get()))));
                operations.add(match(new Criteria("data.begin").gt(
                    Integer.parseInt(begin.get())))); // include only lemma in begin and end
            }

            // Only When Counts the Length of Token, Sentence, ..
            if (attributes.length == 2 && Arrays.asList(attributes).contains("begin") && Arrays.asList(attributes)
                .contains("end")) {
                operations.add(project("data.end", "data.begin").and("data.end").minus("data.begin").as("length"));
                operations.add(group("length").count().as("count"));
                operations.add(sort(
                    Sort.by(Sort.Direction.DESC, "length").and(Sort.by(Sort.Direction.DESC, "count")))); // sortierung
            }
            // Standard Summation
            else {
                operations.add(group("data." + attributes[0]).count().as("count"));
                operations.add(sort(Sort.by(Sort.Direction.DESC, "count"))); // sortierung
            }

            //  operations.add(match(new Criteria("count").gte(limit))); // limit
            operations.add(sort(Sort.by(Sort.Direction.DESC, "count")));
            if(Objects.equals(attributes[1], "date")){
                operations.add(
                    AddFieldsOperation.addField(attributes[1]).withValue(this.findByNameGetOnlyDate(names[i], attributes[1]).get().getDate())
                        .build()); // add date
            }
            else if(Objects.equals(attributes[1], "name")){
                operations.add(
                    AddFieldsOperation.addField("date").withValue(this.findByNameGetOnlyDate(names[i], attributes[1]).get().getName())
                        .build()); // add date
            }

            Aggregation aggregation = newAggregation(operations);
            AggregationResults<UIMATypesSummation> results =
                mongoTemplate.aggregate(aggregation, "uimadocuments", UIMATypesSummation.class);
            result.addAll(results.getMappedResults());
        }

        // get all that are less than limit
        List<UIMATypesSummation> removeFromResult = result;
        List<UIMATypesSummation> removeFromResultFinished =
            removeFromResult.stream().filter(x -> x.getCount() < limit).collect(Collectors.toList());
        List<String> remove =
            removeFromResultFinished.stream().map(UIMATypesSummation::getId).collect(Collectors.toList());

        // to return
        List<UIMATypesSummation> resultWithType = result;
        List<UIMATypesSummation> endResult = new ArrayList<>();

        // remove all that are in removeFromResult
        for (UIMATypesSummation uimaTypesSummation : resultWithType) {
            if (!remove.contains(uimaTypesSummation.getId())) {
                endResult.add(uimaTypesSummation);
            }
        }

        Collections.sort(endResult, Comparator.comparing(UIMATypesSummation::getCount).reversed());


        return endResult;
    }

    /**
     * @param names
     * @param limit
     * @param begin
     * @param end
     * @return
     */
    public List getLocationSummation(String[] names, int limit, Optional<String> begin, Optional<String> end) {

        GeneralInfo generalInfo = this.getGeneralInfo();
        String[] remainingTypes = new String[0]; // rest of them
        List<String> namedEntityTypes = generalInfo.getTypes().stream()
            .filter(type -> type.toLowerCase().contains("entity") && !type.toLowerCase().contains("token"))
            .collect(Collectors.toList());

        String[] attributes = new String[1];
        attributes[0] = "tokenValue";

        System.out.println(namedEntityTypes.get(0));

        return this.getTypesSummation(names, namedEntityTypes.toArray(String[]::new), attributes, limit, begin, end, true);

    }
}
