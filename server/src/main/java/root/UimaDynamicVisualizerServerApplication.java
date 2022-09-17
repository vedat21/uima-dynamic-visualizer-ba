package root;

import java.io.File;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

// custom modules
import root.api.repositories.UimaDocumentRepository;
import root.entities.UimaDocument;


@SpringBootApplication
@EnableMongoRepositories
public class UimaDynamicVisualizerServerApplication implements CommandLineRunner {

  @Autowired
  UimaDocumentRepository repository;

  @Autowired
  private Environment env;

  public static void main(String... args) {
    SpringApplication.run(UimaDynamicVisualizerServerApplication.class, args);
  }

  @Override
  public void run(String... args) throws Exception {

    File folder = new File(Objects.requireNonNull(env.getProperty("file.upload-dir")));

    System.out.println(folder.listFiles());

    for (File xmlDocument : folder.listFiles()) {
      if (xmlDocument.getName().endsWith("xmi")) {
        repository.save(new UimaDocument(xmlDocument));
      }
    }



  }
}
