package root.api.controllers;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import root.api.repositories.UimaDocumentRepository;
import root.api.services.UimaDocumentService;
import root.entities.GeneralInfo;
import root.entities.UIMADocument;
import root.entities.UIMATypesSummation;

@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class UimaDocumentController {
    @Autowired
    private UimaDocumentService uimaDocumentService;
    @Autowired
    private UimaDocumentRepository uimaDocumentRepository;

    /**
     * To tell the client which types and attributes can be requested from uima documents and gives some
     * information about the structure of the dataset.
     *
     * @return
     */
    @GetMapping("/general")
    public GeneralInfo getGeneralInformation() {
        return uimaDocumentService.getGeneralInfo();
    }

    /**
     * To put a new UIMA Document in the database.
     *
     * @param uimaDocument
     * @return
     */
    @PostMapping("/documents")
    public UIMADocument newUIMADocument(UIMADocument uimaDocument) {
        return uimaDocumentService.putNewUimaDocument(uimaDocument);
    }

    /**
     * To delete the collection.
     */
    @GetMapping("/documents/delete")
    public void removeCollection() {
        uimaDocumentService.removeCollection();
    }

    /**
     * To get the text from one document.
     *
     * @param name
     * @return
     */
    @GetMapping("/text/{name}")
    public Object getTextFromOne(@PathVariable String name) {
        return uimaDocumentService.getTextFromOne(name);
    }

    /**
     * To tell the client the documents that are stored in db with the given groupname.
     *
     * @return
     */
    @GetMapping("/documents/all/namesandgroup")
    public List<UIMADocument> getAllDocumentNamesAndGroups() {
        return uimaDocumentService.getAllDocumentNamesAndGroups();
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
        @RequestParam(defaultValue = "0") String limit, @RequestParam Optional<String> names,
        @RequestParam Optional<String> attributes, @RequestParam Optional<String> begin,
        @RequestParam Optional<String> end) {

        if (types.isEmpty() || names.isEmpty() || attributes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");
        String[] attributesAsArray = attributes.stream().collect(Collectors.toList()).get(0).split(",");

        // Für Orte
        if (types.get().toLowerCase().contains("loc")) {
            return ResponseEntity.status(HttpStatus.OK).body(this.getLocationSummation(names, limit, begin, end));
        }

        return ResponseEntity.status(HttpStatus.OK).body(
            uimaDocumentService.getTypesSummation(namesAsArray, typesAsArray, attributesAsArray,
                Integer.parseInt(limit), begin, end, false));

    }

    /**
     * To get summed data of UIMA Documents by date.
     *
     * @param types
     * @return
     */
    @GetMapping("/documents/sumbydate")
    public ResponseEntity<Object> getTypesSummationByGroup(@RequestParam Optional<String> names,
        @RequestParam Optional<String> types, @RequestParam Optional<String> attributes,
        @RequestParam(defaultValue = "0") String limit, @RequestParam Optional<String> begin,
        @RequestParam Optional<String> end) {

        if (types.isEmpty() || names.isEmpty() || attributes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");
        String[] attributesAsArray = attributes.stream().collect(Collectors.toList()).get(0).split(",");

        return ResponseEntity.status(HttpStatus.OK).body(
            uimaDocumentService.getTypesSummationByGroup(namesAsArray, typesAsArray, attributesAsArray,
                Integer.parseInt(limit), begin, end));
    }

    /**
     * to get summed data of locations only.
     * For World map visualization only
     *
     * @return
     */
    @GetMapping("/documents/sum/locations")
    public List getLocationSummation(@RequestParam Optional<String> names,
        @RequestParam(defaultValue = "0") String limit, @RequestParam Optional<String> begin,
        @RequestParam Optional<String> end) {

        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        return uimaDocumentService.getLocationSummation(namesAsArray, Integer.parseInt(limit), begin, end);
    }
}
