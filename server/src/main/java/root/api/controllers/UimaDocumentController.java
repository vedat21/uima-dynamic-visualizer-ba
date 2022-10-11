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
import root.entities.UIMADocument;
import root.entities.UIMATypesSummation;


@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class UimaDocumentController {

  @Autowired
  private UimaDocumentService uimaDocumentService;

  @PostMapping("/documents")
  public UIMADocument newUIMADocument(UIMADocument uimaDocument) {
    return uimaDocumentService.putNewUimaDocument(uimaDocument);
  }

  /**
   * To get all document names that are stored in db
   *
   * @return
   */
  @GetMapping("/documents/all/namesandgroup")
  public List<UIMADocument> getAllDocumentNamesAndGroups() {
    return uimaDocumentService.getAllDocumentNamesAndGroups();
  }

  @GetMapping("/text/{name}")
  public Object getTextFromOne(@PathVariable String name) {
    return uimaDocumentService.getTextFromOne(name);
  }


  /**
   * ® to delete the collection
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

  /**
   * to get summed data of the given types.
   *
   * @param types
   * @return
   */
  @GetMapping("/documents/sum")
  public List<UIMATypesSummation> getTypesSummation(
      @RequestParam Optional<String> types,
      @RequestParam(defaultValue = "0") String limit,
      @RequestParam Optional<String> names,
      @RequestParam Optional<String> begin,
      @RequestParam Optional<String> end

  ) {

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
      result.addAll(uimaDocumentService.getTypesSummation(
          posValueTypes.toArray(new String[0]), Integer.parseInt(limit), namesAsArray, begin, end,
          "tokenValue"));
    }
    if (allTypes.size() != 0) {
      result.addAll(uimaDocumentService.getTypesSummation(
          allTypes.toArray(new String[0]), Integer.parseInt(limit), namesAsArray, begin, end,
          "value"));
    }

    Collections.sort(result, Comparator.comparing(UIMATypesSummation::getCount).reversed());

    return result;
  }

  /**
   * to get summed data of the given types.
   *
   * @return
   */
  @GetMapping("/documents/sum/locations")
  public List<UIMATypesSummation> getLocationSummation(
      @RequestParam Optional<String> names,
      @RequestParam(defaultValue = "0") String limit,
      @RequestParam Optional<String> begin,
      @RequestParam Optional<String> end

  ) {

    String[] namesAsArray = names.stream().collect(Collectors.toList()).get(0).split(",");

    return uimaDocumentService.getLocationSummation(namesAsArray, Integer.parseInt(limit), begin,
        end);
  }

}




   /*
   * returns document with given id. if params types is given then only data for these types(keys)
   * is available. others are null
   *

  @GetMapping("/documents/{id}")
  public List<UIMADocument> findByIdWithKeys(@RequestParam Optional<String> types,
      @PathVariable String id) {
    if (types.isEmpty()) {
      return uimaDocumentService.findById(id).stream().collect(Collectors.toList());
    } else {
      return uimaDocumentService.findByIdWithKeys(types.stream().collect(Collectors.toList()), id);
    }
  }


   * returns all documents. if params types is given then only data for these types(keys) is
   * available. others are null
   *
  @GetMapping("/documents/all")
  public List<UIMADocument> findAllWithKeys(@RequestParam Optional<String> types) {
    if (types.isEmpty()) {
      return uimaDocumentService.findAll();
    } else {
      return uimaDocumentService.findAllWithKeys(types.stream().collect(Collectors.toList()));
    }
  }
  */

