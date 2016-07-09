package com.example.basetech.app.web.api;

import com.example.basetech.app.model.APIResult;
import com.example.basetech.app.model.HostPool;
import com.example.basetech.app.model.User;
import com.example.basetech.app.service.HostPoolService;
import com.example.basetech.app.web.api.form.HostForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by xuanji on 16/6/25.
 */
@RestController
public class HostPoolAPI {
    @Autowired
    public HostPoolService hostPoolService;

    @RequestMapping(value = "/api/hosts", method = RequestMethod.GET)
    public APIResult<List<HostPool>> getAll() {
        return new APIResult<List<HostPool>>(hostPoolService.getAll());
    }

    @RequestMapping(value = "/api/host/new", method = RequestMethod.POST)
    public APIResult<HostPool> create(HttpServletRequest request, @RequestBody HostForm form) {
        long id = hostPoolService.insert(form.getHostPool());
        return new APIResult<HostPool>(hostPoolService.getById(id));
    }
    
    @RequestMapping(value = "/api/host/delete/{hostid}", method = RequestMethod.DELETE)
    public APIResult<String> delete(HttpServletRequest request, @PathVariable int hostid){
        System.out.print(hostid);
        hostPoolService.deleteById(hostid);
        return new APIResult<String>();
    }
    
}
