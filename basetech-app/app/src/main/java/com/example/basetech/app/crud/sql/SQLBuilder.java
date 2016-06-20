package com.example.basetech.app.crud.sql;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.jdbc.SQL;

public class SQLBuilder {

    private static SQLBuilder       instance;

    private TableNameParser         tableNameParser;
    private ColumnParser            columnParser;

    private Map<Class<?>, String[]> prepareInsertList   = new HashMap<Class<?>, String[]>();
    private Map<Class<?>, String>   prepareUpdateList   = new HashMap<Class<?>, String>();
    private Map<Class<?>, String>   prepareSelectByPage = new HashMap<Class<?>, String>();

    private SQLBuilder(boolean mapCamelCaseToUnderscore) {
        instance = this;
        tableNameParser = new TableNameParser(mapCamelCaseToUnderscore);
        columnParser = new ColumnParser(mapCamelCaseToUnderscore);
    }

    public static SQLBuilder getInstance(boolean mapCamelCaseToUnderscore) {
        if (instance == null) {
            instance = new SQLBuilder(mapCamelCaseToUnderscore);
        }
        return instance;
    }

    public static SQLBuilder getInstance() {
        return instance;
    }

    public String buildInsert(Class<?> entityClass) {

        String tableName = tableNameParser.parse(entityClass);
        ColumnMapping[] columnMappings = columnParser.parse(entityClass);

        StringBuilder columns = new StringBuilder();
        StringBuilder values = new StringBuilder();
        for (ColumnMapping columnMap : columnMappings) {
            columns.append("`").append(columnMap.getColumnName()).append("`,");
            values.append("#{").append(columnMap.getFieldName()).append("},");
        }
        // delete the last ','
        columns.delete(columns.length() - 1, columns.length());
        values.delete(values.length() - 1, values.length());

        return new SQL().INSERT_INTO(tableName).VALUES(columns.toString(), values.toString())
            .toString();
    }

    public void prepareInsertList(Class<?> entityClass) {

        String tableName = tableNameParser.parse(entityClass);
        ColumnMapping[] columnMaps = columnParser.parse(entityClass);

        StringBuilder columns = new StringBuilder();
        StringBuilder values = new StringBuilder();
        for (ColumnMapping columnMap : columnMaps) {
            columns.append("`").append(columnMap.getColumnName()).append("`,");
            values.append("#{sqlParamters[0].").append(columnMap.getFieldName()).append("},");
        }
        columns.delete(columns.length() - 1, columns.length());
        values.delete(values.length() - 1, values.length());

        String sqlPrefix = new SQL().INSERT_INTO(tableName).toString() + " (" + columns.toString()
                           + ") VALUES ";
        String sqlParamters = "(" + values.toString() + ")";

        prepareInsertList.put(entityClass, new String[] { sqlPrefix, sqlParamters });

    }

    public String buildInsertList(Class<?> entityClass, String paramterName, int entitiesSize) {

        String[] prepareSQL = prepareInsertList.get(entityClass);
        String sqlPrefix = prepareSQL[0];
        String sqlParamters = prepareSQL[1];

        StringBuilder sql = new StringBuilder();
        sql.append(sqlPrefix);
        for (int i = 0; i < entitiesSize; i++) {
            sql.append(
                sqlParamters.toString().replaceAll("sqlParamters\\[0\\]",
                    paramterName + "[" + i + "]")).append(",");

        }

        sql.delete(sql.length() - 1, sql.length());

        return sql.toString();
    }

    public String buildDeleteById(Class<?> entityClass) {
        String tableName = tableNameParser.parse(entityClass);
        return new SQL().DELETE_FROM(tableName).WHERE("id=#{id}").toString();
    }

    public String buildDeleteAll(Class<?> entityClass) {
        String tableName = tableNameParser.parse(entityClass);
        return new SQL().DELETE_FROM(tableName).toString();
    }

    public String buildUpdate(Class<?> entityClass) {

        String tableName = tableNameParser.parse(entityClass);
        ColumnMapping[] columnMaps = columnParser.parse(entityClass);

        StringBuilder updateSets = new StringBuilder();
        for (ColumnMapping columnMap : columnMaps) {
            updateSets.append(columnMap.getColumnName()).append("=#{")
                .append(columnMap.getFieldName()).append("},");
        }
        updateSets.delete(updateSets.length() - 1, updateSets.length());

        return new SQL().UPDATE(tableName).SET(updateSets.toString()).WHERE("id=#{id}").toString();
    }

    public void prepareUpdateList(Class<?> entityClass) {

        String tableName = tableNameParser.parse(entityClass);
        ColumnMapping[] columnMaps = columnParser.parse(entityClass);

        StringBuilder updateSets = new StringBuilder();
        for (ColumnMapping columnMap : columnMaps) {
            updateSets.append(columnMap.getColumnName()).append("=#{sqlParamters[0].")
                .append(columnMap.getFieldName()).append("},");
        }
        updateSets.delete(updateSets.length() - 1, updateSets.length());

        String sql = new SQL().UPDATE(tableName).SET(updateSets.toString())
            .WHERE("id=#{sqlParamters[0].id}").toString();

        prepareUpdateList.put(entityClass, sql);
    }

    public String buildUpdateList(Class<?> entityClass, String paramterName, int entitiesSize) {

        String prepareSQL = prepareUpdateList.get(entityClass);

        StringBuilder sql = new StringBuilder();
        for (int i = 0; i < entitiesSize; i++) {
            sql.append(prepareSQL.replaceAll("sqlParamters\\[0\\]", paramterName + "[" + i + "]"))
                .append(";");

        }

        return sql.toString();
    }

    public String buildSelectById(Class<?> entityClass) {
        String tableName = tableNameParser.parse(entityClass);
        return new SQL().SELECT("*").FROM(tableName).WHERE("id=#{id}").toString();
    }

    public String buildSelectAll(Class<?> entityClass) {
        String tableName = tableNameParser.parse(entityClass);
        return new SQL().SELECT("*").FROM(tableName).toString();
    }

    public String buildSelectByPage(Class<?> entityClass) {
        String tableName = tableNameParser.parse(entityClass);
        String sql = new SQL().SELECT("*").FROM(tableName).toString();
        return sql + " LIMIT #{limitFrom}, #{limitSize}";
    }

    public String buildSelectByPageDesc(Class<?> entityClass) {
        String tableName = tableNameParser.parse(entityClass);
        String sql = new SQL().SELECT("*").FROM(tableName).toString();
        return sql + " ORDER BY id DESC LIMIT #{limitFrom}, #{limitSize}";
    }

    public String buildSelectByColumn(Class<?> entityClass, String column) {
        String tableName = tableNameParser.parse(entityClass);
        return new SQL().SELECT("*").FROM(tableName).WHERE(column + "=#{" + column + "}")
            .toString();

    }

    public String buildNextVal(String name) {
        return "select nextval('" + name + "')";
    }
}
