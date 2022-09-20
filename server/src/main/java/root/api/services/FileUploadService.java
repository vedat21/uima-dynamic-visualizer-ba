package root.api.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import org.apache.uima.UIMAException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Env;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import root.helper.ImportDocumentsHelper;

@Service
public class FileUploadService {

  @Autowired
  private Environment env;

  @Autowired
  private ImportDocumentsHelper importDocumentsHelper;

  /**
   * saves file to upload dir. overrides when file with name exists already. Calls function
   * ImportDocumentsHelper.importDocuments after saving: -> Creates UimaDocument entity in db for
   * every file in upload dir.
   *
   * @param multipartFile
   * @return
   */
  public String saveFile(MultipartFile multipartFile, String group) {
    try {
      Path uploadDir = Paths.get(Objects.requireNonNull(env.getProperty("file.upload-dir")));
      // if there is no uploadDir
      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }
      Path fileDir = uploadDir.resolve(Objects.requireNonNull(multipartFile.getOriginalFilename()));
      Files.copy(multipartFile.getInputStream(), fileDir, StandardCopyOption.REPLACE_EXISTING);

      importDocumentsHelper.importDocuments(multipartFile, group);
    } catch (IOException | UIMAException e) {
      throw new RuntimeException(e);
    }

    return multipartFile.getName();
  }

}
