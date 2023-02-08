package root.api.controllers;

import java.util.ArrayList;
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

    @PostMapping("/documents")
    public UIMADocument newUIMADocument(UIMADocument uimaDocument) {
        return uimaDocumentService.putNewUimaDocument(uimaDocument);
    }

    @GetMapping("/text/{name}")
    public Object getTextFromOne(@PathVariable String name) {
        return uimaDocumentService.getTextFromOne(name);
    }

    /**
     * To get all document names that are stored in db with given groupname
     *
     * @return
     */
    @GetMapping("/documents/all/namesandgroup")
    public List<UIMADocument> getAllDocumentNamesAndGroups() {
        return uimaDocumentService.getAllDocumentNamesAndGroups();
    }

    /**
     * to delete the collection
     */
    @GetMapping("/documents/delete")
    public void removeCollection() {
        uimaDocumentService.removeCollection();
    }

    /**
     * to tell the client which keys (types) can be requested from uima documents and gives some
     * information about the structure of the data
     *
     * @return
     */
    @GetMapping("/general")
    public GeneralInfo getGeneralInformation() {
        return uimaDocumentService.getGeneralInfo();
    }

    @GetMapping("/documents/single")
    public ResponseEntity<Object> getTypes(@RequestParam Optional<String> types, @RequestParam Optional<String> names) {

        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        return ResponseEntity.status(HttpStatus.OK).body(uimaDocumentService.getTypes(typesAsArray, namesAsArray));
    }

    /**
     * to get summed data of the given types.
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
        String[] atrributsAsArray = attributes.stream().collect(Collectors.toList()).get(0).split(",");

        // Für Orte
        if (types.get().toLowerCase().contains("loc")) {
            return ResponseEntity.status(HttpStatus.OK).body(this.getLocationSummation(names, limit, begin, end));
        }

        return ResponseEntity.status(HttpStatus.OK).body(
            uimaDocumentService.getTypesSummation(namesAsArray, typesAsArray, atrributsAsArray, Integer.parseInt(limit),
                begin, end));

    }

    /**
     * to get summed data of the given types.
     *
     * @param types
     * @return
     */
    @GetMapping("/documents/sumbydate")
    public List<UIMATypesSummation> getTypesSummationByDate(@RequestParam Optional<String> types,
        @RequestParam(defaultValue = "0") String limit, @RequestParam Optional<String> names,
        @RequestParam Optional<String> begin, @RequestParam Optional<String> end) {

        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        // for posvalue saved as tokenValue
        List<String> posValueTypes = new ArrayList<>();
        // for value
        List<String> allTypes = new ArrayList<>();

        for (int i = 0; i < typesAsArray.length; i++) {
            if (typesAsArray[i].endsWith("TokenValue")) {
                posValueTypes.add(typesAsArray[i].replace("_TokenValue", ""));
            } else {
                allTypes.add(typesAsArray[i]);
            }
        }

        List<UIMATypesSummation> result = new ArrayList<>();
        if (posValueTypes.size() != 0) {
            result.addAll(uimaDocumentService.getTypesSummationByDate(posValueTypes.toArray(new String[0]),
                Integer.parseInt(limit), namesAsArray, begin, end, "tokenValue"));
        }
        if (allTypes.size() != 0) {
            result.addAll(
                uimaDocumentService.getTypesSummationByDate(allTypes.toArray(new String[0]), Integer.parseInt(limit),
                    namesAsArray, begin, end, "value"));
        }

        Collections.sort(result, Comparator.comparing(UIMATypesSummation::getCount).reversed());

        return result;
    }

    /**
     * to get summed data of locations only.
     * For World map visualization only
     *
     * @return
     */
    @GetMapping("/documents/sum/locations")
    public List<UIMATypesSummation> getLocationSummation(@RequestParam Optional<String> names,
        @RequestParam(defaultValue = "0") String limit, @RequestParam Optional<String> begin,
        @RequestParam Optional<String> end) {

        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        return uimaDocumentService.getLocationSummation(namesAsArray, Integer.parseInt(limit), begin, end);
    }

    /*

    @GetMapping("/documents/sum")
    public List<UIMATypesSummation> getTypesSummation(@RequestParam Optional<String> types,
        @RequestParam(defaultValue = "0") String limit, @RequestParam Optional<String> names,
        @RequestParam Optional<String> begin, @RequestParam Optional<String> end) {

        // Für Orte
        if (types.get().toLowerCase().contains("loc")) {
            return this.getLocationSummation(names, limit, begin, end);
        }

        String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
        String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

        // for posvalue saved as tokenValue
        List<String> posValueTypes = new ArrayList<>();
        // for value
        List<String> allTypes = new ArrayList<>();

        for (int i = 0; i < typesAsArray.length; i++) {
            if (typesAsArray[i].endsWith("TokenValue")) {
                posValueTypes.add(typesAsArray[i].replace("_TokenValue", ""));
            } else {
                allTypes.add(typesAsArray[i]);
            }
        }

        List<UIMATypesSummation> result = new ArrayList<>();
        if (posValueTypes.size() != 0) {
            result.addAll(
                uimaDocumentService.getTypesSummation(posValueTypes.toArray(new String[0]), Integer.parseInt(limit),
                    namesAsArray, begin, end, "tokenValue"));
        }
        if (allTypes.size() != 0) {
            result.addAll(
                uimaDocumentService.getTypesSummation(allTypes.toArray(new String[0]), Integer.parseInt(limit),
                    namesAsArray, begin, end, "value"));
        }

        Collections.sort(result, Comparator.comparing(UIMATypesSummation::getCount).reversed());
        return result;
    }
    */

}
