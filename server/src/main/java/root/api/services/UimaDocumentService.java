package root.api.services;

import java.util.stream.Collectors;

import com.mongodb.BasicDBObject;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

import root.api.repositories.UimaDocumentRepository;
import root.entities.*;

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

    public UIMADocument getTest() {
        Query query = new Query();
        query.fields().include("types");
        List<UIMADocument> uimaDocuments = mongoTemplate.find(query, UIMADocument.class);

        List<UIMATypeMapper> iwas = new ArrayList<>();

        return uimaDocuments.get(0);
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
        Map<String, List> allTypesAttributes = new HashMap<>();
        List<UIMADocument> uimaDocuments = mongoTemplate.find(query, UIMADocument.class);

        // gets all types from types key
        uimaDocuments.forEach((uimaDocument -> {
            uimaDocument.getTypesNames().forEach((type) -> {
                if (!allKeys.contains(type)) {
                    allKeys.add(type);
                }
            });

            for (Map.Entry<String, List> entry : uimaDocument.getTypesAttributes().entrySet()) {
                if (!allTypesAttributes.keySet().contains(entry.getKey())) {
                    allTypesAttributes.put(entry.getKey(), entry.getValue());
                }
            }
        }));

        return new GeneralInfo(uimaDocumentRepository.countAll(),
            allKeys.stream().sorted().collect(Collectors.toList()), allTypesAttributes);
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
        operations.add(unwind("data"));
        operations.add(group("data").count().as("count"));


        AggregationResults<UIMATypesSingle> results =
            mongoTemplate.aggregate(newAggregation(operations), "uimadocuments", UIMATypesSingle.class);

        results.forEach((result) -> {
            JSONObject jsonObject = new JSONObject(result.getId());
            int id = jsonObject.getInt("_id");
            int begin = jsonObject.has("begin") ? jsonObject.getInt("begin") : -1;
            int end = jsonObject.getInt("end");
            double sentiment = jsonObject.has("sentiment") ? jsonObject.getDouble("sentiment") : 1000000;

            result.setId(String.valueOf(id));
            result.setBegin(String.valueOf(begin));
            result.setEnd(String.valueOf(end));
            result.setSentiment(String.valueOf(sentiment));
            result.setCount(begin);

            if (sentiment == 0) {
                result.setSentimentCategory("0");
            } else if (sentiment > 0) {
                result.setSentimentCategory("1");
            } else if (sentiment < 0) {
                result.setSentimentCategory("2");
            }
        });

        List<UIMATypesSingle> endResult = new ArrayList<>(results.getMappedResults());
        Collections.sort(endResult, Comparator.comparing(UIMATypesSingle::getCount));

        return endResult;
    }

    /**
     * To get the summed data of the given parameters.
     *
     * @param names         Selected documents
     * @param types         Selected types
     * @param attributes    Selected attributes
     * @param minOccurrence
     * @param maxOccurrence
     * @param begin
     * @param end
     * @param isLocation
     * @return
     */
    public List<UIMATypesSummation> getTypesSummation(String[] names, String[] types, String[] attributes,
        String[] conditions, String minOccurrence, Optional<String> maxOccurrence, String sorting,
        Optional<String> begin, Optional<String> end, boolean isLocation) {

        Sort.Direction sortDirection = sorting.equals("true") ? Sort.Direction.DESC : Sort.Direction.ASC;
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

        /*
        if (conditions.length != 0) {
            for (String condition : conditions) {
                operations.add(match(new Criteria("data." + condition).gte(Integer.parseInt(begin.get()))));
            }
        }
         */

        // Only When Counts the Length of Token, Sentence, etc
        if (attributes.length == 2 && Arrays.asList(attributes).contains("begin") && Arrays.asList(attributes)
            .contains("end")) {
            operations.add(project("data.end", "data.begin").and("data.end").minus("data.begin").as("length"));
            operations.add(group("length").count().as("count"));
            operations.add(sort(Sort.by(sortDirection, "length").and(Sort.by(sortDirection, "count"))));
        }
        // Standard Summation
        else {
            if (isLocation) {
                operations.add(match(new Criteria("data.value").is("LOC"))); // only named entity locations
            }
            operations.add(group("data." + attributes[0]).count().as("count"));
            operations.add(sort(Sort.by(sortDirection, "count")));
        }

        // Limit
        operations.add(match(new Criteria("count").gte(Integer.parseInt(minOccurrence))));
        operations.add(match(new Criteria("count").lte(Double.parseDouble(maxOccurrence.orElse("Infinity")))));

        AggregationResults<UIMATypesSummation> results =
            mongoTemplate.aggregate(newAggregation(operations), "uimadocuments", UIMATypesSummation.class);

        return results.getMappedResults();
    }

    /**
     * @param names      Selected documents
     * @param types      Selected types
     * @param attributes Selected attributes
     * @param begin
     * @param end
     * @return
     */
    public List<UIMATypesSummation> getTypesSummationByGroup(String[] names, String[] types, String[] attributes,
        String minOccurrence, Optional<String> maxOccurrence, String sorting, Optional<String> begin,
        Optional<String> end, String preserveNullAndEmptyArrays) {

        Sort.Direction sortDirection = sorting.equals("true") ? Sort.Direction.DESC : Sort.Direction.ASC;

        /*
        param types is saved in two variable. One is a string and the other an array.
        Because of build in aggregation "concatarray". All types are stored in objects types.
        */
        String firstType = "types." + types[0]; // first entered type
        String[] remainingTypes = new String[types.length - 1]; // rest of them
        for (int i = 0; i < remainingTypes.length; i++) {
            remainingTypes[i] = "types." + types[i + 1];
        }

        List<AggregationOperation> operations = new ArrayList<>();
        operations.add(match(Criteria.where("name").in(Arrays.stream(names).toArray())));
        // concat all selected types to one list named data
        operations.add(project("types").and(firstType).concatArrays(remainingTypes).as("data"));
        // to merge all objects that have same value for begin.
        operations.add(unwind("data"));
        operations.add(group("data.begin").first("data.begin").as("begin").addToSet("data.end").as("end")
            .addToSet("data." + attributes[0]).as(attributes[0]).addToSet("data." + attributes[1]).as(attributes[1]));
        operations.add(project("begin", "end", attributes[0], attributes[1]));
        operations.add(group().push(new BasicDBObject("begin", "$begin").append(attributes[0], "$" + attributes[0])
            .append(attributes[1], "$" + attributes[1]).append("end", "$end")).as("mergedObjects"));
        operations.add(project().and("mergedObjects").concatArrays().as("data"));
        operations.add(unwind("data"));
        operations.add(unwind("data." + attributes[0], preserveNullAndEmptyArrays.equals("true")));
        operations.add(unwind("data." + attributes[1], preserveNullAndEmptyArrays.equals("true")));
        operations.add(unwind("data.end"));
        operations.add(replaceRoot("data"));

        // when one document is selected and part of text is selected
        if (begin.isPresent() && end.isPresent()) {
            operations.add(match(new Criteria("data.end").lt(Integer.parseInt(end.get()))));
            operations.add(match(
                new Criteria("data.begin").gt(Integer.parseInt(begin.get())))); // include only lemma in begin and end
        }

        // Only when counts the length of Token, Sentence, ..
        if (attributes.length == 3 && Arrays.asList(attributes).contains("begin") && Arrays.asList(attributes)
            .contains("end")) {
            operations.add(project("end", "begin").and("end").minus("begin").as("length"));
            operations.add(group("length").count().as("count"));
            operations.add(sort(Sort.by(sortDirection, "length").and(Sort.by(sortDirection, "count")))); // sortierung
        }
        // Standard Summation
        else {
            operations.add(group(attributes[0], attributes[1]).count().as("count"));
            operations.add(sort(Sort.by(sortDirection, "count"))); // sortierung
        }

        // Limit
        operations.add(match(new Criteria("count").gte(Integer.parseInt(minOccurrence))));
        operations.add(match(new Criteria("count").lte(Double.parseDouble(maxOccurrence.orElse("Infinity")))));

        List<UIMATypesSummation> results =
            mongoTemplate.aggregate(newAggregation(operations), "uimadocuments", UIMATypesSummation.class)
                .getMappedResults();

        // Nötig, da die Attribute bei Aggregation beim Feld id als JSON gespeichert sind.
        results.forEach((result) -> {
            JSONObject jsonObject = new JSONObject(result.getId());
            String id = jsonObject.has(attributes[0]) ? jsonObject.getString(attributes[0]) : "no " + attributes[0];
            String group = jsonObject.has(attributes[1]) ? jsonObject.getString(attributes[1]) : "no " + attributes[1];

            result.setId(id);
            result.setGroup(group);
        });

        return results;
    }

    /**
     * To get the summed data by date or name of the given parameters .
     *
     * @param names      Selected documents
     * @param types      Selected types
     * @param attributes Selected attributes
     * @param begin
     * @param end
     * @return
     */
    public List<UIMATypesSummation> getTypesSummationByDateOrName(String[] names, String[] types, String[] attributes,
        String minOccurrence, Optional<String> maxOccurrence, String sorting, Optional<String> begin,
        Optional<String> end) {

        Sort.Direction sortDirection = sorting.equals("true") ? Sort.Direction.DESC : Sort.Direction.ASC;
        int attributeGroup = 1;

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

            // Only When Counts the Length of the attribute (token, sentence, etc)
            if (attributes.length == 3 && Arrays.asList(attributes).contains("begin") && Arrays.asList(attributes)
                .contains("end")) {

                attributeGroup = 2;

                operations.add(project("data.end", "data.begin").and("data.end").minus("data.begin").as("length"));
                //         operations.add(match(new Criteria("length").lte(5)));
                operations.add(group("length").count().as("count"));
                operations.add(
                    sort(Sort.by(sortDirection, "length").and(Sort.by(sortDirection, "count")))); // sortierung
            }
            // Standard Summation
            else {
                operations.add(group("data." + attributes[0]).count().as("count"));
                operations.add(sort(Sort.by(sortDirection, "count"))); // sortierung
            }

            // Nur wenn Gruppe date oder name ist
            if (Objects.equals(attributes[attributeGroup], "date")) {
                operations.add(AddFieldsOperation.addField("group")
                    .withValue(this.findByNameGetOnlyDate(names[i], attributes[attributeGroup]).get().getDate())
                    .build()); // add date
            } else if (Objects.equals(attributes[attributeGroup], "name")) {
                operations.add(AddFieldsOperation.addField("group")
                    .withValue(this.findByNameGetOnlyDate(names[i], attributes[attributeGroup]).get().getName())
                    .build()); // add date
            }

            Aggregation aggregation = newAggregation(operations);
            AggregationResults<UIMATypesSummation> results =
                mongoTemplate.aggregate(aggregation, "uimadocuments", UIMATypesSummation.class);
            result.addAll(results.getMappedResults());
        }

        // get all that are less or more then limit
        List<UIMATypesSummation> removeFromResult = result;
        List<UIMATypesSummation> removeFromResultFinished = new ArrayList<>();
        List<UIMATypesSummation> removeFromResultFinishedMin =
            removeFromResult.stream().filter(x -> x.getCount() < Integer.parseInt(minOccurrence))
                .collect(Collectors.toList());
        List<UIMATypesSummation> removeFromResultFinishedMax =
            removeFromResult.stream().filter(x -> x.getCount() > Double.parseDouble(maxOccurrence.orElse("Infinity")))
                .collect(Collectors.toList());
        removeFromResultFinished.addAll(removeFromResultFinishedMax);
        removeFromResultFinished.addAll(removeFromResultFinishedMin);

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

        if (sorting.equals("true")) {
            Collections.sort(endResult, Comparator.comparing(UIMATypesSummation::getCount).reversed());
        } else {
            Collections.sort(endResult, Comparator.comparing(UIMATypesSummation::getCount));
        }

        return endResult;
    }

    /**
     * @param names
     * @param minOccurrence
     * @param maxOccurrence
     * @param begin
     * @param end
     * @return
     */
    public List getLocationSummation(String[] names, String minOccurrence, Optional<String> maxOccurrence,
        Optional<String> begin, Optional<String> end) {

        GeneralInfo generalInfo = this.getGeneralInfo();
        String[] emptyString = new String[0]; // rest of them
        List<String> namedEntityTypes = generalInfo.getTypes().stream()
            .filter(type -> type.toLowerCase().contains("entity") && !type.toLowerCase().contains("token"))
            .collect(Collectors.toList());

        String[] attributes = new String[1];
        attributes[0] = "tokenValue";

        System.out.println(namedEntityTypes.get(0));

        return this.getTypesSummation(names, namedEntityTypes.toArray(String[]::new), attributes, emptyString,
            minOccurrence, maxOccurrence, "true", begin, end, true);

    }
}
