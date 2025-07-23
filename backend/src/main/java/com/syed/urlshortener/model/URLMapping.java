package com.syed.urlshortener.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@DynamoDbBean
@Data
@AllArgsConstructor
@NoArgsConstructor
public class URLMapping {
    private String shortKey;
    private String longUrl;
    private long createdAt;

    @DynamoDbPartitionKey
    public String getShortKey() {
        return this.shortKey;
    }
}
