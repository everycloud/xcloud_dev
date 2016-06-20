package com.example.basetech.app.crud.sql;


import com.example.basetech.app.crud.util.StringUtil;
import com.example.basetech.app.model.TableName;

public class TableNameParser {

    private boolean mapCamelCaseToUnderscore = false;

    public TableNameParser(boolean mapCamelCaseToUnderscore) {
        this.mapCamelCaseToUnderscore = mapCamelCaseToUnderscore;
    }

    /**
     * <p> Gets table name from annotation {@link TableName} <p/>
     * <p> Parses table name from entity class if {@link TableName} was not used:  <br/>
     * 1. gets simple name of the class, <br/>
     * 2. strips a substring named "DO"(case insensitive) from the end, <br/>
     * 3. converts from camel case to underscore if the {@link mapUnderscoreToCamelCase} was set true. <p>
     * 
     * @param entityClass
     * @return table name
     */
    public String parse(Class<?> entityClass) {

        String tableName = getTableNameFromAnnotation(entityClass);
        if (tableName == null) {
            tableName = parseTableNameFromClass(entityClass);
        }

        return tableName;
    }

    private String getTableNameFromAnnotation(Class<?> entityClass) {
        TableName tableName = entityClass.getAnnotation(TableName.class);
        if (tableName == null) {
            return null;
        }
        return tableName.value();
    }

    private String parseTableNameFromClass(Class<?> entityClass) {
        String className = entityClass.getSimpleName();
        String tableName = className.replaceAll("D(?i)O$", "");
        if (mapCamelCaseToUnderscore) {
            tableName = StringUtil.camelCase2Underscore(tableName);
        }
        return tableName;
    }
}
