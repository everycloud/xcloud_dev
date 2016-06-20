package com.example.basetech.app.dal;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.mapping.StatementType;

import com.example.basetech.app.model.Sample;

public interface SampleDAO{

    @Insert("INSERT INTO sample (name, memo) VALUES (${sample.name}, ${sample.memo})")
    @SelectKey(before = false, keyProperty = "sample.id", resultType = Long.class, statementType = StatementType.STATEMENT, statement = "SELECT LAST_INSERT_ID() AS id")
    public void insert(@Param("sample") Sample sample);

    @Delete("DELETE FROM sample WHERE id = ${id}")
    public Sample deleteById(@Param("id") long id);

    @Update("UPDATE sample SET name = ${sample.name}, memo = ${sample.memo} WHERE id = ${id}")
    public Sample updateById(@Param("sample") Sample sample);

    @Select("SELECT * FROM sample WHERE id = ${id}")
    public Sample selectById(@Param("id") long id);

}
