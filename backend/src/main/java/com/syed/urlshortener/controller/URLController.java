package com.syed.urlshortener.controller;

import com.syed.urlshortener.service.URLShortenerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/") // This sets the base path for all handlers in this controller
public class URLController {

    private final URLShortenerService service;

    public URLController(URLShortenerService service) {
        this.service = service;
    }

    /**
     * FIX: Add a handler for the root path GET /
     * This method will now handle the requests that were previously causing a 404 error.
     */
    @GetMapping
    public String handleRootRequest() {
        return "Welcome to the URL Shortener API. Use POST /shorten to create a short URL.";
    }

    @PostMapping("/shorten")
    public String shortenUrl(@RequestBody String longUrl) {
        // Strip JSON wrapper if accidentally sent
        if (longUrl.trim().startsWith("{")) {
            longUrl = longUrl.replaceAll(".*\"longUrl\"\\s*:\\s*\"([^\"]+)\".*", "$1");
        }

        // Validate input
        if (longUrl == null || longUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        return service.shortenUrl(longUrl.trim());
    }


    /**
     * IMPROVEMENT: This method now performs a proper HTTP redirect instead of just returning text.
     */
    @GetMapping("/{shortKey}")
    public ResponseEntity<Void> redirect(@PathVariable String shortKey) {
        String longUrl = service.getOriginalUrl(shortKey);

        if (longUrl == null) {
            return ResponseEntity.notFound().build();
        }

        // Safety check for corrupted JSON data
        if (longUrl.trim().startsWith("{")) {
            try {
                // Extract URL from JSON if accidentally stored
                longUrl = longUrl.replaceAll(".*\"longUrl\"\\s*:\\s*\"([^\"]+)\".*", "$1");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        try {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(longUrl))
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
