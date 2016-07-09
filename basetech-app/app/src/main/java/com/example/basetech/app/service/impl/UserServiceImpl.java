package com.example.basetech.app.service.impl;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.basetech.app.dal.UserDAO;
import com.example.basetech.app.model.User;
import com.example.basetech.app.service.UserService;

@Service("UserService")
public class UserServiceImpl implements UserService {

    private static final Log  log = LogFactory.getLog(UserServiceImpl.class);
    @Autowired
    private UserDAO           userDAO;

    @Override
    public User getById(long id) {
        // TODO Auto-generated method stub
        return userDAO.selectById(id);
    }

    @Override
    public User getByEmpId(String empId) {
        return userDAO.selectByEmpId(empId);
    }

    @Override
    public User addUser(User user) {
        userDAO.insert(user);
        return userDAO.selectByEmpId(user.getEmpId());
    }

    @Override
    public List<User> getAll() {
        return userDAO.selectAll();
    }
    

}
