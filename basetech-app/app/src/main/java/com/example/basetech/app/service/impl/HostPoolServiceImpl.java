package com.example.basetech.app.service.impl;

import com.example.basetech.app.dal.HostPoolDAO;
import com.example.basetech.app.dal.TeamDAO;
import com.example.basetech.app.model.HostPool;
import com.example.basetech.app.model.Sample;
import com.example.basetech.app.service.HostPoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * Created by xuanji on 16/6/25.
 */
@Service("HostPoolService")
public class HostPoolServiceImpl implements HostPoolService {
    @Autowired
    private HostPoolDAO hostPoolDAO;


    @PostConstruct
    public void init(){
        System.out.println("aa");
        List<HostPool> poolList = hostPoolDAO.selectAll();
        System.out.print("bb");
    }

    @Override
    public List<HostPool> getAll() {
        return hostPoolDAO.selectAll();
    }

    @Override
    public long insert(HostPool hostPool) {
        return hostPoolDAO.insert(hostPool);
    }

    @Override
    public HostPool getById(long id) {
        return hostPoolDAO.selectById(id);
    }
}
