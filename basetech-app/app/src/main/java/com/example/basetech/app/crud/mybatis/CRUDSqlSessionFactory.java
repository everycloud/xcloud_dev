package com.example.basetech.app.crud.mybatis;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.defaults.DefaultSqlSessionFactory;

public class CRUDSqlSessionFactory extends DefaultSqlSessionFactory {

    public CRUDSqlSessionFactory(Configuration configuration) {
        super(configuration);
    }

}
