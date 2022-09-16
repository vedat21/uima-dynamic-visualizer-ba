package root.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import root.api.repositories.PresentationLayoutRepository;
import root.entities.PresentationLayout;

import java.util.List;
import java.util.Optional;

@Service
public class PresentationLayoutService {

    @Autowired
    PresentationLayoutRepository repository;

    public PresentationLayout putNewLayout(PresentationLayout layout) {
        return repository.save(layout);
    }

    public void deletePresentationLayoutById(String id){
        repository.deleteById(id);
    }

    public Optional<PresentationLayout> getPresentationById(String id) {
        return repository.findById(id);
    }

    public List<PresentationLayout> getPresentations() {
        return repository.findAll();
    }

}