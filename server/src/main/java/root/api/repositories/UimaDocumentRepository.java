package root.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

// custom
import root.entities.UimaDocument;


@RepositoryRestResource(path = "uimadocuments")
public interface UimaDocumentRepository extends MongoRepository<UimaDocument, String> {

    @Override
    @Query(fields = "{_id:  0, testType:  0}") // geht nicht
    public Optional<UimaDocument> findById(String id); // Soll nur ein Dokument zurückgeben, aber in liste.


    /**
     * number of documents in collection
     *
     * @return
     */
    @Query(value = "{}", count = true)
    public int countAll();



}




