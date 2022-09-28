package root.helper;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.uima.UIMAException;
import org.bson.BSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import root.api.repositories.UimaDocumentRepository;
import root.api.services.UimaDocumentService;
import root.entities.UimaDocument;


@Component
public class ImportDocumentsHelper {

  @Autowired
  UimaDocumentService uimaDocumentService;
  @Autowired
  UimaDocumentRepository uimaDocumentRepository;

  @Autowired
  private Environment env;

  public void importDocuments(MultipartFile multipartFile, String group) throws UIMAException {

    // to not import duplicate xmlDocuments by filename
    List<String> allDocumentNamesInDatabase =
        uimaDocumentService.getAllDocumentNamesAndGroups().stream()
            .map(uimaDocument -> uimaDocument.getName()).collect(
                Collectors.toList());
    // get upload dir
    File folder = new File(Objects.requireNonNull(env.getProperty("file.upload-dir")));
    for (String documentNameInDB : allDocumentNamesInDatabase) {
      if (!Arrays.asList(folder.list()).contains(documentNameInDB)) {
        uimaDocumentRepository.deleteUimaDocumentByName(documentNameInDB);
      }
    }

    /*
    Create uimadocument entity in db from file.
    If data is to large to save in one mongo document it will try to split the data so long
    till no exception occurs.
    */
    if (!allDocumentNamesInDatabase.contains(multipartFile.getOriginalFilename())) {
      boolean imported = false;
      int splitter = 1;
      while (!imported) {
        try {
          for (int i = 1; i <= splitter; i++) {
            uimaDocumentRepository.save(new UimaDocument(multipartFile, group, i, splitter));
          }
          imported = true;
        } catch (BSONException e) {
          e.printStackTrace();
          splitter *= 2;
        }
      }
    }

  }
}
