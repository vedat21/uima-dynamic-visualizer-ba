package root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import root.helper.ImportDocumentsHelper;

// custom modules


@SpringBootApplication
@EnableMongoRepositories
public class UimaDynamicVisualizerServerApplication implements CommandLineRunner {

  @Autowired
  ImportDocumentsHelper importDocumentsHelper;

  public static void main(String... args) {
    SpringApplication.run(UimaDynamicVisualizerServerApplication.class, args);
  }

  @Override
  public void run(String... args) throws Exception {

    importDocumentsHelper.importDocuments();

  }
}
