package com.example.basetech.framework.ssh.domain;

public class TaskResult {
    private String output;
    private String error;
    TaskStatus     status;

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

}
