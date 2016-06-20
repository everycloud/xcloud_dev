package com.example.basetech.app.crud.mybatis;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;

import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.scripting.xmltags.DynamicSqlSource;
import org.apache.ibatis.scripting.xmltags.MixedSqlNode;
import org.apache.ibatis.scripting.xmltags.SqlNode;
import org.apache.ibatis.scripting.xmltags.TextSqlNode;
import org.apache.ibatis.session.Configuration;

import com.example.basetech.app.crud.CRUDBaseDAO;
import com.example.basetech.app.crud.CRUDEmptyDAO;
import com.example.basetech.app.crud.annotation.CRUDDeleteAll;
import com.example.basetech.app.crud.annotation.CRUDDeleteById;
import com.example.basetech.app.crud.annotation.CRUDInsert;
import com.example.basetech.app.crud.annotation.CRUDInsertList;
import com.example.basetech.app.crud.annotation.CRUDSelectAll;
import com.example.basetech.app.crud.annotation.CRUDSelectByColumn;
import com.example.basetech.app.crud.annotation.CRUDSelectById;
import com.example.basetech.app.crud.annotation.CRUDSelectByPage;
import com.example.basetech.app.crud.annotation.CRUDSelectByPageDesc;
import com.example.basetech.app.crud.annotation.CRUDSequence;
import com.example.basetech.app.crud.annotation.CRUDUpdateById;
import com.example.basetech.app.crud.annotation.CRUDUpdateList;
import com.example.basetech.app.crud.sql.SQLBuilder;
import com.example.basetech.app.crud.sql.SelectPageSqlSource;
import com.example.basetech.app.crud.util.FieldUtil;

public class CRUDMapperAnnotationBuilder {

    private static final Log logger = LogFactory.getLog(CRUDMapperAnnotationBuilder.class);

    private Configuration    config;
    private SQLBuilder       sqlBuilder;

    public CRUDMapperAnnotationBuilder(Configuration config) {
        this.config = config;
        this.sqlBuilder = SQLBuilder.getInstance(config.isMapUnderscoreToCamelCase());
    }

    public void parse(Class<?> type) {

        if (!isCRUDDAO(type)) {
            if (logger.isDebugEnabled()) {
                logger.debug("Class " + type.getName()
                             + " is not a DAO extends from CRUDBaseDAO, ignoring.");
            }
            return;
        }

        Class<?> entityClass = getGenericType(type);
        Method[] methods = type.getMethods();

        for (Method method : methods) {
            final String mappedStatementId = type.getName() + "." + method.getName();
            Annotation[] annotations = method.getAnnotations();

            for (Annotation annotation : annotations) {
                if (annotation instanceof CRUDInsert) {
                    correctSQL(mappedStatementId, sqlBuilder.buildInsert(entityClass));
                    break;
                }
                if (annotation instanceof CRUDInsertList) {
                    sqlBuilder.prepareInsertList(entityClass);
                    break;
                }

                if (annotation instanceof CRUDDeleteById) {
                    correctSQL(mappedStatementId, sqlBuilder.buildDeleteById(entityClass));
                    break;
                }
                if (annotation instanceof CRUDDeleteAll) {
                    correctSQL(mappedStatementId, sqlBuilder.buildDeleteAll(entityClass));
                    break;
                }

                if (annotation instanceof CRUDUpdateById) {
                    correctSQL(mappedStatementId, sqlBuilder.buildUpdate(entityClass));
                    break;
                }
                if (annotation instanceof CRUDUpdateList) {
                    sqlBuilder.prepareUpdateList(entityClass);
                    break;
                }

                if (annotation instanceof CRUDSelectById) {
                    correctSQL(mappedStatementId, sqlBuilder.buildSelectById(entityClass));
                    correctResultType(mappedStatementId, entityClass);
                    break;
                }
                if (annotation instanceof CRUDSelectByColumn) {
                    correctSQL(mappedStatementId, sqlBuilder.buildSelectByColumn(entityClass,
                        ((CRUDSelectByColumn) annotation).value()));
                    correctResultType(mappedStatementId, entityClass);
                    break;
                }
                if (annotation instanceof CRUDSelectAll) {
                    correctSQL(mappedStatementId, sqlBuilder.buildSelectAll(entityClass));
                    correctResultType(mappedStatementId, entityClass);
                    break;
                }
                if (annotation instanceof CRUDSelectByPage) {
                    correctSelectPageSQL(mappedStatementId,
                        sqlBuilder.buildSelectByPage(entityClass));
                    correctResultType(mappedStatementId, entityClass);
                    break;
                }
                if (annotation instanceof CRUDSelectByPageDesc) {
                    correctSelectPageSQL(mappedStatementId,
                        sqlBuilder.buildSelectByPageDesc(entityClass));
                    correctResultType(mappedStatementId, entityClass);
                    break;
                }

                if (annotation instanceof CRUDSequence) {
                    correctSQL(mappedStatementId,
                        sqlBuilder.buildNextVal(((CRUDSequence) annotation).value()));
                    break;
                }

            }
        }

    }

    private boolean isCRUDDAO(Class<?> type) {
        Class<?>[] interfaces = type.getInterfaces();
        if (interfaces == null || interfaces.length <= 0) {
            return false;
        }
        for (Class<?> interfaze : interfaces) {
            if (interfaze == CRUDBaseDAO.class) {
                return true;
            }
            if (interfaze == CRUDEmptyDAO.class) {
                return true;
            }
        }
        return false;
    }

    private Class<?> getGenericType(Class<?> clazz) {

        Type[] genericInterfaces = clazz.getGenericInterfaces();
        for (Type genericInterface : genericInterfaces) {
            if (!(genericInterface instanceof ParameterizedType)) {
                continue;
            }
            ParameterizedType t = (ParameterizedType) genericInterface;
            if (!t.getRawType().equals(CRUDBaseDAO.class)) {
                continue;
            }
            Type[] actualTypes = t.getActualTypeArguments();
            if (actualTypes == null || actualTypes.length != 1) {
                continue;
            }
            return (Class<?>) actualTypes[0];
        }
        return null;
    }

    private void correctSelectPageSQL(String mappedStatementId, String sql) {

        MappedStatement mappedStatement = config.getMappedStatement(mappedStatementId);

        ArrayList<SqlNode> contents = new ArrayList<SqlNode>();
        contents.add(new TextSqlNode(sql));
        MixedSqlNode rootSqlNode = new MixedSqlNode(contents);
        SqlSource sqlSource = new SelectPageSqlSource(config, rootSqlNode);

        FieldUtil.setDeclaredFieldValue(MappedStatement.class, mappedStatement, "sqlSource",
            sqlSource);
    }

    private void correctSQL(String mappedStatementId, String sql) {

        MappedStatement mappedStatement = config.getMappedStatement(mappedStatementId);

        ArrayList<SqlNode> contents = new ArrayList<SqlNode>();
        contents.add(new TextSqlNode(sql));
        MixedSqlNode rootSqlNode = new MixedSqlNode(contents);
        SqlSource sqlSource = new DynamicSqlSource(config, rootSqlNode);

        FieldUtil.setDeclaredFieldValue(MappedStatement.class, mappedStatement, "sqlSource",
            sqlSource);
    }

    private void correctResultType(String mappedStatementId, Class<?> resultType) {

        MappedStatement mappedStatement = config.getMappedStatement(mappedStatementId);
        ResultMap resultMap = mappedStatement.getResultMaps().get(0);

        FieldUtil.setDeclaredFieldValue(ResultMap.class, resultMap, "type", resultType);
    }

}
