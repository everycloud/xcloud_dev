package com.example.basetech.app.crud;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.mapping.StatementType;

import com.example.basetech.app.crud.annotation.CRUDDeleteAll;
import com.example.basetech.app.crud.annotation.CRUDDeleteById;
import com.example.basetech.app.crud.annotation.CRUDInsert;
import com.example.basetech.app.crud.annotation.CRUDInsertList;
import com.example.basetech.app.crud.annotation.CRUDSelectAll;
import com.example.basetech.app.crud.annotation.CRUDSelectById;
import com.example.basetech.app.crud.annotation.CRUDSelectByPage;
import com.example.basetech.app.crud.annotation.CRUDSelectByPageDesc;
import com.example.basetech.app.crud.annotation.CRUDUpdateById;
import com.example.basetech.app.crud.annotation.CRUDUpdateList;
import com.example.basetech.app.crud.sql.SQLProvider;

public interface CRUDBaseDAO<T> {

    @CRUDInsert
    @Insert("")
    @SelectKey(before = false, keyProperty = "id", resultType = Long.class, statementType = StatementType.STATEMENT, statement = "SELECT LAST_INSERT_ID() AS id")
    public long insert(T entity);

    @CRUDInsertList
    @InsertProvider(type = SQLProvider.class, method = "insertList")
    public long insertList(List<T> entities);

    @CRUDDeleteById
    @Delete("")
    public long deleteById(long id);

    @CRUDDeleteAll
    @Delete("")
    public long deleteAll();

    @CRUDUpdateById
    @Update("")
    public long updateById(T entity);

    /**
     * 通过提交多句update实现，所以需要在mysql链接中添加allowMultiQueries=true
     * @param entities
     * @return
     */
    @CRUDUpdateList
    @UpdateProvider(type = SQLProvider.class, method = "updateList")
    public long updateList(List<T> entities);

    @CRUDSelectById
    @Select("")
    public T selectById(long id);

    @CRUDSelectAll
    @Select("")
    public List<T> selectAll();

    @CRUDSelectByPage
    @Select("")
    public List<T> selectByPage(@Param("pageNumber") int pageNumber, @Param("pageSize") int pageSize);

    @CRUDSelectByPageDesc
    @Select("")
    public List<T> selectByPageDesc(@Param("pageNumber") int pageNumber,
                                    @Param("pageSize") int pageSize);

}