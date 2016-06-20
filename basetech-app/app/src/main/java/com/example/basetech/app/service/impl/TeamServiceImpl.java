package com.example.basetech.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.basetech.app.dal.TeamDAO;
import com.example.basetech.app.model.Team;
import com.example.basetech.app.service.TeamService;

@Service("TeamService")
public class TeamServiceImpl implements TeamService {

	@Autowired
	private TeamDAO teamDAO;

	@Override
	public List<Team> getAll() {
		
		return teamDAO.selectAll();
	}
}
