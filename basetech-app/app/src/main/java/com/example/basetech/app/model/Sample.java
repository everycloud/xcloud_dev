package com.example.basetech.app.model;

public class Sample {

    private long   id;
    private String name;
    private String memo;

    public Sample() {
        super();
    }

    public Sample(long id, String name, String memo) {
        super();
        this.id = id;
        this.name = name;
        this.memo = memo;
    }

    public Sample(String name, String memo) {
        super();
        this.name = name;
        this.memo = memo;
    }

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

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (int) (id ^ (id >>> 32));
        result = prime * result + ((memo == null) ? 0 : memo.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Sample other = (Sample) obj;
        if (id != other.id)
            return false;
        if (memo == null) {
            if (other.memo != null)
                return false;
        } else if (!memo.equals(other.memo))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        return true;
    }

}
