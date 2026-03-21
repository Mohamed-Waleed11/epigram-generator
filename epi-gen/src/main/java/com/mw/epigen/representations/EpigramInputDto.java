package com.mw.epigen.representations;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EpigramInputDto {

    private String author;

    private String text;

    public void validate() {

        if (author == null || author.trim().isEmpty()) {
            throw new IllegalArgumentException("Epigram text must not be empty");
        }

        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Epigram text must not be empty");
        }
    }
}