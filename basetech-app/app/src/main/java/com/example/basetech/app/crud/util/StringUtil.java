package com.example.basetech.app.crud.util;

public class StringUtil {

    /**
     * <p>Converts a String from camel case to underscore.</p>
     *
     * <p>A {@code null} input String returns {@code null}.</p>
     *
     * <pre>
     * StringUtils.camelCase2Underscore(null)  = null
     * StringUtils.camelCase2Underscore("")    = ""
     * StringUtils.camelCase2Underscore(" ")   = " "
     * StringUtils.camelCase2Underscore("aBc") = "a_bc"
     * </pre>
     * 
     * @param str
     * @return
     */
    public static String camelCase2Underscore(String str) {

        if (isBlank(str)) {
            return str;
        }

        return str.replaceAll("([A-Z])", "_$1").replaceFirst("^_", "").toLowerCase();
    }

    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

}