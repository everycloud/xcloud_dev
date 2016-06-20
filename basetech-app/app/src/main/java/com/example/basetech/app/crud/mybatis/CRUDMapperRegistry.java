package com.example.basetech.app.crud.mybatis;

import org.apache.ibatis.binding.MapperRegistry;
import org.apache.ibatis.session.Configuration;

public class CRUDMapperRegistry extends MapperRegistry {

    private Configuration config;

    public CRUDMapperRegistry(Configuration config) {
        super(config);
        this.config = config;
    }

    public <T> void addMapper(Class<T> type) {

        super.addMapper(type);

        if (type.isInterface() && hasMapper(type)) {
            CRUDMapperAnnotationBuilder builder = new CRUDMapperAnnotationBuilder(config);
            builder.parse(type);
        }
    }
}
