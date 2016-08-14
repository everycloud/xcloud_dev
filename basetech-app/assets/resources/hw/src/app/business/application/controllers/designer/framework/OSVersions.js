/**
 * Created on 2014/4/4.
 */
define(function () {
    'use strict';
    var OS = {
        "Novell SUSE Linux": [
            "Novell SUSE Linux Enterprise Server 11 SP1 32bit",
            "Novell SUSE Linux Enterprise Server 11 SP1 64bit",
            "Novell SUSE Linux Enterprise Server 11 SP2 32bit",
            "Novell SUSE Linux Enterprise Server 11 SP2 64bit",
            "Novell SUSE Linux Enterprise Server 11 SP3 32bit",
            "Novell SUSE Linux Enterprise Server 11 SP3 64bit",
            "Novell SUSE Linux Enterprise 11 64bit",
            "Novell SUSE Linux Enterprise 11 32bit",
            "Novell SUSE Linux Enterprise Server 10 SP1 32bit",
            "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
            "Novell SUSE Linux Enterprise Server 10 SP2 32bit",
            "Novell SUSE Linux Enterprise Server 10 SP2 64bit",
            "Novell SUSE Linux Enterprise Server 10 SP3 32bit",
            "Novell SUSE Linux Enterprise Server 10 SP3 64bit",
            "Novell SUSE Linux Enterprise Server 10 SP4 32bit",
            "Novell SUSE Linux Enterprise Server 10 SP4 64bit",
            "Novell SUSE Linux Enterprise Server 11 SP0 32bit",
            "Novell SUSE Linux Enterprise Server 11 SP0 64bit",
            "Novell SUSE 10 SP2 CUSTOMIZED 32bit",
            "Novell SUSE 11 SP1 CUSTOMIZED 64bit"
        ],
        "Redhat Linux": [
            "Redhat Linux Enterprise 6.0 32bit",
            "Redhat Linux Enterprise 6.0 64bit",
            "Redhat Linux Enterprise 6.1 32bit",
            "Redhat Linux Enterprise 6.1 64bit",
            "Redhat Linux Enterprise 6.2 32bit",
            "Redhat Linux Enterprise 6.2 64bit",
            "Redhat Linux Enterprise 6.3 32bit",
            "Redhat Linux Enterprise 6.3 64bit",
            "Redhat Linux Enterprise 6.4 32bit",
            "Redhat Linux Enterprise 6.4 64bit",
            "Redhat Linux Enterprise 6.5 32bit",
            "Redhat Linux Enterprise 6.5 64bit",
            "Redhat Linux Enterprise 5.0 32bit",
            "Redhat Linux Enterprise 5.0 64bit",
            "Redhat Linux Enterprise 5.1 32bit",
            "Redhat Linux Enterprise 5.1 64bit",
            "Redhat Linux Enterprise 5.2 32bit",
            "Redhat Linux Enterprise 5.2 64bit",
            "Redhat Linux Enterprise 5.3 32bit",
            "Redhat Linux Enterprise 5.3 64bit",
            "Redhat Linux Enterprise 5.4 32bit",
            "Redhat Linux Enterprise 5.4 64bit",
            "Redhat Linux Enterprise 5.5 32bit",
            "Redhat Linux Enterprise 5.5 64bit",
            "Redhat Linux Enterprise 5.6 32bit",
            "Redhat Linux Enterprise 5.6 64bit",
            "Redhat Linux Enterprise 5.7 32bit",
            "Redhat Linux Enterprise 5.7 64bit",
            "Redhat Linux Enterprise 5.8 32bit",
            "Redhat Linux Enterprise 5.8 64bit",
            "Redhat Linux Enterprise 5.9 32bit",
            "Redhat Linux Enterprise 5.9 64bit",
            "Redhat Linux Enterprise 5.10 32bit",
            "Redhat Linux Enterprise 5.10 64bit",
            "Redhat Linux Enterprise 4.4 32bit",
            "Redhat Linux Enterprise 4.4 64bit",
            "Redhat Linux Enterprise 4.5 32bit",
            "Redhat Linux Enterprise 4.5 64bit",
            "Redhat Linux Enterprise 4.6 32bit",
            "Redhat Linux Enterprise 4.6 64bit",
            "Redhat Linux Enterprise 4.7 32bit",
            "Redhat Linux Enterprise 4.7 64bit",
            "Redhat Linux Enterprise 4.8 32bit",
            "Redhat Linux Enterprise 4.8 64bit",
            "Redhat Linux Enterprise 3.0 32bit",
            "Redhat Linux Enterprise 3.4 32bit"
        ],
        "CentOS": [
            "CentOS 6.0 32bit",
            "CentOS 6.0 64bit",
            "CentOS 6.1 32bit",
            "CentOS 6.1 64bit",
            "CentOS 6.2 32bit",
            "CentOS 6.2 64bit",
            "CentOS 6.3 32bit",
            "CentOS 6.3 64bit",
            "CentOS 6.4 32bit",
            "CentOS 6.4 64bit",
            "CentOS 6.5 32bit",
            "CentOS 6.5 64bit",
            "CentOS 5.0 32bit",
            "CentOS 5.0 64bit",
            "CentOS 5.1 32bit",
            "CentOS 5.1 64bit",
            "CentOS 5.2 32bit",
            "CentOS 5.2 64bit",
            "CentOS 5.3 32bit",
            "CentOS 5.3 64bit",
            "CentOS 5.4 32bit",
            "CentOS 5.4 64bit",
            "CentOS 5.5 32bit",
            "CentOS 5.5 64bit",
            "CentOS 5.6 32bit",
            "CentOS 5.6 64bit",
            "CentOS 5.7 32bit",
            "CentOS 5.7 64bit",
            "CentOS 5.8 32bit",
            "CentOS 5.8 64bit",
            "CentOS 5.9 32bit",
            "CentOS 5.9 64bit",
            "CentOS 5.10 32bit",
            "CentOS 5.10 64bit",
            "CentOS 4.4 32bit",
            "CentOS 4.4 64bit",
            "CentOS 4.5 32bit",
            "CentOS 4.5 64bit",
            "CentOS 4.6 32bit",
            "CentOS 4.6 64bit",
            "CentOS 4.7 32bit",
            "CentOS 4.7 64bit",
            "CentOS 4.8 32bit",
            "CentOS 4.8 64bit"
        ],
        "Ubuntu": [
            "Ubuntu 10.04 server 64bit",
            "Ubuntu 10.04.1 server 64bit",
            "Ubuntu 10.04.2 server 64bit",
            "Ubuntu 10.04.3 server 64bit",
            "Ubuntu 11.10 server 32bit",
            "Ubuntu 11.10 server 64bit",
            "Ubuntu 12.04 desktop 64bit",
            "Ubuntu 12.04.1 desktop 64bit",
            "Ubuntu 12.04.1 server 64bit",
            "Ubuntu Server 12.04 64bit",
            "Ubuntu 8.04.4 desktop 32bit",
            "Ubuntu 8.04 desktop 64bit",
            "Ubuntu 10.04 desktop 64bit",
            "Ubuntu 10.04 server 32bit",
            "Ubuntu 10.04.1 desktop 32bit",
            "Ubuntu 10.04.4 server 64bit",
            "Ubuntu 10.10 server 64bit",
            "Ubuntu 12.04.2 server 64bit",
            "Ubuntu 12.04.2 server 32bit",
            "Ubuntu 12.04.2 desktop 64bit",
            "Ubuntu 12.04.2 desktop 32bit",
            "Ubuntu 12.10 server 64bit",
            "Ubuntu 12.10 server 32bit"
        ],
        "Windows Server 2003": [
            "Windows Server 2003 Datacenter 32bit",
            "Windows Server 2003 Datacenter 64bit",
            "Windows Server 2003 Enterprise 32bit",
            "Windows Server 2003 Standard 32bit",
            "Windows Server 2003 Standard 64bit",
            "Windows Server 2003 64bit",
            "Windows Server 2003 32bit",
            "Windows Server 2003 R2 Standard 32bit",
            "Windows Server 2003 R2 Standard 64bit",
            "Windows Server 2003 R2 Enterprise 32bit",
            "Windows Server 2003 R2 Enterprise 64bit",
            "Windows Server 2003 R2 Datacenter 32bit",
            "Windows Server 2003 R2 Datacenter 64bit"

        ],
        "Windows Server 2008": [
            "Windows Server 2008 Enterprise 32bit",
            "Windows Server 2008 Enterprise 64bit",
            "Windows Server 2008 Standard 32bit",
            "Windows Server 2008 Standard 64bit",
            "Windows Server 2008 64bit",
            "Windows Server 2008 32bit",
            "Windows Server 2008 R2 Datacenter 64bit",
            "Windows Server 2008 R2 Enterprise 64bit",
            "Windows Server 2008 R2 Standard 64bit",
            "Windows Server 2008 R2 64bit",
            "Windows Server 2008 Datacenter 32bit",
            "Windows Server 2008 Datacenter 64bit",
            "Windows Server 2008 WEB R2 64bit"
        ],
        "Windows Server 2012": [
            "Windows Server 2012 R2 Standard 64bit",
            "Windows Server 2012 R2 Datacenter 64bit"
        ],
        "Windows 2000":[
            "Windows 2000 Server SP4",
            "Windows 2000 Advanced Server SP4"

        ],
        "Windows 2012":[
            "Windows 2012 64bit"
        ],
        "Windows XP": [
            "Windows XP Professional 32bit",
            "Windows XP Professional 64bit",
            "Windows XP Home Edition",
            "Windows XP SP3(32 - bit)"
        ],
        "Windows 7": [
            "Windows 7 Ultimate 32bit",
            "Windows 7 Ultimate 64bit",
            "Windows 7 Enterprise 32bit",
            "Windows 7 Enterprise 64bit",
            "Windows 7 Professional 32bit",
            "Windows 7 Professional 64bit",
            "Windows 7 Home Premium 32bit",
            "Windows 7 Home Premium 64bit",
            "Windows 7 Home Basic 32bit",
            "Windows 7 Home Basic 64bit",
            "Windows 7 64bit",
            "Windows 7 32bit"
        ],
        "Windows 8": [
            "Windows 8 32bit",
            "Windows 8 64bit",
            "Windows 8 Server 64bit"
        ]
    };

    OS.getOSTypes = function (type) {
        var types = [];
        var hasType = false;
        for (var key in OS) {
            if (!OS.hasOwnProperty(key) || key === "getOSTypes" || key === "getOSVersions") {
                continue;
            }
            var item = {
                "selectId": key,
                "label": key
            };
            if (key === type) {
                item.checked = true;
                hasType = true
            }
            types.push(item);
        }
        if (!hasType) {
            types[0] && (types[0].checked = true);
        }
        return types;
    };

    OS.getOSVersions = function (type, version) {
        var versions = OS[type];
        if (!versions || versions.length <= 0) {
            return [];
        }
        var versionObj = [];
        var hasVersion = false;
        for (var index = 0; index < versions.length; index++) {
            var item = {
                "selectId": versions[index],
                "label": versions[index]
            };
            if (versions[index] === version) {
                item.checked = true;
                hasVersion = true
            }
            versionObj.push(item);
        }
        if (!hasVersion) {
            versionObj[0] && (versionObj[0].checked = true);
        }
        return versionObj;
    };
    return OS;
});