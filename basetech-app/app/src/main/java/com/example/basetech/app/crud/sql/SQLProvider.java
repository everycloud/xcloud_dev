package com.example.basetech.app.crud.sql;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class SQLProvider<T> {

    public String insertList(Map<String, List<?>> entitiesMap) {

        Entry<String, List<?>> entry = entitiesMap.entrySet().iterator().next();
        String paramterName = entry.getKey();
        List<?> entities = entry.getValue();
        Class<?> entityClass = entities.get(0).getClass();

        return SQLBuilder.getInstance().buildInsertList(entityClass, paramterName, entities.size());
    }

    public String updateList(Map<String, List<?>> entitiesMap) {

        Entry<String, List<?>> entry = entitiesMap.entrySet().iterator().next();
        String paramterName = entry.getKey();
        List<?> entities = entry.getValue();
        Class<?> entityClass = entities.get(0).getClass();

        return SQLBuilder.getInstance().buildUpdateList(entityClass, paramterName, entities.size());
    }

}
