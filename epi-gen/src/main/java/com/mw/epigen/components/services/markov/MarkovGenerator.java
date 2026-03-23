package com.mw.epigen.components.services.markov;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MarkovGenerator {

    private final Map<String, List<String>> chain = new HashMap<>();
    private final Random random = new Random();

    public void train(List<String> sentences) {
        for (String sentence : sentences) {
            String[] words = sentence.split(" ");

            for (int i = 0; i < words.length - 2; i++) {
                String key = words[i] + " " + words[i + 1];

                chain.computeIfAbsent(key, k -> new ArrayList<>()).add(words[i + 2]);
            }
        }
    }

    public String generate(int maxWords) {
        if (chain.isEmpty()) return "No data";

        List<String> keys = new ArrayList<>(chain.keySet());
        String key = keys.get(random.nextInt(keys.size()));

        StringBuilder result = new StringBuilder(key);

        for (int i = 0; i < maxWords; i++) {
            List<String> nextWords = chain.get(key);
            if (nextWords == null) break;

            String next = nextWords.get(random.nextInt(nextWords.size()));
            result.append(" ").append(next);

            String[] parts = key.split(" ");
            key = parts[1] + " " + next;
        }

        return format(result.toString());
    }

    private String format(String text) {
        text = text.trim();
        return text.substring(0, 1).toUpperCase() + text.substring(1) + ".";
    }
}
