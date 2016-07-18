(function () {
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            var str = this;
            return str.replace(/^\s+|\s+$/g, '');
        };
    }

    Constant = {
        /**
         * 网卡表格选中的行
         */
        VM_NICSELECTNUM: "nicsSelectRowNum",
        /**
         * 系统自带的网卡名称
         */
        VM_SYSTEMNICNAME: "DefaultNic",
        /**
         * 公共参数表格选中的行
         */
        PARAMETER_SELECTROWNUM: "parameterRowNum",
        /**
         * 公共参数表格ID
         */
        PARAMETER_TABLE: "parameter",
        /**
         * 输出参数表格选中的行
         */
        OUTPUT_SELECTROWNUM: "outputRowNum",
        /**
         * 输出参数表格
         */
        OUTPUT_TABLE: "output",
        /**
         * 软件安装命令参数表格选中的行
         */
        SOFTWARE_INSTALLSELECTROW: "installSelectRowNum",
        /**
         * 软件安装命令参数表格ID
         */
        SOFTWARE_INSTALLTABLE: "software_InstallParams_value",
        /**
         * 软件卸载命令参数表格选中的行
         */
        SOFTWARE_UNINSTALLSELECTROW: "uninstallSelectRowNum",
        /**
         * 软件卸载命令参数表格ID
         */
        SOFTWARE_UNINSTALLTABLE: "software_UninstallParams_value",
        /**
         * 软件卸载命令参数表格选中的行
         */
        SOFTWARE_STARTSELECTROW: "startSelectRowNum",
        /**
         * 软件卸载命令参数表格ID
         */
        SOFTWARE_STARTTABLE: "software_StartParams_value",
        /**
         * 软件卸载命令参数表格选中的行
         */
        SOFTWARE_STOPSELECTROW: "stopSelectRowNum",
        /**
         * 软件卸载命令参数表格ID
         */
        SOFTWARE_STOPTABLE: "software_StopParams_value",

        /**
         * 网卡表格ID
         */
        VM_NICID: "vm_Nics",
        /**
         * 磁盘表格选中的行
         */
        VM_VOLUMESELECTNUM: "volumeSelectRowNum",
        /**
         * 磁盘表格ID
         */
        VM_VOLUMEID: "vm_Volumes",
        /**
         * VMTOVM关联关系表格ID
         */
        VMTOVMID: "ame_vmtovm",
        /**
         * VMTOVM关联关系表格选中的行
         */
        VMTOVMSELECTROWNUM: "vmtovmSelectRowNum",
        /**
         * VMTOportgoup关联关系表格ID
         */
        VMTOPORTGOUPID: "ame_vmToportgroup",
        /**
         * VMTOportgoup关联关系表格选中的行
         */
        VMTOPORTGOUPROWNUM: "vmtoportgoupRowNum",
        /**
         * ReferenceAttr类型
         */
        REFERENCEATTRTYPE: "ReferenceAttr",
        /**
         * Nic类型
         */
        NICTYPE: "Nic",
        /**
         * Nic类型
         */
        VOLUMETYPE: "Volume",
        /**
         * SoftwareDefine类型
         */
        SOFTWAREDEFINETYPE: "Software",

        SCRIPTDEFINETYPE: "Script",

        /**
         * ScalingGroupDefine 类型
         */
        SCALINGGROUPDEFINETYPE: "ScalingGroup",

        /**
         * ParameterDefine类型
         */
        PARAMETERDEFINETYPE: "ParameterDefine",
        /**
         * OutputDefine类型
         */
        OUTPUTDEFINETYPE: "OutputDefine",
        /**
         * ConnectionDefine类型
         */
        CONNECTIONDEFINETYPE: "ConnectionDefine",
        /**
         *  虚拟机初始化表格ID
         */
        VM_POSTCOMMANDS_ID: "vm_PostCommands",
        /**
         * 虚拟机初始化表格选 中的行
         */
        VM_POSTCOMMANDS_NUM: "vm_PostCommands_num",
        /**
         *  虚拟机释放命令表格ID
         */
        VM_RELEASECOMMANDS_ID: "vm_ReleaseCommands",
        /**
         * 虚拟机释放命令表格选 中的行
         */
        VM_RELEASECOMMANDS_NUM: "vm_ReleaseCommands_num",
        /**
         *  虚拟机启动命令表格ID
         */
        VM_STARTCOMMANDS_ID: "vm_StartCommands",
        /**
         * 虚拟机启动命令表格选 中的行
         */
        VM_STARTCOMMANDS_NUM: "vm_StartCommands_num",
        /**
         *  虚拟机停止命令表格ID
         */
        VM_STOPCOMMANDS_ID: "vm_StopCommands",
        /**
         * 虚拟机停止命令表格选 中的行
         */
        VM_STOPCOMMANDS_NUM: "vm_StopCommands_num",
        /**
         * ScalingPolicy类型
         */
        SCALINGPOLICYTYPE: "ScalingPolicy"

    };

    ArrayList = function () {
        this.properties = {};
    };
    /**
     *ArrayList增加
     * @param key
     * @param value
     * @return
     */
    ArrayList.prototype.add = function (key, value) {
        if (key) {
            this.properties[key] = value;
            return true;
        } else {
            return false;
        }
    };

    /**
     * ArrayList更新
     * @param key
     * @param value
     * @return
     */
    ArrayList.prototype.update = function (key, value) {
        if (key) {
            this.properties[key] = value;
            return true;
        } else {
            return false;
        }
    };

    /**
     * ArrayList删除
     * @param key
     * @return
     */
    ArrayList.prototype.del = function (key) {
        if (key && this.properties[key]) {
            this.properties[key] = null;
            delete this.properties[key];
            return true;
        }
        return false;
    };

    /**
     * ArrayList中根据key获得values
     * @param key
     * @return
     */
    ArrayList.prototype.get = function (key) {
        if (key && key in this.properties) {
            return this.properties[key];
        } else {
            return null;
        }
    };

    ArrayList.prototype.length = function () {
        var length = 0;
        for (var key in this.properties) {
            length++;
        }
        return length;
    };

    ArrayList.prototype.getArray = function () {
        var result = [];
        for (var key in this.properties) {
            result.push(this.get(key));
        }
        return result;
    };

    AmeUtil = function () {};

    AmeUtil.SUBREGEX = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;

    AmeUtil.UNDEFINED = "undefined";

    AmeUtil.isUndefined = function (o) {
        return typeof o === AmeUtil.UNDEFINED;
    };

    /**
     * Restful接口参数解析，
     * 如/app/kkk/{id}
     * ameUtils.sub("/app/kkk/{id}", {id: 124})
     */
    AmeUtil.prototype.sub = function (s, o) {
        return ((s.replace) ? s.replace(AmeUtil.SUBREGEX, function (match, key) {
            return (!AmeUtil.isUndefined(o[key])) ? o[key] : match;
        }) : s);
    };

    /**
     * 判断是否为大于等于0的整数
     */
    AmeUtil.prototype.isNumber = function (str) {
        if (!str) {
            return false;
        }
        return /^\d+(\.\d+)?$/.test(str);
    };

    /**
     * 转换单位返回数字
     * @param value 要转换的值
     * @return  转换后的数字
     */
    AmeUtil.prototype.convertUnitToNum = function (value) {
        var num = 0;
        if (!value) {
            return num;
        }
        if (!isNaN(value)) {
            return value;
        }
        if (typeof value !== "string") {
            return num;
        }
        //判断是否为数字
        if (!isNaN(value)) {
            num = parseInt(value);
        } else {
            num = 0;
        }

        return num;
    };

    /**
     * 将第一个字符大写
     * @param key 字符串
     * @return  第一个字符大写后的字符串
     */
    AmeUtil.prototype.firstUpper = function (key) {
        if (!key) {
            return "";
        }
        return key.replace(/^\w/, key.charAt(0).toUpperCase());
    };
    /**
     * 将第一个字符小写
     * @param key 字符串
     * @return  第一个字符小写后的字符串
     */
    AmeUtil.prototype.firstLower = function (key) {
        if (!key) {
            return "";
        }
        return key.replace(/^\w/, key.charAt(0).toLowerCase());
    };
    /**
     * 如果json字符中末尾有逗号，则将逗号删除掉
     * @param json json 字符串
     * @return  去掉末尾的逗号"," 后的字符串
     */
    AmeUtil.prototype.trimComma = function (json) {
        if (!json) {
            return "";
        }
        var json = $.trim(json); // 去掉多余的空格
        if (json.charAt(json.length - 1) == ",") {
            json = json.substring(0, json.length - 1);
        }
        return json;
    };
    AmeUtil.prototype.fullString = function (value) {
        return value != null ? "\"" + this.convertCharToJsonFormat(value) + "\"" : "\"\"";
    };
    /**
     * 转换字符为Json认识的格式
     * @param value 欲转换的字符
     * @return 转换后的字符串
     */
    AmeUtil.prototype.convertCharToJsonFormat = function (value) {
        var json = "";
        //如果为空，则返回
        if (!value && value !== 0) {
            return "";
        }
        //如果为数字，则转换成字符串
        if (!isNaN(value)) {
            value = value + "";
        }

        //对每一个字符进行判断
        for (var i = 0; i < value.length; i++) {
            //如果为空格或者为HTML只认识的空格，将空格变成正常的空格
            if (value.charCodeAt(i) == 32 || value.charCodeAt(i) == 160) {
                json += " ";
                continue;
            }

            switch (value.charAt(i)) {
            case "\\":
                {
                    json += "\\\\";
                    break;
                }
            case "\"":
                {
                    json += "\\\"";
                    break;
                }
            case "\/":
                {
                    json += "\\\/";
                    break;
                }
            case "\t":
                {
                    json += "\\t";
                    break;
                }
            case "\f":
                {
                    json += "\\f";
                    break;
                }
            case "\b":
                {
                    json += "\\b";
                    break;
                }
            case "\r":
                {
                    json += "\\r";
                    break;
                }
            case "\n":
                {
                    json += "\\n";
                    break;
                }
            default:
                {
                    json += value.charAt(i);
                    break;
                }
            }
        }
        return json;
    };

    /**
     * 生成随机数号
     */
    AmeUtil.prototype.createId = function () {
        var count = 0;
        return function () {
            var date = new Date();
            return "AME_id_" + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getSeconds() + count++;
        };
    }();

    AmeUtil.prototype.getBrowser = function () {
        var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
        var isFF = navigator.userAgent.indexOf('Mozilla/') >= 0 && navigator.userAgent.indexOf("Firefox") >= 0 && navigator.userAgent.indexOf('MSIE') < 0;
        var isChrome = navigator.userAgent.indexOf('Chrome/') >= 0;
        if (isIE) {
            return "ie";
        }
        if (isFF) {
            return "firefox";
        }
        if (isChrome) {
            return "chrome";
        }
        return "other";
    };

    /**
     * ResourceDefine 基类，构造函数，其它资源对象都继承于该类
     * @param id  资源id，资源唯一号
     * @param name 资源名称
     * @param type 资源类型
     */
    ResourceDefine = function (id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    };
    ResourceDefine.prototype = new AmeUtil();
    ResourceDefine.prototype.constructor = ResourceDefine;
    //资源对应的绘图对象
    ResourceDefine.prototype.graph = null;
    //资源属性列表
    ResourceDefine.prototype.properties = null;
    /**
     * 判断资源对应的绘图对象是否存在
     * @return 如果存在则返回true
     */
    ResourceDefine.prototype.hasGraph = function () {
        if (this.graph && this.graph.id) { //如果id无效，则判断无图 
            return true;
        } else {
            this.graph = null;
            return false;
        }
    };

    /**
     * 根据resource属性，返回cell的属性<BR>
     * 这个是基类，因此返回null即可。子类可以选择重写该方法
     *
     * @return
     */
    ResourceDefine.prototype.genCellAttr = function () {
        return null;
    };

    /**
     * 为资源生成唯一号
     */
    ResourceDefine.prototype.defualtId = function () {
        var date = new Date();
        this.id = this.id == null || $.trim(this.id).length <= 0 ? "ID_" + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getSeconds() + this.name : this.id;
        return this.id;
    };
    /**
     * 资源的name ,type, graph 共有属性生成的json 片段
     * @return
     */
    ResourceDefine.prototype.toCommonJson = function () {
        var json = "";
        var type = this.type;
        if (type == "PortGroup") {
            type = "Network";
        }
        json += this.fullString("Type") + ":\"" + (type && type != null ? "GM::" + this.convertCharToJsonFormat(type) : this.convertCharToJsonFormat(type)) + "\",";
        var graph = this.graph;
        json += this.fullString("Graph") + ":" + (graph == null ? "{}" : graph.toJson());
        return json;
    };

    /**
     * 静态方法
     * @param typeName 根据不同的类型返回不同的创建方法
     * @return 创建resource的方法
     */
    ResourceDefine.getCreateResourceMethod = function (typeName) {

        if (!typeName || typeName == "") {
            return null;
        }
        //根据类型的不同返回不同的resource创建方法
        if (typeName == "VmTemplate") {
            return VmTemplateDefine.createResource;
        } else if (typeName == "Network") {
            return PortGroupDefine.createResource;
        } else if (typeName == "ScalingGroup") {
            return ScalingGroupDefine.createResource;
        } else if (typeName == "Software" || typeName == "Script") {
            return SoftwareDefine.createResource;
        } else {
            return null;
        }
    };

    /**
     * 绘图信息
     * @param id
     */
    GraphDefine = function (id) {
        this.id = id;
    };
    GraphDefine.prototype = new AmeUtil();
    GraphDefine.prototype.constructor = GraphDefine;
    GraphDefine.prototype.parentID = null;
    GraphDefine.prototype.position = null;
    GraphDefine.prototype.size = null;
    GraphDefine.prototype.toJson = function () {
        var json = "{";
        json += this.fullString("ParentID") + ":" + this.fullString(this.parentID) + ",";

        json += this.fullString("Position") + ":" + "{";
        var position = this.position;
        json += this.fullString("X") + ":" + (position != null ? "\"" + position.x + "\"" : "\"\"") + ",";
        json += this.fullString("Y") + ":" + (position != null ? "\"" + position.y + "\"" : "\"\"");
        json += "}";
        json += ",";

        json += this.fullString("Size") + ":" + "{";
        var size = this.size;
        json += this.fullString("W") + ":" + (size != null ? "\"" + size.w + "\"" : "\"\"") + ",";
        json += this.fullString("H") + ":" + (size != null ? "\"" + size.h + "\"" : "\"\"");
        json += "}";

        json += "}";
        return json;
    };
    //位置
    PositionDefine = function (x, y) {
        this.x = x;
        this.y = y;
    };
    //大小
    SizeDefine = function (w, h) {
        this.w = w;
        this.h = h;
    };

    /**
     * ReferenceAttr 类
     */
    ReferenceAttr = function (options) {
        options = options ? options : {};
        options["refId"] = options["refId"] ? options["refId"] : null;
        options["attrKey"] = options["attrKey"] ? options["attrKey"] : null;
        options["attrName"] = options["attrName"] ? options["attrName"] : null;
        this.type = "ReferenceAttr";
        this.refId = options["refId"];
        this.attrKey = options["attrKey"];
        this.attrName = options["attrName"];
    };
    ReferenceAttr.prototype = new AmeUtil();
    ReferenceAttr.prototype.constructor = ReferenceAttr;
    ReferenceAttr.prototype.toJson = function () {
        if (!this.refId || this.refId == null) {
            return "\"\"";
        }
        var json = "{" + this.fullString("Ref") + ":" + "[";
        json += this.fullString(this.refId);
        json += ",";
        json += this.fullString(this.attrKey);
        json += "]" + "}";
        return json;
    };

    /**
     * PortGroup 类，构造函数，继承于Resource
     * @param id   资源唯一号
     * @param name  资源名称
     * @param type  资源类型
     * @param templateDefine 模板实例
     */
    PortGroupDefine = function (id, name, type, templateDefine) {
        ResourceDefine.call(this, id, name, type);
        this.templateDefine = templateDefine;
        this.properties = {
            "name": name,
            "description": null,
            "networkID": "" //RC 版本中将portGroupId修改为networkId
        };
    };
    PortGroupDefine.prototype = new ResourceDefine();
    PortGroupDefine.prototype.constructor = PortGroupDefine;

    /**
     * 根据resource属性，生成cell的属性
     */
    PortGroupDefine.prototype.genCellAttr = function () {
        var attrList = [];
        attrList.push({
            "name": "NetworkID",
            "type": "String",
            "value": this.properties["networkID"]
        });
        attrList.push({
            "name": "Description",
            "type": "String",
            "value": this.properties["description"]
        });
        return attrList;
    };

    PortGroupDefine.prototype.getName = function () {
        if (this.isReferOfName()) {
            return this.properties["name"].attrKey;
        } else {
            return this.properties["name"];
        }
    };
    /**
     * 设置PortGroupDefine的名称
     * @param {Object} name 当name为字符串时，表示没有引用公共参数，当为ReferenceAttr时表示引用了公共参数
     */
    PortGroupDefine.prototype.setName = function (name, isRefer) {
        this.properties["name"] = (isRefer ? new ReferenceAttr({
            "refId": "Parameters",
            "attrKey": name
        }) : name);
        this.name = this.getName();
        //修改公共参数引用个数,请调用相应的		
    };

    /**
     * 获取描述
     * @return description
     */
    PortGroupDefine.prototype.getDescription = function () {
        return this.properties["description"];
    };
    /**
     * 设置描述
     */
    PortGroupDefine.prototype.setDescription = function (description) {
        this.properties["description"] = description;
    };

    PortGroupDefine.prototype.isReferOfName = function () {
        if (this.properties["name"] && this.properties["name"].type == Constant.REFERENCEATTRTYPE) {
            return true;
        }
        return false;
    };

    /**
     * 资源对象生成Json字符串
     * @return Json字符串
     */
    PortGroupDefine.prototype.toJson = function () {
        var id = this.defualtId();
        var json = this.fullString(id) + ":" + "{";
        json += this.toCommonJson();
        json += ",";

        var properties = this.properties;
        json += this.fullString("Properties") + ":" + "{";

        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                json += this.fullString(this.firstUpper(key)) + ":";
                if (properties[key] && properties[key].type == Constant.REFERENCEATTRTYPE) {
                    json += properties[key].toJson();
                } else {
                    json += this.fullString(properties[key]);
                }
                json += ",";
            }
        }
        json = this.trimComma(json);
        json += "}";

        json += "}";
        return json;
    };

    /**
     * 创建端口组资源实例
     * @static
     * @public
     * @param attributes   资源属性列表
     * @param typeName     资源类型名称
     * @param resourceName 资源名称
     * @param resourceId   资源ID  全局唯一
     * @return 端口组资源实例
     */
    PortGroupDefine.createResource = function (templateDefine, attributes, typeName, resourceName, resourceId) {
        var resource = new PortGroupDefine();
        resource.templateDefine = templateDefine;
        //添加ID、资源类型名称及名称
        resource.id = resourceId;
        resource.type = typeName;
        resource.name = resourceName;
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            // 把首字母转成小写 
            attr.name = attr.name.charAt(0).toLowerCase().concat(attr.name.substr(1));
            if (attr.name in resource.properties) {
                resource.properties[attr.name] = attr.value;
            }
        }
        resource.properties.name = resourceName;
        return resource;
    };

    /**
     *  Instance 类，构造函数，继承于ResourceDefine
     * @param id 资源唯一号
     * @param name  资源名称
     * @param type  资源类型
     */
    InstanceDefine = function (id, name, type) {
        ResourceDefine.call(this, id, name, type);
        this.properties = {
            "name": name,
            "vmTemplate": new ReferenceAttr(),
            "description": null
        };
    };
    InstanceDefine.prototype = new ResourceDefine();
    InstanceDefine.prototype.constructor = InstanceDefine;

    InstanceDefine.prototype.getVmTemplate = function () {
        var vmtemplate = this.properties["vmTemplate"];
        return temp.getResourceById(vmtemplate["refId"]);
    };
    /**
     * Instance资源对象生成Json字符串
     * @return Json字符串
     */
    InstanceDefine.prototype.toJson = function () {
        var id = this.defualtId();
        var json = this.fullString(id) + ":" + "{";
        json += this.toCommonJson();
        json += ",";

        var properties = this.properties;
        json += this.fullString("Properties") + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "vmTemplate") {
                    json += this.fullString("VmTemplateID") + ":" + properties[key].toJson();
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";

        json += "}";
        return json;
    };

    /**
     * VmTemplate 类，构造函数，继承于ResourceDefine
     * @param id 资源唯一号
     * @param name  资源名称
     * @param type  资源类型
     * @param templateDefine 模板定义
     */
    VmTemplateDefine = function (id, name, type, templateDefine) {
        ResourceDefine.call(this, id, name, type);
        this.templateDefine = templateDefine;
        // 初始化时候的CPU的个数，-1表示还没有初始化
        this.oldCpu = -1;
        // 初始化时候的内存的值，-1表示还没有初始化
        this.oldMemory = -1;
        this.properties = {
            "vmTemplateID": null,
            "vmTempateName": null, // 虚拟机模板的对应名称
            "name": name, // 本资源模板的名称
            "description": null,
            "computerName": "", //计算机名称
            "cPU": null,
            "memory": null,
            "oSType": null,
            "oSVersion": null,
            "updateMode": "auto",
            "blockHeatTranfer": "unSupport",
            "nics": new ArrayList(),
            "volumes": new ArrayList(),
            "softwares": new ArrayList(), //存放的是软件对象
            "postCommands": new ArrayList(),
            "releaseCommands": new ArrayList(),
            "startCommands": new ArrayList(),
            "stopCommands": new ArrayList()
        };
    };
    VmTemplateDefine.prototype = new ResourceDefine();
    VmTemplateDefine.prototype.constructor = VmTemplateDefine;

    /**
     * 根据resource属性，生成cell的属性
     */
    VmTemplateDefine.prototype.genCellAttr = function () {
        var attrList = [];
        attrList.push({
            "name": "cPU",
            "type": "Integer",
            "value": this.properties["cPU"]
        });
        attrList.push({
            "name": "memory",
            "type": "Integer",
            "value": this.properties["memory"]
        });
        attrList.push({
            "name": "description",
            "type": "String",
            "value": this.properties["description"]
        });
        attrList.push({
            "name": "vmTemplateID",
            "type": "String",
            "value": this.properties["vmTemplateID"]
        });
        attrList.push({
            "name": "oSType",
            "type": "String",
            "value": this.properties["oSType"]
        });
        attrList.push({
            "name": "oSVersion",
            "type": "String",
            "value": this.properties["oSVersion"]
        });
        attrList.push({
            "name": "vmTempateName",
            "type": "String",
            "value": this.properties["vmTempateName"]
        });
        attrList.push({
            "name": "computerName",
            "type": "String",
            "value": this.properties["computerName"]
        });
        attrList.push({
            "name": "updateMode",
            "type": "String",
            "value": this.properties["updateMode"]
        });
        attrList.push({
            "name": "blockHeatTranfer",
            "type": "String",
            "value": this.properties["blockHeatTranfer"]
        });
        var obj = this.properties["nics"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": "Nics",
                    "type": "VmTemplate.Nics",
                    "value": obj[key].name
                });
            }
        }

        obj = this.properties["volumes"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": obj[key].name,
                    "type": "VmTemplate.Volumes",
                    "value": obj[key].size
                });
            }
        }

        obj = this.properties["stopCommands"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": "StopCommands",
                    "type": "String",
                    "value": obj[key]
                });
            }
        }

        obj = this.properties["releaseCommands"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": "ReleaseCommands",
                    "type": "String",
                    "value": obj[key]
                });
            }
        }

        obj = this.properties["startCommands"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": "StartCommands",
                    "type": "String",
                    "value": obj[key]
                });
            }
        }

        obj = this.properties["postCommands"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": "PostCommands",
                    "type": "String",
                    "value": obj[key]
                });
            }
        }

        return attrList;
    };

    VmTemplateDefine.prototype.getName = function () {
        if (this.isReferOfName()) {
            return "$Parameters." + this.properties["name"].attrKey;
        } else {
            return this.properties["name"];
        }
    };

    /**
     * 设置VmTemplateDefine的名称
     * @param {Object} name 当name为字符串时，表示没有引用公共参数，当为ReferenceAttr时表示引用了公共参数
     */
    VmTemplateDefine.prototype.setName = function (name, isRefer) {
        this.properties["name"] = isRefer ? new ReferenceAttr({
            "refId": "Parameters",
            "attrKey": name
        }) : name;
        this.name = this.getName();
    };

    /**
     * 获取描述
     * @return description
     */
    VmTemplateDefine.prototype.getDescription = function () {
        return this.properties["description"];
    };
    /**
     * 设置描述
     */
    VmTemplateDefine.prototype.setDescription = function (description) {
        this.properties["description"] = description;
    };

    VmTemplateDefine.prototype.getID = function () {
        return this.properties["vmTemplateID"];
    };

    /**
     * 设置虚拟机模板中对应的虚拟机的计算机名称
     */
    VmTemplateDefine.prototype.setComputerName = function (computerName, isRefer) {
        this.properties["computerName"] = isRefer ? new ReferenceAttr({
            "refId": "Parameters",
            "attrKey": computerName
        }) : computerName;
        this.computerName = this.getComputerName();
    };

    /**
     * 设置虚拟机模板中对应的虚拟机的计算机名称
     */
    VmTemplateDefine.prototype.getComputerName = function () {
        if (this.isReferOfComputerName()) {
            return this.properties["computerName"].attrKey;
        } else {
            return this.properties["computerName"];
        }
    };
    VmTemplateDefine.prototype.setUpdateMode = function (updateMode) {
        this.properties["updateMode"] = updateMode;
    };
    VmTemplateDefine.prototype.getUpdateMode = function () {
        return this.properties["updateMode"];
    };
    VmTemplateDefine.prototype.setBlockHeatTranfer = function (blockHeatTranfer) {
        this.properties["blockHeatTranfer"] = blockHeatTranfer;
    };
    VmTemplateDefine.prototype.getBlockHeatTranfer = function () {
        return this.properties["blockHeatTranfer"];
    };
    VmTemplateDefine.prototype.getCPU = function () {
        if (this.isReferOfCPU()) {
            return this.properties["cPU"].attrKey;
        } else {
            return this.properties["cPU"];
        }
    };
    VmTemplateDefine.prototype.setCPU = function (cPU, isRefer) {
        this.properties["cPU"] = isRefer ? new ReferenceAttr({
            "refId": "Parameters",
            "attrKey": cPU
        }) : cPU;
    };
    VmTemplateDefine.prototype.getMemory = function () {
        if (this.isReferOfMemory()) {
            return this.properties["memory"].attrKey;
        } else {
            return this.properties["memory"];
        }
    };
    VmTemplateDefine.prototype.setMemory = function (memory, isRefer) {
        this.properties["memory"] = isRefer ? new ReferenceAttr({
            "refId": "Parameters",
            "attrKey": memory
        }) : memory;
    };

    VmTemplateDefine.prototype.updateCPUByRefParameter = function () {
        if (this.isReferOfCPU()) {
            var parameter = this.templateDefine.getParameterById(this.getCPU());
            if (parameter) {
                parameter.referNumber -= 1; //修改引用次数
            }
        }
    };
    VmTemplateDefine.prototype.updateMemoryByRefParameter = function () {
        if (this.isReferOfMemory()) {
            var parameter = this.templateDefine.getParameterById(this.getMemory());
            if (parameter) {
                parameter.referNumber -= 1; //修改引用次数
            }
        }
    };
    VmTemplateDefine.prototype.isReferOfName = function () {
        if (this.properties["name"] && this.properties["name"].type == Constant.REFERENCEATTRTYPE) {
            return true;
        }
        return false;
    };

    VmTemplateDefine.prototype.isReferOfComputerName = function () {
        if (this.properties["computerName"] && this.properties["computerName"].type == Constant.REFERENCEATTRTYPE) {
            return true;
        }
        return false;
    };

    VmTemplateDefine.prototype.isReferOfCPU = function () {
        if (this.properties["cPU"] && this.properties["cPU"].type == Constant.REFERENCEATTRTYPE) {
            return true;
        }
        return false;
    };
    VmTemplateDefine.prototype.isReferOfMemory = function () {
        if (this.properties["memory"] && this.properties["memory"].type == Constant.REFERENCEATTRTYPE) {
            return true;
        }
        return false;
    };

    VmTemplateDefine.prototype.updateVolumesByRefParameter = function () {
        var volumes = this.getVolumes().properties;
        for (var item in volumes) {
            if (!volumes.hasOwnProperty(item)) {
                continue;
            }
            if (volumes[item].isReferOfSize()) {
                var parameter = this.templateDefine.getParameterById(volumes[item].getSize());
                if (parameter) {
                    parameter.referNumber -= 1; //修改引用次数
                }
            }
        }
    };

    /**
     * 设置该模板与虚拟机资源模板对于的名称
     */
    VmTemplateDefine.prototype.setVmTempateName = function (name) {
        this.properties["vmTempateName"] = name;
    };

    /**
     * 获取该模板与虚拟机资源模板对于的名称
     */
    VmTemplateDefine.prototype.getVmTempateName = function () {
        return this.properties["vmTempateName"];
    };

    /**
     * 向逻辑模板添加一个伸缩组
     */
    VmTemplateDefine.prototype.addScalingGroup = function (scalingGroupDefine) {
        this.properties["scalingGroup"] = scalingGroupDefine;
    };

    /**
     * 判断是否有伸缩组
     */
    VmTemplateDefine.prototype.hasScalingGroup = function (template) {
        var resources = template.Resources;
        if (!resources) {
            return false;
        }
        for (key in resources) {
            var scalingGroup = resources[key];
            if (scalingGroup.Type === "GM::ScalingGroup" && this.id === scalingGroup.Properties.VmTemplateID.Ref[0]) {
                return true;
            }
        }
        return false;
    };

    VmTemplateDefine.prototype.getScalingGroup = function (template) {
        var resources = template.Resources;
        if (!resources) {
            return null;
        }
        for (key in resources) {
            var scalingGroup = resources[key];
            if (scalingGroup.Type === "GM::ScalingGroup" && this.id === scalingGroup.Properties.VmTemplateID.Ref[0]) {
                return key;
            }
        }
        return null;
    };

    /**
     * 删除逻辑模板中的伸缩组
     */
    VmTemplateDefine.prototype.delScalingGroup = function () {

    };

    VmTemplateDefine.prototype.toJson = function () {
        var id = this.defualtId();
        var json = this.fullString(id) + ":" + "{";
        json += this.toCommonJson();
        json += ",";

        var properties = this.properties;
        json += this.fullString("Properties") + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "memory" && !(properties[key] && properties[key].type == Constant.REFERENCEATTRTYPE)) {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(this.convertUnitToNum(properties[key]));
                    json += ",";

                } else if (key == "nics" || key == "volumes") {
                    json += this.fullString(this.firstUpper(key)) + ":" + "[";
                    var items = this.properties[key].properties;
                    for (var i in items) {
                        if (items.hasOwnProperty(i)) {
                            json += items[i].toJson() + ",";
                        }
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else if (key == "softwares") {
                    json += this.fullString(this.firstUpper(key)) + ":" + "[";
                    var softwares = properties[key];
                    // 按软件安装顺序输出Json文本
                    var length = softwares.length();
                    softwares = softwares.properties;
                    for (var k = 0; k < length; k++) {
                        for (var i in softwares) {
                            if (softwares.hasOwnProperty(i)) {
                                // 不访问原型链上的属性
                                if (softwares[i].installOrder == k) {
                                    json += softwares[i].toJson();
                                    json += ",";
                                    break;
                                }
                            }
                        }
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else if (key == "postCommands" || key == "releaseCommands" || key == "startCommands" || key == "stopCommands") {
                    json += this.fullString(this.firstUpper(key)) + ":" + "["; // 将第一个字母变为大写
                    var cmds = this.properties[key].properties;
                    var mands = [];
                    for (var i in cmds) {
                        if (cmds.hasOwnProperty(i)) {
                            mands.push(cmds[i]);
                        }
                    }
                    for (var i = mands.length - 1; i >= 0; i--) {
                        json += this.fullString(mands[i].toString()) + ",";
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":";
                    if (properties[key] && properties[key].type == Constant.REFERENCEATTRTYPE) {
                        json += properties[key].toJson();
                    } else {
                        json += this.fullString(properties[key]);
                    }
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";

        json += "}";
        return json;
    };

    /**
     * 增加网卡
     * @param key 网卡名称
     * @param value 网卡值
     * @return true增加成功，false增加失败
     */
    VmTemplateDefine.prototype.addNic = function (key, value) {
        // 验证Key和value
        if (!key || !value || !(value.type == Constant.NICTYPE)) {
            return false;
        }
        var nics = this.getNics();
        nics.add(key, value);
        this.setNics(nics);
        return true;
    };

    /**
     * 是否有可用的网卡
     * @returns {boolean}
     */
    VmTemplateDefine.prototype.hasAvailableNics = function () {
        var nics = this.getNics().getArray();
        if (nics.length < 0) {
            return false;
        }
        for (var i = 0; i < nics.length; i++) {
            if (nics[i] && nics[i].type === Constant.NICTYPE && nics[i].portGroupId && (nics[i].portGroupId.refId === null)) {
                return true;
            }
        }
        return false;
    };

    /**
     * 获取虚拟机下所有的网卡
     */
    VmTemplateDefine.prototype.getNics = function () {
        var nics = this.properties["nics"];
        if (!nics) {
            nics = new ArrayList();
            this.setNics(nics);
        }
        return nics;
    };
    /**
     * 设置vm 下的所有网卡
     * @param {Object} nics 所有网卡集合
     */
    VmTemplateDefine.prototype.setNics = function (nics) {
        this.properties["nics"] = nics;
    };

    /**
     * 删除网卡
     * @param key 网卡名称
     * @return true删除成功，false删除失败
     */
    VmTemplateDefine.prototype.delNic = function (key) {
        return this.getNics().del(key);
    };
    /**
     * 获取网卡
     * @param key 网卡名称
     * @return false失败，否则返回网卡
     */
    VmTemplateDefine.prototype.getNic = function (key) {
        return this.getNics().get(key);
    };

    /**
     * 根据网卡名称返回网卡
     * @param key 网卡名称
     * @return false失败，否则返回网卡
     */
    VmTemplateDefine.prototype.getNicByName = function (name) {
        var nics = this.getNics().properties;
        var nic = null;
        for (var item in nics) {
            if (nics.hasOwnProperty(item) && nics[item] && nics[item].name == name) {
                nic = nics[item];
                break;
            }
        }
        return nic;
    };

    /**
     * 根据网卡名称返回在VmTemplateDefine中对应的key
     *
     * @param key
     *            网卡名称
     * @return false失败，否则返回key
     */
    VmTemplateDefine.prototype.getNicKeyByName = function (name) {
        var nics = this.getNics().properties;
        var key = null;
        for (var item in nics) {
            if (nics.hasOwnProperty(item) && nics[item] && nics[item].name == name) {
                key = item;
                break;
            }
        }
        return key;
    };

    /**
     * 更新网卡
     * @param key  网卡名称
     * @param value 网卡值
     * @return false失败，否则更新网卡
     */
    VmTemplateDefine.prototype.updateNic = function (key, value) {
        //验证Key和value
        if (!key || !value || value.type != Constant.NICTYPE) {
            return false;
        }
        return this.getNics().update(key, value);
    };

    /**
     * 获取vm 所有磁盘
     */
    VmTemplateDefine.prototype.getVolumes = function () {
        var volumes = this.properties["volumes"];
        if (!volumes) {
            volumes = new ArrayList();
            this.setVolumes(volumes);
        }
        return volumes;
    };
    VmTemplateDefine.prototype.setVolumes = function (volumes) {
        this.properties["volumes"] = volumes;
    };
    /**
     * 增加磁盘
     * @param key 磁盘名称
     * @param value 磁盘值
     * @return false失败，否则增加磁盘
     */
    VmTemplateDefine.prototype.addVolume = function (key, value) {
        //验证Key和value
        if (!key || !value || value.type != Constant.VOLUMETYPE) {
            return false;
        }
        return this.getVolumes().add(key, value);
    };

    /**
     * 删除磁盘
     * @param key  磁盘名称
     * @return  false失败，否则删除磁盘
     */
    VmTemplateDefine.prototype.delVolume = function (key) {
        //验证Key和value
        if (!key) {
            return false;
        }
        return this.getVolumes().del(key);
    };
    /**
     * 获取磁盘
     * @param key 磁盘名称
     * @return
     */
    VmTemplateDefine.prototype.getVolume = function (key) {
        //验证Key和value
        if (!key) {
            return null;
        }
        return this.getVolumes().get(key);
    };
    /**
     * 更新磁盘
     * @param key 磁盘名称
     * @param value   磁盘值
     * @return false失败，否则更新磁盘
     */
    VmTemplateDefine.prototype.updateVolume = function (key, value) {
        //验证Key和value
        if (!key || !value || value.type != Constant.VOLUMETYPE) {
            return false;
        }
        return this.getVolumes().update(key, value);
    };


    /**
     * 获取vm  的所有软件
     */
    VmTemplateDefine.prototype.getSoftwares = function () {
        var softwares = this.properties["softwares"];
        if (!softwares) {
            softwares = new ArrayList();
            this.setSoftwares(softwares);
        }
        return softwares;
    };
    VmTemplateDefine.prototype.setSoftwares = function (softwares) {
        this.properties["softwares"] = softwares;
    };
    /**
     * 增加软件
     * @param key 软件名称
     * @param value 软件值
     * @return false失败，否则增加软件
     */
    VmTemplateDefine.prototype.addSoftware = function (key, value) {
        //验证Key和value
        if (!key || !value || (value.type != Constant.SOFTWAREDEFINETYPE && value.type != Constant.SCRIPTDEFINETYPE)) {
            return false;
        }
        return this.getSoftwares().add(key, value);
    };

    /**
     *删除软件参数引用公共参数的引用
     * @param params 参数
     */
    var deleteSoftwareParamsRefer = function (templateDefine, params) {
        for (var param in params) {
            if (params.hasOwnProperty(param)) {
                var value = params[param];
                if (value && value.type == Constant.REFERENCEATTRTYPE) {
                    // 删除引用 网卡的引用
                    var resource = templateDefine.getResourceById(value.refId);
                    if (resource && resource.type == "VmTemplate") {
                        var nic = resource.getNic(value.attrKey);
                        if (nic && nic.type == Constant.NICTYPE && nic.num >= 1) {
                            // 将网卡的引用数-1
                            nic.num--;
                        }
                    }
                } else if (value && value.type == Constant.PARAMETERDEFINETYPE) {
                    // 将原来引用的公共参数引用的次数减一
                    var parameteritem = templateDefine.properties.parameters
                        .get(value.properties.parameterName);
                    if (parameteritem) {
                        parameteritem.referNumSub();
                    }
                }
            }
        }
    };

    /**
     * 删除软件
     *
     * @param key 软件名称
     * @return false失败，否则删除软件
     */
    VmTemplateDefine.prototype.delSoftware = function (key) {
        //验证Key
        if (!key) {
            return false;
        }
        var software = this.getSoftware(key);
        if (software) {
            // 得到软件初始化命令参数
            var installParams = software.getInstallParams().properties;
            deleteSoftwareParamsRefer(this.templateDefine, installParams);
            // 得到卸载命令参数
            var uninstallParams = software.getUninstallParams().properties;
            deleteSoftwareParamsRefer(this.templateDefine, uninstallParams);
            // 得到启动命令参数
            var startParams = software.getStartParams().properties;
            deleteSoftwareParamsRefer(this.templateDefine, startParams);
            // 得到停止命令参数
            var stopParams = software.getStopParams().properties;
            deleteSoftwareParamsRefer(this.templateDefine, stopParams);
        }
        return this.getSoftwares().del(key);
    };

    /**
     * 获取软件
     * @param key 软件名称
     * @return false失败，否则获取软件
     */
    VmTemplateDefine.prototype.getSoftware = function (key) {
        //验证Key
        if (!key) {
            return null;
        }
        return this.getSoftwares().get(key);
    };

    /**
     * 根据软件名称获取软件
     * @param key 软件名称
     * @return 软件资源
     */
    VmTemplateDefine.prototype.getSoftwareByName = function (name) {
        // 验证Key
        if (!name) {
            return null;
        }
        var softwares = this.getSoftwares().properties;
        for (var item in softwares) {
            if (softwares.hasOwnProperty(item)) {
                if (softwares[item] && softwares[item].name == name) {
                    return softwares[item];
                }
            }
        }
        return null;
    };

    /**
     * 更新软件
     *
     * @param key
     *            软件名称
     * @param value
     *            软件值
     * @return
     */
    VmTemplateDefine.prototype.updateSoftware = function (key, value) {
        //验证Key和value
        if (!key || !value || value.type != Constant.SOFTWAREDEFINETYPE) {
            return false;
        }
        return this.getSoftwares().update(key, value);
    };

    /**
     * 获取 vm 所有的初始化Post命令
     */
    VmTemplateDefine.prototype.getPostCommands = function () {
        var postCommands = this.properties["postCommands"];
        if (!postCommands) {
            postCommands = new ArrayList();
            this.setPostCommands(postCommands);
        }
        return postCommands;
    };

    VmTemplateDefine.prototype.setPostCommands = function (postCommands) {
        this.properties["postCommands"] = postCommands;
    };

    VmTemplateDefine.prototype.hasSoftware = function (software) {
        software = typeof (software) == "string" ? new SoftwareDefine(null, software, null) : software;
        software.templateDefine = this.templateDefine;
        var softwares = this.getSoftwares().properties;
        for (var index in softwares) {
            if (softwares.hasOwnProperty(index)) {
                var soft = softwares[index];
                if (software["name"] == soft["name"]) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * 增加初始化命令
     * @param key 命令名称
     * @param value 命令值
     * @return false失败，否则增加命令
     */
    VmTemplateDefine.prototype.addPostCommand = function (key, value) {
        //验证Key和value
        if (!key || !value) {
            return false;
        }
        return this.getPostCommands().add(key, value);
    };

    /**
     * 删除初始化命令
     * @param key  命令名称
     * @return false失败，否则删除命令
     */
    VmTemplateDefine.prototype.delPostCommand = function (key) {
        //验证Key
        if (!key) {
            return false;
        }
        return this.getPostCommands().del(key);
    };

    /**
     * 获取初始化命令
     * @param key 命令名称
     * @return false失败，否则获取命令
     */
    VmTemplateDefine.prototype.getPostCommand = function (key) {
        //验证Key和value
        if (!key) {
            return null;
        }
        return this.getPostCommands().get(key);
    };

    /**
     * 更新初始化命令
     * @param key 命令名称
     * @param value 命令值
     * @return
     */
    VmTemplateDefine.prototype.updatePostCommand = function (key, value) {
        //验证Key
        if (!key) {
            return false;
        }
        return this.getPostCommands().update(key, value);
    };

    /**
     * 获取vm 所有的释放命令
     */
    VmTemplateDefine.prototype.getReleaseCommands = function () {
        var releaseCommands = this.properties["releaseCommands"];
        if (!releaseCommands) {
            releaseCommands = new ArrayList();
            this.setReleaseCommands(releaseCommands);
        }
        return releaseCommands;
    };
    VmTemplateDefine.prototype.setReleaseCommands = function (releaseCommands) {
        this.properties["releaseCommands"] = releaseCommands;
    };
    /**
     * 增加释放命令
     * @param key 命令名称
     * @param value 命令值
     * @return false失败，否则增加释放命令
     */
    VmTemplateDefine.prototype.addReleaseCommand = function (key, value) {
        //验证Key
        if (!key) {
            return false;
        }
        return this.getReleaseCommands().add(key, value);
    };

    /**
     * 删除释放命令
     * @param key 命令名称
     * @return false失败，否则删除命令
     */
    VmTemplateDefine.prototype.delReleaseCommand = function (key) {
        //验证Key
        if (!key) {
            return false;
        }
        return this.getReleaseCommands().del(key);
    };

    /**
     * 获取释放命令
     * @param key 命令名称
     * @return false失败，否则获取释放命令
     */
    VmTemplateDefine.prototype.getReleaseCommand = function (key) {
        //验证Key
        if (!key) {
            return null;
        }
        return this.getReleaseCommands().get(key);
    };

    /**
     * 更新释放命令
     * @param key  命令名称
     * @param value 命令值
     * @return false失败，否则更新释放命令
     */
    VmTemplateDefine.prototype.updateReleaseCommand = function (key, value) {
        //验证Key
        if (!key) {
            return false;
        }
        return this.getReleaseCommands().update(key, value);
    };


    VmTemplateDefine.prototype.getStartCommands = function () {
        var startCommands = this.properties["startCommands"];
        if (!startCommands) {
            startCommands = new ArrayList();
            this.setStartCommands(startCommands);
        }
        return startCommands;
    };
    VmTemplateDefine.prototype.setStartCommands = function (startCommands) {
        this.properties["startCommands"] = startCommands;
    };
    /**
     * 增加启动命令
     * @param key 命令名称
     * @param value 命令值
     * @return false失败，否则增加命令
     */
    VmTemplateDefine.prototype.addStartCommand = function (key, value) {
        if (!key || !value) {
            return false;
        }
        return this.getStartCommands().add(key, value);
    };

    /**
     * 删除启动命令
     * @param key 命令名称
     * @return false失败，否则删除命令
     */
    VmTemplateDefine.prototype.delStartCommand = function (key) {
        if (!key) {
            return false;
        }
        return this.getStartCommands().del(key);
    };

    /**
     * 获取启动命令
     * @param key 命令名称
     * @return
     */
    VmTemplateDefine.prototype.getStartCommand = function (key) {
        if (!key) {
            return null;
        }
        return this.getStartCommands().get(key);
    };

    /**
     * 更新启动命令
     * @param key 命令名称
     * @param value 命令值
     * @return false失败，否则更新启动命令
     */
    VmTemplateDefine.prototype.updateStartCommand = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getStartCommands().update(key, value);
    };

    /**
     * 获取停止命令列表
     * @return
     */
    VmTemplateDefine.prototype.getStopCommands = function () {
        var stopCommands = this.properties["stopCommands"];
        if (!stopCommands) {
            stopCommands = new ArrayList();
            this.setStopCommands(stopCommands);
        }
        return stopCommands;
    };

    /**
     * 设置停止命令列表
     * @return
     */
    VmTemplateDefine.prototype.setStopCommands = function (stopCommands) {
        this.properties["stopCommands"] = stopCommands;
    };
    /**
     * 增加停止命令
     *
     * @param key
     *            命令名称
     * @param value
     *            命令值
     * @return false失败，否则增加命令
     */
    VmTemplateDefine.prototype.addStopCommand = function (key, value) {
        if (!key || !value) {
            return false;
        }
        return this.getStopCommands().add(key, value);
    };

    /**
     * 删除停止命令
     *
     * @param key
     *            命令名称
     * @return false失败，否则删除命令
     */
    VmTemplateDefine.prototype.delStopCommand = function (key) {
        if (!key) {
            return false;
        }
        return this.getStopCommands().del(key);
    };

    /**
     * 获取停止命令
     *
     * @param key
     *            命令名称
     * @return
     */
    VmTemplateDefine.prototype.getStopCommand = function (key) {
        if (!key) {
            return null;
        }
        return this.getStopCommands().get(key);
    };

    /**
     * 更新停止命令
     *
     * @param key
     *            命令名称
     * @param value
     *            命令值
     * @return false失败，否则更新停止命令
     */
    VmTemplateDefine.prototype.updateStopCommand = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getStopCommands().update(key, value);
    };
    /**
     * 创建虚拟机资源实例
     * @param attributes   资源属性列表
     * @param typeName     资源类型名称
     * @param resourceName 资源名称
     * @param resourceId   资源ID  全局唯一
     * @return 虚拟机资源实例
     */
    VmTemplateDefine.createResource = function (templateDefine, attributes, typeName, resourceName, resourceId) {
        var resource = new VmTemplateDefine();
        resource.templateDefine = templateDefine;
        //添加ID、资源类型名称及名称
        resource.id = resourceId;
        resource.type = typeName;
        resource.name = resourceName;
        resource.properties.name = resourceName;

        //创建一张默认的网卡，该网卡不能删除，修改
        var nic = new Nic();
        nic.templateDefine = templateDefine;
        nic.name = Constant.VM_SYSTEMNICNAME;
        nic.systemDefault = true;
        nic.vlb = "false";
        resource.properties.nics.add(TemplateUtils.createId(), nic);

        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            if (attr.type == "VmTemplate.Volumes") {
                var volume = new Volume();
                volume.templateDefine = templateDefine;
                volume.name = attr.name;
                volume.size = attr.value;
                volume.allocType = attr.allocType;
                volume.affectBySnapshot = (attr.affectBySnapshot == "true") ? "true" : "false";
                volume.mediaType = attr.mediaType;
                resource.properties.volumes.add(TemplateUtils.createId(), volume);
            } else if (attr.type == "VmTemplate.Nics") {} else if (attr.name == "PostCommands") {
                var postCommands = attr.value.split(",");
                for (var index = 0; index < postCommands.length; index++) {
                    resource.properties.postCommands.add(TemplateUtils.createId(), postCommands[index]);
                }
            } else if (attr.name == "ReleaseCommands") {
                var releaseCommands = attr.value.split(",");
                for (var index = 0; index < releaseCommands.length; index++) {
                    resource.properties.releaseCommands.add(TemplateUtils.createId(), releaseCommands[index]);
                }
            } else if (attr.name == "StartCommands") {
                var startCommands = attr.value.split(",");
                for (var index = 0; index < startCommands.length; index++) {
                    resource.properties.startCommands.add(TemplateUtils.createId(), startCommands[index]);
                }
            } else if (attr.name == "StopCommands") {
                var stopCommands = attr.value.split(",");
                for (var index = 0; index < stopCommands.length; index++) {
                    resource.properties.stopCommands.add(TemplateUtils.createId(), stopCommands[index]);
                }
            } else {
                // 资源拖到画布时，给基本类型属性vmTemplateID,name,description,cPU,memory,oSType,oSversion赋值
                // 把首字母转成小写
                attr.name = attr.name.charAt(0).toLowerCase().concat(attr.name.substr(1));
                if (attr.name in resource.properties) {
                    if (!(resource.properties[attr.name] instanceof Object)) {
                        resource.properties[attr.name] = attr.value;
                    }
                }
            }
        }
        return resource;
    };

    /**
     * Nic 类
     * @param name 网卡名称
     */
    Nic = function (name, templateDefine) {
        this.templateDefine = templateDefine;
        this.name = name;
        this.num = 0;
        this.type = "Nic";
        this.systemDefault = false;
        this.vlb = "false";
        this.portGroupId = new ReferenceAttr();
    };
    Nic.prototype = new AmeUtil();
    Nic.prototype.constructor = Nic;

    /**
     * 将本身转换成数组
     * @return array 数组
     */
    Nic.prototype.toArray = function () {
        var array = [];
        array[0] = this.name;
        array[1] = "";
        array[2] = (this.vlb == "true") ? amei18n.nic.vlbYes : amei18n.nic.vlbNo;
        if (this.portGroupId && this.portGroupId.type == Constant.REFERENCEATTRTYPE && this.portGroupId.refId != "") {
            var portGroup = this.templateDefine.getResourceById(this.portGroupId.refId);
            if (portGroup) {
                array[1] = portGroup.name;
            }

        }
        return array;
    };
    /**
     * 生成网卡Json
     * @return Json
     */
    Nic.prototype.toJson = function () {
        var json = "{";
        json += this.fullString("Name") + ":" + this.fullString(this.name) + ",";
        if (!this.portGroupId.refId || this.portGroupId.refId == null) {
            json += this.fullString("NetworkID") + ":\"\"";
        } else {
            json += this.fullString("NetworkID") + ": { \"Ref\":[\"" + this.portGroupId.refId + "\",\"NetworkID\"]" + " }";
        }
        json += "," + this.fullString("SystemDefault") + ":" + this.fullString(this.systemDefault);
        json += "," + this.fullString("Vlb") + ":" + this.fullString(this.vlb);
        json += "}";
        return json;
    };
    /**
     * Volume 类
     */
    Volume = function (name, size, allocType, affectBySnapshot, mediaType, templateDefine) {
        this.templateDefine = templateDefine;
        this.systemDefault = false;
        this.type = "Volume";
        this.name = name;
        this.size = size;
        this.allocType = allocType;
        this.affectBySnapshot = affectBySnapshot;
        this.mediaType = mediaType;
    };
    Volume.prototype = new AmeUtil();
    Volume.prototype.constructor = Volume;

    Volume.prototype.setSize = function (size, isRefer) {
        this.size = isRefer ? new ReferenceAttr({
            "refId": "Parameters",
            "attrKey": size
        }) : size;
    };

    Volume.prototype.getSize = function () {
        if (this.isReferOfSize()) {
            return this.size.attrKey;
        } else {
            return this.size;
        }
    };
    /**
     * 返回引用公共参数的值
     * @param size 解析的值
     * @return 如果该值引用公共参数，则返回公共参数名，如果没有则返回null
     */
    Volume.prototype.getSizeByParameter = function (size) {
        var paramStr = "$Parameters.";
        var index = size.indexOf(paramStr);
        if (index >= 0) {
            return size.substring(index + paramStr.length);
        } else {
            return null;
        }
    };

    Volume.prototype.isReferOfSize = function () {
        if (this.size && this.size.type == Constant.REFERENCEATTRTYPE) {
            return true;
        }
        return false;
    };
    /**
     * 将本身转换成数组
     * @return array 数组
     */
    Volume.prototype.toArray = function () {
        var size = parseInt(this.size) + "";

        var allocType = "";
        if (this.allocType == "thickformat") {
            allocType = amei18n.volume.zeroDisk;
        } else if (this.allocType == "thin") {
            allocType = amei18n.volume.allocOpen;
        } else {
            allocType = amei18n.volume.commonDisk;
        }
        var affectBySnapshot = (this.affectBySnapshot == "true") ? amei18n.volume.affectBySnapshotYes : amei18n.volume.affectBySnapshotNo;
        var mediaType = this.mediaType;
        return [this.name, size, allocType, affectBySnapshot, mediaType];
    };
    /**
     * 生成磁盘Json
     * @return Json
     */
    Volume.prototype.toJson = function () {
        var json = "{";
        json += this.fullString("Name") + ":" + this.fullString(this.name) + ",";
        json += this.fullString("Size") + ":";
        if (this.size && this.size.type == Constant.REFERENCEATTRTYPE) {
            json += this.size.toJson();
        } else {
            json += this.fullString(this.convertUnitToNum(this.size));
        }
        json += ",";
        json += this.fullString("AllocType") + ":" + this.fullString(this.allocType) + ",";
        json += this.fullString("AffectBySnapshot") + ":" + this.fullString(this.affectBySnapshot) + ",";
        json += this.fullString("MediaType") + ":" + this.fullString(this.mediaType) + ",";
        json += this.fullString("SystemDefault") + ":" + this.fullString(this.systemDefault);
        json += "}";
        return json;
    };

    /**
     * ScalingGroup 类，构造函数，继承于ResourceDefine
     * @param id 资源id,资源唯一号
     * @param name 资源名称
     * @param type 资源类型
     */
    ScalingGroupDefine = function (id, name, type) {
        ResourceDefine.call(this, id, name, type);
        this.properties = {
            "name": name,
            "description": null,
            "maxSize": "1",
            "minSize": "1",
            "desiredCapacity": "1",
            "cooldown": "0",
            "vmTemplate": new ReferenceAttr(),
            // 伸缩策略
            "scalingPolicies": new ArrayList()
        };
    };
    ScalingGroupDefine.prototype = new ResourceDefine();
    ScalingGroupDefine.prototype.constructor = ScalingGroupDefine;


    /**
     * 根据resource属性，生成cell的属性
     */
    ScalingGroupDefine.prototype.genCellAttr = function () {
        var attrList = [];

        attrList.push({
            "name": "description",
            "type": "String",
            "value": this.properties["description"]
        });

        attrList.push({
            "name": "maxSize",
            "type": "Integer",
            "value": this.properties["maxSize"]
        });
        attrList.push({
            "name": "minSize",
            "type": "Integer",
            "value": this.properties["minSize"]
        });

        attrList.push({
            "name": "desiredCapacity",
            "type": "Integer",
            "value": this.properties["desiredCapacity"]
        });

        attrList.push({
            "name": "cooldown",
            "type": "Integer",
            "value": this.properties["cooldown"]
        });

        obj = this.properties["scalingPolicies"].properties;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                attrList.push({
                    "name": obj[key].name,
                    "type": "ScalingGroup.ScalingPolicy",
                    "value": obj[key].size
                });
            }
        }

        return attrList;
    };

    ScalingGroupDefine.prototype.getName = function () {
        return this.properties["name"];
    };

    /**
     * 设置ScalingGroupDefine的名称
     * @param {Object} name 当name为字符串时，表示没有引用公共参数，当为ReferenceAttr时表示引用了公共参数
     */
    ScalingGroupDefine.prototype.setName = function (name, isRefer) {
        this.properties["name"] = name;
        this.name = this.getName();
    };
    ScalingGroupDefine.prototype.getMaxSize = function () {
        return this.properties["maxSize"];
    };
    ScalingGroupDefine.prototype.getMinSize = function () {
        return this.properties["minSize"];
    };
    ScalingGroupDefine.prototype.getDesiredCapacity = function () {
        return this.properties["desiredCapacity"];
    };
    ScalingGroupDefine.prototype.getCooldown = function () {
        return this.properties["cooldown"];
    };

    ScalingGroupDefine.prototype.setMaxSize = function (maxSize) {
        this.properties["maxSize"] = maxSize;
    };

    ScalingGroupDefine.prototype.setMinSize = function (minSize) {
        this.properties["minSize"] = minSize;
    };

    ScalingGroupDefine.prototype.setDesiredCapacity = function (desiredCapacity, isRefer) {
        this.properties["desiredCapacity"] = desiredCapacity;
    };

    ScalingGroupDefine.prototype.setCooldown = function (cooldown, isRefer) {
        this.properties["cooldown"] = cooldown;
    };

    ScalingGroupDefine.prototype.toJson = function () {
        var id = this.defualtId();
        var json = this.fullString(id) + ":" + "{";
        json += this.toCommonJson();
        json += ",";

        var properties = this.properties;
        json += this.fullString("Properties") + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "scalingPolicies") {
                    json += this.fullString(this.firstUpper(key)) + ":" + "[";
                    var items = this.properties[key].properties;
                    for (var i in items) {
                        if (items.hasOwnProperty(i)) {
                            json += items[i].toJson() + ",";
                        }
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else if (key == "vmTemplate") {
                    json += this.fullString("VmTemplateID");
                    var vmTemplateIDValue = ":\"\"";
                    if (properties[key].refId && (properties[key].refId.toString().indexOf("AME_") >= 0)) {
                        vmTemplateIDValue = ":{\"Ref\":[\"" + properties[key].refId + "\",\"" + properties[key].attrKey + "\"]}"
                    }
                    json += vmTemplateIDValue;
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";
        json += "}";
        return json;
    };

    /**
     *
     * @return
     */
    ScalingGroupDefine.prototype.getVmTemplateId = function () {
        var vmtemplate = this.properties["vmTemplate"];
        return vmtemplate["refId"];
    };

    ScalingGroupDefine.prototype.setVmTemplateId = function (id) {
        var vmTemplate = new ReferenceAttr({
            "refId": id,
            "attrKey": "PhysicalID"
        });
        this.properties["vmTemplate"] = vmTemplate;
    };

    /**
     * 获取伸缩组所有策略
     */
    ScalingGroupDefine.prototype.getScalingPolicies = function () {
        var scalingPolicies = this.properties["scalingPolicies"];
        if (!scalingPolicies) {
            scalingPolicies = new ArrayList();
            this.setScalingPolicies(scalingPolicies);
        }
        return scalingPolicies;
    };
    ScalingGroupDefine.prototype.setScalingPolicies = function (scalingPolicies) {
        this.properties["scalingPolicies"] = scalingPolicies;
    };
    /**
     * 增加策略
     * @param key 策略名称
     * @param value 策略值
     * @return false失败，否则增加策略
     */
    ScalingGroupDefine.prototype.addScalingPolicy = function (key, value) {
        //验证Key和value
        if (!key || !value || value.type != Constant.SCALINGPOLICYTYPE) {
            return false;
        }
        return this.getScalingPolicies().add(key, value);
    };

    /**
     * 删除策略
     * @param key  策略名称
     * @return  false失败，否则删除策略
     */
    ScalingGroupDefine.prototype.delScalingPolicies = function (key) {
        //验证Key和value
        if (!key) {
            return false;
        }
        return this.getScalingPolicies().del(key);
    };
    /**
     * 获取策略
     * @param key 策略名称
     * @return
     */
    ScalingGroupDefine.prototype.getScalingPolicy = function (key) {
        //验证Key和value
        if (!key) {
            return null;
        }
        return this.getScalingPolicies().get(key);
    };
    /**
     * 更新磁盘
     * @param key 磁盘名称
     * @param value   磁盘值
     * @return false失败，否则更新磁盘
     */
    ScalingGroupDefine.prototype.updateScalingPolicy = function (key, value) {
        //验证Key和value
        if (!key || !value || value.type != Constant.SCALINGPOLICYTYPE) {
            return false;
        }
        return this.getScalingPolicies().update(key, value);
    };


    /**
     * 创建伸缩组资源实例
     * @static
     * @public
     * @param attributes   资源属性列表
     * @param typeName     资源类型名称
     * @param resourceName 资源名称
     * @param resourceId   资源ID  全局唯一
     * @return 端口组资源实例
     */
    ScalingGroupDefine.createResource = function (templateDefine, attributes, typeName, resourceName, resourceId) {
        var resource = new ScalingGroupDefine();
        resource.templateDefine = templateDefine;
        // 添加ID、资源类型名称及名称
        resource.id = resourceId;
        resource.type = typeName;
        resource.name = resourceName;
        resource.properties.name = resourceName;
        //	        
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            if (attr.type == "ScalingGroup.ScalingPolicy") {
                var scalingPolicy = new ScalingPolicy();
                scalingPolicy.name = attr.name;
                scalingPolicy.description = attr.description;
                scalingPolicy.metricCondition = attr.metricCondition;
                scalingPolicy.action = attr.action;
                resource.properties.scalingPolicies.add(TemplateUtils.createId(), scalingPolicy);
            } else {
                var attr = attributes[i];
                // 把首字母转成小写
                attr.name = attr.name.charAt(0).toLowerCase().concat(attr.name.substr(1));
                if (attr.name in resource.properties) {
                    resource.properties[attr.name] = attr.value;
                }

            }
        }
        return resource;
    };
    /**
     * * ScalingPolicy 类
     */
    ScalingPolicy = function (id, name, description, metricCondition, action) {
        this.id = id;
        this.type = "ScalingPolicy";
        this.name = name;
        this.description = description;
        this.metricCondition = metricCondition;
        this.action = action;
    };
    ScalingPolicy.prototype = new AmeUtil();
    ScalingPolicy.prototype.constructor = ScalingPolicy;


    /**
     * 将本身转换成数组
     * @return array 数组
     */
    ScalingPolicy.prototype.toArray = function () {
        return [this.name, this.action.ActionType, this.action.CoolDown];
    };
    /**
     * 生成磁盘Json
     * @return Json
     */
    ScalingPolicy.prototype.toJson = function () {
        var json = "{";
        json += this.fullString("Name") + ":" + this.fullString(this.name) + ",";
        json += this.fullString("Description") + ":" + this.fullString(this.description) + ",";
        json += this.fullString("MetricCondition") + ":" + "{";
        json += this.fullString("StatisticsPeriod") + ":" + this.fullString(this.metricCondition.StatisticsPeriod) + ",";
        json += this.fullString("CollectionTimes") + ":" + this.fullString(this.metricCondition.CollectionTimes) + ",";
        json += this.fullString("Configurations") + ":" + "[";
        var configure = this.metricCondition.Configurations;
        for (var i in configure) {
            json += "{" + this.fullString("MetricType") + ":" + this.fullString(configure[i].MetricType) + ",";
            json += this.fullString("StatisticType") + ":" + this.fullString(configure[i].StatisticType) + ",";
            json += this.fullString("CompareOperator") + ":" + this.fullString(configure[i].CompareOperator) + ",";
            if (i == configure.length - 1)
                json += this.fullString("MetricValue") + ":" + this.fullString(configure[i].MetricValue) + "}";
            else
                json += this.fullString("MetricValue") + ":" + this.fullString(configure[i].MetricValue) + "}" + ",";
        }
        json += "]" + "}" + ",";
        json += this.fullString("Action") + ":" + "{";
        json += this.fullString("ActionType") + ":" + this.fullString(this.action.ActionType) + ",";
        json += this.fullString("CoolDown") + ":" + this.fullString(this.action.CoolDown) + ",";
        json += this.fullString("AdjustStep") + ":" + "{";
        json += this.fullString("StepType") + ":" + this.fullString(this.action.AdjustStep.StepType) + ",";
        json += this.fullString("StepValue") + ":" + this.fullString(this.action.AdjustStep.StepValue) + "}" + "}";
        json += "}";
        return json;
    };


    /**
     * Monitor 类，构造函数，继承于ResourceDefine
     * @param id
     * @param name 资源名称
     * @param type 资源类型
     */
    MonitorDefine = function (id, name, type) {
        ResourceDefine.call(this, id, name, type);
        this.properties = {
            "name": name,
            "description": null,
            "metricNames": new ArrayList(),
            "targetName": new ReferenceAttr()
        };
    };
    MonitorDefine.prototype = new ResourceDefine();
    MonitorDefine.prototype.constructor = MonitorDefine;

    MonitorDefine.prototype.toJson = function () {
        var id = this.defualtId();
        var json = this.fullString(id) + ":" + "{";
        json += this.toCommonJson();
        json += ",";

        var properties = this.properties;
        json += this.fullString("Properties") + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "targetName") {
                    json += this.fullString("TargetName") + ":" + properties[key].toJson();
                    json += ",";
                } else if (key == "metricNames") {
                    json += this.fullString("MetricNames") + ":" + "[";
                    var metrics = this.properties[key].properties;
                    for (var i in metrics) {
                        if (metrics.hasOwnProperty(i)) {
                            json += this.fullString(metrics[i].toString()) + ",";
                        }
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";

        json += "}";
        return json;
    };
    MonitorDefine.prototype.getMetricNames = function () {
        var metricNames = this.properties["metricNames"];
        if (!metricNames) {
            metricNames = new ArrayList();
            this.setMetricNames(metricNames);
        }
        return metricNames;
    };
    MonitorDefine.prototype.setMetricNames = function (metrics) {
        this.properties["metricNames"] = metrics;
    };
    /**
     * 增加监控指标
     * @param key 监控指标名称
     * @param value  监控值
     * @return
     */
    MonitorDefine.prototype.addMetricName = function (key, value) {
        //验证Key和value
        if (!key || !value) {
            return false;
        }
        return this.getMetricNames().add(key, value);
    };

    /**
     * 删除监控指标
     * @param key 监控指标名称
     * @return
     */
    MonitorDefine.prototype.delMetricName = function (key) {
        if (!key) {
            return false;
        }
        return this.getMetricNames().del(key);
    };

    /**
     * 获取监控指标
     * @param key 监控指标名称
     * @return
     */
    MonitorDefine.prototype.getMetricName = function (key) {
        if (!key) {
            return null;
        }
        return this.getMetricNames().get(key);
    };

    /**
     * 更新监控指标
     * @param key  监控指标名称
     * @param value 监控值
     * @return
     */
    MonitorDefine.prototype.updateMetricName = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getMetricNames().update(key, value);
    };

    /**
     * MetricAlarm ，构造函数，继承于ResourceDefine
     * @param id
     * @param name
     * @param type
     */
    MetricAlarmDefine = function (id, name, type) {
        ResourceDefine.call(this, id, name, type);
        this.properties = {
            "name": name,
            "actions": new ArrayList(),
            "evaluationPeriods": null,
            "metricName": null,
            "statistic": null,
            "period": null,
            "comparisonOperator": null,
            "threshold": null,
            "description": null,
            "monitor": new ReferenceAttr()
        };
    };
    MetricAlarmDefine.prototype = new ResourceDefine();
    MetricAlarmDefine.prototype.constructor = MetricAlarmDefine;

    MetricAlarmDefine.prototype.getActions = function () {
        var actions = this.properties["actions"];
        if (!actions) {
            actions = new ArrayList();
            this.setActions(actions);
        }
        return actions;
    };
    MetricAlarmDefine.prototype.setActions = function (actions) {
        this.properties["actions"] = actions;
    };
    /**
     * 删除触发Action
     * @param key key值
     * @return
     */
    MetricAlarmDefine.prototype.delAction = function (key) {
        if (!key) {
            return false;
        }
        return this.getActions().del(key);
    };

    /**
     * 获取触发Action
     * @param key
     * @return
     */
    MetricAlarmDefine.prototype.getAction = function (key) {
        if (!key) {
            return null;
        }
        return this.getActions().get(key);
    };

    /**
     * 更新触发Action
     * @param key  Action名称
     * @param value Action值
     * @return
     */
    MetricAlarmDefine.prototype.updateAction = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getActions().update(key, value);
    };

    /**
     * 增加触发Action
     * @param key Action名称
     * @param value  Action值
     * @return
     */
    MetricAlarmDefine.prototype.addAction = function (key, value) {
        if (!key || !value) {
            return false;
        }
        return this.getActions().add(key, value);
    };
    /**
     * 生成Json
     * @return
     */
    MetricAlarmDefine.prototype.toJson = function () {
        var id = this.defualtId();
        var json = this.fullString(id) + ":" + "{";
        json += this.toCommonJson();
        json += ",";

        var properties = this.properties;
        json += this.fullString("Properties") + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "monitor") {
                    json += this.fullString("MonitorName") + ":" + properties[key].toJson();
                    json += ",";
                } else if (key == "actions") {
                    json += this.fullString("Actions") + ":" + "[";
                    var actions = this.properties[key].properties;
                    for (var i in actions) {
                        if (actions.hasOwnProperty(i)) {
                            json += this.fullString(actions[i].toString()) + ",";
                        }
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";

        json += "}";
        return json;
    };
    /**
     * Software 类，构造函数，继承于ResourceDefine
     * @param id
     * @param name
     * @param type
     */
    SoftwareDefine = function (id, name, type, templateDefine) {
        ResourceDefine.call(this, id, name, type);
        this.installOrder = 0; //软件安装顺序
        this.templateDefine = templateDefine;
        this.properties = {
            "name": name,
            "type": null,
            "packageID": null,
            "description": null,
            "version": null,
            "oSType": null, //软件包适合的操作系统类型 （ 多个时）
            "packageType": null,
            "provider": null,
            "subFilePath": null,
            "destinationPath": null,

            "installCommands": null, //Ping {IP=value}{Port}{IP},
            "uninstallCommands": null,
            "startCommands": null,
            "stopCommands": null,

            "installParams": new ArrayList(), //{"IP":value,"Port":value}
            "uninstallParams": new ArrayList(),
            "startParams": new ArrayList(),
            "stopParams": new ArrayList()
        };
    };
    SoftwareDefine.prototype = new ResourceDefine();
    SoftwareDefine.prototype.constructor = SoftwareDefine;


    SoftwareDefine.prototype.getInstallOrder = function () {
        return this.installOrder;
    };

    SoftwareDefine.prototype.setInstallOrder = function (order) {
        this.installOrder = order;
    };
    /**
     * 根据resource属性，生成cell的属性
     */
    SoftwareDefine.prototype.genCellAttr = function () {
        var attrList = [];
        attrList.push({
            "name": "Name",
            "type": "String",
            "value": this.properties["name"]
        });
        attrList.push({
            "name": "PackageID",
            "type": "String",
            "value": this.properties["packageID"]
        });
        attrList.push({
            "name": "Description",
            "type": "String",
            "value": this.properties["description"]
        });
        attrList.push({
            "name": "Version",
            "type": "String",
            "value": this.properties["version"]
        });
        attrList.push({
            "name": "OSType",
            "type": "String",
            "value": this.properties["oSType"]
        });
        attrList.push({
            "name": "PackageType",
            "type": "String",
            "value": this.properties["packageType"]
        });
        attrList.push({
            "name": "Provider",
            "type": "String",
            "value": this.properties["provider"]
        });
        attrList.push({
            "name": "SubFilePath",
            "type": "String",
            "value": this.properties["subFilePath"]
        });

        attrList.push({
            "name": "InstallCommands",
            "type": "String",
            "value": this.properties["installCommands"]
        });
        attrList.push({
            "name": "UninstallCommands",
            "type": "String",
            "value": this.properties["uninstallCommands"]
        });
        attrList.push({
            "name": "StartCommands",
            "type": "String",
            "value": this.properties["startCommands"]
        });
        attrList.push({
            "name": "StopCommands",
            "type": "String",
            "value": this.properties["stopCommands"]
        });
        return attrList;
    };

    /**
     * 提取出命令中的参数，并传递到各Params ArrayList中
     */
    SoftwareDefine.prototype.init = function () {
        var properties = this.properties;
        for (var key in properties) {
            if (properties.hasOwnProperty(key) && /Commands/i.test(key)) {
                var command = properties[key];
                command = command ? command : "";
                var cmdParams = command.match(/(?!\{)[^\{\}]+(?=\})/g); //支持
                if (!cmdParams) {
                    continue;
                }
                for (var i = 0; i < cmdParams.length; i++) {
                    cmdParams[i] = cmdParams[i] + "";
                    var item = {
                        "name": cmdParams[i].trim(),
                        "value": null
                    };
                    if (/=/.test(cmdParams[i])) {
                        temp = cmdParams[i].split(/=/);
                        item["name"] = temp[0].trim();
                        item["value"] = cmdParams[i].substring(cmdParams[i].indexOf("=") + 1).trim(); //處理多等號的情況
                    }
                    if (/uninstall/.test(key)) { //installCommands
                        this.addUninstallParam(item["name"], item["value"]); //{"ip": null}
                    } else if (/install/.test(key)) { //uninstallCommands
                        this.addInstallParam(item["name"], item["value"]); //{"ip": null}
                    } else if (/start/.test(key)) { //startCommands
                        this.addStartParam(item["name"], item["value"]); //{"ip": null}
                    } else if (/stop/.test(key)) { //stopCommands
                        this.addStopParam(item["name"], item["value"]);
                    } else {
                        continue;
                    }
                }
            }
        }
    };

    /**
     * 获得vm名称与网卡名称的字符串
     * @param ref  ReferenceAttr对象
     * @return   Ref:[id, value]  $id.value ===>  $name.value
     */
    SoftwareDefine.prototype.refNicString = function (templatedef, ref) {
        var str = "";
        var resource = templatedef.getResourceById(ref.refId);
        if (resource && resource.type == "VmTemplate") {
            var nic = resource.getNic(ref.attrKey);
            str += resource.name + ".Nics." + nic.name + ".IP";
        }
        return str;
    };

    /**
     * 更新command中在key在值
     */
    SoftwareDefine.prototype.replaceCmdValue = function (command, key, value) {
        if (!command || !key) {
            return command;
        }
        // 匹配大括号的内容（包含大括号）
        var cmdParams = command.match(/(\{)[^\{\}]+(\})/g);
        if (!cmdParams) {
            return command;
        }
        // 用来标识当前匹配到command中的位置，以便找下一个key（考虑用户输入的key值可能重复的情况）
        var currentIndex = 0;
        for (var i = 0; i < cmdParams.length; i++) {
            cmdParams[i] = cmdParams[i] + "";
            var index = cmdParams[i].indexOf('=');
            var strKey = null;
            if (index > 0) {
                // 获取等号前面的key，要删除左括号
                strKey = cmdParams[i].substring(1, index).trim();
            } else {
                // 获取key，要删除两端空格以及大括号
                strKey = cmdParams[i].substring(1, cmdParams[i].length - 1).trim();
            }

            if (key != strKey) {
                continue;
            }

            // 找到要替换的key后，进行值替换
            index = command.indexOf(cmdParams[i], currentIndex);
            var strTemp = command.substring(0, index) + "{" + strKey;
            // 如果值无效，则等号也不添加
            if (value) {
                strTemp += " = " + value;
            }

            // 获取key值后面的内容，需要不全到command中。以大括号作为当前key结束符
            currentIndex = command.indexOf("}", index);
            command = strTemp + command.substring(currentIndex);
        }
        return command;
    };

    /**
     * 当修改了params中的值后，更新所有的命令字符串
     */
    SoftwareDefine.prototype.updateCommands = function (templatedef) {
        var properties = this.properties;
        for (var key in properties) {
            if (!properties.hasOwnProperty(key) || !/Commands/i.test(key)) {
                continue;
            }
            var command = properties[key];
            if (!command) {
                continue;
            }
            var cmdParams = command.match(/(?!\{)[^\{\}]+(?=\})/g); //支持 ping  {ip=127.0.0.1} {port}
            if (!cmdParams) {
                continue;
            }
            for (var i = 0; i < cmdParams.length; i++) {
                cmdParams[i] = cmdParams[i] + "";
                var item = {
                    "name": /=/.test(cmdParams[i]) ? cmdParams[i].split(/=/)[0].trim() : cmdParams[i].trim(),
                    "value": null
                };
                var value = null;
                var exp = null; //正則表達式
                if (/uninstall/.test(key)) { //installCommands
                    item["value"] = this.getUninstallParam(item["name"]); //{"ip": null}
                } else if (/install/.test(key)) { //uninstallCommands
                    item["value"] = this.getInstallParam(item["name"]); //{"ip": null}
                } else if (/start/.test(key)) { //startCommands
                    item["value"] = this.getStartParam(item["name"]); //{"ip": null}
                } else if (/stop/.test(key)) { //stopCommands
                    item["value"] = this.getStopParam(item["name"]);
                } else {
                    continue;
                }
                if (item["value"] && item["value"].type == Constant.REFERENCEATTRTYPE) {
                    item["value"] = "$" + this.refNicString(templatedef, item["value"]);
                }
                if (item["value"] && item["value"].type == Constant.PARAMETERDEFINETYPE) {
                    item["value"] = "$Parameters." + item["value"].properties.parameterName;
                }

                // 更新command
                command = this.replaceCmdValue(command, item["name"], item["value"]);
            }
            this.properties[key] = command;
        }
    };

    /**
     * 返回该软件是否有可引用的参数
     * @return 返回是否有参数可引用
     */
    SoftwareDefine.prototype.isRefParamBySoftware = function () {
        if (this.isRefParamByList(this.properties.installParams.properties) == true) {
            return true;
        }
        if (this.isRefParamByList(this.properties.uninstallParams.properties) == true) {
            return true;
        }
        if (this.isRefParamByList(this.properties.startParams.properties) == true) {
            return true;
        }
        if (this.isRefParamByList(this.properties.stopParams.properties) == true) {
            return true;
        }
        return false;
    };

    /**
     * 返回该参数列表是否有可用的参数
     * @param params 参数列表
     * @return 返回是否有参数可引用
     */
    SoftwareDefine.prototype.isRefParamByList = function (params) {
        for (var item in params) {
            if (!params.hasOwnProperty(item)) {
                continue;
            }
            if (params[item] == null || params[item] == "") {
                return true;
            }
        }
        return false;
    }


    /**
     * 由于软件资源的Json 只嵌套在VmTemplate中，故特殊处理
     * @return
     */
    SoftwareDefine.prototype.toJson = function () {
        var templateDefine = this.templateDefine;
        //存放容器中所有Instance资源    key为VM的ID,value为Instance
        var instances = new ArrayList();
        //获得容器所有资源
        var resources = templateDefine.getResources().properties;
        //将Instance类型的资源存放到Instance列表中
        for (var item in resources) {
            var resource = resources[item];
            //判断是不是Instance类型
            if (resource.type == "Instance" && resource.properties.vmTemplate.refId != null) {
                instances.add(resource.properties.vmTemplate.refId, resource);
                continue;
            }
        }

        var json = "{";
        json += this.fullString("Id") + ":" + this.fullString(this.id);
        json += ",";
        var properties = this.properties;
        for (var key in properties) {
            if (key == "installParams" || key == "uninstallParams" || key == "startParams" || key == "stopParams") {
                json += this.fullString(this.firstUpper(key)) + ":" + "[[";
                var params = properties[key].properties;
                for (var i in params) {
                    if (params.hasOwnProperty(i)) {
                        var param = params[i];
                        json += "{";
                        json += "\"" + this.convertCharToJsonFormat(i) + "\"" + ":";
                        if (param && param.type == Constant.REFERENCEATTRTYPE) {
                            var resource = templateDefine.getResourceById(param.refId);
                            if (resource && resource.type == "VmTemplate") {
                                var nic = resource.getNic(param.attrKey);
                                var instance = instances.get(resource.id);
                                json += "{\"Ref\":[\"" + instance.id + "\",\"Nics." + (nic ? nic.name : "") + ".IP\"]}";
                            } else {
                                json += "\"\"";
                            }
                        } else if (param && param.type == Constant.PARAMETERDEFINETYPE) {
                            json += "{\"Ref\":[\"Parameters\",\"" + param.properties.parameterName + "\"]}";
                        } else {
                            json += "\"" + this.convertCharToJsonFormat(param) + "\"";
                        }
                        json += "},";
                    }
                }
                json = this.trimComma(json);
                json += "]]";
                json += ",";
            } else {
                json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                json += ",";
            }
        }
        json = this.trimComma(json);

        json += "}";
        return json;
    };

    SoftwareDefine.prototype.getInstallParams = function () {
        installParams = this.properties["installParams"];
        if (!installParams) {
            installParams = new ArrayList();
            this.setInstallParams(installParams);
        }
        return installParams;
    };
    SoftwareDefine.prototype.setInstallParams = function (installParams) {
        this.prototype["installParams"] = installParams;
    };
    /**
     * 增加安装命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.addInstallParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getInstallParams().add(key, value);
    };

    /**
     * 删除安装命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.delInstallParam = function (key) {
        if (!key) {
            return false;
        }
        return this.getInstallParams().del(key);
    };

    /**
     * 获取安装命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.getInstallParam = function (key) {
        if (!key) {
            return null;
        }
        return this.getInstallParams().get(key);
    };

    /**
     * 更新安装命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.updateInstallParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getInstallParams().update(key, value);
    };


    SoftwareDefine.prototype.getUninstallParams = function () {
        uninstallParams = this.properties["uninstallParams"];
        if (!uninstallParams) {
            uninstallParams = new ArrayList();
            this.setUninstallParams(uninstallParams);
        }
        return uninstallParams;
    };
    SoftwareDefine.prototype.setUninstallParams = function (uninstallParams) {
        this.prototype["uninstallParams"] = uninstallParams;
    };
    /**
     * 增加卸载命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.addUninstallParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getUninstallParams().add(key, value);
    };

    /**
     * 删除卸载命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.delUninstallParam = function (key) {
        if (!key) {
            return false;
        }
        return this.getUninstallParams().del(key);
    };

    /**
     * 获取卸载命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.getUninstallParam = function (key) {
        if (!key) {
            return null;
        }
        return this.getUninstallParams().get(key);
    };

    /**
     * 更新卸载命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.updateUninstallParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getUninstallParams().update(key, value);
    };


    SoftwareDefine.prototype.getStartParams = function () {
        startParams = this.properties["startParams"];
        if (!startParams) {
            startParams = new ArrayList();
            this.setStartParams(startParams);
        }
        return startParams;
    };
    SoftwareDefine.prototype.setStartParams = function (startParams) {
        this.prototype["startParams"] = startParams;
    };
    /**
     * 增加启动命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.addStartParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getStartParams().add(key, value);
    };

    /**
     * 删除启动命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.delStartParam = function (key) {
        if (!key) {
            return false;
        }
        return this.getStartParams().del(key);
    };

    /**
     * 获取启动命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.getStartParam = function (key) {
        if (!key) {
            return null;
        }
        return this.getStartParams().get(key);
    };

    /**
     * 更新启动命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.updateStartParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getStartParams().update(key, value);
    };


    SoftwareDefine.prototype.getStopParams = function () {
        var stopParams = this.properties["stopParams"];
        if (!stopParams) {
            stopParams = new ArrayList();
            this.setStopParams(stopParams);
        }
        return stopParams;
    };
    SoftwareDefine.prototype.setStopParams = function (stopParams) {
        this.properties["stopParams"] = stopParams;
    };
    /**
     * 增加停止命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.addStopParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getStopParams().add(key, value);
    };

    /**
     * 删除停止命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.delStopParam = function (key) {
        if (!key) {
            return false;
        }
        return this.getStopParams().del(key);
    };

    /**
     * 获取停止命令参数
     * @param key
     * @return
     */
    SoftwareDefine.prototype.getStopParam = function (key) {
        if (!key) {
            return null;
        }
        return this.getStopParams().get(key);
    };

    /**
     * 更新停止命令参数
     * @param key
     * @param value
     * @return
     */
    SoftwareDefine.prototype.updateStopParam = function (key, value) {
        if (!key) {
            return false;
        }
        return this.getStopParams().update(key, value);
    };


    /**
     * 根据命令名称获得该命令下的参数列表
     * @param commandName 命令名称
     * @return
     */
    SoftwareDefine.prototype.getParamsByCommandName = function (commandName) {
        if (!commandName) {
            return false;
        }
        if (commandName == "install") {
            return this.getInstallParams();
        } else if (commandName == "uninstall") {
            return this.getUninstallParams();
        } else if (commandName == "start") {
            return this.getStartParams();
        } else if (commandName == "stop") {
            return this.getStopParams();
        } else {
            return null;
        }
    };

    /**
     * 创建软件资源实例static public
     * @param attributes 资源属性列表
     * @param typeName 资源类型名称
     * @param resourceName 资源名称
     * @param resourceId   资源ID  全局唯一
     * @return 端口组资源实例
     */
    SoftwareDefine.createResource = function (templateDefine, attributes, typeName, resourceName, resourceId) {
        var resource = new SoftwareDefine();
        resource.templateDefine = templateDefine;
        //添加ID、资源类型名称及名称
        resource.id = resourceId;
        resource.type = typeName;
        resource.name = resourceName;
        resource.properties["name"] = resourceName;
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            // 把首字母转成小写
            attr.name = attr.name.charAt(0).toLowerCase().concat(attr.name.substr(1));
            if (attr.name in resource.properties) {
                if (attr.name == "installCommands") {
                    resource.properties[attr.name] = attr.value;
                } else if (attr.name == "uninstallCommands") {
                    resource.properties[attr.name] = attr.value;
                } else if (attr.name == "startCommands") {
                    resource.properties[attr.name] = attr.value;
                } else if (attr.name == "stopCommands") {
                    resource.properties[attr.name] = attr.value;
                } else {
                    resource.properties[attr.name] = attr.value;
                }
            }
        }
        return resource;
    };

    OutputDefine = function (options) {
        options = typeof options == "undefined" ? {} : options;
        options.name = options.name == undefined ? null : options.name;
        options.value = options.value == undefined ? null : options.value;
        options.description = options.description == undefined ? null : options.description;
        this.type = "OutputDefine";
        this.properties = {
            "outputName": options.name,
            "value": options.value,
            "description": options.description
        };
    };
    OutputDefine.prototype = new AmeUtil();
    OutputDefine.prototype.constructor = OutputDefine;
    /**
     * 把要在页面上显示的属性转成数组
     * @return
     */
    OutputDefine.prototype.toArray = function () {
        return [this.properties.outputName, this.properties.value, this.properties.description];
    };
    /**
     * 获取输出参数名称
     * @return name
     */
    OutputDefine.prototype.getOutputName = function () {
        return this.properties["outputName"];
    };
    /**
     * 设置输出参数名称
     */
    OutputDefine.prototype.setOutputName = function (name) {
        this.properties["outputName"] = name;
    };
    /**
     * 获取输出参数值
     * @return value
     */
    OutputDefine.prototype.getValue = function () {
        return this.properties["value"];
    };

    /**
     * 设置输出参数值
     */
    OutputDefine.prototype.setValue = function (value) {
        this.properties["value"] = value;
    };

    /**
     * 获取描述
     * @return description
     */
    OutputDefine.prototype.getDescription = function () {
        return this.properties["description"];
    };
    /**
     * 设置描述
     */
    OutputDefine.prototype.setDescription = function (description) {
        this.properties["description"] = description;
    };
    /**
     * 将对象转换为Json
     * @return 转换成Json的字符串
     */
    OutputDefine.prototype.toJson = function (templateDefine, instances) {
        var properties = this.properties;
        var json = this.fullString(properties["outputName"]) + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "outputName") {} else if (key == "value") {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.isValueRefToJson(properties[key], templateDefine, instances);
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";
        return json;
    };

    /**
     * 空格不兼容，把空格替换成" "
     * @param value 要替换的值
     * @return
     */
    OutputDefine.prototype.replaceBlank = function(value){
        var temp = "";
        value = $.trim(value);
        for(var i=0,size = value.length; i < size; i++){
            if(value.charCodeAt(i)==32 || value.charCodeAt(i)==160){
                temp += " ";
            }else{
                temp += value.substring(i, i+1);
            }
        }
        return temp;
    };

    /**
     *  检查输出参数的值,是否符合要求
     *  @param value 要校验的字符串
     *  @param outPutList [["aaa", "bb"], ...] -- 表示有引用参数的情况
     *  @return false -- 表示校验不通过<BR>
     *          true -- 校验通过
     *
     */
    OutputDefine.prototype.splitOutputValueMarker = function (value, outPutList) {
        if (value == null || value == "") {
            return true;
        }

        // 去空格
        var index = 0;
        var tempIndex = 0;
        var nextIndex = 0;
        var markerCount = 0;
        while (markerCount < 2) {
            // 下一个井号的索引
            nextIndex = value.indexOf('#', tempIndex);
            // 后面没有#号
            if (nextIndex < 0) {
                // 没有再找到#号，退出循环
                break;
            }

            // 下一个分段
            tempIndex = nextIndex + 1;

            // 如果#好前面是 \ 杠，则此#表示转义，需要查找下一个
            var ch = value.charAt(nextIndex - 1);
            if (ch == '\\') {
                continue;
            }

            // 找到点号，计数加一
            markerCount ++;
            if (markerCount == 1) {
                // 第一个#号后面不可以有空格
                if (value.charAt(nextIndex + 1) == " ") {
                    return false;
                }
                // 设置第一个#号所在的位置
                index = nextIndex;
            } else if(markerCount == 2) {
                // 第二个#号前面不可以有空格
                if (ch == " ") {
                    return false;
                }
            }
        }

        // 对于#号前面在内容，也要保存到outputlist中
        if (index > 0) {
            if (outPutList != null){
                outPutList.push([value.substring(0,index)]);
            }
        }

        // 没有#号的情况
        if (markerCount == 0) {
            if (outPutList != null){
                outPutList.push([value]);
            }
            return true;
        }
        // 只有一个#的情况，返回false
        if (markerCount == 1) {
            return false;
        }

        // 有两个#好的情况，获取两个#号中间的内容
        var subValue = $.trim(value.substring(index + 1, nextIndex));
        // 判断是否符合 xxx.xxx的格式
        tempIndex = 0;
        var dotNextIndex = 0;
        var dotIndex = 0;
        var dotCount = 0;
        while (dotCount <= 1) {
            // 下一个井号的索引
            dotNextIndex = subValue.indexOf('.', tempIndex);
            // 检查tempIndex后是否有.号
            if (dotNextIndex <= 0) {
                // 如果点号的位置不正确
                if ((0 == dotIndex) || (dotIndex == subValue.length - 1)) {
                    return false;
                }

                // 判断是否需要输出list
                if (outPutList != null) {
                    outPutList.push([subValue.substring(0, dotIndex), subValue.substring(dotIndex + 1)]);
                }

                // 没有再找到点号，且符合要求，退出循环
                break;
            }

            // 下一个分段
            tempIndex = dotNextIndex + 1;

            // 如果#好前面是 \ 杠，则此#表示转义，需要查找下一个
            var ch = subValue.charAt(dotNextIndex - 1);
            if (ch == '\\') {
                continue;
            } else if (ch == " " || subValue.charAt(dotNextIndex + 1) == " ") {
                // 点号前后还可以有空格
                return false;
            }

            // 找到点号，计数加一
            dotCount ++;
            dotIndex = dotNextIndex;
        }

        // 如果不只一个dot，返回false
        if (dotCount != 1) {
            return false;
        }

        // 递归
        return this.splitOutputValueMarker(value.substring(nextIndex + 1), outPutList);
    };

    /**
     *判断value是否引用公共参数或网卡并生成对应的json
     */
    OutputDefine.prototype.isValueRefToJson = function (value, templateDefine, instances) {
        var dataList = [];
        if(!this.splitOutputValueMarker(value, dataList) || (dataList.length == 1 && dataList[0].length == 1)){
            return this.fullString(value);
        }

        var json = "{\"Fn::Join\":[\"\",[";

        for (var i=0,size = dataList.length; i < size; i++) {
            if(dataList[i].length < 2){
                json += this.fullString(dataList[i][0]) + ",";
            }else {
                var v = dataList[i];
                v[0] = v[0].replace(/\\/g,"");
                v[1] = v[1].replace(/\\/g,"");
                v[0] = this.replaceBlank(v[0]);
                v[1] = this.replaceBlank(v[1]);
                var outRef = this.getOutputValueRef(templateDefine,v[0],v[1],instances);
                if(outRef && outRef.type == Constant.REFERENCEATTRTYPE){
                    json += "{\"Ref\":[" + this.fullString(outRef.refId) + "," + this.fullString("Nics." + outRef.attrKey + ".IP") + "]},";
                }else {
                    json += "{\"Ref\":[" + this.fullString(outRef) + "," + this.fullString(v[1]) + "]},";
                }
            }
        }
        json = this.trimComma(json);
        json += "]]}";
        return json;
    };
    /**
     *@param name 公共参数标识或虚拟机名称
     * @param value 公共参数key值或虚拟机网卡名称
     * @return naem 没有可引用的公共参数或网卡 ，Parameters 公共参数，
     *            resources[res].resourceId 虚拟机id
     */
    OutputDefine.prototype.getOutputValueRef = function (templateDefine, name, value, instances) {
        if (name == "Parameters") {
            var parameter = templateDefine.getParameterById(value);
            if (parameter) {
                return "Parameters";
            }
        }
        var resources = templateDefine.getResources().properties;
        for (var res in resources) {
            if (resources[res].type != "VmTemplate") {
                continue;
            }
            if (name != resources[res].name) {
                continue;
            }
            var instanceId = "";
            for (var i = 0; i < instances.length; i++) {
                if (instances[i].properties.vmTemplate.refId == resources[res].id) {
                    instanceId = instances[i].id;
                }
            }
            var nics = resources[res].getNics().properties;
            for (var nic in nics) {
                if (value != nics[nic].name) {
                    continue;
                }
                var ref = new ReferenceAttr({
                    "refId": instanceId,
                    "attrKey": value
                });
                return ref;
            }
        }
        return name;
    };

    ConnectionDefine = function (options) {
        options = typeof options == "undefined" ? {} : options;
        options.id = typeof options.id == undefined ? this.createId() : options.id;
        options.type = options.type == undefined ? null : options.type;
        options.from = options.from == undefined ? null : options.from;
        options.to = options.to == undefined ? null : options.to;
        this.id = options.id;
        this.type = "ConnectionDefine";
        // 是否为删除操作
        this.opAutoDel = null;
        this.connData = new ArrayList();
        this.properties = {
            "type": options.type,
            "from": options.from,
            "to": options.to
        };
    };
    ConnectionDefine.prototype = new AmeUtil();
    ConnectionDefine.prototype.constructor = ConnectionDefine;
    /**
     * 获取线的ID
     * @return connectionId
     */
    ConnectionDefine.prototype.getConnectionId = function () {
        return this.id;
    };
    /**
     * 设置线的ID
     */
    ConnectionDefine.prototype.setConnectionId = function (id) {
        this.id = id;
    };
    /**
     * 获取连线类型
     * @return type
     */
    ConnectionDefine.prototype.getType = function () {
        return this.properties["type"];
    };

    /**
     * 设置连线类型
     */
    ConnectionDefine.prototype.setType = function (type) {
        this.properties["type"] = type;
    };

    /**
     * 获取连线起点资源ID
     * @return to
     */
    ConnectionDefine.prototype.getFrom = function () {
        return this.properties["from"];
    };

    /**
     * 设置连线起点资源ID
     */
    ConnectionDefine.prototype.setFrom = function (from) {
        this.properties["from"] = from;
    };

    /**
     * 获取连线终点资源ID
     * @return description
     */
    ConnectionDefine.prototype.getTo = function () {
        return this.properties["to"];
    };

    /**
     * 设置连线终点资源ID
     */
    ConnectionDefine.prototype.setTo = function (to) {
        this.properties["to"] = to;
    };

    /**
     * 添加数据
     */
    ConnectionDefine.prototype.addConnData = function (srcKey, targetValue) {
        if (!srcKey) {
            return;
        }
        this.connData.add(srcKey, targetValue);
    };
    /**
     * 添加数据，用于vm->vm的连线
     *
     * @param srcKey targetVm的网卡名称
     * @param element {sid: xxx, group: yyy, cmd: kkk, status: "on/off"}
     */
    ConnectionDefine.prototype.addMultiData = function (srcKey, element) {
        if (!srcKey || !element) {
            return;
        }

        // 如果未定义status状态，则设置为on
        if (!element.status) {
            element.status = "on";
        }

        var list = this.connData.get(srcKey);
        if (list == null) {
            this.connData.add(srcKey, [element]);
            return;
        }

        var hasIn = false;
        for (var index in list) {
            var el = list[index];
            // 如果找到相等的key，则更新状态即可
            if (el.sId == element.sId && el.group == element.group && el.cmd == element.cmd) {
                if (element.status != null) {
                    el.status = element.status;
                }
                hasIn = true;
                break;
            }
        } // end for

        // 增加一个元素
        if (!hasIn) {
            list.push(element);
        }
    };
    /**
     * 删除数据，只有可见的数据才可以删除，用于vm->vm的连线
     *
     * @param srcKey targetVm的网卡名称
     * @param element {sid: xxx, group: yyy, cmd: kkk, status: on/off}
     * @param blLeftOne 是否至少保留一个记录
     */
    ConnectionDefine.prototype.delMultiData = function (srcKey, element, blLeftOne) {
        if (!srcKey || !element) {
            return;
        }
        var list = this.connData.get(srcKey);
        if (list == null) {
            return;
        }

        // 如果要保留至少一个记录，而记录数只有一个时，不应该再删除
        if (blLeftOne == true && this.connData.length() == 1 && list.length <= 1) {
            return;
        }

        // 计数所有可见的属性个数
        var onSize = 0;
        for (var key in this.connData.properties) {
            var tempList = this.connData.properties[key];
            for (var index in tempList) {
                if (tempList[index].status == "on") {
                    onSize++;
                    if (onSize > 1) {
                        break;
                    }
                }
            } // end for
            if (onSize > 1) {
                break;
            }
        }

        var deleteIndex = 0;
        for (var index = 0; index < list.length; index++) {
            var soft = list[index];
            if (soft.status == "on" && soft.sId == element.sId && soft.group == element.group && soft.cmd == element.cmd) {
                deleteIndex = index;
                break;
            }
        }

        // 判断是否可以删除
        if (!blLeftOne || onSize > 1) {
            list.splice(deleteIndex, 1);
        }

        // 如果为空列表,则删除key
        if (list.length <= 0) {
            this.connData.del(srcKey);
        }
    };
    /**
     * 删除数据，用于vm->vm的连线
     *
     * @param softwareId 更加软件的内容，删除保存在connection中的数据
     * @param status 状态, on/off
     */
    ConnectionDefine.prototype.modMultiDataBySoftId = function (softwareId, status) {
        if (!softwareId) {
            return;
        }

        for (var nicName in this.connData.properties) {
            var list = this.connData.properties[nicName];
            for (var index = 0; index < list.length; index++) {
                if (list[index].sId == softwareId) {
                    list[index].status = status;
                }
            }
        }
    };

    /**
     * 返回map
     */
    ConnectionDefine.prototype.getConnData = function () {
        return this.connData;
    };

    /**
     * 通过value来修改key的值
     */
    ConnectionDefine.prototype.changeKey = function (value, newKey) {
        if (!value || !newKey) {
            return;
        }
        for (var key in this.connData.properties) {
            if (value == this.connData.properties[key]) {
                this.connData.del(key);
                this.connData.add(newKey, value);
                break;
            }
        }
    };

    /**
     * 将对象转换为Json
     * @return 转换成Json的字符串
     */
    ConnectionDefine.prototype.toJson = function () {
        var properties = this.properties;
        var json = "{";
        json += this.fullString("Id") + ":" + this.fullString(this.id) + ",";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                json += ",";
            }
        }
        json = this.trimComma(json);
        json += "}";
        return json;
    };

    ParameterDefine = function (options) {
        options = typeof options == "undefined" ? {} : options;
        options.id = options.id == undefined ? null : options.id;
        options.name = options.name == undefined ? null : options.name;
        options.value = options.value == undefined ? null : options.value;
        options.description = options.description == undefined ? null : options.description;
        options.type = options.type == undefined ? null : options.type;
        options.rule = options.rule == undefined ? null : options.rule;
        this.referNumber = 0; // 重要，该公共参数被引用的次数。
        this.type = "ParameterDefine";
        this.properties = {
            "id": options.id,
            "parameterName": options.name,
            "defaultValue": options.value, // default是关键字，修改为defaultValue
            "description": options.description,
            "type": options.type,
            "rule": options.rule
        };
    };

    ParameterDefine.prototype = new AmeUtil();
    ParameterDefine.prototype.constructor = ParameterDefine;
    /**
     * 把要在页面上显示的属性转成数组
     * @return
     */
    ParameterDefine.prototype.toArray = function () {
        return [this.properties.parameterName, this.properties.type, this.properties.defaultValue,
            this.properties.description];
    };
    ParameterDefine.prototype.getParameterName = function () {
        return this.properties["parameterName"];
    };
    ParameterDefine.prototype.referNumAdded = function () {
        this.referNumber += 1;
    };
    ParameterDefine.prototype.referNumSub = function () {
        this.referNumber -= 1;
    };
    ParameterDefine.prototype.setParameterName = function (name) {
        this.properties["parameterName"] = name;
    };
    ParameterDefine.prototype.getType = function () {
        return this.properties["type"];
    };
    ParameterDefine.prototype.setType = function (type) {
        this.properties["type"] = type;
    };
    ParameterDefine.prototype.getDefaultValue = function () {
        return this.properties["defaultValue"];
    };
    ParameterDefine.prototype.setDefaultValue = function (value) {
        this.properties["defaultValue"] = value;
    };
    ParameterDefine.prototype.getDescription = function () {
        return this.properties["description"];
    };
    ParameterDefine.prototype.setDescription = function (description) {
        this.properties["description"] = description;
    };
    ParameterDefine.prototype.getRule = function () {
        return this.properties["rule"];
    };
    ParameterDefine.prototype.setRule = function (rule) {
        this.properties["rule"] = rule;
    };
    ParameterDefine.prototype.toJson = function () {
        var properties = this.properties;
        var json = this.fullString(properties["parameterName"]) + ":" + "{";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "parameterName" || key == "id") {} else if (key === "defaultValue") {
                    json += this.fullString(this.firstUpper("default")) + ":" + this.fullString(properties[key]);
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";
        return json;
    };

    TemplateUtils = new AmeUtil();
    TemplateDefine = function (options) {
        options = typeof options == "undefined" ? {} : options;
        options.id = options.id == undefined ? null : options.id;
        options.name = options.name == undefined ? null : options.name;
        options.version = options.version == undefined ? null : options.version;
        options.description = options.description == undefined ? null : options.description;
        this.id = options.id;
        this.resourceTypes = null;
        this.properties = {
            "name": options.name,
            "templateFormatVersion": options.version,
            "description": options.description,
            "parameters": null,
            "resources": null,
            "outputs": null,
            "connections": null
        };

        /**
         * 更新引用参数的引用个数
         * @param flagName 标识符，需要等于 "Parameters"，其他字符串则不处理
         * @param parameterName 参数的名称，从该名称可以取得参数对象
         */
        this.incParameterReferNum = function (flagName, parameterName) {
            // 有效性判断
            if ((!parameterName) || (flagName != "Parameters")) {
                return;
            }

            var parameterObj = this.getParameterById(parameterName);
            if (parameterObj) {
                parameterObj.referNumber++;
            }
        };

        /**
         * 反解析portgroup
         * @param resource 资源对象
         * @param jsonRes json对象
         * @return true/false
         */
        this.rebuildPortGroups = function (resource, jsonRes, isBuildGraph, coreGraph) {
            // 绘图
            var tempGraph = jsonRes.Graph;
            if (!tempGraph || !tempGraph.ParentID) {
                return false;
            }
            if (!tempGraph.Position.X || !tempGraph.Position.Y || !tempGraph.Size.W || !tempGraph.Size.H) {
                return false;
            }

            resource.setName(jsonRes.Properties.Name);
            resource.properties.description = jsonRes.Properties.Description;
            resource.properties.networkID = jsonRes.Properties.PortGroupID;
            if (isBuildGraph) {
                var portGroupCell = coreGraph.redrawResource(this, resource, tempGraph.ParentID, tempGraph.Position.X,
                    tempGraph.Position.Y, tempGraph.Size.W, tempGraph.Size.H, "Network");
                return portGroupCell;
            }
            return true;
        };

        /**
         * 反解析 Vmtemplates
         * @param resource 资源对象
         * @param jsonRes json对象
         * @param bodyObj 整个resources的json对象
         * @param vmConnectionList vm与vm的关联关系，待所有vmtemplate加载完成后，需要再次更新值的列表
         * @param isBuildGraph 是否绘图
         * @param coreGraph绘图对象
         * @return true/false
         */
        this.rebuildVmtemplates = function (resource, jsonRes, bodyObj, vmConnectionList, isBuildGraph, coreGraph) {
            var jsonResources = bodyObj.Resources;
            // 判断绘图对象是否存在，如果不存在，则无法进行绘图，直接返回
            var tempGraph = jsonRes.Graph;
            if (!tempGraph || !tempGraph.ParentID) {
                return false;
            }
            // 坐标不存在，则无法绘图
            if (!tempGraph.Position.X || !tempGraph.Position.Y || !tempGraph.Size.W || !tempGraph.Size.H) {
                return false;
            }
            resource.setName(jsonRes.Properties.Name);
            resource.properties.vmTemplateID = jsonRes.Properties.VmTemplateID;
            resource.properties.description = jsonRes.Properties.Description;
            resource.properties.oSType = jsonRes.Properties.OSType;
            resource.properties.oSVersion = jsonRes.Properties.OSVersion;
            resource.properties.vmTempateName = jsonRes.Properties.VmTempateName;

            // computerName 引用公共参数
            var tempObj = jsonRes.Properties.ComputerName;
            if (tempObj && tempObj.Ref) {
                resource.setComputerName(tempObj.Ref[1], true);
                this.incParameterReferNum(tempObj.Ref[0], tempObj.Ref[1]);
            } else {
                resource.setComputerName(tempObj, false);
            }
            // cpu 引用公共参数
            tempObj = jsonRes.Properties.CPU;
            if (tempObj.Ref) {
                resource.setCPU(tempObj.Ref[1], true);
                this.incParameterReferNum(tempObj.Ref[0], tempObj.Ref[1]);
            } else {
                resource.setCPU(tempObj, false);
                resource.oldCpu = tempObj;
            }

            // 内存引用公共参数
            tempObj = jsonRes.Properties.Memory;
            if (tempObj.Ref) {
                resource.setMemory(tempObj.Ref[1], true);
                this.incParameterReferNum(tempObj.Ref[0], tempObj.Ref[1]);
            } else {
                resource.setMemory(tempObj, false);
                resource.oldMemory = tempObj;
            }

            // 设置 nics
            tempObj = jsonRes.Properties.Nics;
            // 先清空老的数据
            resource.setNics(new ArrayList());
            for (var index = 0; index < tempObj.length; index++) {
                var nics = new Nic(tempObj[index].Name);
                nics.templateDefine = this;
                nics.vlb = tempObj[index].Vlb;
                var refObj = tempObj[index].NetworkID.Ref;
                nics.num = 0;
                // 引用
                if (refObj) {
                    nics.portGroupId.refId = refObj[0];
                    nics.portGroupId.attrKey = jsonResources[refObj[0]].Name;
                }

                // 设置是否为系统盘
                if (tempObj[index].SystemDefault == "true") {
                    nics.systemDefault = true;
                }

                resource.addNic(this.createId(), nics);
            }

            // 设置 Volumes
            tempObj = jsonRes.Properties.Volumes;
            resource.setVolumes(new ArrayList());
            for (var index = 0; index < tempObj.length; index++) {
                var v = new Volume(tempObj[index].Name, tempObj[index].Size, tempObj[index].AllocType, tempObj[index].AffectBySnapshot, tempObj[index].MediaType);
                v.templateDefine = this;
                if (tempObj[index].SystemDefault == "true") {
                    v.systemDefault = true;
                }
                resource.addVolume(this.createId(), v);
            }

            // 设置software
            tempObj = jsonRes.Properties.Softwares;
            for (var index = 0; index < tempObj.length; index++) {
                this.rebuildSoftWares(resource, tempObj[index], jsonResources, vmConnectionList, index, isBuildGraph);
            }

            // 设置虚拟机更新模式（自动|手动）
            tempObj = jsonRes.Properties.UpdateMode;
            resource.setUpdateMode(tempObj);

            tempObj = jsonRes.Properties.BlockHeatTranfer;
            resource.setBlockHeatTranfer(tempObj);
            // PostCommands
            tempObj = jsonRes.Properties.PostCommands;
            var size = tempObj.length;
            for (var index = size - 1; index >= 0; index--) {
                resource.addPostCommand(this.createId(), tempObj[index]);
            }

            // ReleaseCommands
            tempObj = jsonRes.Properties.ReleaseCommands;
            size = tempObj.length;
            for (var index = size - 1; index >= 0; index--) {
                resource.addReleaseCommand(this.createId(), tempObj[index]);
            }

            // StartCommands
            tempObj = jsonRes.Properties.StartCommands;
            size = tempObj.length;
            for (var index = size - 1; index >= 0; index--) {
                resource.addStartCommand(this.createId(), tempObj[index]);
            }

            // StopCommands
            tempObj = jsonRes.Properties.StopCommands;
            size = tempObj.length;
            for (var index = size - 1; index >= 0; index--) {
                resource.addStopCommand(this.createId(), tempObj[index]);
            }

            if (isBuildGraph) {
                var hasScalingGroup = resource.hasScalingGroup(bodyObj);
                var type = hasScalingGroup ? "ScalingGroup" : "VmTemplate";
                var vmTemplateCell = coreGraph.redrawResource(this, resource, tempGraph.ParentID, tempGraph.Position.X,
                    tempGraph.Position.Y, tempGraph.Size.W, tempGraph.Size.H, type);
                if (hasScalingGroup) {
                    var key = resource.getScalingGroup(bodyObj);
                    var resource = TemplateDefine.createResource(this, [], "ScalingGroup", jsonResources[key].Name, key);
                    this.rebuildScalingGroups(this, resource, jsonResources[key]);
                    vmTemplateCell.scalinggroup = resource;
                    vmTemplateCell.scalinggroupId = key;
                }
                coreGraph.addTemplateNodeOverlayStyle(vmTemplateCell);
                return vmTemplateCell;
            }
            return null;
        };

        /**
         * 反解析 ScalingGroup
         * @param resource 资源对象
         * @param jsonRes json对象
         * @param jsonResources 整个resources的json对象
         * @return true/false
         */
        this.rebuildScalingGroups = function (templateDef, resource, jsonRes) {
            // 判断绘图对象是否存在，如果不存在，则无法进行绘图，直接返回
            resource.setName(jsonRes.Properties.Name);
            resource.properties.name = jsonRes.Properties.Name;
            resource.properties.description = jsonRes.Properties.Description;
            resource.properties.maxSize = jsonRes.Properties.MaxSize;
            resource.properties.minSize = jsonRes.Properties.MinSize;
            resource.properties.desiredCapacity = jsonRes.Properties.DesiredCapacity;
            resource.properties.cooldown = jsonRes.Properties.Cooldown;

            var vmTemplate = jsonRes.Properties.VmTemplateID;
            if (vmTemplate != "") {
                var vmTemplateId = vmTemplate.Ref[0];
                resource.properties.vmTemplate.refId = vmTemplateId;
                resource.properties.vmTemplate.attrKey = "PhysicalID";
            }


            var tempObj = jsonRes.Properties.ScalingPolicies;
            resource.setScalingPolicies(new ArrayList());
            var id = null;
            for (var index = 0; index < tempObj.length; index++) {
                id = this.createId();
                var v = new ScalingPolicy(id, tempObj[index].Name, tempObj[index].Description, tempObj[index].MetricCondition, tempObj[index].Action);
                resource.addScalingPolicy(id, v);
            }

            // 把资源加入到template中
            templateDef.addResource(resource);
        };

        /**
         * 反解析 vmtemplate 下的software。内部函数，不进行判断处理了
         * @param resource vmtemplate资源对象
         * @param jsonSoftWareObj json对象
         * @param jsonResources 整个resources的json对象
         * @param vmConnectionList 关联关系需要再次更新值的列表
         * @param indexOrder 软件安装顺序
         * @return
         */
        this.rebuildSoftWares = function (resource, jsonSoftWareObj, jsonResources, vmConnectionList, indexOrder, isBuildGraph) {
            var s = new SoftwareDefine(jsonSoftWareObj.Id, jsonSoftWareObj.Name, (jsonSoftWareObj.Type || 'Software'));
            s.templateDefine = this;
            s.properties.name = jsonSoftWareObj.Name;
            s.properties.type = jsonSoftWareObj.Type;
            s.properties.packageID = jsonSoftWareObj.PackageID;
            s.properties.description = jsonSoftWareObj.Description;
            s.properties.version = jsonSoftWareObj.Version;
            s.properties.oSType = jsonSoftWareObj.OSType;
            s.properties.packageType = jsonSoftWareObj.PackageType;
            s.properties.provider = jsonSoftWareObj.Provider;
            s.properties.subFilePath = jsonSoftWareObj.SubFilePath;
            s.properties.destinationPath = jsonSoftWareObj.DestinationPath;
            s.properties.installCommands = jsonSoftWareObj.InstallCommands;
            s.properties.uninstallCommands = jsonSoftWareObj.UninstallCommands;
            s.properties.startCommands = jsonSoftWareObj.StartCommands;
            s.properties.stopCommands = jsonSoftWareObj.StopCommands;
            s.installOrder = indexOrder;

            var objs = jsonSoftWareObj.InstallParams;
            for (var i = 0; i < objs.length; i++) {
                var tempObjs = objs[i];
                for (var index = 0; index < tempObjs.length; index++) {
                    for (var cmdName in tempObjs[index]) {
                        var ref = tempObjs[index][cmdName].Ref;
                        // 普通参数
                        if (!ref) {
                            s.addInstallParam(cmdName, tempObjs[index][cmdName]);
                            continue;
                        }

                        // 引用公共参数
                        if (ref[0] == "Parameters") {
                            var parameterObj = this.getParameterById(ref[1]);
                            if (parameterObj) {
                                parameterObj.referNumber++;
                            }
                            s.addInstallParam(cmdName, parameterObj);
                            continue;
                        }

                        // 连线，关联关系 jsonResources[ref[0]] 指向的是instance的资源对象
                        var resId = jsonResources[ref[0]].Properties.VmTemplateID.Ref[0];
                        var rfAttr = new ReferenceAttr({
                            "refId": resId,
                            "attrKey": ref[1]
                        });
                        vmConnectionList.push([rfAttr, s.id, "install", cmdName, resource.id]);
                        s.addInstallParam(cmdName, rfAttr);
                    }
                }
            }

            objs = jsonSoftWareObj.UninstallParams;
            for (var i = 0; i < objs.length; i++) {
                var tempObjs = objs[i];
                for (var index = 0; index < tempObjs.length; index++) {
                    for (var cmdName in tempObjs[index]) {
                        var ref = tempObjs[index][cmdName].Ref;
                        // 普通参数
                        if (!ref) {
                            s.addUninstallParam(cmdName, tempObjs[index][cmdName]);
                            continue;
                        }

                        // 引用公共参数
                        if (ref[0] == "Parameters") {
                            var parameterObj = this.getParameterById(ref[1]);
                            if (parameterObj) {
                                parameterObj.referNumber++;
                            }
                            s.addUninstallParam(cmdName, parameterObj);
                            continue;
                        }

                        // 连线，关联关系 jsonResources[ref[0]] 指向的是instance的资源对象
                        var resId = jsonResources[ref[0]].Properties.VmTemplateID.Ref[0];
                        var rfAttr = new ReferenceAttr({
                            "refId": resId,
                            "attrKey": ref[1]
                        });
                        vmConnectionList.push([rfAttr, s.id, "uninstall", cmdName, resource.id]);
                        s.addUninstallParam(cmdName, rfAttr);
                    }
                }
            }

            objs = jsonSoftWareObj.StartParams;
            for (var i = 0; i < objs.length; i++) {
                var tempObjs = objs[i];
                for (var index = 0; index < tempObjs.length; index++) {
                    for (var cmdName in tempObjs[index]) {
                        var ref = tempObjs[index][cmdName].Ref;
                        // 普通参数
                        if (!ref) {
                            s.addStartParam(cmdName, tempObjs[index][cmdName]);
                            continue;
                        }

                        // 引用公共参数
                        if (ref[0] == "Parameters") {
                            var parameterObj = this.getParameterById(ref[1]);
                            if (parameterObj) {
                                parameterObj.referNumber++;
                            }
                            s.addStartParam(cmdName, parameterObj);
                            continue;
                        }

                        // 连线，关联关系。jsonResources[ref[0]] 指向的是instance的资源对象
                        var resId = jsonResources[ref[0]].Properties.VmTemplateID.Ref[0];
                        var rfAttr = new ReferenceAttr({
                            "refId": resId,
                            "attrKey": ref[1]
                        });
                        vmConnectionList.push([rfAttr, s.id, "start", cmdName, resource.id]);
                        s.addStartParam(cmdName, rfAttr);
                    }
                }
            }

            objs = jsonSoftWareObj.StopParams;
            for (var i = 0; i < objs.length; i++) {
                var tempObjs = objs[i];
                for (var index = 0; index < tempObjs.length; index++) {
                    for (var cmdName in tempObjs[index]) {
                        var ref = tempObjs[index][cmdName].Ref;
                        // 普通参数
                        if (!ref) {
                            s.addStopParam(cmdName, tempObjs[index][cmdName]);
                            continue;
                        }

                        // 引用公共参数
                        if (ref[0] == "Parameters") {
                            var parameterObj = this.getParameterById(ref[1]);
                            if (parameterObj) {
                                parameterObj.referNumber++;
                            }
                            s.addStopParam(cmdName, parameterObj);
                            continue;
                        }

                        // 连线，关联关系 jsonResources[ref[0]] 指向的是instance的资源对象
                        var resId = jsonResources[ref[0]].Properties.VmTemplateID.Ref[0];
                        var rfAttr = new ReferenceAttr({
                            "refId": resId,
                            "attrKey": ref[1]
                        });
                        vmConnectionList.push([rfAttr, s.id, "stop", cmdName, resource.id]);
                        s.addStopParam(cmdName, rfAttr);
                    }
                }
            }

            resource.addSoftware(s.id, s);
        };

    };

    /**
     * TemplateDefine
     */
    TemplateDefine.prototype = new AmeUtil();
    TemplateDefine.prototype.constructor = TemplateDefine;

    TemplateDefine.prototype.getTemplateName = function () {
        return this.properties["name"];
    };
    TemplateDefine.prototype.setTemplateName = function (name) {
        this.properties["name"] = name;
    };
    TemplateDefine.prototype.getTemplateFormatVersion = function () {
        return this.properties["templateFormatVersion"];
    };
    TemplateDefine.prototype.setTemplateFormatVersion = function (version) {
        this.properties["templateFormatVersion"] = version;
    };
    TemplateDefine.prototype.getDescription = function () {
        return this.properties["description"];
    };
    TemplateDefine.prototype.setDescription = function (description) {
        this.properties["description"] = description;
    };
    TemplateDefine.prototype.getParameters = function () {
        var parameters = this.properties["parameters"];
        if (!parameters) {
            parameters = new ArrayList();
            this.properties["parameters"] = parameters;
        }
        return parameters;
    };
    TemplateDefine.prototype.setParameters = function (parameters) {
        this.properties["parameters"] = parameters;
    };
    TemplateDefine.prototype.getParameterById = function (id) {
        if (!id) {
            return null;
        }
        return this.getParameters().get(id);
    };
    TemplateDefine.prototype.addParameter = function (parameter) {
        if (!parameter) {
            return false;
        }
        return this.getParameters().add(parameter.getParameterName(), parameter);
    };
    /**
     * 删除一个参数
     * @param {Object} parameter
     *          当为string时表示 parametername ,当为object时表示 ParameterDefine
     */
    TemplateDefine.prototype.delParameter = function (parameter) {
        if (!parameter) {
            return false;
        }
        parameter = (typeof parameter == "string" ? new ParameterDefine({
            "name": parameter
        }) : parameter);
        if (parameter.referNumber > 0) { // 如果存在引用则不能删除
            return false;
        }
        return this.getParameters().del(parameter.getParameterName());
    };

    /**
     * 更新公共参数
     */
    TemplateDefine.prototype.updateParameterById = function (parameter) {
        if (!parameter || parameter.type != Constant.PARAMETERDEFINETYPE) {
            return false;
        }
        return this.getParameters().update(parameter.getParameterName(), parameter);
    };

    TemplateDefine.prototype.getResources = function () {
        var resources = this.properties["resources"];
        if (!resources) {
            resources = new ArrayList();
            this.setResources(resources);
        }
        return resources;
    };
    /**
     * 获取资源的总数量
     */
    TemplateDefine.prototype.getResourcesNum = function () {
        var resourcesNum = 0;
        var resources = this.properties["resources"];
        if (resources) {
            resourcesNum += resources.length();
            resources = resources.properties
            for (var i in resources) {
                if (resources[i].type != "VmTemplate") {
                    continue;
                }
                var softwares = resources[i].getSoftwares();
                if (!softwares) {
                    continue;
                }
                resourcesNum += softwares.length();
            }
        }
        return resourcesNum;
    };

    TemplateDefine.prototype.setResources = function (resources) {
        this.properties["resources"] = resources;
    };

    TemplateDefine.prototype.getResourceById = function (id) {
        if (!id) {
            return null;
        }
        return this.getResources().get(id);
    };

    TemplateDefine.prototype.getResourceByName = function (name) {
        if (!name) {
            return null;
        }
        var resources = this.getResources().properties;
        for (var i in resources) {
            if (name == resources[i].name) {
                return resources[i];
            }
        }
        return null;
    };

    /**
     * 判断资源名称是否已经存在。id和type两个参数中是二选一
     * @param {Object} name 资源名称
     * @param {Object} id 资源的id
     * @param {Object} type 资源的类型
     */
    TemplateDefine.prototype.isExistResourceName = function (name, id, type) {
        // 通过组合id来查询
        var resources = this.getResources().properties;
        if (id) {
            var resource = this.getResourceById(id);
            if (!name || !resource) {
                return false;
            }
            for (var i in resources) {
                if (resources.hasOwnProperty(i)) {
                    if (name == resources[i].name && id != resources[i].id && resources[i].type == resource.type) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 通过组合type来查询
        if (type) {
            for (var i in resources) {
                if (resources.hasOwnProperty(i)) {
                    if (name == resources[i].name && type == resources[i].type) {
                        return true;
                    }
                }
            }
            return false;
        }

        // id和tpe都是为null，则是使用名称来对比
        for (var i in resources) {
            if (resources.hasOwnProperty(i)) {
                if (name == resources[i].name) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * 添加资源到资源列表中
     */
    TemplateDefine.prototype.addResource = function (resource) {
        if (!resource) {
            return false;
        }
        return this.getResources().add(resource.id, resource);
    };
    /**
     * 在资源列表中删除资源
     * @param {Object} resource 当为string时表示 resource的id， 否则表示一个资源对象
     */
    TemplateDefine.prototype.delResource = function (resource) {
        if (!resource) {
            return false;
        }
        resource = (typeof resource == "string" ? new ResourceDefine(resource, "", "") : resource);
        return this.getResources().del(resource.id);
    };

    /**
     * 根据资源类型获得资源集合
     * @return
     */
    TemplateDefine.prototype.getResourcesByType = function (type) {
        var resources = this.getResources().properties;
        var rs = [];
        for (var key in resources) {
            if (resources.hasOwnProperty(key)) {
                if (type == resources[key].type) {
                    rs.push(resources[key]);
                }
            }
        }
        return rs;
    };
    /**
     * 获取资源类型
     * @return outputs
     */
    TemplateDefine.prototype.getResourceTypes = function () {
        var resourceTypes = this.resourceTypes;
        if (!resourceTypes) {
            resourceTypes = new ArrayList();
            this.resourceTypes = resourceTypes;
        }
        return resourceTypes;
    };
    /**
     * 根据SoftwareKey获得vm
     * @param softwareKey
     * @return
     */
    TemplateDefine.prototype.getVmBySoftware = function (softwareKey) {
        vms = this.getResourcesByType("VmTemplate");
        if (vms) {
            for (var i in vms) {
                var sft = vms[i].getSoftware(softwareKey);
                if (sft) {
                    return vms[i];
                }
            }
        }
        return null;
    };
    /**
     * 设置资源类型列表
     */
    TemplateDefine.prototype.setResourceTypes = function (resourceTypes) {
        this.resourceTypes = resourceTypes;
    };
    /**
     * 根据资源类型名称获取资源类型
     * @return resourceType
     */
    TemplateDefine.prototype.getResourceTypeById = function (id) {
        if (!id) {
            return null;
        }
        return this.getResourceTypes().get(id);
    };
    /**
     * 添加资源类型到资源类型列表中
     */
    TemplateDefine.prototype.addResourceType = function (resourceType) {
        // 判断属性是否为ResourceType对象，如果是才添加
        if (!resourceType) {
            return false;
        }
        return this.getResourceTypes().add(resourceType.getTypeName(), resourceType);
    };

    /**
     * 在资源类型列表中删除资源类型
     */
    TemplateDefine.prototype.delResourceType = function (resourceType) {
        if (!resourceType) {
            return false;
        }
        resourceType = (typeof resourceType == "string" ? new ResourceTypeDefine({
            "type": resourceType
        }) : resourceType);
        return this.getResourceTypes().del(resourceType.type);
    };
    /**
     * 获取输出参数列表
     * @return outputs
     */
    TemplateDefine.prototype.getOutputs = function () {
        var outputs = this.properties["outputs"];
        if (!outputs) {
            outputs = new ArrayList();
            this.setOutputs(outputs);
        }
        return outputs;
    };
    /**
     * 设置输出参数列表
     */
    TemplateDefine.prototype.setOutputs = function (outputs) {
        this.properties["outputs"] = outputs;
    };
    /**
     * 根据输出参数名称获取输出参数
     * @return output
     */
    TemplateDefine.prototype.getOutputById = function (id) {
        if (!id) {
            return null;
        }
        return this.getOutputs().get(id);
    };
    /**
     * 添加输出参数到输出参数列表中
     */
    TemplateDefine.prototype.addOutput = function (output) {
        if (!output || output.type != Constant.OUTPUTDEFINETYPE) {
            return false;
        }
        return this.getOutputs().add(output.getOutputName(), output);
    };

    /**
     * 在输出参数列表中删除输出参数
     */
    TemplateDefine.prototype.delOutput = function (output) {
        if (!output) {
            return false;
        }
        output = (typeof output == "string" ? new OutputDefine({
            "name": output
        }) : output);
        return this.getOutputs().del(output.getOutputName());
    };

    /**
     * 更新输出参数
     */
    TemplateDefine.prototype.updateOutputById = function (output) {
        if (!output || output.type != Constant.OUTPUTDEFINETYPE) {
            return false;
        }
        return this.getOutputs().update(output.getOutputName(), output);
    };

    /**
     * 判断是否引用虚拟机网卡或公共参数
     * @param name （虚拟机名称/公共参数标志'Parameters'）
     * @param value 引用的值（网卡名称/公共参数名称）
     * @return null 引用的值不存在 ，parameter 引用公共参数 ，resource[res] 引用网卡
     */
    TemplateDefine.prototype.isOutputValueRef = function (name, value) {
        if (name == "Parameters") {
            var parameter = this.getParameterById(value);
            if (parameter) {
                return parameter;
            }
        }
        // 获得所有虚拟机
        var vmResources = this.getResourcesByType("VmTemplate");
        var resources = this.properties.resources;
        var connections = this.properties.connections;
        resources = resources != null ? resources.properties : {};
        connections = connections != null ? connections.properties : {};

        for (var i = 0, size = vmResources.length; i < size; i++) {
            if (vmTemplateIsRefByScalingGroup(vmResources[i].id, connections, resources)) {
                return null;
            }
            var nics = vmResources[i].getNics().properties;
            for (var nic in nics) {
                return vmResources[i];
            }
        }
        return null;
    };
    /**
     * 判断输出参数值是是否引用虚拟机网卡或公共参数
     * @param value 输出参数值
     */
    TemplateDefine.prototype.checkoutOutputValue = function (value) {
        var dataList = [];
        for (var i = 0, size = dataList.length; i < size; i++) {
            if (dataList[i].length < 2) {
                continue;
            }
            var v = dataList[i];
            v[0] = v[0].replace(/\\/g, "");
            v[1] = v[1].replace(/\\/g, "");
            var outRef = this.isOutputValueRef(v[0], v[1]);
            if ((outRef && outRef.type == "VmTemplate") || (outRef && outRef.type == Constant.PARAMETERDEFINETYPE)) {
                continue;
            }
            return true;
        }
        return false;
    };
    /**
     * 校验所有输出参数值的引用是否正确
     */
    TemplateDefine.prototype.checkoutOutputValues = function () {
        var values = this.getOutputs().properties;
        if (!values) {
            return null;
        }
        for (var val in values) {
            if (this.checkoutOutputValue(values[val].properties.value)) {
                return values[val].properties.outputName;
            }
        }
        return null;
    };
    /**
     * 获取连线列表
     * @return connections
     */
    TemplateDefine.prototype.getConnections = function () {
        var connections = this.properties["connections"];
        if (!connections) {
            connections = new ArrayList();
            this.setConnections(connections);
        }
        return connections;
    };

    /**
     * 根据源id和目的id获取连线。源ID和目的ID都是可选的
     * 当 from 和 to 都输入时，功能等于getConnectionByFromIdAndToId
     * 当 from 和 to 都未输入时，功能等于 getConnections
     */
    TemplateDefine.prototype.getConnsByResId = function (from, to) {
        // 两者都定义了，则返回特定的id
        if (from && to) {
            return this.getConnectionByFromIdAndToId(from, to);
        }

        // 两者都没有定义，则返回所有，是一个数组
        var conns = this.getConnections().properties;
        if (!from && !to) {
            return conns;
        }

        var connsList = [];
        for (var index in conns) {
            if (from && conns[index].getFrom() == from) {
                connsList.push(conns[index]);
            } else if (to && conns[index].getTo() == to) {
                connsList.push(conns[index]);
            }
        }
        return connsList;
    };

    /**
     * 根据连线的起始ID和目标ID找到连线
     * @param fromId 起始ID
     * @param toId 目标ID
     * @return
     */
    TemplateDefine.prototype.getConnectionByFromIdAndToId = function (fromId, toId) {
        var connections = this.getConnections().properties;
        if (!connections) {
            return null;
        }
        var connection = null;

        for (var item in connections) {
            if (connections.hasOwnProperty(item) && connections[item].properties.from == fromId && connections[item].properties.to == toId) {
                connection = connections[item];
                break;
            }
        }
        return connection;
    };

    /**
     * 设置连线列表
     */
    TemplateDefine.prototype.setConnections = function (connections) {
        this.properties["connections"] = connections;
    };
    /**
     * 根据线的ID获取连线
     * @return connections
     */
    TemplateDefine.prototype.getConnectionById = function (id) {
        if (!id) {
            return null;
        }
        return this.getConnections().get(id);
    };
    /**
     * 添加连线到连线列表中
     */
    TemplateDefine.prototype.addConnection = function (connection) {
        if (!connection || connection.type != Constant.CONNECTIONDEFINETYPE) {
            return false;
        }
        return this.getConnections().add(connection.getConnectionId(), connection);
    };
    /**
     * 在连线列表中删除连线
     */
    TemplateDefine.prototype.delConnection = function (connection) {
        if (!connection) {
            return false;
        }
        connection = (typeof connection == "string" ? new ConnectionDefine({
            "id": connection
        }) : connection);
        return this.getConnections().del(connection.id);
    };
    TemplateDefine.prototype.generateResourceGraph = function (coreGraph) {
        var cells = coreGraph.model.cells;
        for (var index in cells) {
            var cell = cells[index];
            if (cell.resourceId) {
                var resource = this.getResourceById(cell.resourceId);
                if (resource && cell.geometry && (resource.type !== "Software" && resource.type !== "Script")) {
                    var graphDefine = resource.graph;
                    if (!graphDefine) {
                        graphDefine = new GraphDefine();
                    }
                    var position = graphDefine.position;
                    if (!position) {
                        position = new PositionDefine();
                    }
                    position.x = parseInt(cell.geometry.x);
                    position.y = parseInt(cell.geometry.y);
                    var size = graphDefine.size;
                    if (!size) {
                        size = new SizeDefine();
                    }
                    size.w = parseInt(cell.geometry.width);
                    size.h = parseInt(cell.geometry.height);
                    graphDefine.position = position;
                    graphDefine.size = size;
                    if (cell.parent) {
                        graphDefine.parentID = cell.parent.id;
                    }
                    resource.graph = graphDefine;
                }
            }
        }
    };
    /**
     * 反解析入口
     *
     * @param body
     * @param body 反解析需要的json字符串/也可以是已经生成好的json对象
     * @param isBuildGraph
     *                    是否需要画图。
     *                    如果只是解析模板时，isBuildGraph为false，如果要在画布上画图，则为true
     * @return true/false 表示是否进行了反解析
     */
    TemplateDefine.prototype.rebuildGraph = function (body, isBuildGraph, coreGraph) {
        // 如果传入的 templateBody字符串为空字符串等，则直接返回
        if (!body) {
            return false;
        }

        // 将json转换为对象
        var bodyObj = undefined;
        try {
            bodyObj = JSON.parse(body);
        } catch (e) {
            // 不需要处理异常，后面会进行对bodyObj判断
        }
        // 对象初始化失败，则要返回
        if (!bodyObj) {
            return false;
        }
        this.setTemplateName(bodyObj.name);
        this.properties["icon"] = bodyObj.Icon;
        // 设置版本号
        this.setTemplateFormatVersion(bodyObj.TemplateFormatVersion);

        // 增加parameter的内容
        for (var name in bodyObj.Parameters) {
            this.addParameter(new ParameterDefine({
                "id": undefined,
                "name": name,
                "value": bodyObj.Parameters[name].Default,
                "description": bodyObj.Parameters[name].Description,
                "type": bodyObj.Parameters[name].Type,
                "rule": bodyObj.Parameters[name].Rule
            }));
        }

        // 增加output的内容
        for (var name in bodyObj.Outputs) {
            var value = bodyObj.Outputs[name].Value;
            var str = "";
            // value如果是对象转换成字符串
            if (value && (typeof value != "string")) {
                value = value["Fn::Join"][1];
                for (var val in value) {
                    if (typeof value[val] == "string") {
                        str += value[val];
                    } else {
                        if (bodyObj.Resources) {
                            value[val].Ref[0] = value[val].Ref[0];
                            value[val].Ref[1] = value[val].Ref[1];
                            var resource = bodyObj.Resources[value[val].Ref[0]];
                            if (resource) {
                                value[val].Ref[0] = resource.Properties["Name"].replace(/#/g, "\\#");
                                value[val].Ref[0] = value[val].Ref[0].replace(/\./g, "\\.");
                                var index = value[val].Ref[1].indexOf(".");
                                var lastIndex = value[val].Ref[1].lastIndexOf(".");
                                value[val].Ref[1] = value[val].Ref[1].substring(index + 1, lastIndex);
                                value[val].Ref[1] = value[val].Ref[1].replace(/#/g, "\\#");
                                value[val].Ref[1] = value[val].Ref[1].replace(/\./g, "\\.");
                            }
                        }
                        str += "#" + value[val].Ref[0] + "." + value[val].Ref[1] + "#";
                    }
                }
                value = str;
            }
            this.addOutput(new OutputDefine({
                "name": name,
                "value": value,
                "description": bodyObj.Outputs[name].Description
            }));
        }

        // Resources 的内容
        var vmConnectionList = [];
        var resourceCells = [];
        for (var resourceId in bodyObj.Resources) {
            var jsonResource = bodyObj.Resources[resourceId];
            var typeName = jsonResource.Type;
            // type都是类似于GM::xxx的字段，所以用typeName.substring(4)取出type名称
            typeName = (typeof typeName != "undefined") ? typeName.substring(4) : undefined;

            // 创建资源，如果是 typeName == "Instance"，则返回是null，不需要处理
            var resource = TemplateDefine.createResource(this, [], typeName, jsonResource.Name, resourceId);
            if (resource == null) {
                continue;
            }

            // 重新绘画PortGroup
            if (resource.type == "Network") {
                resourceCell = this.rebuildPortGroups(resource, jsonResource, isBuildGraph, coreGraph);
                if (!!resourceCell) {
                    resourceCells.push(resourceCell);
                }
            }

            // 重新绘画vmTemplate
            if (resource.type === "VmTemplate") {
                resourceCell = this.rebuildVmtemplates(resource, jsonResource,
                    bodyObj, vmConnectionList, isBuildGraph, coreGraph);
                if (!!resourceCell) {
                    resourceCells.push(resourceCell);
                }
            }

        }

        // 所有资源加载完成之后，更新 vmConnectionList，以更新网卡的引用个数
        for (var index in vmConnectionList) {
            var attrs = vmConnectionList[index];
            var resource = this.getResourceById(attrs[0].refId);
            // nicName的内容固定为： Nics.<nic.name>.IP
            var nicName = attrs[0].attrKey.substring(5, attrs[0].attrKey.length - 3);
            // 重新设置 attrKey 为网卡的id号
            attrs[0].attrKey = resource.getNicKeyByName(nicName);
            attrs[0].attrName = nicName;
            // 把网卡名称保存起来
            attrs.push(nicName);

            // 通过ID号，取得网卡对象，并更新引用个数
            var nicObj = resource.getNic(attrs[0].attrKey);
            nicObj.num++;
        }

        var connectionCells = [];
        // Connection 的内容
        for (var connIndex in bodyObj.Connections) {
            var jsonConnection = bodyObj.Connections[connIndex];
            var connection = new ConnectionDefine({
                "type": jsonConnection.Type,
                "id": jsonConnection.Id,
                "from": jsonConnection.From,
                "to": jsonConnection.To
            });

            // 需要修改connection的connData的内容
            var srcResource = this.getResourceById(connection.getFrom());
            var targetResource = this.getResourceById(connection.getTo());
            if (targetResource.type == "Network") {
                // vm-->portgroup
                var nics = srcResource.properties.nics.properties;
                for (var index in nics) {
                    var nic = nics[index];
                    if (nic && nic.portGroupId.refId == targetResource.id) {
                        connection.addConnData(nic.name, targetResource.id);
                        break;
                    }
                }
            } else if (targetResource.type == "VmTemplate" && srcResource.type == "ScalingGroup") {
                // ScalingGroup-->vm
                var scalinggroup = srcResource.properties;
                if (scalinggroup.vmTemplate.refId == targetResource.id) {
                    connection.addConnData(scalinggroup.name, targetResource.id);
                }
            } else if (targetResource.type == "VmTemplate" && srcResource.type != "ScalingGroup") {
                for (var index in vmConnectionList) {
                    // 保存的内容：[rfAttr, s.id, "install", cmdName, resource.id, nicName]
                    var attrs = vmConnectionList[index];
                    if (attrs[0].refId == targetResource.id && attrs[4] == srcResource.id) {
                        // 此connection是vm->vm连线的connection
                        connection.addMultiData(attrs[5], {
                            "sId": attrs[1],
                            "group": attrs[2],
                            "cmd": attrs[3]
                        });
                    }
                }
            }
            // 添加连线资源
            this.addConnection(connection);
            // 创建图元
            if (isBuildGraph) {
                var connectionCell = coreGraph.redrawEdge(connection, srcResource, targetResource);
                if (!!connectionCell) {
                    connectionCells.push(connectionCell);
                }
            }
        }

        // 如果只是解析模板时，isBuildGraph为false，如果要在画布上画图，则为true
        if (isBuildGraph) {
            // 将多个cell添加到画布中去
            coreGraph.addCells2(resourceCells, connectionCells);
        }
        // 清空内容
        vmConnectionList = null;
        // 返回正常解析
        return true;
    };

    /**
     * 删除虚拟机对应Cell的资源
     * @param cell
     * @returns {boolean}
     */
    TemplateDefine.prototype.removeVMTemplateResource = function (cell) {
        if (!cell) {
            return false;
        }
        var resource = this.getResourceById(cell.resourceId);
        if (!resource) {
            return false;
        }
        // 首先删除所有依赖于虚拟机的关联数据
        var edges = this.getConnsByResId(cell.resourceId);
        // 循环每一条依赖自身的连线
        for (var i = 0; i < edges.length; i++) {
            this.delConnection(edges[i]);
        }
        this.delResource(cell.resourceId);
        this.delResource(cell.scalinggroupId);
    };

    /**
     * 删除网络对应Cell的资源
     * @param cell
     * @returns {boolean}
     */
    TemplateDefine.prototype.removeNetworkResource = function (cell) {
        if (!cell) {
            return false;
        }
        var resource = this.getResourceById(cell.resourceId);
        if (!resource) {
            return false;
        }
        // 首先删除所有依赖于网络的关联数据
        var edges = this.getConnections(cell, cell.getParent()).properties;
        var conn = null;
        var fromId = null;
        var toId = null;
        for (var key in edges) {
            if (edges.hasOwnProperty(key)) {
                conn = edges[key];
                fromId = conn.properties.from;
                toId = conn.properties.to;
                if (!conn || toId !== resource.id) {
                    continue;
                }
                //删除连线
                this.getConnections().del(key);

                // 依赖自身的资源
                var fromSource = this.getResourceById(fromId);
                // 判断依赖自身资源类型，如果为虚拟机
                if (fromSource && fromSource.type === "VmTemplate") {
                    var nics = fromSource.properties.nics.properties;
                    for (var item in nics) {
                        if (!nics.hasOwnProperty(item)) {
                            continue;
                        }
                        var nic = nics[item];
                        if (nic.portGroupId.refId === resource.id) {
                            nic.portGroupId = new ReferenceAttr();
                        }
                    }
                }
            }
        }
        this.delResource(cell.resourceId);
    };

    /**
     * 删除软件包cell资源
     * @param cell
     */
    TemplateDefine.prototype.removeSoftwareResource = function (cell) {
        if (!cell) {
            return false;
        }
        var parent = cell.getParent();
        // 获得父资源对象
        var resource = this.getResourceById(parent.resourceId);
        if (!resource) {
            return false;
        }
        // 从父资源对象中删除Software对象
        resource.delSoftware(cell.resourceId, this);
    };

    /**
     * 删除网络与VM连线Cell的资源
     * @param cell
     * @returns {boolean}
     */
    TemplateDefine.prototype.removeEdgeResource = function (cell) {
        if (!cell) {
            return false;
        }
        var connection = this.getConnectionById(cell.lineName);
        if (!connection) {
            return false;
        }
        var fromResource = this.getResourceById(connection.getFrom());
        var toResource = this.getResourceById(connection.getTo());
        // 找到线的起始资源，更新数据，如果没有找到，就表示线的数据已经不存在了。
        if (fromResource && toResource && (fromResource.type == "VmTemplate" && toResource.type == "Network")) {
            var nics = fromResource.properties.nics.properties;
            for (var key in nics) {
                var nic = nics[key];
                if (nic.portGroupId.refId === toResource.id) {
                    nic.portGroupId = new ReferenceAttr();
                }
            }
        }
        this.delConnection(connection);
    };

    function vmTemplateIsRefByScalingGroup(vmTemplateResourceID, resources) {
        for (var i in resources) {
            if (resources[i].type === "ScalingGroup" && resources[i].getVmTemplateId() === vmTemplateResourceID) {
                return true;
            }
        }
        return false;
    }


    /**
     * 重写ToJString()方法 将对象转换为Json
     * @return 转换成Json的字符串
     */
    TemplateDefine.prototype.toJson = function () {
        // 先生成对应的Instance
        var resources = this.properties.resources;
        var connections = this.properties.connections;
        resources = resources != null ? resources.properties : {};
        connections = connections != null ? connections.properties : {};
        // 临时的Instance，Json生成后删除
        var instances = [];
        for (var i in resources) {
            if (resources[i].type == "VmTemplate") {
                //更新soft/shell中的osType字段
                var softwareArray = resources[i].getSoftwares();
                if (softwareArray && (softwareArray.length() > 0)){
                    var vmTemplateOsType = resources[i].properties && resources[i].properties.oSType;
                    var soft2Array = softwareArray.getArray();
                    var len = soft2Array.length;
                    for (var ss = 0;ss < len;ss++){
                        if (!soft2Array[ss]){
                            continue;
                        }
                        if (!soft2Array[ss].properties){
                            soft2Array[ss].properties = {};
                        }
                        soft2Array[ss].properties.oSType = vmTemplateOsType;
                    }
                }

                // 生成Instance
                if (!vmTemplateIsRefByScalingGroup(resources[i].id, resources)){
                    var instance = new InstanceDefine();
                    instance.id = this.createId();
                    instance.name = resources[i].name;
                    instance.type = "Instance";
                    instance.properties.name = resources[i].name;
                    instance.properties.description = resources[i].properties.description;
                    instance.properties.vmTemplate.attrKey = "PhysicalID";
                    instance.properties.vmTemplate.refId = resources[i].id;
                    instances.push(instance);
                    this.addResource(instance);
                }
            }
        }

        var json = "{";
        var properties = this.properties;
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key == "parameters" || key == "resources" || key == "outputs") {
                    json += this.fullString(this.firstUpper(key)) + ":" + "{";
                    var items = properties[key] != null ? properties[key].properties : {};
                    for (var i in items) {
                        if (items.hasOwnProperty(i)) {
                            json += items[i].toJson(this, instances);
                            json += ",";
                        }
                    }
                    json = this.trimComma(json);
                    json += "}";
                    json += ",";
                } else if (key == "connections") {
                    json += this.fullString(this.firstUpper(key)) + ":" + "[";
                    var connections = properties[key] != null ? properties[key].properties : {};
                    for (var i in connections) {
                        if (connections.hasOwnProperty(i)) {
                            json += connections[i].toJson();
                            json += ",";
                        }
                    }
                    json = this.trimComma(json);
                    json += "]";
                    json += ",";
                } else {
                    json += this.fullString(this.firstUpper(key)) + ":" + this.fullString(properties[key]);
                    json += ",";
                }
            }
        }
        json = this.trimComma(json);
        json += "}";

        // 删除临时的Instance集合
        for (var i = 0; i < instances.length; i++) {
            this.delResource(instances[i]);
        }

        return json;
    };

    // 静态成员区
    /**
     * 删除资源引用公共参数或网卡的引用
     * @param templateDefine 容器
     * @param resource 资源
     * @return
     */
    TemplateDefine.deleteResource = function (templateDefine, resource) {
        // 获得资源对象
        var resource = templateDefine.getResourceById(resource.id);
        if (!resource) {
            return;
        }
        // 如果是虚拟机类型
        if (resource.type == "VmTemplate") {
            // 得到此虚拟机所有的软件
            var softwares = resource.getSoftwares().properties;
            for (var soft in softwares) {
                if (softwares.hasOwnProperty(soft)) {
                    resource.delSoftware(soft, templateDefine);
                }
            }

            // 判断虚拟机的计算机名称是否引用了公共参数
            if (resource.isReferOfComputerName()) {
                // 如果被引用，则将被引用的公共参数的次数减一。
                // 得到被引用的公共参数对象。
                var parameteritem = templateDefine.properties.parameters.get(resource.getComputerName());
                if (parameteritem) {
                    parameteritem.referNumSub();
                }
            }
        }
        templateDefine.delResource(resource);
    };

    /**
     * 创建resource资源
     * 创建一个资源，并将属性列表中的值赋值到资源中去。
     * @param attributes     属性列表
     * @param typeName       资源类型
     * @param resourceName   资源名称
     * @param resourceId     资源ID
     * @return  ResourceDefine  资源
     */
    TemplateDefine.createResource = function (templateDefine, attributes, typeName, resourceName, resourceId) {
        var method = ResourceDefine.getCreateResourceMethod(typeName);
        if (method) {
            return method(templateDefine, attributes, typeName, resourceName, resourceId);
        }
        return null;
    };

    TemplateDefine.createConnection = function (templateDefine, fromId, toId, name, id) {
        var connectResource = new ConnectionDefine();
        // 设置起点id
        connectResource.setFrom(fromId);
        // 设置终点id
        connectResource.setTo(toId);
        connectResource.setConnectionId(id);
        connectResource.setType("RealLine");
        templateDefine.addConnection(connectResource);
        return connectResource;
    };

    /**
     * 资源类型定义
     *
     */
    ResourceTypeDefine = function (options) {
        options = typeof options == "undefined" ? {} : options;
        options.type = options.type == undefined ? null : options.type;
        options.url = options.url == undefined ? null : options.url;

        this.type = options.type;
        this.url = options.url;
        this.connectableResources = [];
        this.drawableResources = [];
        this.params = [];
    };
    /**
     * 获取资源类型名称
     * @return typeName
     */
    ResourceTypeDefine.prototype.getTypeName = function () {
        return this.type;
    };
    /**
     * 设置资源类型名称
     */
    ResourceTypeDefine.prototype.setTypeName = function (type) {
        this.type = type;
    };
    /**
     * 获取资源属性模版URL
     * @return templateUrl
     */
    ResourceTypeDefine.prototype.getTemplateUrl = function () {
        return this.url;
    };
    /**
     * 设置资源属性模版URL
     */
    ResourceTypeDefine.prototype.setTemplateUrl = function (url) {
        this.url = url;
    };
    /**
     * 获取资源参数
     * @return
     */
    ResourceTypeDefine.prototype.getParams = function () {
        return this.params;
    };
    /**
     * 设置资源参数
     */
    ResourceTypeDefine.prototype.setParams = function (params) {
        this.params = params;
    };

    /**
     * 获取可连接资源
     * @return connectableResource
     */
    ResourceTypeDefine.prototype.getConnectableResource = function () {
        this.connectableResources;
    };
    /**
     * 设置可连接资源
     */
    ResourceTypeDefine.prototype.setConnectableResource = function (connectableResources) {
        this.connectableResources = connectableResources;
    };
    /**
     * 添加可连接资源
     */
    ResourceTypeDefine.prototype.addConnectableResource = function (connectableResource) {
        this.connectableResources.push(connectableResource);
    };
    /**
     * 获取可拖入资源
     * @return drawableResource
     */
    ResourceTypeDefine.prototype.getDrawableResource = function () {
        return this.drawableResources;
    };
    /**
     * 设置可拖入资源
     */
    ResourceTypeDefine.prototype.setDrawableResource = function (drawableResources) {
        this.drawableResources = drawableResources;
    };
    /**
     * 添加可拖入资源
     */
    ResourceTypeDefine.prototype.addDrawableResource = function (drawableResource) {

        this.drawableResources.push(drawableResource);
    };

    RuleDefine = function (options) {
        options = typeof options == "undefined" ? {} : options;
        options.canBeReferenced = options.canBeReferenced == undefined ? null : options.canBeReferenced;
        options.defaultValue = options.defaultValue == undefined ? null : options.defaultValue;
        options.enableModify = options.enableModify == undefined ? null : options.enableModify;
        options.name = options.name == undefined ? null : options.name;
        options.parameterCheckRule = options.parameterCheckRule == undefined ? null : options.parameterCheckRule;
        options.required = options.required == undefined ? null : options.required;
        options.type = options.type == undefined ? null : options.type;

        this.canBeReferenced = options.canBeReferenced;
        this.defaultValue = options.defaultValue;
        this.enableModify = options.enableModify;
        this.name = options.name;
        this.parameterCheckRule = options.parameterCheckRule;
        this.required = options.required;
        this.type = options.type;
    };
    /**
     * 设置参数能否被引用
     */
    RuleDefine.prototype.setCanBeReferenced = function (canBeReferenced) {
        this.canBeReferenced = canBeReferenced;
    };

    /**
     * 获取参数能否被引用
     * @return canBeReferenced
     */
    RuleDefine.prototype.getCanBeReferenced = function () {
        return this.canBeReferenced;
    };
    /**
     * 设置默认值
     */
    RuleDefine.prototype.setDefaultValue = function (defaultValue) {
        this.defaultValue = defaultValue;
    };

    /**
     * 获取默认值
     * @return defaultValue
     */
    RuleDefine.prototype.getDefaultValue = function () {
        return this.defaultValue;
    };

    /**
     * 设置是否可以编辑
     */
    RuleDefine.prototype.setEnableModify = function (enableModify) {
        this.enableModify = enableModify;
    };

    /**
     * 获取是否可以编辑
     * @return enableModify
     */
    RuleDefine.prototype.getEnableModify = function () {
        return this.enableModify;
    };
    /**
     * 设置参数名称
     */
    RuleDefine.prototype.setName = function (name) {
        this.name = name;
    };

    /**
     * 获取参数名称
     * @return name
     */
    RuleDefine.prototype.getName = function () {
        return this.name;
    };

    /**
     * 设置校验规则
     */
    RuleDefine.prototype.setParameterCheckRule = function (parameterCheckRule) {
        this.parameterCheckRule = parameterCheckRule;
    };

    /**
     * 获取校验规则
     * @return parameterCheckRule
     */
    RuleDefine.prototype.getParameterCheckRule = function () {
        return this.parameterCheckRule;
    };

    /**
     * 设置参数能否被引用
     */
    RuleDefine.prototype.setRequired = function (required) {
        this.required = required;
    };

    /**
     * 获取参数能否被引用
     * @return required
     */
    RuleDefine.prototype.getRequired = function () {
        return this.required;
    };

    /**
     * 设置校验规则
     */
    RuleDefine.prototype.setType = function (type) {
        this.type = type;
    };

    /**
     * 获取校验规则
     * @return parameterCheckRule
     */
    RuleDefine.prototype.getType = function () {
        return this.type;
    };
})();




