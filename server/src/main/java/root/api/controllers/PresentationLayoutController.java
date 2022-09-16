package root.api.controllers;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// custom
import root.api.services.PresentationLayoutService;
import root.entities.PresentationLayout;


/**
 * Rest controller class
 */
@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class PresentationLayoutController {


    @Autowired
    private PresentationLayoutService presentationLayoutService;


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
     * get a presentation by id
     *
     * @return
     */
    @GetMapping("/presentations/{id}")
    public Optional<PresentationLayout> presentationById(@PathVariable String id) {
        return presentationLayoutService.getPresentationById(id);
    }

    /**
     * to add a new presentation to collection
     *
     * @param layout
     * @return
     */
    @PostMapping("/presentations")
    public PresentationLayout newLayout(@RequestBody PresentationLayout layout) {
        return presentationLayoutService.putNewLayout(layout);
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



}
