package root.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// custom
import root.entities.Presentation;

@RepositoryRestResource(path = "layouts")
public interface PresentationRepository extends MongoRepository<Presentation, String> {
}
