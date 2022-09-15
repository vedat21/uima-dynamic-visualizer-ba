package root;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.apache.uima.util.XmlCasDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

// custom modules
import root.database.UimaDocumentRepository;
import root.entities.UimaDocument;


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
    File folder = new File(System.getenv("path"));

    for (File xmlDocument : folder.listFiles()) {
      if (xmlDocument.getName().endsWith("xmi")) {
        repository.save(new UimaDocument(xmlDocument));
      }
    }

  }
}
