package com.syed.urlshortener.repository;

import com.syed.urlshortener.model.URLMapping;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

@Repository
public class URLMappingRepositoryDynamo {

    private final DynamoDbTable<URLMapping> urlMappingTable;

    public URLMappingRepositoryDynamo(DynamoDbEnhancedClient enhancedClient, @Value("${dynamodb.table-name}") String tableName) {
        this.urlMappingTable = enhancedClient.table(tableName, TableSchema.fromBean(URLMapping.class));
    }

    public void save(URLMapping urlMapping) {
        urlMappingTable.putItem(urlMapping);
    }

    public URLMapping findById(String shortKey) {
        Key key = Key.builder()
                .partitionValue(shortKey)
                .build();
        return urlMappingTable.getItem(key);
    }
}
