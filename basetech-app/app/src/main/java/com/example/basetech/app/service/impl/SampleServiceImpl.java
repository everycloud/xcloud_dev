package com.example.basetech.app.service.impl;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.basetech.app.dal.SampleDAO;
import com.example.basetech.app.model.Sample;
import com.example.basetech.app.service.SampleService;

@Service("SampleService")
public class SampleServiceImpl implements SampleService {

    @Autowired
    private SampleDAO     sampleDAO;

    @Override
    public Sample getById(long id) {
        return sampleDAO.selectById(id);
    }
    
    @PostConstruct
    public void init(){
    	System.out.println("aa");
    }

}
