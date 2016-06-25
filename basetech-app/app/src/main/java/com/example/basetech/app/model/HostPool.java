package com.example.basetech.app.model;

/**
 * Created by xuanji on 16/6/25.
 */
@TableName("host_pool")
public class HostPool {
    private long id;
    private String name;
    private String os;
    private String ip;
    private String port;
    private String protocol;
    private String credent;
    private String username;
    private String password;
    private String key;
    private String allocated;
    private String alive;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getCredent() {
        return credent;
    }

    public void setCredent(String credent) {
        this.credent = credent;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getAllocated() {
        return allocated;
    }

    public void setAllocated(String allocated) {
        this.allocated = allocated;
    }

    public String getAlive() {
        return alive;
    }

    public void setAlive(String alive) {
        this.alive = alive;
    }
}
