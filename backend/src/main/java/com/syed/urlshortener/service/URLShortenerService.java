package com.syed.urlshortener.service;

import com.syed.urlshortener.model.URLMapping;
import com.syed.urlshortener.repository.URLMappingRepositoryDynamo;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.UUID;

@Service
public class URLShortenerService {

    private final URLMappingRepositoryDynamo repo;

    public URLShortenerService(URLMappingRepositoryDynamo repo) {
        this.repo = repo;
    }

    public String shortenUrl(String longUrl) {
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String shortKey = Base64.getUrlEncoder().withoutPadding().encodeToString(uuid.getBytes()).substring(0, 8);
        URLMapping mapping = new URLMapping(shortKey, longUrl, System.currentTimeMillis());
        repo.save(mapping);
        return shortKey;
    }

    public String getOriginalUrl(String shortKey) {
        URLMapping mapping = repo.findById(shortKey);
        return (mapping != null) ? mapping.getLongUrl() : null;
    }
}
