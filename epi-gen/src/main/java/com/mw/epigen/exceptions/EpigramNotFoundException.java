package com.mw.epigen.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class EpigramNotFoundException extends RuntimeException {

    public EpigramNotFoundException(String message) {
        super(message);
    }
}