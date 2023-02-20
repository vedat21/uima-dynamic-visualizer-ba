package root.api.controllers;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import root.api.services.UimaDocumentService;
import root.entities.UIMADocument;

@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class UimaDocumentController {
    @Autowired
    private UimaDocumentService uimaDocumentService;

    /**
     * To tell the client which types and attributes can be requested from uima documents and gives some
     * information about the structure of the dataset.
     *
     * @return
     */
    @GetMapping("/general")
    public ResponseEntity<Object> getGeneralInformation() {
        return ResponseEntity.status(HttpStatus.OK).body(uimaDocumentService.getGeneralInfo());
    }

    /**
     * To put a new UIMA Document in the database.
     *
     * @param uimaDocument
     * @return
     */
    @PostMapping("/documents")
    public ResponseEntity<Object> newUIMADocument(UIMADocument uimaDocument) {
        return ResponseEntity.status(HttpStatus.OK).body(uimaDocumentService.putNewUimaDocument(uimaDocument));
    }

    /**
     * To delete the collection.
     */
    @GetMapping("/documents/delete")
    public ResponseEntity<Object> removeCollection() {
        uimaDocumentService.removeCollection();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * To get the text from one document.
     *
     * @param name
     * @return
     */
    @GetMapping("/text/{name}")
    public ResponseEntity<Object> getTextFromOne(@PathVariable String name) {
        return ResponseEntity.status(HttpStatus.OK).body(uimaDocumentService.getTextFromOne(name));
    }

    /**
     * To tell the client the documents that are stored in db with the given groupname.
     *
     * @return
     */
    @GetMapping("/documents/all/namesandgroup")
    public ResponseEntity<Object> getAllDocumentNamesAndGroups() {
        return ResponseEntity.status(HttpStatus.OK).body(uimaDocumentService.getAllDocumentNamesAndGroups());
    }

    @GetMapping("/documents/single")
    public ResponseEntity<Object> getTypes(@RequestParam Optional<String> types, @RequestParam Optional<String> names) {

        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        return ResponseEntity.status(HttpStatus.OK).body(uimaDocumentService.getTypes(typesAsArray, namesAsArray));
    }

    /**
     * To get summed data of UIMA Documents.
     *
     * @param types
     * @return
     */
    @GetMapping("/documents/sum")
    public ResponseEntity<Object> getTypesSummation(@RequestParam Optional<String> types,
        @RequestParam Optional<String> names, @RequestParam Optional<String> attributes,
        @RequestParam Optional<String> conditions, @RequestParam(defaultValue = "0") String minOccurrence,
        @RequestParam Optional<String> maxOccurrence, @RequestParam Optional<String> begin,
        @RequestParam Optional<String> end) {

        if (types.isEmpty() || names.isEmpty() || attributes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");
        String[] attributesAsArray = attributes.stream().collect(Collectors.toList()).get(0).split(",");
        //     String[] conditionsAsArray = conditions.stream().collect(Collectors.toList()).get(0).split(",");
        String[] conditionsAsArray = new String[0];

        // Für Orte
        if (types.get().toLowerCase().contains("loc")) {
            return ResponseEntity.status(HttpStatus.OK)
                .body(this.getLocationSummation(names, minOccurrence, maxOccurrence,begin, end));
        }

        return ResponseEntity.status(HttpStatus.OK).body(
            uimaDocumentService.getTypesSummation(namesAsArray, typesAsArray, attributesAsArray, conditionsAsArray,
                minOccurrence, maxOccurrence, begin, end, false));

    }

    /**
     * To get summed data of UIMA Documents by date.
     *
     * @param types
     * @return
     */
    @GetMapping("/documents/sumbydate")
    public ResponseEntity<Object> getTypesSummationByDateOrName(@RequestParam Optional<String> names,
        @RequestParam Optional<String> types, @RequestParam Optional<String> attributes,
        @RequestParam Optional<String> conditions, @RequestParam(defaultValue = "0") String limit,
        @RequestParam Optional<String> begin, @RequestParam Optional<String> end) {

        if (types.isEmpty() || names.isEmpty() || attributes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");
        String[] attributesAsArray = attributes.stream().collect(Collectors.toList()).get(0).split(",");

        if (Arrays.asList(attributesAsArray).contains("date") || Arrays.asList(attributesAsArray).contains("name")) {
            return ResponseEntity.status(HttpStatus.OK).body(
                uimaDocumentService.getTypesSummationByDateOrName(namesAsArray, typesAsArray, attributesAsArray,
                    Integer.parseInt(limit), begin, end));
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(
                uimaDocumentService.getTypesSummationByGroup(namesAsArray, typesAsArray, attributesAsArray,
                    Integer.parseInt(limit), begin, end));
        }
    }

    @GetMapping("/documents/sum/locations")
    public ResponseEntity<Object> getLocationSummation(@RequestParam Optional<String> names,
        @RequestParam(defaultValue = "0") String minOccurrence, @RequestParam Optional<String> maxOccurrence,
        @RequestParam Optional<String> begin, @RequestParam Optional<String> end) {

        if (names.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        return ResponseEntity.status(HttpStatus.OK)
            .body(uimaDocumentService.getLocationSummation(namesAsArray, minOccurrence, maxOccurrence, begin, end));
    }

}
