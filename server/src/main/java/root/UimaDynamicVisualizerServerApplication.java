package root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

// custom modules
import root.api.repositories.UimaDocumentRepository;


@SpringBootApplication
@EnableMongoRepositories
public class UimaDynamicVisualizerServerApplication implements CommandLineRunner {

  @Autowired
  UimaDocumentRepository repository;

  public static void main(String... args) {
    SpringApplication.run(UimaDynamicVisualizerServerApplication.class, args);
  }

  @Override
  public void run(String... args) throws Exception {
    /*
    File folder = new File(System.getenv("path"));

    for (File xmlDocument : folder.listFiles()) {
      if (xmlDocument.getName().endsWith("xmi")) {
        repository.save(new UimaDocument(xmlDocument));
      }
    }

     */

  }
}
