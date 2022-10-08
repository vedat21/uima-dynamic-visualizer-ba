package root.api.controllers;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// custom
import root.api.services.PresentationService;
import root.entities.Presentation;


/**
 * Rest controller class
 */
@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class PresentationController {

  @Autowired
  private PresentationService presentationService;


  /**
   * get all presentations
   *
   * @return
   */
  @GetMapping("/presentations")
  public List<Presentation> allPresentations() {
    return presentationService.getPresentations();
  }

  /**
   * get a presentation by id
   *
   * @return
   */
  @GetMapping("/presentations/{id}")
  public Optional<Presentation> presentationById(@PathVariable String id) {
    return presentationService.getPresentationById(id);
  }

  /**
   * get a presentation by id
   *
   * @return
   */
  @GetMapping("/presentations/copy/{id}")
  public void copyPresentation(@PathVariable String id) {

    Presentation copyOfPresentation = presentationService.getPresentationById(id)
        .orElse(new Presentation());
    copyOfPresentation.setId(null);

    List<String> presentationLayoutsTitles = this.allPresentations().stream()
        .map(presentation1 -> presentation1.getTitle()).collect(
            Collectors.toList());

    // adjust title of presentation
    if (presentationLayoutsTitles.contains(copyOfPresentation.getTitle())) {
      copyOfPresentation.setTitle(copyOfPresentation.getTitle() + "_copy");
    }

    this.newPresentation(copyOfPresentation);
  }

  /**
   * to add a new presentation to collection
   *
   * @param presentation
   * @return
   */
  @PostMapping("/presentations")
  public Presentation newPresentation(@RequestBody Presentation presentation) {
    return presentationService.putNewPresentation(presentation);
  }


  /**
   * to delete a presentation by id
   *
   * @param id
   */
  @GetMapping("/presentations/delete/{id}")
  public void deletePresentationById(@PathVariable String id) {
    presentationService.deletePresentationLayoutById(id);
  }

}
