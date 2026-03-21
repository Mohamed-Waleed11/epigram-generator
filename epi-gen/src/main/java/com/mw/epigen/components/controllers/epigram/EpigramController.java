package com.mw.epigen.components.controllers.epigram;

import com.mw.epigen.components.entities.epigram.Epigram;
import com.mw.epigen.components.entities.epigram.EpigramRepository;
import com.mw.epigen.components.services.epigram.EpigramService;
import com.mw.epigen.representations.EpigramInputDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/epigrams")
public class EpigramController {

    private final EpigramService epigramService;

    public EpigramController(EpigramService epigramService) {
        this.epigramService = epigramService;
    }

    @GetMapping
    public List<Epigram> getAllEpigrams() {
        return epigramService.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createEpigram(@RequestBody EpigramInputDto input) {
        epigramService.createEpigram(input);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> like(@PathVariable Long id) {
        epigramService.likeEpigram(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<Void> dislike(@PathVariable Long id) {
        epigramService.dislikeEpigram(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        epigramService.deleteEpigram(id);
        return ResponseEntity.noContent().build();
    }
}
