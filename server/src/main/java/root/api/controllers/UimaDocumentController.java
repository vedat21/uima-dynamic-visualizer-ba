package root.api.controllers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import root.api.services.UimaDocumentService;
import root.entities.GeneralInfo;
import root.entities.UimaDocument;
import root.entities.UimaEntitySummation;


@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class UimaDocumentController {

  @Autowired
  private UimaDocumentService uimaDocumentService;


  /**
   * to delete the collection
   */
  @GetMapping("/documents/delete")
  public void deleteDocument() {
    System.out.println("ja");
    uimaDocumentService.deleteCollection();
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

  /**
   * returns document with given id. if params types is given then only data for these types(keys)
   * is available. others are null
   *
   * @param id
   * @param types
   * @return
   */
  @GetMapping("/documents/{id}")
  public List<UimaDocument> findByIdWithKeys(@RequestParam Optional<String> types,
      @PathVariable String id) {
    if (types.isEmpty()) {
      return uimaDocumentService.findById(id).stream().collect(Collectors.toList());
    } else {
      return uimaDocumentService.findByIdWithKeys(types.stream().collect(Collectors.toList()), id);
    }
  }

  /**
   * returns all documents. if params types is given then only data for these types(keys) is
   * available. others are null
   *
   * @param types
   * @return
   */
  @GetMapping("/documents/all")
  public List<UimaDocument> findAllWithKeys(@RequestParam Optional<String> types) {
    if (types.isEmpty()) {
      return uimaDocumentService.findAll();
    } else {
      return uimaDocumentService.findAllWithKeys(types.stream().collect(Collectors.toList()));
    }
  }

  /**
   * to get summed data of the given types.
   *
   * @param types
   * @return
   */
  @GetMapping("/documents/sum")
  public List<UimaEntitySummation> getTypesSummation(
      @RequestParam Optional<String> types,
      @RequestParam(defaultValue = "0") String limit,
      @RequestParam Optional<String> names) {

    String[] typesAsArray = types.stream().collect(Collectors.toList()).get(0).split(",");
    String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

    List<String> posValueTypes = new ArrayList<>();
    List<String> allTypes = new ArrayList<>();

    for (int i = 0; i < typesAsArray.length; i++) {
      if (typesAsArray[i].endsWith("VALUE")) {
        posValueTypes.add(typesAsArray[i].replace("_VALUE", ""));
      } else {
        allTypes.add(typesAsArray[i]);
      }
    }

    List<UimaEntitySummation> result = new ArrayList<>();
    if(posValueTypes.size() != 0){
      result.addAll( uimaDocumentService.getPosTypesSummation(
          posValueTypes.toArray(new String[0]), Integer.parseInt(limit), namesAsArray));
    }
    if (allTypes.size() != 0){
      result.addAll(uimaDocumentService.getTypesSummation(
          allTypes.toArray(new String[0]), Integer.parseInt(limit), namesAsArray));
    }

    Collections.sort(result, Comparator.comparing(UimaEntitySummation ::getCount).reversed());


    return result;
  }


  /**
   * To get all document names that are stored in db
   *
   * @return
   */
  @GetMapping("/documents/all/namesandgroup")
  public List<UimaDocument> getAllDocumentNames() {
    return uimaDocumentService.getAllDocumentNamesAndGroups();
  }

  @PostMapping("/documents")
  public UimaDocument newUimaDocument(UimaDocument uimaDocument) {
    return uimaDocumentService.putNewUimaDocument(uimaDocument);
  }

}
