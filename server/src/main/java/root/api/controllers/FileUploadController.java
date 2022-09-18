package root.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import root.api.services.FileUploadService;

@RestController
@RequestMapping
public class FileUploadController {

  @Autowired
  FileUploadService fileUploadService;

  @PostMapping("/upload")
  public String uploadFile(@RequestBody MultipartFile file) {
    return fileUploadService.saveFile(file);
  }

}
