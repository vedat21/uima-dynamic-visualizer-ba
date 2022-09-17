package root.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import root.api.services.FileUploadService;

@Controller
public class FileUploadController {

  @Autowired
  FileUploadService fileUploadService;

  @PostMapping("/upload")
  public String uploadFile(@RequestBody MultipartFile file){
      return fileUploadService.saveFile(file);
  }

}
