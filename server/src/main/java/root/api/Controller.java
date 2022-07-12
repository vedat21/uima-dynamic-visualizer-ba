package root.api;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// custom
import root.entities.GeneralInfo;
import root.entities.PresentationLayout;
import root.entities.sub.UimaEntitySummation;
import root.entities.UimaDocument;


/**
 * Rest controller class
 */
@NoArgsConstructor
@Data
@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class Controller {

    @Autowired
    private UimaDocumentService uimaDocumentService;
    @Autowired
    private PresentationLayoutService presentationLayoutService;


    // controller for presentation entity

    /**
     * add a new presentation to collection
     *
     * @param layout
     * @return
     */
    @PostMapping("/presentations")
    public PresentationLayout newLayout(@RequestBody PresentationLayout layout) {
        return presentationLayoutService.putNewLayout(layout);
    }

    /**
     * get a presentation by id
     *
     * @return
     */
    @GetMapping("/presentations/{id}")
    public Optional<PresentationLayout> presentationById(@PathVariable String id) {
        return presentationLayoutService.getPresentationById(id);
    }

    /**
     * get all presentations
     *
     * @return
     */
    @GetMapping("/presentations")
    public List<PresentationLayout> allPresentations() {
        return presentationLayoutService.getPresentations();
    }

    /**
     * to delete a presentation by id
     *
     * @param id
     */
    @GetMapping("/presentations/delete/{id}")
    public void deletePresentationLayoutById(@PathVariable String id) {
        presentationLayoutService.deletePresentationLayoutById(id);
    }


    // controller for uimadocument entity


    /**
     * to tell the client which keys (types) can be requested from uima documents and gives some information
     * about the structure of the data
     *
     * @return
     */
    @GetMapping("/general")
    public GeneralInfo getGeneralInformation() {
        return uimaDocumentService.getGeneralInfo();
    }

    /**
     * returns document with given id.
     * if params types is given then only data for these types(keys) is available. others are null
     *
     * @param id
     * @param types
     * @return
     */
    @GetMapping("/{id}")
    public List<UimaDocument> findByIdWithKeys(@RequestParam Optional<String> types, @PathVariable String id) {
        if (types.isEmpty()) {
            return uimaDocumentService.findById(id).stream().toList();
        } else {
            return uimaDocumentService.findByIdWithKeys(types.stream().toList(), id);
        }
    }

    /**
     * returns all documents.
     * if params types is given then only data for these types(keys) is available. others are null
     *
     * @param types
     * @return
     */
    @GetMapping("/all")
    public List<UimaDocument> findAllWithKeys(@RequestParam Optional<String> types) {
        if (types.isEmpty()) {
            return uimaDocumentService.findAll();
        } else {
            return uimaDocumentService.findAllWithKeys(types.stream().toList());
        }
    }

    /**
     * to get summed data of the given types.
     *
     * @param types
     * @return
     */
    @GetMapping("/sum")
    public List<UimaEntitySummation> getTypesSummation(@RequestParam Optional<String> types) {
        String[] typesAsArray = types.stream().toList().get(0).split(",");


        return uimaDocumentService.getTypesSummation(typesAsArray);
    }

}
