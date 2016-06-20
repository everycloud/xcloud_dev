package com.example.basetech.app.crud.sql;

public class ColumnMapping {

    private String columnName;
    private String fieldName;

    public ColumnMapping(String columnName, String fieldName) {
        super();
        this.columnName = columnName;
        this.fieldName = fieldName;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

}