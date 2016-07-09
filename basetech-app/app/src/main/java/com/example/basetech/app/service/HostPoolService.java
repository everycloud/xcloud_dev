package com.example.basetech.app.service;
import com.example.basetech.app.model.HostPool;
import com.example.basetech.app.model.Team;

import java.util.List;

/**
 * Created by xuanji on 16/6/25.
 */
public interface HostPoolService {
    public List<HostPool> getAll();

    public long insert(HostPool hostPool);

    public HostPool getById(long id);
    
    public void deleteById(long id);
}
