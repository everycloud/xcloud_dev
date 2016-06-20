package com.example.basetech.app.web.api;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.basetech.app.model.User;
import com.example.basetech.app.service.UserService;
import com.example.basetech.app.model.APIResult;

@RestController
public class UserAPI {
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/api/users", method = RequestMethod.GET)
    public APIResult<List<User>> getAll() {
        return new APIResult<List<User>>(userService.getAll());
    }

    @RequestMapping(value = "/api/user/{id}", method = RequestMethod.GET)
    public APIResult<User> getById(@PathVariable("id") long id) {
        return new APIResult<User>(userService.getById(id));
    }


    @RequestMapping(value = "/api/userview", method = RequestMethod.GET)
    public APIResult<String> userview(HttpServletRequest request) {
        request.getSession().setAttribute("userview", true);
        return new APIResult<String>("set");
    }

    @RequestMapping(value = "/api/noUserview", method = RequestMethod.GET)
    public APIResult<String> noUserview(HttpServletRequest request) {
        request.getSession().removeAttribute("userview");
        if (request.getSession().getAttribute("currentTeam") == null) {
            request.getSession().setAttribute("currentTeam", (long) 0);
        }
        if (request.getSession().getAttribute("currentProduct") == null) {
            request.getSession().setAttribute("currentProduct", (long) 0);
        }
        return new APIResult<String>("unset");
    }

}
