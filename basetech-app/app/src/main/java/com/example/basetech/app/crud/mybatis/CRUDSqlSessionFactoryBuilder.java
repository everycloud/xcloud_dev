package com.example.basetech.app.crud.mybatis;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.session.defaults.DefaultSqlSessionFactory;

public class CRUDSqlSessionFactoryBuilder extends SqlSessionFactoryBuilder {
    public CRUDSqlSessionFactoryBuilder() {
    }

    public SqlSessionFactory build(Configuration config) {
        return new DefaultSqlSessionFactory(new HookedConfiguration(config));
    }
}
