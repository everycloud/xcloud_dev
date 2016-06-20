package com.example.basetech.app.crud.mybatis;
import java.lang.reflect.Field;

import org.apache.ibatis.session.Configuration;

public class HookedConfiguration extends Configuration {

    public HookedConfiguration(Configuration config) {
        try {
            fillFields(config);
            mapperRegistry = new CRUDMapperRegistry(this);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void fillFields(Configuration config) throws Exception {
        Field[] fields = Configuration.class.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            Field hookedField = HookedConfiguration.class.getSuperclass().getDeclaredField(
                field.getName());
            hookedField.setAccessible(true);
            hookedField.set(this, field.get(config));
        }
    }

}