package root.api.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Env;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

  @Autowired
  private Environment env;

  /**
   * saves file to upload dir. overrides when file with name exists already
   * @param file
   * @return
   */
  public String saveFile(MultipartFile file){
    Path uploadDir = Paths.get(Objects.requireNonNull(env.getProperty("file.upload-dir")));

    try {

      // if there is no uploadDir
      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      Path fileDir = uploadDir.resolve(file.getOriginalFilename());
      Files.copy(file.getInputStream(), fileDir, StandardCopyOption.REPLACE_EXISTING);

    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    return file.getName();
  }

}
