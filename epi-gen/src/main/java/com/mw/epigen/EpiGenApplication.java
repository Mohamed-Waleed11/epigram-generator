package com.mw.epigen;

import com.mw.epigen.components.entities.epigram.Epigram;
import com.mw.epigen.components.entities.epigram.EpigramRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EpiGenApplication {

    public static void main(String[] args) {
        SpringApplication.run(EpiGenApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(EpigramRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Epigram("Mohamed", "Less is more."));
                repository.save(new Epigram("Mohamed","Knowledge is power."));
                repository.save(new Epigram("Mohamed","Talk is cheap. Show me the code."));
                repository.save(new Epigram("Mohamed","Simplicity is the soul of efficiency."));
                repository.save(new Epigram("Mohamed","Code never lies, comments sometimes do."));
            }
        };
    }

}
