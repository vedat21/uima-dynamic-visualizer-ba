package root.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

// custom
import root.entities.UIMADocument;


@RepositoryRestResource(path = "uimadocuments")
public interface UimaDocumentRepository extends MongoRepository<UIMADocument, String> {

    /**
     * number of documents in collection
     *
     * @return
     */
    @Query(value = "{}", count = true)
    int countAll();
    Optional<UIMADocument> deleteByName(String name);

    Optional<UIMADocument> findByName(String name);

    @Query(value = "{}", fields = "{ 'date' : 1 }")
    Optional<UIMADocument> findByNameOrTypes(String name);

}




