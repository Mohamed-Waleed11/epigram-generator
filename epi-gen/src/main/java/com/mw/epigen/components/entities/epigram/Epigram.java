package com.mw.epigen.components.entities.epigram;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Epigram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Instant createdAt;

    private int likes;

    private int dislikes;

    private String text;

    private String author;

    public Epigram(String author, String text) {
        this.author = author;
        this.text = text;
        this.createdAt = Instant.now();
        this.likes = 0;
        this.dislikes = 0;
    }
    
}
