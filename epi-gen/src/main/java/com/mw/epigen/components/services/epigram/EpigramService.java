package com.mw.epigen.components.services.epigram;

import com.mw.epigen.components.entities.epigram.Epigram;
import com.mw.epigen.components.entities.epigram.EpigramRepository;
import com.mw.epigen.components.services.markov.EpigramGenerationService;
import com.mw.epigen.exceptions.EpigramNotFoundException;
import com.mw.epigen.representations.EpigramInputDto;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class EpigramService {

    private final EpigramGenerationService epigramGenerationService;
    private final EpigramRepository epigramRepository;

    public EpigramService(EpigramGenerationService epigramGenerationService, EpigramRepository epigramRepository) {
        this.epigramGenerationService = epigramGenerationService;
        this.epigramRepository = epigramRepository;
    }

    public Epigram generateEpigram() {
        return epigramGenerationService.generateAndSave();
    }

    public Epigram createEpigram(EpigramInputDto input) {
        input.validate();

        Epigram epigram = new Epigram(input.getAuthor(), input.getText());

        epigramRepository.save(epigram);

        return epigram;
    }

    public List<Epigram> findAllUserGenerated() {
        return epigramRepository.findAllByAuthor("AI");
    }

    public void likeEpigram(long id) {
        int updated = epigramRepository.incrementLikes(id);

        if (updated == 0) {
            throw new EpigramNotFoundException("Epigram not found");
        }
    }

    public void dislikeEpigram(long id) {
        int updated = epigramRepository.incrementDislikes(id);

        if (updated == 0) {
            throw new EpigramNotFoundException("Epigram not found");
        }
    }

    public void deleteEpigram(long id) {
        int deleted = epigramRepository.deleteEpigram(id);

        if (deleted == 0) {
            throw new EpigramNotFoundException("Epigram not found");
        }
    }

}
