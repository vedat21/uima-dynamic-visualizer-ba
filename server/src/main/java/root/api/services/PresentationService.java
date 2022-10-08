package root.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import root.api.repositories.PresentationRepository;
import root.entities.Presentation;

import java.util.List;
import java.util.Optional;

@Service
public class PresentationService {

    @Autowired
    PresentationRepository presentationRepository;

    public Presentation putNewPresentation(Presentation presentation) {
        return presentationRepository.save(presentation);
    }

    public void deletePresentationLayoutById(String id){
        presentationRepository.deleteById(id);
    }

    public Optional<Presentation> getPresentationById(String id) {
        return presentationRepository.findById(id);
    }

    public List<Presentation> getPresentations() {
        return presentationRepository.findAll();
    }

}
