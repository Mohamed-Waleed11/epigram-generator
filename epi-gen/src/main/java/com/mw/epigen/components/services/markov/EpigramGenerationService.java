package com.mw.epigen.components.services.markov;

import com.mw.epigen.components.entities.epigram.Epigram;
import com.mw.epigen.components.entities.epigram.EpigramRepository;
import org.springframework.stereotype.Service;

@Service
public class EpigramGenerationService {

    private final MarkovGenerator generator;
    private final EpigramRepository repository;

    public EpigramGenerationService(MarkovGenerator generator, EpigramRepository repository, EpigramTrainingData trainingData) {
        this.generator = generator;
        this.repository = repository;

        generator.train(trainingData.getTrainingData());
    }

    public Epigram generateAndSave() {
        String text = generator.generate(15);

        Epigram epigram = new Epigram("AI", text);
        return repository.save(epigram);
    }
}
