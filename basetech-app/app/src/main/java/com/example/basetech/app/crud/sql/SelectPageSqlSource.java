package com.example.basetech.app.crud.sql;

import java.util.Map;

import org.apache.ibatis.builder.SqlSourceBuilder;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.scripting.xmltags.DynamicContext;
import org.apache.ibatis.scripting.xmltags.SqlNode;
import org.apache.ibatis.session.Configuration;

public class SelectPageSqlSource implements SqlSource {

    private Configuration configuration;
    private SqlNode       rootSqlNode;

    public SelectPageSqlSource(Configuration configuration, SqlNode rootSqlNode) {
        this.configuration = configuration;
        this.rootSqlNode = rootSqlNode;
    }

    public BoundSql getBoundSql(Object parameterObject) {

        Map<String, Object> params = (Map<String, Object>) parameterObject;
        int pageNumber = (Integer) params.get("pageNumber");
        int pageSize = (Integer) params.get("pageSize");
        long limitFrom = pageSize * (pageNumber - 1);
        params.put("limitFrom", limitFrom);
        params.put("limitSize", pageSize);

        DynamicContext context = new DynamicContext(configuration, parameterObject);
        rootSqlNode.apply(context);
        SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
        Class<?> parameterType = parameterObject == null ? Object.class : parameterObject
            .getClass();
        SqlSource sqlSource = sqlSourceParser.parse(context.getSql(), parameterType,
            context.getBindings());
        BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
        for (Map.Entry<String, Object> entry : context.getBindings().entrySet()) {
            boundSql.setAdditionalParameter(entry.getKey(), entry.getValue());
        }
        return boundSql;
    }
}