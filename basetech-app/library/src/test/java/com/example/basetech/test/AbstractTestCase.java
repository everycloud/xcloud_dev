package com.example.basetech.test;

import java.lang.reflect.Field;

import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public abstract class AbstractTestCase extends Assert {

    protected final Logger       logger = LoggerFactory.getLogger(getClass());

    protected ApplicationContext context;

    public AbstractTestCase() {
        System.setProperty("spring.profiles.active", "dev");
        initContext();
        injectDependencies();
    }

    /**
     * 
     * @return
     */
    protected abstract String[] getClassPathXmlLocations();

    protected void injectDependencies() {
        Field[] fields = getClass().getDeclaredFields();
        for (Field field : fields) {
            Autowired autowired = field.getAnnotation(Autowired.class);
            if (autowired != null) {
                Object bean = context.getBean(field.getType());
                field.setAccessible(true);
                try {
                    field.set(this, bean);
                } catch (IllegalArgumentException e) {
                    logger.error("", e);
                } catch (IllegalAccessException e) {
                    logger.error("", e);
                }
            }
        }
    }

    protected void initContext() {
        context = new ClassPathXmlApplicationContext(getClassPathXmlLocations());
    }

}
