package root.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import root.api.services.FileUploadService;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

  @Autowired
  FileUploadService fileUploadService;

  @PostMapping("/upload")
  public String uploadFile(@RequestParam MultipartFile file, @RequestParam String group) {
    return fileUploadService.saveFile(file, group);
  }

}
