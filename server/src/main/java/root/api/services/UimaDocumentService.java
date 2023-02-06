package root.api.services;

import java.util.stream.Collectors;

import de.tudarmstadt.ukp.dkpro.core.api.syntax.type.constituent.S;
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

    public Optional<UIMADocument> findByNameGetOnlyDate(String name) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        query.fields().include("date");
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

    public List<UIMADocument> getAllDocumentNamesAndGroups() {
        Query query = new Query();
        query.fields().include("name").include("group");
        return mongoTemplate.find(query, UIMADocument.class);
    }

    public void removeCollection() {
        mongoTemplate.remove(new Query(), "uimadocuments");
    }

    /**
     * put new uima document in db
     *
     * @param uimaDocument
     * @return
     */
    public UIMADocument putNewUimaDocument(UIMADocument uimaDocument) {
        return uimaDocumentRepository.save(uimaDocument);
    }

    /**
     * to get general information about the documents in collection. e.g how many documents are
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

        return new GeneralInfo(
            uimaDocumentRepository.countAll(), allKeys.stream().sorted().collect(Collectors.toList()),
            uimaDocuments.get(0).getTypesAttributes());
    }

    /**
     * @param types
     * @param limit
     * @param names
     * @param begin
     * @param end
     * @return
     */
    public List getTypesSummation(String[] types, int limit, String[] names, String[] attributes,
        Optional<String> begin, Optional<String> end) {


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
        }
        // Standard Summation
        else {
            operations.add(group("data." + attributes[0]).count().as("count"));
        }

        operations.add(match(new Criteria("count").gte(limit))); // limit
        operations.add(sort(Sort.by(Sort.Direction.DESC, "count"))); // sortierung

        Aggregation aggregation = newAggregation(operations);
        AggregationResults<UIMATypesSummation> results =
            mongoTemplate.aggregate(aggregation, "uimadocuments", UIMATypesSummation.class);

        return results.getMappedResults();
    }

    /**
     * to get aggregation that includes date
     *
     * @param types
     * @param limit
     * @param names
     * @param begin
     * @param end
     * @param valueString
     * @return
     */
    public List<UIMATypesSummation> getTypesSummationByDate(String[] types, int limit, String[] names,
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
            operations.add(group("data." + valueString).count().as("count"));
            //  operations.add(match(new Criteria("count").gte(limit))); // limit
            operations.add(sort(Sort.by(Sort.Direction.DESC, "count")));
            operations.add(
                AddFieldsOperation.addField("date").withValue(this.findByNameGetOnlyDate(names[i]).get().getDate())
                    .build()); // add date

            Aggregation aggregation = newAggregation(operations);
            AggregationResults<UIMATypesSummation> results =
                mongoTemplate.aggregate(aggregation, "uimadocuments", UIMATypesSummation.class);
            result.addAll(results.getMappedResults());
        }

        // get all that are less then limit
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
        List<String> namedEntityTypes = generalInfo.getTypes().stream()
            .filter(type -> type.toLowerCase().contains("entity") && !type.toLowerCase().contains("token"))
            .collect(Collectors.toList());

        // to store all aggregate operations
        List<AggregationOperation> operations = new ArrayList<>();

        // query by name
        operations.add(Aggregation.match(Criteria.where("name").in(Arrays.stream(names).toArray())));
        // concat all selected types to one list named data
        operations.add(project("types").and("types." + namedEntityTypes.get(0)).as("data"));
        operations.add(unwind("data")); // unwind the list
        // when one document is selected and part of text is selected
        if (begin.isPresent() && end.isPresent()) {
            operations.add(match(new Criteria("data.end").lt(Integer.parseInt(end.get()))));
            operations.add(match(
                new Criteria("data.begin").gt(Integer.parseInt(begin.get())))); // include only lemma in begin and end
        }
        operations.add(match(new Criteria("data.value").is("LOC"))); // only named entity locations

        operations.add(group("data." + "tokenValue").count().as("count")); // count
        operations.add(match(new Criteria("count").gte(limit))); // limit
        operations.add(sort(Sort.by(Sort.Direction.DESC, "count"))); // sort

        Aggregation aggregation = newAggregation(operations);
        AggregationResults<UIMATypesSummation> results =
            mongoTemplate.aggregate(aggregation, "uimadocuments", UIMATypesSummation.class);

        return results.getMappedResults();
    }

    /*
    public List getTypesSummation(String[] types, int limit, String[] names, Optional<String> begin,
        Optional<String> end, String valueString) {


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
        // when one document is selected and part of text is selected
        if (begin.isPresent() && end.isPresent()) {
            operations.add(match(new Criteria("data.end").lt(Integer.parseInt(end.get()))));
            operations.add(match(
                new Criteria("data.begin").gt(Integer.parseInt(begin.get())))); // include only lemma in begin and end
        }
        operations.add(group("data." + valueString).count().as("count")); // count
        operations.add(match(new Criteria("count").gte(limit))); // limit
        operations.add(sort(Sort.by(Sort.Direction.DESC, "count"))); // sort

        Aggregation aggregation = newAggregation(operations);
        AggregationResults<UIMATypesSummation> results =
            mongoTemplate.aggregate(aggregation, "uimadocuments", UIMATypesSummation.class);

        return results.getMappedResults();
    }
*/

}
