package com.example.basetech.app.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.example.basetech.app.model.User;

public interface UserService {

    public User getById(long id);

    public User getByEmpId(String empId);

    public User addUser(User user);

    public List<User> getAll();
}
