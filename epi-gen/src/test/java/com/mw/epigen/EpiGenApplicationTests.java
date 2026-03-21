package com.mw.epigen;

import com.mw.epigen.components.entities.epigram.Epigram;
import com.mw.epigen.components.entities.epigram.EpigramRepository;
import com.mw.epigen.components.services.epigram.EpigramService;
import com.mw.epigen.exceptions.EpigramNotFoundException;
import com.mw.epigen.representations.EpigramInputDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EpiGenApplicationTests {

    @Autowired
    private EpigramService epigramService;

    @Autowired
    private EpigramRepository epigramRepository;

    @BeforeEach
    void cleanDb() {
        epigramRepository.deleteAll();
    }

    @Test
    void createEpigram_shouldPersist() {
        EpigramInputDto input = new EpigramInputDto("Author", "Test epigram");

        epigramService.createEpigram(input);

        List<Epigram> all = epigramService.findAll();

        assertEquals(1, all.size());
        assertEquals("Test epigram", all.getFirst().getText());
        assertEquals("Author", all.getFirst().getAuthor());
    }

    @Test
    void createEpigram_shouldFail_whenInvalid() {
        EpigramInputDto input = new EpigramInputDto("", "");

        assertThrows(RuntimeException.class, () -> {
            epigramService.createEpigram(input);
        });

        assertEquals(0, epigramRepository.findAll().size());
    }

    @Test
    void findAll_shouldReturnData() {
        epigramRepository.save(new Epigram("A", "Text 1"));
        epigramRepository.save(new Epigram("B", "Text 2"));

        List<Epigram> result = epigramService.findAll();

        assertEquals(2, result.size());
    }

    @Test
    void likeEpigram_shouldIncrementLikes() {
        Epigram epigram = epigramRepository.save(new Epigram("A", "Text"));

        epigramService.likeEpigram(epigram.getId());

        Epigram updated = epigramRepository.findById(epigram.getId()).orElseThrow();

        assertEquals(1, updated.getLikes());
    }

    @Test
    void likeEpigram_shouldThrow_whenNotFound() {
        assertThrows(EpigramNotFoundException.class, () -> {
            epigramService.likeEpigram(999L);
        });
    }

    @Test
    void dislikeEpigram_shouldIncrementDislikes() {
        Epigram epigram = epigramRepository.save(new Epigram("A", "Text"));

        epigramService.dislikeEpigram(epigram.getId());

        Epigram updated = epigramRepository.findById(epigram.getId()).orElseThrow();

        assertEquals(1, updated.getDislikes());
    }

    @Test
    void deleteEpigram_shouldRemove() {
        Epigram epigram = epigramRepository.save(new Epigram("A", "Text"));

        epigramService.deleteEpigram(epigram.getId());

        assertTrue(epigramRepository.findById(epigram.getId()).isEmpty());
    }

    @Test
    void deleteEpigram_shouldThrow_whenNotFound() {
        assertThrows(EpigramNotFoundException.class, () -> {
            epigramService.deleteEpigram(999L);
        });
    }


}
