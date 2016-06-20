package com.example.basetech.app.dal;

import org.apache.ibatis.annotations.Select;

import com.example.basetech.app.crud.CRUDBaseDAO;
import com.example.basetech.app.model.User;

public interface UserDAO extends CRUDBaseDAO<User>{
	
    @Select("")
    public User selectByEmpId(String emp_id);
	
}
