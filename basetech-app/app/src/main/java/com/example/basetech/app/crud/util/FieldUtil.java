package com.example.basetech.app.crud.util;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

import com.example.basetech.app.crud.annotation.Exclude;

public class FieldUtil {

    /**
     * Set declared field value of specific object
     * 
     * @param clazz
     * @param obj
     * @param fieldName
     * @param fieldValue
     */
    public static void setDeclaredFieldValue(Class<?> clazz, Object obj, String fieldName,
                                             Object fieldValue) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            boolean access = field.isAccessible();
            if (!access) {
                field.setAccessible(true);
                field.set(obj, fieldValue);
                field.setAccessible(access);
            } else {
                field.set(obj, fieldValue);
            }
        } catch (Exception e) {
            throw new RuntimeException("Set field '" + fieldName + "' of class '" + clazz.getName()
                                       + "', object '" + obj + "' error", e);
        }
    }

    /**
     * Gets fields which are not <tt>final</tt>, <tt>static</tt>, <tt>transient</tt> 
     * or <tt>synthetic</tt> ones, and aren't instances of <tt>anonymous</tt> or <tt>local</tt> class.
     * 
     * @param clazz
     * @return
     */
    public static Field[] getValidFields(Class<?> clazz) {

        List<Field> foundFields = getAllFields(clazz);
        List<Field> instanceFields = new ArrayList<Field>();
        for (Field f : foundFields) {
            if (!isInstanceField(f) || isExcludeField(f)) {
                continue;
            }
            instanceFields.add(f);
        }

        return instanceFields.toArray(new Field[instanceFields.size()]);
    }

    private static boolean isExcludeField(Field field) {
        return field.getAnnotation(Exclude.class) != null;
    }

    private static boolean isInstanceField(Field field) {

        if (hasModifier(field, Modifier.FINAL) || hasModifier(field, Modifier.STATIC)
            || hasModifier(field, Modifier.TRANSIENT)) {
            return false;
        }
        if (field.isSynthetic()) {
            return false;
        }
        if (isAnonymousOrLocal(field)) {
            return false;
        }
        return true;
    }

    private static boolean hasModifier(Field field, int modifier) {
        return (field.getModifiers() & modifier) != 0;
    }

    private static boolean isAnonymousOrLocal(Field field) {
        Class<?> clazz = field.getType();
        return !Enum.class.isAssignableFrom(clazz)
               && (clazz.isAnonymousClass() || clazz.isLocalClass());
    }

    private static List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<Field>();
        for (Class<?> curr : getInheritanceHierarchy(clazz)) {
            Field[] currentClazzFields = curr.getDeclaredFields();
            for (Field f : currentClazzFields) {
                fields.add(f);
            }
        }
        return fields;
    }

    private static List<Class<?>> getInheritanceHierarchy(Class<?> clazz) {
        List<Class<?>> classes = new ArrayList<Class<?>>();
        for (Class<?> curr = clazz; curr != null && !curr.equals(Object.class); curr = curr
            .getSuperclass()) {
            if (!curr.isSynthetic()) {
                classes.add(curr);
            }
        }
        return classes;
    }
}
