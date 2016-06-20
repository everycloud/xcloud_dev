package com.example.basetech.app.crud.sql;

import java.lang.reflect.Field;

import com.example.basetech.app.crud.util.FieldUtil;
import com.example.basetech.app.crud.util.StringUtil;

public class ColumnParser {

    private boolean mapCamelCaseToUnderscore = false;

    public ColumnParser(boolean mapCamelCaseToUnderscore) {
        this.mapCamelCaseToUnderscore = mapCamelCaseToUnderscore;
    }

    /**
     * Gets column names from entity class <br/>
     * 1. gets field names of the class, <br/>
     * 2. converts from camel case to underscore if the {@link mapUnderscoreToCamelCase} was set true. <p>
     * 
     * @param entityClass
     * @return array of ColumnMapping, null if there is no valid fields
     */
    public ColumnMapping[] parse(Class<?> entityClass) {

        Field[] fields = FieldUtil.getValidFields(entityClass);
        if (fields == null || fields.length <= 0) {
            return null;
        }

        ColumnMapping[] columns = new ColumnMapping[fields.length];
        for (int i = 0; i < fields.length; i++) {
            columns[i] = new ColumnMapping(parseColumnNameFromField(fields[i]), fields[i].getName());
        }

        return columns;
    }

    private String parseColumnNameFromField(Field field) {
        String columnName = field.getName();
        if (mapCamelCaseToUnderscore) {
            columnName = StringUtil.camelCase2Underscore(columnName);
        }
        return columnName;
    }

}
