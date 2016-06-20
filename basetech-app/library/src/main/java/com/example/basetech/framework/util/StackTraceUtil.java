package com.example.basetech.framework.util;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;

public class StackTraceUtil {
	public static String getStackTrace(Throwable t) {
		Writer result = new StringWriter();
		PrintWriter printWriter = new PrintWriter(result);
		t.printStackTrace(printWriter);
		return result.toString();
	}
}
