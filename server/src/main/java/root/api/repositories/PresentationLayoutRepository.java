package root.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// custom
import root.entities.PresentationLayout;

@RepositoryRestResource(path = "layouts")
public interface PresentationLayoutRepository extends MongoRepository<PresentationLayout, String> {
}
