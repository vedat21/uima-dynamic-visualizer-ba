/*

package root.fileUpload;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class FileUploadController {

 @Autowired
 private StorageService storageService;



 @PostMapping("/upload")
 public String handleFileUpload(@RequestParam("file") MultipartFile file,
     RedirectAttributes redirectAttributes) {

   storageService.store(file);
   redirectAttributes.addFlashAttribute("message",
       "You successfully uploaded " + file.getOriginalFilename() + "!");

   return "redirect:/";
 }


 @ExceptionHandler(StorageFileNotFoundException.class)
 public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
   return ResponseEntity.notFound().build();
 }



}

*/