package root.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class DocumentFileService {

    @Autowired
    private GridFsTemplate template;
    @Autowired
    private GridFsOperations operations;



    public String add(MultipartFile file) throws IOException {
        File fileToUpload = new File("/Users/vyildiz/soko/upload/testiwas");
        InputStream in = new FileInputStream(fileToUpload);

        Object fileID = template.store(in, fileToUpload.getName());

        return fileToUpload.getName();
    }
}
