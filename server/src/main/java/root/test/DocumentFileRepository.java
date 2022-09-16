package root.test;

import org.springframework.data.mongodb.repository.MongoRepository;
import root.entities.DocumentFile;

public interface DocumentFileRepository extends MongoRepository<DocumentFile, String> {
}
