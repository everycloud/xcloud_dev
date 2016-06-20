package com.example.basetech.app.web.api;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.example.basetech.app.model.APIResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.basetech.app.model.Team;
import com.example.basetech.app.service.TeamService;

@RestController
public class TeamAPI {

    @Autowired
    private TeamService teamService;

    @RequestMapping(value = "/api/teams", method = RequestMethod.GET)
    public APIResult<List<Team>> getAll() {
        return new APIResult<List<Team>>(teamService.getAll());
    }

    @RequestMapping(value = "/api/currentTeam/{id}", method = RequestMethod.GET)
    public APIResult<Long> currentTeam(HttpServletRequest request, @PathVariable("id") long id) {
        request.getSession().setAttribute("currentTeam", id);
        request.getSession().setAttribute("currentProduct", (long) 0);
        request.getSession().removeAttribute("userview");
        return new APIResult<Long>(id);
    }
}
