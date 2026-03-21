package com.mw.epigen.representations;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EpigramResponse {

    private long id;

    private String text;

    private Instant createdAt;
}
