define([], function() {
			var exceptionMap = {
				"#1010072" : {
					"cause" : "The host is powered off, the management IP address is unreachable, the password for logging in to the SMM is incorrect, or the SMM is disconnected.",
					"desc" : "The host is powered off, the management IP address is unreachable, the password for logging in to the SMM is incorrect, or the SMM is disconnected.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"-1" : {
					"cause" : "An Internal Error Occurred.",
					"desc" : "An Internal Error Occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0" : {
					"cause" : "Success.",
					"desc" : "Success.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0000000001" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0000010001" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0000010002" : {
					"cause" : "Parameters invalid.",
					"desc" : "Parameters invalid.",
					"solution" : "Please modify parameters."
				},
				"0000010003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the system administrator or view the online help."
				},
				"0000010004" : {
					"cause" : "Not authorized.",
					"desc" : "Not authorized.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0000010005" : {
					"cause" : "Object no exist.",
					"desc" : "Object no exist.",
					"solution" : "Object no exist."
				},
				"0000020000" : {
					"cause" : "DB error.",
					"desc" : "DB error.",
					"solution" : "Contact the system administrator."
				},
				"0000010007": {
        	         "cause":"Connect time out, please check the hypervisor IP and port are correct.",
                    "desc":"Connect time out, please check the hypervisor IP and port are correct.",
                    "solution":"Please check the hypervisor parameters are correct."
                },
				"0000030004" : {
					"cause" : "Incorrect username or password.",
					"desc" : "Incorrect username or password.",
					"solution" : "Please enter a correct username and password."
				},
				"0005001001" : {
					"cause" : "The resource pool name already exists.",
					"desc" : "The resource pool name already exists.",
					"solution" : "Please enter a unique name."
				},
				"0005001002" : {
					"cause" : "The IP address of the resource pool is in use.",
					"desc" : "The IP address of the resource pool is in use.",
					"solution" : "Please enter an available IP address."
				},
				"0005001003" : {
					"cause" : "The region of the resource pool already exists.",
					"desc" : "The region of the resource pool already exists.",
					"solution" : "Please select a new region."
				},
				"0005001004" : {
					"cause" : "The resource pool doesn't exist or is abnormal.",
					"desc" : "The resource pool doesn't exist or is abnormal.",
					"solution" : "Please check status of the resource pool."
				},
				"0005001005" : {
					"cause" : "The resource pool is already synchronizing.",
					"desc" : "The resource pool is already synchronizing.",
					"solution" : "Please try again later."
				},
				"0005001006" : {
					"cause" : "Query fail, please check the resource pool status .",
					"desc" : "Query fail, please check the resource pool status.",
					"solution" : "Please try again later."
				},
				"0005001102" : {
					"cause" : "Schedulor fail, cannot find suitable cloud infrastructure.",
					"desc" : "Schedulor fail, cannot find suitable cloud infrastructure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005002100" : {
					"cause" : "Delete available zone fail, the available zone has associated with VDC.",
					"desc" : "Delete available zone fail, the available zone has associated with VDC.",
					"solution" : "Contact the system administrator."
				},
				"0005002101" : {
					"cause" : "The scheduler cannot find suitable available zone.",
					"desc" : "The scheduler cannot find suitable available zone.",
					"solution" : "Contact the system administrator."
				},
				"0005002102" : {
					"cause" : "Delete available zone fail, please remove the associated volume first.",
					"desc" : "Delete available zone fail, please remove the associated volume first.",
					"solution" : "Contact the system administrator."
				},
				"0005002103" : {
					"cause" : "Delete available zone fail, please remove the associated VM first.",
					"desc" : "Delete available zone fail, please remove the associated VM first.",
					"solution" : "Contact the system administrator."
				},
				"0005002104" : {
					"cause" : "Delete failed, please remove the associated VDC first.",
					"desc" : "Delete failed, please remove the associated VDC first.",
					"solution" : "Contact the system administrator."
				},
				"0005003001" : {
					"cause" : "This task has exceeded the execution time.",
					"desc" : "This task has exceeded the execution time.",
					"solution" : "Contact the system administrator."
				},
				"0005003002" : {
					"cause" : "Failed to query cloudInfra type.",
					"desc" : "Failed to query cloudInfra type.",
					"solution" : "Contact the system administrator."
				},
				"0005003003" : {
					"cause" : "Failed to modify service instance.",
					"desc" : "Failed to modify service instance.",
					"solution" : "Contact the system administrator."
				},
				"0005003004" : {
					"cause" : "Failed to delete service instance.",
					"desc" : "Failed to delete service instance.",
					"solution" : "Contact the system administrator."
				},
				"0005003005" : {
					"cause" : "Failed to modify quota.",
					"desc" : "Failed to modify quota.",
					"solution" : "Contact the system administrator."
				},
				"0005003006" : {
					"cause" : "Failed to create service instance.",
					"desc" : "Failed to create service instance.",
					"solution" : "Contact the system administrator."
				},
				"0005005101" : {
					"cause" : "Failed to delete the tag because the tag is in use by some resources.",
					"desc" : "Failed to delete the tag because the tag is in use by some resources.",
					"solution" : "Disassociate the tag from the resources using it and try again."
				},
				"0005005102" : {
					"cause" : "Failed to change the tag attributes because the tag having the modified attributes already exists in the system.",
					"desc" : "Failed to change the tag attributes because the tag having the modified attributes already exists in the system.",
					"solution" : "Please try again."
				},
				"0005005103" : {
					"cause" : "Failed to associate the tag because the resource is not available.",
					"desc" : "Failed to associate the tag because the resource is not available.",
					"solution" : "Contact Huawei technical support."
				},
				"0005005105" : {
					"cause" : "Failed to associate the tag because the tag is not exist.",
					"desc" : "Failed to associate the tag because the tag is not exist.",
					"solution" : "Please choose available tag and try again."
				},
				"0005009001" : {
					"cause" : "Failed to query router info.",
					"desc" : "Failed to query router info.",
					"solution" : "Contact Huawei technical support."
				},
				"0005009002" : {
					"cause" : "Failed to create elastic ip.",
					"desc" : "Failed to create elastic ip.",
					"solution" : "Contact Huawei technical support."
				},
				"0005009003" : {
					"cause" : "Failed to create float ip.",
					"desc" : "Failed to create float ip.",
					"solution" : "Contact Huawei technical support."
				},
				"0005009004" : {
					"cause" : "Failed to delete elastic ip.",
					"desc" : "Failed to delete elastic ip.",
					"solution" : "Contact Huawei technical support."
				},
				"0005009005" : {
					"cause" : "Failed to delete float ip.",
					"desc" : "Failed to delete float ip.",
					"solution" : "Contact Huawei technical support."
				},
				"0005010001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010008" : {
					"cause" : "You do not have rights to perform this operation.",
					"desc" : "You do not have rights to perform this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010009" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010010" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010011" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010012" : {
					"cause" : "The FusionManager is disconnected from the UHM. Attempting to connect to the UHM ... Please wait.",
					"desc" : "The FusionManager is disconnected from the UHM. Attempting to connect to the UHM ... Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010013" : {
					"cause" : "The FusionManager is disconnected from the VRM. Attempting to connect to the UHM ... Please wait.",
					"desc" : "The FusionManager is disconnected from the VRM. Attempting to connect to the UHM ... Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010014" : {
					"cause" : "The FusionManager is disconnected from the database. Attempting to connect to the database ... Please wait.",
					"desc" : "The FusionManager is disconnected from the database. Attempting to connect to the database ... Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010015" : {
					"cause" : "The number of requested resources exceeds the upper limit of the resource quota.",
					"desc" : "The number of requested resources exceeds the upper limit of the resource quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010016" : {
					"cause" : "The length of the parameter content exceeds the limit.",
					"desc" : "The length of the parameter content exceeds the limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010017" : {
					"cause" : "The username or password is incorrect. Please check.",
					"desc" : "The username or password is incorrect. Please check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010018" : {
					"cause" : "The VRM version number is incorrect.",
					"desc" : "The VRM version number is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010019" : {
					"cause" : "The operation timed out.",
					"desc" : "The operation timed out.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010020" : {
					"cause" : "A VMware internal error occurred.",
					"desc" : "A VMware internal error occurred.",
					"solution" : "Please log in to the vSphere and check whether the operation is successful."
				},
				"0005010021" : {
					"cause" : "The connection status of hypervisor [{0}] is not Successful.",
					"desc" : "The connection status of hypervisor [{0}] is not Successful.",
					"solution" : "Please try again after the hypervisor connection is successful."
				},
				"0005010022" : {
					"cause" : "The language setting of hypervisor [{0}] is invalid.",
					"desc" : "The language setting of hypervisor [{0}] is invalid.",
					"solution" : "Set the language for the hypervisor correctly."
				},
				"0005010023" : {
					"cause" : "Failed to set the language for hypervisor [{0}].",
					"desc" : "Failed to set the language for hypervisor [{0}].",
					"solution" : "Please contact technical support."
				},
				"0005010024" : {
					"cause" : "Communication of hypervisor [{0}] is abnormal.",
					"desc" : "Communication of hypervisor [{0}] is abnormal.",
					"solution" : "Please contact technical support."
				},
				"0005010025" : {
					"cause" : "The username or password is incorrect.",
					"desc" : "The username or password is incorrect.",
					"solution" : "Please change the username or password."
				},
				"0005010026" : {
					"cause" : "The account will be locked for 5 minutes because incorrect passwords were entered three times.",
					"desc" : "The account will be locked for 5 minutes because incorrect passwords were entered three times.",
					"solution" : "Please try again 5 minutes later."
				},
				"0005010027" : {
					"cause" : "The account is locked.",
					"desc" : "The account is locked.",
					"solution" : "Please wait 5 minutes."
				},
				"0005010028" : {
					"cause" : "The username does not exist.",
					"desc" : "The username does not exist.",
					"solution" : "Please change the username."
				},
				"0005010029" : {
					"cause" : "Modifying the management subnet ... Please try later.",
					"desc" : "Modifying the management subnet ... Please try later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010030" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010031" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010032" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010033" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010034" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010035" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010036" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010037" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010038" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010039" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010040" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010041" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010042" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010043" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010044" : {
					"cause" : "The operation object does not exist.",
					"desc" : "The operation object does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010045" : {
					"cause" : "Invalid subnet mask.",
					"desc" : "Invalid subnet mask.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010046" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010047" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010048" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010049" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010050" : {
					"cause" : "The system is recovering. Please try later.",
					"desc" : "The system is recovering. Please try later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010051" : {
					"cause" : "The system is busy. Please try later.",
					"desc" : "The system is busy. Please try later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010052" : {
					"cause" : "The system is busy. Please try later.",
					"desc" : "The system is busy. Please try later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010053" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010054" : {
					"cause" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"desc" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010055" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010056" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010057" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010058" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010059" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010060" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010061" : {
					"cause" : "The task does not exist.",
					"desc" : "The task does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010062" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "Ensure that the VM exists and try again."
				},
				"0005010063" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010064" : {
					"cause" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"desc" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"solution" : "Ensure that the object status is correct or try later."
				},
				"0005010065" : {
					"cause" : "Invalid input parameter.",
					"desc" : "Invalid input parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010066" : {
					"cause" : "Invalid input parameter name.",
					"desc" : "Invalid input parameter name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010067" : {
					"cause" : "The value range of the upper limit is 1 to 100.",
					"desc" : "The value range of the upper limit is 1 to 100.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010068" : {
					"cause" : "The entered description is invalid.",
					"desc" : "The entered description is invalid.",
					"solution" : "The entered description is invalid. Please enter a valid value."
				},
				"0005010069" : {
					"cause" : "Invalid input parameter.",
					"desc" : "Invalid input parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010070" : {
					"cause" : "The entered offset value is invalid.",
					"desc" : "The entered offset value is invalid.",
					"solution" : "The entered offset is invalid. Please enter a valid value."
				},
				"0005010071" : {
					"cause" : "The port number is an integer ranging from 1 to 65535.",
					"desc" : "The port number is an integer ranging from 1 to 65535.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010072" : {
					"cause" : "The mobile phone number of the user is incorrect.",
					"desc" : "The mobile phone number of the user is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010073" : {
					"cause" : "The email format of the user is incorrect.",
					"desc" : "The email format of the user is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010074" : {
					"cause" : "Duplicate username.",
					"desc" : "Duplicate username.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010075" : {
					"cause" : "The role selected by the user does not exist.",
					"desc" : "The role selected by the user does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010076" : {
					"cause" : "Failed to modify the user.",
					"desc" : "Failed to modify the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010077" : {
					"cause" : "The username length is invalid.",
					"desc" : "The username length is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010078" : {
					"cause" : "Incorrect username characters.",
					"desc" : "Incorrect username characters.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010079" : {
					"cause" : "Failed to add the user.",
					"desc" : "Failed to add the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010080" : {
					"cause" : "The current user cannot be deleted.",
					"desc" : "The current user cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010081" : {
					"cause" : "The default super administrator cannot be deleted.",
					"desc" : "The default super administrator cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010082" : {
					"cause" : "Failed to delete the user.",
					"desc" : "Failed to delete the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010083" : {
					"cause" : "Failed to change the password.",
					"desc" : "Failed to change the password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010084" : {
					"cause" : "You are not allowed to change the passwords of other users.",
					"desc" : "You are not allowed to change the passwords of other users.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010085" : {
					"cause" : "The old password is incorrect.",
					"desc" : "The old password is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010086" : {
					"cause" : "The password of the domain user cannot be changed.",
					"desc" : "The password of the domain user cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010087" : {
					"cause" : "The time for changing the password has not reached.",
					"desc" : "The time for changing the password has not reached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010088" : {
					"cause" : "The password has been used.",
					"desc" : "The password has been used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010089" : {
					"cause" : "Failed to reset the password.",
					"desc" : "Failed to reset the password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010090" : {
					"cause" : "Failed to query the user.",
					"desc" : "Failed to query the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010091" : {
					"cause" : "Invalid minimum time interval at which the password can be changed.",
					"desc" : "Invalid minimum time interval at which the password can be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010092" : {
					"cause" : "Invalid maximum password age.",
					"desc" : "Invalid maximum password age.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010093" : {
					"cause" : "Invalid modification for forcibly changing the password.",
					"desc" : "Invalid modification for forcibly changing the password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010094" : {
					"cause" : "Invalid number of times the same password can be used.",
					"desc" : "Invalid number of times the same password can be used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010095" : {
					"cause" : "Invalid password expiry warning.",
					"desc" : "Invalid password expiry warning.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010096" : {
					"cause" : "The password has expired.",
					"desc" : "The password has expired.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010097" : {
					"cause" : "Failed to obtain the password policy.",
					"desc" : "Failed to obtain the password policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010098" : {
					"cause" : "Failed to modify the password policy.",
					"desc" : "Failed to modify the password policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010099" : {
					"cause" : "The domain is too long.",
					"desc" : "The domain is too long.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010100" : {
					"cause" : "The role already exits.",
					"desc" : "The role already exits.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010101" : {
					"cause" : "The role does not exist.",
					"desc" : "The role does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010102" : {
					"cause" : "The role is in use.",
					"desc" : "The role is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010103" : {
					"cause" : "The selected rights do not exist.",
					"desc" : "The selected rights do not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010104" : {
					"cause" : "Failed to create the role.",
					"desc" : "Failed to create the role.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010105" : {
					"cause" : "Invalid role name.",
					"desc" : "Invalid role name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010106" : {
					"cause" : "Failed to modify the role.",
					"desc" : "Failed to modify the role.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010107" : {
					"cause" : "Invalid BMC username.",
					"desc" : "Invalid BMC username.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010108" : {
					"cause" : "Invalid BMC password.",
					"desc" : "Invalid BMC password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010109" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010110" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010111" : {
					"cause" : "The host is in maintenance mode.",
					"desc" : "The host is in maintenance mode.",
					"solution" : "Exit maintenance mode and try again."
				},
				"0005010112" : {
					"cause" : "The operation cannot be performed when the host is in the current state.",
					"desc" : "The operation cannot be performed when the host is in the current state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010113" : {
					"cause" : "The BMC username is empty.",
					"desc" : "The BMC username is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010114" : {
					"cause" : "The BMC password is empty.",
					"desc" : "The BMC password is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010115" : {
					"cause" : "The host has been started.",
					"desc" : "The host has been started.",
					"solution" : "Ensure that the host is in the correct state."
				},
				"0005010116" : {
					"cause" : "The host has been stopped.",
					"desc" : "The host has been stopped.",
					"solution" : "Ensure that the host is in the correct state."
				},
				"0005010117" : {
					"cause" : "The host has been shut down.",
					"desc" : "The host has been shut down.",
					"solution" : "Start the host before restarting it."
				},
				"0005010118" : {
					"cause" : "Make sure that all the VMs are stopped before the host is safely restarted or powered off.",
					"desc" : "Make sure that all the VMs are stopped before the host is safely restarted or powered off.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010119" : {
					"cause" : "Host communication error.",
					"desc" : "Host communication error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010120" : {
					"cause" : "Invalid CPU quantity.",
					"desc" : "Invalid CPU quantity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010121" : {
					"cause" : "Invalid CPU quota.",
					"desc" : "Invalid CPU quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010122" : {
					"cause" : "Invalid CPU upper limit.",
					"desc" : "Invalid CPU upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010123" : {
					"cause" : "Invalid memory size.",
					"desc" : "Invalid memory size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010124" : {
					"cause" : "Invalid VM memory quota.",
					"desc" : "Invalid VM memory quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010125" : {
					"cause" : "Invalid disk ID.",
					"desc" : "Invalid disk ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010126" : {
					"cause" : "Invalid disk size.",
					"desc" : "Invalid disk size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010127" : {
					"cause" : "The number of hard disks on the VM exceeds the maximum.",
					"desc" : "The number of hard disks on the VM exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010128" : {
					"cause" : "The port group, to which the VM NIC belongs, is empty.",
					"desc" : "The port group, to which the VM NIC belongs, is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010129" : {
					"cause" : "The number of NICs on the VM exceeds the maximum.",
					"desc" : "The number of NICs on the VM exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010130" : {
					"cause" : "Invalid VM startup configuration.",
					"desc" : "Invalid VM startup configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010131" : {
					"cause" : "The VM fault processing policy does not conform to specifications.",
					"desc" : "The VM fault processing policy does not conform to specifications.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010132" : {
					"cause" : "The source host cannot be the same as the destination host.",
					"desc" : "The source host cannot be the same as the destination host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010133" : {
					"cause" : "The Tools is not installed or not running.",
					"desc" : "The Tools is not installed or not running.",
					"solution" : "Install and start the Tools on the VM and try again."
				},
				"0005010134" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010135" : {
					"cause" : "The server does not exist.",
					"desc" : "The server does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010136" : {
					"cause" : "The specified logical resource cluster does not exist.",
					"desc" : "The specified logical resource cluster does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010137" : {
					"cause" : "VMs exist in the resource cluster.",
					"desc" : "VMs exist in the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010138" : {
					"cause" : "Hosts exist in the resource cluster.",
					"desc" : "Hosts exist in the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010139" : {
					"cause" : "The number of resource clusters exceeds the maximum (32).",
					"desc" : "The number of resource clusters exceeds the maximum (32).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010140" : {
					"cause" : "VMs that cannot be migrated exist on the host or insufficient resources of this cluster.",
					"desc" : "VMs that cannot be migrated exist on the host or insufficient resources of this cluster.",
					"solution" : "Please check and try again."
				},
				"0005010141" : {
					"cause" : "A CD-ROM has been mounted to VM.",
					"desc" : "A CD-ROM has been mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010142" : {
					"cause" : "No CD-ROM is mounted to VM.",
					"desc" : "No CD-ROM is mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010143" : {
					"cause" : "Invalid shared URL.",
					"desc" : "Invalid shared URL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010144" : {
					"cause" : "The disk is not attached to the VM.",
					"desc" : "The disk is not attached to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010145" : {
					"cause" : "A CD-ROM has been mounted to VM.",
					"desc" : "A CD-ROM has been mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010146" : {
					"cause" : "No CD-ROM is mounted to VM.",
					"desc" : "No CD-ROM is mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010147" : {
					"cause" : "Invalid VM memory limit.",
					"desc" : "Invalid VM memory limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010148" : {
					"cause" : "The OS type is incorrect.",
					"desc" : "The OS type is incorrect.",
					"solution" : "Select the OS of the correct type."
				},
				"0005010149" : {
					"cause" : "The OS version is incorrect.",
					"desc" : "The OS version is incorrect.",
					"solution" : "Select the OS of the correct version."
				},
				"0005010150" : {
					"cause" : "The CPU quota of the VM is invalid.",
					"desc" : "The CPU quota of the VM is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010151" : {
					"cause" : "The memory quota of the VM is invalid.",
					"desc" : "The memory quota of the VM is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010152" : {
					"cause" : "Failed to create a VM or add a NIC because of duplicate MAC address.",
					"desc" : "Failed to create a VM or add a NIC because of duplicate MAC address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010153" : {
					"cause" : "Failed to delete the NIC because of a MAC address releasing error.",
					"desc" : "Failed to delete the NIC because of a MAC address releasing error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010154" : {
					"cause" : "Failed to create a VM or add a NIC because of insufficient MAC addresses.",
					"desc" : "Failed to create a VM or add a NIC because of insufficient MAC addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010155" : {
					"cause" : "The domain information of the VM cannot exceed 1024 bytes.",
					"desc" : "The domain information of the VM cannot exceed 1024 bytes.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010156" : {
					"cause" : "The disk is being used by the VM.",
					"desc" : "The disk is being used by the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010157" : {
					"cause" : "The source resource cluster and the destination resource cluster are the same during host migration.",
					"desc" : "The source resource cluster and the destination resource cluster are the same during host migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010158" : {
					"cause" : "Invalid MAC address.",
					"desc" : "Invalid MAC address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010159" : {
					"cause" : "Snapshot is not allowed for shared disks.",
					"desc" : "Snapshot is not allowed for shared disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010160" : {
					"cause" : "The location cannot be empty.",
					"desc" : "The location cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010161" : {
					"cause" : "The storage ID cannot be empty.",
					"desc" : "The storage ID cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010162" : {
					"cause" : "The OS type cannot be empty.",
					"desc" : "The OS type cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010163" : {
					"cause" : "The snapshot status does not allow this operation.",
					"desc" : "The snapshot status does not allow this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010164" : {
					"cause" : "The hard disk slot ID already exists.",
					"desc" : "The hard disk slot ID already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010165" : {
					"cause" : "A resource cluster can contain a maximum of 128 hosts.",
					"desc" : "A resource cluster can contain a maximum of 128 hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010166" : {
					"cause" : "The VM snapshot does not exist.",
					"desc" : "The VM snapshot does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010167" : {
					"cause" : "The VM snapshot does not exist.",
					"desc" : "The VM snapshot does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010168" : {
					"cause" : "The destination node or resource cluster does not have storage resources required for running the VM.",
					"desc" : "The destination node or resource cluster does not have storage resources required for running the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010169" : {
					"cause" : "The number of VM snapshots exceeds the maximum.",
					"desc" : "The number of VM snapshots exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010170" : {
					"cause" : "The disk is not shared and has been attached to a VM, or the disk is shared but has been attached to four VMs, or the disk status is not allowed to attach to VM.",
					"desc" : "The disk is not shared and has been attached to a VM, or the disk is shared but has been attached to four VMs, or the disk status is not allowed to attach to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010171" : {
					"cause" : "The number of share disks attached to this VM is more than limit.",
					"desc" : "The number of share disks attached to this VM is more than limit.",
					"solution" : "Please try attaching nonshareable disk to this VM."
				},
				"0005010172" : {
					"cause" : "Failed to attach the disk. The disk has been attached to the VM.",
					"desc" : "Failed to attach the disk. The disk has been attached to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010173" : {
					"cause" : "A memory snapshot must be created for a hibernated VM.",
					"desc" : "A memory snapshot must be created for a hibernated VM.",
					"solution" : "Please select Memory snapshot and try again."
				},
				"0005010174" : {
					"cause" : "The length of the port group name is invalid.",
					"desc" : "The length of the port group name is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010175" : {
					"cause" : "The disk to be attached does not exist.",
					"desc" : "The disk to be attached does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010176" : {
					"cause" : "A VM to be cloned as a VM template cannot contain any disk.",
					"desc" : "A VM to be cloned as a VM template cannot contain any disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010177" : {
					"cause" : "The operation is not allowed when the resource cluster contains VMs that are in a transient state such as starting or migrating.",
					"desc" : "The operation is not allowed when the resource cluster contains VMs that are in a transient state such as starting or migrating.",
					"solution" : "Ensure that all VMs in the resource cluster are not in a transient state and try again."
				},
				"0005010178" : {
					"cause" : "The memory overcommitment function cannot be enabled for the cluster because the cluster contains hosts that use iNICs.",
					"desc" : "The memory overcommitment function cannot be enabled for the cluster because the cluster contains hosts that use iNICs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010179" : {
					"cause" : "The resource cluster contains VMs whose memory quota is smaller than the memory specification.",
					"desc" : "The resource cluster contains VMs whose memory quota is smaller than the memory specification.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010180" : {
					"cause" : "A node that meets the storage requirements for starting the VM does not exist in the specified location.",
					"desc" : "A node that meets the storage requirements for starting the VM does not exist in the specified location.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010181" : {
					"cause" : "Failed to modify the resource cluster database.",
					"desc" : "Failed to modify the resource cluster database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010182" : {
					"cause" : "Memory commitment is enabled for the resource cluster.",
					"desc" : "Memory commitment is enabled for the resource cluster.",
					"solution" : "Disable memory commitment for the resource cluster."
				},
				"0005010183" : {
					"cause" : "The status of the destination node does not support migration.",
					"desc" : "The status of the destination node does not support migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010184" : {
					"cause" : "The number of source nodes or destination nodes exceeds the maximum concurrent number for migration.",
					"desc" : "The number of source nodes or destination nodes exceeds the maximum concurrent number for migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010185" : {
					"cause" : "The number of VMs that are being migrated in the resource cluster cannot exceed 40.",
					"desc" : "The number of VMs that are being migrated in the resource cluster cannot exceed 40.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010186" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010187" : {
					"cause" : "The specified VM is not a linked clone VM.",
					"desc" : "The specified VM is not a linked clone VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010188" : {
					"cause" : "The system is connecting to the specified storage resource.",
					"desc" : "The system is connecting to the specified storage resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010189" : {
					"cause" : "Incorrect storage type.",
					"desc" : "Incorrect storage type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010190" : {
					"cause" : "Insufficient storage resources.",
					"desc" : "Insufficient storage resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010191" : {
					"cause" : "The storage device does not exist.",
					"desc" : "The storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010192" : {
					"cause" : "The storage device does not exist.",
					"desc" : "The storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010193" : {
					"cause" : "Search criteria error.",
					"desc" : "Search criteria error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010194" : {
					"cause" : "Storage device error.",
					"desc" : "Storage device error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010195" : {
					"cause" : "The storage resource already exists.",
					"desc" : "The storage resource already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010196" : {
					"cause" : "The storage resource does not exist.",
					"desc" : "The storage resource does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010197" : {
					"cause" : "The storage resource is in use.",
					"desc" : "The storage resource is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010198" : {
					"cause" : "No storage device found.",
					"desc" : "No storage device found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010199" : {
					"cause" : "The storage device is in use.",
					"desc" : "The storage device is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010200" : {
					"cause" : "The storage resource name already exists in the system.",
					"desc" : "The storage resource name already exists in the system.",
					"solution" : "Change the storage resource name and try again."
				},
				"0005010201" : {
					"cause" : "Disk type error.",
					"desc" : "Disk type error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010202" : {
					"cause" : "The disk does not exist or has been deleted.",
					"desc" : "The disk does not exist or has been deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010203" : {
					"cause" : "The disk status is not in use.",
					"desc" : "The disk status is not in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010204" : {
					"cause" : "Invalid disk size.",
					"desc" : "Invalid disk size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010205" : {
					"cause" : "Error in querying the number of disks in batches.",
					"desc" : "Error in querying the number of disks in batches.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010206" : {
					"cause" : "The disk is being attached.",
					"desc" : "The disk is being attached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010207" : {
					"cause" : "The subnet does not exist.",
					"desc" : "The subnet does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010208" : {
					"cause" : "The number of subnets cannot exceed 50.",
					"desc" : "The number of subnets cannot exceed 50.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010209" : {
					"cause" : "Invalid subnet address.",
					"desc" : "Invalid subnet address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010210" : {
					"cause" : "Subnet address segment conflict.",
					"desc" : "Subnet address segment conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010211" : {
					"cause" : "Invalid subnet mask.",
					"desc" : "Invalid subnet mask.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010212" : {
					"cause" : "Invalid gateway.",
					"desc" : "Invalid gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010213" : {
					"cause" : "The subnet has been associated with a port group.",
					"desc" : "The subnet has been associated with a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010214" : {
					"cause" : "The gateway must be within the subnet.",
					"desc" : "The gateway must be within the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010215" : {
					"cause" : "All VMs in the subnet must be shut down before changing the subnet attributes.",
					"desc" : "All VMs in the subnet must be shut down before changing the subnet attributes.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010216" : {
					"cause" : "Invalid virtual switch type.",
					"desc" : "Invalid virtual switch type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010217" : {
					"cause" : "Snapshot is not allowed for VM template.",
					"desc" : "Snapshot is not allowed for VM template.",
					"solution" : "Please convert the VM Template to VM and try again."
				},
				"0005010218" : {
					"cause" : "The linked clone VM is not supported to create snapshot.",
					"desc" : "The linked clone VM is not supported to create snapshot.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010219" : {
					"cause" : "The virtual switch does not exist.",
					"desc" : "The virtual switch does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010220" : {
					"cause" : "The host port cannot be empty.",
					"desc" : "The host port cannot be empty.",
					"solution" : "Contact technical support."
				},
				"0005010221" : {
					"cause" : "The uplink port does not exist.",
					"desc" : "The uplink port does not exist.",
					"solution" : "Contact technical support."
				},
				"0005010222" : {
					"cause" : "The uplink port is in use.",
					"desc" : "The uplink port is in use.",
					"solution" : "Contact technical support."
				},
				"0005010223" : {
					"cause" : "The type of the uplink port NIC and that of the virtual switch mismatch.",
					"desc" : "The type of the uplink port NIC and that of the virtual switch mismatch.",
					"solution" : "Contact technical support."
				},
				"0005010224" : {
					"cause" : "The uplink aggregation port does not exist.",
					"desc" : "The uplink aggregation port does not exist.",
					"solution" : "Contact technical support."
				},
				"0005010225" : {
					"cause" : "The uplink aggregation port is in use.",
					"desc" : "The uplink aggregation port is in use.",
					"solution" : "Contact technical support."
				},
				"0005010226" : {
					"cause" : "Hosts connected to the virtual switch cannot overlap.",
					"desc" : "Hosts connected to the virtual switch cannot overlap.",
					"solution" : "Contact technical support."
				},
				"0005010227" : {
					"cause" : "The port group exists.",
					"desc" : "The port group exists.",
					"solution" : "Contact technical support."
				},
				"0005010228" : {
					"cause" : "The virtual switch has uplink ports.",
					"desc" : "The virtual switch has uplink ports.",
					"solution" : "Contact technical support."
				},
				"0005010229" : {
					"cause" : "The virtual switch has uplink aggregation ports.",
					"desc" : "The virtual switch has uplink aggregation ports.",
					"solution" : "Contact technical support."
				},
				"0005010230" : {
					"cause" : "The bandwidth limit cannot be less than 0.",
					"desc" : "The bandwidth limit cannot be less than 0.",
					"solution" : "Contact technical support."
				},
				"0005010231" : {
					"cause" : "The bandwidth limit must comply with the limit interval.",
					"desc" : "The bandwidth limit must comply with the limit interval.",
					"solution" : "Contact technical support."
				},
				"0005010232" : {
					"cause" : "The port group, to which the VM NIC belongs, does not exist.",
					"desc" : "The port group, to which the VM NIC belongs, does not exist.",
					"solution" : "Contact technical support."
				},
				"0005010233" : {
					"cause" : "The port group does not belong to this virtual switch.",
					"desc" : "The port group does not belong to this virtual switch.",
					"solution" : "Contact technical support."
				},
				"0005010234" : {
					"cause" : "Failed to associate the port group with the subnet.",
					"desc" : "Failed to associate the port group with the subnet.",
					"solution" : "Contact technical support."
				},
				"0005010235" : {
					"cause" : "Failed to associate the port group with the subnet.",
					"desc" : "Failed to associate the port group with the subnet.",
					"solution" : "Contact technical support."
				},
				"0005010236" : {
					"cause" : "Invalid port group ID.",
					"desc" : "Invalid port group ID.",
					"solution" : "Contact technical support."
				},
				"0005010237" : {
					"cause" : "The priority and the bandwidth upper limit must be empty or specified together.",
					"desc" : "The priority and the bandwidth upper limit must be empty or specified together.",
					"solution" : "Contact technical support."
				},
				"0005010238" : {
					"cause" : "Failed to obtain subnet information.",
					"desc" : "Failed to obtain subnet information.",
					"solution" : "Contact technical support."
				},
				"0005010239" : {
					"cause" : "VMs in the port group are not shut down.",
					"desc" : "VMs in the port group are not shut down.",
					"solution" : "Contact technical support."
				},
				"0005010240" : {
					"cause" : "All VMs in the subnet must be shut down before modification of the subnet attributes.",
					"desc" : "All VMs in the subnet must be shut down before modification of the subnet attributes.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010241" : {
					"cause" : "The ID of the uplink port is invalid.",
					"desc" : "The ID of the uplink port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010242" : {
					"cause" : "The uplink port is not unique.",
					"desc" : "The uplink port is not unique.",
					"solution" : "Contact technical support."
				},
				"0005010243" : {
					"cause" : "The status of the uplink port is invalid.",
					"desc" : "The status of the uplink port is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010244" : {
					"cause" : "The aggregation policy is invalid.",
					"desc" : "The aggregation policy is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010245" : {
					"cause" : "The ID of the uplink aggregation port is invalid.",
					"desc" : "The ID of the uplink aggregation port is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010246" : {
					"cause" : "The name of the uplink aggregation port is invalid.",
					"desc" : "The name of the uplink aggregation port is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010247" : {
					"cause" : "The number of uplink ports used for aggregation ranges from 1 to 8.",
					"desc" : "The number of uplink ports used for aggregation ranges from 1 to 8.",
					"solution" : "Contact technical support."
				},
				"0005010248" : {
					"cause" : "Uplink port aggregation cannot be implemented among several iNICs.",
					"desc" : "Uplink port aggregation cannot be implemented among several iNICs.",
					"solution" : "Contact technical support."
				},
				"0005010249" : {
					"cause" : "The uplink port already exists in uplink port aggregation.",
					"desc" : "The uplink port already exists in uplink port aggregation.",
					"solution" : "Contact technical support."
				},
				"0005010250" : {
					"cause" : "Uplink port aggregation cannot be implemented among different types of NICs.",
					"desc" : "Uplink port aggregation cannot be implemented among different types of NICs.",
					"solution" : "Contact technical support."
				},
				"0005010251" : {
					"cause" : "The operation is invalid.",
					"desc" : "The operation is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010252" : {
					"cause" : "The system plane does not exist.",
					"desc" : "The system plane does not exist.",
					"solution" : "Contact technical support."
				},
				"0005010253" : {
					"cause" : "Either the uplink port ID or uplink aggregation port ID can be configured.",
					"desc" : "Either the uplink port ID or uplink aggregation port ID can be configured.",
					"solution" : "Contact technical support."
				},
				"0005010254" : {
					"cause" : "The ID of the system plane is invalid.",
					"desc" : "The ID of the system plane is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010255" : {
					"cause" : "The management system plane cannot be deleted.",
					"desc" : "The management system plane cannot be deleted.",
					"solution" : "Contact technical support."
				},
				"0005010256" : {
					"cause" : "Subnet address conflict.",
					"desc" : "Subnet address conflict.",
					"solution" : "Contact technical support."
				},
				"0005010257" : {
					"cause" : "Invalid priority.",
					"desc" : "Invalid priority.",
					"solution" : "Contact technical support."
				},
				"0005010258" : {
					"cause" : "The CNA failed to create the system plane.",
					"desc" : "The CNA failed to create the system plane.",
					"solution" : "Contact technical support."
				},
				"0005010259" : {
					"cause" : "The bandwidth upper limit is invalid.",
					"desc" : "The bandwidth upper limit is invalid.",
					"solution" : "Contact technical support."
				},
				"0005010260" : {
					"cause" : "The previous task is being executed.",
					"desc" : "The previous task is being executed.",
					"solution" : "Please try later."
				},
				"0005010261" : {
					"cause" : "The name of the virtual switch is invalid.",
					"desc" : "The name of the virtual switch is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010262" : {
					"cause" : "The name of the port group is invalid.",
					"desc" : "The name of the port group is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010263" : {
					"cause" : "The name of the subnet is invalid.",
					"desc" : "The name of the subnet is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010264" : {
					"cause" : "The name of the system plane is invalid.",
					"desc" : "The name of the system plane is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010265" : {
					"cause" : "The name of the system plane is invalid.",
					"desc" : "The name of the system plane is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010266" : {
					"cause" : "The port used to create the system plane does not exist.",
					"desc" : "The port used to create the system plane does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010267" : {
					"cause" : "The number of storage system ports cannot exceed 4.",
					"desc" : "The number of storage system ports cannot exceed 4.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010268" : {
					"cause" : "The system plane already exists.",
					"desc" : "The system plane already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010269" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010270" : {
					"cause" : "The queried parameter is empty.",
					"desc" : "The queried parameter is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010271" : {
					"cause" : "The indicator identifier or name is empty.",
					"desc" : "The indicator identifier or name is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010272" : {
					"cause" : "The urn is empty.",
					"desc" : "The urn is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010273" : {
					"cause" : "The time format is incorrect.",
					"desc" : "The time format is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010274" : {
					"cause" : "The time granularity is incorrect.",
					"desc" : "The time granularity is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010275" : {
					"cause" : "The resource cluster with the same name already exists.",
					"desc" : "The resource cluster with the same name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010276" : {
					"cause" : "Fail to export VM template because of the space of application package partition is insufficient.",
					"desc" : "Fail to export VM template because of the space of application package partition is insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010277" : {
					"cause" : "The host is performing this operation.",
					"desc" : "The host is performing this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010278" : {
					"cause" : "The virtual switch name already exists.",
					"desc" : "The virtual switch name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010279" : {
					"cause" : "The VM cannot be started because it is in the running state.",
					"desc" : "The VM cannot be started because it is in the running state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010280" : {
					"cause" : "The VM is performing this operation.",
					"desc" : "The VM is performing this operation.",
					"solution" : "Please wait for that task to complete."
				},
				"0005010281" : {
					"cause" : "The VM has no disk with a serial number of 1.",
					"desc" : "The VM has no disk with a serial number of 1.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010282" : {
					"cause" : "The VM is in the stopped state.",
					"desc" : "The VM is in the stopped state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010283" : {
					"cause" : "The VM is in hibernation.",
					"desc" : "The VM is in hibernation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010284" : {
					"cause" : "The VM cannot be hibernated because it is in the hibernation state.",
					"desc" : "The VM cannot be hibernated because it is in the hibernation state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010285" : {
					"cause" : "The VM is in the stopping state.",
					"desc" : "The VM is in the stopping state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010286" : {
					"cause" : "The resources of the resource cluster to which the source or destination node belongs are insufficient.",
					"desc" : "The resources of the resource cluster to which the source or destination node belongs are insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010287" : {
					"cause" : "The configuration of the memory overcommitment switches for the source and destination nodes must be the same.",
					"desc" : "The configuration of the memory overcommitment switches for the source and destination nodes must be the same.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010288" : {
					"cause" : "Shared disks exist on the VM or the template disk list.",
					"desc" : "Shared disks exist on the VM or the template disk list.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010289" : {
					"cause" : "VMs with attached CD drivers already exist on the host.",
					"desc" : "VMs with attached CD drivers already exist on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010290" : {
					"cause" : "Failed to query the data.",
					"desc" : "Failed to query the data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010291" : {
					"cause" : "The number of previous passwords that cannot be repeated or password expiry warning (days) is incorrect.",
					"desc" : "The number of previous passwords that cannot be repeated or password expiry warning (days) is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010292" : {
					"cause" : "The username or password is incorrect.",
					"desc" : "The username or password is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010293" : {
					"cause" : "Please change the password during the first login.",
					"desc" : "Please change the password during the first login.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010294" : {
					"cause" : "The password has expired. Please change it.",
					"desc" : "The password has expired. Please change it.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010295" : {
					"cause" : "The password is to expire. Do you want to change it?",
					"desc" : "The password is to expire. Do you want to change it?",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010296" : {
					"cause" : "Login failed.",
					"desc" : "Login failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010297" : {
					"cause" : "The user ID is empty.",
					"desc" : "The user ID is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010298" : {
					"cause" : "The password cannot contain the user name or reverse user name.",
					"desc" : "The password cannot contain the user name or reverse user name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010299" : {
					"cause" : "Invalid password length.",
					"desc" : "Invalid password length.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010300" : {
					"cause" : "It contains special characters",
					"desc" : "It contains special characters",
					"solution" : "Contact technical support."
				},
				"0005010301" : {
					"cause" : "The role name cannot be empty.",
					"desc" : "The role name cannot be empty.",
					"solution" : "Contact technical support."
				},
				"0005010302" : {
					"cause" : "The rights list is empty.",
					"desc" : "The rights list is empty.",
					"solution" : "Contact technical support."
				},
				"0005010303" : {
					"cause" : "A disk with a snapshot taken cannot be attached to other VMs.",
					"desc" : "A disk with a snapshot taken cannot be attached to other VMs.",
					"solution" : "Select a disk for which no snapshot has been taken."
				},
				"0005010304" : {
					"cause" : "The disk type does not allow the current operation.",
					"desc" : "The disk type does not allow the current operation.",
					"solution" : "Contact technical support."
				},
				"0005010305" : {
					"cause" : "Failed to take a snapshot of the VM memory.",
					"desc" : "Failed to take a snapshot of the VM memory.",
					"solution" : "Contact technical support."
				},
				"0005010306" : {
					"cause" : "This VM cannot be converted or cloned into a VM template because a snapshot has been taken for the VM.",
					"desc" : "This VM cannot be converted or cloned into a VM template because a snapshot has been taken for the VM.",
					"solution" : "Delete the VM snapshot or select a VM that does not have a snapshot taken."
				},
				"0005010307" : {
					"cause" : "The host failed to start the vm when using the snapshot to restore the vm.",
					"desc" : "The host failed to start the vm when using the snapshot to restore the vm.",
					"solution" : "Contact technical support."
				},
				"0005010308" : {
					"cause" : "The computing resources are insufficient when this operation is performed on the VM.",
					"desc" : "The computing resources are insufficient when this operation is performed on the VM.",
					"solution" : "Contact technical support."
				},
				"0005010309" : {
					"cause" : "The host is scanning storage devices.",
					"desc" : "The host is scanning storage devices.",
					"solution" : "Contact technical support."
				},
				"0005010310" : {
					"cause" : "The number of data storage devices exceeds 100.",
					"desc" : "The number of data storage devices exceeds 100.",
					"solution" : "Contact technical support."
				},
				"0005010311" : {
					"cause" : "The number of uplinks that are added to the virtual switch reaches the upper limit.",
					"desc" : "The number of uplinks that are added to the virtual switch reaches the upper limit.",
					"solution" : "Contact technical support."
				},
				"0005010312" : {
					"cause" : "The number of port groups reaches the upper limit.",
					"desc" : "The number of port groups reaches the upper limit.",
					"solution" : "Contact technical support."
				},
				"0005010313" : {
					"cause" : "The number of port groups reaches the upper limit.",
					"desc" : "The number of port groups reaches the upper limit.",
					"solution" : "Contact technical support."
				},
				"0005010314" : {
					"cause" : "If the bandwidth upper limit and priority are both left empty previously, they must be specified together.",
					"desc" : "If the bandwidth upper limit and priority are both left empty previously, they must be specified together.",
					"solution" : "Contact technical support."
				},
				"0005010315" : {
					"cause" : "Failed to configure the mapping between CNA NICs.",
					"desc" : "Failed to configure the mapping between CNA NICs.",
					"solution" : "Contact technical support."
				},
				"0005010316" : {
					"cause" : "The uplink port aggregation name already exists.",
					"desc" : "The uplink port aggregation name already exists.",
					"solution" : "Contact technical support."
				},
				"0005010317" : {
					"cause" : "The rates of member ports in the uplink port aggregation are inconsistent.",
					"desc" : "The rates of member ports in the uplink port aggregation are inconsistent.",
					"solution" : "Contact technical support."
				},
				"0005010318" : {
					"cause" : "The uplink port is not a member port of the uplink port aggregation.",
					"desc" : "The uplink port is not a member port of the uplink port aggregation.",
					"solution" : "Contact technical support."
				},
				"0005010319" : {
					"cause" : "The first port in the management uplink port aggregation that the system automatically creates cannot be deleted.",
					"desc" : "The first port in the management uplink port aggregation that the system automatically creates cannot be deleted.",
					"solution" : "Contact technical support."
				},
				"0005010320" : {
					"cause" : "The parameter to be modified must be entered.",
					"desc" : "The parameter to be modified must be entered.",
					"solution" : "Contact technical support."
				},
				"0005010321" : {
					"cause" : "The uplink port aggregation does not exist on the current host.",
					"desc" : "The uplink port aggregation does not exist on the current host.",
					"solution" : "Contact technical support."
				},
				"0005010322" : {
					"cause" : "Uplink port ID and operation must either exist or disappear at the same time.",
					"desc" : "Uplink port ID and operation must either exist or disappear at the same time.",
					"solution" : "Contact technical support."
				},
				"0005010323" : {
					"cause" : "You can delete only one port from an uplink port aggregation at a time.",
					"desc" : "You can delete only one port from an uplink port aggregation at a time.",
					"solution" : "Contact technical support."
				},
				"0005010324" : {
					"cause" : "Retain at least one port for an uplink port aggregation when deleting ports from the uplink port aggregation.",
					"desc" : "Retain at least one port for an uplink port aggregation when deleting ports from the uplink port aggregation.",
					"solution" : "Contact technical support."
				},
				"0005010325" : {
					"cause" : "You must add at least one port to an uplink port aggregation at a time.",
					"desc" : "You must add at least one port to an uplink port aggregation at a time.",
					"solution" : "Contact technical support."
				},
				"0005010326" : {
					"cause" : "The system plane does not exist on the current host.",
					"desc" : "The system plane does not exist on the current host.",
					"solution" : "Contact technical support."
				},
				"0005010327" : {
					"cause" : "A gateway address cannot be set for the storage link.",
					"desc" : "A gateway address cannot be set for the storage link.",
					"solution" : "Contact technical support."
				},
				"0005010328" : {
					"cause" : "The system plane name already exists.",
					"desc" : "The system plane name already exists.",
					"solution" : "Contact technical support."
				},
				"0005010329" : {
					"cause" : "Tasks of this type cannot be canceled.",
					"desc" : "Tasks of this type cannot be canceled.",
					"solution" : "Contact technical support."
				},
				"0005010330" : {
					"cause" : "A completed task cannot be canceled.",
					"desc" : "A completed task cannot be canceled.",
					"solution" : "Ensure that the task has not completed before canceling the task."
				},
				"0005010331" : {
					"cause" : "Failed to query data. Please try later.",
					"desc" : "Failed to query data. Please try later.",
					"solution" : "Contact technical support."
				},
				"0005010332" : {
					"cause" : "Failed to attach the disk on the VRM.",
					"desc" : "Failed to attach the disk on the VRM.",
					"solution" : "Contact technical support."
				},
				"0005010333" : {
					"cause" : "The operation conflicts with ongoing operations of the object.",
					"desc" : "The operation conflicts with ongoing operations of the object.",
					"solution" : "Contact technical support."
				},
				"0005010334" : {
					"cause" : "Stop the virtual machine.",
					"desc" : "Stop the virtual machine.",
					"solution" : "Contact technical support."
				},
				"0005010335" : {
					"cause" : "Failed to send the command on the VRM.",
					"desc" : "Failed to send the command on the VRM.",
					"solution" : "Contact technical support."
				},
				"0005010336" : {
					"cause" : "Failed to send the command on the VRM.",
					"desc" : "Failed to send the command on the VRM.",
					"solution" : "Contact technical support."
				},
				"0005010337" : {
					"cause" : "Failed to connect to a remote device on the host.",
					"desc" : "Failed to connect to a remote device on the host.",
					"solution" : "Contact technical support."
				},
				"0005010338" : {
					"cause" : "Failed to access a remote file on the host.",
					"desc" : "Failed to access a remote file on the host.",
					"solution" : "Contact technical support."
				},
				"0005010339" : {
					"cause" : "Failed to access a remote file on the host.",
					"desc" : "Failed to access a remote file on the host.",
					"solution" : "Contact technical support."
				},
				"0005010340" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Insufficient resources, please try later."
				},
				"0005010341" : {
					"cause" : "Failed to connect to the host on the VRM.",
					"desc" : "Failed to connect to the host on the VRM.",
					"solution" : "Contact technical support."
				},
				"0005010342" : {
					"cause" : "Duplicate NIC name.",
					"desc" : "Duplicate NIC name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010343" : {
					"cause" : "A VM that is being cloned cannot be deleted or started.",
					"desc" : "A VM that is being cloned cannot be deleted or started.",
					"solution" : "Please try later."
				},
				"0005010344" : {
					"cause" : "The storage types of the source data and destination data are different.",
					"desc" : "The storage types of the source data and destination data are different.",
					"solution" : "Contact technical support."
				},
				"0005010345" : {
					"cause" : "No computing node is found for copying the disk during the cloning.",
					"desc" : "No computing node is found for copying the disk during the cloning.",
					"solution" : "Contact technical support."
				},
				"0005010346" : {
					"cause" : "Linked cloning is not supported, because the storage type is SAN or LOCAL.",
					"desc" : "Linked cloning is not supported, because the storage type is SAN or LOCAL.",
					"solution" : "Contact technical support."
				},
				"0005010347" : {
					"cause" : "Memory snapshots cannot be created for a stopped VM.",
					"desc" : "Memory snapshots cannot be created for a stopped VM.",
					"solution" : "Contact technical support."
				},
				"0005010348" : {
					"cause" : "The Tools is not running.",
					"desc" : "The Tools is not running.",
					"solution" : "Install and start the Tools on the VM and try again."
				},
				"0005010349" : {
					"cause" : "Incorrect input parameter.",
					"desc" : "Incorrect input parameter.",
					"solution" : "Contact technical support."
				},
				"0005010350" : {
					"cause" : "Failed to restore the VM.",
					"desc" : "Failed to restore the VM.",
					"solution" : "Contact technical support."
				},
				"0005010351" : {
					"cause" : "VM template does not exist.",
					"desc" : "VM template does not exist.",
					"solution" : "Contact technical support."
				},
				"0005010352" : {
					"cause" : "Migration failed. A snapshot is being created on the VM or used to restore the VM.",
					"desc" : "Migration failed. A snapshot is being created on the VM or used to restore the VM.",
					"solution" : "Please try later."
				},
				"0005010353" : {
					"cause" : "The host is not in maintenance mode.",
					"desc" : "The host is not in maintenance mode.",
					"solution" : "Ensure that the host is in maintenance mode and try again."
				},
				"0005010354" : {
					"cause" : "Failed to migrate all VMs on the host because the host is faulty.",
					"desc" : "Failed to migrate all VMs on the host because the host is faulty.",
					"solution" : "Contact technical support."
				},
				"0005010355" : {
					"cause" : "Insufficient CPU resources, please check CPU cores, CPU reserved and CPU limit.",
					"desc" : "Insufficient CPU resources, please check CPU cores, CPU reserved and CPU limit.",
					"solution" : "Contact technical support."
				},
				"0005010356" : {
					"cause" : "Insufficient memory, please check memory cores, memory reserved and memory limit.",
					"desc" : "Insufficient memory, please check memory cores, memory reserved and memory limit.",
					"solution" : "Contact technical support."
				},
				"0005010357" : {
					"cause" : "The number of created NICs on the host exceeds the upper limit.",
					"desc" : "The number of created NICs on the host exceeds the upper limit.",
					"solution" : "Contact technical support."
				},
				"0005010358" : {
					"cause" : "All the hosts in the selected cluster are abnormal.",
					"desc" : "All the hosts in the selected cluster are abnormal.",
					"solution" : "Contact technical support."
				},
				"0005010359" : {
					"cause" : "All the hosts in the selected cluster are in maintenance mode.",
					"desc" : "All the hosts in the selected cluster are in maintenance mode.",
					"solution" : "Contact technical support."
				},
				"0005010360" : {
					"cause" : "All the hosts in the selected cluster are unavailable.",
					"desc" : "All the hosts in the selected cluster are unavailable.",
					"solution" : "Contact technical support."
				},
				"0005010361" : {
					"cause" : "No available host.",
					"desc" : "No available host.",
					"solution" : "Contact technical support."
				},
				"0005010362" : {
					"cause" : "The host is busy. Please try later.",
					"desc" : "The host is busy. Please try later.",
					"solution" : "The host is busy. Please try later."
				},
				"0005010363" : {
					"cause" : "Only one NIC on the VM can be assigned with a gateway.",
					"desc" : "Only one NIC on the VM can be assigned with a gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010364" : {
					"cause" : "The host does not belong to the cluster.",
					"desc" : "The host does not belong to the cluster.",
					"solution" : "Contact technical support."
				},
				"0005010365" : {
					"cause" : "This operation is not allowed on the VM.",
					"desc" : "This operation is not allowed on the VM.",
					"solution" : "Contact technical support."
				},
				"0005010366" : {
					"cause" : "The VM is being cloned and does not support disk operations.",
					"desc" : "The VM is being cloned and does not support disk operations.",
					"solution" : "Please try later."
				},
				"0005010367" : {
					"cause" : "Inconsistent VM storage status.",
					"desc" : "Inconsistent VM storage status.",
					"solution" : "Contact technical support."
				},
				"0005010368" : {
					"cause" : "The data storage to which the VM belongs does not support snapshot creation.",
					"desc" : "The data storage to which the VM belongs does not support snapshot creation.",
					"solution" : "Contact technical support."
				},
				"0005010369" : {
					"cause" : "The current version does not support this USB controller type.",
					"desc" : "The current version does not support this USB controller type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010370" : {
					"cause" : "The controller of this type has been added to the VM.",
					"desc" : "The controller of this type has been added to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010371" : {
					"cause" : "The controller of this type is not added to the VM.",
					"desc" : "The controller of this type is not added to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010372" : {
					"cause" : "USB devices exist in the USB controller.",
					"desc" : "USB devices exist in the USB controller.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010373" : {
					"cause" : "The USB device has been allocated.",
					"desc" : "The USB device has been allocated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010374" : {
					"cause" : "The VM and USB device are on different hosts.",
					"desc" : "The VM and USB device are on different hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010375" : {
					"cause" : "The USB device is on another host.",
					"desc" : "The USB device is on another host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010376" : {
					"cause" : "The USB device is not allocated.",
					"desc" : "The USB device is not allocated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010377" : {
					"cause" : "The VM to which USB devices have been mounted cannot be migrated.",
					"desc" : "The VM to which USB devices have been mounted cannot be migrated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010378" : {
					"cause" : "The controller of this type is unavailable on the VM.",
					"desc" : "The controller of this type is unavailable on the VM.",
					"solution" : "Please add the controller of this type first."
				},
				"0005010379" : {
					"cause" : "can't bind more usb to the vm.",
					"desc" : "can't bind more usb to the vm.",
					"solution" : "Please remove idle usb."
				},
				"0005010380" : {
					"cause" : "The VM and the USB device are carried on different hosts.",
					"desc" : "The VM and the USB device are carried on different hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010381" : {
					"cause" : "The host providing the USB device is unavailable.",
					"desc" : "The host providing the USB device is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010382" : {
					"cause" : "A memory snapshot cannot be taken for a VM to which a USB device is attached.",
					"desc" : "A memory snapshot cannot be taken for a VM to which a USB device is attached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010383" : {
					"cause" : "The memory of the VM to which a USB device is attached cannot be backed up.",
					"desc" : "The memory of the VM to which a USB device is attached cannot be backed up.",
					"solution" : "Contact technical support."
				},
				"0005010384" : {
					"cause" : "Failed to send a message to the host.",
					"desc" : "Failed to send a message to the host.",
					"solution" : "Contact technical support."
				},
				"0005010385" : {
					"cause" : "The host returns the operation failed.",
					"desc" : "The host returns the operation failed.",
					"solution" : "Please contact technical support engineers."
				},
				"0005010386" : {
					"cause" : "The modification can take effect only after the VM is restarted.",
					"desc" : "The modification can take effect only after the VM is restarted.",
					"solution" : "Restart the VM."
				},
				"0005010387" : {
					"cause" : "Invalid password.",
					"desc" : "Invalid password.",
					"solution" : "Enter a valid password."
				},
				"0005010388" : {
					"cause" : "Invalid workgroup.",
					"desc" : "Invalid workgroup.",
					"solution" : "Enter a valid workgroup."
				},
				"0005010389" : {
					"cause" : "The workgroup and domain cannot coexist.",
					"desc" : "The workgroup and domain cannot coexist.",
					"solution" : "Enter valid parameters."
				},
				"0005010390" : {
					"cause" : "The domain name or the host name of the domain is invalid.",
					"desc" : "The domain name or the host name of the domain is invalid.",
					"solution" : "Enter valid parameters."
				},
				"0005010391" : {
					"cause" : "The NIC name is invalid.",
					"desc" : "The NIC name is invalid.",
					"solution" : "Enter valid parameters."
				},
				"0005010392" : {
					"cause" : "The NIC SN is invalid.",
					"desc" : "The NIC SN is invalid.",
					"solution" : "Enter valid parameters."
				},
				"0005010393" : {
					"cause" : "The gateway information is invalid.",
					"desc" : "The gateway information is invalid.",
					"solution" : "Enter valid parameters."
				},
				"0005010394" : {
					"cause" : "The DNS information is invalid.",
					"desc" : "The DNS information is invalid.",
					"solution" : "Enter valid parameters."
				},
				"0005010395" : {
					"cause" : "The number of customized NICs is different from that of the VM NICs.",
					"desc" : "The number of customized NICs is different from that of the VM NICs.",
					"solution" : "Enter valid parameters."
				},
				"0005010396" : {
					"cause" : "The customized OS type is different from that used by the VM.",
					"desc" : "The customized OS type is different from that used by the VM.",
					"solution" : "Enter valid parameters."
				},
				"0005010397" : {
					"cause" : "The protocol for mounting the CD-ROM drive is invalid.",
					"desc" : "The protocol for mounting the CD-ROM drive is invalid.",
					"solution" : "Use a valid protocol to mount the CD-ROM drive."
				},
				"0005010398" : {
					"cause" : "The VM is busy. Please try later.",
					"desc" : "The VM is busy. Please try later.",
					"solution" : "Please try later."
				},
				"0005010399" : {
					"cause" : "Failed to query the task failure causes.",
					"desc" : "Failed to query the task failure causes.",
					"solution" : "Please log in to the vSphere and check whether the VM hibernation is successful."
				},
				"0005010400" : {
					"cause" : "The system does not support cascading of VRM nodes.",
					"desc" : "The system does not support cascading of VRM nodes.",
					"solution" : "Please contact the system administrator."
				},
				"0005010401" : {
					"cause" : "User authentication failed.",
					"desc" : "User authentication failed.",
					"solution" : "Please contact the system administrator."
				},
				"0005010402" : {
					"cause" : "The target cluster does not exist.",
					"desc" : "The target cluster does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"0005010403" : {
					"cause" : "The storage cluster which associated this host do not allow stopping this host.",
					"desc" : "The storage cluster which associated this host do not allow stopping this host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010404" : {
					"cause" : "The storage cluster which associated this host do not allow restarting this host.",
					"desc" : "The storage cluster which associated this host do not allow restarting this host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010405" : {
					"cause" : "The server has not been added to FusionManager.",
					"desc" : "The server has not been added to FusionManager.",
					"solution" : "Please add the server to FusionManager and try again."
				},
				"0005010406" : {
					"cause" : "Task at this stage is not allowed to cancel.",
					"desc" : "Task at this stage is not allowed to cancel.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010407" : {
					"cause" : "The task has been canceled, unable to perform this operation.",
					"desc" : "The task has been canceled, unable to perform this operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010408" : {
					"cause" : "Failure to cancel the task.",
					"desc" : "Failure to cancel the task.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010409" : {
					"cause" : "User canceled task.",
					"desc" : "User canceled task.",
					"solution" : "Check that the task is reasonably canceled."
				},
				"0005010410" : {
					"cause" : "The current Affected by Snapshot settings of the VM disks conflict with the settings of the disks on the VM when the snapshot is being created. Please check the configurations.",
					"desc" : "The current Affected by Snapshot settings of the VM disks conflict with the settings of the disks on the VM when the snapshot is being created. Please check the configurations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010411" : {
					"cause" : "Failed to discover the cluster because no available data center is found.",
					"desc" : "Failed to discover the cluster because no available data center is found.",
					"solution" : "Check that the hypervisor user's session is active or the cluster to be discovered is managed in the data center."
				},
				"0005010412" : {
					"cause" : "The shared disk is already attached to the maximum number of VMs.",
					"desc" : "The shared disk is already attached to the maximum number of VMs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010413" : {
					"cause" : "Failed to restore the VM.",
					"desc" : "Failed to restore the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010414" : {
					"cause" : "The host providing the VM does not meet requirements for starting the VM after the VM is restored using the snapshot. Migrate the VM to a proper host first.",
					"desc" : "The host providing the VM does not meet requirements for starting the VM after the VM is restored using the snapshot. Migrate the VM to a proper host first.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010415" : {
					"cause" : "The host in its current state does not support this operation. Please try later.",
					"desc" : "The host in its current state does not support this operation. Please try later.",
					"solution" : "Please check and try again."
				},
				"0005010416" : {
					"cause" : "This operation is not allowed because a storage-related task is in progress on the host.",
					"desc" : "This operation is not allowed because a storage-related task is in progress on the host.",
					"solution" : "Please check and try again."
				},
				"0005010417" : {
					"cause" : "The VM cannot be migrated because a CD/DVD-ROM or tools drive has been mounted to VM.",
					"desc" : "The VM cannot be migrated because a CD/DVD-ROM or tools drive has been mounted to VM.",
					"solution" : "Please try again after unmounting the CD/DVD-ROM."
				},
				"0005010418" : {
					"cause" : "The host is not ready ,please try later.",
					"desc" : "The host is not ready ,please try later.",
					"solution" : "Please check and try again."
				},
				"0005010419" : {
					"cause" : "Create VM consistency snapshot fail because VM status is abnormal.",
					"desc" : "Create VM consistency snapshot fail because VM status is abnormal.",
					"solution" : "Please recheck VM status."
				},
				"0005010420" : {
					"cause" : "Storage Type of datastore does not support this kind of DISK(a non-persistant disk or with snapshot).",
					"desc" : "Storage Type of datastore does not support this kind of DISK(a non-persistant disk or with snapshot).",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010421" : {
					"cause" : "Disks witch less than 4 GB space cannot be expanded.",
					"desc" : "Disks witch less than 4 GB space cannot be expanded.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010422" : {
					"cause" : "The shared disk does not support the modification to the IO upper limit.",
					"desc" : "The shared disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010423" : {
					"cause" : "The current status of the disk does not support the modification to the IO upper limit.",
					"desc" : "The current status of the disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010424" : {
					"cause" : "The disk IO upper limit is being modified and The current status of the disk does not support the modification to the IO upper limit.",
					"desc" : "The disk IO upper limit is being modified and The current status of the disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010425" : {
					"cause" : "The modification to the IO upper limit is failed.",
					"desc" : "The modification to the IO upper limit is failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010426" : {
					"cause" : "The disk does not support the modification to the IO upper limit.",
					"desc" : "The disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010427" : {
					"cause" : "Hosts mount the CD reached the maximum number of virtual machines.",
					"desc" : "Hosts mount the CD reached the maximum number of virtual machines.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010428" : {
					"cause" : "The snapshot is not allowed to be deleted because it has delta disks. Delete the VM with this snapshot deployed and try again.",
					"desc" : "The snapshot is not allowed to be deleted because it has delta disks. Delete the VM with this snapshot deployed and try again.",
					"solution" : "Contact technical support."
				},
				"0005010429" : {
					"cause" : "This operation is not allowed because the VM is created by quick copying.",
					"desc" : "This operation is not allowed because the VM is created by quick copying.",
					"solution" : "Contact technical support."
				},
				"0005010430" : {
					"cause" : "Disk format failed.",
					"desc" : "Disk format failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010431" : {
					"cause" : "Disks with less than 4 GB space cannot be expanded.",
					"desc" : "Disks with less than 4 GB space cannot be expanded.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010432" : {
					"cause" : "Raw device mapping data storage can only create a raw device mapping disks, this is a shared disk type, configuration mode is normal, not affected by snapshots, persistent, with all the data storage space.",
					"desc" : "Raw device mapping data storage can only create a raw device mapping disks, this is a shared disk type, configuration mode is normal, not affected by snapshots, persistent, with all the data storage space.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010433" : {
					"cause" : "Can not modify Non-uniform memory access switch of the cluster because of it has one or more VMs in starting or migrating status.",
					"desc" : "Can not modify Non-uniform memory access switch of the cluster because of it has one or more VMs in starting or migrating status.",
					"solution" : "Please try later."
				},
				"0005010434" : {
					"cause" : "This disk can not bind the virtual machine, the virtual machine join the organization please try again.",
					"desc" : "This disk can not bind the virtual machine, the virtual machine join the organization please try again.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010435" : {
					"cause" : "Set IOweight in host failed.",
					"desc" : "Set IOweight in host failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010436" : {
					"cause" : "Disk has not bind to vm.",
					"desc" : "Disk has not bind to vm.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010437" : {
					"cause" : "Failed to suspend the VM.",
					"desc" : "Failed to suspend the VM.",
					"solution" : "Please contact your administrator."
				},
				"0005010438" : {
					"cause" : "the VM has its CPU or memory hot swapped.",
					"desc" : "the VM has its CPU or memory hot swapped.",
					"solution" : "Do not create snapshots before the VM restarts if the VM has its CPU or memory hot swapped."
				},
				"0005010439" : {
					"cause" : "This VM cannot be cloned into a VM template offline because a snapshot has been taken for the VM.",
					"desc" : "This VM cannot be cloned into a VM template offline because a snapshot has been taken for the VM.",
					"solution" : "Delete the VM snapshot or select a VM that does not have a snapshot taken."
				},
				"0005010440" : {
					"cause" : "A VRM domain supports a maximum of 16 VRMs.",
					"desc" : "A VRM domain supports a maximum of 16 VRMs.",
					"solution" : "A VRM domain supports a maximum of 16 VRMs."
				},
				"0005010441" : {
					"cause" : "The URL length is out of range.",
					"desc" : "The URL length is out of range.",
					"solution" : "The URL length is out of range. Please enter a valid URL."
				},
				"0005010442" : {
					"cause" : "The template cannot be converted to a VM because it contains a linked clone.",
					"desc" : "The template cannot be converted to a VM because it contains a linked clone.",
					"solution" : "Please select another VM template."
				},
				"0005010443" : {
					"cause" : "The graphics card cannot be detached from the VM that is in the current state.",
					"desc" : "The graphics card cannot be detached from the VM that is in the current state.",
					"solution" : "The graphics card cannot be detached from the VM that is in the current state. Please try later."
				},
				"0005010444" : {
					"cause" : "Memory disks do not support migration.",
					"desc" : "Memory disks do not support migration.",
					"solution" : "Please select a disk that can be migrated."
				},
				"0005010445" : {
					"cause" : "Failed to communicate with the other VRM.",
					"desc" : "Failed to communicate with the other VRM.",
					"solution" : "Please contact the system administrator."
				},
				"0005010446" : {
					"cause" : "Failed to migrate because the VM contains shared disks.",
					"desc" : "Failed to migrate because the VM contains shared disks.",
					"solution" : "Please contact the system administrator."
				},
				"0005010447" : {
					"cause" : "A linked clone cannot be repaired.",
					"desc" : "A linked clone cannot be repaired.",
					"solution" : "Please check and try again."
				},
				"0005010448" : {
					"cause" : "This operation cannot be completed as the host is in use by the object such as vm .",
					"desc" : "This operation cannot be completed as the host is in use by the object such as vm .",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010449" : {
					"cause" : "The address prefix is out of range (0 to 32).",
					"desc" : "The address prefix is out of range (0 to 32).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010450" : {
					"cause" : "The object does not exist.",
					"desc" : "The object does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010451" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010452" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010453" : {
					"cause" : "The object already exists.",
					"desc" : "The object already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010454" : {
					"cause" : "The object has been associated.",
					"desc" : "The object has been associated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010455" : {
					"cause" : "The object has been disassociated.",
					"desc" : "The object has been disassociated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010456" : {
					"cause" : "The port binding policy is in use.",
					"desc" : "The port binding policy is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010457" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010458" : {
					"cause" : "The service port is disconnected from the switch port.",
					"desc" : "The service port is disconnected from the switch port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010459" : {
					"cause" : "Failed to obtain the service port number.",
					"desc" : "Failed to obtain the service port number.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010460" : {
					"cause" : "Failed to obtain the switch port number.",
					"desc" : "Failed to obtain the switch port number.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010461" : {
					"cause" : "The subnet to be configured is in use.",
					"desc" : "The subnet to be configured is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010462" : {
					"cause" : "The aggregation switch does not exist.",
					"desc" : "The aggregation switch does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010463" : {
					"cause" : "Operation failed because the object is being created, modified or deleted.",
					"desc" : "Operation failed because the object is being created, modified or deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010464" : {
					"cause" : "The host is powered on or inaccessible.",
					"desc" : "The host is powered on or inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010465" : {
					"cause" : "The host is powered off or inaccessible.",
					"desc" : "The host is powered off or inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010466" : {
					"cause" : "The host is powered off or inaccessible.",
					"desc" : "The host is powered off or inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010467" : {
					"cause" : "Failed to delete the SAN device storage pool because a LUN exists.",
					"desc" : "Failed to delete the SAN device storage pool because a LUN exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010468" : {
					"cause" : "Incorrect next-hop address.",
					"desc" : "Incorrect next-hop address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010469" : {
					"cause" : "The port is not an uplink one.",
					"desc" : "The port is not an uplink one.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010470" : {
					"cause" : "The port to be added or deleted is in use.",
					"desc" : "The port to be added or deleted is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010471" : {
					"cause" : "The configuration policy of the host is used.",
					"desc" : "The configuration policy of the host is used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010472" : {
					"cause" : "The switch has routing services configured.",
					"desc" : "The switch has routing services configured.",
					"solution" : "Delete the routing services on the switch."
				},
				"0005010473" : {
					"cause" : "The protol is invalid.",
					"desc" : "The protol is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010474" : {
					"cause" : "The port range is invalid.",
					"desc" : "The port range is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010475" : {
					"cause" : "The Priority of ACL has already exist.",
					"desc" : "The Priority of ACL has already exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010476" : {
					"cause" : "The device does not exist.",
					"desc" : "The device does not exist.",
					"solution" : "Please refresh the device list."
				},
				"0005010477" : {
					"cause" : "The password does not meet the requirements.",
					"desc" : "The password does not meet the requirements.",
					"solution" : "Please check the user information to the password requirements section."
				},
				"0005010478" : {
					"cause" : "There is no available resource.",
					"desc" : "There is no available resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010479" : {
					"cause" : "Failed to import resource configurations.",
					"desc" : "Failed to import resource configurations.",
					"solution" : "Modify the resource configuration file."
				},
				"0005010480" : {
					"cause" : "There are no enough service sets.",
					"desc" : "There are no enough service sets.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010481" : {
					"cause" : "Device unreachable.",
					"desc" : "Device unreachable.",
					"solution" : "Check the device network."
				},
				"0005010482" : {
					"cause" : "The manual configuration is not completed.",
					"desc" : "The manual configuration is not completed.",
					"solution" : "Check the device configuration information."
				},
				"0005010483" : {
					"cause" : "Save ip, user name, password and other information to UHM failed.",
					"desc" : "Save ip, user name, password and other information to UHM failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010484" : {
					"cause" : "The name already exists.",
					"desc" : "The name already exists.",
					"solution" : "Please enter another name."
				},
				"0005010485" : {
					"cause" : "An exception occurred in file operations.",
					"desc" : "An exception occurred in file operations.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010486" : {
					"cause" : "The data store operation is invalid.",
					"desc" : "The data store operation is invalid.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010487" : {
					"cause" : "The action is not allowed in this state..",
					"desc" : "The action is not allowed in this state..",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010488" : {
					"cause" : "The name is invalid",
					"desc" : "The name is invalid",
					"solution" : "Enter valid parameters."
				},
				"0005010489" : {
					"cause" : "Another operation involving the object is currently in progress.",
					"desc" : "Another operation involving the object is currently in progress.",
					"solution" : "Please try later."
				},
				"0005010490" : {
					"cause" : "This operation is not supported during an upgrade.",
					"desc" : "This operation is not supported during an upgrade.",
					"solution" : "Please try later."
				},
				"0005010491" : {
					"cause" : "Failed to create the connection due to a communication exception.",
					"desc" : "Failed to create the connection due to a communication exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010492" : {
					"cause" : "Login failed because the username or password is incorrect.",
					"desc" : "Login failed because the username or password is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010493" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010494" : {
					"cause" : "The number of FusionStorage devices has reached the upper limit.",
					"desc" : "The number of FusionStorage devices has reached the upper limit.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010495" : {
					"cause" : "3 times the original password input error.",
					"desc" : "3 times the original password input error.",
					"solution" : "Please wait 5 minute and try again."
				},
				"0005010496" : {
					"cause" : "User does not exist.",
					"desc" : "User does not exist.",
					"solution" : "Please check the user."
				},
				"0005010497" : {
					"cause" : "The local modifications to the uhm user password failure.",
					"desc" : "The local modifications to the uhm user password failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010498" : {
					"cause" : "Process restart failed.",
					"desc" : "Process restart failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010499" : {
					"cause" : "The FusionStorage is communicating with the FusionManager.",
					"desc" : "The FusionStorage is communicating with the FusionManager.",
					"solution" : "Please try again after the ongoing cluster operation is complete."
				},
				"0005010500" : {
					"cause" : "The VMware SDK tool may fail to be installed.",
					"desc" : "The VMware SDK tool may fail to be installed.",
					"solution" : "Install the VMware SDK tool and try again. If the VMware SDK tool is already installed, contact technical support."
				},
				"0005010501" : {
					"cause" : "Cancel task failed.",
					"desc" : "Cancel task failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010502" : {
					"cause" : "Task status is changed.",
					"desc" : "Task status is changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010503" : {
					"cause" : "Task not exist.",
					"desc" : "Task not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010504" : {
					"cause" : "This type can not be canceled.",
					"desc" : "This type can not be canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011001" : {
					"cause" : "The number of VMs to be operated in batches exceeds 100.",
					"desc" : "The number of VMs to be operated in batches exceeds 100.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011002" : {
					"cause" : "The template which the specified VM related to does not exist,the operation is not supported.",
					"desc" : "The template which the specified VM related to does not exist,the operation is not supported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011003" : {
					"cause" : "Failed to restore the VM because the number of VM disks has reached the upper limit.",
					"desc" : "Failed to restore the VM because the number of VM disks has reached the upper limit.",
					"solution" : "Contact technical support."
				},
				"0005011004" : {
					"cause" : "The VM is already being restored.",
					"desc" : "The VM is already being restored.",
					"solution" : "Please try later."
				},
				"0005011005" : {
					"cause" : "The number of VMs to be migrated in batches exceeds 40.",
					"desc" : "The number of VMs to be migrated in batches exceeds 40.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011006" : {
					"cause" : "The number of VMs for which disk resources are to be reclaimed in batches exceeded 40.",
					"desc" : "The number of VMs for which disk resources are to be reclaimed in batches exceeded 40.",
					"solution" : "Select less than 40 VMs."
				},
				"0005011007" : {
					"cause" : "Failed to attach disks to the VM.",
					"desc" : "Failed to attach disks to the VM.",
					"solution" : "Please try later."
				},
				"0005011008" : {
					"cause" : "Failed to delete the disk from the VM.",
					"desc" : "Failed to delete the disk from the VM.",
					"solution" : "Please try later."
				},
				"0005011009" : {
					"cause" : "Failed to attach the disk to the VM. The rollback operation failed.",
					"desc" : "Failed to attach the disk to the VM. The rollback operation failed.",
					"solution" : "Contact technical support."
				},
				"0005011010" : {
					"cause" : "Failed to detach the disk from the VM. The rollback operation failed.",
					"desc" : "Failed to detach the disk from the VM. The rollback operation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011011" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011012" : {
					"cause" : "Failed to restore the VM due to VM status conflict. Only running or stopped VMs can be restored.",
					"desc" : "Failed to restore the VM due to VM status conflict. Only running or stopped VMs can be restored.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011013" : {
					"cause" : "The current user does not belong to any domain.",
					"desc" : "The current user does not belong to any domain.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011014" : {
					"cause" : "Task execution failed.",
					"desc" : "Task execution failed.",
					"solution" : "Please Login the Vcenter View the detailed."
				},
				"0005011015" : {
					"cause" : "An exception occurred during migration.",
					"desc" : "An exception occurred during migration.",
					"solution" : "Contact technical support."
				},
				"0005011016" : {
					"cause" : "A task for this VM is not complete.",
					"desc" : "A task for this VM is not complete.",
					"solution" : "Please try later."
				},
				"0005011017" : {
					"cause" : "The NIC does not exist.",
					"desc" : "The NIC does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011018" : {
					"cause" : "Hypervisor inner error.",
					"desc" : "Hypervisor inner error.",
					"solution" : "Hypervisor inner error, please try later."
				},
				"0005011019" : {
					"cause" : "This operation is not allowed because the snapshot is in use.",
					"desc" : "This operation is not allowed because the snapshot is in use.",
					"solution" : "Contact technical support."
				},
				"0005011020" : {
					"cause" : "The VM in the current state does not support this operation.",
					"desc" : "The VM in the current state does not support this operation.",
					"solution" : "Ensure that the VM status supports this operation."
				},
				"0005011021" : {
					"cause" : "This operation is not supported because the VM in its current state only supports the change of the CPU quantity to a double of the current number of CPUs.",
					"desc" : "This operation is not supported because the VM in its current state only supports the change of the CPU quantity to a double of the current number of CPUs.",
					"solution" : "Ensure that the VM status supports this operation."
				},
				"0005011022" : {
					"cause" : "The datastore status does not support this operation or not bind all hosts in the cluster.",
					"desc" : "The datastore status does not support this operation or not bind all hosts in the cluster.",
					"solution" : "Ensure that the datastore status supports this operation or bind all hosts in the cluster."
				},
				"0005011023" : {
					"cause" : "This MAC address is not configured nor contained in the MAC address segment. Choose Resources > Virtualization Resources > Hypervisors to configure the MAC address for the hypervisor.",
					"desc" : "This MAC address is not configured nor contained in the MAC address segment. Choose Resources > Virtualization Resources > Hypervisors to configure the MAC address for the hypervisor.",
					"solution" : "Enter a configured MAC address or select a MAC address that is contained in the MAC address segment."
				},
				"0005011024" : {
					"cause" : "The MAC address already exists.",
					"desc" : "The MAC address already exists.",
					"solution" : "Select a MAC address that is not configured."
				},
				"0005011025" : {
					"cause" : "CPU resources in the cluster are insufficient.",
					"desc" : "CPU resources in the cluster are insufficient.",
					"solution" : "Please check resources."
				},
				"0005011026" : {
					"cause" : "Memory resources in the cluster are insufficient.",
					"desc" : "Memory resources in the cluster are insufficient.",
					"solution" : "Please check resources."
				},
				"0005011027" : {
					"cause" : "Storage resources in the cluster are insufficient.",
					"desc" : "Storage resources in the cluster are insufficient.",
					"solution" : "Please check resources."
				},
				"0005011028" : {
					"cause" : "CPU resources in the orgVDC are insufficient.",
					"desc" : "CPU resources in the orgVDC are insufficient.",
					"solution" : "Please check resources."
				},
				"0005011029" : {
					"cause" : "Memory resources in the orgVDC are insufficient.",
					"desc" : "Memory resources in the orgVDC are insufficient.",
					"solution" : "Please check resources."
				},
				"0005011030" : {
					"cause" : "Storage resources in the orgVDC are insufficient.",
					"desc" : "Storage resources in the orgVDC are insufficient.",
					"solution" : "Please check resources."
				},
				"0005011031" : {
					"cause" : "A delete task for this VM or VM template is not complete.",
					"desc" : "A delete task for this VM or VM template is not complete.",
					"solution" : "Please wait for that task to complete."
				},
				"0005011032" : {
					"cause" : "This template is not a VM template.",
					"desc" : "This template is not a VM template.",
					"solution" : "Please select a VM template."
				},
				"0005011033" : {
					"cause" : "The host status is abnormal.",
					"desc" : "The host status is abnormal.",
					"solution" : "Ensure that the host status is normal."
				},
				"0005011034" : {
					"cause" : "The free physical memory of the host is insufficient when iCache is configured.",
					"desc" : "The free physical memory of the host is insufficient when iCache is configured.",
					"solution" : "Please try later later."
				},
				"0005011035" : {
					"cause" : "Memory capacity expansion timed out when iCache is configured.",
					"desc" : "Memory capacity expansion timed out when iCache is configured.",
					"solution" : "Please try later later."
				},
				"0005011036" : {
					"cause" : "Memory capacity reduction failed when iCache configurations are cleared.",
					"desc" : "Memory capacity reduction failed when iCache configurations are cleared.",
					"solution" : "Please try later later."
				},
				"0005011037" : {
					"cause" : "The memory to be released exceeded the limit.",
					"desc" : "The memory to be released exceeded the limit.",
					"solution" : "Please try later later."
				},
				"0005011038" : {
					"cause" : "The underlying-layer processing is abnormal when iCache is configured.",
					"desc" : "The underlying-layer processing is abnormal when iCache is configured.",
					"solution" : "Please try later later."
				},
				"0005011039" : {
					"cause" : "The template is configured with iCache.",
					"desc" : "The template is configured with iCache.",
					"solution" : "None."
				},
				"0005011040" : {
					"cause" : "The system disk of the template is a nonpersistent disk.",
					"desc" : "The system disk of the template is a nonpersistent disk.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"0005011041" : {
					"cause" : "The template does not contain a system disk.",
					"desc" : "The template does not contain a system disk.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"0005011042" : {
					"cause" : "The template is configured with iCache.",
					"desc" : "The template is configured with iCache.",
					"solution" : "Select a VM with iCache not configured."
				},
				"0005011043" : {
					"cause" : "The template contains linked clone VMs.",
					"desc" : "The template contains linked clone VMs.",
					"solution" : "Select a VM with iCache not configured."
				},
				"0005011044" : {
					"cause" : "The number of templates with iCache configured exceeded the upper limit.",
					"desc" : "The number of templates with iCache configured exceeded the upper limit.",
					"solution" : "None."
				},
				"0005011045" : {
					"cause" : "This VM does not support the linked clone technology.",
					"desc" : "This VM does not support the linked clone technology.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"0005011046" : {
					"cause" : "The VM of this storage type does not support iCache configurations.",
					"desc" : "The VM of this storage type does not support iCache configurations.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"0005011047" : {
					"cause" : "No CD-ROM drive is available on the VM.",
					"desc" : "No CD-ROM drive is available on the VM.",
					"solution" : "Contact technical support."
				},
				"0005011048" : {
					"cause" : "VM templates do not support this operation.",
					"desc" : "VM templates do not support this operation.",
					"solution" : "Please select a VM that is not a VM template."
				},
				"0005011049" : {
					"cause" : "This NIC does not exist on the VM.",
					"desc" : "This NIC does not exist on the VM.",
					"solution" : "Please select a proper NIC."
				},
				"0005011050" : {
					"cause" : "There is virtual machine selected by resource group already not exist.",
					"desc" : "There is virtual machine selected by resource group already not exist.",
					"solution" : "Please refresh the page and select the existing virtual machine."
				},
				"0005011051" : {
					"cause" : "There is host selected by resource group already not exist.",
					"desc" : "There is host selected by resource group already not exist.",
					"solution" : "Please refresh the page and select the existing host."
				},
				"0005011052" : {
					"cause" : "There is another VM disk operation in progress, not support new operation.",
					"desc" : "There is another VM disk operation in progress, not support new operation.",
					"solution" : "Please try later."
				},
				"0005011053" : {
					"cause" : "The system disk is not allowed to be deleted on line.",
					"desc" : "The system disk is not allowed to be deleted on line.",
					"solution" : "Please shutdown the vm before deleting."
				},
				"0005011054" : {
					"cause" : "The vm is not allowed to delete when it's not stopped.",
					"desc" : "The vm is not allowed to delete when it's not stopped.",
					"solution" : "Please shutdown the vm before deleting."
				},
				"0005011055" : {
					"cause" : "The vm is not allowed to set reservation larger than limit[{0}].",
					"desc" : "The vm is not allowed to set reservation larger than limit[{0}].",
					"solution" : "Please config vm with valid reservation."
				},
				"0005011056" : {
					"cause" : "Insufficient capacity on each physical CPU.",
					"desc" : "Insufficient capacity on each physical CPU.",
					"solution" : "Contact technical support."
				},
				"0005011057" : {
					"cause" : "SMI-S service exceptions, please log SAN devices to be checked.",
					"desc" : "SMI-S service exceptions, please log SAN devices to be checked.",
					"solution" : "Contact technical support."
				},
				"0005011058" : {
					"cause" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"desc" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"solution" : "Please select disks that support resource reclamation."
				},
				"0005011059" : {
					"cause" : "Failed to create the memory swap disk.",
					"desc" : "Failed to create the memory swap disk.",
					"solution" : "Contact the system administrator."
				},
				"0005011060" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Contact technical support."
				},
				"0005011061" : {
					"cause" : "Failed to delete the vm snapshot.",
					"desc" : "Failed to delete the vm snapshot.",
					"solution" : "Contact technical support."
				},
				"0005011062" : {
					"cause" : "Insufficient host CPU resources.",
					"desc" : "Insufficient host CPU resources.",
					"solution" : "Contact technical support."
				},
				"0005011063" : {
					"cause" : "The specified number of CPUs has exceeded the upper limit {0} supported by the VM OS.",
					"desc" : "The specified number of CPUs has exceeded the upper limit {0} supported by the VM OS.",
					"solution" : "Contact technical support."
				},
				"0005011064" : {
					"cause" : "Failed to expand the disk capacity.",
					"desc" : "Failed to expand the disk capacity.",
					"solution" : "Please confirm the maximum disk size supported by the data store."
				},
				"0005011065" : {
					"cause" : "Cannot take a memory snapshot, since the virtual machine is configured with independent disks.",
					"desc" : "Cannot take a memory snapshot, since the virtual machine is configured with independent disks.",
					"solution" : "Contact technical support."
				},
				"0005011066" : {
					"cause" : "Virtual machine is configured to use a device that prevents the operation, such as disk is not in persistent mode.",
					"desc" : "Virtual machine is configured to use a device that prevents the operation, such as disk is not in persistent mode.",
					"solution" : "Contact technical support."
				},
				"0005011067" : {
					"cause" : "The VM has a snapshot.",
					"desc" : "The VM has a snapshot.",
					"solution" : "Delete the VM snapshot (if allowed) and try again."
				},
				"0005011068" : {
					"cause" : "The storage device of this type supports only thin-provisioned disks.",
					"desc" : "The storage device of this type supports only thin-provisioned disks.",
					"solution" : "Please select thin disk to create."
				},
				"0005011069" : {
					"cause" : "Readable and writable storage space is insufficient.",
					"desc" : "Readable and writable storage space is insufficient.",
					"solution" : "Ensure that the data store has sufficient storage space."
				},
				"0005011070" : {
					"cause" : "This disk cannot be reclaimed. If it contains a snapshot, delete the snapshot and try again. If it is a non-thin-provisioning disk, a shared disk, a system disk on a linked clone, or it uses non-virtualized storage resources, it cannot be reclaimed.",
					"desc" : "This disk cannot be reclaimed. If it contains a snapshot, delete the snapshot and try again. If it is a non-thin-provisioning disk, a shared disk, a system disk on a linked clone, or it uses non-virtualized storage resources, it cannot be reclaimed.",
					"solution" : "Select a valid disk."
				},
				"0005011071" : {
					"cause" : "Resource reclamation can be performed for only hibernated or stopped VM.",
					"desc" : "Resource reclamation can be performed for only hibernated or stopped VM.",
					"solution" : "Select a hibernated or stopped VM."
				},
				"0005011072" : {
					"cause" : "Failed to reclaim disk resources.",
					"desc" : "Failed to reclaim disk resources.",
					"solution" : "Contact technical support."
				},
				"0005011073" : {
					"cause" : "Memory swap disks cannot be reclaimed.",
					"desc" : "Memory swap disks cannot be reclaimed.",
					"solution" : "Select other disks."
				},
				"0005011074" : {
					"cause" : "VM templates do not support resource reclamation.",
					"desc" : "VM templates do not support resource reclamation.",
					"solution" : "Select a common VM."
				},
				"0005011075" : {
					"cause" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"desc" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"solution" : "Please select disks that support resource reclamation."
				},
				"0005011076" : {
					"cause" : "A snapshot request on a vm whose state has not changed since a previous successful snapshot.",
					"desc" : "A snapshot request on a vm whose state has not changed since a previous successful snapshot.",
					"solution" : "Please try again when vm state changed."
				},
				"0005011077" : {
					"cause" : "A VMotion interface is not configured (or is misconfigured) on either the source or destination host.",
					"desc" : "A VMotion interface is not configured (or is misconfigured) on either the source or destination host.",
					"solution" : "Contact technical support."
				},
				"0005011078" : {
					"cause" : "The host has an invalid state.",
					"desc" : "The host has an invalid state.",
					"solution" : "Contact technical support."
				},
				"0005011079" : {
					"cause" : "Execute VM command timeout.",
					"desc" : "Execute VM command timeout.",
					"solution" : "Contact technical support."
				},
				"0005011080" : {
					"cause" : "VM delete failed: there is elastic ip or NAPT assigned to the nic.",
					"desc" : "VM delete failed: there is elastic ip or NAPT assigned to the nic.",
					"solution" : "Contact technical support."
				},
				"0005011081" : {
					"cause" : "The VM does not support online VM cloning because the number of VM snapshots exceeds the upper limit.",
					"desc" : "The VM does not support online VM cloning because the number of VM snapshots exceeds the upper limit.",
					"solution" : "Contact technical support."
				},
				"0005011082" : {
					"cause" : "VM has independent disks, and is not allowed to finish this operation.",
					"desc" : "VM has independent disks, and is not allowed to finish this operation.",
					"solution" : "Please firstly delete independent disks and try again."
				},
				"0005011083" : {
					"cause" : "VM has no-virtual type disks, and is not allowed to finish this operation.",
					"desc" : "VM has no-virtual type disks, and is not allowed to finish this operation.",
					"solution" : "Contact technical support."
				},
				"0005011084" : {
					"cause" : "The NIC is exist.",
					"desc" : "The NIC is exist.",
					"solution" : "Please refresh the page and add NIC again."
				},
				"0005011085" : {
					"cause" : "The guest operating system is not supported.",
					"desc" : "The guest operating system is not supported.",
					"solution" : "Please select other operating system."
				},
				"0005011086" : {
					"cause" : "VM is in vm-group of DRS resource group management.",
					"desc" : "VM is in vm-group of DRS resource group management.",
					"solution" : "Please delete vm from vm-group and try again."
				},
				"0005011087" : {
					"cause" : "No host is compatible with the virtual machine.",
					"desc" : "No host is compatible with the virtual machine.",
					"solution" : "Contact technical support."
				},
				"0005011088" : {
					"cause" : "The information filled is error when CD-ROM is attached.",
					"desc" : "The information filled is error when CD-ROM is attached.",
					"solution" : "Contact the system administrator."
				},
				"0005011089" : {
					"cause" : "This VM has locked the DVD drive tray, so the DVD cannot be ejected.",
					"desc" : "This VM has locked the DVD drive tray, so the DVD cannot be ejected.",
					"solution" : "Please reboot the VM."
				},
				"0005011090" : {
					"cause" : "Operation could not be performed because the drive is empty.",
					"desc" : "Operation could not be performed because the drive is empty.",
					"solution" : "Please make sure the drive is not empty."
				},
				"0005011091" : {
					"cause" : "The path is incorrect or the installation file is not stored in this path.",
					"desc" : "The path is incorrect or the installation file is not stored in this path.",
					"solution" : "Ensure that the path is correct and the installation file is stored in this path."
				},
				"0005011092" : {
					"cause" : "The VM bind HBA card failed.",
					"desc" : "The VM bind HBA card failed.",
					"solution" : "Contact the system administrator."
				},
				"0005011093" : {
					"cause" : "The VM unbind HBA card failed.",
					"desc" : "The VM unbind HBA card failed.",
					"solution" : "Contact the system administrator."
				},
				"0005011094" : {
					"cause" : "The HBA card had been bound to other VM.",
					"desc" : "The HBA card had been bound to other VM.",
					"solution" : "Please choose other HBA card."
				},
				"0005011095" : {
					"cause" : "The VM has bound HBA card.",
					"desc" : "The VM has bound HBA card.",
					"solution" : "Please first unbind the HBA card."
				},
				"0005011096" : {
					"cause" : "The VM has no bound HBA card.",
					"desc" : "The VM has no bound HBA card.",
					"solution" : "The VM has no bound HBA card and so can not execute unbind operation."
				},
				"0005011097" : {
					"cause" : "The VM doesn't has a memory swap disk, so can not hibernate it.",
					"desc" : "The VM doesn't has a memory swap disk, so can not hibernate it.",
					"solution" : "Please make the memory swap disk feature on."
				},
				"0005011098" : {
					"cause" : "The VM has been incorporated into FusionManager.",
					"desc" : "The VM has been incorporated into FusionManager.",
					"solution" : "Please choose a VM has not been incorporated into FusionManager."
				},
				"0005011099" : {
					"cause" : "Failed to incorporate the VM because it is used by an application instance.",
					"desc" : "Failed to incorporate the VM because it is used by an application instance.",
					"solution" : "Select a VM that is not used by an application instance."
				},
				"0005011100" : {
					"cause" : "The selected data storages contains data storages which is inaccessible for the source VM.",
					"desc" : "The selected data storages contains data storages which is inaccessible for the source VM.",
					"solution" : "Please choose other data storages."
				},
				"0005011101" : {
					"cause" : "Can not access vm config file.",
					"desc" : "Can not access vm config file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011102" : {
					"cause" : "The task is already canceled or complete.",
					"desc" : "The task is already canceled or complete.",
					"solution" : "Refresh the page and try again."
				},
				"0005011103" : {
					"cause" : "VMware remote exception.",
					"desc" : "VMware remote exception.",
					"solution" : "Contact technical support."
				},
				"0005011104" : {
					"cause" : "VMware runtime fault.",
					"desc" : "VMware runtime fault.",
					"solution" : "Contact technical support."
				},
				"0005011105" : {
					"cause" : "This task cannot be canceled.",
					"desc" : "This task cannot be canceled.",
					"solution" : "Contact technical support."
				},
				"0005011106" : {
					"cause" : "The VM status was changed during migration.",
					"desc" : "The VM status was changed during migration.",
					"solution" : "Contact technical support."
				},
				"0005011107" : {
					"cause" : "Restoration of the suspended VM failed on the host.",
					"desc" : "Restoration of the suspended VM failed on the host.",
					"solution" : "Contact technical support."
				},
				"0005011108" : {
					"cause" : "The current state of the vm does not allow this operation, please shutdown the vm and try again.",
					"desc" : "The current state of the vm does not allow this operation, please shutdown the vm and try again.",
					"solution" : "Please shutdown the vm and try again."
				},
				"0005011109" : {
					"cause" : "The operation of configuring iCache was partially failed.",
					"desc" : "The operation of configuring iCache was partially failed.",
					"solution" : "Contact technical support."
				},
				"0005011110" : {
					"cause" : "This storage type does not support iCache.",
					"desc" : "This storage type does not support iCache.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011111" : {
					"cause" : "The iCache operation failed.",
					"desc" : "The iCache operation failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011112" : {
					"cause" : "The cluster does not contain a data store that supports disks in thick provisioning lazy zeroed mode.",
					"desc" : "The cluster does not contain a data store that supports disks in thick provisioning lazy zeroed mode.",
					"solution" : "Use other types of storage."
				},
				"0005011113" : {
					"cause" : "The virtual machine is being created, the operation is not supported.",
					"desc" : "The virtual machine is being created, the operation is not supported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011114" : {
					"cause" : "Custom specifications do not exist.",
					"desc" : "Custom specifications do not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011115" : {
					"cause" : "The host returned an error message during template importing or exporting.",
					"desc" : "The host returned an error message during template importing or exporting.",
					"solution" : "Please check whether the host is normal."
				},
				"0005011116" : {
					"cause" : "The host failed to connect to the shared directory.",
					"desc" : "The host failed to connect to the shared directory.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"0005011117" : {
					"cause" : "Failed to parse the XML file.",
					"desc" : "Failed to parse the XML file.",
					"solution" : "Please check whether the format of the XML file is correct."
				},
				"0005011118" : {
					"cause" : "The XML file does not match the image, please check the image file.",
					"desc" : "The XML file does not match the image, please check the image file.",
					"solution" : "Please check the image file."
				},
				"0005011119" : {
					"cause" : "Invalid disk size, please enter a valid disk size.",
					"desc" : "Invalid disk size, please enter a valid disk size.",
					"solution" : "Please enter a valid disk size."
				},
				"0005011120" : {
					"cause" : "Query volume failed when install patch.",
					"desc" : "Query volume failed when install patch.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011121" : {
					"cause" : "VM system volume not exists.",
					"desc" : "VM system volume not exists.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011122" : {
					"cause" : "VM system volume don't support the operation.",
					"desc" : "VM system volume don't support the operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011123" : {
					"cause" : "Install patch to VM failed.",
					"desc" : "Install patch to VM failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011124" : {
					"cause" : "Current OS type don't support the operation.",
					"desc" : "Current OS type don't support the operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011125" : {
					"cause" : "The disk operation failed.",
					"desc" : "The disk operation failed.",
					"solution" : "Please confirm the maximum disk size supported by the data store."
				},
				"0005011126" : {
					"cause" : "The user of virtual machine cancel hibernate.",
					"desc" : "The user of virtual machine cancel hibernate.",
					"solution" : "Please confirm."
				},
				"0005011127" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a shared disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a shared disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011128" : {
					"cause" : "The NIC used by the VM does not exist or is unavailable.",
					"desc" : "The NIC used by the VM does not exist or is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011129" : {
					"cause" : "The specified VM is not currently resident on the specified host.",
					"desc" : "The specified VM is not currently resident on the specified host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011130" : {
					"cause" : "This operation cannot be performed because the specified VM is protected by xHA.",
					"desc" : "This operation cannot be performed because the specified VM is protected by xHA.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011131" : {
					"cause" : "Cannot find a plan for placement of VMs as there are no other hosts available.",
					"desc" : "Cannot find a plan for placement of VMs as there are no other hosts available.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011132" : {
					"cause" : "Error from bootloader: no bootable disk.",
					"desc" : "Error from bootloader: no bootable disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011133" : {
					"cause" : "The volume is being created.",
					"desc" : "The volume is being created.",
					"solution" : "Please try later."
				},
				"0005011134" : {
					"cause" : "Unable to find partition containing kernel.",
					"desc" : "Unable to find partition containing kernel.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011135" : {
					"cause" : "You attempted to run a VM on a host which doesn't have access to an Storage Repository needed by the VM.",
					"desc" : "You attempted to run a VM on a host which doesn't have access to an Storage Repository needed by the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011136" : {
					"cause" : "The snapshot is failed to delete.",
					"desc" : "The snapshot is failed to delete.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011137" : {
					"cause" : "Create VM failed because the hypervisor not support static inject net.",
					"desc" : "Create VM failed because the hypervisor not support static inject net.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011138" : {
					"cause" : "System copies the disk failed, please try again.",
					"desc" : "System copies the disk failed, please try again.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011139" : {
					"cause" : "Memory reservation must be equal to memory quantity because of no memory swap volume exists in the VM.",
					"desc" : "Memory reservation must be equal to memory quantity because of no memory swap volume exists in the VM.",
					"solution" : "Please enable the memory swapping for the VM or check the memory reservation is equal to the memory quantity."
				},
				"0005011140" : {
					"cause" : "Failed to create the storage device.",
					"desc" : "Failed to create the storage device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011141" : {
					"cause" : "Failed to delete the storage device.",
					"desc" : "Failed to delete the storage device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011142" : {
					"cause" : "Unknown error occurred.",
					"desc" : "Unknown error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011143" : {
					"cause" : "Modify the XML file name failed.",
					"desc" : "Modify the XML file name failed.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"0005011144" : {
					"cause" : "Failed to create the directory for storing exported data.",
					"desc" : "Failed to create the directory for storing exported data.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"0005011145" : {
					"cause" : "Command execution on the host failed.",
					"desc" : "Command execution on the host failed.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"0005011146" : {
					"cause" : "Failed to bind the host which is in maintenance mode.",
					"desc" : "Failed to bind the host which is in maintenance mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011147" : {
					"cause" : "Failed to stop the VM because the VM restarted or an internal exception occurred. Log in to the VM to view the system logs.",
					"desc" : "Failed to stop the VM because the VM restarted or an internal exception occurred. Log in to the VM to view the system logs.",
					"solution" : "Please Log in to the VM to view the system logs."
				},
				"0005011148" : {
					"cause" : "System internal error.",
					"desc" : "System internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011149" : {
					"cause" : "Failed to register the task for restoring VMs.",
					"desc" : "Failed to register the task for restoring VMs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011150" : {
					"cause" : "Failed to stop the VM.",
					"desc" : "Failed to stop the VM.",
					"solution" : "Contact technical support."
				},
				"0005011151" : {
					"cause" : "Failed to use a VM template to clone a new VM.",
					"desc" : "Failed to use a VM template to clone a new VM.",
					"solution" : "Contact technical support."
				},
				"0005011152" : {
					"cause" : "Failed to detach the disk of the old VM.",
					"desc" : "Failed to detach the disk of the old VM.",
					"solution" : "Contact technical support."
				},
				"0005011153" : {
					"cause" : "Failed to detach the disk of the new VM.",
					"desc" : "Failed to detach the disk of the new VM.",
					"solution" : "Contact technical support."
				},
				"0005011154" : {
					"cause" : "Failed to attach the disk from the new VM to the old VM.",
					"desc" : "Failed to attach the disk from the new VM to the old VM.",
					"solution" : "Contact technical support."
				},
				"0005011155" : {
					"cause" : "Failed to attach the disk from the restored VM to the faulty VM.",
					"desc" : "Failed to attach the disk from the restored VM to the faulty VM.",
					"solution" : "Contact technical support."
				},
				"0005011156" : {
					"cause" : "Failed to start the VM.",
					"desc" : "Failed to start the VM.",
					"solution" : "Contact technical support."
				},
				"0005011157" : {
					"cause" : "Failed to delete the new VM.",
					"desc" : "Failed to delete the new VM.",
					"solution" : "Contact technical support."
				},
				"0005011158" : {
					"cause" : "This operation cannot be performed because other tasks are being performed on the VM. Please try later.",
					"desc" : "This operation cannot be performed because other tasks are being performed on the VM. Please try later.",
					"solution" : "Contact technical support."
				},
				"0005011159" : {
					"cause" : "The capacity of the storage where the disk is located is insufficient.",
					"desc" : "The capacity of the storage where the disk is located is insufficient.",
					"solution" : "Please expand the capacity of the storage where the disk is located."
				},
				"0005011160" : {
					"cause" : "The disk capacity can only be expanded.",
					"desc" : "The disk capacity can only be expanded.",
					"solution" : "Please enter a value that is greater than the current disk size."
				},
				"0005011161" : {
					"cause" : "The cluster does not contain a data store that supports disks in thin-provisioning mode.",
					"desc" : "The cluster does not contain a data store that supports disks in thin-provisioning mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011162" : {
					"cause" : "The destination host is faulty.",
					"desc" : "The destination host is faulty.",
					"solution" : "Ensure that the destination host is working properly."
				},
				"0005011163" : {
					"cause" : "The VM file is inaccessible.",
					"desc" : "The VM file is inaccessible.",
					"solution" : "Ensure that a VM file exists."
				},
				"0005011164" : {
					"cause" : "The destination storage space is insufficient.",
					"desc" : "The destination storage space is insufficient.",
					"solution" : "Ensure that the destination storage space is sufficient."
				},
				"0005011165" : {
					"cause" : "A parameter is invalid.",
					"desc" : "A parameter is invalid.",
					"solution" : "Ensure that the entered parameters are valid."
				},
				"0005011166" : {
					"cause" : "The destination data store does not support migration.",
					"desc" : "The destination data store does not support migration.",
					"solution" : "Ensure that the destination data store supports migration."
				},
				"0005011167" : {
					"cause" : "The destination data store is inaccessible.",
					"desc" : "The destination data store is inaccessible.",
					"solution" : "Ensure that the destination data store is in the normal state."
				},
				"0005011168" : {
					"cause" : "The VM template does not support migration.",
					"desc" : "The VM template does not support migration.",
					"solution" : "Ensure that the VM is not a VM template."
				},
				"0005011169" : {
					"cause" : "A system exception occurred.",
					"desc" : "A system exception occurred.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011170" : {
					"cause" : "The migration timed out.",
					"desc" : "The migration timed out.",
					"solution" : "Contact technical support."
				},
				"0005011171" : {
					"cause" : "The migration configuration is incorrect.",
					"desc" : "The migration configuration is incorrect.",
					"solution" : "Contact technical support."
				},
				"0005011172" : {
					"cause" : "A cool migration is being performed for this VM.",
					"desc" : "A cool migration is being performed for this VM.",
					"solution" : "Ensure that the VM status is correct for migration."
				},
				"0005011173" : {
					"cause" : "Failed to register the disk.",
					"desc" : "Failed to register the disk.",
					"solution" : "Contact technical support."
				},
				"0005011174" : {
					"cause" : "The VM status is incorrect.",
					"desc" : "The VM status is incorrect.",
					"solution" : "Ensure that the VM is in the correct statue."
				},
				"0005011175" : {
					"cause" : "The clock mode of the VM is invalid.",
					"desc" : "The clock mode of the VM is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011176" : {
					"cause" : "The VM OS does not support CPU hot add.",
					"desc" : "The VM OS does not support CPU hot add.",
					"solution" : "Contact technical support."
				},
				"0005011177" : {
					"cause" : "The VM does not support CPU hot swapping.",
					"desc" : "The VM does not support CPU hot swapping.",
					"solution" : "Contact technical support."
				},
				"0005011178" : {
					"cause" : "The CPU hot swapping function attribute is modified incorrectly.",
					"desc" : "The CPU hot swapping function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011179" : {
					"cause" : "The VM OS does not support memory installation without stopping the VM.",
					"desc" : "The VM OS does not support memory installation without stopping the VM.",
					"solution" : "Contact technical support."
				},
				"0005011180" : {
					"cause" : "The memory hot swapping function attribute is modified incorrectly.",
					"desc" : "The memory hot swapping function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011181" : {
					"cause" : "An error occurred on the host.",
					"desc" : "An error occurred on the host.",
					"solution" : "Contact technical support."
				},
				"0005011182" : {
					"cause" : "Failed to send messages to the host.",
					"desc" : "Failed to send messages to the host.",
					"solution" : "Contact technical support."
				},
				"0005011183" : {
					"cause" : "Failed to send messages to the host.",
					"desc" : "Failed to send messages to the host.",
					"solution" : "Contact technical support."
				},
				"0005011184" : {
					"cause" : "An error occurred on the host.",
					"desc" : "An error occurred on the host.",
					"solution" : "Contact technical support."
				},
				"0005011185" : {
					"cause" : "The CPU and memory parameters for the running VM are modified successfully. The new CPU parameters can take effect only after the VM restarts.",
					"desc" : "The CPU and memory parameters for the running VM are modified successfully. The new CPU parameters can take effect only after the VM restarts.",
					"solution" : "Contact technical support."
				},
				"0005011186" : {
					"cause" : "The CPU and memory parameters for the running VM are modified successfully. The new memory parameters can take effect only after the VM restarts.",
					"desc" : "The CPU and memory parameters for the running VM are modified successfully. The new memory parameters can take effect only after the VM restarts.",
					"solution" : "Contact technical support."
				},
				"0005011187" : {
					"cause" : "Memory snapshots cannot be created for a VM that uses disks for which the Affected by Snapshot parameter is set to No.",
					"desc" : "Memory snapshots cannot be created for a VM that uses disks for which the Affected by Snapshot parameter is set to No.",
					"solution" : "Contact technical support."
				},
				"0005011188" : {
					"cause" : "The disk does not exist or does not belong to the virtual machine.",
					"desc" : "The disk does not exist or does not belong to the virtual machine.",
					"solution" : "Contact technical support."
				},
				"0005011189" : {
					"cause" : "The virtual machine must be shut down or boot.",
					"desc" : "The virtual machine must be shut down or boot.",
					"solution" : "Contact technical support."
				},
				"0005011190" : {
					"cause" : "The run state virtual machine with snapshot cannot migrate disks.",
					"desc" : "The run state virtual machine with snapshot cannot migrate disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011191" : {
					"cause" : "Virtual machine has the share disk, the operation is not allowed.",
					"desc" : "Virtual machine has the share disk, the operation is not allowed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011192" : {
					"cause" : "Virtual machine is the link to the cloned virtual machine, the operation is not allowed.",
					"desc" : "Virtual machine is the link to the cloned virtual machine, the operation is not allowed.",
					"solution" : "Contact technical support."
				},
				"0005011193" : {
					"cause" : "Preparation of disk failure.",
					"desc" : "Preparation of disk failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011194" : {
					"cause" : "Computing nodes transfer failure.",
					"desc" : "Computing nodes transfer failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011195" : {
					"cause" : "The VMware component does not support this operation.",
					"desc" : "The VMware component does not support this operation.",
					"solution" : "Perform this operation on the FusionCompute."
				},
				"0005011196" : {
					"cause" : "The host and data storage is not related.",
					"desc" : "The host and data storage is not related.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011197" : {
					"cause" : "The VM disk is inaccessible.",
					"desc" : "The VM disk is inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011198" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Refresh the page and try again."
				},
				"0005011199" : {
					"cause" : "File-mode VMs do not support migration in Change host and data store mode.",
					"desc" : "File-mode VMs do not support migration in Change host and data store mode.",
					"solution" : "Select VMs that are not in file mode."
				},
				"0005011200" : {
					"cause" : "Snapshot is not allowed to be created because the VM disks use storage of different types.",
					"desc" : "Snapshot is not allowed to be created because the VM disks use storage of different types.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011201" : {
					"cause" : "The VM configuration is incorrect.",
					"desc" : "The VM configuration is incorrect.",
					"solution" : "Contact technical support."
				},
				"0005011202" : {
					"cause" : "The system does not support this operation.",
					"desc" : "The system does not support this operation.",
					"solution" : "Contact technical support."
				},
				"0005011203" : {
					"cause" : "The VM does not support hot-plugging of CPUs.",
					"desc" : "The VM does not support hot-plugging of CPUs.",
					"solution" : "Contact technical support."
				},
				"0005011204" : {
					"cause" : "Virtual machine State conflict, does not allow this operation.",
					"desc" : "Virtual machine State conflict, does not allow this operation.",
					"solution" : "Please refresh the virtual machine state."
				},
				"0005011205" : {
					"cause" : "The VM does not support hot-plugging of memory.",
					"desc" : "The VM does not support hot-plugging of memory.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011206" : {
					"cause" : "The number of virtual devices exceeds the maximum.",
					"desc" : "The number of virtual devices exceeds the maximum.",
					"solution" : "Contact the system administrator."
				},
				"0005011207" : {
					"cause" : "The host is faulty.",
					"desc" : "The host is faulty.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011208" : {
					"cause" : "VMWare licenses are insufficient.",
					"desc" : "VMWare licenses are insufficient.",
					"solution" : "Please contact your administrator to buy licenses."
				},
				"0005011209" : {
					"cause" : "A VMware Tools response exception occurred.",
					"desc" : "A VMware Tools response exception occurred.",
					"solution" : "Contact the system administrator."
				},
				"0005011210" : {
					"cause" : "Failed to customize the vm when creating the vm.",
					"desc" : "Failed to customize the vm when creating the vm.",
					"solution" : "Please check the VMTemplate is configured correctly."
				},
				"0005011211" : {
					"cause" : "Insufficient resources to satisfy configured failover level for HA.",
					"desc" : "Insufficient resources to satisfy configured failover level for HA.",
					"solution" : "Please choose valid reservation to modify the vm."
				},
				"0005011212" : {
					"cause" : "The host does not have sufficient CPU resources to satisfy the reservation.",
					"desc" : "The host does not have sufficient CPU resources to satisfy the reservation.",
					"solution" : "Please choose valid reservation to modify the vm."
				},
				"0005011213" : {
					"cause" : "The host does not have sufficient Memory resources to satisfy the reservation.",
					"desc" : "The host does not have sufficient Memory resources to satisfy the reservation.",
					"solution" : "Please choose valid reservation to modify the vm."
				},
				"0005011214" : {
					"cause" : "Disks that are not attached to a VM do not support capacity expansion.",
					"desc" : "Disks that are not attached to a VM do not support capacity expansion.",
					"solution" : "Contact technical support."
				},
				"0005011215" : {
					"cause" : "The VM ID in the request is incorrect.",
					"desc" : "The VM ID in the request is incorrect.",
					"solution" : "Contact technical support."
				},
				"0005011216" : {
					"cause" : "The target disk size must be greater than the source disk size.",
					"desc" : "The target disk size must be greater than the source disk size.",
					"solution" : "Please modify the size of disk."
				},
				"0005011217" : {
					"cause" : "The disk contains snapshots or is a system disk of a linked clone.",
					"desc" : "The disk contains snapshots or is a system disk of a linked clone.",
					"solution" : "Contact technical support."
				},
				"0005011218" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005011219" : {
					"cause" : "Expanding the disk capacity...Do not start other disk capacity expansion tasks on the VM.",
					"desc" : "Expanding the disk capacity...Do not start other disk capacity expansion tasks on the VM.",
					"solution" : "Please wait..."
				},
				"0005011220" : {
					"cause" : "VM templates do not support disk capacity.",
					"desc" : "VM templates do not support disk capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011221" : {
					"cause" : "The target disk size must be less than the upper limit of the storage type capacity.",
					"desc" : "The target disk size must be less than the upper limit of the storage type capacity.",
					"solution" : "Please change the size of the target disk to be expanded."
				},
				"0005011222" : {
					"cause" : "Shared disks do not support disk capacity expansion.",
					"desc" : "Shared disks do not support disk capacity expansion.",
					"solution" : "Contact technical support."
				},
				"0005011223" : {
					"cause" : "The storage device of this type does not support nonpersistent disks.",
					"desc" : "The storage device of this type does not support nonpersistent disks.",
					"solution" : "Contact technical support."
				},
				"0005011224" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"solution" : "Contact technical support."
				},
				"0005011225" : {
					"cause" : "Only the normal disk can be unpersistent.",
					"desc" : "Only the normal disk can be unpersistent.",
					"solution" : "Contact technical support."
				},
				"0005011226" : {
					"cause" : "Only the virtual storage disk can be modified the persistent property.",
					"desc" : "Only the virtual storage disk can be modified the persistent property.",
					"solution" : "Contact technical support."
				},
				"0005011227" : {
					"cause" : "Can't query disk from BSB.",
					"desc" : "Can't query disk from BSB.",
					"solution" : "Contact technical support."
				},
				"0005011228" : {
					"cause" : "The status of disk or the status of attached VM is conflicted, cannot modify the persistent property.",
					"desc" : "The status of disk or the status of attached VM is conflicted, cannot modify the persistent property.",
					"solution" : "Contact technical support."
				},
				"0005011229" : {
					"cause" : "The storage device of this type does not support thin-provisioned disks.",
					"desc" : "The storage device of this type does not support thin-provisioned disks.",
					"solution" : "Contact technical support."
				},
				"0005011230" : {
					"cause" : "The Not affected by snapshots setting of the disk cannot be changed because the disk has snapshots created.",
					"desc" : "The Not affected by snapshots setting of the disk cannot be changed because the disk has snapshots created.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011231" : {
					"cause" : "The disk not support migrate.",
					"desc" : "The disk not support migrate.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011232" : {
					"cause" : "The destination data store does not support migration because it is not virtualized.",
					"desc" : "The destination data store does not support migration because it is not virtualized.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011233" : {
					"cause" : "Resize disk failed.",
					"desc" : "Resize disk failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011234" : {
					"cause" : "Disk size is not times of 1024.",
					"desc" : "Disk size is not times of 1024.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011235" : {
					"cause" : "Query migrate progress time out.",
					"desc" : "Query migrate progress time out.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011236" : {
					"cause" : "The task has been canceled.",
					"desc" : "The task has been canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011237" : {
					"cause" : "No host can access srcDs and dstDs.",
					"desc" : "No host can access srcDs and dstDs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011238" : {
					"cause" : "The disk is migrating.",
					"desc" : "The disk is migrating.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011239" : {
					"cause" : "Parameter: refreshflag is invalid.",
					"desc" : "Parameter: refreshflag is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011240" : {
					"cause" : "Failed to invoke the FusionStorage protocol to expand disk.",
					"desc" : "Failed to invoke the FusionStorage protocol to expand disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011241" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011242" : {
					"cause" : "No disk is configured for the VM.",
					"desc" : "No disk is configured for the VM.",
					"solution" : "Select a proper boot device."
				},
				"0005011243" : {
					"cause" : "The VM computer name does not meet configuration requirements. It can contain a maximum of 13 characters, which can be letters, digits, and hyphens (-) but cannot comprise only digits.",
					"desc" : "The VM computer name does not meet configuration requirements. It can contain a maximum of 13 characters, which can be letters, digits, and hyphens (-) but cannot comprise only digits.",
					"solution" : "Enter a valid VM computer name."
				},
				"0005011244" : {
					"cause" : "The VMware Tools is not installed on the VM template.",
					"desc" : "The VMware Tools is not installed on the VM template.",
					"solution" : "Install the latest VMware Tools on the VM template."
				},
				"0005011245" : {
					"cause" : "A virtual machine creation or configuration fails because a device specification contains an invalid value.",
					"desc" : "A virtual machine creation or configuration fails because a device specification contains an invalid value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011246" : {
					"cause" : "This hypervisor does not support this operation.",
					"desc" : "This hypervisor does not support this operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011247" : {
					"cause" : "This storage type does not support cold migration.",
					"desc" : "This storage type does not support cold migration.",
					"solution" : "Make sure that the VM is running. If the fault persists after the VM is running, contact your administrator or view the help manual."
				},
				"0005011248" : {
					"cause" : "The vm's configuration does not supports the live migration of a basic block device to a virtual storage device.",
					"desc" : "The vm's configuration does not supports the live migration of a basic block device to a virtual storage device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011249" : {
					"cause" : "This disk can not be operate because it has parent node.",
					"desc" : "This disk can not be operate because it has parent node.",
					"solution" : "null"
				},
				"0005011250" : {
					"cause" : "The operation is not allowed because the storage resources in the disaster recovery storage group are insufficient.",
					"desc" : "The operation is not allowed because the storage resources in the disaster recovery storage group are insufficient.",
					"solution" : "The operation is not allowed because the storage resources in the disaster recovery storage group are insufficient."
				},
				"0005011251" : {
					"cause" : "Disk size less than 2043G does not support to resize to over 2043G.",
					"desc" : "Disk size less than 2043G does not support to resize to over 2043G.",
					"solution" : "Please input another size."
				},
				"0005011252" : {
					"cause" : "Disk size is more than the destination storage max space.",
					"desc" : "Disk size is more than the destination storage max space.",
					"solution" : "Please select other destination storage."
				},
				"0005011253" : {
					"cause" : "It does not support adjust capacity online for the Non-persistent disk.",
					"desc" : "It does not support adjust capacity online for the Non-persistent disk.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005011254" : {
					"cause" : "Non-virtualized disk does not support online clone.",
					"desc" : "Non-virtualized disk does not support online clone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011255" : {
					"cause" : "The datastores where the template and linkcloned VM are located must be same type.",
					"desc" : "The datastores where the template and linkcloned VM are located must be same type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011256" : {
					"cause" : "The template and linkcloned VM can not depoly on different datastore which storage type is FusionStorage.",
					"desc" : "The template and linkcloned VM can not depoly on different datastore which storage type is FusionStorage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005011257" : {
					"cause" : "VM migration failed because the CPU configuration of the destination host is incompatible with that of this VM.",
					"desc" : "VM migration failed because the CPU configuration of the destination host is incompatible with that of this VM.",
					"solution" : "null"
				},
				"0005011258" : {
					"cause" : "The operation failed because the system is performing an operation that conflicts with this operation.",
					"desc" : "The operation failed because the system is performing an operation that conflicts with this operation.",
					"solution" : "Please try later."
				},
				"0005011259" : {
					"cause" : "The VM has backup policy or backup set, can't be converted to template.",
					"desc" : "The VM has backup policy or backup set, can't be converted to template.",
					"solution" : "Please firstly delete the backup policy or backup set."
				},
				"0005012001" : {
					"cause" : "No new storage found.",
					"desc" : "No new storage found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012002" : {
					"cause" : "Failed to delete the storage because it has been attached to a resource cluster.",
					"desc" : "Failed to delete the storage because it has been attached to a resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012003" : {
					"cause" : "The disk list and disk quantity exist at the same time.",
					"desc" : "The disk list and disk quantity exist at the same time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012004" : {
					"cause" : "No valid disk parameter in tier.",
					"desc" : "No valid disk parameter in tier.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012005" : {
					"cause" : "No valid tier exists.",
					"desc" : "No valid tier exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012006" : {
					"cause" : "The storage name is too long or too short.",
					"desc" : "The storage name is too long or too short.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012007" : {
					"cause" : "The threshold parameter is not in the valid range.",
					"desc" : "The threshold parameter is not in the valid range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012008" : {
					"cause" : "The migration mode setting is not invalid specified range.",
					"desc" : "The migration mode setting is not invalid specified range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012009" : {
					"cause" : "The RAIDlv setting is not invalid specified range.",
					"desc" : "The RAIDlv setting is not invalid specified range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012010" : {
					"cause" : "The disk type conflicts with tier.",
					"desc" : "The disk type conflicts with tier.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012011" : {
					"cause" : "Invalid hot backup policy.",
					"desc" : "Invalid hot backup policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012012" : {
					"cause" : "Unknown disk type.",
					"desc" : "Unknown disk type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012013" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012014" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012015" : {
					"cause" : "Duplicate storage name.",
					"desc" : "Duplicate storage name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012016" : {
					"cause" : "The number of selected disks is less than the rest number or minimum number of disks in the RAID group.",
					"desc" : "The number of selected disks is less than the rest number or minimum number of disks in the RAID group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012017" : {
					"cause" : "The status of the selected disk is abnormal. Please check the disk status.",
					"desc" : "The status of the selected disk is abnormal. Please check the disk status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012018" : {
					"cause" : "The selected disk is in use.",
					"desc" : "The selected disk is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012019" : {
					"cause" : "The storage space on the destination data store {0} is insufficient.",
					"desc" : "The storage space on the destination data store {0} is insufficient.",
					"solution" : "Ensure that the destination data store has sufficient storage space."
				},
				"0005012020" : {
					"cause" : "The FusionStorage disks cannot be migrated.",
					"desc" : "The FusionStorage disks cannot be migrated.",
					"solution" : "Ensure that the disks to be migrated are not FusionStorage disks."
				},
				"0005012021" : {
					"cause" : "The storage space is insufficient.",
					"desc" : "The storage space is insufficient.",
					"solution" : "Ensure that the storage space is sufficient."
				},
				"0005012022" : {
					"cause" : "The data store does not exist.",
					"desc" : "The data store does not exist.",
					"solution" : "Ensure that the data store exists."
				},
				"0005012023" : {
					"cause" : "The disk is used for memory swap.",
					"desc" : "The disk is used for memory swap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012024" : {
					"cause" : "A shared disk cannot be formatted.",
					"desc" : "A shared disk cannot be formatted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012025" : {
					"cause" : "The data store of this storage type does not support disks in thin-provisioning mode.",
					"desc" : "The data store of this storage type does not support disks in thin-provisioning mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012026" : {
					"cause" : "Failed to delete the storage pool because it contains a LUN.",
					"desc" : "Failed to delete the storage pool because it contains a LUN.",
					"solution" : "Please delete the LUN in the storage pool."
				},
				"0005012027" : {
					"cause" : "The VM or template is in use by an unfinished task. Try again after the task is complete.",
					"desc" : "The VM or template is in use by an unfinished task. Try again after the task is complete.",
					"solution" : "Please try later when the task is done."
				},
				"0005012028" : {
					"cause" : "The remaining space in the storage pool is insufficient.",
					"desc" : "The remaining space in the storage pool is insufficient.",
					"solution" : "Ensure that the available storage space is sufficient."
				},
				"0005012029" : {
					"cause" : "The specified storage pool does not exist.",
					"desc" : "The specified storage pool does not exist.",
					"solution" : "Please ensure that the storage pool exists."
				},
				"0005012030" : {
					"cause" : "Creating the LUN timed out.",
					"desc" : "Creating the LUN timed out.",
					"solution" : "Please create the LUN again."
				},
				"0005012031" : {
					"cause" : "The communication between the SAN device failed.",
					"desc" : "The communication between the SAN device failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012032" : {
					"cause" : "The data store is not allowed to be updated because it is being deleted or created.",
					"desc" : "The data store is not allowed to be updated because it is being deleted or created.",
					"solution" : "Please try later."
				},
				"0005012033" : {
					"cause" : "The data store is in use.",
					"desc" : "The data store is in use.",
					"solution" : "Please try later."
				},
				"0005012034" : {
					"cause" : "The given datastore path isn't currently accessible.",
					"desc" : "The given datastore path isn't currently accessible.",
					"solution" : "Please contact the system administrator."
				},
				"0005012035" : {
					"cause" : "The storage resource does not support this operation.",
					"desc" : "The storage resource does not support this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012036" : {
					"cause" : "Hypervisor does not exist.",
					"desc" : "Hypervisor does not exist.",
					"solution" : "Please refresh the page and check if the hypervisor exists."
				},
				"0005012037" : {
					"cause" : "The disaster recovery storage group name already exists.",
					"desc" : "The disaster recovery storage group name already exists.",
					"solution" : "Change the disaster recovery storage group name and try again."
				},
				"0005012038" : {
					"cause" : "The selected data store cannot be added to the current disaster recovery storage group.",
					"desc" : "The selected data store cannot be added to the current disaster recovery storage group.",
					"solution" : "Check that the selected data store list does not contain any data store that is added to other disaster recovery storage groups."
				},
				"0005012039" : {
					"cause" : "The disaster recovery storage group cannot be deleted because it contains data stores.",
					"desc" : "The disaster recovery storage group cannot be deleted because it contains data stores.",
					"solution" : "Delete data stores in the disaster recovery storage group and try again."
				},
				"0005012040" : {
					"cause" : "The disaster recovery storage group does not exist.",
					"desc" : "The disaster recovery storage group does not exist.",
					"solution" : "Ensure that the disaster recovery storage group exists."
				},
				"0005012041" : {
					"cause" : "The data store not in FusionManager, please update hypervisor first.",
					"desc" : "The data store not in FusionManager, please update hypervisor first.",
					"solution" : "Please update hypervisor first."
				},
				"0005012042" : {
					"cause" : "The data store does not exist, please refresh page first.",
					"desc" : "The data store does not exist, please refresh page first.",
					"solution" : "Please refresh page first."
				},
				"0005012043" : {
					"cause" : "The datastore does not exist.",
					"desc" : "The datastore does not exist.",
					"solution" : "The datastore does not exist."
				},
				"0005012044" : {
					"cause" : "Failed to bind the host to the data store.",
					"desc" : "Failed to bind the host to the data store.",
					"solution" : "Please try again after reducing the data store capacity."
				},
				"0005012045" : {
					"cause" : "No disk is attached to the VM.",
					"desc" : "No disk is attached to the VM.",
					"solution" : "Ensure that a disk is attached to the VM."
				},
				"0005012046" : {
					"cause" : "The operation is not allowed, because storage in is in maintenance mode.",
					"desc" : "The operation is not allowed, because storage in is in maintenance mode.",
					"solution" : "Ensure storage exit maintenance mode."
				},
				"0005012047" : {
					"cause" : "A FusionStorage disk can have a maximum storage space of 16383 GB.",
					"desc" : "A FusionStorage disk can have a maximum storage space of 16383 GB.",
					"solution" : "Ensure storage exit maintenance mode."
				},
				"0005012048" : {
					"cause" : "Storage type is not ipsan or dsware.",
					"desc" : "Storage type is not ipsan or dsware.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012049" : {
					"cause" : "The storage Selected that are not allowed to migrate disk.",
					"desc" : "The storage Selected that are not allowed to migrate disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012050" : {
					"cause" : "The storage device of this type does not support thick provision lazy zeroed disks.",
					"desc" : "The storage device of this type does not support thick provision lazy zeroed disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012051" : {
					"cause" : "Adding the data store...",
					"desc" : "Adding the data store...",
					"solution" : "Contact technical support."
				},
				"0005012052" : {
					"cause" : "Deleting the data store...",
					"desc" : "Deleting the data store...",
					"solution" : "Contact technical support."
				},
				"0005012053" : {
					"cause" : "A system exception may have occurred.",
					"desc" : "A system exception may have occurred.",
					"solution" : "Contact technical support."
				},
				"0005012054" : {
					"cause" : "A system exception may have occurred.",
					"desc" : "A system exception may have occurred.",
					"solution" : "Contact technical support."
				},
				"0005012055" : {
					"cause" : "The disk ID is empty.",
					"desc" : "The disk ID is empty.",
					"solution" : "Contact technical support."
				},
				"0005012056" : {
					"cause" : "The disk is being baked up or restored.",
					"desc" : "The disk is being baked up or restored.",
					"solution" : "Contact technical support."
				},
				"0005012057" : {
					"cause" : "The data storage status is abnormal.",
					"desc" : "The data storage status is abnormal.",
					"solution" : "Please check the data storage status."
				},
				"0005012059" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "Contact technical support."
				},
				"0005012060" : {
					"cause" : "The datastore does not exist.",
					"desc" : "The datastore does not exist.",
					"solution" : "Contact the system administrator."
				},
				"0005012061" : {
					"cause" : "The volume is frozen.",
					"desc" : "The volume is frozen.",
					"solution" : "Contact the system administrator."
				},
				"0005012062" : {
					"cause" : "The volume status is not frozen state.",
					"desc" : "The volume status is not frozen state.",
					"solution" : "Contact the system administrator."
				},
				"0005012063" : {
					"cause" : "The volume is not allowed to be detach, because the volume status is not attached.",
					"desc" : "The volume is not allowed to be detach, because the volume status is not attached.",
					"solution" : "Contact the system administrator."
				},
				"0005012064" : {
					"cause" : "The measurement configuration path creation failed.",
					"desc" : "The measurement configuration path creation failed.",
					"solution" : "Contact the system administrator."
				},
				"0005012065" : {
					"cause" : "Cannot unmount the volume which does not mount to specific vm yet.",
					"desc" : "Cannot unmount the volume which does not mount to specific vm yet.",
					"solution" : "Contact the system administrator."
				},
				"0005012066" : {
					"cause" : "The volume is not allowed to be deleted, because the volume status is not created.",
					"desc" : "The volume is not allowed to be deleted, because the volume status is not created.",
					"solution" : "Contact the system administrator."
				},
				"0005012067" : {
					"cause" : "The volume of the cluster is inconsistent with the virtual machine cluster.",
					"desc" : "The volume of the cluster is inconsistent with the virtual machine cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005012068" : {
					"cause" : "The device type of volume is not same as the one of vm.",
					"desc" : "The device type of volume is not same as the one of vm.",
					"solution" : "Contact the system administrator."
				},
				"0005012069" : {
					"cause" : "the \"SAN-SATA\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-SATA\" type of data storage resources insufficient.",
					"solution" : "Contact the system administrator."
				},
				"0005012070" : {
					"cause" : "the \"SAN-Any\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-Any\" type of data storage resources insufficient.",
					"solution" : "Contact the system administrator."
				},
				"0005012071" : {
					"cause" : "the \"SAN-SSD\" type of data storage resources are insufficient.",
					"desc" : "the \"SAN-SSD\" type of data storage resources are insufficient.",
					"solution" : "Contact the system administrator."
				},
				"0005012072" : {
					"cause" : "the \"SAN-SAS&FC\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-SAS&FC\" type of data storage resources insufficient.",
					"solution" : "Contact the system administrator."
				},
				"0005012073" : {
					"cause" : "Possible causes: 1.Under the cluster storage or CPU resources are insufficient; 2.The disk storage conditions are not met storage resources under the cluster; 3.Virtual machine template selected is unusable.",
					"desc" : "Possible causes: 1.Under the cluster storage or CPU resources are insufficient; 2.The disk storage conditions are not met storage resources under the cluster; 3.Virtual machine template selected is unusable.",
					"solution" : "Contact technical support."
				},
				"0005012074" : {
					"cause" : "Volume is being used by VM.",
					"desc" : "Volume is being used by VM.",
					"solution" : "Contact technical support."
				},
				"0005012075" : {
					"cause" : "Such operation is prohibitive to this host because it will cause the disconnection to the virtual environment.",
					"desc" : "Such operation is prohibitive to this host because it will cause the disconnection to the virtual environment.",
					"solution" : "Contact technical support."
				},
				"0005012076" : {
					"cause" : "The specified storage resources are insufficient or cannot meet the requirements for starting the VM.",
					"desc" : "The specified storage resources are insufficient or cannot meet the requirements for starting the VM.",
					"solution" : "Contact technical support."
				},
				"0005012077" : {
					"cause" : "Disaster recovery storage resources in the cluster are insufficient or no disaster recovery storage is available to support VM start.",
					"desc" : "Disaster recovery storage resources in the cluster are insufficient or no disaster recovery storage is available to support VM start.",
					"solution" : "Contact technical support."
				},
				"0005012078" : {
					"cause" : "Storage resources in the specified host are insufficient or no storage is available to support VM start.",
					"desc" : "Storage resources in the specified host are insufficient or no storage is available to support VM start.",
					"solution" : "Contact technical support."
				},
				"0005012079" : {
					"cause" : "NAS-type normal disk do not support capacity expansion on line.",
					"desc" : "NAS-type normal disk do not support capacity expansion on line.",
					"solution" : "Contact technical support."
				},
				"0005012080" : {
					"cause" : "Local disks cannot be attached to the VM.",
					"desc" : "Local disks cannot be attached to the VM.",
					"solution" : "Local disks cannot be attached to the VM."
				},
				"0005012081" : {
					"cause" : "Local disks cannot be detached from the VM.",
					"desc" : "Local disks cannot be detached from the VM.",
					"solution" : "Local disks cannot be detached from the VM."
				},
				"0005012082" : {
					"cause" : "This operation is not allowed because the disk is not created in the organization.",
					"desc" : "This operation is not allowed because the disk is not created in the organization.",
					"solution" : "This operation is not allowed because the disk is not created in the organization."
				},
				"0005013001" : {
					"cause" : "Failed to delete the host because it is in use.",
					"desc" : "Failed to delete the host because it is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013002" : {
					"cause" : "No new host found.",
					"desc" : "No new host found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013003" : {
					"cause" : "Failed to perform batch operations on the hosts.",
					"desc" : "Failed to perform batch operations on the hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013004" : {
					"cause" : "You cannot power on, power off, restart, and isolate the host where the management VM is located.",
					"desc" : "You cannot power on, power off, restart, and isolate the host where the management VM is located.",
					"solution" : "Contact technical support."
				},
				"0005013005" : {
					"cause" : "You cannot safely power off, safely restart, or enter or exit the maintenance mode on a host that is not in a virtualized resource cluster.",
					"desc" : "You cannot safely power off, safely restart, or enter or exit the maintenance mode on a host that is not in a virtualized resource cluster.",
					"solution" : "Contact technical support."
				},
				"0005013006" : {
					"cause" : "Power-on failed because the host does not exist.",
					"desc" : "Power-on failed because the host does not exist.",
					"solution" : "Contact technical support."
				},
				"0005013007" : {
					"cause" : "Power-on failed because the host does not exist.",
					"desc" : "Power-on failed because the host does not exist.",
					"solution" : "Contact technical support."
				},
				"0005013008" : {
					"cause" : "Power-off failed because the host does not exist.",
					"desc" : "Power-off failed because the host does not exist.",
					"solution" : "Contact technical support."
				},
				"0005013009" : {
					"cause" : "Power-off failed because the host does not exist.",
					"desc" : "Power-off failed because the host does not exist.",
					"solution" : "Contact technical support."
				},
				"0005013010" : {
					"cause" : "Restart failed because the host does not exist.",
					"desc" : "Restart failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013011" : {
					"cause" : "Restart failed because the host does not exist.",
					"desc" : "Restart failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013012" : {
					"cause" : "Failed to enter the maintenance mode because the host does not exist.",
					"desc" : "Failed to enter the maintenance mode because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013013" : {
					"cause" : "Failed to exit the maintenance mode because the host does not exist.",
					"desc" : "Failed to exit the maintenance mode because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013014" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013015" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013016" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013017" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013018" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013019" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013020" : {
					"cause" : "Failed to enter the maintenance mode because the system is abnormal.",
					"desc" : "Failed to enter the maintenance mode because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013021" : {
					"cause" : "Failed to exit the maintenance mode because the system is abnormal.",
					"desc" : "Failed to exit the maintenance mode because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013022" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013023" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013024" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013025" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013026" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013027" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013028" : {
					"cause" : "Failed to enter maintenance mode on the server.",
					"desc" : "Failed to enter maintenance mode on the server.",
					"solution" : "Migrate or stop VMs running on the server before entering maintenance mode."
				},
				"0005013029" : {
					"cause" : "Failed to exit the maintenance mode because the system is abnormal.",
					"desc" : "Failed to exit the maintenance mode because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013030" : {
					"cause" : "The host is in maintenance mode, the operation can not be repeated.",
					"desc" : "The host is in maintenance mode, the operation can not be repeated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013031" : {
					"cause" : "The host cannot exit the maintenance mode. Please try later.",
					"desc" : "The host cannot exit the maintenance mode. Please try later.",
					"solution" : "Contact technical support."
				},
				"0005013032" : {
					"cause" : "Failed to safely power off the host because the host is not in the hypervisor.",
					"desc" : "Failed to safely power off the host because the host is not in the hypervisor.",
					"solution" : "Contact technical support."
				},
				"0005013033" : {
					"cause" : "Failed to safely power off the host because the system is abnormal.",
					"desc" : "Failed to safely power off the host because the system is abnormal.",
					"solution" : "Contact technical support."
				},
				"0005013034" : {
					"cause" : "Failed to safely power on the host because the system is abnormal.",
					"desc" : "Failed to safely power on the host because the system is abnormal.",
					"solution" : "Contact technical support."
				},
				"0005013035" : {
					"cause" : "Failed to safely restart the host because the host is not in the hypervisor.",
					"desc" : "Failed to safely restart the host because the host is not in the hypervisor.",
					"solution" : "Contact technical support."
				},
				"0005013036" : {
					"cause" : "Failed to safely restart the host because the system is abnormal.",
					"desc" : "Failed to safely restart the host because the system is abnormal.",
					"solution" : "Contact technical support."
				},
				"0005013037" : {
					"cause" : "Failed to safely restart the host because the system is abnormal.",
					"desc" : "Failed to safely restart the host because the system is abnormal.",
					"solution" : "Contact technical support."
				},
				"0005013038" : {
					"cause" : "Power on all or power off all task exist.",
					"desc" : "Power on all or power off all task exist.",
					"solution" : "Please try later."
				},
				"0005013039" : {
					"cause" : "Power on all or power off all task exist.",
					"desc" : "Power on all or power off all task exist.",
					"solution" : "Please try later."
				},
				"0005013040" : {
					"cause" : "Start applications failed.",
					"desc" : "Start applications failed.",
					"solution" : "Contact technical support."
				},
				"0005013041" : {
					"cause" : "Stop applications failed.",
					"desc" : "Stop applications failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013042" : {
					"cause" : "Start FusionStorage service failed.",
					"desc" : "Start FusionStorage service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013043" : {
					"cause" : "Stop FusionStorage service failed.",
					"desc" : "Stop FusionStorage service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013044" : {
					"cause" : "Power on host failed.",
					"desc" : "Power on host failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013045" : {
					"cause" : "Power off host failed.",
					"desc" : "Power off host failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005013046" : {
					"cause" : "The username or security name or password is incorrect.",
					"desc" : "The username or security name or password is incorrect.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005013047" : {
					"cause" : "Failed to discover the device.",
					"desc" : "Failed to discover the device.",
					"solution" : "Please contact technical support."
				},
				"0005013048" : {
					"cause" : "The entered number of blades is greater than the actual number.",
					"desc" : "The entered number of blades is greater than the actual number.",
					"solution" : "Please ensure that the entered number of disks is correct."
				},
				"0005013049" : {
					"cause" : "The device is already added.",
					"desc" : "The device is already added.",
					"solution" : "Please contact technical support."
				},
				"0005013050" : {
					"cause" : "The file format for adding devices in batches is invalid.",
					"desc" : "The file format for adding devices in batches is invalid.",
					"solution" : "Please download the latest batch adding template."
				},
				"0005013051" : {
					"cause" : "The parameters in the batch adding template are invalid.",
					"desc" : "The parameters in the batch adding template are invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"0005013052" : {
					"cause" : "The BMC username or password is incorrect or the account has been locked.",
					"desc" : "The BMC username or password is incorrect or the account has been locked.",
					"solution" : "Specify valid BMC username and password of the host."
				},
				"0005013053" : {
					"cause" : "The OS username or password is incorrect or the account has been locked.",
					"desc" : "The OS username or password is incorrect or the account has been locked.",
					"solution" : "Specify valid OS username and password of the host."
				},
				"0005013054" : {
					"cause" : "The template for adding devices in batches is empty.",
					"desc" : "The template for adding devices in batches is empty.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"0005013055" : {
					"cause" : "The parameters in the batch adding template are invalid.",
					"desc" : "The parameters in the batch adding template are invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"0005013056" : {
					"cause" : "The parameters in the batch adding template are invalid.",
					"desc" : "The parameters in the batch adding template are invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"0005013057" : {
					"cause" : "Failed to set host startup options, please check the selected host status is normal.",
					"desc" : "Failed to set host startup options, please check the selected host status is normal.",
					"solution" : "Contact technical support."
				},
				"0005013058" : {
					"cause" : "Failed to add some blades.",
					"desc" : "Failed to add some blades.",
					"solution" : "Contact technical support."
				},
				"0005013059" : {
					"cause" : "The name of the device already exists in the system.",
					"desc" : "The name of the device already exists in the system.",
					"solution" : "Specify valid parameters."
				},
				"0005013060" : {
					"cause" : "Obtaining device specifications...Please try later.",
					"desc" : "Obtaining device specifications...Please try later.",
					"solution" : "Please try later."
				},
				"0005013061" : {
					"cause" : "The name of the zone already exists in the system.",
					"desc" : "The name of the zone already exists in the system.",
					"solution" : "Specify valid parameters."
				},
				"0005013062" : {
					"cause" : "Complete server information is required when the server is not in the Ready state.",
					"desc" : "Complete server information is required when the server is not in the Ready state.",
					"solution" : "Please enter complete server information."
				},
				"0005013063" : {
					"cause" : "The basic information is invalid.",
					"desc" : "The basic information is invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"0005013064" : {
					"cause" : "The host is not connected to any hypervisor.",
					"desc" : "The host is not connected to any hypervisor.",
					"solution" : "Contact technical support."
				},
				"0005013065" : {
					"cause" : "The host is not contained in the cluster.",
					"desc" : "The host is not contained in the cluster.",
					"solution" : "Contact technical support."
				},
				"0005013066" : {
					"cause" : "Servers of this type do not support specification refresh.",
					"desc" : "Servers of this type do not support specification refresh.",
					"solution" : "Contact technical support."
				},
				"0005013067" : {
					"cause" : "The OS username or password is incorrect or the account has been locked or the SSH connection timed out.",
					"desc" : "The OS username or password is incorrect or the account has been locked or the SSH connection timed out.",
					"solution" : "Specify valid OS username and password of the host."
				},
				"0005013068" : {
					"cause" : "There were no hosts available to complete the specified operation.",
					"desc" : "There were no hosts available to complete the specified operation.",
					"solution" : "Contact the system administrator."
				},
				"0005013069" : {
					"cause" : "The operation could not be performed because the HA software is not installed on this host.",
					"desc" : "The operation could not be performed because the HA software is not installed on this host.",
					"solution" : "Please install the HA software on this host."
				},
				"0005013070" : {
					"cause" : "Cannot perform operation as the host is running in emergency mode.",
					"desc" : "Cannot perform operation as the host is running in emergency mode.",
					"solution" : "Contact the system administrator."
				},
				"0005013071" : {
					"cause" : "The specified host is disabled and cannot be re-enabled until after it has rebooted.",
					"desc" : "The specified host is disabled and cannot be re-enabled until after it has rebooted.",
					"solution" : "Please restart the host."
				},
				"0005013072" : {
					"cause" : "Insufficient host memory is available to perform this operation.",
					"desc" : "Insufficient host memory is available to perform this operation.",
					"solution" : "Please contact your administrator or refer to the help manual."
				},
				"0005013073" : {
					"cause" : "Host monitor account is needed to be set.",
					"desc" : "Host monitor account is needed to be set.",
					"solution" : "Please set a host monitoring account."
				},
				"0005013074" : {
					"cause" : "Failed to start VMs using storage resources on the data store.",
					"desc" : "Failed to start VMs using storage resources on the data store.",
					"solution" : "Please refer to suggestions for handling subtasks."
				},
				"0005013075" : {
					"cause" : "Failed to disable active/standby switchover or stop the CNAs.",
					"desc" : "Failed to disable active/standby switchover or stop the CNAs.",
					"solution" : "Contact technical support."
				},
				"0005013076" : {
					"cause" : "Failed to stop VMs using storage resources on the data store.",
					"desc" : "Failed to stop VMs using storage resources on the data store.",
					"solution" : "Please refer to suggestions for handling subtasks."
				},
				"0005013077" : {
					"cause" : "The BMC username or password is incorrect or the account has been locked.",
					"desc" : "The BMC username or password is incorrect or the account has been locked.",
					"solution" : "Specify valid BMC username and password of the host."
				},
				"0005013078" : {
					"cause" : "Get the third LCNA fail.",
					"desc" : "Get the third LCNA fail.",
					"solution" : "Contact technical support."
				},
				"0005013079" : {
					"cause" : "Add host to cluster fail.",
					"desc" : "Add host to cluster fail.",
					"solution" : "Contact technical support."
				},
				"0005013080" : {
					"cause" : "Host is not found in management cluster.",
					"desc" : "Host is not found in management cluster.",
					"solution" : "Contact technical support."
				},
				"0005013081" : {
					"cause" : "Associate host fail.",
					"desc" : "Associate host fail.",
					"solution" : "Contact technical support %u300."
				},
				"0005013082" : {
					"cause" : "Expand host is not ready.",
					"desc" : "Expand host is not ready.",
					"solution" : "Contact technical support."
				},
				"0005101000" : {
					"cause" : "VPC template not exist.",
					"desc" : "VPC template not exist.",
					"solution" : "VPC template not exist."
				},
				"0005101001" : {
					"cause" : "The VPC specification number reached the maximum value of 16.",
					"desc" : "The VPC specification number reached the maximum value of 16.",
					"solution" : "The VPC specification number reached the maximum value of 16."
				},
				"0005101002" : {
					"cause" : "name repeated.",
					"desc" : "name repeated.",
					"solution" : "name repeated."
				},
				"0005101003" : {
					"cause" : "VSA VM template not exist.",
					"desc" : "VSA VM template not exist.",
					"solution" : "VSA VM template not exist."
				},
				"0005101004" : {
					"cause" : "The existence of VPC network, cannot be deleted.",
					"desc" : "The existence of VPC network, cannot be deleted.",
					"solution" : "The existence of VPC network, cannot be deleted."
				},
				"0005101005" : {
					"cause" : "The existence of VPC router, cannot be deleted.",
					"desc" : "The existence of VPC router, cannot be deleted.",
					"solution" : "The existence of VPC router, cannot be deleted."
				},
				"0005101006" : {
					"cause" : "The existence of VPC volume, cannot be deleted.",
					"desc" : "The existence of VPC volume, cannot be deleted.",
					"solution" : "The existence of VPC volume, cannot be deleted."
				},
				"0005101007" : {
					"cause" : "The existence of VPC VM, cannot be deleted.",
					"desc" : "The existence of VPC VM, cannot be deleted.",
					"solution" : "The existence of VPC VM, cannot be deleted."
				},
				"0005101008" : {
					"cause" : "The existence of VPC security group, cannot be deleted.",
					"desc" : "The existence of VPC security group, cannot be deleted.",
					"solution" : "The existence of VPC security group, cannot be deleted."
				},
				"0005101010" : {
					"cause" : "The IP band width specification number reached the maximum value of 128.",
					"desc" : "The IP band width specification number reached the maximum value of 128.",
					"solution" : "The IP band width specification number reached the maximum value of 128."
				},
				"0005101012" : {
					"cause" : "Invalid security group rule protocol.",
					"desc" : "Invalid security group rule protocol.",
					"solution" : "Please input a valid security group rule protocol."
				},
				"0005101013" : {
					"cause" : "Invalid security group rule protocol port.",
					"desc" : "Invalid security group rule protocol port.",
					"solution" : "Please input a valid security group rule protocol port."
				},
				"0005101014" : {
					"cause" : "The number of external networks which the VDC appointed exceeds the system specifications.",
					"desc" : "The number of external networks which the VDC appointed exceeds the system specifications.",
					"solution" : "Please reduce the appointed external networks."
				},
				"0005102000" : {
					"cause" : "No router exists in the VPC.",
					"desc" : "No router exists in the VPC.",
					"solution" : "Please apply Router in VPC."
				},
				"0005102001" : {
					"cause" : "No IPv4 Subnet exists in the network.",
					"desc" : "No IPv4 Subnet exists in the network.",
					"solution" : "Please add an ipv4 Sunbnet in Network."
				},
				"0005102002" : {
					"cause" : "Invalid ipv4 subnet address.",
					"desc" : "Invalid ipv4 subnet address.",
					"solution" : "Please input a valid ipv4Subnet address."
				},
				"0005102003" : {
					"cause" : "Invalid ipv4 subnet mask.",
					"desc" : "Invalid ipv4 subnet mask.",
					"solution" : "Please input a valid ipv4Subnet mask."
				},
				"0005102004" : {
					"cause" : "Invalid ipv4Subnet gateway.",
					"desc" : "Invalid ipv4Subnet gateway.",
					"solution" : "Please input a valid ipv4Subnet gateway."
				},
				"0005102005" : {
					"cause" : "Invalid ipv4 subnet ipRange List.",
					"desc" : "Invalid ipv4 subnet ipRange List.",
					"solution" : "Please input a valid ipv4Subnet ipRange List."
				},
				"0005102006" : {
					"cause" : "Gateway is not in ipv4Subnet.",
					"desc" : "Gateway is not in ipv4Subnet.",
					"solution" : "Please input a gateway  in ipv4Subnet."
				},
				"0005102007" : {
					"cause" : "IpRange List is not in ipv4Subnet.",
					"desc" : "IpRange List is not in ipv4Subnet.",
					"solution" : "Please input a ipRange List  in ipv4Subnet."
				},
				"0005102008" : {
					"cause" : "Gateway is  in  ipv4Range List.",
					"desc" : "Gateway is  in  ipv4Range List.",
					"solution" : "Please input a gateway  is not in  ipv4Range List."
				},
				"0005102009" : {
					"cause" : "Ipv4Range List is overlop.",
					"desc" : "Ipv4Range List is overlop.",
					"solution" : "Please input not overlop ipv4Ranges."
				},
				"0005102010" : {
					"cause" : "Invalid ipv4Subnet DNS.",
					"desc" : "Invalid ipv4Subnet DNS.",
					"solution" : "Please input a valid ipv4Subnet DNS."
				},
				"0005102011" : {
					"cause" : "Invalid ipv6Subnet address.",
					"desc" : "Invalid ipv6Subnet address.",
					"solution" : "Please input a valid ipv6Subnet address."
				},
				"0005102012" : {
					"cause" : "Invalid ipv6Subnet mask.",
					"desc" : "Invalid ipv6Subnet mask.",
					"solution" : "Please input a valid ipv6Subnet mask."
				},
				"0005102013" : {
					"cause" : "Invalid ipv6Subnet gateway.",
					"desc" : "Invalid ipv6Subnet gateway.",
					"solution" : "Please input a valid ipv6Subnet gateway."
				},
				"0005102014" : {
					"cause" : "Invalid ipv6Subnet ipRange List.",
					"desc" : "Invalid ipv6Subnet ipRange List.",
					"solution" : "Please input a valid ipv6Subnet ipRange List."
				},
				"0005102015" : {
					"cause" : "Gateway is not in ipv6Subnet.",
					"desc" : "Gateway is not in ipv6Subnet.",
					"solution" : "Please input a gateway  in ipv6Subnet."
				},
				"0005102016" : {
					"cause" : "IpRange List is not in ipv6Subnet.",
					"desc" : "IpRange List is not in ipv6Subnet.",
					"solution" : "Please input a ipRange List  in ipv6Subnet."
				},
				"0005102017" : {
					"cause" : "Gateway is  in  ipv6Range List.",
					"desc" : "Gateway is  in  ipv6Range List.",
					"solution" : "Please input a gateway  is not in  ipv6Range List."
				},
				"0005102018" : {
					"cause" : "Ipv6Range List is overlop.",
					"desc" : "Ipv6Range List is overlop.",
					"solution" : "Please input not overlop ipv6Ranges."
				},
				"0005102019" : {
					"cause" : "Invalid ipv6Subnet DNS.",
					"desc" : "Invalid ipv6Subnet DNS.",
					"solution" : "Please input a valid ipv6Subnet DNS."
				},
				"0005102020" : {
					"cause" : "Invalid ipv4Subnet, ipv4Subnet address and mask is not logical",
					"desc" : "Invalid ipv4Subnet, ipv4Subnet address and mask is not logical",
					"solution" : "Please input a valid ipv4Subnet."
				},
				"0005102021" : {
					"cause" : "Invalid ipv6Subnet, ipv6Subnet address and mask is not logical.",
					"desc" : "Invalid ipv6Subnet, ipv6Subnet address and mask is not logical.",
					"solution" : "Please input a valid ipv6Subnet."
				},
				"0005102022" : {
					"cause" : "Duplicate DNS.",
					"desc" : "Duplicate DNS.",
					"solution" : "Please input not duplicated DNS."
				},
				"0005102023" : {
					"cause" : "Elastic IP not exist.",
					"desc" : "Elastic IP not exist.",
					"solution" : "Please apply Elastic IP."
				},
				"0005102024" : {
					"cause" : "Elastic IP associate VM.",
					"desc" : "Elastic IP associate VM.",
					"solution" : "Please Disassociate VM form Elastic IP."
				},
				"0005102025" : {
					"cause" : "The name is invalid.",
					"desc" : "The name is invalid.",
					"solution" : "Contact technical support."
				},
				"0005102026" : {
					"cause" : "The description is invalid.",
					"desc" : "The description is invalid.",
					"solution" : "Contact technical support."
				},
				"0005102027" : {
					"cause" : "Virtual machine quota is insufficient to create a VPC.",
					"desc" : "Virtual machine quota is insufficient to create a VPC.",
					"solution" : "Virtual machine quota is insufficient to create a VPC."
				},
				"0005102028" : {
					"cause" : "VCPUs quota is insufficient to create a VPC.",
					"desc" : "VCPUs quota is insufficient to create a VPC.",
					"solution" : "VCPUs quota is insufficient to create a VPC."
				},
				"0005102029" : {
					"cause" : "Memory quota is insufficient to create a VPC.",
					"desc" : "Memory quota is insufficient to create a VPC.",
					"solution" : "Memory quota is insufficient to create a VPC."
				},
				"0005102030" : {
					"cause" : "Storage quota is insufficient to create a VPC.",
					"desc" : "Storage quota is insufficient to create a VPC.",
					"solution" : "Storage quota is insufficient to create a VPC."
				},
				"0005102031" : {
					"cause" : "Elastic IP address quota is insufficient to create a VPC.",
					"desc" : "Elastic IP address quota is insufficient to create a VPC.",
					"solution" : "Elastic IP address quota is insufficient to create a VPC."
				},
                "0005102032" : {
					"cause" : "No enough vxlan allocate vdc.",
					"desc" : "No enough vxlan allocate vdc.",
					"solution" : "Expand the reserved vxlan."
				},
                "0005102033" : {
					"cause" : "The internal subnet deficiency for VPC communication.",
					"desc" : "The internal subnet deficiency for VPC communication.",
					"solution" : "Contact technical support."
				},
                "0005102034" : {
					"cause" : "The vxlanID in the reserved VxLAN range.",
					"desc" : "The vxlanID in the reserved VxLAN range.",
					"solution" : "Please select the appropriate VLAN."
				},
				"0005103001" : {
					"cause" : "this security group is by other security group related.",
					"desc" : "this security group is by other security group related.",
					"solution" : "Please delete related security group rule"
				},
				"0005103002" : {
					"cause" : "this security group is default security group.",
					"desc" : "this security group is default security group.",
					"solution" : "default security group cannot be delete."
				},
				"0005103003" : {
					"cause" : "The Firewall has rule exsit,can not delete.",
					"desc" : "The Firewall has rule exsit,can not delete.",
					"solution" : "Please delete Firewall rule first and try again."
				},
				"0005103004" : {
					"cause" : "The VPC has not Firewall.",
					"desc" : "Can not find Firewall in this VPC.",
					"solution" : "Please create Firewall first."
				},
				"0005103005" : {
					"cause" : "The status of firewall can not create rule.",
					"desc" : "The status of firewall is not active.",
					"solution" : "Please wait a moment."
				},
				"0005103006" : {
					"cause" : "The router has be used.",
					"desc" : "The router has Firewall exsit.",
					"solution" : "Please delete Firewall and try again."
				},
                "0005103007" : {
					"cause" : "The router has be used.",
					"desc" : "The router has Elastic IP exsit.",
					"solution" : "Please delete Elastic IP and try again."
				},
				"0005103023" : {
					"cause" : "Network associate VM.",
					"desc" : "Network associate VM.",
					"solution" : "Please delete associated vm Nic."
				},
				"0005103024" : {
					"cause" : "The name already exists.",
					"desc" : "The name already exists.",
					"solution" : "Please re-type."
				},
				"0005200001" : {
					"cause" : "App template name exists.",
					"desc" : "App template name exists.",
					"solution" : "Please try another name."
				},
				"0005200002" : {
					"cause" : "App templates exceeds upper limit.",
					"desc" : "App templates exceeds upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005200003" : {
					"cause" : "App template state conflicts.",
					"desc" : "App template state conflicts.",
					"solution" : "Please check the app template state pre operation."
				},
				"0005200004" : {
					"cause" : "App template not exists.",
					"desc" : "App template not exists.",
					"solution" : "Please check the app template whether exist or not."
				},
				"0005200005" : {
					"cause" : "App template body empty.",
					"desc" : "App template body empty.",
					"solution" : "Please check the app template content."
				},
				"0005200006" : {
					"cause" : "The file does not exist.",
					"desc" : "The file does not exist.",
					"solution" : "Please check the file existence."
				},
				"0005200007" : {
					"cause" : "Export task exceeds upper limit.",
					"desc" : "Export task exceeds upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005200008" : {
					"cause" : "Export task not exist.",
					"desc" : "Export task not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005200009" : {
					"cause" : "App template content empty or format error.",
					"desc" : "App template content empty or format error.",
					"solution" : "Please check the app template content."
				},
				"0005200010" : {
					"cause" : "Resources has cyclic dependency.",
					"desc" : "Resources has cyclic dependency.",
					"solution" : "Please check the app template content."
				},
				"0005200011" : {
					"cause" : "App template format error.",
					"desc" : "App template format error.",
					"solution" : "Please check the app template content."
				},
				"0005200012" : {
					"cause" : "App template content is not json formatted.",
					"desc" : "App template content is not json formatted.",
					"solution" : "Please check the app template content."
				},
				"0005200013" : {
					"cause" : "No VM resource found in app template.",
					"desc" : "No VM resource found in app template.",
					"solution" : "Please check the app template content."
				},
				"0005200014" : {
					"cause" : "No resource found in app template.",
					"desc" : "No resource found in app template.",
					"solution" : "Please check the app template content."
				},
				"0005200015" : {
					"cause" : "Multiple NIcs are allocated default gateway.",
					"desc" : "Multiple NIcs are allocated default gateway.",
					"solution" : "Please check the app template content."
				},
				"0005200016" : {
					"cause" : "VM resource is referenced by multiple scaling groups.",
					"desc" : "VM resource is referenced by multiple scaling groups.",
					"solution" : "Please check the app template content."
				},
				"0005200017" : {
					"cause" : "Scaling group contains multiple VM templates.",
					"desc" : "Scaling group contains multiple VM templates.",
					"solution" : "Please check the app template content."
				},
				"0005200018" : {
					"cause" : "VM resource is referenced by another VM resource.",
					"desc" : "VM resource is referenced by another VM resource.",
					"solution" : "Please check the app template content."
				},
				"0005200019" : {
					"cause" : "No VM resource in scaling group.",
					"desc" : "No VM resource in scaling group.",
					"solution" : "Please check the app template content."
				},
				"0005200020" : {
					"cause" : "Max or min value is invalid in scaling group.",
					"desc" : "Max or min value is invalid in scaling group.",
					"solution" : "Please check the app template content."
				},
				"0005200021" : {
					"cause" : "Desired capacity is invalid in scaling group.",
					"desc" : "Desired capacity is invalid in scaling group.",
					"solution" : "Please check the app template content."
				},
				"0005200022" : {
					"cause" : "Cool down time is invalid in scaling group.",
					"desc" : "Cool down time is invalid in scaling group.",
					"solution" : "Please check the app template content."
				},
				"0005200023" : {
					"cause" : "Policy in scaling group is invalid.",
					"desc" : "Policy in scaling group is invalid.",
					"solution" : "Please check the app template content."
				},
				"0005200024" : {
					"cause" : "Scaling groups exceed upper limit.",
					"desc" : "Scaling groups exceed upper limit.",
					"solution" : "Please check the scaling group count."
				},
				"0005200025" : {
					"cause" : "Network name invalid.",
					"desc" : "Network name invalid.",
					"solution" : "Please check the app template content."
				},
				"0005200026" : {
					"cause" : "Network description invalid.",
					"desc" : "Network description invalid.",
					"solution" : "Please check the app template content."
				},
				"0005200027" : {
					"cause" : "Computer name invalid.",
					"desc" : "Computer name invalid.",
					"solution" : "Please check the app template content."
				},
				"0005200028" : {
					"cause" : "IP address invalid.",
					"desc" : "IP address invalid.",
					"solution" : "Please check the app template content."
				},
				"0005200029" : {
					"cause" : "App instance not exist.",
					"desc" : "App instance not exist.",
					"solution" : "Please check the app whether exists or not."
				},
				"0005200030" : {
					"cause" : "App template being locked.",
					"desc" : "App template being locked.",
					"solution" : "Please unlock the app template."
				},
				"0005200031" : {
					"cause" : "VM nic without portgroup.",
					"desc" : "VM nic without portgroup.",
					"solution" : "Please add portgroup for the VM nic."
				},
				"0005200032" : {
					"cause" : "App template file not exist",
					"desc" : "App template file not exist",
					"solution" : "Please make sure the existence of app template file."
				},
				"0005200033" : {
					"cause" : "App template file size too large.",
					"desc" : "App template file size too large.",
					"solution" : "Please change the app template file."
				},
				"0005200034" : {
					"cause" : "App template file postfix invalid.",
					"desc" : "App template file postfix invalid.",
					"solution" : "Please change the app template file."
				},
				"0005200035" : {
					"cause" : "App VM does not bind VLB.",
					"desc" : "App VM does not bind VLB.",
					"solution" : "try later."
				},
				"0005200037" : {
					"cause" : "App VM bind VLB repeat.",
					"desc" : "App VM bind VLB repeat.",
					"solution" : "try later."
				},
				"0005200038" : {
					"cause" : "Only one ip or nic could be binded to only one VLB.",
					"desc" : "Only one ip or nic could be binded to only one VLB.",
					"solution" : "Please modify the template used to create app."
				},
				"0005200039" : {
					"cause" : "App SG does not bind VLB.",
					"desc" : "App SG does not bind VLB.",
					"solution" : "try later."
				},
				"0005200042" : {
					"cause" : "App name duplicate.",
					"desc" : "App name duplicate.",
					"solution" : "Please change the app name."
				},
				"0005200043" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005200044" : {
					"cause" : "The number of stopped applications reaches the maximum.",
					"desc" : "The number of stopped applications reaches the maximum.",
					"solution" : "Please try later or contact the administrator."
				},
				"0005200045" : {
					"cause" : "The application is not allowed to start when it is in the current state.",
					"desc" : "The application is not allowed to start when it is in the current state.",
					"solution" : "Refresh the page and try again later."
				},
				"0005200046" : {
					"cause" : "The application in the current state cannot be suspended.",
					"desc" : "The application in the current state cannot be suspended.",
					"solution" : "Refresh the page."
				},
				"0005200047" : {
					"cause" : "The number of started applications reached the maximum value.",
					"desc" : "The number of started applications reached the maximum value.",
					"solution" : "Try again later."
				},
				"0005200049" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "The application is abnormal. please delete the application."
				},
				"0005200050" : {
					"cause" : "This operation cannot be performed for the application in the current state.",
					"desc" : "This operation cannot be performed for the application in the current state.",
					"solution" : "Contact technical support."
				},
				"0005200051" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005200052" : {
					"cause" : "The number of application instances reaches the maximum value defined by the system.",
					"desc" : "The number of application instances reaches the maximum value defined by the system.",
					"solution" : "The number of application instances reaches the maximum value defined by the system. Please configure again."
				},
				"0005200053" : {
					"cause" : "The number of application instances reaches the maximum value defined by the organization.",
					"desc" : "The number of application instances reaches the maximum value defined by the organization.",
					"solution" : "The number of application instances reaches the maximum value defined by the organization. Please configure again."
				},
				"0005200054" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005200055" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005200056" : {
					"cause" : "This operation cannot be performed for the application in the current state.",
					"desc" : "This operation cannot be performed for the application in the current state.",
					"solution" : "Please check the currrent stack state before operating."
				},
				"0005200057" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005200058" : {
					"cause" : "VM belongs to other app.",
					"desc" : "VM belongs to other app.",
					"solution" : "Please choose VMs again."
				},
				"0005200059" : {
					"cause" : "VM belongs to other user.",
					"desc" : "VM belongs to other user.",
					"solution" : "Please choose VMs again."
				},
				"0005200060" : {
					"cause" : "A vm associated with the VLB multiple NICs.",
					"desc" : "A vm associated with the VLB multiple NICs.",
					"solution" : "A vm can only be associated with the presence of a card VLB."
				},
				"0005200061" : {
					"cause" : "VM or scaling group is binding or unbinding VLB.",
					"desc" : "VM or scaling group is binding or unbinding VLB.",
					"solution" : "Please wait a minute and try it later."
				},
				"0005200062" : {
					"cause" : "Resource object in template exceeds max value.",
					"desc" : "Resource object in template exceeds max value.",
					"solution" : "Please modify the app template."
				},
				"0005200063" : {
					"cause" : "Parameters in app template exceeds max value.",
					"desc" : "Parameters in app template exceeds max value.",
					"solution" : "Please modify the app template."
				},
				"0005200064" : {
					"cause" : "Outputs in app template exceeds max value.",
					"desc" : "Outputs in app template exceeds max value.",
					"solution" : "Please modify the app template."
				},
				"0005200065" : {
					"cause" : "The number of software in VM exceeds the maximum value.",
					"desc" : "The number of software in VM exceeds the maximum value.",
					"solution" : "Please modify the app template."
				},
				"0005200066" : {
					"cause" : "Scaling groups in app exceeds max value.",
					"desc" : "Scaling groups in app exceeds max value.",
					"solution" : "Please modify the app template."
				},
				"0005201001" : {
					"cause" : "Some parameter is missing.",
					"desc" : "Some parameter is missing.",
					"solution" : "Please input required paratemer."
				},
				"0005201002" : {
					"cause" : "The internal service error.",
					"desc" : "The internal service error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005201003" : {
					"cause" : "The database internal error.",
					"desc" : "The database internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005201004" : {
					"cause" : "The script or software(ISO) does not exist.",
					"desc" : "The script or software(ISO) does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005201005" : {
					"cause" : "The script or software(ISO) file does not exist or query failed.",
					"desc" : "The script or software(ISO) file does not exist or query failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005201006" : {
					"cause" : "The file path of script or software(ISO) is null.",
					"desc" : "The file path of script or software(ISO) is null.",
					"solution" : "Please input the file path of script or software(ISO) by yourself."
				},
				"0005201007" : {
					"cause" : "The file path of script or software(ISO) is invalid.",
					"desc" : "The file path of script or software(ISO) is invalid.",
					"solution" : "Please input valid file path of script or software(ISO)."
				},
				"0005201008" : {
					"cause" : "The script(ISO/software) ID is duplicated.",
					"desc" : "The script(ISO/software) ID is duplicated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005201009" : {
					"cause" : "The script(ISO/software) name has existed in the database.",
					"desc" : "The script(ISO/software) name has existed in the database.",
					"solution" : "Please input other script(ISO/software) name."
				},
				"0005201010" : {
					"cause" : "The number of script is out of bound.",
					"desc" : "The number of script is out of bound.",
					"solution" : "Contact the system administrator."
				},
				"0005201011" : {
					"cause" : "Script(ISO/software) file does not exist or remove failed.",
					"desc" : "Script(ISO/software) file does not exist or remove failed.",
					"solution" : "Contact the system administrator."
				},
				"0005201012" : {
					"cause" : "Input invalid page size.",
					"desc" : "Input invalid page size.",
					"solution" : "Please input valid page size."
				},
				"0005201013" : {
					"cause" : "Input invalid page number.",
					"desc" : "Input invalid page number.",
					"solution" : "Please input valid page number."
				},
				"0005201014" : {
					"cause" : "Resource is being used.",
					"desc" : "Resource is being used.",
					"solution" : "Contact the system administrator."
				},
				"0005201015" : {
					"cause" : "The software(ISO/script) file does not exist or remove failed.",
					"desc" : "The software(ISO/script) file does not exist or remove failed.",
					"solution" : "Contact the system administrator."
				},
				"0005201016" : {
					"cause" : "The resource exist.",
					"desc" : "The resource exist.",
					"solution" : "Contact the system administrator."
				},
				"0005201017" : {
					"cause" : "sync software/script failed!",
					"desc" : "sync software/script failed!",
					"solution" : "Contact the administrator"
				},
				"0005201029" : {
					"cause" : "The Repository is not enough!",
					"desc" : "The Repository is not enough!",
					"solution" : "Contact the administrator"
				},
				"0005202001" : {
					"cause" : "Some parameter is missing.",
					"desc" : "Some parameter is missing.",
					"solution" : "Please input required paratemer."
				},
				"0005202002" : {
					"cause" : "Some parameter is invalid.",
					"desc" : "Some parameter is invalid.",
					"solution" : "Please input valid paratemer."
				},
				"0005202003" : {
					"cause" : "Query database error.",
					"desc" : "Query database error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005202004" : {
					"cause" : "The internal service error.",
					"desc" : "The internal service error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203001" : {
					"cause" : "Some parameter is invalid.",
					"desc" : "Some parameter is invalid.",
					"solution" : "Please input valid paratemer."
				},
				"0005203002" : {
					"cause" : "Users no operating authority.",
					"desc" : "Users no operating authority.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203003" : {
					"cause" : "VM database throws exception.",
					"desc" : "VM database throws exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203004" : {
					"cause" : "Invoke IRM failed .",
					"desc" : "Invoke IRM failed .",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203005" : {
					"cause" : "The VM template does not exist.",
					"desc" : "The VM template does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203006" : {
					"cause" : "Can not delete registration status.",
					"desc" : "Can not delete registration status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203007" : {
					"cause" : "VM template is being used , operation is not allowed.",
					"desc" : "VM template is being used , operation is not allowed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005203008" : {
					"cause" : "The zone of user mismatch with  the zone of resource, operation is not allowed.",
					"desc" : "The zone of user mismatch with  the zone of resource, operation is not allowed.",
					"solution" : "Contact the system administrator."
				},
				"0005203009" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
				},
				"0005203011" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203012" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203013" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203014" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203015" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203017" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203019" : {
					"cause" : "A VM is failed to be created\\, and therefore it cannot be made into a template",
					"desc" : "A VM is failed to be created\\, and therefore it cannot be made into a template",
					"solution" : "Delete the VM template and create a new VM template"
				},
				"0005203020" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203021" : {
					"cause" : "The shared file path cannot be empty",
					"desc" : "The shared file path cannot be empty",
					"solution" : "Enter the shared file path"
				},
				"0005203023" : {
					"cause" : "Failed to start the VM",
					"desc" : "Failed to start the VM",
					"solution" : "Contact technical support"
				},
				"0005203024" : {
					"cause" : "You can modify only created VM templates",
					"desc" : "You can modify only created VM templates",
					"solution" : "Refresh the page"
				},
				"0005203025" : {
					"cause" : "An error occurred when the template was changed into the VM",
					"desc" : "An error occurred when the template was changed into the VM",
					"solution" : "Please try later or contact the administrator"
				},
				"0005203026" : {
					"cause" : "The VM template has already been published",
					"desc" : "The VM template has already been published",
					"solution" : "Refresh the page"
				},
				"0005203029" : {
					"cause" : "Failed to create the VM template\\, because the available resource cluster does not exist",
					"desc" : "Failed to create the VM template\\, because the available resource cluster does not exist",
					"solution" : "Contact the administrator to add the resource cluster"
				},
				"0005203030" : {
					"cause" : "You cannot publish a VM that is not created or fails to be modified",
					"desc" : "You cannot publish a VM that is not created or fails to be modified",
					"solution" : "Complete the VM template creation or modification"
				},
				"0005203031" : {
					"cause" : "The VM template has been unpublished",
					"desc" : "The VM template has been unpublished",
					"solution" : "Refresh the page"
				},
				"0005203032" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"0005203033" : {
					"cause" : "VM template is in use can not be unpublished",
					"desc" : "VM template is in use can not be unpublished",
					"solution" : "Delete application templates that use the VM template and try to deregister the VM template again."
				},
				"0005203034" : {
					"cause" : "You cannot attach the ISO file when the VM template creation fails",
					"desc" : "You cannot attach the ISO file when the VM template creation fails",
					"solution" : "Delete the VM template and create a new one"
				},
				"0005203035" : {
					"cause" : "You cannot attach the ISO file when the VM template creation is completed",
					"desc" : "You cannot attach the ISO file when the VM template creation is completed",
					"solution" : "Modify the VM template"
				},
				"0005203036" : {
					"cause" : "You cannot attach the ISO file when the VM template is published",
					"desc" : "You cannot attach the ISO file when the VM template is published",
					"solution" : "Unpublish the VM template and modify it"
				},
				"0005203037" : {
					"cause" : "The VM is not created by using the VM template",
					"desc" : "The VM is not created by using the VM template",
					"solution" : "Contact the administrator"
				},
				"0005203038" : {
					"cause" : "The external system communication is abnormal. For example\\, the returned message is empty\\, or the field is incorrect",
					"desc" : "The external system communication is abnormal. For example\\, the returned message is empty\\, or the field is incorrect",
					"solution" : "Contact the administrator or see the online help"
				},
				"0005203039" : {
					"cause" : "The VM template data is corrupted or does not exit",
					"desc" : "The VM template data is corrupted or does not exit",
					"solution" : "Delete the VM template"
				},
				"0005203040" : {
					"cause" : "The driver is detaching the ISO file",
					"desc" : "The driver is detaching the ISO file",
					"solution" : "Please try later"
				},
				"0005203041" : {
					"cause" : "The number of the published VM template reaches the maximum value (100).",
					"desc" : "The number of the published VM template reaches the maximum value (100).",
					"solution" : "Delete unnecessary VM templates"
				},
				"0005203042" : {
					"cause" : "The VM template is being used to create VMs",
					"desc" : "The VM template is being used to create VMs",
					"solution" : "Please try later."
				},
				"0005203043" : {
					"cause" : "Snapshots exist in the VM",
					"desc" : "Snapshots exist in the VM",
					"solution" : "Delete the snapshots on the VM and try again"
				},
				"0005203044" : {
					"cause" : "The VM template name already exists",
					"desc" : "The VM template name already exists",
					"solution" : "Enter another VM template name"
				},
				"0005203045" : {
					"cause" : "The software can be installed only on the VM templates that have been creating",
					"desc" : "The software can be installed only on the VM templates that have been creating",
					"solution" : "Refresh the page"
				},
				"0005203046" : {
					"cause" : "The VM template has been created successfully",
					"desc" : "The VM template has been created successfully",
					"solution" : "Contact the administrator"
				},
				"0005203047" : {
					"cause" : "The number of VM disks has reached the upper limit",
					"desc" : "The number of VM disks has reached the upper limit",
					"solution" : "Contact technical support"
				},
				"0005203048" : {
					"cause" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored",
					"desc" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored",
					"solution" : "Check the VM state\\, and restore the VM again"
				},
				"0005203049" : {
					"cause" : "The system resources are insufficient",
					"desc" : "The system resources are insufficient",
					"solution" : "Contact technical support"
				},
				"0005203050" : {
					"cause" : "The VM template information cannot be found",
					"desc" : "The VM template information cannot be found",
					"solution" : "Contact technical support"
				},
				"0005203051" : {
					"cause" : "The VM template is being used to create applications",
					"desc" : "The VM template is being used to create applications",
					"solution" : "Please try later"
				},
				"0005203052" : {
					"cause" : "The VM is in stopped or hibernation state",
					"desc" : "The VM is in stopped or hibernation state",
					"solution" : "Contact technical support"
				},
				"0005203053" : {
					"cause" : "The VM template is being created",
					"desc" : "The VM template is being created",
					"solution" : "Contact technical support"
				},
				"0005203054" : {
					"cause" : "The VM is entering hibernation",
					"desc" : "The VM is entering hibernation",
					"solution" : "Contact technical support"
				},
				"0005203055" : {
					"cause" : "Failed to perform the operation because the VM is in hibernation state",
					"desc" : "Failed to perform the operation because the VM is in hibernation state",
					"solution" : "Please start the VM and try again"
				},
				"0005203056" : {
					"cause" : "The resource cluster does not exist",
					"desc" : "The resource cluster does not exist",
					"solution" : "Please select another resource cluster"
				},
				"0005203057" : {
					"cause" : "No matched VM template exists",
					"desc" : "No matched VM template exists",
					"solution" : "Please create the matched VM template"
				},
				"0005203058" : {
					"cause" : "Desktop templates used for creating desktop do not need to be published",
					"desc" : "Desktop templates used for creating desktop do not need to be published",
					"solution" : "Contact the administrator"
				},
				"0005203059" : {
					"cause" : "Only the stopped VM can be published",
					"desc" : "Only the stopped VM can be published",
					"solution" : "Please try later or Contact technical support"
				},
				"0005203060" : {
					"cause" : "Only the VM Template can be published",
					"desc" : "Only the VM Template can be published",
					"solution" : "Please try later or Contact technical support"
				},
				"0005203061" : {
					"cause" : "You cannot modify a VM that is in wrong status",
					"desc" : "You cannot modify a VM that is in wrong status",
					"solution" : "Review the VM template status"
				},
				"0005203062" : {
					"cause" : "Discovering VM templates ...",
					"desc" : "Discovering VM templates ...",
					"solution" : "Contact technical support"
				},
				"0005203063" : {
					"cause" : "The VM template has been associated with a VM logical template, and therefore the VM template publication cannot be canceled",
					"desc" : "The VM template has been associated with a VM logical template, and therefore the VM template publication cannot be canceled",
					"solution" : "Please deassociate the VM logical template from the VM template and try again."
				},
				"0005203064" : {
					"cause" : "The VM template has not been published, and therefore cannot be associated with a VM logical template",
					"desc" : "The VM template has not been published, and therefore cannot be associated with a VM logical template",
					"solution" : "Please publish the VM template and try again."
				},
				"0005203065" : {
					"cause" : "The VM template has been associated with a VM logical template",
					"desc" : "The VM template has been associated with a VM logical template",
					"solution" : "Please deassociate the VM template from the VM logical template before reassociation"
				},
				"0005203066" : {
					"cause" : "A VM template in the same cluster has been associated with the VM logical template",
					"desc" : "A VM template in the same cluster has been associated with the VM logical template",
					"solution" : "Please view the associated VM template"
				},
				"0005203067" : {
					"cause" : "The number of added vm templates reaches the maximum",
					"desc" : "The number of added vm templates reaches the maximum",
					"solution" : "Delete unnecessary vm templates and try to create a VM template again. Perform this operation with caution"
				},
				"0005203068" : {
					"cause" : "The number of added vm templates reaches the maximum",
					"desc" : "The number of added vm templates reaches the maximum",
					"solution" : "Delete unnecessary vm templates and try to create VM template again. Perform this operation with caution"
				},
				"0005203069" : {
					"cause" : "The VM template does not exist",
					"desc" : "The VM template does not exist",
					"solution" : "Please contact your administrator or view the help manual"
				},
				"0005203070" : {
					"cause" : "The template cannot be converted to a VM because it contains a linked clone",
					"desc" : "The template cannot be converted to a VM because it contains a linked clone",
					"solution" : "Please select another VM template"
				},
				"0005203071" : {
					"cause" : "The VM template associate does not exist.",
					"desc" : "The VM template associate does not exist.",
					"solution" : "Contact the administrator"
				},
				"0005203074" : {
					"cause" : "The VM logic template and system versions are not match, associate failed.",
					"desc" : "The VM logic template and system versions are not match, associate failed.",
					"solution" : "Contact the administrator"
				},
				"0005203075" : {
					"cause" : "The VM logic template and system disk are not match, associate failed.",
					"desc" : "The VM logic template and system disk are not match, associate failed.",
					"solution" : "Contact the administrator"
				},
				"0005203076" : {
					"cause" : "Delete NFS template failed.",
					"desc" : "Delete NFS template failed.",
					"solution" : "Contact the administrator"
				},
				"0005205801" : {
					"cause" : "The name of the scheduled task is invalid.",
					"desc" : "The name of the scheduled task is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205802" : {
					"cause" : "The description of the scheduled task is invalid.",
					"desc" : "The description of the scheduled task is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205803" : {
					"cause" : "The scheduled task type is invalid.",
					"desc" : "The scheduled task type is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205804" : {
					"cause" : "Duplicate scheduled task name.",
					"desc" : "Duplicate scheduled task name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205805" : {
					"cause" : "The associated policy does not exist.",
					"desc" : "The associated policy does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205806" : {
					"cause" : "The number of scheduled tasks reaches the maximum value.",
					"desc" : "The number of scheduled tasks reaches the maximum value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205807" : {
					"cause" : "The scheduled task enabled cannot be deleted.",
					"desc" : "The scheduled task enabled cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205808" : {
					"cause" : "The scheduled task does not exist.",
					"desc" : "The scheduled task does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005205809" : {
					"cause" : "The scheduled task in the enabled state cannot be modified.",
					"desc" : "The scheduled task in the enabled state cannot be modified.",
					"solution" : "You can change the status of the scheduled task first."
				},
				"0005401010" : {
					"cause" : "Common users cannot view service templates.",
					"desc" : "Common users cannot view service templates.",
					"solution" : "Contact technical support."
				},
				"0005402005" : {
					"cause" : "During the service creation, the associated service catalog does not exist.",
					"desc" : "During the service creation, the associated service catalog does not exist.",
					"solution" : "Contact technical support."
				},
				"0005402006" : {
					"cause" : "During the service creation, the associated service catalog is not in the VDC of the user.",
					"desc" : "During the service creation, the associated service catalog is not in the VDC of the user.",
					"solution" : "Contact technical support."
				},
				"0005402007" : {
					"cause" : "Only the system administrator can change or create the service whitelist.",
					"desc" : "Only the system administrator can change or create the service whitelist.",
					"solution" : "Contact technical support."
				},
				"0005402008" : {
					"cause" : "The whitelist flag is set, but the list of the whitelist is not set.",
					"desc" : "The whitelist flag is set, but the list of the whitelist is not set.",
					"solution" : "Contact technical support."
				},
				"0005402009" : {
					"cause" : "The service template that corresponds to the template ID entered does not exist.",
					"desc" : "The service template that corresponds to the template ID entered does not exist.",
					"solution" : "Contact technical support."
				},
				"0005402010" : {
					"cause" : "Ordinary users cannot operate service.",
					"desc" : "Ordinary users cannot operate service.",
					"solution" : "Contact technical support."
				},
				"0005402011" : {
					"cause" : "The service is in the publishing state and cannot be deleted.",
					"desc" : "The service is in the publishing state and cannot be deleted.",
					"solution" : "Contact technical support."
				},
				"0005402012" : {
					"cause" : "The action type is not supported.",
					"desc" : "The action type is not supported.",
					"solution" : "Contact technical support."
				},
				"0005402013" : {
					"cause" : "The number of associated catalogs exceeds the maximum number eight.",
					"desc" : "The number of associated catalogs exceeds the maximum number eight.",
					"solution" : "Contact technical support."
				},
				"0005402014" : {
					"cause" : "The size of the image to be uploaded cannot exceed 20 KB.",
					"desc" : "The size of the image to be uploaded cannot exceed 20 KB.",
					"solution" : "Contact technical support."
				},
				"0005402015" : {
					"cause" : "The specified VDC does not exist.",
					"desc" : "The specified VDC does not exist.",
					"solution" : "Contact technical support."
				},
				"0005402016" : {
					"cause" : "The service does not exist. ",
					"desc" : "The service does not exist. ",
					"solution" : "Contact technical support."
				},
				"0005402017" : {
					"cause" : "Users do not have the rights to view service details.",
					"desc" : "Users do not have the rights to view service details.",
					"solution" : "Contact technical support."
				},
				"0005402018" : {
					"cause" : "Only the services of the VDC can be modified.",
					"desc" : "Only the services of the VDC can be modified.",
					"solution" : "Contact technical support."
				},
				"0005402019" : {
					"cause" : "Only the services of the VDC can be deleted.",
					"desc" : "Only the services of the VDC can be deleted.",
					"solution" : "Contact technical support."
				},
				"0005402020" : {
					"cause" : "The service catalog ID entered does not exist.",
					"desc" : "The service catalog ID entered does not exist.",
					"solution" : "Contact technical support."
				},
				"0005402021" : {
					"cause" : "The service ID entered does not exist.",
					"desc" : "The service ID entered does not exist.",
					"solution" : "Contact technical support."
				},
				"0005402022" : {
					"cause" : "If the service is in the publishing state and cannot be modified.",
					"desc" : "If the service is in the publishing state and cannot be modified.",
					"solution" : "Contact technical support."
				},
				"0005402023" : {
					"cause" : "Failed to query the ICT and IT scenarios.",
					"desc" : "Failed to query the ICT and IT scenarios.",
					"solution" : "Contact technical support."
				},
				"0005402024" : {
					"cause" : "Users do not have the rights to create service.",
					"desc" : "Users do not have the rights to create service.",
					"solution" : "Contact technical support."
				},
				"0005402025" : {
					"cause" : "Please make sure the upload is the real picture。",
					"desc" : "Please make sure the upload is the real picture。",
					"solution" : "Contact technical support."
				},
				"0005402026" : {
					"cause" : "The user cannot operate other VDC's services.",
					"desc" : "The user cannot operate other VDC's services.",
					"solution" : "Contact technical support."
				},
				"0005402027" : {
					"cause" : "Image not exists.",
					"desc" : "Image not exists.",
					"solution" : "Contact technical support."
				},
				"0005402028" : {
					"cause" : "The user cannot query other VDC's services icon.",
					"desc" : "The user cannot query other VDC's services icon.",
					"solution" : "Contact technical support."
				},
				"0005402029" : {
					"cause" : "The user cannot delete other VDC's services icon.",
					"desc" : "The user cannot delete other VDC's services icon.",
					"solution" : "Contact technical support."
				},
				"0005402030" : {
					"cause" : "Can't use pictures that type is not the default or is not own to create service.",
					"desc" : "Can't use pictures that type is not the default or is not own to create service.",
					"solution" : "Contact technical support."
				},
				"0005402031" : {
					"cause" : "System administrators have the right to use the tenant side of the interface.",
					"desc" : "System administrators have the right to use the tenant side of the interface.",
					"solution" : "Contact technical support."
				},
				"0005402032" : {
					"cause" : "VDC upload pictures has reached the maximum number.",
					"desc" : "VDC upload pictures has reached the maximum number.",
					"solution" : "Contact technical support."
				},
				"0005402033" : {
					"cause" : "Upload the image format is not the system supports the format.",
					"desc" : "Upload the image format is not the system supports the format.",
					"solution" : "Contact technical support."
				},
				"0005402034" : {
					"cause" : "Images are used by service, cannot be deleted.",
					"desc" : "Images are used by service, cannot be deleted.",
					"solution" : "Contact technical support."
				},
				"0005402035" : {
					"cause" : "The service parameters is not synchronizing with app template, cannot be published. Please modify the service and try again.",
					"desc" : "The service parameters is not synchronizing with app template, cannot be published. Please modify the service and try again.",
					"solution" : "Please modify the service and try again."
				},
				"0005402036" : {
					"cause" : "The count of VDC Services has reached the system maximum number limited.",
					"desc" : "The count of VDC Services has reached the system maximum number limited.",
					"solution" : "Contact technical support."
				},
				"0005402040" : {
					"cause" : "The VDC Service can only to be approvaled by Domain.",
					"desc" : "The VDC Service can only to be approvaled by Domain.",
					"solution" : "Contact technical support."
				},
				"0005402041" : {
					"cause" : "Those Services excepte VDC Service can only to be approvaled by VDC Manager.",
					"desc" : "Those Services excepte VDC Service can only to be approvaled by VDC Manager.",
					"solution" : "Contact technical support."
				},
				"0005403002" : {
					"cause" : "Failed to modify the service catalog because it does not exist.",
					"desc" : "Failed to modify the service catalog because it does not exist.",
					"solution" : "Contact technical support."
				},
				"0005403003" : {
					"cause" : "Failed to delete the service catalog because it does not exist.",
					"desc" : "Failed to delete the service catalog because it does not exist.",
					"solution" : "Contact technical support."
				},
				"0005403004" : {
					"cause" : "Users do not have the right to modify service catalogs of other VDCs.",
					"desc" : "Users do not have the right to modify service catalogs of other VDCs.",
					"solution" : "Contact technical support."
				},
				"0005403005" : {
					"cause" : "New service catalog cannot be created in the VDC because the number of service catalogs in the VDC has reached the maximum.",
					"desc" : "New service catalog cannot be created in the VDC because the number of service catalogs in the VDC has reached the maximum.",
					"solution" : "Contact technical support."
				},
				"0005403006" : {
					"cause" : "The service catalog is not in the same VDC with the current user and cannot be deleted.",
					"desc" : "The service catalog is not in the same VDC with the current user and cannot be deleted.",
					"solution" : "Contact technical support."
				},
				"0005403007" : {
					"cause" : "The service catalog contains services and cannot be deleted.",
					"desc" : "The service catalog contains services and cannot be deleted.",
					"solution" : "Contact technical support."
				},
				"0005403008" : {
					"cause" : "The domain administrator can view the details of only the service catalogs in the VDC.",
					"desc" : "The domain administrator can view the details of only the service catalogs in the VDC.",
					"solution" : "Contact technical support."
				},
				"0005403009" : {
					"cause" : "The VDC administrator cannot view the details of the service catalogs in other VDCs.",
					"desc" : "The VDC administrator cannot view the details of the service catalogs in other VDCs.",
					"solution" : "Contact technical support."
				},
				"0005403010" : {
					"cause" : "Failed to query the service catalog details because the service catalog does not exist.",
					"desc" : "Failed to query the service catalog details because the service catalog does not exist.",
					"solution" : "Contact technical support."
				},
				"0005403041" : {
					"cause" : "Can't operate other's VDC service catalog.",
					"desc" : "Can't operate other's VDC service catalog.",
					"solution" : "Contact technical support."
				},
				"0005404000" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please try again or contact technical support."
				},
				"0005404001" : {
					"cause" : "The time entered cannot be earlier than the current time.",
					"desc" : "The time entered cannot be earlier than the current time.",
					"solution" : "Check that the order input parameters are correct."
				},
				"0005404002" : {
					"cause" : "An exception occurs in the database.",
					"desc" : "An exception occurs in the database.",
					"solution" : "Check the status of the database process, recover the process, and try again."
				},
				"0005404003" : {
					"cause" : "The order number parameter is set incorrectly.",
					"desc" : "The order number parameter is set incorrectly.",
					"solution" : "Check the order number and enter the correct one."
				},
				"0005404004" : {
					"cause" : "The order status does not support this operation.",
					"desc" : "The order status does not support this operation.",
					"solution" : "Check the order status. For example, approve the order and sends the request again."
				},
				"0005404005" : {
					"cause" : "The VDC code input parameter is incorrect.",
					"desc" : "The VDC code input parameter is incorrect.",
					"solution" : "Enter a correct VDC code."
				},
				"0005404006" : {
					"cause" : "The service instance code input parameter is incorrect.",
					"desc" : "The service instance code input parameter is incorrect.",
					"solution" : "Enter a correct service instance code."
				},
				"0005404007" : {
					"cause" : "The service resource code input parameter is incorrect.",
					"desc" : "The service resource code input parameter is incorrect.",
					"solution" : "Enter a correct service resource code."
				},
				"0005404008" : {
					"cause" : "The service status does not support this operation.",
					"desc" : "The service status does not support this operation.",
					"solution" : "Try again after the service instance is created."
				},
				"0005404009" : {
					"cause" : "The order cannot be closed because the status is not initialize: to be submitted.",
					"desc" : "The order cannot be closed because the status is not initialize: to be submitted.",
					"solution" : "Enter a correct VDC code."
				},
				"0005404010" : {
					"cause" : "An operation is being performed for the order. Repeated operations are not allowed.",
					"desc" : "An operation is being performed for the order. Repeated operations are not allowed.",
					"solution" : "Please try again later."
				},
				"0005404011" : {
					"cause" : "An operation has been performed for the order. Repeated operations are not allowed.",
					"desc" : "An operation has been performed for the order. Repeated operations are not allowed.",
					"solution" : "Select another order."
				},
				"0005404012" : {
					"cause" : "The service has not been published.",
					"desc" : "The service has not been published.",
					"solution" : "Publish the service."
				},
				"0005404013" : {
					"cause" : "Database operation failed due to order delay.",
					"desc" : "Database operation failed due to order delay.",
					"solution" : "Contact technical support."
				},
				"0005404014" : {
					"cause" : "The order expiration time entered cannot be earlier than the current time.",
					"desc" : "The order expiration time entered cannot be earlier than the current time.",
					"solution" : "Contact technical support."
				},
				"0005404015" : {
					"cause" : "The domain administrator cannot create an order.",
					"desc" : "The domain administrator cannot create an order.",
					"solution" : "Contact technical support."
				},
				"0005404016" : {
					"cause" : "Orders cannot be created in the VDS because the VDC is not in the service whitelist.",
					"desc" : "Orders cannot be created in the VDS because the VDC is not in the service whitelist.",
					"solution" : "Contact technical support."
				},
				"0005404017" : {
					"cause" : "The VDC cannot use services in other VDCs to create orders.",
					"desc" : "The VDC cannot use services in other VDCs to create orders.",
					"solution" : "Contact technical support."
				},
				"0005404018" : {
					"cause" : "The service instance entered does not exist.",
					"desc" : "The service instance entered does not exist.",
					"solution" : "Contact technical support."
				},
				"0005404019" : {
					"cause" : "Users are not allowed to approve orders.",
					"desc" : "Users are not allowed to approve orders.",
					"solution" : "Contact technical support."
				},
				"0005404020" : {
					"cause" : "The order parameters cannot be empty.",
					"desc" : "The order parameters cannot be empty.",
					"solution" : "Contact technical support."
				},
				"0005404021" : {
					"cause" : "The order modification parameters cannot be empty.",
					"desc" : "The order modification parameters cannot be empty.",
					"solution" : "Contact technical support."
				},
				"0005404022" : {
					"cause" : "Users are not allowed to submit multiple requests at the same time.",
					"desc" : "Users are not allowed to submit multiple requests at the same time.",
					"solution" : "Contact technical support."
				},
				"0005404023" : {
					"cause" : "The order ID cannot be empty.",
					"desc" : "The order ID cannot be empty.",
					"solution" : "Contact technical support."
				},
				"0005404024" : {
					"cause" : "Incorrect service ID. The service does not exist.",
					"desc" : "Incorrect service ID. The service does not exist.",
					"solution" : "Contact technical support."
				},
				"0005404025" : {
					"cause" : "Users do not have the right to modify orders.",
					"desc" : "Users do not have the right to modify orders.",
					"solution" : "Contact technical support."
				},
				"0005404026" : {
					"cause" : "Users do not have the rights to view order details.",
					"desc" : "Users do not have the rights to view order details.",
					"solution" : "Contact technical support."
				},
				"0005404027" : {
					"cause" : "Only one VDC service can be applied each time.",
					"desc" : "Only one VDC service can be applied each time.",
					"solution" : "Contact technical support."
				},
				"0005404028" : {
					"cause" : "Users can only close their own orders.",
					"desc" : "Users can only close their own orders.",
					"solution" : "Contact technical support."
				},
				"0005404029" : {
					"cause" : "The user can only apply for VDC services.",
					"desc" : "The user can only apply for VDC services.",
					"solution" : "Contact technical support."
				},
				"0005404030" : {
					"cause" : "In ict scenarios, VDC administrator cannot apply for VDC services.",
					"desc" :  "In ict scenarios, VDC administrator cannot apply for VDC services.",
					"solution" : "Contact technical support."
				},
                                "0005404031" : {
					"cause" : "VDC has expired. The operation can not be performed.",
					"desc" : "VDC has expired. The operation can not be performed.",
					"solution" : "Contact technical support."
				},
				"0005404032" : {
					"cause" : "Can't modify other VDC service instance resources.",
					"desc" :  "Can't modify other VDC service instance resources.",
					"solution" : "Contact technical support."
				},
				"0005404033" : {
					"cause" : "Ordinary users cann't modify other users's service instance resources.",
					"desc" :  "Ordinary users cann't modify other users's service instance resources.",
					"solution" : "Contact technical support."
				},
				"0005404034" : {
					"cause" : "Can't extend any other service instance resources under the VDC.",
					"desc" :  "Can't extend any other service instance resources under the VDC.",
					"solution" : "Contact technical support."
				},
				"0005404035" : {
					"cause" : "Ordinary users cann't extend other users's service instance resources.",
					"desc" :  "Ordinary users cann't extend other users's service instance resources.",
					"solution" : "Contact technical support."
				},
				"0005404036" : {
					"cause" : "Can't release other VDC service instance resources.",
					"desc" : "Can't release other VDC service instance resources.",
					"solution" : "Contact technical support."
				},
				"0005404037" : {
					"cause" : "Ordinary users cann't release other users's service instance resources.",
					"desc" : "Ordinary users cann't release other users's service instance resources.",
					"solution" : "Contact technical support."
				},
				"0005404038" : {
					"cause" : "The count of VDC's order has reached the system maximum number limited.",
					"desc" : "The count of VDC's order has reached the system maximum number limited.",
					"solution" : "Contact technical support."
				},
				"0005404200" : {
					"cause" : "The current user is a system administrator and is not allowed to view service instances.",
					"desc" : "The current user is a system administrator and is not allowed to view service instances.",
					"solution" : "Contact technical support."
				},
				"0005404201" : {
					"cause" : "The current user and service instance are not in the same VDC. VDC administrators can view only the service instances in their own VDCs.",
					"desc" : "The current user and service instance are not in the same VDC. VDC administrators can view only the service instances in their own VDCs.",
					"solution" : "Contact technical support."
				},
				"0005404202" : {
					"cause" : "The service instance does not exist. ",
					"desc" : "The service instance does not exist. ",
					"solution" : "Contact technical support."
				},
				"0005404203" : {
					"cause" : "The service instance is not created by the user. Common users can view only their own service instances.",
					"desc" : "The service instance is not created by the user. Common users can view only their own service instances.",
					"solution" : "Contact technical support."
				},
				"0005404205" : {
					"cause" : "Ordinary users can not see others's service instance.",
					"desc" : "Ordinary users can not see others's service instance.",
					"solution" : "Contact technical support."
				},
				"0005404206" : {
					"cause" : "Service template data exceptions, query service url occur error.",
					"desc" : "Service template data exceptions, query service url occur error.",
					"solution" : "Contact technical support."
				},
				"0005404222" : {
					"cause" : "The current service instance is expired and cannot be modified.",
					"desc" : "The current service instance is expired and cannot be modified.",
					"solution" : "Contact technical support."
				},
				"0005404223" : {
					"cause" : "The service instance update parameters are incorrect.",
					"desc" : "The service instance update parameters are incorrect.",
					"solution" : "Contact technical support."
				},
				"0005404224" : {
					"cause" : "Can only modify service instance in same VDC.",
					"desc" : "Can only modify service instance in same VDC.",
					"solution" : "Contact technical support."
				},
				"0005404225" : {
					"cause" : "The service instance database ID is not obtained.",
					"desc" : "The service instance database ID is not obtained.",
					"solution" : "Contact technical support."
				},
				"0005404226" : {
					"cause" : "can only modify own service instance.",
					"desc" : "can only modify own service instance.",
					"solution" : "Contact technical support."
				},
				"0005404227" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Contact technical support."
				},
				"0005404228" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Contact technical support."
				},
				"0005402500":{
					"cause" : "Physical machine does not exist。",
					"desc" : "Physical machine does not exist。",
					"solution" : "Contact technical support。"
				},
				"0005402501":{
					"cause" : "Only the system administrator can modify the physical machine。",
					"desc" : "Only the system administrator can modify the physical machine。",
					"solution" : "Contact technical support。"
				},
				"0005402502":{
					"cause" : "Can only modify the unallocated physical machine。",
					"desc" :  "Can only modify the unallocated physical machine。",
					"solution" : "Contact technical support。"
				},
				"0005402503":{
					"cause" : "Only the system administrator can delete the physical machine。",
					"desc" :  "Only the system administrator can delete the physical machine。",
					"solution" : "Contact technical support。"
				},
				"0005402504":{
					"cause" : "Can only delete the unallocated physical machine。",
					"desc" :  "Can only delete the unallocated physical machine。",
					"solution" : "Contact technical support。"
				},
				"0005402505":{
					"cause" : "Only check this VDC physical machine。",
					"desc" :  "Only check this VDC physical machine。",
					"solution" : "Contact technical support。"
				},
				"0005402506":{
					"cause" : "Only the system administrator can create physical machine。",
					"desc" :  "Only the system administrator can create physical machine。",
					"solution" : "Contact technical support。"
				},
				"0005402521":{
					"cause" : "Can't assigned  physical machine whoes state is assigned.",
					"desc" :  "Can't assigned  physical machine whoes state is assigned.",
					"solution" : "Contact technical support。"
				},
				"0099102001" : {
					"cause" : "Invalid ipv4Subnet address.",
					"desc" : "Invalid ipv4Subnet address.",
					"solution" : "Please input a valid ipv4Subnet address."
				},
				"0099102002" : {
					"cause" : "Invalid ipv4Subnet mask.",
					"desc" : "Invalid ipv4Subnet mask.",
					"solution" : "Please input a valid ipv4Subnet mask."
				},
				"0099102003" : {
					"cause" : "Invalid ipv4Subnet gateway.",
					"desc" : "Invalid ipv4Subnet gateway.",
					"solution" : "Please input a valid ipv4Subnet gateway."
				},
				"0099102004" : {
					"cause" : "Invalid ipv4Subnet ipRange List.",
					"desc" : "Invalid ipv4Subnet ipRange List.",
					"solution" : "Please input a valid ipv4Subnet ipRange List."
				},
				"0099102005" : {
					"cause" : "Gateway is not in ipv4Subnet.",
					"desc" : "Gateway is not in ipv4Subnet.",
					"solution" : "Please input a gateway  in ipv4Subnet."
				},
				"0099102006" : {
					"cause" : "IpRange List is not in ipv4Subnet.",
					"desc" : "IpRange List is not in ipv4Subnet.",
					"solution" : "Please input a ipRange List  in ipv4Subnet."
				},
				"0099102007" : {
					"cause" : "Gateway is  in  ipv4Range List.",
					"desc" : "Gateway is  in  ipv4Range List.",
					"solution" : "Please input a gateway  is not in  ipv4Range List."
				},
				"0099102008" : {
					"cause" : "Ipv4Range List is overlop.",
					"desc" : "Ipv4Range List is overlop.",
					"solution" : "Please input not overlop ipv4Ranges."
				},
				"0099102009" : {
					"cause" : "Invalid ipv6Subnet address.",
					"desc" : "Invalid ipv6Subnet address.",
					"solution" : "Please input a valid ipv6Subnet address."
				},
				"0099102010" : {
					"cause" : "Invalid ipv6Subnet mask.",
					"desc" : "Invalid ipv6Subnet mask.",
					"solution" : "Please input a valid ipv6Subnet mask."
				},
				"0099102011" : {
					"cause" : "Invalid ipv6Subnet gateway.",
					"desc" : "Invalid ipv6Subnet gateway.",
					"solution" : "Please input a valid ipv6Subnet gateway."
				},
				"0099102012" : {
					"cause" : "Invalid ipv6Subnet ipRange List.",
					"desc" : "Invalid ipv6Subnet ipRange List.",
					"solution" : "Please input a valid ipv6Subnet ipRange List."
				},
				"0099102013" : {
					"cause" : "Gateway is not in ipv6Subnet.",
					"desc" : "Gateway is not in ipv6Subnet.",
					"solution" : "Please input a gateway  in ipv6Subnet."
				},
				"0099102014" : {
					"cause" : "IpRange List is not in ipv6Subnet.",
					"desc" : "IpRange List is not in ipv6Subnet.",
					"solution" : "Please input a ipRange List  in ipv6Subnet."
				},
				"0099102015" : {
					"cause" : "Gateway is  in  ipv6Range List.",
					"desc" : "Gateway is  in  ipv6Range List.",
					"solution" : "Please input a gateway  is not in  ipv6Range List."
				},
				"0099102016" : {
					"cause" : "Ipv6Range List is overlop.",
					"desc" : "Ipv6Range List is overlop.",
					"solution" : "Please input not overlop ipv6Ranges."
				},
				"0099102017" : {
					"cause" : "Invalid ipv4Subnet, ipv4Subnet address and mask is not logical",
					"desc" : "Invalid ipv4Subnet, ipv4Subnet address and mask is not logical",
					"solution" : "Please input a valid ipv4Subnet."
				},
				"0099102018" : {
					"cause" : "Invalid ipv4 address.",
					"desc" : "Invalid ipv4 address.",
					"solution" : "Please input a valid ipv4 address."
				},
				"0099102019" : {
					"cause" : "Invalid ipv6Subnet, ipv6Subnet address and mask is not logical.",
					"desc" : "Invalid ipv6Subnet, ipv6Subnet address and mask is not logical.",
					"solution" : "Please input a valid ipv6Subnet."
				},
				"0099102020" : {
					"cause" : "Invalid ipv6 address.",
					"desc" : "Invalid ipv6 address.",
					"solution" : "Please input a valid ipv6 address."
				},
				"1000002" : {
					"cause" : "Database error.",
					"desc" : "Database error.",
					"solution" : "Contact technical support."
				},
				"1000004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"1000008" : {
					"cause" : "No permission",
					"desc" : "No permission",
					"solution" : "Contact the system administrator."
				},
				"1000010" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000022" : {
					"cause" : "The network connection failed. Please ensure that the IP address and port configurations are correct.",
					"desc" : "The network connection failed. Please ensure that the IP address and port configurations are correct.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000700" : {
					"cause" : "Network communication is abnormal.",
					"desc" : "Network communication is abnormal.",
					"solution" : "Please try later."
				},
				"1002005" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "Ensure that the VM exists and try again."
				},
				"1002022" : {
					"cause" : "Invalid IP address of the input parameter.",
					"desc" : "Invalid IP address of the input parameter.",
					"solution" : "Contact technical support."
				},
				"1002028" : {
					"cause" : "The user description length is invalid.",
					"desc" : "The user description length is invalid.",
					"solution" : "Contact technical support."
				},
				"1002054" : {
					"cause" : "Invalid IP address.",
					"desc" : "Invalid IP address.",
					"solution" : "Contact technical support."
				},
				"1002062" : {
					"cause" : "Invalid role description.",
					"desc" : "Invalid role description.",
					"solution" : "Contact technical support."
				},
				"1002064" : {
					"cause" : "Invalid host IP address.",
					"desc" : "Invalid host IP address.",
					"solution" : "Contact technical support."
				},
				"1002065" : {
					"cause" : "Duplicate host IP address.",
					"desc" : "Duplicate host IP address.",
					"solution" : "Contact technical support."
				},
				"1002066" : {
					"cause" : "Invalid BMC IP address.",
					"desc" : "Invalid BMC IP address.",
					"solution" : "Contact technical support."
				},
				"1002073" : {
					"cause" : "The BMC IP address is unreachable.",
					"desc" : "The BMC IP address is unreachable.",
					"solution" : "Contact technical support."
				},
				"1002080" : {
					"cause" : "The BMC IP address is empty.",
					"desc" : "The BMC IP address is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002132" : {
					"cause" : "A snapshot is being created. You cannot create multiple snapshots for a VM simultaneously.",
					"desc" : "A snapshot is being created. You cannot create multiple snapshots for a VM simultaneously.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002134" : {
					"cause" : "The destination node or resource cluster does not have network resources required for running the VM.",
					"desc" : "The destination node or resource cluster does not have network resources required for running the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002147" : {
					"cause" : "A node that meets the network requirements for starting the VM does not exist in the specified location.",
					"desc" : "A node that meets the network requirements for starting the VM does not exist in the specified location.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002151" : {
					"cause" : "The storage or network of the destination node does not support VM running.",
					"desc" : "The storage or network of the destination node does not support VM running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002166" : {
					"cause" : "The storage IP address is in use.",
					"desc" : "The storage IP address is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002177" : {
					"cause" : "Invalid VLAN ID.",
					"desc" : "Invalid VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002183" : {
					"cause" : "The reserved IP addresses cannot contain the gateway.",
					"desc" : "The reserved IP addresses cannot contain the gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002184" : {
					"cause" : "The reserved IP address segments for the subnet overlap.",
					"desc" : "The reserved IP address segments for the subnet overlap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002185" : {
					"cause" : "The reserved IP address segments overlap.",
					"desc" : "The reserved IP address segments overlap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002186" : {
					"cause" : "The primary DNS server for the DHCP server is invalid.",
					"desc" : "The primary DNS server for the DHCP server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002187" : {
					"cause" : "The secondary DNS server for the DHCP server is invalid.",
					"desc" : "The secondary DNS server for the DHCP server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002189" : {
					"cause" : "The domain name of the DHCP server is invalid.",
					"desc" : "The domain name of the DHCP server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002191" : {
					"cause" : "The primary WINS server for the DHCP server is invalid.",
					"desc" : "The primary WINS server for the DHCP server is invalid.",
					"solution" : "Contact technical support."
				},
				"1002192" : {
					"cause" : "The secondary WINS server for the DHCP server is invalid.",
					"desc" : "The secondary WINS server for the DHCP server is invalid.",
					"solution" : "Contact technical support."
				},
				"1002193" : {
					"cause" : "The end IP address of the reserved IP address segment cannot be less than the start IP address.",
					"desc" : "The end IP address of the reserved IP address segment cannot be less than the start IP address.",
					"solution" : "Contact technical support."
				},
				"1002194" : {
					"cause" : "The reserved IP addresses must be within the subnet.",
					"desc" : "The reserved IP addresses must be within the subnet.",
					"solution" : "Contact technical support."
				},
				"1002196" : {
					"cause" : "The VMs must be stopped when subnets in the network is being modified.",
					"desc" : "The VMs must be stopped when subnets in the network is being modified.",
					"solution" : "Please stop VMs in the network."
				},
				"1002198" : {
					"cause" : "The VLAN pool cannot be empty.",
					"desc" : "The VLAN pool cannot be empty.",
					"solution" : "Contact technical support."
				},
				"1002200" : {
					"cause" : "The value range of the VLAN ID is 2 to 4094.",
					"desc" : "The value range of the VLAN ID is 2 to 4094.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002202" : {
					"cause" : "The start VLAN ID is less than the end VLAN ID.",
					"desc" : "The start VLAN ID is less than the end VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002203" : {
					"cause" : "The start VLAN ID must be less than or equal to the end VLAN ID.",
					"desc" : "The start VLAN ID must be less than or equal to the end VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002205" : {
					"cause" : "VLAN pools cannot overlap.",
					"desc" : "VLAN pools cannot overlap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002215" : {
					"cause" : "The VLAN pool does not exist.",
					"desc" : "The VLAN pool does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002216" : {
					"cause" : "The VLAN pool is in use.",
					"desc" : "The VLAN pool is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002222" : {
					"cause" : "Either the subnet ID or VLAN ID can be configured.",
					"desc" : "Either the subnet ID or VLAN ID can be configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002224" : {
					"cause" : "The VLAN does not exist in the VLAN pool.",
					"desc" : "The VLAN does not exist in the VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002225" : {
					"cause" : "The associated VLAN of the subnet selected for the port group does not exist in the VLAN pool.",
					"desc" : "The associated VLAN of the subnet selected for the port group does not exist in the VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002229" : {
					"cause" : "Failed to delete the port group because it is associated with VMs.",
					"desc" : "Failed to delete the port group because it is associated with VMs.",
					"solution" : "Please delete the virtual machines under this route network, and then try again."
				},
				"1002243" : {
					"cause" : "The description of the uplink aggregation port is invalid.",
					"desc" : "The description of the uplink aggregation port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002256" : {
					"cause" : "VLAN ID conflict.",
					"desc" : "VLAN ID conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002267" : {
					"cause" : "The description of the virtual switch is invalid.",
					"desc" : "The description of the virtual switch is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002268" : {
					"cause" : "The description of the port group is invalid.",
					"desc" : "The description of the port group is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002269" : {
					"cause" : "The description of the subnet is invalid.",
					"desc" : "The description of the subnet is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002270" : {
					"cause" : "The description of the system plane is invalid.",
					"desc" : "The description of the system plane is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002271" : {
					"cause" : "The description of the uplink port is invalid.",
					"desc" : "The description of the uplink port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002317" : {
					"cause" : "The reserved IP addresses have been assigned.",
					"desc" : "The reserved IP addresses have been assigned.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002318" : {
					"cause" : "The IP address of the gateway is in use.",
					"desc" : "The IP address of the gateway is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002319" : {
					"cause" : "The IP address and the subnet mask mismatch.",
					"desc" : "The IP address and the subnet mask mismatch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002320" : {
					"cause" : "The available IP addresses in the subnet are insufficient.",
					"desc" : "The available IP addresses in the subnet are insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002322" : {
					"cause" : "The number of VLAN pools reaches the upper limit.",
					"desc" : "The number of VLAN pools reaches the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002326" : {
					"cause" : "Invalid network port mapping parameter.",
					"desc" : "Invalid network port mapping parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002340" : {
					"cause" : "The subnet address and gateway address are not in the same network segment.",
					"desc" : "The subnet address and gateway address are not in the same network segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002345" : {
					"cause" : "Failed to create the disk on the VRM.",
					"desc" : "Failed to create the disk on the VRM.",
					"solution" : "The network or SAN device may be faulty or the storage space available in the data store may be insufficient. Please check."
				},
				"1002346" : {
					"cause" : "Failed to initialize the network on the VRM.",
					"desc" : "Failed to initialize the network on the VRM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002359" : {
					"cause" : "The port groups, to which the NICs belong, must be on the same DVswitch.",
					"desc" : "The port groups, to which the NICs belong, must be on the same DVswitch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002408" : {
					"cause" : "The IP address or subnet mask is invalid.",
					"desc" : "The IP address or subnet mask is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002461" : {
					"cause" : "Disk migration fails, the migration process may be provided by the virtual machine state changes, host or network status changes due to abnormalities.",
					"desc" : "Disk migration fails, the migration process may be provided by the virtual machine state changes, host or network status changes due to abnormalities.",
					"solution" : "Contact technical support."
				},
				"1002503" : {
					"cause" : "The entered size of the memory for hot add must be a multiple of 1024 MB.",
					"desc" : "The entered size of the memory for hot add must be a multiple of 1024 MB.",
					"solution" : "The entered size of the memory for hot add must be a multiple of 1024 MB. Please enter a correct memory value."
				},
				"1003000" : {
					"cause" : "The VLAN ID is out of range (1 to 4096).",
					"desc" : "The VLAN ID is out of range (1 to 4096).",
					"solution" : "Contact technical support."
				},
				"1003001" : {
					"cause" : "The IP address format or range is invalid or the end address is less than the start address (The IP address must be in the format of A.B.C.D, where A, B, C, and D range from 0 to 255.).",
					"desc" : "The IP address format or range is invalid or the end address is less than the start address (The IP address must be in the format of A.B.C.D, where A, B, C, and D range from 0 to 255.).",
					"solution" : "Contact technical support."
				},
				"1003003" : {
					"cause" : "The gateway address that comprises the IPv4 subnet address and IPv4 prefix is invalid.",
					"desc" : "The gateway address that comprises the IPv4 subnet address and IPv4 prefix is invalid.",
					"solution" : "Contact technical support."
				},
				"1003004" : {
					"cause" : "The IP addresses overlap existing ones.",
					"desc" : "The IP addresses overlap existing ones.",
					"solution" : "Contact technical support."
				},
				"1003011" : {
					"cause" : "The IP address pool does not exist.",
					"desc" : "The IP address pool does not exist.",
					"solution" : "Contact technical support."
				},
				"1003012" : {
					"cause" : "Incorrect IP address pool type.",
					"desc" : "Incorrect IP address pool type.",
					"solution" : "Contact technical support."
				},
				"1003013" : {
					"cause" : "Failed to deploy the IP address pool.",
					"desc" : "Failed to deploy the IP address pool.",
					"solution" : "Contact technical support."
				},
				"1003014" : {
					"cause" : "The IP address pool is in use.",
					"desc" : "The IP address pool is in use.",
					"solution" : "Contact technical support."
				},
				"1003018" : {
					"cause" : "Failed to create the VLAN.",
					"desc" : "Failed to create the VLAN.",
					"solution" : "Contact technical support."
				},
				"1003021" : {
					"cause" : "Failed to set the SAN device address and network information.",
					"desc" : "Failed to set the SAN device address and network information.",
					"solution" : "Contact technical support."
				},
				"1003022" : {
					"cause" : "The VLAN area for the VLAN pool conflicts with another one.",
					"desc" : "The VLAN area for the VLAN pool conflicts with another one.",
					"solution" : "Contact technical support."
				},
				"1003023" : {
					"cause" : "The VLAN is in use.",
					"desc" : "The VLAN is in use.",
					"solution" : "Contact technical support."
				},
				"1003024" : {
					"cause" : "A vlanIf conflict occurred.",
					"desc" : "A vlanIf conflict occurred.",
					"solution" : "Contact technical support."
				},
				"1003026" : {
					"cause" : "The subnet to be configured is in a VLAN pool.",
					"desc" : "The subnet to be configured is in a VLAN pool.",
					"solution" : "Contact technical support."
				},
				"1003034" : {
					"cause" : "The VLAN is in use.",
					"desc" : "The VLAN is in use.",
					"solution" : "Contact technical support."
				},
				"1003039" : {
					"cause" : "The operation failed because the firewall does not exist.",
					"desc" : "The operation failed because the firewall does not exist.",
					"solution" : "Please refresh the device list."
				},
				"1003040" : {
					"cause" : "The start IP address and end IP address are not in the available IP address range. Available IP addresses are the IP addresses, except the first IP address (reserved network segment address) and last IP address (reserved broadcasting address), in a network segment.",
					"desc" : "The start IP address and end IP address are not in the available IP address range. Available IP addresses are the IP addresses, except the first IP address (reserved network segment address) and last IP address (reserved broadcasting address), in a network segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003043" : {
					"cause" : "This operation is not allowed when the firewall is in the current state.",
					"desc" : "This operation is not allowed when the firewall is in the current state.",
					"solution" : "Please try later."
				},
				"1003044" : {
					"cause" : "The router does not exist.",
					"desc" : "The router does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1003045" : {
					"cause" : "The switch has routing services configured.",
					"desc" : "The switch has routing services configured.",
					"solution" : "Delete the routing services on the switch."
				},
				"1003048" : {
					"cause" : "The rule id has exist.",
					"desc" : "The rule id has exist.",
					"solution" : "Please input the rule id again."
				},
				"1003050" : {
					"cause" : "The end IP address is less than the start IP address.",
					"desc" : "The end IP address is less than the start IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003051" : {
					"cause" : "The IP address pool is being created and cannot be updated.",
					"desc" : "The IP address pool is being created and cannot be updated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003052" : {
					"cause" : "The IP address pool is being deleted and cannot be updated.",
					"desc" : "The IP address pool is being deleted and cannot be updated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003053" : {
					"cause" : "The number of IP addresses after the modification is less than the number of IP addresses that are used currently.",
					"desc" : "The number of IP addresses after the modification is less than the number of IP addresses that are used currently.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003056" : {
					"cause" : "The firewall is in the abnormal state.",
					"desc" : "The firewall is in the abnormal state.",
					"solution" : "Please check that the firewall connection parameters are correct."
				},
				"1003057" : {
					"cause" : "The physical firewall cannot be deleted because virtual firewalls are created on it.",
					"desc" : "The physical firewall cannot be deleted because virtual firewalls are created on it.",
					"solution" : "Please ensure that no virtual firewall is created on the physical firewall."
				},
				"1003058" : {
					"cause" : "Firewall configuration data does not exist.",
					"desc" : "Firewall configuration data does not exist.",
					"solution" : "Please check the firewall configurations."
				},
				"1005000" : {
					"cause" : "Duplicate names.",
					"desc" : "Duplicate names.",
					"solution" : "Please check the name."
				},
				"1010055" : {
					"cause" : "The device IP address is unreachable.",
					"desc" : "The device IP address is unreachable.",
					"solution" : "Please contact Huawei technical support."
				},
				"1010058" : {
					"cause" : "The IP address or Mac address of the device already exists in the system.",
					"desc" : "The IP address or Mac address of the device already exists in the system.",
					"solution" : "Please ensure that the device is not already added."
				},
				"1010060" : {
					"cause" : "Failed to connect to the host using this BMC IP address.",
					"desc" : "Failed to connect to the host using this BMC IP address.",
					"solution" : "Please ensure that the BMC IP address is correct."
				},
				"1010072" : {
					"cause" : "The host is not powered on or its management IP address is unreachable.",
					"desc" : "The host is not powered on or its management IP address is unreachable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010077" : {
					"cause" : "The password is incorrect or the device IP address is unreachable.",
					"desc" : "The password is incorrect or the device IP address is unreachable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010078" : {
					"cause" : "A network exception occurred.",
					"desc" : "A network exception occurred.",
					"solution" : "Please tray again later."
				},
				"1010085" : {
					"cause" : "The entered BMC IP address already exists in the system.",
					"desc" : "The entered BMC IP address already exists in the system.",
					"solution" : "Please enter the correct BMC IP address."
				},
				"1010086" : {
					"cause" : "The entered OS IP address already exists in the system.",
					"desc" : "The entered OS IP address already exists in the system.",
					"solution" : "Please enter the correct OS IP address."
				},
				"1010087" : {
					"cause" : "A device with the same equipment room, rack, and subrack information or a switch module with the same slot ID already exists in the system.",
					"desc" : "A device with the same equipment room, rack, and subrack information or a switch module with the same slot ID already exists in the system.",
					"solution" : "Please enter the correct device information."
				},
				"1010101" : {
					"cause" : "IP address {0} is not included in subnet {1}.",
					"desc" : "IP address {0} is not included in subnet {1}.",
					"solution" : "Please re-enter the IP."
				},
				"1010102" : {
					"cause" : "IP address {0} is in use by host {1}.",
					"desc" : "IP address {0} is in use by host {1}.",
					"solution" : "Please re-enter the IP."
				},
				"1010103" : {
					"cause" : "IP address {0} is in use.",
					"desc" : "IP address {0} is in use.",
					"solution" : "Please re-enter the IP."
				},
				"1010104" : {
					"cause" : "Failed to change host IP address in subnet {0}.",
					"desc" : "Failed to change host IP address in subnet {0}.",
					"solution" : "Please modify again."
				},
				"1011090" : {
					"cause" : "Set SNMP Trap fails.",
					"desc" : "Set SNMP Trap fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020009" : {
					"cause" : "Invalid IP address.",
					"desc" : "Invalid IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020018" : {
					"cause" : "The VLAN ID conflicts with the system reserved VLAN ID.",
					"desc" : "The VLAN ID conflicts with the system reserved VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020026" : {
					"cause" : "Failed to configure the VLAN and IP address for the uplink port.",
					"desc" : "Failed to configure the VLAN and IP address for the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020027" : {
					"cause" : "Failed to delete the VLAN and IP address of the uplink port.",
					"desc" : "Failed to delete the VLAN and IP address of the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020028" : {
					"cause" : "Failed to modify the VLAN and IP address for the uplink port.",
					"desc" : "Failed to modify the VLAN and IP address for the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020029" : {
					"cause" : "Failed to query the VLAN and IP address of the uplink port.",
					"desc" : "Failed to query the VLAN and IP address of the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020030" : {
					"cause" : "The gateway address and the specified IP address are not in the same network segment.",
					"desc" : "The gateway address and the specified IP address are not in the same network segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020034" : {
					"cause" : "The VLAN ID does not exist in the VLAN pool. Please create a VLAN pool that contains the VLAN ID.",
					"desc" : "The VLAN ID does not exist in the VLAN pool. Please create a VLAN pool that contains the VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020037" : {
					"cause" : "The IP address starting with 127 is invalid. This IP address is reserved as a loopback address. Please enter a valid value ranging from 1 to 223.",
					"desc" : "The IP address starting with 127 is invalid. This IP address is reserved as a loopback address. Please enter a valid value ranging from 1 to 223.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020039" : {
					"cause" : "Network addresses or broadcasting addresses are not supported.",
					"desc" : "Network addresses or broadcasting addresses are not supported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020050" : {
					"cause" : "The zone not access switches.",
					"desc" : "The zone not access switches.",
					"solution" : "Please access switchs and try again."
				},
				"1020051" : {
					"cause" : "The VLAN ID of the uplink port conflicts with the VLAN ID of an existing VLAN pool.",
					"desc" : "The VLAN ID of the uplink port conflicts with the VLAN ID of an existing VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020052" : {
					"cause" : "The VLAN ID of the uplink port conflicts with the VLAN ID of an existing subnet.",
					"desc" : "The VLAN ID of the uplink port conflicts with the VLAN ID of an existing subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020055" : {
					"cause" : "Failed to log in to the SAN device.",
					"desc" : "Failed to log in to the SAN device.",
					"solution" : "Ensure that the specified parameters are correct."
				},
				"1040004" : {
					"cause" : "Network configuration is empty.",
					"desc" : "Network configuration is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040016" : {
					"cause" : "System is unable to connect with the UHM",
					"desc" : "System is unable to connect with the UHM",
					"solution" : "Please contact your administrator or view the help manual"
				},
				"1040034" : {
					"cause" : "Failed to delete the resource cluster because the resource cluster contains network resource.",
					"desc" : "Failed to delete the resource cluster because the resource cluster contains network resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040046" : {
					"cause" : "The raw device resource cluster cannot be created because the BMC IP address pool does not exist on the raw device.",
					"desc" : "The raw device resource cluster cannot be created because the BMC IP address pool does not exist on the raw device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040054" : {
					"cause" : "Capacity reduction failed because the VLAN pool is used by a port group.",
					"desc" : "Capacity reduction failed because the VLAN pool is used by a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040068" : {
					"cause" : "The VLAN IDs of subnet {0} and subnet {1} conflict.",
					"desc" : "The VLAN IDs of subnet {0} and subnet {1} conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040069" : {
					"cause" : "The VLAN IDs of VLAN pool {0} and subnet {1} conflict.",
					"desc" : "The VLAN IDs of VLAN pool {0} and subnet {1} conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040070" : {
					"cause" : "The VLAN IDs of subnet {0} and VLAN pool {1} conflict.",
					"desc" : "The VLAN IDs of subnet {0} and VLAN pool {1} conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040071" : {
					"cause" : "The VLAN IDs of VLAN pool {0} and VLAN pool {1} conflict.",
					"desc" : "The VLAN IDs of VLAN pool {0} and VLAN pool {1} conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040072" : {
					"cause" : "The IP address segments of subnet {0} and subnet {1} conflict.",
					"desc" : "The IP address segments of subnet {0} and subnet {1} conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040073" : {
					"cause" : "The IP address segment of subnet {0} conflicts with the internal IP address segment of the system.",
					"desc" : "The IP address segment of subnet {0} conflicts with the internal IP address segment of the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040074" : {
					"cause" : "The IP address segments of subnet {0} and the system BMC IP address pool conflict.",
					"desc" : "The IP address segments of subnet {0} and the system BMC IP address pool conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040075" : {
					"cause" : "The VLAN IDs of subnet {0} and the system BMC IP address pool conflict.",
					"desc" : "The VLAN IDs of subnet {0} and the system BMC IP address pool conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040076" : {
					"cause" : "The VLAN IDs of VLAN pool {0} and he system BMC IP address pool conflict.",
					"desc" : "The VLAN IDs of VLAN pool {0} and he system BMC IP address pool conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040077" : {
					"cause" : "The VLAN ID of subnet {0} conflicts with the internal subnet VLAN ID of the system.",
					"desc" : "The VLAN ID of subnet {0} conflicts with the internal subnet VLAN ID of the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040078" : {
					"cause" : "The VLAN ID of VLAN pool {0} conflicts with the internal subnet VLAN ID of the system.",
					"desc" : "The VLAN ID of VLAN pool {0} conflicts with the internal subnet VLAN ID of the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040083" : {
					"cause" : "The IP address segments of subnet {0} and the system aggregation switch conflict.",
					"desc" : "The IP address segments of subnet {0} and the system aggregation switch conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040084" : {
					"cause" : "The VLAN IDs of subnet {0} and the system aggregation switch conflict.",
					"desc" : "The VLAN IDs of subnet {0} and the system aggregation switch conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040085" : {
					"cause" : "The VLAN IDs of VLAN {0} and the system aggregation switch conflict.",
					"desc" : "The VLAN IDs of VLAN {0} and the system aggregation switch conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040086" : {
					"cause" : "The IP addresses of the aggregation switch and system subnet conflict.",
					"desc" : "The IP addresses of the aggregation switch and system subnet conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040123" : {
					"cause" : "Failed to configure the management network.",
					"desc" : "Failed to configure the management network.",
					"solution" : "Please contact Huawei technical support."
				},
				"1040124" : {
					"cause" : "Failed to allocate available management IP addresses.",
					"desc" : "Failed to allocate available management IP addresses.",
					"solution" : "Please contact Huawei technical support."
				},
				"1040138" : {
					"cause" : "This operation cannot be performed because the network is being created,modified,or deleted in this cluster.",
					"desc" : "This operation cannot be performed because the network is being created,modified,or deleted in this cluster.",
					"solution" : "Please try later."
				},
				"1040146" : {
					"cause" : "Opensm has been enabled on multiple hosts.",
					"desc" : "Opensm has been enabled on multiple hosts.",
					"solution" : "Please select a single host for capacity reduction each time."
				},
				"1050002" : {
					"cause" : "The subnet ID and VLAN ID must have one and only one value.",
					"desc" : "The subnet ID and VLAN ID must have one and only one value.",
					"solution" : "Contact technical support."
				},
				"1050004" : {
					"cause" : "Invalid VLAN ID.",
					"desc" : "Invalid VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050007" : {
					"cause" : "Invalid port group description.",
					"desc" : "Invalid port group description.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050013" : {
					"cause" : "The subnets or VLANs in the port group list do not belong to the same resource cluster.",
					"desc" : "The subnets or VLANs in the port group list do not belong to the same resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050016" : {
					"cause" : "The VLAN type cannot be changed to subnet type.",
					"desc" : "The VLAN type cannot be changed to subnet type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050017" : {
					"cause" : "The DVS does not exist.",
					"desc" : "The DVS does not exist.",
					"solution" : "Contact technical support."
				},
				"1050022" : {
					"cause" : "The DVS is not associated with any VLAN pool.",
					"desc" : "The DVS is not associated with any VLAN pool.",
					"solution" : "Contact technical support."
				},
				"1050027" : {
					"cause" : "The VLAN ID already used in DVS.",
					"desc" : "The VLAN ID already used in DVS.",
					"solution" : "Please change another VLAN ID."
				},
				"1050028" : {
					"cause" : "VSS dose not exist.",
					"desc" : "VSS dose not exist.",
					"solution" : "Contact technical support."
				},
				"1050042" : {
					"cause" : "Associate dvs fail.",
					"desc" : "Associate dvs fail.",
					"solution" : "Contact technical support."
				},
				"1060006" : {
					"cause" : "Invalid IPSAN SN.",
					"desc" : "Invalid IPSAN SN.",
					"solution" : "Contact technical support."
				},
				"1060008" : {
					"cause" : "The storage description is too long.",
					"desc" : "The storage description is too long.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060139" : {
					"cause" : "The IP address of the storage device already exists.",
					"desc" : "The IP address of the storage device already exists.",
					"solution" : "Please enter a unique IP address."
				},
				"1060140" : {
					"cause" : "The IP address or port number of the storage device is invalid.",
					"desc" : "The IP address or port number of the storage device is invalid.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070025" : {
					"cause" : "The VM has been frozen.",
					"desc" : "The VM has been frozen.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070077" : {
					"cause" : "This NIC does not exist on the VM.",
					"desc" : "This NIC does not exist on the VM.",
					"solution" : "Please select a proper NIC."
				},
				"1070080" : {
					"cause" : "A snapshot task is in progress, a single vm can not handle multiple snapshot task simultaneously.",
					"desc" : "A snapshot task is in progress, a single vm can not handle multiple snapshot task simultaneously.",
					"solution" : "Please wait the in progress snapshot task to be completed before starting another snapshot task."
				},
				"1070098" : {
					"cause" : "The host is disconnection from the network.",
					"desc" : "The host is disconnection from the network.",
					"solution" : "Ensure that the host is in a correct state or contact technical support engineers."
				},
				"1070108" : {
					"cause" : "A network associated with the vm is not allowed to finish this operation.",
					"desc" : "A network associated with the vm is not allowed to finish this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070112" : {
					"cause" : "VM and the selected network are not in same cluster.",
					"desc" : "VM and the selected network are not in same cluster.",
					"solution" : "Please select other network and try again."
				},
				"1070113" : {
					"cause" : "There is an elastic ip or NAPT assigned to the nic.",
					"desc" : "There is an elastic ip or NAPT assigned to the nic.",
					"solution" : "Please unbind the elastic ip first and then try again."
				},
				"1070118" : {
					"cause" : "It doesn't support adding iNIC network card on line.",
					"desc" : "It doesn't support adding iNIC network card on line.",
					"solution" : "Please contact technical support."
				},
				"1070119" : {
					"cause" : "It doesn't support deleting iNIC network card on line.",
					"desc" : "It doesn't support deleting iNIC network card on line.",
					"solution" : "Please contact technical support."
				},
				"1070124" : {
					"cause" : "Network ID or VPC ID is not accordance with VM's network.",
					"desc" : "Network ID or VPC ID is not accordance with VM's network.",
					"solution" : "Ensure that the entered network ID or VPC ID is valid for VM."
				},
				"1070213" : {
					"cause" : "Allocated ip failed.",
					"desc" : "Allocated ip failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070228" : {
					"cause" : "The VSS plug-in is not installed on this virtual machine.",
					"desc" : "The VSS plug-in is not installed on this virtual machine.",
					"solution" : "Please install VSS plug-in on this virtual machine."
				},
				"1070547" : {
					"cause" : "Preparation of network failure.",
					"desc" : "Preparation of network failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075048" : {
					"cause" : "No NIC is configured for the VM.",
					"desc" : "No NIC is configured for the VM.",
					"solution" : "Select a proper boot device."
				},
				"1080000" : {
					"cause" : "The subnet information is invalid.",
					"desc" : "The subnet information is invalid.",
					"solution" : "Please input the subnet information again."
				},
				"1080001" : {
					"cause" : "The subnet ip or mask is invalid.",
					"desc" : "The subnet ip or mask is invalid.",
					"solution" : "Please input the subnet information again."
				},
				"1080002" : {
					"cause" : "The end IP address of the reserved IP address segment is less than the start IP address.",
					"desc" : "The end IP address of the reserved IP address segment is less than the start IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080003" : {
					"cause" : "The start IP address and end IP address of the reserved IP address segment are not in the subnet.",
					"desc" : "The start IP address and end IP address of the reserved IP address segment are not in the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080004" : {
					"cause" : "The gateway is invalid.",
					"desc" : "The gateway is invalid.",
					"solution" : "Please input the subnet information again."
				},
				"1080006" : {
					"cause" : "Do not select a used VLAN ID.",
					"desc" : "Do not select a used VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080011" : {
					"cause" : "Failed to delete the subnet because it is being used by external network or internal organization network.",
					"desc" : "Failed to delete the subnet because it is being used by external network or internal organization network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080012" : {
					"cause" : "Failed to modify the subnet because it is being used by a network.",
					"desc" : "Failed to modify the subnet because it is being used by a network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080014" : {
					"cause" : "Invalid DHCP IP address.",
					"desc" : "Invalid DHCP IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080016" : {
					"cause" : "The VLAN ID is used.",
					"desc" : "The VLAN ID is used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080019" : {
					"cause" : "The IP address of the active DNS server is invalid.",
					"desc" : "The IP address of the active DNS server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080020" : {
					"cause" : "The IP address of the standby DNS server is invalid.",
					"desc" : "The IP address of the standby DNS server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080021" : {
					"cause" : "The IP address of the active WINS server is invalid.",
					"desc" : "The IP address of the active WINS server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080022" : {
					"cause" : "The IP address of the standby WINS server is invalid.",
					"desc" : "The IP address of the standby WINS server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080023" : {
					"cause" : "Insufficient IP addresses for assignment on the modified management subnet.",
					"desc" : "Insufficient IP addresses for assignment on the modified management subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080026" : {
					"cause" : "Failed to assign the IP addresses on the management network.",
					"desc" : "Failed to assign the IP addresses on the management network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080029" : {
					"cause" : "Failed to check the parameter for IP address modification.",
					"desc" : "Failed to check the parameter for IP address modification.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080030" : {
					"cause" : "The IP address parameter used for IP address modification is invalid.",
					"desc" : "The IP address parameter used for IP address modification is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080031" : {
					"cause" : "Invalid subnet mask parameter for IP address modification. The length cannot exceed 24 characters.",
					"desc" : "Invalid subnet mask parameter for IP address modification. The length cannot exceed 24 characters.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080032" : {
					"cause" : "The gateway parameter used for IP address modification is invalid.",
					"desc" : "The gateway parameter used for IP address modification is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080033" : {
					"cause" : "The VLAN parameter used for IP address modification is invalid.",
					"desc" : "The VLAN parameter used for IP address modification is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080034" : {
					"cause" : "The specified IP address conflicts with the gateway IP address.",
					"desc" : "The specified IP address conflicts with the gateway IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080035" : {
					"cause" : "Failed to reserve IP addresses.",
					"desc" : "Failed to reserve IP addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080037" : {
					"cause" : "Failed to obtain the cloud management IP address.",
					"desc" : "Failed to obtain the cloud management IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080038" : {
					"cause" : "Failed to update the management IP address.",
					"desc" : "Failed to update the management IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080044" : {
					"cause" : "The entered reserved IP address segments overlap.",
					"desc" : "The entered reserved IP address segments overlap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080045" : {
					"cause" : "The number of reserved IP addresses exceeds the maximum (128).",
					"desc" : "The number of reserved IP addresses exceeds the maximum (128).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080046" : {
					"cause" : "The start IP address or end IP address of the reserved IP address segment is empty.",
					"desc" : "The start IP address or end IP address of the reserved IP address segment is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080047" : {
					"cause" : "The result of logical AND operation between the subnet IP address and the mask must be the same as the subnet IP address.",
					"desc" : "The result of logical AND operation between the subnet IP address and the mask must be the same as the subnet IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080048" : {
					"cause" : "Failed to delete the subnet because it is being used by some clusters.",
					"desc" : "Failed to delete the subnet because it is being used by some clusters.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080049" : {
					"cause" : "The system has allocated 4096 IPs in the subnet. This is beyond the capacity of the system.",
					"desc" : "The system has allocated 4096 IPs in the subnet. This is beyond the capacity of the system.",
					"solution" : "Please choose another network."
				},
				"1080050" : {
					"cause" : "There is no available IP in the subnet.",
					"desc" : "There is no available IP in the subnet.",
					"solution" : "Please choose another network."
				},
				"1080051" : {
					"cause" : "There is insufficient IP in the subnet.",
					"desc" : "There is insufficient IP in the subnet.",
					"solution" : "Please choose another network."
				},
				"1080052" : {
					"cause" : "The subnet of network overlaps with the other subnet in vpc.",
					"desc" : "The subnet of network overlaps with the other subnet in vpc.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080053" : {
					"cause" : "There is no available IP in the subnet, subnet is filled with reserved IP.",
					"desc" : "There is no available IP in the subnet, subnet is filled with reserved IP.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080054" : {
					"cause" : "The subnet of network overlaps with the subnet of VPN remote user network.",
					"desc" : "The subnet of network overlaps with the subnet of VPN remote user network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080055" : {
					"cause" : "The subnet of network overlaps with the subnet of VSA network.",
					"desc" : "The subnet of network overlaps with the subnet of VSA network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080056" : {
					"cause" : "The subnet of network overlaps with the subnet of external network or dhcp server.",
					"desc" : "The subnet of network overlaps with the subnet of external network or dhcp server.",
					"solution" : ""
				},
				"1080057" : {
					"cause" : "The subnet of network overlaps with the subnet of physical manager network.",
					"desc" : "The subnet of network overlaps with the subnet of physical manager network.",
					"solution" : ""
				},
				"1080058" : {
					"cause" : "The subnet of network overlaps with the subnet of physical business network.",
					"desc" : "The subnet of network overlaps with the subnet of physical business network.",
					"solution" : ""
				},
				"1080059" : {
					"cause" : "Reserve IP segments contains already allocated IP.",
					"desc" : "Reserve IP segments contains already allocated IP.",
					"solution" : ""
				},
				"1080061" : {
					"cause" : "The private IP address has already been allocated.",
					"desc" : "The private IP address has already been allocated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080062" : {
					"cause" : "The assigned private IP address is not in subnet.",
					"desc" : "The assigned private IP address is not in subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080063" : {
					"cause" : "No IP address in the network needs to be repaired.",
					"desc" : "No IP address in the network needs to be repaired.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080064" : {
					"cause" : "The available ip can not contain the system reserved ip.",
					"desc" : "The available ip can not contain the system reserved ip.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080066" : {
					"cause" : "The available ip range do not contain the allocated ip.",
					"desc" : "The available ip range do not contain the allocated ip.",
					"solution" : "Please input the subnet information again."
				},
				"1080067" : {
					"cause" : "Only the subnet with static inject or internal dhcp can appointed IP.",
					"desc" : "Only the subnet with static inject or internal dhcp can appointed IP.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080070" : {
					"cause" : "The total IP of the subnet is great than 65536.",
					"desc" : "The total IP of the subnet is great than 65536.",
					"solution" : "Contact technical support."
				},
				"1080101" : {
					"cause" : "The available IP address segments contain the floating IP address or management IP address of FusionManager.",
					"desc" : "The available IP address segments contain the floating IP address or management IP address of FusionManager.",
					"solution" : "Please contact your administrator."
				},
				"1082000" : {
					"cause" : "The entered available management IP address segments contain duplicate IP addresses.",
					"desc" : "The entered available management IP address segments contain duplicate IP addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082001" : {
					"cause" : "The available management IP address segments contain the gateway address.",
					"desc" : "The available management IP address segments contain the gateway address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"10820010" : {
					"cause" : "The networks you selected are conflicted.",
					"desc" : "The networks you selected are conflicted.",
					"solution" : "Contact technical support."
				},
				"1082002" : {
					"cause" : "The total number of IP addresses in the available management IP address segments exceeded the upper limit (10000).",
					"desc" : "The total number of IP addresses in the available management IP address segments exceeded the upper limit (10000).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082003" : {
					"cause" : "The IP address to be verified is not contained in the available management IP address segments.",
					"desc" : "The IP address to be verified is not contained in the available management IP address segments.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082004" : {
					"cause" : "Failed to update the available management IP address segments.",
					"desc" : "Failed to update the available management IP address segments.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082005" : {
					"cause" : "The IP addresses in the available management IP address segment are insufficient.",
					"desc" : "The IP addresses in the available management IP address segment are insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082006" : {
					"cause" : "The available management IP address segments are not covered by the subnet.",
					"desc" : "The available management IP address segments are not covered by the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082007" : {
					"cause" : "The available management IP address segments contain IP addresses reserved for VDI.",
					"desc" : "The available management IP address segments contain IP addresses reserved for VDI.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082008" : {
					"cause" : "The gateway address is the same as an IP address reserved for VDI.",
					"desc" : "The gateway address is the same as an IP address reserved for VDI.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1082009" : {
					"cause" : "The subnet mask is invalid.",
					"desc" : "The subnet mask is invalid.",
					"solution" : "Please input the subnet information again."
				},
				"1083003" : {
					"cause" : "The start IP address and end IP address are not in the same network segment.",
					"desc" : "The start IP address and end IP address are not in the same network segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1083004" : {
					"cause" : "The end IP address is less than the start IP address.",
					"desc" : "The end IP address is less than the start IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1083006" : {
					"cause" : "Failed to set the GMN external IP address.",
					"desc" : "Failed to set the GMN external IP address.",
					"solution" : "Contact technical support."
				},
				"1083007" : {
					"cause" : "The management subnet cannot be modified because the networking mode has not been configured.",
					"desc" : "The management subnet cannot be modified because the networking mode has not been configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1089998" : {
					"cause" : "The networking mode cannot be modified because the subnet, VLAN, router, or aggregation switch IP address has been configured in the system.",
					"desc" : "The networking mode cannot be modified because the subnet, VLAN, router, or aggregation switch IP address has been configured in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090000" : {
					"cause" : "The VLAN pool information is invalid.",
					"desc" : "The VLAN pool information is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090001" : {
					"cause" : "The VLAN pool does not exist.",
					"desc" : "The VLAN pool does not exist.",
					"solution" : "Contact technical support."
				},
				"1090002" : {
					"cause" : "The VLAN range of the VLAN pool overlaps with that of an existing VLAN pool.",
					"desc" : "The VLAN range of the VLAN pool overlaps with that of an existing VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090003" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Contact technical support."
				},
				"1090004" : {
					"cause" : "The name of the current VLAN pool already exists.",
					"desc" : "The name of the current VLAN pool already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090005" : {
					"cause" : "{0} does not exist in the VLAN pool selected by the resource cluster.",
					"desc" : "{0} does not exist in the VLAN pool selected by the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090006" : {
					"cause" : "{0} in the VLAN pool selected by the resource cluster has been used by another resource cluster.",
					"desc" : "{0} in the VLAN pool selected by the resource cluster has been used by another resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090007" : {
					"cause" : "Failed to delete the VLAN pool because it is being used by external network or internal organization network.",
					"desc" : "Failed to delete the VLAN pool because it is being used by external network or internal organization network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090008" : {
					"cause" : "Failed to modify the VLAN pool because it is being used by a resource cluster.",
					"desc" : "Failed to modify the VLAN pool because it is being used by a resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090009" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090010" : {
					"cause" : "The VLAN IDs in the current VLAN pool are in use.",
					"desc" : "The VLAN IDs in the current VLAN pool are in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090011" : {
					"cause" : "Failed to delete the VLAN pool because it is in use.",
					"desc" : "Failed to delete the VLAN pool because it is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090013" : {
					"cause" : "Failed to modify the VLAN pool because it has been used by a port group.",
					"desc" : "Failed to modify the VLAN pool because it has been used by a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090014" : {
					"cause" : "A VLAN pool cannot manage multiple DVSs in the same cluster.",
					"desc" : "A VLAN pool cannot manage multiple DVSs in the same cluster.",
					"solution" : "Please check the entered parameters."
				},
				"1090015" : {
					"cause" : "The VLAN pool cannot be disassociated from the DVS because a network has been added to the VLAN pool.",
					"desc" : "The VLAN pool cannot be disassociated from the DVS because a network has been added to the VLAN pool.",
					"solution" : "Please check the entered parameters."
				},
				"1090016" : {
					"cause" : "Failed to disassociate the DVS from the VLAN pool because the resource cluster of the DVS is in use by a VDC.",
					"desc" : "Failed to disassociate the DVS from the VLAN pool because the resource cluster of the DVS is in use by a VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090017" : {
					"cause" : "Failed to add the cluster to the VDC because the VLAN pool associated with the DVS in the cluster does not contain all VLANs used by the VDC.",
					"desc" : "Failed to add the cluster to the VDC because the VLAN pool associated with the DVS in the cluster does not contain all VLANs used by the VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090018" : {
					"cause" : "The VLAN is not applicable.",
					"desc" : "The VLAN is not applicable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090050" : {
					"cause" : "The VLAN is not in the VLAN pool.",
					"desc" : "The VLAN is not in the VLAN pool.",
					"solution" : "Contact technical support."
				},
				"1090053" : {
					"cause" : "The VLAN segment of the VLAN pool contains the used VLAN IDs of the VSA network.",
					"desc" : "The VLAN segment of the VLAN pool contains the used VLAN IDs of the VSA network.",
					"solution" : "Please enter another VLAN segment."
				},
				"1090054" : {
					"cause" : "The VLAN segment of the VLAN pool {0} contains the used VLAN IDs {1}.",
					"desc" : "The VLAN segment of the VLAN pool {0} contains the used VLAN IDs {1}.",
					"solution" : "Please enter another VLAN segment and try again."
				},
				"1090056" : {
					"cause" : "No available device dock vlan",
					"desc" : "No available device dock vlan",
					"solution" : "Contact the system administrator."
				},
				"1090058" : {
					"cause" : "The vlan not exist.",
					"desc" : "The vlan not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100009" : {
					"cause" : "The entered FusionStorage management IP address already exists in the system.",
					"desc" : "The entered FusionStorage management IP address already exists in the system.",
					"solution" : "Please specify the FusionStorage management IP to another value and try later."
				},
				"1100011" : {
					"cause" : "The entered server IP address of the FusionStorage device is already used in the system.",
					"desc" : "The entered server IP address of the FusionStorage device is already used in the system.",
					"solution" : "Ensure that the entered server IP address of the FusionStorage device is unique in the system."
				},
				"1110007" : {
					"cause" : "The orgVDC has network resources associated.",
					"desc" : "The orgVDC has network resources associated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110021" : {
					"cause" : "The orgVDC failed to be deleted.",
					"desc" : "The orgVDC failed to be deleted.",
					"solution" : "Please check that no VPC is associated with this orgVDC."
				},
				"1110026" : {
					"cause" : "The public IP upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The public IP upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "The public IP upper limit modified by the organization VDC is should be more than the used capacity."
				},
				"1110027" : {
					"cause" : "The hardware firewall upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The hardware firewall upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "The hardware firewall upper limit modified by the organization VDC is should be more than the used capacity."
				},
				"1110028" : {
					"cause" : "The software firewall upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The software firewall upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "The software firewall upper limit modified by the organization VDC is less than the used capacity."
				},
				"1120003" : {
					"cause" : "Failed to update the BMC IP address pool.",
					"desc" : "Failed to update the BMC IP address pool.",
					"solution" : "Contact technical support."
				},
				"1120004" : {
					"cause" : "Failed to query the BMC IP address pool.",
					"desc" : "Failed to query the BMC IP address pool.",
					"solution" : "Contact technical support."
				},
				"1120005" : {
					"cause" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing subnet.",
					"desc" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing subnet.",
					"solution" : "Contact technical support."
				},
				"1120006" : {
					"cause" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing VLAN pool.",
					"desc" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing VLAN pool.",
					"solution" : "Contact technical support."
				},
				"1120007" : {
					"cause" : "Failed to create the BMC IP address pool because no networking mode is configured.",
					"desc" : "Failed to create the BMC IP address pool because no networking mode is configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120008" : {
					"cause" : "Failed to modify the BMC IP address pool because no networking mode is configured.",
					"desc" : "Failed to modify the BMC IP address pool because no networking mode is configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120009" : {
					"cause" : "The VLAN ID of the BMC IP address pool conflicts with that of the aggregation switch uplink port.",
					"desc" : "The VLAN ID of the BMC IP address pool conflicts with that of the aggregation switch uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120010" : {
					"cause" : "The IP address of the BMC IP address pool conflicts with that of the aggregation switch uplink port.",
					"desc" : "The IP address of the BMC IP address pool conflicts with that of the aggregation switch uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120011" : {
					"cause" : "The IP address of the BMC IP address pool conflicts with that of the system subnet.",
					"desc" : "The IP address of the BMC IP address pool conflicts with that of the system subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120012" : {
					"cause" : "Failed to perform the BMC IP address pool operation properly.",
					"desc" : "Failed to perform the BMC IP address pool operation properly.",
					"solution" : "Contact technical support."
				},
				"1120013" : {
					"cause" : "Failed to create the BMC IP address pool.",
					"desc" : "Failed to create the BMC IP address pool.",
					"solution" : "Contact technical support."
				},
				"1130000" : {
					"cause" : "No assignable VLAN.",
					"desc" : "No assignable VLAN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1130010" : {
					"cause" : "One of the VLANs to be added is in use by another VDC.",
					"desc" : "One of the VLANs to be added is in use by another VDC.",
					"solution" : "Modify the VLANs to be added and try again."
				},
				"1130011" : {
					"cause" : "One of the VLANs to be added is in use by an external network.",
					"desc" : "One of the VLANs to be added is in use by an external network.",
					"solution" : "Modify the VLANs to be added and try again."
				},
				"1130012" : {
					"cause" : "One of the VLANs to be deleted is in use.",
					"desc" : "One of the VLANs to be deleted is in use.",
					"solution" : "Modify the VLANs to be deleted and try again."
				},
				"1140018" : {
					"cause" : "The hypervisor port and IP address are the same as existing values.",
					"desc" : "The hypervisor port and IP address are the same as existing values.",
					"solution" : "Please enter new values again."
				},
				"1140019" : {
					"cause" : "The DVS is associating with VLANPOOL.",
					"desc" : "The DVS is associating with VLANPOOL.",
					"solution" : "Please disassociate DVS and VLANPOOL."
				},
				"1140020" : {
					"cause" : "The DVS is associating with VSANetwork.",
					"desc" : "The DVS is associating with VSANetwork.",
					"solution" : "Please disassociate DVS and VSANetwork."
				},
				"1140040" : {
					"cause" : "The cluster associated with same DVS must be in same zone.",
					"desc" : "The cluster associated with same DVS must be in same zone.",
					"solution" : "Please select correct zone or cluser."
				},
				"1140044" : {
					"cause" : "The cluster cannot be disassociated from the zone.",
					"desc" : "The cluster cannot be disassociated from the zone.",
					"solution" : "Delete the external or organization network associated with this cluster first."
				},
				"1140046" : {
					"cause" : "The cluster is not associated with any zones.",
					"desc" : "The cluster is not associated with any zones.",
					"solution" : "Please check the association relationship of this cluster."
				},
				"1140047" : {
					"cause" : "The DVS does not contain a VSS.",
					"desc" : "The DVS does not contain a VSS.",
					"solution" : "Please add a VSS first."
				},
				"1140067" : {
					"cause" : "The DVS in the cluster is already associated with a VLAN pool.",
					"desc" : "The DVS in the cluster is already associated with a VLAN pool.",
					"solution" : "Unassociate the DVS with the VLAN pool first."
				},
				"1140068" : {
					"cause" : "The cluster is already associated with a VSA or VTEP network.",
					"desc" : "The cluster is already associated with a VSA or VTEP network.",
					"solution" : "Remove all of the VSA network and VTEP network which this cluster was associated with first."
				},
				"1140069" : {
					"cause" : "Existing router in resources partition,modify the network is not allowed.",
					"desc" : "Existing router in resources partition,modify the network is not allowed.",
					"solution" : "Please delete the router from resource partition."
				},
				"1150008" : {
					"cause" : "Duplicate IP address.",
					"desc" : "Duplicate IP address.",
					"solution" : "Ensure that the IP address is unique in the system."
				},
				"1150009" : {
					"cause" : "The IP address format is incorrect.",
					"desc" : "The IP address format is incorrect.",
					"solution" : "Ensure that the IP address format is correct."
				},
				"1150022" : {
					"cause" : "The specified management IP address is invalid.",
					"desc" : "The specified management IP address is invalid.",
					"solution" : "Enter a correct management IP address."
				},
				"1150036" : {
					"cause" : "The request timed out.",
					"desc" : "The request timed out.",
					"solution" : "Ensure that the network is properly connected and try again."
				},
				"1150038" : {
					"cause" : "The specified IP address, port, username, or password may be incorrect, or the network is disconnected.",
					"desc" : "The specified IP address, port, username, or password may be incorrect, or the network is disconnected.",
					"solution" : "Ensure that the specified IP address, username, and password are correct, and the network comunication is normal."
				},
				"1150040" : {
					"cause" : "Failed to obtain the storage IP address of the node.",
					"desc" : "Failed to obtain the storage IP address of the node.",
					"solution" : "Contact technical support."
				},
				"1150051" : {
					"cause" : "Failed to obtain the storage IP address of the node.",
					"desc" : "Failed to obtain the storage IP address of the node.",
					"solution" : "Please wait until host being reduced completely."
				},
				"1150054" : {
					"cause" : "The network device does not exist.",
					"desc" : "The network device does not exist.",
					"solution" : "Refresh the page and view the latest network device information."
				},
				"1150059" : {
					"cause" : "The management IP address cannot be changed because no FusionStorage device is available.",
					"desc" : "The management IP address cannot be changed because no FusionStorage device is available.",
					"solution" : "Please check if FusionStorage logic device is available."
				},
				"1162003" : {
					"cause" : "No available VSA manager network.",
					"desc" : "No available VSA manager network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162004" : {
					"cause" : "The network does not exist.",
					"desc" : "The network does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162005" : {
					"cause" : "This network is being used by VM.",
					"desc" : "This network is being used by VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162011" : {
					"cause" : "This network is being used by ACL.",
					"desc" : "This network is being used by ACL.",
					"solution" : "Contact technical support."
				},
				"1162012" : {
					"cause" : "The SNAT current network is open.",
					"desc" : "The SNAT current network is open.",
					"solution" : "Contact technical support."
				},
				"1162013" : {
					"cause" : "This network is being used by VPN connection.",
					"desc" : "This network is being used by VPN connection.",
					"solution" : "Contact technical support."
				},
				"1162014" : {
					"cause" : "This network is being used by direct network.",
					"desc" : "This network is being used by direct network.",
					"solution" : "Contact technical support."
				},
				"1162015" : {
					"cause" : "This network is being used by software virtual firewall.",
					"desc" : "This network is being used by software virtual firewall.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162016" : {
					"cause" : "There are manually acquired IP addresses in this network.",
					"desc" : "There are manually acquired IP addresses in this network.",
					"solution" : "Contact technical support."
				},
				"1162017" : {
					"cause" : "This network is being used by VLB.",
					"desc" : "This network is being used by VLB.",
					"solution" : "Contact technical support."
				},
				"1162117" : {
					"cause" : "The current state of the network does not support this operation, please try later.",
					"desc" : "The current state of the network does not support this operation, please try later.",
					"solution" : "Please try later."
				},
				"1162118" : {
					"cause" : "The available IP addresses are insufficient.",
					"desc" : "The available IP addresses are insufficient.",
					"solution" : "Please input the subnet information again."
				},
				"1162200" : {
					"cause" : "The number of VPC specification exceeds the upper limit.",
					"desc" : "The number of VPC specification exceeds the upper limit.",
					"solution" : ""
				},
				"1162201" : {
					"cause" : "The VPC specification name already exists.",
					"desc" : "The VPC specification name already exists.",
					"solution" : ""
				},
				"1162202" : {
					"cause" : "The VPC specification does not exist.",
					"desc" : "The VPC specification does not exist.",
					"solution" : ""
				},
				"1162203" : {
					"cause" : "The VPC specification is in use.",
					"desc" : "The VPC specification is in use.",
					"solution" : ""
				},
				"1162500" : {
					"cause" : "The external network does not exist.",
					"desc" : "The external network does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162501" : {
					"cause" : "The number of organization networks exceeds the upper limit.",
					"desc" : "The number of organization networks exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162503" : {
					"cause" : "The VLAN ID is not available or the corresponding VLAN pool is unavailable.",
					"desc" : "The VLAN ID is not available or the corresponding VLAN pool is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162505" : {
					"cause" : "The VLAN has been used or the VLAN pool to which the VLAN belongs has been deleted.",
					"desc" : "The VLAN has been used or the VLAN pool to which the VLAN belongs has been deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162506" : {
					"cause" : "The DVS cannot be deleted because an external or organization network is already created on it.",
					"desc" : "The DVS cannot be deleted because an external or organization network is already created on it.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162507" : {
					"cause" : "The VSS cannot be deleted because an external or organization network is already created on the DVS providing the VSS.",
					"desc" : "The VSS cannot be deleted because an external or organization network is already created on the DVS providing the VSS.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162508" : {
					"cause" : "The vpc does not exist.",
					"desc" : "The vpc does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1162510" : {
					"cause" : "Failed to create the organization network.",
					"desc" : "Failed to create the organization network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162511" : {
					"cause" : "Failed to create the DHCP subnet.",
					"desc" : "Failed to create the DHCP subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162512" : {
					"cause" : "No available external network.",
					"desc" : "No available external network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162514" : {
					"cause" : "The network does not exist.",
					"desc" : "The network does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162515" : {
					"cause" : "The external network has been used by the current VPC.",
					"desc" : "The external network has been used by the current VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162516" : {
					"cause" : "The network does not belong to the current VPC.",
					"desc" : "The network does not belong to the current VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162517" : {
					"cause" : "The number of networks has reached the maximum number allowed by the VPC.",
					"desc" : "The number of networks has reached the maximum number allowed by the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162519" : {
					"cause" : "The network is not in the complete state and cannot be used.",
					"desc" : "The network is not in the complete state and cannot be used.",
					"solution" : "Contact technical support."
				},
				"1162520" : {
					"cause" : "The VLAN has been used by a VLAN-type network and cannot be used to create subnet-type network.",
					"desc" : "The VLAN has been used by a VLAN-type network and cannot be used to create subnet-type network.",
					"solution" : "Contact technical support."
				},
				"1162521" : {
					"cause" : "The VLAN has been used by a subnet of another network.",
					"desc" : "The VLAN has been used by a subnet of another network.",
					"solution" : "Contact technical support."
				},
				"1162522" : {
					"cause" : "The network is not a direct network.",
					"desc" : "The network is not a direct network.",
					"solution" : "Contact technical support."
				},
				"1162523" : {
					"cause" : "There is no available vsa manager network.",
					"desc" : "There is no available vsa manager network.",
					"solution" : "Contact the system administrator."
				},
				"1162524" : {
					"cause" : "A VPC can create a maximum of 200 DHCP network.",
					"desc" : "A VPC can create a maximum of 200 DHCP network.",
					"solution" : "Contact technical support."
				},
				"1162525" : {
					"cause" : "There is no available vtep network.",
					"desc" : "There is no available vtep network.",
					"solution" : "Contact technical support."
				},
				"1162526" : {
					"cause" : "Failed to delete dhcp subnet on vsa.",
					"desc" : "Failed to delete dhcp subnet on vsa.",
					"solution" : "Contact technical support."
				},
				"1162527" : {
					"cause" : "Subnet and the public IP pool conflicts.",
					"desc" : "Subnet and the public IP pool conflicts.",
					"solution" : "Contact technical support."
				},
				"1162528" : {
					"cause" : "The manual IP doesn't exist.",
					"desc" : "The manual IP doesn't exist.",
					"solution" : "Please refresh the manual IP list and try again."
				},
				"1162529" : {
					"cause" : "The DHCP server for external network dose not exist.",
					"desc" : "The DHCP server for external network dose not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162530" : {
					"cause" : "The state does not allow the DHCP server operation.",
					"desc" : "The state does not allow the DHCP server operation.",
					"solution" : "lease contact your administrator or view the help manual."
				},
				"1162531" : {
					"cause" : "A maximum of 200 routed networks can be created for a VPC that has applied for a software firewall.",
					"desc" : "A maximum of 200 routed networks can be created for a VPC that has applied for a software firewall.",
					"solution" : "Please contact your administrator."
				},
				"1162532" : {
					"cause" : "A maximum of 199 external networks with its IP address assignment mode set to internal DHCP can be created in a zone.",
					"desc" : "A maximum of 199 external networks with its IP address assignment mode set to internal DHCP can be created in a zone.",
					"solution" : "Please contact your administrator."
				},
				"1162537" : {
					"cause" : "Only the internal network which has subnet can associate the router.",
					"desc" : "Only the internal network which has subnet can associate the router.",
					"solution" : "lease contact your administrator or view the help manual."
				},
				"1162538" : {
					"cause" : "Only the routed network can remove association with the router.",
					"desc" : "Only the routed network can remove association with the router.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162539" : {
					"cause" : "Routed network only support static manual or internal dhcp IP allocate policy.",
					"desc" : "Routed network only support static manual or internal dhcp IP allocate policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162546" : {
					"cause" : "No Internet-connected IPv4 external network with its IP address assignment mode set to static injection is available in the resource zone. Such an external network cannot use an IPv6 subnet.",
					"desc" : "No Internet-connected IPv4 external network with its IP address assignment mode set to static injection is available in the resource zone. Such an external network cannot use an IPv6 subnet.",
					"solution" : "Contact the administrator"
				},
				"1163003" : {
					"cause" : "The router is abnormal.",
					"desc" : "The router is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163006" : {
					"cause" : "The correct VFW has been associated with a VPC.",
					"desc" : "The correct VFW has been associated with a VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163007" : {
					"cause" : "The VPC has been associated with a VFW.",
					"desc" : "The VPC has been associated with a VFW.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163008" : {
					"cause" : "The VFW cannot be released because networks exist in the VPC.",
					"desc" : "The VFW cannot be released because networks exist in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163009" : {
					"cause" : "The VFW does not need to be released because it is not associated with any VPC.",
					"desc" : "The VFW does not need to be released because it is not associated with any VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163010" : {
					"cause" : "The firewall resource ID does not exist.",
					"desc" : "The firewall resource ID does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163012" : {
					"cause" : "Failed to modify firewall configurations.",
					"desc" : "Failed to modify firewall configurations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163013" : {
					"cause" : "There is elastic IP in vpc, can not realse virtual firewall.",
					"desc" : "There is elastic IP in vpc, can not realse virtual firewall.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163014" : {
					"cause" : "The VPC has already been authorized.",
					"desc" : "The VPC has already been authorized.",
					"solution" : "Contact technical support."
				},
				"1164200" : {
					"cause" : "There is no available public IP in the zone.",
					"desc" : "There is no available public IP in the zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166003" : {
					"cause" : "The virtual firewall is freezed.can not create acl.",
					"desc" : "The virtual firewall is freezed.can not create acl.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166006" : {
					"cause" : "The virtual firewall is freezed.can not create acl rule.",
					"desc" : "The virtual firewall is freezed.can not create acl rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166007" : {
					"cause" : "The firewall ACL has already existed.",
					"desc" : "The firewall ACL has already existed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166016" : {
					"cause" : "The status of VPC does not allow to create firewall acl.",
					"desc" : "The status of VPC does not allow to create firewall acl.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166017" : {
					"cause" : "The network is not route network.can not create firewall rule.",
					"desc" : "The network is not route network.can not create firewall rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166018" : {
					"cause" : "The VPC is not applied any router.",
					"desc" : "The VPC is not applied any router.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162550" : {
					"cause" : "The current router does not support the VXLAN network.",
					"desc" : "The current router does not support the VXLAN network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166019" : {
					"cause" : "Elastic IP is not in the VPC.",
					"desc" : "Elastic IP is not in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166020" : {
					"cause" : "The acl is not firewall acl.can not create firewall acl rule.",
					"desc" : "The acl is not firewall acl.can not create firewall acl rule.",
					"solution" : "Contact the system administrator."
				},
				"1166022" : {
					"cause" : "The firewall rule dose not exist.",
					"desc" : "The firewall rule dose not exist.",
					"solution" : "Contact technical support."
				},
				"1166023" : {
					"cause" : "The network status is not ready. can not create NetACL rule.",
					"desc" : "The network status is not ready. can not create NetACL rule.",
					"solution" : "Contact the system administrator."
				},
				"1166025" : {
					"cause" : "The firewall rule is abnormal, so it can not be deleted.",
					"desc" : "The firewall rule is abnormal, so it can not be deleted.",
					"solution" : "Contact technical support."
				},
				"1166026" : {
					"cause" : "Router is not ready.",
					"desc" : "Router is not ready.",
					"solution" : "Please check the Router status"
				},
				"1166027" : {
					"cause" : "The firewall rule dose not belong to the VPC.",
					"desc" : "The firewall rule dose not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1166028" : {
					"cause" : "The current network mode dose not support intra-zone ACL.",
					"desc" : "The current network mode dose not support intra-zone ACL.",
					"solution" : "Contact technical support."
				},
				"1167002" : {
					"cause" : "SNAT is not enabled.",
					"desc" : "SNAT is not enabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167011" : {
					"cause" : "DNAT is not enabled.",
					"desc" : "DNAT is not enabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167012" : {
					"cause" : "Failed to open SNAT for the network on the device.",
					"desc" : "Failed to open SNAT for the network on the device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167019" : {
					"cause" : "SNAT is being enabled.",
					"desc" : "SNAT is being enabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167021" : {
					"cause" : "There is no available IP in the public IP pool.",
					"desc" : "There is no available IP in the public IP pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167029" : {
					"cause" : "SNAT is being disabled.",
					"desc" : "SNAT is being disabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167030" : {
					"cause" : "DNAT is not in the enabled state.",
					"desc" : "DNAT is not in the enabled state.",
					"solution" : "Contact the system administrator."
				},
				"1167033" : {
					"cause" : "The VM does not have a NIC that supports DNAT.",
					"desc" : "The VM does not have a NIC that supports DNAT.",
					"solution" : "Contact the system administrator."
				},
				"1167034" : {
					"cause" : "The zone does not have parameters configured for VM access through a public network.",
					"desc" : "The zone does not have parameters configured for VM access through a public network.",
					"solution" : "Contact the system administrator."
				},
				"1167035" : {
					"cause" : "The network is not a routed network.",
					"desc" : "The network is not a routed network.",
					"solution" : "Contact the system administrator."
				},
				"1167036" : {
					"cause" : "SNAT is already configured on the network.",
					"desc" : "SNAT is already configured on the network.",
					"solution" : "Contact the system administrator."
				},
				"1167038" : {
					"cause" : "The network is not contained in the specified VPC.",
					"desc" : "The network is not contained in the specified VPC.",
					"solution" : "Contact the system administrator."
				},
				"1167039" : {
					"cause" : "The network has not been created.",
					"desc" : "The network has not been created.",
					"solution" : "Contact the system administrator."
				},
				"1167040" : {
					"cause" : "The SNAT dose not belong to the VPC.",
					"desc" : "The SNAT dose not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1167041" : {
					"cause" : "DNAT is already enabled on the VM.",
					"desc" : "DNAT is already enabled on the VM.",
					"solution" : "Contact the system administrator."
				},
				"1167045" : {
					"cause" : "The NIC and private port has been configured DNAT.",
					"desc" : "The NIC and private port has been configured DNAT.",
					"solution" : "Contact the system administrator."
				},
				"1167047" : {
					"cause" : "The private IP address and private port has been configured DNAT.",
					"desc" : "The private IP address and private port has been configured DNAT.",
					"solution" : "Contact the system administrator."
				},
				"1167048" : {
					"cause" : "The public IP address and public port has been configured DNAT.",
					"desc" : "The public IP address and public port has been configured DNAT.",
					"solution" : "Contact the system administrator."
				},
				"1167049" : {
					"cause" : "No available public IP address in VPC.",
					"desc" : "No available public IP address in VPC.",
					"solution" : "Contact the system administrator."
				},
				"1167050" : {
					"cause" : "The public IP address is already used in VPC.",
					"desc" : "The public IP address is already used in VPC.",
					"solution" : "Contact the system administrator."
				},
				"1167051" : {
					"cause" : "It has reached the upper limit of public IP under VDC.",
					"desc" : "It has reached the upper limit of public IP under VDC.",
					"solution" : "Contact the system administrator."
				},
				"1167052" : {
					"cause" : "It has reached the upper limit of hardware virtual firewall under VDC.",
					"desc" : "It has reached the upper limit of hardware virtual firewall under VDC.",
					"solution" : "Contact the system administrator."
				},
				"1167053" : {
					"cause" : "It has reached the upper limit of software virtual firewall under VDC.",
					"desc" : "It has reached the upper limit of software virtual firewall under VDC.",
					"solution" : "Contact the system administrator."
				},
				"1167054" : {
					"cause" : "The assigned public IP is not under VPC public IP.",
					"desc" : "The assigned public IP is not under VPC public IP.",
					"solution" : "Contact the system administrator."
				},
				"1167055" : {
					"cause" : "The assigned public IP does not exist under VPC.",
					"desc" : "The assigned public IP does not exist under VPC.",
					"solution" : "Contact the system administrator."
				},
				"1167056" : {
					"cause" : "The assigned public IP and the public IP of Opened SNAT are inconsistent.",
					"desc" : "The assigned public IP and the public IP of Opened SNAT are inconsistent.",
					"solution" : "Contact the system administrator."
				},
				"1167057" : {
					"cause" : "There are public IP under VPC, does not allow to release the virtual firewall.",
					"desc" : "There are public IP under VPC, does not allow to release the virtual firewall.",
					"solution" : "Contact the system administrator."
				},
				"1167058" : {
					"cause" : "The appointed public IP does not exist in public IP pool.",
					"desc" : "The appointed public IP does not exist in public IP pool.",
					"solution" : "Contact the system administrator."
				},
				"1167059" : {
					"cause" : "The available public IP under the zone is insufficient.",
					"desc" : "The available public IP under the zone is insufficient.",
					"solution" : "Contact the system administrator."
				},
				"1167060" : {
					"cause" : "The available public IP of appointed public IP pool is insufficient.",
					"desc" : "The available public IP of appointed public IP pool is insufficient.",
					"solution" : "Contact the system administrator."
				},
				"1167061" : {
					"cause" : "Insufficient public IP addresses for the external network of the virtual firewall.",
					"desc" : "Insufficient public IP addresses for the external network of the virtual firewall.",
					"solution" : "Contact the system administrator."
				},
				"1167063" : {
					"cause" : "The vm or network dose not belong to the VPC.",
					"desc" : "The vm or network dose not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1167064" : {
					"cause" : "DNAT dose not belong to the VPC.",
					"desc" : "DNAT dose not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1167200" : {
					"cause" : "The elastic IP address does not exist.",
					"desc" : "The elastic IP address does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167202" : {
					"cause" : "The elastic IP address is already bound to the VM.",
					"desc" : "The elastic IP address is already bound to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167204" : {
					"cause" : "The NIC does not support elastic IP address configurations.",
					"desc" : "The NIC does not support elastic IP address configurations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167205" : {
					"cause" : "The elastic IP address is not bound to a VM.",
					"desc" : "The elastic IP address is not bound to a VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167208" : {
					"cause" : "The elastic IP address is already frozen.",
					"desc" : "The elastic IP address is already frozen.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167209" : {
					"cause" : "The elastic IP address is already recovered.",
					"desc" : "The elastic IP address is already recovered.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167210" : {
					"cause" : "The elastic IP address is being bound to the VM.",
					"desc" : "The elastic IP address is being bound to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167211" : {
					"cause" : "The elastic IP address is being unbound fromu00a0the VM.",
					"desc" : "The elastic IP address is being unbound fromu00a0the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167212" : {
					"cause" : "The elastic IP address is being frozen.",
					"desc" : "The elastic IP address is being frozen.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167213" : {
					"cause" : "The elastic IP address is being recovered.",
					"desc" : "The elastic IP address is being recovered.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167214" : {
					"cause" : "The applied elastic IP address exceed the max num.",
					"desc" : "The applied elastic IP address exceed the max num.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167215" : {
					"cause" : "There is no nic can be bound to elastic ip.",
					"desc" : "There is no nic can be bound to elastic ip.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167216" : {
					"cause" : "The eip vpc is not consistent with the nic vpc.",
					"desc" : "The eip vpc is not consistent with the nic vpc.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167217" : {
					"cause" : "This EIP has ACL rules.",
					"desc" : "This EIP has ACL rules.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167218" : {
					"cause" : "The private IP dose not exist.",
					"desc" : "The private IP dose not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167219" : {
					"cause" : "The elastic IP address is used by VPN.",
					"desc" : "The elastic IP address is used by VPN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167220" : {
					"cause" : "The IP address allocation mode of this network cannot be set to static injection.",
					"desc" : "The IP address allocation mode of this network cannot be set to static injection.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167222" : {
					"cause" : "The number of elastic IP exceeds the maximum.",
					"desc" : "The number of elastic IP exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167223" : {
					"cause" : "The elastic IP address is bound to the VLB of F5.",
					"desc" : "The elastic IP address is bound to the VLB of F5.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167224" : {
					"cause" : "The private IP address is bound to an elastic IP address.",
					"desc" : "The private IP address is bound to an elastic IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167226" : {
					"cause" : "The elastic IP address is bound to a private IP address.",
					"desc" : "The elastic IP address is bound to a private IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167228" : {
					"cause" : "DNAT is configured for the NIC.",
					"desc" : "DNAT is configured for the NIC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167229" : {
					"cause" : "DNAT is configured by the private IP address.",
					"desc" : "DNAT is configured by the private IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167230" : {
					"cause" : "The elastic IP address is bound to the SLB.",
					"desc" : "The elastic IP address is bound to the SLB.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167231" : {
					"cause" : "The IP bandwidth is updating.",
					"desc" : "The IP bandwidth is updating.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167300" : {
					"cause" : "Duplicate IP address pool name.",
					"desc" : "Duplicate IP address pool name.",
					"solution" : "Please enter a name again."
				},
				"1167301" : {
					"cause" : "Some public IP addresses have been added to other public IP address pools.",
					"desc" : "Some public IP addresses have been added to other public IP address pools.",
					"solution" : "Please change the public IP address segment."
				},
				"1167302" : {
					"cause" : "The public IP address pool does not exist.",
					"desc" : "The public IP address pool does not exist.",
					"solution" : "Refresh the public IP address pool list."
				},
				"1167303" : {
					"cause" : "The IP addresses in the IP address pool are not allowed to delete because they are allocated or being used.",
					"desc" : "The IP addresses in the IP address pool are not allowed to delete because they are allocated or being used.",
					"solution" : "Contact technical support."
				},
				"1167304" : {
					"cause" : "Some IP addresses do not exist in the IP address pool.",
					"desc" : "Some IP addresses do not exist in the IP address pool.",
					"solution" : "Contact technical support."
				},
				"1167305" : {
					"cause" : "Some IP addresses in the IP address pool are in use.",
					"desc" : "Some IP addresses in the IP address pool are in use.",
					"solution" : "Contact technical support."
				},
				"1167306" : {
					"cause" : "You can add a maximum of 32 IP address segments to a public IP address pool.",
					"desc" : "You can add a maximum of 32 IP address segments to a public IP address pool.",
					"solution" : "Contact technical support."
				},
				"1167307" : {
					"cause" : "You can add a maximum of 8 IP address pools to a resource zone.",
					"desc" : "You can add a maximum of 8 IP address pools to a resource zone.",
					"solution" : "Contact technical support."
				},
				"1167308" : {
					"cause" : "The IP address and the zone do not match.",
					"desc" : "The IP address and the zone do not match.",
					"solution" : "Contact the system administrator."
				},
				"1167309" : {
					"cause" : "The subnet of the public IP address segment conflicts with the external network subnet.",
					"desc" : "The subnet of the public IP address segment conflicts with the external network subnet.",
					"solution" : "Contact technical support."
				},
				"1167310" : {
					"cause" : "The public IP address has been released.",
					"desc" : "The public IP address has been released.",
					"solution" : "Contact technical support."
				},
				"1169002" : {
					"cause" : "This IP address is not added to the virtual firewall.",
					"desc" : "This IP address is not added to the virtual firewall.",
					"solution" : "Contact the system administrator."
				},
				"1169101" : {
					"cause" : "The IP bandwidth specification does not exist.",
					"desc" : "The IP bandwidth specification does not exist.",
					"solution" : "Please refresh the IP bandwidth specification list and try again."
				},
				"1169103" : {
					"cause" : "The number of IP bandwidth specification exceeds the upper limit.",
					"desc" : "The number of IP bandwidth specification exceeds the upper limit.",
					"solution" : ""
				},
				"1169105" : {
					"cause" : "Failed to configure IP bandwidth on the device.",
					"desc" : "Failed to configure IP bandwidth on the device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1170015" : {
					"cause" : "The network has used.",
					"desc" : "The network has used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1170019" : {
					"cause" : "The available start ip or end ip can not be null.",
					"desc" : "The available start ip or end ip can not be null.",
					"solution" : "Please input the subnet information again."
				},
				"1170020" : {
					"cause" : "The available end ip can not be less than start ip.",
					"desc" : "The available end ip can not be less than start ip.",
					"solution" : "Please input the subnet information again."
				},
				"1170021" : {
					"cause" : "The available ip is invalid.",
					"desc" : "The available ip is invalid.",
					"solution" : "Please input the subnet information again."
				},
				"1170022" : {
					"cause" : "The available ip ranges are conflict.",
					"desc" : "The available ip ranges are conflict.",
					"solution" : "Please input the subnet information again."
				},
				"1170023" : {
					"cause" : "The available ip is not in the subnet.",
					"desc" : "The available ip is not in the subnet.",
					"solution" : "Please input the subnet information again."
				},
				"1170027" : {
					"cause" : "The VSA management network overlaps with the vpc network.",
					"desc" : "The VSA management network overlaps with the vpc network.",
					"solution" : "Please input again."
				},
				"1180000" : {
					"cause" : "No available DHCP VSA in the VPC.",
					"desc" : "No available DHCP VSA in the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1180100" : {
					"cause" : "The DHCP server dose not exist.",
					"desc" : "The DHCP server dose not exist.",
					"solution" : "Contact technical support."
				},
				"1180101" : {
					"cause" : "Failed to create the VSA VM.",
					"desc" : "Failed to create the VSA VM.",
					"solution" : "Please contact your administrator or refer to the help manual."
				},
				"1180102" : {
					"cause" : "Failed to add the VSA external interface.",
					"desc" : "Failed to add the VSA external interface.",
					"solution" : "Contact your administrator or view the help manual."
				},
				"1180103" : {
					"cause" : "Failed to add the VSA.",
					"desc" : "Failed to add the VSA.",
					"solution" : "Contact technical support."
				},
				"1180104" : {
					"cause" : "vsa VM template is not exist.",
					"desc" : "vsa VM template is not exist.",
					"solution" : "Please contact your administrator or refer to the help manual."
				},
				"1180105" : {
					"cause" : "VPC has already applyed virtual firewall.",
					"desc" : "VPC has already applyed virtual firewall.",
					"solution" : "Contact technical support."
				},
				"1180107" : {
					"cause" : "The external network type is not normal subnet type.",
					"desc" : "The external network type is not normal subnet type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180108" : {
					"cause" : "The external network has no free Ip.",
					"desc" : "The external network has no free Ip.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180109" : {
					"cause" : "The external network and vpc does not belong same zone.",
					"desc" : "The external network and vpc does not belong same zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180110" : {
					"cause" : "IP assignment mode of external network is not static-manual.",
					"desc" : "IP assignment mode of external network is not static-manual.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180111" : {
					"cause" : "Firewall vsa status does not allow this opreate.",
					"desc" : "Firewall vsa status does not allow this opreate.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180112" : {
					"cause" : "Get firewall vsa vm ip failed.",
					"desc" : "Get firewall vsa vm ip failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180114" : {
					"cause" : "There is no available vsa manage network.",
					"desc" : "There is no available vsa manage network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180115" : {
					"cause" : "There is no available vtep network.",
					"desc" : "There is no available vtep network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180116" : {
					"cause" : "Firewall VSA is not in the VPC.",
					"desc" : "Firewall VSA is not in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180117" : {
					"cause" : "No firewall vsa exist.",
					"desc" : "No firewall vsa exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180118" : {
					"cause" : "Invalid externetwork.",
					"desc" : "Invalid externetwork.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180119" : {
					"cause" : "A DHCP server for external networks has already been created in the zone.",
					"desc" : "A DHCP server for external networks has already been created in the zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180121" : {
					"cause" : "Create VSA vm failed.",
					"desc" : "Create VSA vm failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180122" : {
					"cause" : "There are external networks whose IP address assignment mode is set to internal DHCP in the zone.",
					"desc" : "There are external networks whose IP address assignment mode is set to internal DHCP in the zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180126" : {
					"cause" : "DHCP server status does not allow this opreate.",
					"desc" : "DHCP server status does not allow this opreate.",
					"solution" : "Please refresh and try again."
				},
				"1180128" : {
					"cause" : "Failed to delete DHCP Subnet.",
					"desc" : "Failed to delete DHCP Subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180129" : {
					"cause" : "The hypervisor is not connected to the VSAM node.",
					"desc" : "The hypervisor is not connected to the VSAM node.",
					"solution" : "Connect the hypervisor to the VSAM node and try again."
				},
				"1181000" : {
					"cause" : "The VPC name already exists.",
					"desc" : "The VPC name already exists.",
					"solution" : ""
				},
				"1181001" : {
					"cause" : "The selected VDC does not available resource or network.",
					"desc" : "The selected VDC does not available resource or network.",
					"solution" : ""
				},
				"1181002" : {
					"cause" : "The VPC does not exist.",
					"desc" : "The VPC does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1181003" : {
					"cause" : "The upper limit is less than the number of internal networks in the VPC.",
					"desc" : "The upper limit is less than the number of internal networks in the VPC.",
					"solution" : ""
				},
				"1181004" : {
					"cause" : "The upper limit is less than the number of direct networks in the VPC.",
					"desc" : "The upper limit is less than the number of direct networks in the VPC.",
					"solution" : ""
				},
				"1181005" : {
					"cause" : "The upper limit is less than the number of routed networks in the VPC.",
					"desc" : "The upper limit is less than the number of routed networks in the VPC.",
					"solution" : ""
				},
				"1181006" : {
					"cause" : "The upper limit is less than the number of elastic IP addresses in the VPC.",
					"desc" : "The upper limit is less than the number of elastic IP addresses in the VPC.",
					"solution" : ""
				},
				"1181007" : {
					"cause" : "The network is an existing network in the VPC, and therefore cannot be deleted.",
					"desc" : "The network is an existing network in the VPC, and therefore cannot be deleted.",
					"solution" : ""
				},
				"1181008" : {
					"cause" : "The VPC cannot be deleted because it has been associated with a virtual firewall.",
					"desc" : "The VPC cannot be deleted because it has been associated with a virtual firewall.",
					"solution" : ""
				},
				"1181010" : {
					"cause" : "The VLAN does not exist in the specified VPC.",
					"desc" : "The VLAN does not exist in the specified VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1181011" : {
					"cause" : "The IP addresses reserved in the gateway and subnet are duplicated. The second, third and fourth IP addresses in the subnet are reserved by the system and cannot be used as gateway addresses.",
					"desc" : "The IP addresses reserved in the gateway and subnet are duplicated. The second, third and fourth IP addresses in the subnet are reserved by the system and cannot be used as gateway addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1181012" : {
					"cause" : "The VPC cannot be deleted because it has elastic IP.",
					"desc" : "The VPC cannot be deleted because it has elastic IP.",
					"solution" : ""
				},
				"1181013" : {
					"cause" : "The VPC contains security groups and cannot be deleted.",
					"desc" : "The VPC contains security groups and cannot be deleted.",
					"solution" : ""
				},
				"1181014" : {
					"cause" : "The number of VPCs in the zone exceeds the upper limit.",
					"desc" : "The number of VPCs in the zone exceeds the upper limit.",
					"solution" : ""
				},
				"1181015" : {
					"cause" : "The VPC is not steady, and then the operation is not permitted.",
					"desc" : "The VPC is not steady, and then the operation is not permitted.",
					"solution" : ""
				},
				"1181016" : {
					"cause" : "The VPC cannot be deleted because it has deployment service.",
					"desc" : "The VPC cannot be deleted because it has deployment service.",
					"solution" : "Please delete service and try again."
				},
				"1181017" : {
					"cause" : "The VPC cannot be deleted because it has router.",
					"desc" : "The VPC cannot be deleted because it has router.",
					"solution" : "Please delete router and try again."
				},
				"1182000" : {
					"cause" : "Only one VPN gateway can be created for one VPC.",
					"desc" : "Only one VPN gateway can be created for one VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1182001" : {
					"cause" : "The VPN gateway cannot be created for the VPC because the VPC does not apply for hardware-based virtual firewalls.",
					"desc" : "The VPN gateway cannot be created for the VPC because the VPC does not apply for hardware-based virtual firewalls.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1182002" : {
					"cause" : "The VPN gateway does not exist.",
					"desc" : "The VPN gateway does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1182003" : {
					"cause" : "The VPN gateway is already in use.",
					"desc" : "The VPN gateway is already in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1182004" : {
					"cause" : "The VPN gateway name already exists.",
					"desc" : "The VPN gateway name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1182005" : {
					"cause" : "The VPN gateway and the VPC do not match.",
					"desc" : "The VPN gateway and the VPC do not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1182006" : {
					"cause" : "The VPN gateway cannot be created for the VPC because the VPC does not have available elastic IP address.",
					"desc" : "The VPN gateway cannot be created for the VPC because the VPC does not have available elastic IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183000" : {
					"cause" : "The remote gateway address conflicts with another remote gateway address in the VPC.",
					"desc" : "The remote gateway address conflicts with another remote gateway address in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183001" : {
					"cause" : "The remote gateway address conflicts with the VPN gateway address.",
					"desc" : "The remote gateway address conflicts with the VPN gateway address.",
					"solution" : "Contact the system administrator."
				},
				"1183006" : {
					"cause" : "The remote gateway and the VPC do not match.",
					"desc" : "The remote gateway and the VPC do not match.",
					"solution" : "Contact the system administrator."
				},
				"1183007" : {
					"cause" : "The number of remote network has reached the upper limit allowed by the remote gateway.",
					"desc" : "The number of remote network has reached the upper limit allowed by the remote gateway.",
					"solution" : "Contact the system administrator."
				},
				"1183008" : {
					"cause" : "The number of remote gateways exceeds the upper limit permitted by the VPC.",
					"desc" : "The number of remote gateways exceeds the upper limit permitted by the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184001" : {
					"cause" : "The remote gateway conflicts with other VPC remote gateways.",
					"desc" : "The remote gateway conflicts with other VPC remote gateways.",
					"solution" : "Contact the system administrator."
				},
				"1184002" : {
					"cause" : "The local gateway is different from the VPC local gateway.",
					"desc" : "The local gateway is different from the VPC local gateway.",
					"solution" : "Contact the system administrator."
				},
				"1184004" : {
					"cause" : "The remote user subnet conflicts with the VPC remote user subnet.",
					"desc" : "The remote user subnet conflicts with the VPC remote user subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184005" : {
					"cause" : "The remote user subnet conflicts with the VPC subnet.",
					"desc" : "The remote user subnet conflicts with the VPC subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184006" : {
					"cause" : "The VPN connection name already exists.",
					"desc" : "The VPN connection name already exists.",
					"solution" : "Contact the system administrator."
				},
				"1184007" : {
					"cause" : "The VPN connection already exits.",
					"desc" : "The VPN connection already exits.",
					"solution" : "Contact the system administrator."
				},
				"1184008" : {
					"cause" : "The VPN connection does not exist.",
					"desc" : "The VPN connection does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1184009" : {
					"cause" : "The VPN connection is not compatible with the VPC.",
					"desc" : "The VPN connection is not compatible with the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184010" : {
					"cause" : "The VPN connection in its current state does not support this operation.",
					"desc" : "The VPN connection in its current state does not support this operation.",
					"solution" : "Contact the system administrator."
				},
				"1184011" : {
					"cause" : "The local subnet of the VPN connection does not exist.",
					"desc" : "The local subnet of the VPN connection does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1184021" : {
					"cause" : "The local gateway is not using an elastic IP address.",
					"desc" : "The local gateway is not using an elastic IP address.",
					"solution" : "Contact the system administrator."
				},
				"1184022" : {
					"cause" : "The local network is not compatible with the VPC.",
					"desc" : "The local network is not compatible with the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184023" : {
					"cause" : "The number of VPNs has reached the upper limit allowed by the VPC.",
					"desc" : "The number of VPNs has reached the upper limit allowed by the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184024" : {
					"cause" : "Remote subnet information is incorrect because of invalid IP address, incorrect subnet mask, or unmatched IP address and subnet mask.",
					"desc" : "Remote subnet information is incorrect because of invalid IP address, incorrect subnet mask, or unmatched IP address and subnet mask.",
					"solution" : "Contact the system administrator."
				},
				"1184025" : {
					"cause" : "Failed to create a VPN connection on the underlying layer.",
					"desc" : "Failed to create a VPN connection on the underlying layer.",
					"solution" : "Contact the system administrator."
				},
				"1184026" : {
					"cause" : "Failed to update a VPN connection on the underlying layer.",
					"desc" : "Failed to update a VPN connection on the underlying layer.",
					"solution" : "Contact the system administrator."
				},
				"1184027" : {
					"cause" : "Failed to delete a VPN connection from the underlying layer.",
					"desc" : "Failed to delete a VPN connection from the underlying layer.",
					"solution" : "Contact the system administrator."
				},
				"1184028" : {
					"cause" : "The VPN gateway and the VPC do not match.",
					"desc" : "The VPN gateway and the VPC do not match.",
					"solution" : "Contact the system administrator."
				},
				"1184029" : {
					"cause" : "Incorrect remote gateway subnet information for the L2TP client. The address is not an IP address, the subnet mask is incorrect, or IP address and the subnet mask do not match.",
					"desc" : "Incorrect remote gateway subnet information for the L2TP client. The address is not an IP address, the subnet mask is incorrect, or IP address and the subnet mask do not match.",
					"solution" : "Contact the system administrator."
				},
				"1184030" : {
					"cause" : "One VPC supports only one L2TP VPN connection, and an L2TP VPN connection already exists in the VPC.",
					"desc" : "One VPC supports only one L2TP VPN connection, and an L2TP VPN connection already exists in the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184031" : {
					"cause" : "The network conflicts with the remote network of the VPC.",
					"desc" : "The network conflicts with the remote network of the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184032" : {
					"cause" : "The network conflicts with the L2TP VPN subnet.",
					"desc" : "The network conflicts with the L2TP VPN subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184033" : {
					"cause" : "The subnet information of the L2TP VPN conflicts with that of another L2TP VPN subnet.",
					"desc" : "The subnet information of the L2TP VPN conflicts with that of another L2TP VPN subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184034" : {
					"cause" : "The remote user subnet conflicts with the L2TP VPN subnet.",
					"desc" : "The remote user subnet conflicts with the L2TP VPN subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184035" : {
					"cause" : "The L2TP VPN subnet conflicts with the remote user subnet.",
					"desc" : "The L2TP VPN subnet conflicts with the remote user subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184036" : {
					"cause" : "The L2TP VPN username already exists.",
					"desc" : "The L2TP VPN username already exists.",
					"solution" : "Contact the system administrator."
				},
				"1184039" : {
					"cause" : "The VPC does not have hardware-based virtual firewalls.",
					"desc" : "The VPC does not have hardware-based virtual firewalls.",
					"solution" : "Contact the system administrator."
				},
				"1184040" : {
					"cause" : "Current VPC does not create the VPN gateway, please create first.",
					"desc" : "Current VPC does not create the VPN gateway, please create first.",
					"solution" : "Contact the system administrator."
				},
				"1184041" : {
					"cause" : "Current VPC already exists IPSec VPN connections, not allowed to create other types of VPN connections.",
					"desc" : "Current VPC already exists IPSec VPN connections, not allowed to create other types of VPN connections.",
					"solution" : "Contact the system administrator."
				},
				"1184042" : {
					"cause" : "Current VPC already exists L2TP VPN connections, not allowed to create other types of VPN connections.",
					"desc" : "Current VPC already exists L2TP VPN connections, not allowed to create other types of VPN connections.",
					"solution" : "Contact the system administrator."
				},
				"1184043" : {
					"cause" : "Current VPC associates software firewall, and software firewall only supports Ipsec VPN connection, does not support other types.",
					"desc" : "Current VPC associates software firewall, and software firewall only supports Ipsec VPN connection, does not support other types.",
					"solution" : "Contact the system administrator."
				},
				"1184044" : {
					"cause" : "The number of L2TP-vpn users has reached the upper limit allowed by the VPC.",
					"desc" : "The number of L2TP-vpn users has reached the upper limit allowed by the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184045" : {
					"cause" : "Create L2TP-VPN users fails from bottom.",
					"desc" : "Create L2TP-VPN users fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184046" : {
					"cause" : "Update L2TP-VPN users fails from bottom.",
					"desc" : "Update L2TP-VPN users fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184047" : {
					"cause" : "Delete L2TP-VPN users fails from bottom.",
					"desc" : "Delete L2TP-VPN users fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184048" : {
					"cause" : "Create a VPN fails from bottom.",
					"desc" : "Create a VPN fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184049" : {
					"cause" : "Update a VPN fails from bottom.",
					"desc" : "Update a VPN fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184050" : {
					"cause" : "Failed to delete the VPN from the underlying layer.",
					"desc" : "Failed to delete the VPN from the underlying layer.",
					"solution" : "Contact the system administrator."
				},
				"1184051" : {
					"cause" : "The L2TP VPN connection user name is repeated with firewall SSH user names.",
					"desc" : "The L2TP VPN connection user name is repeated with firewall SSH user names.",
					"solution" : "Contact the system administrator."
				},
				"1184052" : {
					"cause" : "The L2TP VPN connection name is l2tp (case insensitive), the name is illegal.",
					"desc" : "The L2TP VPN connection name is l2tp (case insensitive), the name is illegal.",
					"solution" : "Contact the system administrator."
				},
				"1184055" : {
					"cause" : "The old password of L2TP VPN user is incorrect.",
					"desc" : "The old password of L2TP VPN user is incorrect.",
					"solution" : "Contact the system administrator."
				},
				"1190001" : {
					"cause" : "LoadBalance created failed.",
					"desc" : "LoadBalance created failed.",
					"solution" : "Contact technical support."
				},
				"1190002" : {
					"cause" : "Listener configured failed.",
					"desc" : "Listener configured failed.",
					"solution" : "Contact technical support."
				},
				"1190003" : {
					"cause" : "Session persistence configured failed.",
					"desc" : "Session persistence configured failed.",
					"solution" : "Contact technical support."
				},
				"1190004" : {
					"cause" : "Health check configured failed.",
					"desc" : "Health check configured failed.",
					"solution" : "Contact technical support."
				},
				"1190005" : {
					"cause" : "LoadBalance vm created or configured failed.",
					"desc" : "LoadBalance vm created or configured failed.",
					"solution" : "Contact technical support."
				},
				"1190006" : {
					"cause" : "LoadBalance vm getting IP address timeout.",
					"desc" : "LoadBalance vm getting IP address timeout.",
					"solution" : "Contact technical support."
				},
				"1190007" : {
					"cause" : "LoadBalance vm created failed.",
					"desc" : "LoadBalance vm created failed.",
					"solution" : "Contact technical support."
				},
				"1190008" : {
					"cause" : "LoadBalance vm associated with VSA failed.",
					"desc" : "LoadBalance vm associated with VSA failed.",
					"solution" : "Contact technical support."
				},
				"1190009" : {
					"cause" : "Creating internal network failed.",
					"desc" : "Creating internal network failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190010" : {
					"cause" : "Creating external network failed.",
					"desc" : "Creating external network failed.",
					"solution" : "Contact technical support."
				},
				"1190011" : {
					"cause" : "Creating route network failed.",
					"desc" : "Creating route network failed.",
					"solution" : "Contact technical support."
				},
				"1190012" : {
					"cause" : "Binding VM failed.",
					"desc" : "Binding VM failed.",
					"solution" : "Contact technical support."
				},
				"1190013" : {
					"cause" : "Binding VM not supported with current listener status.",
					"desc" : "Binding VM not supported with current listener status.",
					"solution" : "Contact technical support."
				},
				"1190014" : {
					"cause" : "Failed to obtain IP addresses during the creation of load balancer VMs.",
					"desc" : "Failed to obtain IP addresses during the creation of load balancer VMs.",
					"solution" : "Contact technical support."
				},
				"1190015" : {
					"cause" : "The count of VM associated with listener reaches maximum.",
					"desc" : "The count of VM associated with listener reaches maximum.",
					"solution" : "Contact technical support."
				},
				"1190016" : {
					"cause" : "Listener not exist.",
					"desc" : "Listener not exist.",
					"solution" : "Contact technical support."
				},
				"1190017" : {
					"cause" : "The listener and the load balancer do not match.",
					"desc" : "The listener and the load balancer do not match.",
					"solution" : "Contact technical support."
				},
				"1190018" : {
					"cause" : "This operation cannot be performed for the licenser being processed.",
					"desc" : "This operation cannot be performed for the licenser being processed.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190019" : {
					"cause" : "This operation cannot be performed for the load balancer in the current status.",
					"desc" : "This operation cannot be performed for the load balancer in the current status.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190020" : {
					"cause" : "The number of listeners exceeds the maximum. At maximum of 10 listeners can be created in one load balancer.",
					"desc" : "The number of listeners exceeds the maximum. At maximum of 10 listeners can be created in one load balancer.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190021" : {
					"cause" : "The load balancer does not exist.",
					"desc" : "The load balancer does not exist.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190022" : {
					"cause" : "Load balancer status conflict.",
					"desc" : "Load balancer status conflict.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190023" : {
					"cause" : "Listener status conflict.",
					"desc" : "Listener status conflict.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190024" : {
					"cause" : "Failed to delete load balancer information.",
					"desc" : "Failed to delete load balancer information.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190025" : {
					"cause" : "Failed to delete load balancing services.",
					"desc" : "Failed to delete load balancing services.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190026" : {
					"cause" : "VSA deletion failed.",
					"desc" : "VSA deletion failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190027" : {
					"cause" : "Certificate configuration not supported for listener status conflict.",
					"desc" : "Certificate configuration not supported for listener status conflict.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190028" : {
					"cause" : "Certificate does not exist.",
					"desc" : "Certificate does not exist.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190029" : {
					"cause" : "Certificate configured failed.",
					"desc" : "Certificate configured failed.",
					"solution" : "Contact technical support."
				},
				"1190030" : {
					"cause" : "Certificate configuration not supported for listener protocol other than HTTPS.",
					"desc" : "Certificate configuration not supported for listener protocol other than HTTPS.",
					"solution" : "Contact technical support."
				},
				"1190031" : {
					"cause" : "Failed to delete the load balancer VM.",
					"desc" : "Failed to delete the load balancer VM.",
					"solution" : "Contact technical support."
				},
				"1190032" : {
					"cause" : "Listener query operation not supported for current status.",
					"desc" : "Listener query operation not supported for current status.",
					"solution" : "Contact technical support."
				},
				"1190033" : {
					"cause" : "Session persistence policy not exist.",
					"desc" : "Session persistence policy not exist.",
					"solution" : "Contact technical support."
				},
				"1190034" : {
					"cause" : "Binding VM not supported with current listener status.",
					"desc" : "Binding VM not supported with current listener status.",
					"solution" : "Contact technical support."
				},
				"1190035" : {
					"cause" : "Modifying vm weight not supported for current listener status.",
					"desc" : "Modifying vm weight not supported for current listener status.",
					"solution" : "Contact technical support."
				},
				"1190036" : {
					"cause" : "Deassociating VM from listener not supported for current listener status.",
					"desc" : "Deassociating VM from listener not supported for current listener status.",
					"solution" : "Contact technical support."
				},
				"1190037" : {
					"cause" : "Algorithm not supported.",
					"desc" : "Algorithm not supported.",
					"solution" : "Contact technical support."
				},
				"1190038" : {
					"cause" : "No VM is associated with listener.",
					"desc" : "No VM is associated with listener.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190039" : {
					"cause" : "This operation cannot be performed because the load balancer has been assigned an elastic IP address.",
					"desc" : "This operation cannot be performed because the load balancer has been assigned an elastic IP address.",
					"solution" : "Contact technical support."
				},
				"1190040" : {
					"cause" : "The number of VMs bound to a load balancer cannot exceed 20.",
					"desc" : "The number of VMs bound to a load balancer cannot exceed 20.",
					"solution" : "Contact technical support."
				},
				"1190041" : {
					"cause" : "The total weight of concurrent connection counts of existing listeners and to-be-created listeners exceeds the maximum concurrent connection count of the load balancer.",
					"desc" : "The total weight of concurrent connection counts of existing listeners and to-be-created listeners exceeds the maximum concurrent connection count of the load balancer.",
					"solution" : "Contact technical support."
				},
				"1190042" : {
					"cause" : "The port backport of the to-be-created listener already exists.",
					"desc" : "The port backport of the to-be-created listener already exists.",
					"solution" : "Contact technical support."
				},
				"1190043" : {
					"cause" : "The number of associated VM listeners cannot exceed five.",
					"desc" : "The number of associated VM listeners cannot exceed five.",
					"solution" : "Contact technical support."
				},
				"1190044" : {
					"cause" : "No device available for creating load balancers.",
					"desc" : "No device available for creating load balancers.",
					"solution" : "Contact technical support."
				},
				"1190045" : {
					"cause" : "Failed to create the load balancer.",
					"desc" : "Failed to create the load balancer.",
					"solution" : "Contact technical support."
				},
				"1190047" : {
					"cause" : "The F5 device does not exist.",
					"desc" : "The F5 device does not exist.",
					"solution" : "Contact technical support."
				},
				"1190048" : {
					"cause" : "Failed to create the VLAN.",
					"desc" : "Failed to create the VLAN.",
					"solution" : "Contact technical support."
				},
				"1190049" : {
					"cause" : "Failed to delete the VLAN.",
					"desc" : "Failed to delete the VLAN.",
					"solution" : "Contact technical support."
				},
				"1190050" : {
					"cause" : "Failed to create the subnet.",
					"desc" : "Failed to create the subnet.",
					"solution" : "Contact technical support."
				},
				"1190051" : {
					"cause" : "Failed to delete the subnet.",
					"desc" : "Failed to delete the subnet.",
					"solution" : "Contact technical support."
				},
				"1190060" : {
					"cause" : "The load balancer does not match the listener.",
					"desc" : "The load balancer does not match the listener.",
					"solution" : "Contact technical support."
				},
				"1190061" : {
					"cause" : "A maximum of 100 VM IP addresses can be bound to the load balancer.",
					"desc" : "A maximum of 100 VM IP addresses can be bound to the load balancer.",
					"solution" : "Contact technical support."
				},
				"1190062" : {
					"cause" : "The weight of concurrent throughput of created listeners and to-be-created listeners exceeds the maximum amount allowed by the load balancer.",
					"desc" : "The weight of concurrent throughput of created listeners and to-be-created listeners exceeds the maximum amount allowed by the load balancer.",
					"solution" : "Contact technical support."
				},
				"1190063" : {
					"cause" : "An elastic IP address has already been bound to the load balancer.",
					"desc" : "An elastic IP address has already been bound to the load balancer.",
					"solution" : "Contact technical support."
				},
				"1190064" : {
					"cause" : "The elastic IP address is not bound to the load balancer.",
					"desc" : "The elastic IP address is not bound to the load balancer.",
					"solution" : "Contact technical support."
				},
				"1190065" : {
					"cause" : "Failed to modify the hardware load balancer.",
					"desc" : "Failed to modify the hardware load balancer.",
					"solution" : "Contact technical support."
				},
				"1190066" : {
					"cause" : "A load balancer must have at least one listener.",
					"desc" : "A load balancer must have at least one listener.",
					"solution" : "Contact technical support."
				},
				"1190067" : {
					"cause" : "Failed to unfreeze the hardware load balancer.",
					"desc" : "Failed to unfreeze the hardware load balancer.",
					"solution" : "Contact technical support."
				},
				"1190068" : {
					"cause" : "Elastic IP addresses cannot be bound to the load balancer if the external network is not a routed network.",
					"desc" : "Elastic IP addresses cannot be bound to the load balancer if the external network is not a routed network.",
					"solution" : "Contact technical support."
				},
				"1190069" : {
					"cause" : "SLB don't support repair.",
					"desc" : "SLB don't support repair.",
					"solution" : "Contact technical support."
				},
				"1190070" : {
					"cause" : "This operation cannot be performed because the SLB is being bound to elastic IP addresses.",
					"desc" : "This operation cannot be performed because the SLB is being bound to elastic IP addresses.",
					"solution" : "Contact technical support."
				},
				"1190071" : {
					"cause" : "Cannot create a load balancer when the network type is VLAN.",
					"desc" : "Cannot create a load balancer when the network type is VLAN.",
					"solution" : "Contact technical support."
				},
				"1190073" : {
					"cause" : "Front-End network of load balancer is Internal network, cannot bind elastic ip.",
					"desc" : "Front-End network of load balancer is Internal network, cannot bind elastic ip.",
					"solution" : "Contact technical support."
				},
				"1190101" : {
					"cause" : "Max connection count invalid.",
					"desc" : "Max connection count invalid.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190102" : {
					"cause" : "Max throughput invalid.",
					"desc" : "Max throughput invalid.",
					"solution" : "Contact technical support."
				},
				"1190103" : {
					"cause" : "Invalid load balancer name.",
					"desc" : "Invalid load balancer name.",
					"solution" : "Contact technical support."
				},
				"1190104" : {
					"cause" : "Adaptor type invalid.",
					"desc" : "Adaptor type invalid.",
					"solution" : "Please contact Huawei technical support."
				},
				"1190105" : {
					"cause" : "Listener port occupied.",
					"desc" : "Listener port occupied.",
					"solution" : "Contact technical support."
				},
				"1190106" : {
					"cause" : "The load balancer name already exists.",
					"desc" : "The load balancer name already exists.",
					"solution" : "Contact technical support."
				},
				"1190107" : {
					"cause" : "The database operation failed.",
					"desc" : "The database operation failed.",
					"solution" : "Contact technical support."
				},
				"1190108" : {
					"cause" : "Invalid load balancer ID.",
					"desc" : "Invalid load balancer ID.",
					"solution" : "Contact technical support."
				},
				"1190109" : {
					"cause" : "No listeners.",
					"desc" : "No listeners.",
					"solution" : "Contact technical support."
				},
				"1190110" : {
					"cause" : "The load balancer does not exist.",
					"desc" : "The load balancer does not exist.",
					"solution" : "Contact technical support."
				},
				"1190111" : {
					"cause" : "The load balancer status is abnormal.",
					"desc" : "The load balancer status is abnormal.",
					"solution" : "Contact technical support."
				},
				"1190112" : {
					"cause" : "No VMs.",
					"desc" : "No VMs.",
					"solution" : "Contact technical support."
				},
				"1190113" : {
					"cause" : "The listener does not exist.",
					"desc" : "The listener does not exist.",
					"solution" : "Contact technical support."
				},
				"1190114" : {
					"cause" : "The monitor and the load balancer do not match.",
					"desc" : "The monitor and the load balancer do not match.",
					"solution" : "Contact technical support."
				},
				"1190115" : {
					"cause" : "The session persistence type and the protocol used by the listener do not match .",
					"desc" : "The session persistence type and the protocol used by the listener do not match .",
					"solution" : "Contact technical support."
				},
				"1190116" : {
					"cause" : "No certificates.",
					"desc" : "No certificates.",
					"solution" : "Contact technical support."
				},
				"1190117" : {
					"cause" : "The certificate does not exist.",
					"desc" : "The certificate does not exist.",
					"solution" : "Contact technical support."
				},
				"1190118" : {
					"cause" : "VSA does not exist.",
					"desc" : "VSA does not exist.",
					"solution" : "Contact technical support."
				},
				"1190502" : {
					"cause" : "The device is unreachable.",
					"desc" : "The device is unreachable.",
					"solution" : "Ensure that the network is connected."
				},
				"1190503" : {
					"cause" : "The IP address already exists.",
					"desc" : "The IP address already exists.",
					"solution" : "Ensure that the device has not been added to the system."
				},
				"1200001" : {
					"cause" : "No proxy vm found in vpc.",
					"desc" : "No proxy vm found in vpc.",
					"solution" : "Please make sure whether proxy vm exists in vpc."
				},
				"1200008" : {
					"cause" : "Modify route failed.",
					"desc" : "Modify route failed.",
					"solution" : "Contact technical support."
				},
				"1200013" : {
					"cause" : "Proxy vm already exists.",
					"desc" : "Proxy vm already exists.",
					"solution" : "Please make sure whether proxy vm exists in vpc."
				},
				"1200014" : {
					"cause" : "Status conflicts and current operation is not permitted.",
					"desc" : "Status conflicts and current operation is not permitted.",
					"solution" : "Contact technical support."
				},
				"1200015" : {
					"cause" : "Proxy vm template not exist.",
					"desc" : "Proxy vm template not exist.",
					"solution" : "Please make sure the existence of proxy vm template."
				},
				"1200016" : {
					"cause" : "Failed to obtain an IP address for the deployment service VM.",
					"desc" : "Failed to obtain an IP address for the deployment service VM.",
					"solution" : "Contact technical support."
				},
				"1200017" : {
					"cause" : "Proxy vm is not running.",
					"desc" : "Proxy vm is not running.",
					"solution" : "Please check the proxy vm status."
				},
				"1200023" : {
					"cause" : "Proxy vm networks exceeds the upper limit.",
					"desc" : "Proxy vm networks exceeds the upper limit.",
					"solution" : "Contact the system administrator."
				},
				"1200024" : {
					"cause" : "Proxy vm route networks exceeds the upper limit.",
					"desc" : "Proxy vm route networks exceeds the upper limit.",
					"solution" : "Contact the system administrator."
				},
				"1200025" : {
					"cause" : "Proxy vm networks repeat.",
					"desc" : "Proxy vm networks repeat.",
					"solution" : "Please remove the repeated networks."
				},
				"1211001" : {
					"cause" : "The multicast IP address pool does not exist.",
					"desc" : "The multicast IP address pool does not exist.",
					"solution" : "Please check and try again."
				},
				"1211002" : {
					"cause" : "The multicast IP address pool has been allocated.",
					"desc" : "The multicast IP address pool has been allocated.",
					"solution" : "Please check and try again."
				},
				"1211003" : {
					"cause" : "No multicast IP address pool is available.",
					"desc" : "No multicast IP address pool is available.",
					"solution" : "Please check and try again."
				},
				"1211004" : {
					"cause" : "The multicast IP address has been reclaimed.",
					"desc" : "The multicast IP address has been reclaimed.",
					"solution" : "Please check and try again."
				},
				"1211006" : {
					"cause" : "The multicast IP address pools overlap.",
					"desc" : "The multicast IP address pools overlap.",
					"solution" : "Please check and try again."
				},
				"1211007" : {
					"cause" : "The multicast IP address pool exceed the max num.",
					"desc" : "The multicast IP address pool exceed the max num.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1220001" : {
					"cause" : "The current state of the router operation not allowed.",
					"desc" : "The current state of the router operation not allowed.",
					"solution" : "Please contact the system administrator."
				},
				"1220002" : {
					"cause" : "No access converging exchanger",
					"desc" : "No access converging exchanger",
					"solution" : "Please contact the system administrator, access the aggregation switch"
				},
				"1220003" : {
					"cause" : "The specified VPC and AZ have created router",
					"desc" : "The specified VPC and AZ have created router",
					"solution" : ""
				},
				"1220004" : {
					"cause" : "VPC routed networks exist, can not remove the router",
					"desc" : "VPC routed networks exist, can not remove the router",
					"solution" : "Please delete the routed network, and then delete router"
				},
				"1220006" : {
					"cause" : "The current network mode dose not support hardware router.",
					"desc" : "The current network mode dose not support hardware router.",
					"solution" : ""
				},
				"1220007" : {
					"cause" : "The router dose not belong to the VPC.",
					"desc" : "The router dose not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1221001" : {
					"cause" : "VRF dose not exist",
					"desc" : "VRF dose not exist",
					"solution" : "Please contact the system administrator."
				},
				"1290000" : {
					"cause" : "Have not modified the management network, without the need for FM management network recovery operation.",
					"desc" : "Have not modified the management network, without the need for FM management network recovery operation.",
					"solution" : "Have not modified the management network, without the need for FM management network recovery operation."
				},
				"1290002" : {
					"cause" : "VSAM does not exist.",
					"desc" : "VSAM does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290006" : {
					"cause" : "Recover VSAM data failed,please try again.",
					"desc" : "Recover VSAM data failed,please try again.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290007" : {
					"cause" : "VSAM is auditing.",
					"desc" : "VSAM is auditing.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290011" : {
					"cause" : "u6dfbu52a0u6216u8005u5220u9664u9759u6001ip-macu7ed1u5b9auff0cmacu91cdu590du3002",
					"desc" : "u6dfbu52a0u6216u8005u5220u9664u9759u6001ip-macu7ed1u5b9auff0cmacu91cdu590du3002",
					"solution" : "u8bf7u8054u7cfbu6280u672fu652fu6301u5de5u7a0bu5e08u3002"
				},
				"1290012" : {
					"cause" : "The VSA vm does not exist.",
					"desc" : "The VSA vm does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290013" : {
					"cause" : "VSA DHCP service is not on.",
					"desc" : "VSA DHCP service is not on.",
					"solution" : "Please contact your administrator."
				},
				"1290035" : {
					"cause" : "Dhcp server is busy, please try later.",
					"desc" : "Dhcp server is busy, please try later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290044" : {
					"cause" : "DHCP relay service is abnormal.",
					"desc" : "DHCP relay service is abnormal.",
					"solution" : "Please try later."
				},
				"1290045" : {
					"cause" : "Different Interface IpRange Conflict.",
					"desc" : "Different Interface IpRange Conflict.",
					"solution" : "Please change the subnet and try again."
				},
				"1290063" : {
					"cause" : "The time on the system service VM and its management node is inconsistent.Contact the system administrator to modify time settings and ensure that the VM time is consistent with the management node time.",
					"desc" : "The time on the system service VM and its management node is inconsistent.Contact the system administrator to modify time settings and ensure that the VM time is consistent with the management node time.",
					"solution" : "The time on the system service VM and its management node is inconsistent.Contact the system administrator to modify time settings and ensure that the VM time is consistent with the management node time."
				},
				"1310002" : {
					"cause" : "The number of rules in the security group exceeds the limit.",
					"desc" : "The number of rules in the security group exceeds the limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310003" : {
					"cause" : "The security group rule does not exist.",
					"desc" : "The security group rule does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310021" : {
					"cause" : "The NIC does not belong to current VM.",
					"desc" : "The NIC does not belong to current VM.",
					"solution" : "Contact technical support."
				},
				"1310022" : {
					"cause" : "The VM status must be running or stopped or hibernated or pause.",
					"desc" : "The VM status must be running or stopped or hibernated or pause.",
					"solution" : "Contact technical support."
				},
				"1310023" : {
					"cause" : "The NIC does not belong to the VPC where the security group is located.",
					"desc" : "The NIC does not belong to the VPC where the security group is located.",
					"solution" : "Contact technical support."
				},
				"1310024" : {
					"cause" : "NICs of this network type cannot be added to a security group.",
					"desc" : "NICs of this network type cannot be added to a security group.",
					"solution" : "Contact technical support."
				},
				"1310025" : {
					"cause" : "The member to be added has already been added to a security group and cannot be added to another security group.",
					"desc" : "The member to be added has already been added to a security group and cannot be added to another security group.",
					"solution" : "Contact technical support."
				},
				"1310026" : {
					"cause" : "There is same member to add.",
					"desc" : "There is same member to add.",
					"solution" : "Contact technical support."
				},
				"1310027" : {
					"cause" : "The member to be deleted from the security group does not exist.",
					"desc" : "The member to be deleted from the security group does not exist.",
					"solution" : "Contact technical support."
				},
				"1310028" : {
					"cause" : "The default security group has no rules.",
					"desc" : "The default security group has no rules.",
					"solution" : "Contact technical support."
				},
				"1310029" : {
					"cause" : "The NIC does not belong to FusionCompute and therefore cannot be added to a security group.",
					"desc" : "The NIC does not belong to FusionCompute and therefore cannot be added to a security group.",
					"solution" : "Contact technical support."
				},
				"1310030" : {
					"cause" : "The operation cannot be performed because the security group is being audited.",
					"desc" : "The operation cannot be performed because the security group is being audited.",
					"solution" : "Contact technical support."
				},
				"1310031" : {
					"cause" : "The member is being added to a security group.",
					"desc" : "The member is being added to a security group.",
					"solution" : "Contact technical support."
				},
				"1310032" : {
					"cause" : "The member is being deleted from a security group.",
					"desc" : "The member is being deleted from a security group.",
					"solution" : "Contact technical support."
				},
				"1310033" : {
					"cause" : "The number of members in the security group exceeds the limit.",
					"desc" : "The number of members in the security group exceeds the limit.",
					"solution" : "Contact technical support."
				},
				"1310034" : {
					"cause" : "NICs of this type cannot be added to a security group.",
					"desc" : "NICs of this type cannot be added to a security group.",
					"solution" : "Contact technical support."
				},
				"1310050" : {
					"cause" : "The current VPC contains multiple security groups of the same name.",
					"desc" : "The current VPC contains multiple security groups of the same name.",
					"solution" : "Contact technical support."
				},
				"1310051" : {
					"cause" : "The number of security groups in the current VPC exceeds the limit.",
					"desc" : "The number of security groups in the current VPC exceeds the limit.",
					"solution" : "Contact technical support."
				},
				"1310052" : {
					"cause" : "The security group does not exist.",
					"desc" : "The security group does not exist.",
					"solution" : "Contact technical support."
				},
				"1310053" : {
					"cause" : "The security group is authorized to communicate with other security groups.",
					"desc" : "The security group is authorized to communicate with other security groups.",
					"solution" : "Contact technical support."
				},
				"1310054" : {
					"cause" : "The security group has members.",
					"desc" : "The security group has members.",
					"solution" : "Contact technical support."
				},
				"1310055" : {
					"cause" : "The querying limit exceeds.",
					"desc" : "The querying limit exceeds.",
					"solution" : "Contact technical support."
				},
				"1310056" : {
					"cause" : "The subnet or ip range of rule is invalid.",
					"desc" : "The subnet or ip range of rule is invalid.",
					"solution" : "Contact technical support."
				},
				"1310057" : {
					"cause" : "The port of rule is invalid.",
					"desc" : "The port of rule is invalid.",
					"solution" : "Contact technical support."
				},
				"1310058" : {
					"cause" : "The rule already exists.",
					"desc" : "The rule already exists.",
					"solution" : "Contact technical support."
				},
				"1310059" : {
					"cause" : "The authorized security group does not exist.",
					"desc" : "The authorized security group does not exist.",
					"solution" : "Contact technical support."
				},
				"1310063" : {
					"cause" : "The security group rule is being created.",
					"desc" : "The security group rule is being created.",
					"solution" : "Contact technical support."
				},
				"1310064" : {
					"cause" : "The security group rule is being deleted.",
					"desc" : "The security group rule is being deleted.",
					"solution" : "Contact technical support."
				},
				"1310065" : {
					"cause" : "The VPC does not contain FusionCompute resources.",
					"desc" : "The VPC does not contain FusionCompute resources.",
					"solution" : "Contact technical support."
				},
				"1310066" : {
					"cause" : "The security group name is invalid.",
					"desc" : "The security group name is invalid.",
					"solution" : "Contact technical support."
				},
				"1310067" : {
					"cause" : "Delete operation failed,Please quit security groups first.",
					"desc" : "Delete operation failed,Please quit security groups first.",
					"solution" : "Please quit security groups first."
				},
				"1310074" : {
					"cause" : "The security group dose not belong to the VPC.",
					"desc" : "The security group dose not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1310075": {
					"cause":"Virtual machine is in shared VPC or not in VDC, does not support floating IP address.",
					"desc":"Virtual machines is in shared VPC or not in VDC, does not support floating IP address.",
					"solution":"Virtual machines is in shared VPC or not in VDC, does not support floating IP address."
				},
				"1310076" : {
					"cause" : "The nic can only config a float IP.",
					"desc" : "The nic can only config a float IP.",
					"solution" : "Contact technical support."
				},
				"1310077" : {
					"cause" : "Only a float IP can be deleted.",
					"desc" : "Only a float IP can be deleted.",
					"solution" : "Contact technical support."
				},
				"1310079" : {
					"cause" : "Floating IP address does not exist.",
					"desc" : "Floating IP address does not exist",
					"solution" : "Contact technical support."
				},
				"1310081" : {
					"cause" : "The NIC is being configured an floating IP address.",
					"desc" : "The NIC is being configured an floating IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410021" : {
					"cause" : "Attach block storage failed, for the vpc of the vm is not equals to the vpc of the block storage.",
					"desc" : "Attach block storage failed, for the vpc of the vm is not equals to the vpc of the block storage.",
					"solution" : "Please check the storage and the vm."
				},
				"1502006" : {
					"cause" : "Incomplete VTEP information.",
					"desc" : "Incomplete VTEP information.",
					"solution" : "Please enter complete VTEP information."
				},
				"1502007" : {
					"cause" : "Incorrect VTEP IP address.",
					"desc" : "Incorrect VTEP IP address.",
					"solution" : "Please enter correct VTEP IP address."
				},
				"1502008" : {
					"cause" : "The value of VTEP mask must range from 1 to 32.",
					"desc" : "The value of VTEP mask must range from 1 to 32.",
					"solution" : "Please enter correct VTEP mask."
				},
				"1502009" : {
					"cause" : "Incorrect VTEP gateway address.",
					"desc" : "Incorrect VTEP gateway address.",
					"solution" : "Please enter correct VTEP gateway address."
				},
				"1502010" : {
					"cause" : "The VTEP VLAN ID must range from 0 to 4094.",
					"desc" : "The VTEP VLAN ID must range from 0 to 4094.",
					"solution" : "Please enter correct VTEP VLAN ID."
				},
				"1600010" : {
					"cause" : "There is no cluster in the available zone.",
					"desc" : "There is no cluster in the available zone.",
					"solution" : "Contact technical support."
				},
				"4000002" : {
					"cause" : "This function is not supported.",
					"desc" : "This function is not supported.",
					"solution" : "This function is not supported."
				},
				"4000004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4000010" : {
					"cause" : "The parameter does not conform to specifications.",
					"desc" : "The parameter does not conform to specifications.",
					"solution" : "Enter the parameter based on the parameter input specifications."
				},
				"4000011" : {
					"cause" : "The external system communication is abnormal. For example\\, the returned message is empty\\, or the field is incorrect.",
					"desc" : "The external system communication is abnormal. For example\\, the returned message is empty\\, or the field is incorrect.",
					"solution" : "Contact the administrator or see the online help."
				},
				"4000018" : {
					"cause" : "The system resources are insufficient.",
					"desc" : "The system resources are insufficient.",
					"solution" : "Contact technical support."
				},
				"4001003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator."
				},
				"4001005" : {
					"cause" : "Virtualization service authentication failed.",
					"desc" : "Virtualization service authentication failed.",
					"solution" : "Contact the administrator."
				},
				"4001006" : {
					"cause" : "Virtualization service authentication failed.",
					"desc" : "Virtualization service authentication failed.",
					"solution" : "Contact the administrator."
				},
				"4001008" : {
					"cause" : "The VM template data is corrupted or does not exit.",
					"desc" : "The VM template data is corrupted or does not exit.",
					"solution" : "Delete the VM template"
				},
				"4001010" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator."
				},
				"4002000" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the system administrator."
				},
				"4002005" : {
					"cause" : "The VM template does not exist.",
					"desc" : "The VM template does not exist.",
					"solution" : "Contact technical support."
				},
				"4002007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator."
				},
				"4002015" : {
					"cause" : "The entered parameter is incorrect.",
					"desc" : "The entered parameter is incorrect.",
					"solution" : "Enter the parameter based on the name input specifications."
				},
				"4002019" : {
					"cause" : "The entered parameter is incorrect.",
					"desc" : "The entered parameter is incorrect.",
					"solution" : "Enter the parameter based on the description input specifications."
				},
				"4002071" : {
					"cause" : "You cannot create a VM when the server is being maintained.",
					"desc" : "You cannot create a VM when the server is being maintained.",
					"solution" : "Contact the administrator."
				},
				"4002082" : {
					"cause" : "The vCPU reservation is incorrect.",
					"desc" : "The vCPU reservation is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002083" : {
					"cause" : "The vCPU quota is incorrect.",
					"desc" : "The vCPU quota is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002084" : {
					"cause" : "The vCPU restriction is incorrect.",
					"desc" : "The vCPU restriction is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002085" : {
					"cause" : "The number of VM memories is incorrect.",
					"desc" : "The number of VM memories is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002086" : {
					"cause" : "The VM memory quota is incorrect.",
					"desc" : "The VM memory quota is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002087" : {
					"cause" : "The hard disk ID is incorrect.",
					"desc" : "The hard disk ID is incorrect.",
					"solution" : "Contact the administrator."
				},
				"4002088" : {
					"cause" : "The VM hard disk size is incorrect.",
					"desc" : "The VM hard disk size is incorrect.",
					"solution" : "Refer to the online help."
				},
				"4002089" : {
					"cause" : "The number of hard disks on the VM exceeds the maximum.",
					"desc" : "The number of hard disks on the VM exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4002091" : {
					"cause" : "The VM NIC network is empty.",
					"desc" : "The VM NIC network is empty.",
					"solution" : "Contact the administrator."
				},
				"4002092" : {
					"cause" : "The number of VM NICs exceeds the maximum.",
					"desc" : "The number of VM NICs exceeds the maximum.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002093" : {
					"cause" : "The VM start configuration is invalid.",
					"desc" : "The VM start configuration is invalid.",
					"solution" : "Contact the administrator."
				},
				"4002094" : {
					"cause" : "The VM fault processing policy does not conform to specifications.",
					"desc" : "The VM fault processing policy does not conform to specifications.",
					"solution" : "Contact the administrator."
				},
				"4002096" : {
					"cause" : "The VM Tools is not started.",
					"desc" : "The VM Tools is not started.",
					"solution" : "Contact the administrator."
				},
				"4002097" : {
					"cause" : "The specified node does not exist.",
					"desc" : "The specified node does not exist.",
					"solution" : "Contact the administrator."
				},
				"4002098" : {
					"cause" : "The server does not exist.",
					"desc" : "The server does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4002099" : {
					"cause" : "The specified logical resource cluster does not exist.",
					"desc" : "The specified logical resource cluster does not exist.",
					"solution" : "Refresh the page to check whether the resource cluster exists or contact the administrator."
				},
				"4002104" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator."
				},
				"4002105" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Attach an ISO file to the VM."
				},
				"4002106" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Refer to the online help or enter the URL in the \\\\\\\\192.168.1.1\\\\***\\\\***.iso format."
				},
				"4002110" : {
					"cause" : "The VM memory restriction is incorrect.",
					"desc" : "The VM memory restriction is incorrect.",
					"solution" : "Parameter error."
				},
				"4002111" : {
					"cause" : "The OS type is incorrect.",
					"desc" : "The OS type is incorrect.",
					"solution" : "Select from the drop-down list."
				},
				"4002112" : {
					"cause" : "The OS version is incorrect.",
					"desc" : "The OS version is incorrect.",
					"solution" : "Select from the drop-down list."
				},
				"4002113" : {
					"cause" : "The vCPU reservation value is incorrect.",
					"desc" : "The vCPU reservation value is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications. ."
				},
				"4002114" : {
					"cause" : "The VM memory reservation value is incorrect.",
					"desc" : "The VM memory reservation value is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002115" : {
					"cause" : "The MAC IP address already exists.",
					"desc" : "The MAC IP address already exists.",
					"solution" : "Contact the administrator."
				},
				"4002117" : {
					"cause" : "The MAC resources are insufficient.",
					"desc" : "The MAC resources are insufficient.",
					"solution" : "Contact the administrator."
				},
				"4002121" : {
					"cause" : "The MAC address is incorrect.",
					"desc" : "The MAC address is incorrect.",
					"solution" : "Contact the administrator."
				},
				"4002123" : {
					"cause" : "The cluster or host cannot be empty.",
					"desc" : "The cluster or host cannot be empty.",
					"solution" : "Contact technical support."
				},
				"4002124" : {
					"cause" : "The data storage indicator must be selected.",
					"desc" : "The data storage indicator must be selected.",
					"solution" : "Select the data storage indicator."
				},
				"4002125" : {
					"cause" : "The OS type cannot be empty.",
					"desc" : "The OS type cannot be empty.",
					"solution" : "Select the OS type."
				},
				"4002127" : {
					"cause" : "The hard disk slot ID cannot be duplicate.",
					"desc" : "The hard disk slot ID cannot be duplicate.",
					"solution" : "Contact the system administrator."
				},
				"4002133" : {
					"cause" : "The destination node or cluster cannot meet the storage requirements for running the VM.",
					"desc" : "The destination node or cluster cannot meet the storage requirements for running the VM.",
					"solution" : "Contact the administrator."
				},
				"4002134" : {
					"cause" : "The target node or cluster does not have networks that meet the requirements for running VMs.",
					"desc" : "The target node or cluster does not have networks that meet the requirements for running VMs.",
					"solution" : "Contact the system administrator."
				},
				"4002136" : {
					"cause" : "An existing disk cannot be attached to the VM because the disk is not shared and has been attached to a VM\\, the disk is shared but has been attached to four VMs\\, or the disk is in a state that does not allow attachment.",
					"desc" : "An existing disk cannot be attached to the VM because the disk is not shared and has been attached to a VM\\, the disk is shared but has been attached to four VMs\\, or the disk is in a state that does not allow attachment.",
					"solution" : "Contact the administrator."
				},
				"4002137" : {
					"cause" : "You can attach a maximum of four shared disks to a VM.",
					"desc" : "You can attach a maximum of four shared disks to a VM.",
					"solution" : "Contact technical support."
				},
				"4002138" : {
					"cause" : "A shared disk has been attached to the specified VM.",
					"desc" : "A shared disk has been attached to the specified VM.",
					"solution" : "Contact the administrator."
				},
				"4002140" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4002146" : {
					"cause" : "A node that meets the storage requirements for starting the VM does not exist in the specified cluster or host.",
					"desc" : "A node that meets the storage requirements for starting the VM does not exist in the specified cluster or host.",
					"solution" : "Contact technical support."
				},
				"4002147" : {
					"cause" : "A node that meets the network requirements for starting the VM does not exist in the specified cluster or host.",
					"desc" : "A node that meets the network requirements for starting the VM does not exist in the specified cluster or host.",
					"solution" : "Contact technical support."
				},
				"4002158" : {
					"cause" : "Data storage resources are insufficient.",
					"desc" : "Data storage resources are insufficient.",
					"solution" : "Contact the administrator."
				},
				"4002159" : {
					"cause" : "The data storage does not exist.",
					"desc" : "The data storage does not exist.",
					"solution" : "Contact the administrator."
				},
				"4002173" : {
					"cause" : "Invalid disk size.",
					"desc" : "Invalid disk size.",
					"solution" : "Contact the administrator."
				},
				"4002206" : {
					"cause" : "The distributed switch does not exist.",
					"desc" : "The distributed switch does not exist.",
					"solution" : "Contact the administrator."
				},
				"4002227" : {
					"cause" : "The VM NIC network does not exist.",
					"desc" : "The VM NIC network does not exist.",
					"solution" : "Contact the administrator."
				},
				"4002275" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4002286" : {
					"cause" : "The VM template is being created.",
					"desc" : "The VM template is being created.",
					"solution" : "Contact technical support."
				},
				"4002288" : {
					"cause" : "The VM is in stopped or hibernation state.",
					"desc" : "The VM is in stopped or hibernation state.",
					"solution" : "Contact technical support."
				},
				"4002289" : {
					"cause" : "The VM is entering hibernation.",
					"desc" : "The VM is entering hibernation.",
					"solution" : "Contact technical support."
				},
				"4002295" : {
					"cause" : "Attachment failed\\, because an ISO file has been attached to the server where the current VM is located.",
					"desc" : "Attachment failed\\, because an ISO file has been attached to the server where the current VM is located.",
					"solution" : "Contact the administrator."
				},
				"4002312" : {
					"cause" : "VM snapshots exist.",
					"desc" : "VM snapshots exist.",
					"solution" : "Delete the VM snapshots and try again."
				},
				"4002320" : {
					"cause" : "The available IP addresses in the subnet are insufficient.",
					"desc" : "The available IP addresses in the subnet are insufficient.",
					"solution" : "Contact the administrator."
				},
				"4002345" : {
					"cause" : "Failed to create disks because a network exception occurred, the SAN device is faulty, or the available storage space in the data store is insufficient.",
					"desc" : "Failed to create disks because a network exception occurred, the SAN device is faulty, or the available storage space in the data store is insufficient.",
					"solution" : ""
				},
				"4002346" : {
					"cause" : "Failed to associate the network.",
					"desc" : "Failed to associate the network.",
					"solution" : "Contact the administrator."
				},
				"4002347" : {
					"cause" : "Failed to bind the disk.",
					"desc" : "Failed to bind the disk.",
					"solution" : "Contact the administrator."
				},
				"4002348" : {
					"cause" : "The virtualization service process is abnormal.",
					"desc" : "The virtualization service process is abnormal.",
					"solution" : "Contact the administrator."
				},
				"4002349" : {
					"cause" : "The VM is stopped abnormally.",
					"desc" : "The VM is stopped abnormally.",
					"solution" : "Contact technical support."
				},
				"4002350" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4002351" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4002352" : {
					"cause" : "Cannot connect to the host where the shared file is stored.",
					"desc" : "Cannot connect to the host where the shared file is stored.",
					"solution" : "Verify that the host is properly communicating with the server, and the firewall is disabled."
				},
				"4002353" : {
					"cause" : "The shared file is inaccessible.",
					"desc" : "The shared file is inaccessible.",
					"solution" : "Ensure that the username and password are correct, the file is shared, and the firewall is disabled."
				},
				"4002354" : {
					"cause" : "The shared file does not exist.",
					"desc" : "The shared file does not exist.",
					"solution" : "Ensure that the file exists in the shared directory."
				},
				"4002355" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Contact the administrator."
				},
				"4002357" : {
					"cause" : "Duplicate NIC name.",
					"desc" : "Duplicate NIC name.",
					"solution" : ""
				},
				"4002358" : {
					"cause" : "This operation is not allowed because the VM template is being used to create VMs.",
					"desc" : "This operation is not allowed because the VM template is being used to create VMs.",
					"solution" : "Please try later."
				},
				"4002359" : {
					"cause" : "The NICs of a VM must belong to networks on the same switch.",
					"desc" : "The NICs of a VM must belong to networks on the same switch.",
					"solution" : "Contact the administrator."
				},
				"4002366" : {
					"cause" : "The VM template information cannot be found.",
					"desc" : "The VM template information cannot be found.",
					"solution" : "Contact technical support."
				},
				"4002371" : {
					"cause" : "The CPU resources are insufficient.",
					"desc" : "The CPU resources are insufficient.",
					"solution" : "Contact the administrator."
				},
				"4002372" : {
					"cause" : "Insufficient memory.",
					"desc" : "Insufficient memory.",
					"solution" : "Contact the administrator."
				},
				"4002373" : {
					"cause" : "The number of created NICs on the host exceeds the upper limit.",
					"desc" : "The number of created NICs on the host exceeds the upper limit.",
					"solution" : "Contact the administrator."
				},
				"4002374" : {
					"cause" : "All the hosts in the selected cluster are abnormal.",
					"desc" : "All the hosts in the selected cluster are abnormal.",
					"solution" : "Contact the administrator."
				},
				"4002375" : {
					"cause" : "All the hosts in the selected cluster are in maintenance mode.",
					"desc" : "All the hosts in the selected cluster are in maintenance mode.",
					"solution" : "Contact the administrator."
				},
				"4002376" : {
					"cause" : "All the hosts in the selected cluster are unavailable.",
					"desc" : "All the hosts in the selected cluster are unavailable.",
					"solution" : "Contact the administrator."
				},
				"4002377" : {
					"cause" : "No available host.",
					"desc" : "No available host.",
					"solution" : "Contact the administrator."
				},
				"4002379" : {
					"cause" : "Only one NIC on the VM can be assigned with a gateway.",
					"desc" : "Only one NIC on the VM can be assigned with a gateway.",
					"solution" : "Contact the administrator."
				},
				"4002415" : {
					"cause" : "The VM is busy. Please try later.",
					"desc" : "The VM is busy. Please try later.",
					"solution" : "Please try later."
				},
				"4005000" : {
					"cause" : "The name already exists.",
					"desc" : "The name already exists.",
					"solution" : "Please enter another name."
				},
				"4040015" : {
					"cause" : "Disconnected from the hypervisor.",
					"desc" : "Disconnected from the hypervisor.",
					"solution" : "Contact technical support."
				},
				"4040024" : {
					"cause" : "The resource cluster does not exist.",
					"desc" : "The resource cluster does not exist.",
					"solution" : "Please select another resource cluster."
				},
				"4040140" : {
					"cause" : "Cannot get max CPU from cluster.",
					"desc" : "Cannot get max CPU from cluster.",
					"solution" : "Please confirm max CPU from cluster."
				},
				"4040143" : {
					"cause" : "VM CPU exceed host in cluster.",
					"desc" : "VM CPU exceed host in cluster.",
					"solution" : "Please confirm VM CPU valid."
				},
				"4040145" : {
					"cause" : "The number of required CPUs exceeds the number of CPUs installed in the host.",
					"desc" : "The number of required CPUs exceeds the number of CPUs installed in the host.",
					"solution" : "Contact technical support."
				},
				"4070007" : {
					"cause" : "The VM is not created by using the VM template.",
					"desc" : "The VM is not created by using the VM template.",
					"solution" : "Contact the administrator."
				},
				"4070008" : {
					"cause" : "The number of VM disks has reached the upper limit.",
					"desc" : "The number of VM disks has reached the upper limit.",
					"solution" : "Contact technical support."
				},
				"4070021" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070022" : {
					"cause" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored.",
					"desc" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored.",
					"solution" : "Check the VM state\\, and restore the VM again."
				},
				"4070033" : {
					"cause" : "The VM or template is in use by an unfinished task. Try again after the task is complete.",
					"desc" : "The VM or template is in use by an unfinished task. Try again after the task is complete.",
					"solution" : "Try again after the task is complete."
				},
				"4070042" : {
					"cause" : "This operation is not allowed because the VM is not in the running state.",
					"desc" : "This operation is not allowed because the VM is not in the running state.",
					"solution" : "Ensure that the VM status supports this operation."
				},
				"4070045" : {
					"cause" : "Discovering VM templates...",
					"desc" : "Discovering VM templates...",
					"solution" : "Contact technical support."
				},
				"4070052" : {
					"cause" : "CPU resources in the cluster are insufficient.",
					"desc" : "CPU resources in the cluster are insufficient.",
					"solution" : ""
				},
				"4070053" : {
					"cause" : "Memory resources in the cluster are insufficient",
					"desc" : "Memory resources in the cluster are insufficient",
					"solution" : ""
				},
				"4070054" : {
					"cause" : "Shared storage resources in the cluster are insufficient. Shared storage resources are provided by non-Local and non-Local-Pome storage devices.",
					"desc" : "Shared storage resources in the cluster are insufficient. Shared storage resources are provided by non-Local and non-Local-Pome storage devices.",
					"solution" : ""
				},
				"4070083" : {
					"cause" : "The vm is not allowed to delete when it's not stopped.",
					"desc" : "The vm is not allowed to delete when it's not stopped.",
					"solution" : "Please shutdown the vm before deleting."
				},
				"4070097" : {
					"cause" : "The storage device of this type supports only thin-provisioned disks.",
					"desc" : "The storage device of this type supports only thin-provisioned disks.",
					"solution" : "Enable thin provisioning for the disk."
				},
				"4070121" : {
					"cause" : "The guest operating system is not supported.",
					"desc" : "The guest operating system is not supported.",
					"solution" : "Please select other operating system."
				},
				"4070133" : {
					"cause" : "Parameter error in attaching a CD/DVD-ROM.",
					"desc" : "Parameter error in attaching a CD/DVD-ROM.",
					"solution" : "Contact the system administrator."
				},
				"4070134" : {
					"cause" : "This VM has locked the DVD drive tray, so the DVD cannot be ejected.",
					"desc" : "This VM has locked the DVD drive tray, so the DVD cannot be ejected.",
					"solution" : "Please reboot the VM."
				},
				"4070135" : {
					"cause" : "Operation could not be performed because the drive is empty.",
					"desc" : "Operation could not be performed because the drive is empty.",
					"solution" : "Please make sure the drive is not empty."
				},
				"4070136" : {
					"cause" : "The path is incorrect or the installation file is not stored in this path.",
					"desc" : "The path is incorrect or the installation file is not stored in this path.",
					"solution" : "Ensure that the path is correct and the installation file is stored in this path."
				},
				"4070211" : {
					"cause" : "The cluster does not contain a data store that supports disks in thick-provision-lazy-zeroed mode.",
					"desc" : "The cluster does not contain a data store that supports disks in thick-provision-lazy-zeroed mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070225" : {
					"cause" : "The storage device of this type does not support thick provision lazy zeroed disks.",
					"desc" : "The storage device of this type does not support thick provision lazy zeroed disks.",
					"solution" : "Please choose another storage."
				},
				"4070514" : {
					"cause" : "The cluster does not contain a data store that supports disks in thin-provisioning mode.",
					"desc" : "The cluster does not contain a data store that supports disks in thin-provisioning mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070529" : {
					"cause" : "The VM OS does not support CPU installation without stopping the VM.",
					"desc" : "The VM OS does not support CPU installation without stopping the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070530" : {
					"cause" : "The VM does not support CPU hot swapping.",
					"desc" : "The VM does not support CPU hot swapping.",
					"solution" : "Contact technical support."
				},
				"4070531" : {
					"cause" : "The CPU hot swapping function attribute is modified incorrectly.",
					"desc" : "The CPU hot swapping function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070532" : {
					"cause" : "The VM OS does not support memory installation without stopping the VM.",
					"desc" : "The VM OS does not support memory installation without stopping the VM.",
					"solution" : "Contact technical support."
				},
				"4070533" : {
					"cause" : "The memory hot swapping function attribute is modified incorrectly.",
					"desc" : "The memory hot swapping function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4075006" : {
					"cause" : "Virtual machine State conflict\\, does not allow this operation.",
					"desc" : "Virtual machine State conflict\\, does not allow this operation.",
					"solution" : "Please refresh the virtual machine state."
				},
				"4075015" : {
					"cause" : "The VMware Tools is not installed on the VM or the installed VMware Tools is not running properly.",
					"desc" : "The VMware Tools is not installed on the VM or the installed VMware Tools is not running properly.",
					"solution" : "Please contact the system administrator."
				},
				"4075035" : {
					"cause" : "The storage device of this type supports disks that are not thin provisioned.",
					"desc" : "The storage device of this type supports disks that are not thin provisioned.",
					"solution" : "Enable thick provisioning for the disk."
				},
				"4075048" : {
					"cause" : "Failed to set the boot device to network for the VM.",
					"desc" : "Failed to set the boot device to network for the VM.",
					"solution" : "Select a proper boot device."
				},
				"4075049" : {
					"cause" : "Failed to set the boot device to hard disk for the VM.",
					"desc" : "Failed to set the boot device to hard disk for the VM.",
					"solution" : "Select a proper boot device"
				},
				"4100001" : {
					"cause" : "A mandatory parameter is not specified.",
					"desc" : "A mandatory parameter is not specified.",
					"solution" : "Ensure that all mandatory parameters are specified."
				},
				"4100002" : {
					"cause" : "The template name invalid\\, it can contain only letters\\, digits\\, spaces\\, and the following special characters:. _ - ( ) [ ] #.",
					"desc" : "The template name invalid\\, it can contain only letters\\, digits\\, spaces\\, and the following special characters:. _ - ( ) [ ] #.",
					"solution" : "The template name can contain only letters, digits, spaces, and the following special characters:. _ - ( ) [ ] #."
				},
				"4140016" : {
					"cause" : "System inner communication exception.",
					"desc" : "System inner communication exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4140048" : {
					"cause" : "The hypervisor does not contain an associated cluster.",
					"desc" : "The hypervisor does not contain an associated cluster.",
					"solution" : "Please associated cluster first."
				},
				"4410011" : {
					"cause" : "the \"SAN-SATA\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-SATA\" type of data storage resources insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4410012" : {
					"cause" : "the \"SAN-Any\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-Any\" type of data storage resources insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4410013" : {
					"cause" : "the \"SAN-SSD\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-SSD\" type of data storage resources insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4410014" : {
					"cause" : "the \"SAN-SAS&FC\" type of data storage resources insufficient.",
					"desc" : "the \"SAN-SAS&FC\" type of data storage resources insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4410015" : {
					"cause" : "Under the cluster storage resources are insufficient or can not be found to meet the virtual machine to start the normal storage.",
					"desc" : "Under the cluster storage resources are insufficient or can not be found to meet the virtual machine to start the normal storage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4410018" : {
					"cause" : "The specified storage resources are insufficient or cannot meet the requirements for starting the VM.",
					"desc" : "The specified storage resources are insufficient or cannot meet the requirements for starting the VM.",
					"solution" : "Please try again."
				},
				"4800000" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4800001" : {
					"cause" : "Parameter error.",
					"desc" : "Parameter error.",
					"solution" : "Please input the correct parameter."
				},
				"4800002" : {
					"cause" : "This function is not supported.",
					"desc" : "This function is not supported.",
					"solution" : "Contact the administrator."
				},
				"4800003" : {
					"cause" : "1. The network is disconnected. 2. The space of cloud management server disk is insufficient. 3. Others.",
					"desc" : "1. The network is disconnected. 2. The space of cloud management server disk is insufficient. 3. Others.",
					"solution" : "1. Check the network configuration and try again. 2. Release disk space and try again. 3. Contact technical support."
				},
				"4800004" : {
					"cause" : "Failed to obtain rights information about the user.",
					"desc" : "Failed to obtain rights information about the user.",
					"solution" : "Contact technical support."
				},
				"4800005" : {
					"cause" : "The correspondence between the cluster template errors.",
					"desc" : "The correspondence between the cluster template errors.",
					"solution" : ""
				},
				"4800006" : {
					"cause" : "the application template is unpublished.",
					"desc" : "the application template is unpublished.",
					"solution" : "Select a published application template to export."
				},
				"4800007" : {
					"cause" : "Unmatched software packages exist in the imported application template.",
					"desc" : "Unmatched software packages exist in the imported application template.",
					"solution" : "Create a matched software package and try to import the application template again."
				},
				"4800008" : {
					"cause" : "Insufficient hard disk space.",
					"desc" : "Insufficient hard disk space.",
					"solution" : "Contact the administrator."
				},
				"4800009" : {
					"cause" : "The catalog has been deleted.",
					"desc" : "The catalog has been deleted.",
					"solution" : "Refresh the page\\, and select another catalog."
				},
				"4800010" : {
					"cause" : "The software package is duplicate.",
					"desc" : "The software package is duplicate.",
					"solution" : "Select another software package. If the software package resource is insufficient\\, upload a matched software package."
				},
				"4800011" : {
					"cause" : "No matched VM template exists.",
					"desc" : "No matched VM template exists.",
					"solution" : "Contact the administrator."
				},
				"4800012" : {
					"cause" : "No matched VM template exists.",
					"desc" : "No matched VM template exists.",
					"solution" : "Please create the matched VM template."
				},
				"4800013" : {
					"cause" : "No mathced software package exists.",
					"desc" : "No mathced software package exists.",
					"solution" : "Please upload the matched software package."
				},
				"4800014" : {
					"cause" : "The file size exceeds 100M.",
					"desc" : "The file size exceeds 100M.",
					"solution" : "Ensure that the file size doesn't exceed 100M."
				},
				"4800015" : {
					"cause" : "invalid file name extension\\,the valid extension is 'tar.gz'.",
					"desc" : "invalid file name extension\\,the valid extension is 'tar.gz'.",
					"solution" : "Ensure that the valid extension is 'tar.gz'."
				},
				"4810001" : {
					"cause" : "No privilege.",
					"desc" : "No privilege.",
					"solution" : "Contact the administrator to apply for the rights."
				},
				"4810002" : {
					"cause" : "The user does not exist.",
					"desc" : "The user does not exist.",
					"solution" : "Contact the administrator to confirm user information."
				},
				"4810003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4810005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4810006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4810007" : {
					"cause" : "User has no privilege in the organization.",
					"desc" : "User has no privilege in the organization.",
					"solution" : "Contact the administrator to apply for the rights."
				},
				"4820002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator to check the application status."
				},
				"4820005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator."
				},
				"4820007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820008" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820009" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820010" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820011" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820012" : {
					"cause" : "The application name already exists.",
					"desc" : "The application name already exists.",
					"solution" : "Enter another application name."
				},
				"4820013" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator to check the application resource status."
				},
				"4820014" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820015" : {
					"cause" : "The application does not exist.",
					"desc" : "The application does not exist.",
					"solution" : "Refresh the page."
				},
				"4820016" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820017" : {
					"cause" : "The number of stopped applications reaches the maximum.",
					"desc" : "The number of stopped applications reaches the maximum.",
					"solution" : "Please try later or contact the administrator."
				},
				"4820018" : {
					"cause" : "The application is not allowed to start when it is in the current state.",
					"desc" : "The application is not allowed to start when it is in the current state.",
					"solution" : "Refresh the page and try again later."
				},
				"4820019" : {
					"cause" : "The application in the current state cannot be suspended.",
					"desc" : "The application in the current state cannot be suspended.",
					"solution" : "Refresh the page."
				},
				"4820020" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the administrator to check the application status."
				},
				"4820021" : {
					"cause" : "The number of started applications reached the maximum value.",
					"desc" : "The number of started applications reached the maximum value.",
					"solution" : "Try again later."
				},
				"4820023" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820024" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820026" : {
					"cause" : "Failed to obtain the VM information.",
					"desc" : "Failed to obtain the VM information.",
					"solution" : "Contact the administrator."
				},
				"4820028" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4820029" : {
					"cause" : "Failed to specify the current user as an administrator.",
					"desc" : "Failed to specify the current user as an administrator.",
					"solution" : "Contact technical support."
				},
				"4820030" : {
					"cause" : "One or more of the selected administrator accounts have been canceled.",
					"desc" : "One or more of the selected administrator accounts have been canceled.",
					"solution" : "The system has refreshed the administrator information. Please confirm the selected administrators and continue."
				},
				"4820032" : {
					"cause" : "The application name already exists.",
					"desc" : "The application name already exists.",
					"solution" : "Enter another application name."
				},
				"4820033" : {
					"cause" : "The policy does not exist.",
					"desc" : "The policy does not exist.",
					"solution" : "Ensure that the current policy exists."
				},
				"4820034" : {
					"cause" : "The scaling group does not exist.",
					"desc" : "The scaling group does not exist.",
					"solution" : "Ensure that whether the current scaling group exists."
				},
				"4820035" : {
					"cause" : "The number of added scaling policies has reached the maximum value 10 in the scaling group.",
					"desc" : "The number of added scaling policies has reached the maximum value 10 in the scaling group.",
					"solution" : "Please delete policies in the scaling group and try later."
				},
				"4820036" : {
					"cause" : "This operation cannot be performed because the application is being scaled up or down.",
					"desc" : "This operation cannot be performed because the application is being scaled up or down.",
					"solution" : "Please try later."
				},
				"4820037" : {
					"cause" : "This operation cannot be performed because the policy status in group is block.",
					"desc" : "This operation cannot be performed because the policy status in group is block.",
					"solution" : "Please try later."
				},
				"4820039" : {
					"cause" : "Register task failed.",
					"desc" : "Register task failed.",
					"solution" : ""
				},
				"4820040" : {
					"cause" : "Some of the selected VMs do not exist. Add VMs again.",
					"desc" : "Some of the selected VMs do not exist. Add VMs again.",
					"solution" : "Contact technical support."
				},
				"4820050" : {
					"cause" : "VM is operating VLB, please try later.",
					"desc" : "VM is operating VLB, please try later.",
					"solution" : "VM is operating VLB, please try later."
				},
				"4820051" : {
					"cause" : "ScalingGroup is operating VLB, please try later.",
					"desc" : "ScalingGroup is operating VLB, please try later.",
					"solution" : "ScalingGroup is operating VLB, please try later."
				},
				"4821001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4821002" : {
					"cause" : "Failed to delete the service catalog.",
					"desc" : "Failed to delete the service catalog.",
					"solution" : "Contact technical support."
				},
				"4821003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4821004" : {
					"cause" : "The service catalog name already exists.",
					"desc" : "The service catalog name already exists.",
					"solution" : "Enter another service catalog name."
				},
				"4821005" : {
					"cause" : "The service catalog does not exist.",
					"desc" : "The service catalog does not exist.",
					"solution" : "Refresh the page."
				},
				"4821006" : {
					"cause" : "You cannot delete the service catalog\\, because templates exist in the service catalog.",
					"desc" : "You cannot delete the service catalog\\, because templates exist in the service catalog.",
					"solution" : "Delete all templates in the service catalog and try to delete the service catalog. Perform this operation with caution."
				},
				"4821008" : {
					"cause" : "The number of added service catalogs reaches the maximum (500).",
					"desc" : "The number of added service catalogs reaches the maximum (500).",
					"solution" : "Delete unnecessary directories and try to add the service catalog again."
				},
				"4821010" : {
					"cause" : "The service catalog name already exists.",
					"desc" : "The service catalog name already exists.",
					"solution" : "Rename the service catalog."
				},
				"4822001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822007" : {
					"cause" : "The service catalog does not exist.",
					"desc" : "The service catalog does not exist.",
					"solution" : "Refresh the page."
				},
				"4822008" : {
					"cause" : "The application template name already exists.",
					"desc" : "The application template name already exists.",
					"solution" : "Enter another application template name."
				},
				"4822009" : {
					"cause" : "The number of added application templates reaches the maximum (10000) on the system.",
					"desc" : "The number of added application templates reaches the maximum (10000) on the system.",
					"solution" : "Delete unnecessary application templates and try again to create the template. Perform this operation with caution."
				},
				"4822010" : {
					"cause" : "The application template does not exist.",
					"desc" : "The application template does not exist.",
					"solution" : "Refresh the page."
				},
				"4822011" : {
					"cause" : "You cannot delete a application template that is being published.",
					"desc" : "You cannot delete a application template that is being published.",
					"solution" : "Refresh the page."
				},
				"4822012" : {
					"cause" : "The application template content is invalid.",
					"desc" : "The application template content is invalid.",
					"solution" : "Modify the application template content."
				},
				"4822013" : {
					"cause" : "The application template has been published.",
					"desc" : "The application template has been published.",
					"solution" : "Refresh the page."
				},
				"4822014" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822015" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822016" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822017" : {
					"cause" : "The application template export timed out.",
					"desc" : "The application template export timed out.",
					"solution" : "Contact technical support."
				},
				"4822018" : {
					"cause" : "Failed to export the application template.",
					"desc" : "Failed to export the application template.",
					"solution" : "Contact technical support."
				},
				"4822019" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822020" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822021" : {
					"cause" : "You cannot export an unpublished application template.",
					"desc" : "You cannot export an unpublished application template.",
					"solution" : "Refresh the page."
				},
				"4822023" : {
					"cause" : "Application template format verification failed.",
					"desc" : "Application template format verification failed.",
					"solution" : "Contact technical support."
				},
				"4822024" : {
					"cause" : "The resource does not exist.",
					"desc" : "The resource does not exist.",
					"solution" : "Contact the administrator."
				},
				"4822025" : {
					"cause" : "The data format is incorrect.",
					"desc" : "The data format is incorrect.",
					"solution" : "Contact technical support."
				},
				"4822026" : {
					"cause" : "The resource property does not exist.",
					"desc" : "The resource property does not exist.",
					"solution" : "Contact technical support."
				},
				"4822027" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822028" : {
					"cause" : "The resource has not been registered.",
					"desc" : "The resource has not been registered.",
					"solution" : "Contact technical support."
				},
				"4822029" : {
					"cause" : "The application template does not exist.",
					"desc" : "The application template does not exist.",
					"solution" : "Refresh the page."
				},
				"4822030" : {
					"cause" : "You cannot replicate an unpublished application template.",
					"desc" : "You cannot replicate an unpublished application template.",
					"solution" : "Refresh the page."
				},
				"4822031" : {
					"cause" : "The application template file does not exist.",
					"desc" : "The application template file does not exist.",
					"solution" : "Contact technical support."
				},
				"4822032" : {
					"cause" : "The application template file does not conform to the definition.",
					"desc" : "The application template file does not conform to the definition.",
					"solution" : "Contact technical support."
				},
				"4822033" : {
					"cause" : "The number of added application templates reaches the maximum (500).",
					"desc" : "The number of added application templates reaches the maximum (500).",
					"solution" : "Delete unnecessary templates and try to create an application template again. Perform this operation with caution."
				},
				"4822034" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4822035" : {
					"cause" : "The number of imported tasks reaches the maximum(10).",
					"desc" : "The number of imported tasks reaches the maximum(10).",
					"solution" : "Please try later."
				},
				"4822036" : {
					"cause" : "The number of exported tasks reaches the maximum(10).",
					"desc" : "The number of exported tasks reaches the maximum(10).",
					"solution" : "Please try later."
				},
				"4822037" : {
					"cause" : "Users can cancel publication of the templates created by themselves only.",
					"desc" : "Users can cancel publication of the templates created by themselves only.",
					"solution" : "Contact the administrator."
				},
				"4822038" : {
					"cause" : "The system is busy.",
					"desc" : "The system is busy.",
					"solution" : "Please try later."
				},
				"4822039" : {
					"cause" : "User is modifying the application template.",
					"desc" : "User  is modifying the application template.",
					"solution" : "Please try later."
				},
				"4822040" : {
					"cause" : "Incorrect application template format.",
					"desc" : "Incorrect application template format.",
					"solution" : "Contact technical support."
				},
				"4822041" : {
					"cause" : "The attachment file of the software package to be associated to the application template does not exist.",
					"desc" : "The attachment file of the software package to be associated to the application template does not exist.",
					"solution" : "Contact the administrator."
				},
				"4822042" : {
					"cause" : "The application template has not been published.",
					"desc" : "The application template has not been published.",
					"solution" : "Refresh the page and select a published application template."
				},
				"4822043" : {
					"cause" : "Applications to be created are associated to the application template.",
					"desc" : "Applications to be created are associated to the application template.",
					"solution" : "Please try later."
				},
				"4822044" : {
					"cause" : "An error occurred when you attempted to obtain the attachment file from the import template package.",
					"desc" : "An error occurred when you attempted to obtain the attachment file from the import template package.",
					"solution" : "Contact technical support."
				},
				"4822045" : {
					"cause" : "An error occurred when you attempted to decompress the import template package.",
					"desc" : "An error occurred when you attempted to decompress the import template package.",
					"solution" : "Contact technical support."
				},
				"4822046" : {
					"cause" : "An error occurred when you attempted to register the attachment file of the import template package.",
					"desc" : "An error occurred when you attempted to register the attachment file of the import template package.",
					"solution" : "Contact technical support."
				},
				"4822047" : {
					"cause" : "Failed to convert the import template package.",
					"desc" : "Failed to convert the import template package.",
					"solution" : "Contact technical support."
				},
				"4822048" : {
					"cause" : "The exported application template package or software package does not exist.",
					"desc" : "The exported application template package or software package does not exist.",
					"solution" : "Please export the application template and try again."
				},
				"4822049" : {
					"cause" : "No matched software package exists.",
					"desc" : "No matched software package exists.",
					"solution" : "Check whether a matched software package exists."
				},
				"4822050" : {
					"cause" : "No matched VM template exists.",
					"desc" : "No matched VM template exists.",
					"solution" : "Check whether the registration of a matched VM template has been canceled or the template has been deleted."
				},
				"4822051" : {
					"cause" : "No Hypervisor exists.",
					"desc" : "No Hypervisor exists.",
					"solution" : "Please contact the administrator."
				},
				"4822052" : {
					"cause" : "The organization does not exist.",
					"desc" : "The organization does not exist.",
					"solution" : "Please select a new organization."
				},
				"4822053" : {
					"cause" : "The Hypervisor does not exist.",
					"desc" : "The Hypervisor does not exist.",
					"solution" : "Please select a new Hypervisor."
				},
				"4822054" : {
					"cause" : "The VM cannot be created because the user does not belong to any organization.",
					"desc" : "The VM cannot be created because the user does not belong to any organization.",
					"solution" : "Add the user to an organization and try again."
				},
				"4822055" : {
					"cause" : "No VDC exists.",
					"desc" : "No VDC exists.",
					"solution" : "Contact Huawei technical support."
				},
				"4822056" : {
					"cause" : "The number of added application templates reaches the maximum (100) in the range of organization.",
					"desc" : "The number of added application templates reaches the maximum (100) in the range of organization.",
					"solution" : "Delete unnecessary application templates and try to add the template again. Perform this operation with caution."
				},
				"4822057" : {
					"cause" : "The number of application templates visible to the system reaches the upper limit (100).",
					"desc" : "The number of application templates visible to the system reaches the upper limit (100).",
					"solution" : "Delete unnecessary application templates and try to add the template again. Perform this operation with caution."
				},
				"4823001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823008" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823010" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823011" : {
					"cause" : "The VM template does not exist.",
					"desc" : "The VM template does not exist.",
					"solution" : "Refresh the page and try again."
				},
				"4823012" : {
					"cause" : "A failed VM cannot be converted to a template.",
					"desc" : "A failed VM cannot be converted to a template.",
					"solution" : "Delete the VM template and create a VM template again."
				},
				"4823013" : {
					"cause" : "Cannot publish a template that is completed or fails to be modified.",
					"desc" : "Cannot publish a template that is completed or fails to be modified.",
					"solution" : "Complete the VM template creation or modification."
				},
				"4823014" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823015" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Perform this operation after associating or disassociating the host."
				},
				"4823016" : {
					"cause" : "The shared file path cannot be left blank.",
					"desc" : "The shared file path cannot be left blank.",
					"solution" : "Enter the shared file path."
				},
				"4823017" : {
					"cause" : "Cannot delete a published VM template.",
					"desc" : "Cannot delete a published VM template.",
					"solution" : "Cancel the VM template publishing and exercise caution when performing this operation. ."
				},
				"4823018" : {
					"cause" : "This operation is not allowed when the VM template has been created successfully.",
					"desc" : "This operation is not allowed when the VM template has been created successfully.",
					"solution" : "Contact the administrator."
				},
				"4823019" : {
					"cause" : "Failed to start the VM.",
					"desc" : "Failed to start the VM.",
					"solution" : "Contact technical support."
				},
				"4823020" : {
					"cause" : "You can modify only created VM templates.",
					"desc" : "You can modify only created VM templates.",
					"solution" : "Refresh the page."
				},
				"4823021" : {
					"cause" : "An error occurred in converting a template to a VM.",
					"desc" : "An error occurred in converting a template to a VM.",
					"solution" : "Please try later or contact the administrator."
				},
				"4823022" : {
					"cause" : "The VM template is locked by user.",
					"desc" : "The VM template is locked by user.",
					"solution" : "Contact the user to unlock the VM template."
				},
				"4823023" : {
					"cause" : "The user domain does not match the domain where resources reside.",
					"desc" : "The user domain does not match the domain where resources reside.",
					"solution" : "Contact the administrator."
				},
				"4823024" : {
					"cause" : "Failed to create a VM template because no available resource cluster exists.",
					"desc" : "Failed to create a VM template because no available resource cluster exists.",
					"solution" : "Contact the administrator to add a resource cluster."
				},
				"4823025" : {
					"cause" : "The VM template has already been published.",
					"desc" : "The VM template has already been published.",
					"solution" : "Refresh the page and try again."
				},
				"4823026" : {
					"cause" : "The VM template publishing has been canceled.",
					"desc" : "The VM template publishing has been canceled.",
					"solution" : "Refresh the page and try again."
				},
				"4823027" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4823028" : {
					"cause" : "You cannot cancel the publishing of the VM template because it is being used by an application template.",
					"desc" : "You cannot cancel the publishing of the VM template because it is being used by an application template.",
					"solution" : "Delete the application template and try again."
				},
				"4823029" : {
					"cause" : "You cannot attach the ISO file when the VM template creation fails.",
					"desc" : "You cannot attach the ISO file when the VM template creation fails.",
					"solution" : "Delete the VM template and create a new one."
				},
				"4823030" : {
					"cause" : "You cannot attach the ISO file when the VM template creation is completed.",
					"desc" : "You cannot attach the ISO file when the VM template creation is completed.",
					"solution" : "Modify the VM template."
				},
				"4823031" : {
					"cause" : "You cannot attach the ISO file when the VM template is published.",
					"desc" : "You cannot attach the ISO file when the VM template is published.",
					"solution" : "Unpublish the VM template and modify it."
				},
				"4823033" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Ensure that the password is correct\\, the network is running properly\\, the firewall is disabled\\, the shared file path is correct\\, and the file is shared."
				},
				"4823034" : {
					"cause" : "The driver is detaching the ISO file.",
					"desc" : "The driver is detaching the ISO file.",
					"solution" : "Please try later."
				},
				"4823035" : {
					"cause" : "The number of the published VM templates reaches the maximum value (100).",
					"desc" : "The number of the published VM templates reaches the maximum value (100).",
					"solution" : "Delete unnecessary VM templates."
				},
				"4823036" : {
					"cause" : "The VM in the current state cannot support the VNC login.",
					"desc" : "The VM in the current state cannot support the VNC login.",
					"solution" : "Try again or start the VM."
				},
				"4823037" : {
					"cause" : "The VM template name already exists.",
					"desc" : "The VM template name already exists.",
					"solution" : "Enter another VM template name."
				},
				"4823038" : {
					"cause" : "The software can be installed only on the VM templates that have been creating.",
					"desc" : "The software can be installed only on the VM templates that have been creating.",
					"solution" : "Refresh the page."
				},
				"4823039" : {
					"cause" : "The VM template is being used to create applications.",
					"desc" : "The VM template is being used to create applications.",
					"solution" : "Please try later."
				},
				"4823040" : {
					"cause" : "Failed to perform the operation because the VM is in hibernation state.",
					"desc" : "Failed to perform the operation because the VM is in hibernation state.",
					"solution" : "Please start the VM and try again."
				},
				"4823041" : {
					"cause" : "Failed to detach ISO.",
					"desc" : "Failed to detach ISO.",
					"solution" : "Please try later or contact technical support."
				},
				"4823042" : {
					"cause" : "Desktop templates used for creating desktop do not need to be published.",
					"desc" : "Desktop templates used for creating desktop do not need to be published.",
					"solution" : "Contact the administrator."
				},
				"4823043" : {
					"cause" : "Only the stopped VM can be published.",
					"desc" : "Only the stopped VM can be published.",
					"solution" : "Please try later or contact technical support."
				},
				"4823044" : {
					"cause" : "Only the VM Template can be published.",
					"desc" : "Only the VM Template can be published.",
					"solution" : "Please try later or contact technical support."
				},
				"4823045" : {
					"cause" : "VMs with attached CD drivers already exist on the host.",
					"desc" : "VMs with attached CD drivers already exist on the host.",
					"solution" : "Please try later or contact technical support."
				},
				"4823046" : {
					"cause" : "VMs with attached CD drivers already exist on the host.",
					"desc" : "VMs with attached CD drivers already exist on the host.",
					"solution" : "Please try later or contact technical support."
				},
				"4823047" : {
					"cause" : "You cannot modify a VM that is in wrong status.",
					"desc" : "You cannot modify a VM that is in wrong status.",
					"solution" : "Review the VM template status."
				},
				"4823048" : {
					"cause" : "Failed to shut down the VM.",
					"desc" : "Failed to shut down the VM.",
					"solution" : "Check whether the VM Tools is running."
				},
				"4823049" : {
					"cause" : "Failed to delete the NFS template.",
					"desc" : "Failed to delete the NFS template.",
					"solution" : "Review the VM template status."
				},
				"4823051" : {
					"cause" : "Failed to transfer VMs.",
					"desc" : "Failed to transfer VMs.",
					"solution" : "Please try later."
				},
				"4823052" : {
					"cause" : "Failed to attach the ISO file.",
					"desc" : "Failed to attach the ISO file.",
					"solution" : "Ensure that the password is correct, the network is normal, the firewall is disabled, the shared file path is correct, and the file is shared."
				},
				"4823058" : {
					"cause" : "This operation is not allowed because of the VM template status conflict.",
					"desc" : "This operation is not allowed because of the VM template status conflict.",
					"solution" : "Perform this operation after the VM template is in a normal state."
				},
				"4823059" : {
					"cause" : "Invalid VM template description.",
					"desc" : "Invalid VM template description.",
					"solution" : "Modify the description and try later."
				},
				"4823060" : {
					"cause" : "The update mode of the VM template is invalid.",
					"desc" : "The update mode of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823061" : {
					"cause" : "The block device live migration policy of the VM template is invalid.",
					"desc" : "The block device live migration policy of the VM template is invalid.",
					"solution" : "Please modify the policy and try again."
				},
				"4823062" : {
					"cause" : "The icon of the VM template is invalid.",
					"desc" : "The icon of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823063" : {
					"cause" : "The CPU of the VM template is invalid.",
					"desc" : "The CPU of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823064" : {
					"cause" : "The memory of the VM template is invalid.",
					"desc" : "The memory of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823065" : {
					"cause" : "The disk parameter of the VM template is invalid.",
					"desc" : "The disk parameter of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823066" : {
					"cause" : "The NIC of the VM template is invalid.",
					"desc" : "The NIC of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823067" : {
					"cause" : "The OS of the VM template is invalid.",
					"desc" : "The OS of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4823068" : {
					"cause" : "The name of the VM template is invalid.",
					"desc" : "The name of the VM template is invalid.",
					"solution" : "Please change a name and try again."
				},
				"4823069" : {
					"cause" : "The cluster of the VM template is invalid.",
					"desc" : "The cluster of the VM template is invalid.",
					"solution" : "Please modify the parameter and try again."
				},
				"4825000" : {
					"cause" : "The VM logic template is not associated with VM template.",
					"desc" : "The VM logic template is not associated with VM template.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825001" : {
					"cause" : "No VM logical template is associated with the VM template.",
					"desc" : "No VM logical template is associated with the VM template.",
					"solution" : "Please obtain VM template information again."
				},
				"4825002" : {
					"cause" : "The VM logical template does not exist.",
					"desc" : "The VM logical template does not exist.",
					"solution" : "Please obtain data again or contact Huawei technical support."
				},
				"4825003" : {
					"cause" : "An error occurred when querying associated cluster information.",
					"desc" : "An error occurred when querying associated cluster information.",
					"solution" : "Contact technical support."
				},
				"4825004" : {
					"cause" : "An error occurred when querying cluster information.",
					"desc" : "An error occurred when querying cluster information.",
					"solution" : "Contact technical support."
				},
				"4825005" : {
					"cause" : "An error occurred when querying VM logical template information.",
					"desc" : "An error occurred when querying VM logical template information.",
					"solution" : "Contact technical support."
				},
				"4825006" : {
					"cause" : "Incorrect VM logical template data.",
					"desc" : "Incorrect VM logical template data.",
					"solution" : "Contact technical support."
				},
				"4825007" : {
					"cause" : "The VM logical template is in the activated state, and therefore cannot be deassociated from the VM template.",
					"desc" : "The VM logical template is in the activated state, and therefore cannot be deassociated from the VM template.",
					"solution" : "Please deactivate the VM logical template and try again."
				},
				"4825008" : {
					"cause" : "Incorrect VM logical template data.",
					"desc" : "Incorrect VM logical template data.",
					"solution" : "Contact technical support."
				},
				"4825009" : {
					"cause" : "An error occurred when querying the virtual environment name.",
					"desc" : "An error occurred when querying the virtual environment name.",
					"solution" : "Contact technical support."
				},
				"4825010" : {
					"cause" : "An error occurred when querying the cluster name.",
					"desc" : "An error occurred when querying the cluster name.",
					"solution" : "Contact technical support."
				},
				"4825011" : {
					"cause" : "The VM template is lost.",
					"desc" : "The VM template is lost.",
					"solution" : "The VM template is lost."
				},
				"4825012" : {
					"cause" : "The VM logical template is in the activated state, and therefore cannot be associated with or deassociated from the VM template.",
					"desc" : "The VM logical template is in the activated state, and therefore cannot be associated with or deassociated from the VM template.",
					"solution" : "Please deactivate the VM logical template and try again."
				},
				"4825013" : {
					"cause" : "The number of disks on the VM template is greater than 1.",
					"desc" : "The number of disks on the VM template is greater than 1.",
					"solution" : "The number of disks on the VM template is greater than 1."
				},
				"4825014" : {
					"cause" : "Parameter error.",
					"desc" : "Parameter error.",
					"solution" : "Contact technical support."
				},
				"4825015" : {
					"cause" : "Operation failed due to a VM logical template status conflict.",
					"desc" : "Operation failed due to a VM logical template status conflict.",
					"solution" : "Please obtain VM logical template information again."
				},
				"4825016" : {
					"cause" : "Association failed because the OS version for the VM logical template does not match.",
					"desc" : "Association failed because the OS version for the VM logical template does not match.",
					"solution" : "Please select another VM logical template to be associated."
				},
				"4825017" : {
					"cause" : "Association failed because the system disk size for the VM logical template does not match.",
					"desc" : "Association failed because the system disk size for the VM logical template does not match.",
					"solution" : "Please select another VM logical template to be associated."
				},
				"4825018" : {
					"cause" : "The VM logical template has been associated with a VM template. Therefore, the OS version for the VM logical template cannot be changed.",
					"desc" : "The VM logical template has been associated with a VM template. Therefore, the OS version for the VM logical template cannot be changed.",
					"solution" : "Please deassociate the VM logical template from the VM template and try again."
				},
				"4825019" : {
					"cause" : "The VM logical template has been associated with a VM template. Therefore, the system disk size for the VM logical template cannot be changed.",
					"desc" : "The VM logical template has been associated with a VM template. Therefore, the system disk size for the VM logical template cannot be changed.",
					"solution" : "Please deassociate the VM logical template from the VM template and try again."
				},
				"4825020" : {
					"cause" : "The VM logical template is in the activated state, and therefore cannot be modified.",
					"desc" : "The VM logical template is in the activated state, and therefore cannot be modified.",
					"solution" : "Please deactivate the VM logical template and try again."
				},
				"4825021" : {
					"cause" : "The VM template has been associated with a VM logical template, and therefore the VM template publication cannot be canceled.",
					"desc" : "The VM template has been associated with a VM logical template, and therefore the VM template publication cannot be canceled.",
					"solution" : "Please deassociate the VM logical template from the VM template and try again."
				},
				"4825022" : {
					"cause" : "The VM template has not been published, and therefore cannot be associated with a VM logical template.",
					"desc" : "The VM template has not been published, and therefore cannot be associated with a VM logical template.",
					"solution" : "Please publish the VM template and try again."
				},
				"4825023" : {
					"cause" : "The VM logical template is in the activated state, and therefore cannot be deleted.",
					"desc" : "The VM logical template is in the activated state, and therefore cannot be deleted.",
					"solution" : "Please deassociate the VM logical template from the VM template and try again."
				},
				"4825025" : {
					"cause" : "The VM logical template's password is inconsistent.",
					"desc" : "The VM logical template's password is inconsistent.",
					"solution" : "Please enter the password and try again."
				},
				"4825111" : {
					"cause" : "Duplicate VM logical template name.",
					"desc" : "Duplicate VM logical template name.",
					"solution" : "Please reenter a VM logical template name."
				},
				"4825113" : {
					"cause" : "The VM template has been associated with a VM logical template.",
					"desc" : "The VM template has been associated with a VM logical template.",
					"solution" : "Please deassociate the VM template from the VM logical template before reassociation."
				},
				"4825116" : {
					"cause" : "A VM template in the same cluster has been associated with the VM logical template.",
					"desc" : "A VM template in the same cluster has been associated with the VM logical template.",
					"solution" : "Please view the associated VM template."
				},
				"4825117" : {
					"cause" : "The number of added vm templates reaches the maximum.",
					"desc" : "The number of added vm templates reaches the maximum.",
					"solution" : "Delete unnecessary vm templates and try to create a VM template again. Perform this operation with caution."
				},
				"4825118" : {
					"cause" : "The number of added vm templates reaches the maximum.",
					"desc" : "The number of added vm templates reaches the maximum.",
					"solution" : "Delete unnecessary vm templates and try to create VM template again. Perform this operation with caution."
				},
				"4826001" : {
					"cause" : "PVM network not matched with guest vm network.",
					"desc" : "PVM network not matched with guest vm network.",
					"solution" : "Pleas modify PVM network."
				},
				"4826002" : {
					"cause" : "PVM not exist or not running.",
					"desc" : "PVM not exist or not running.",
					"solution" : "Pleas confirm PVM existence and running state."
				},
				"4826003" : {
					"cause" : "The ISO file does not exist.",
					"desc" : "The ISO file does not exist.",
					"solution" : "Ensure the ISO file is available."
				},
				"4840002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4840003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4840004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4840005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4840006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4840007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"4840008" : {
					"cause" : "The external network does not exist.",
					"desc" : "The external network does not exist.",
					"solution" : "Please create an external network and try later."
				},
				"4840009" : {
					"cause" : "The operation failed.",
					"desc" : "The operation failed.",
					"solution" : "Please access VDI to try later."
				},
				"4840010" : {
					"cause" : "The external network associated with the NIC has been deleted.",
					"desc" : "The external network associated with the NIC has been deleted.",
					"solution" : "Please select a new external network."
				},
				"4840011" : {
					"cause" : "The NIC is not associated with any network.",
					"desc" : "The NIC is not associated with any network.",
					"solution" : "Please select an external network for the NIC."
				},
				"4840013" : {
					"cause" : "The NIC is not associated with any network.",
					"desc" : "The NIC is not associated with any network.",
					"solution" : "Please select an network for the NIC."
				},
				"4840014" : {
					"cause" : "CPU exceed max number.",
					"desc" : "CPU exceed max number.",
					"solution" : "CPU exceed max number"
				},
				"4840015" : {
					"cause" : "Cannot get max CPU from cluster.",
					"desc" : "Cannot get max CPU from cluster.",
					"solution" : "Please confirm max CPU from cluster."
				},
				"5100001" : {
					"cause" : "No mandatory parameters configured.",
					"desc" : "No mandatory parameters configured.",
					"solution" : "Check the parameters."
				},
				"5100002" : {
					"cause" : "Invalid g value.",
					"desc" : "Invalid g value.",
					"solution" : "Change the name and try again."
				},
				"5100003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the technical support engineer."
				},
				"5100004" : {
					"cause" : "The request is null or empty.",
					"desc" : "The request is null or empty.",
					"solution" : "Please check the input request parameters."
				},
				"5100005" : {
					"cause" : "Page information incorrectly configured.",
					"desc" : "Page information incorrectly configured.",
					"solution" : "Correctly configure the page information."
				},
				"5100006" : {
					"cause" : "Invalid page size.",
					"desc" : "Invalid page size.",
					"solution" : "Configure the configuration file again."
				},
				"5100007" : {
					"cause" : "Database error.",
					"desc" : "Database error.",
					"solution" : "Handle the fault by referring to the related dataabase error code."
				},
				"5101001" : {
					"cause" : "The service template does not exist.",
					"desc" : "The service template does not exist.",
					"solution" : "Please refresh the service template management page and try again."
				},
				"5101002" : {
					"cause" : "The service template already exists.",
					"desc" : "The service template already exists.",
					"solution" : "Change the service template and try again."
				},
				"5101003" : {
					"cause" : "Service template verification failed.",
					"desc" : "Service template verification failed.",
					"solution" : "Contact technical support."
				},
				"5101004" : {
					"cause" : "The published service template cannot be modified.",
					"desc" : "The published service template cannot be modified.",
					"solution" : "The published service template cannot be modified. Check the service template status before modification."
				},
				"5101005" : {
					"cause" : "The published template cannot be deleted.",
					"desc" : "The published template cannot be deleted.",
					"solution" : "The published template cannot be deleted."
				},
				"5101006" : {
					"cause" : "Duplicate service template name.",
					"desc" : "Duplicate service template name.",
					"solution" : "Enter a unique name."
				},
				"5101007" : {
					"cause" : "Requests in the queue timed out due to slow responses of the DAS server.",
					"desc" : "Requests in the queue timed out due to slow responses of the DAS server.",
					"solution" : "Verify the service volume of the DAS client and ensure that the load of database hosts is normal."
				},
				"5101008" : {
					"cause" : "The template ID is left blank or incorrectly configured.",
					"desc" : "The template ID is left blank or incorrectly configured.",
					"solution" : "Check the template file."
				},
				"5101010" : {
					"cause" : "Template verification failed.",
					"desc" : "Template verification failed.",
					"solution" : "Contact Huawei technical support."
				},
				"5101014" : {
					"cause" : "The template is in an invalid Json format.",
					"desc" : "The template is in an invalid Json format.",
					"solution" : "Check the template format."
				},
				"5101015" : {
					"cause" : "Failed to obtain global parameters.",
					"desc" : "Failed to obtain global parameters.",
					"solution" : "Check the DAS global configuration file."
				},
				"5101018" : {
					"cause" : "Failed to delete template parameters.",
					"desc" : "Failed to delete template parameters.",
					"solution" : "Configure the parameters again and then delete the configured parameters."
				},
				"5101019" : {
					"cause" : "Failed to delete template resources.",
					"desc" : "Failed to delete template resources.",
					"solution" : "You do not have the permission to delete template resources."
				},
				"5101020" : {
					"cause" : "The template in the current status cannot be used to create VMs.",
					"desc" : "The template in the current status cannot be used to create VMs.",
					"solution" : "Modify the template status and try to create VMs again."
				},
				"5101021" : {
					"cause" : "Incorrect template parameters.",
					"desc" : "Incorrect template parameters.",
					"solution" : "Check template parameters."
				},
				"5101022" : {
					"cause" : "Circular dependency exists between two resources in the template.",
					"desc" : "Circular dependency exists between two resources in the template.",
					"solution" : "Please select a new template."
				},
				"5101025" : {
					"cause" : "The service template contains no VM template.",
					"desc" : "The service template contains no VM template.",
					"solution" : "The service template contains no VM template. Please check."
				},
				"5101026" : {
					"cause" : "The template does not contain any resource.",
					"desc" : "The template does not contain any resource.",
					"solution" : "The template does not contain any resource. Add resources."
				},
				"5101032" : {
					"cause" : "The template is empty.",
					"desc" : "The template is empty.",
					"solution" : "The template is empty. Add resources."
				},
				"5101102" : {
					"cause" : "VM template contains multiple NIC which has been assigned gateway.",
					"desc" : "VM template contains multiple NIC which has been assigned gateway.",
					"solution" : "Please redesign the service template."
				},
				"5102001" : {
					"cause" : "The application instance does not exist.",
					"desc" : "The application instance does not exist.",
					"solution" : "Please try again."
				},
				"5102002" : {
					"cause" : "The application instance already exists.",
					"desc" : "The application instance already exists.",
					"solution" : "Please try again."
				},
				"5102003" : {
					"cause" : "The application instance is running.",
					"desc" : "The application instance is running.",
					"solution" : "Please try again."
				},
				"5102004" : {
					"cause" : "The application instance has stopped.",
					"desc" : "The application instance has stopped.",
					"solution" : "Please try again."
				},
				"5102005" : {
					"cause" : "The application instance is ineffective.",
					"desc" : "The application instance is ineffective.",
					"solution" : "This operation is not allowed."
				},
				"5102006" : {
					"cause" : "The application in its current state does not support retry.",
					"desc" : "The application in its current state does not support retry.",
					"solution" : "Please try again."
				},
				"5102201" : {
					"cause" : "Application status can not start.",
					"desc" : "Application status can not start.",
					"solution" : "Application status can not start, Please try again util the status of the application is stable."
				},
				"5102204" : {
					"cause" : "This operation cannot be performed for the application in the current state.",
					"desc" : "This operation cannot be performed for the application in the current state.",
					"solution" : "Contact technical support."
				},
				"5102600" : {
					"cause" : "VlanID in port group does not exist.",
					"desc" : "VlanID in port group does not exist.",
					"solution" : "VlanID in port group does not exist. Try another VlanID."
				},
				"5102601" : {
					"cause" : "Subnet in port group does not exist.",
					"desc" : "Subnet in port group does not exist.",
					"solution" : "Subnet in port group does not exist. Try another subnet."
				},
				"5102603" : {
					"cause" : "Application status can not stop.",
					"desc" : "Application status can not stop.",
					"solution" : "Application status can not stop, Please try again util the status of the application is stable."
				},
				"5102604" : {
					"cause" : "Port group has no available VlanID.",
					"desc" : "Port group has no available VlanID.",
					"solution" : "Port group has no available VlanID, Please check."
				},
				"5102605" : {
					"cause" : "Port group has no available subnet ID.",
					"desc" : "Port group has no available subnet ID.",
					"solution" : "Port group has no available subnet ID. Please check."
				},
				"5102606" : {
					"cause" : "The \"maximum transmit bandwidth\" and \"priority\" in port group {0} must be both empty or specified.",
					"desc" : "The \"maximum transmit bandwidth\" and \"priority\" in port group {0} must be both empty or specified.",
					"solution" : "The \"maximum transmit bandwidth\" and \"priority\" in port group {0} must be both empty or specified. Please check."
				},
				"5102608" : {
					"cause" : "Stop applications failed.",
					"desc" : "Stop applications failed.",
					"solution" : "Please try later."
				},
				"5102609" : {
					"cause" : "Failed to stop running VMs.",
					"desc" : "Failed to stop running VMs.",
					"solution" : "Please try again."
				},
				"5102700" : {
					"cause" : "Failed to create the instance resource.",
					"desc" : "Failed to create the instance resource.",
					"solution" : "Please try again."
				},
				"5102701" : {
					"cause" : "Failed to delete the instance resource.",
					"desc" : "Failed to delete the instance resource.",
					"solution" : "Please try again."
				},
				"5102702" : {
					"cause" : "Failed to query the instance resource.",
					"desc" : "Failed to query the instance resource.",
					"solution" : "Please try again."
				},
				"5102703" : {
					"cause" : "The VM template ID does not exist.",
					"desc" : "The VM template ID does not exist.",
					"solution" : "Please try again with another VM ID."
				},
				"5102704" : {
					"cause" : "VM instance creation timed out.",
					"desc" : "VM instance creation timed out.",
					"solution" : "Please try again."
				},
				"5102705" : {
					"cause" : "The number of VM disks exceeds the allowed maximum number.",
					"desc" : "The number of VM disks exceeds the allowed maximum number.",
					"solution" : "Please try again."
				},
				"5102706" : {
					"cause" : "The number of VM NICs exceeds the allowed maximum number or is less than the required minimum number.",
					"desc" : "The number of VM NICs exceeds the allowed maximum number or is less than the required minimum number.",
					"solution" : "Please try again."
				},
				"5102707" : {
					"cause" : "The entered value is not an integer.",
					"desc" : "The entered value is not an integer.",
					"solution" : "Please try again."
				},
				"5102708" : {
					"cause" : "The NIC name already exists.",
					"desc" : "The NIC name already exists.",
					"solution" : "Please try again with another NIC name."
				},
				"5102709" : {
					"cause" : "The number of created VMs is different from the number of requested VMs.",
					"desc" : "The number of created VMs is different from the number of requested VMs.",
					"solution" : "Please try again."
				},
				"5102710" : {
					"cause" : "Incorrect disk Json format.",
					"desc" : "Incorrect disk Json format.",
					"solution" : "Check that the Json format is correct."
				},
				"5102711" : {
					"cause" : "Incorrect NIC Json format.",
					"desc" : "Incorrect NIC Json format.",
					"solution" : "Check that the Json format is correct."
				},
				"5102712" : {
					"cause" : "Incorrect resource Json format.",
					"desc" : "Incorrect resource Json format.",
					"solution" : "Check that the Json format is correct."
				},
				"5102713" : {
					"cause" : "Invalid resource sub-attribute.",
					"desc" : "Invalid resource sub-attribute.",
					"solution" : "Check that the resource sub-attribute is valid."
				},
				"5102714" : {
					"cause" : "The number of commands exceeds the allowed maximum number.",
					"desc" : "The number of commands exceeds the allowed maximum number.",
					"solution" : "Check that the number of commands is within the range."
				},
				"5102715" : {
					"cause" : "Invalid resource name.",
					"desc" : "Invalid resource name.",
					"solution" : "Check that the resource name is invalid."
				},
				"5102716" : {
					"cause" : "Invalid resource description.",
					"desc" : "Invalid resource description.",
					"solution" : "Check that the resource description is invalid."
				},
				"5102717" : {
					"cause" : "Failed to obtain the VM instance IP address.",
					"desc" : "Failed to obtain the VM instance IP address.",
					"solution" : "Please try again."
				},
				"5102718" : {
					"cause" : "No NIC is defined in the VM template.",
					"desc" : "No NIC is defined in the VM template.",
					"solution" : "Please try again."
				},
				"5102719" : {
					"cause" : "Failed to create the VM instance.",
					"desc" : "Failed to create the VM instance.",
					"solution" : "Please try again."
				},
				"5102720" : {
					"cause" : "Failed to query the VM instance status.",
					"desc" : "Failed to query the VM instance status.",
					"solution" : "Please try again."
				},
				"5102721" : {
					"cause" : "Query VM information error.",
					"desc" : "Query VM information error.",
					"solution" : "Please try later"
				},
				"5102722" : {
					"cause" : "Failed to start the VM.",
					"desc" : "Failed to start the VM.",
					"solution" : "Please try again."
				},
				"5102723" : {
					"cause" : "Failed to stop the VM.",
					"desc" : "Failed to stop the VM.",
					"solution" : "Please try again."
				},
				"5102724" : {
					"cause" : "Failed to delete the VM.",
					"desc" : "Failed to delete the VM.",
					"solution" : "Please try again."
				},
				"5102725" : {
					"cause" : "The number of application instances has reached the allowed maximum value.",
					"desc" : "The number of application instances has reached the allowed maximum value.",
					"solution" : "Please try again."
				},
				"5102726" : {
					"cause" : "The number of concurrently created application instances has reached the allowed maximum value.",
					"desc" : "The number of concurrently created application instances has reached the allowed maximum value.",
					"solution" : "Please try again."
				},
				"5102727" : {
					"cause" : "Resource creation timed out.",
					"desc" : "Resource creation timed out.",
					"solution" : "Please try again."
				},
				"5102728" : {
					"cause" : "Invalid ipv4 address.",
					"desc" : "Invalid ipv4 address.",
					"solution" : "Please try again."
				},
				"5102729" : {
					"cause" : "Software package are not registered or in the abnormal state.",
					"desc" : "Software package are not registered or in the abnormal state.",
					"solution" : "Resources are not registered or in the abnormal state. Please check."
				},
				"5102730" : {
					"cause" : "Failed to query the resource status due to an unknown error.",
					"desc" : "Failed to query the resource status due to an unknown error.",
					"solution" : "Identify the cause of the unknown error."
				},
				"5102731" : {
					"cause" : "The resource attribute does not exist.",
					"desc" : "The resource attribute does not exist.",
					"solution" : "Identify the resource attribute."
				},
				"5102732" : {
					"cause" : "Incorrect software Json format.",
					"desc" : "Incorrect software Json format.",
					"solution" : "Please try again."
				},
				"5102733" : {
					"cause" : "The software quantity exceeds the allowed maximum number.",
					"desc" : "The software quantity exceeds the allowed maximum number.",
					"solution" : "Please try again."
				},
				"5102736" : {
					"cause" : "Software package on VM is not registered.",
					"desc" : "Software package on VM is not registered.",
					"solution" : "Software package on VM is not registered. Select a valid software package."
				},
				"5102737" : {
					"cause" : "VM template does not exist.",
					"desc" : "VM template does not exist.",
					"solution" : "VM template does not exist. Try another VM template."
				},
				"5102739" : {
					"cause" : "VM template is not registered.",
					"desc" : "VM template is not registered.",
					"solution" : "Check the VM template status."
				},
				"5102746" : {
					"cause" : "Failed to execute the command during software package installation.",
					"desc" : "Failed to execute the command during software package installation.",
					"solution" : "Failed to execute the command during software package installation."
				},
				"5102750" : {
					"cause" : "Failed to install the software package.",
					"desc" : "Failed to install the software package.",
					"solution" : "Contact the technical support engineer."
				},
				"5102751" : {
					"cause" : "Software package installation timed out.",
					"desc" : "Software package installation timed out.",
					"solution" : "Software package installation timed out."
				},
				"5102752" : {
					"cause" : "Failed to install the file.",
					"desc" : "Failed to install the file.",
					"solution" : "Contact the technical support engineer."
				},
				"5102753" : {
					"cause" : "Stop vm over time.",
					"desc" : "Stop vm over time.",
					"solution" : "Please try again."
				},
				"5102757" : {
					"cause" : "No proxy vm instance exist in VPC.",
					"desc" : "No proxy vm instance exist in VPC.",
					"solution" : "Please make sure proxy vm instance existence in VPC."
				},
				"5102758" : {
					"cause" : "VPC not exist.",
					"desc" : "VPC not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5102759" : {
					"cause" : "Proxy vm not running.",
					"desc" : "Proxy vm not running.",
					"solution" : "Please make sure proxy vm instance running."
				},
				"5102760" : {
					"cause" : "Guest vm not exist.",
					"desc" : "Guest vm not exist.",
					"solution" : "Please make sure guest vm existence."
				},
				"5102761" : {
					"cause" : "Proxy vm network not matched with guest vm.",
					"desc" : "Proxy vm network not matched with guest vm.",
					"solution" : "Please modify proxy vm instance to make sure network matched."
				},
				"5102820" : {
					"cause" : "App name duplicate.",
					"desc" : "App name duplicate.",
					"solution" : "Please change the app name."
				},
				"5103001" : {
					"cause" : "The software package has been deleted.",
					"desc" : "The software package has been deleted.",
					"solution" : "Please refresh the software package page and try again."
				},
				"5103002" : {
					"cause" : "The resource already exists.",
					"desc" : "The resource already exists.",
					"solution" : "The resource already exists. Please check."
				},
				"5103003" : {
					"cause" : "The resource type does not exist.",
					"desc" : "The resource type does not exist.",
					"solution" : "The resource type does not exist. Please check."
				},
				"5103004" : {
					"cause" : "The resource is in use.",
					"desc" : "The resource is in use.",
					"solution" : "The resource is in use. Access failed."
				},
				"5103005" : {
					"cause" : "Resource attributes not configured.",
					"desc" : "Resource attributes not configured.",
					"solution" : "Resource attributes not configured."
				},
				"5103006" : {
					"cause" : "The ISO has been deleted.",
					"desc" : "The ISO has been deleted.",
					"solution" : "Please refresh the ISO page and try again."
				},
				"5103007" : {
					"cause" : "Resource type not supported temporarily.",
					"desc" : "Resource type not supported temporarily.",
					"solution" : "Resoruce type not supported temporarily."
				},
				"5103008" : {
					"cause" : "The total number of the software packages reaches the maximum value in the range of system.",
					"desc" : "The total number of the software packages reaches the maximum value in the range of system.",
					"solution" : "Delete unnecessary software packages. Perform this operation with caution."
				},
				"5103009" : {
					"cause" : "The total size of the software packages reaches the maximum value (80 GB).",
					"desc" : "The total size of the software packages reaches the maximum value (80 GB).",
					"solution" : "The total size of the software packages reaches the maximum value (80 GB)."
				},
				"5103011" : {
					"cause" : "The software or script is being repaired.",
					"desc" : "The software or script is being repaired.",
					"solution" : "Please try later."
				},
				"5103012" : {
					"cause" : "Software package in VM template is in abnormal status.",
					"desc" : "Software package in VM template is in abnormal status.",
					"solution" : "Software package in VM template is in abnormal status.Please repair the software package or redesign."
				},
				"5103013" : {
					"cause" : "Software package in VM template contains file which does not exist.",
					"desc" : "Software package in VM template contains file which does not exist.",
					"solution" : "Please redesign the service template."
				},
				"5103014" : {
					"cause" : "The software package size exceeds 4G.",
					"desc" : "The software package size exceeds 4G.",
					"solution" : "Please change the file."
				},
				"5103015" : {
					"cause" : "The file does not exist.",
					"desc" : "The file does not exist.",
					"solution" : "Please choose the file."
				},
				"5103016" : {
					"cause" : "The script size exceeds 1MB.",
					"desc" : "The script size exceeds 1MB.",
					"solution" : "Please change the file."
				},
				"5103017" : {
					"cause" : "The resource does not exist.",
					"desc" : "The resource does not exist.",
					"solution" : "Contact the system administrator."
				},
				"5103088" : {
					"cause" : "The total number of the software packages reaches the maximum value in the range of organization.",
					"desc" : "The total number of the software packages reaches the maximum value in the range of organization.",
					"solution" : "Delete unnecessary software packages. Perform this operation with caution."
				},
				"5104002" : {
					"cause" : "Disk space is insufficient.",
					"desc" : "Disk space is insufficient.",
					"solution" : "Please refer to the \"Product Documentation\" to clean up unused packages or replace the larger disk for FusionManager Virtual Machine."
				},
				"5104003" : {
					"cause" : "The OS of this type can be provided for dedicated servers. To make the ISO image into an installation source\\, the system requires a storage space that is 2.5 times of the ISO image size.",
					"desc" : "The OS of this type can be provided for dedicated servers. To make the ISO image into an installation source\\, the system requires a storage space that is 2.5 times of the ISO image size.",
					"solution" : "Please refer to the \"Product Documentation\" to clean up unused packages or replace the larger disk for FusionManager Virtual Machine."
				},
				"5111000" : {
					"cause" : "An Internal Error Occurred.",
					"desc" : "An Internal Error Occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111001" : {
					"cause" : "Missing Required Parameter.",
					"desc" : "Missing Required Parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111002" : {
					"cause" : "Invalid Parameter Value.",
					"desc" : "Invalid Parameter Value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111004" : {
					"cause" : "Empty Request.",
					"desc" : "Empty Request.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111005" : {
					"cause" : "Invalid Page Number.",
					"desc" : "Invalid Page Number.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111006" : {
					"cause" : "Invalid Page Size.",
					"desc" : "Invalid Page Size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111008" : {
					"cause" : "Policy Name Duplicated.",
					"desc" : "Policy Name Duplicated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111009" : {
					"cause" : "Policy Not Found.",
					"desc" : "Policy Not Found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111010" : {
					"cause" : "Policy is Not Allowed to Update while the Policy State is Enabled.",
					"desc" : "Policy is Not Allowed to Update while the Policy State is Enabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111011" : {
					"cause" : "Policy is Not Allowed to Delete while the Policy State is Enabled.",
					"desc" : "Policy is Not Allowed to Delete while the Policy State is Enabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111012" : {
					"cause" : "Policy is Not Allowed to Stop while the Policy State is Blocked.",
					"desc" : "Policy is Not Allowed to Stop while the Policy State is Blocked.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111013" : {
					"cause" : "Policy is Not Allowed to Start while the Policy State is Blocked.",
					"desc" : "Policy is Not Allowed to Start while the Policy State is Blocked.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111014" : {
					"cause" : "It is Not a Scaing Up Operation.",
					"desc" : "It is Not a Scaing Up Operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111015" : {
					"cause" : "It is Not a Scaing Down Operation.",
					"desc" : "It is Not a Scaing Down Operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111016" : {
					"cause" : "The Metric Already Exist in this Policy.",
					"desc" : "The Metric Already Exist in this Policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111017" : {
					"cause" : "The Policy Name is not correct.",
					"desc" : "The Policy Name is not correct.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111018" : {
					"cause" : "Policy Description is Invalid.",
					"desc" : "Policy Description is Invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111019" : {
					"cause" : "The Interval of Collect is not Valid.",
					"desc" : "The Interval of Collect is not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111020" : {
					"cause" : "The Consecutive Times is Not Valid.",
					"desc" : "The Consecutive Times is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111021" : {
					"cause" : "The Trigger Action is Not Valid.",
					"desc" : "The Trigger Action is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111022" : {
					"cause" : "The Cooling Time is Not Valid.",
					"desc" : "The Cooling Time is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111023" : {
					"cause" : "The Scaling Step is Not Valid.",
					"desc" : "The Scaling Step is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111024" : {
					"cause" : "The Calculate Pattern of Scaling Step is Not Valid.",
					"desc" : "The Calculate Pattern of Scaling Step is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111025" : {
					"cause" : "The Metric Type of Policy is Not Valid.",
					"desc" : "The Metric Type of Policy is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111026" : {
					"cause" : "CPU Threshold is Not Valid.",
					"desc" : "CPU Threshold is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111027" : {
					"cause" : "MEMORY Threshold is Not Valid.",
					"desc" : "MEMORY Threshold is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111028" : {
					"cause" : "The Upstream Network Rraffic Threshold is Not Valid.",
					"desc" : "The Upstream Network Rraffic Threshold is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111029" : {
					"cause" : "The Downstream Network Rraffic Threshold is Not Valid.",
					"desc" : "The Downstream Network Rraffic Threshold is Not Valid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111030" : {
					"cause" : "Incorrect disk read threshold.",
					"desc" : "Incorrect disk read threshold.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111031" : {
					"cause" : "Incorrect disk write threshold.",
					"desc" : "Incorrect disk write threshold.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111032" : {
					"cause" : "The number of policies exceeds 10.",
					"desc" : "The number of policies exceeds 10.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111300" : {
					"cause" : "Only One Inter-Group Policy is allowed to run in VDC.",
					"desc" : "Only One Inter-Group Policy is allowed to run in VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111301" : {
					"cause" : "Can not start while some Policy is Blocked in VDC.",
					"desc" : "Can not start while some Policy is Blocked in VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111303" : {
					"cause" : "The time input is before the current time of system.",
					"desc" : "The time input is before the current time of system.",
					"solution" : "Please check the currrent time of system, then set time after it."
				},
				"5111400" : {
					"cause" : "The name of the Intera-Group Policy already exist.",
					"desc" : "The name of the Intera-Group Policy already exist.",
					"solution" : "Please change another name."
				},
				"5111401" : {
					"cause" : "Intera-Group Policy exceed the system limits.",
					"desc" : "Intera-Group Policy exceed the system limits.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111402" : {
					"cause" : "Intera-Group policy does not exist.",
					"desc" : "Intera-Group policy does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111403" : {
					"cause" : "Intera-Group Policy does not currently support the update operation.",
					"desc" : "Intera-Group Policy does not currently support the update operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111404" : {
					"cause" : "Intera-Group Policy contains a duplicated set of configuration information.",
					"desc" : "Intera-Group Policy contains a duplicated set of configuration information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111405" : {
					"cause" : "The cpu or memory reserved value exceed vdc resources maximum.",
					"desc" : "The cpu or memory reserved value exceed vdc resources maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111406" : {
					"cause" : "the Intera-Group policy vdc not exist.",
					"desc" : "the Intera-Group policy vdc not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111407" : {
					"cause" : "Intera-Group policy does not currently support delete operation.",
					"desc" : "Intera-Group policy does not currently support delete operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111408" : {
					"cause" : "Policy currently does not support removing.",
					"desc" : "Policy currently does not support removing.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111409" : {
					"cause" : "Please select one scaling group.",
					"desc" : "Please select one scaling group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111410" : {
					"cause" : "The policy group need to add a  scaling group.",
					"desc" : "The policy group need to add a  scaling group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111411" : {
					"cause" : "The policy does not exist.",
					"desc" : "The policy does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111412" : {
					"cause" : "stop the policy does not exist.",
					"desc" : "stop the policy does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111413" : {
					"cause" : "only stop the state's policy to support modifications.",
					"desc" : "only stop the state's policy to support modifications.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111414" : {
					"cause" : "Policy is Not Allowed to Stop while the Policy State is Blocked.",
					"desc" : "Policy is Not Allowed to Stop while the Policy State is Blocked.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111415" : {
					"cause" : "Policy is Not Allowed to Start while the Policy State is Blocked.",
					"desc" : "Policy is Not Allowed to Start while the Policy State is Blocked.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111416" : {
					"cause" : "policy currently does not support removing.",
					"desc" : "policy currently does not support removing.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111503" : {
					"cause" : "The scheduled task does not exist.",
					"desc" : "The scheduled task does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111504" : {
					"cause" : "Associated Policy Type Error.",
					"desc" : "Associated Policy Type Error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111505" : {
					"cause" : "Associated Policy Operation Error.",
					"desc" : "Associated Policy Operation Error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5111603" : {
					"cause" : "The scheduled task does not exist.",
					"desc" : "The scheduled task does not exist.",
					"solution" : "Contact technical support."
				},
				"5112000" : {
					"cause" : "Invalid Input Parameter.",
					"desc" : "Invalid Input Parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112001" : {
					"cause" : "Db Access Exception.",
					"desc" : "Db Access Exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112002" : {
					"cause" : "An Internal Error Occurred.",
					"desc" : "An Internal Error Occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112003" : {
					"cause" : "RPC Client Exception.",
					"desc" : "RPC Client Exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112100" : {
					"cause" : "The Name of the Scaling Group Already Exists.",
					"desc" : "The Name of the Scaling Group Already Exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112101" : {
					"cause" : "Invalid ScalingGroup Name.",
					"desc" : "Invalid ScalingGroup Name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112102" : {
					"cause" : "The Name of the Scaling Group is Invalid.",
					"desc" : "The Name of the Scaling Group is Invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112103" : {
					"cause" : "ScalingGroup Status Not Suited To Stop.",
					"desc" : "ScalingGroup Status Not Suited To Stop.",
					"solution" : "Please wait until the status of the scalingGroup change to normal and try again."
				},
				"5112104" : {
					"cause" : "The Scaling Group Already Exists.",
					"desc" : "The Scaling Group Already Exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112105" : {
					"cause" : "The Scaling Group In the Current State cannot be Modified.",
					"desc" : "The Scaling Group In the Current State cannot be Modified.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112106" : {
					"cause" : "The Intra-Group Scheduling Policy Cannot Be Created When The Scaling Group is in the Current State.",
					"desc" : "The Intra-Group Scheduling Policy Cannot Be Created When The Scaling Group is in the Current State.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112107" : {
					"cause" : "The Intra-Group Scheduling Policy Cannot be Updated When the Scaling Group is in the Current State.",
					"desc" : "The Intra-Group Scheduling Policy Cannot be Updated When the Scaling Group is in the Current State.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112108" : {
					"cause" : "The Scaling Group cannot be Updated When the Group is in the Current State.",
					"desc" : "The Scaling Group cannot be Updated When the Group is in the Current State.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112109" : {
					"cause" : "The Scaling Group cannot be Deleted When the Group is in the Current State.",
					"desc" : "The Scaling Group cannot be Deleted When the Group is in the Current State.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112110" : {
					"cause" : "Failed to Create VMs in the Scaling Group.",
					"desc" : "Failed to Create VMs in the Scaling Group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112111" : {
					"cause" : "Group inner policy confict with scaling group.",
					"desc" : "Group inner policy confict with scaling group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112114" : {
					"cause" : "The Policy in the Scaling Group can not be stopped.",
					"desc" : "The Policy in the Scaling Group can not be stopped.",
					"solution" : "Please wait until the status of the policy change to normal and try again."
				},
				"5112115" : {
					"cause" : "This operation cannot be performed for the application in the current state.",
					"desc" : "This operation cannot be performed for the application in the current state.",
					"solution" : "Please check the currrent stack state before operating."
				},
				"5112116" : {
					"cause" : "Scaling cannot be performed for the application in the current state.",
					"desc" : "Scaling cannot be performed for the application in the current state.",
					"solution" : "Please check the currrent stack state before operating."
				},
				"5112117" : {
					"cause" : "Schedule scaling exists.",
					"desc" : "Schedule scaling exists.",
					"solution" : "Please try later"
				},
				"5112118" : {
					"cause" : "Scaling group trigger time can not be late to the current system time.",
					"desc" : "Scaling group trigger time can not be late to the current system time.",
					"solution" : "Please input trigger time correctly"
				},
				"5112119" : {
					"cause" : "Scaling group number exceeds max value.",
					"desc" : "Scaling group number exceeds max value.",
					"solution" : "Contact technical support."
				},
				"5112201" : {
					"cause" : "The Operation Name Already Exists.",
					"desc" : "The Operation Name Already Exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112202" : {
					"cause" : "The Page Number is Invalid.",
					"desc" : "The Page Number is Invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112203" : {
					"cause" : "The Scaling Group does not Exist.",
					"desc" : "The Scaling Group does not Exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112204" : {
					"cause" : "Invalid page size.",
					"desc" : "Invalid page size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112205" : {
					"cause" : "No Operation can be Performed When the Scaling Group is in the Current State.",
					"desc" : "No Operation can be Performed When the Scaling Group is in the Current State.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112206" : {
					"cause" : "Operation Timed Out.",
					"desc" : "Operation Timed Out.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112207" : {
					"cause" : "No support on act policy in this status of scaling group.",
					"desc" : "No support on act policy in this status of scaling group.",
					"solution" : "Please try later"
				},
				"5112208" : {
					"cause" : "The Intra-Group Policy Cannot be Deleted When the Scaling Group is in the Current State.",
					"desc" : "The Intra-Group Policy Cannot be Deleted When the Scaling Group is in the Current State.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112209" : {
					"cause" : "No support on stop policy in this status of scaling group.",
					"desc" : "No support on stop policy in this status of scaling group.",
					"solution" : "Please try later"
				},
				"5112210" : {
					"cause" : "The Intra-Group Policy Cannot be Enabled When the VMs in the Group are Being Migrated.",
					"desc" : "The Intra-Group Policy Cannot be Enabled When the VMs in the Group are Being Migrated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112211" : {
					"cause" : "The option you want to select does not exist.",
					"desc" : "The option you want to select does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112212" : {
					"cause" : "Group Has No Resource Recycled.",
					"desc" : "Group Has No Resource Recycled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112213" : {
					"cause" : "Scaling group is in cool down time.",
					"desc" : "Scaling group is in cool down time.",
					"solution" : "Please try later"
				},
				"5112216" : {
					"cause" : "Policy is in cool down time.",
					"desc" : "Policy is in cool down time.",
					"solution" : "Please try later"
				},
				"5112218" : {
					"cause" : "Vm Start Failed.",
					"desc" : "Vm Start Failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112300" : {
					"cause" : "Binding VLB,Virtual network does not exist.",
					"desc" : "Binding VLB,Virtual network does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5112301" : {
					"cause" : "Binding VLB error.",
					"desc" : "Binding VLB error.",
					"solution" : "Please try later"
				},
				"5112302" : {
					"cause" : "Remove Binding VLB error.",
					"desc" : "Remove Binding VLB error.",
					"solution" : "Please try later"
				},
				"5113001" : {
					"cause" : "The Request is Invalid!",
					"desc" : "The Request is Invalid!",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113002" : {
					"cause" : "Alarm Not Found.",
					"desc" : "Alarm Not Found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113003" : {
					"cause" : "Alarm Already Exists.",
					"desc" : "Alarm Already Exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113100" : {
					"cause" : "System Has Not been Initialed.",
					"desc" : "System Has Not been Initialed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113101" : {
					"cause" : "Get Gather Taskid Failed.",
					"desc" : "Get Gather Taskid Failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113102" : {
					"cause" : "Plugin Instance Not Found.",
					"desc" : "Plugin Instance Not Found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113103" : {
					"cause" : "Plugin Not Registered.",
					"desc" : "Plugin Not Registered.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113104" : {
					"cause" : "Create PlugInstance Failed.",
					"desc" : "Create PlugInstance Failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113105" : {
					"cause" : "PlugInstance Initialed Failed.",
					"desc" : "PlugInstance Initialed Failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113106" : {
					"cause" : "Plugin Class Not Found.",
					"desc" : "Plugin Class Not Found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113107" : {
					"cause" : "The status of Application is not running.",
					"desc" : "The status of Application is not running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113108" : {
					"cause" : "The application does not exist.",
					"desc" : "The application does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113900" : {
					"cause" : "Database error.",
					"desc" : "Database error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113901" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5113902" : {
					"cause" : "The Parameter is Invalid.",
					"desc" : "The Parameter is Invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5120007" : {
					"cause" : "The software package is already installed on the VM.",
					"desc" : "The software package is already installed on the VM.",
					"solution" : "The software package is already installed on the VM."
				},
				"5400001" : {
					"cause" : "The VM is already selected.",
					"desc" : "The VM is already selected.",
					"solution" : "The VM is already selected."
				},
				"5400002" : {
					"cause" : "No VM is selected.",
					"desc" : "No VM is selected.",
					"solution" : "Select a VM first."
				},
				"5400003" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Invalid parameter."
				},
				"5400004" : {
					"cause" : "A software package is being installed on the VM.",
					"desc" : "A software package is being installed on the VM.",
					"solution" : "A software package is being installed on the VM."
				},
				"5400005" : {
					"cause" : "The number of selected VMs exceeds the upper limit (30).",
					"desc" : "The number of selected VMs exceeds the upper limit (30).",
					"solution" : "The number of selected VMs exceeds the upper limit (30)."
				},
				"5400006" : {
					"cause" : "The software package size exceeds the upper limit (4 GB).",
					"desc" : "The software package size exceeds the upper limit (4 GB).",
					"solution" : "The software package size exceeds the upper limit (4 GB)."
				},
				"5411001" : {
					"cause" : "File name is repeated.",
					"desc" : "File name is repeated.",
					"solution" : "Please check file name."
				},
				"5411002" : {
					"cause" : "The ISO file size exceeds the upper limit (6 GB).",
					"desc" : "The ISO file size exceeds the upper limit (6 GB).",
					"solution" : "Please check file size."
				},
				"5411011" : {
					"cause" : "The total number of the ISO reaches the maximum value in the range of system.",
					"desc" : "The total number of the ISO reaches the maximum value in the range of system.",
					"solution" : "Delete unnecessary ISO. Perform this operation with caution."
				},
				"5411012" : {
					"cause" : "The total number of the ISO reaches the maximum value in the range of organization.",
					"desc" : "The total number of the ISO reaches the maximum value in the range of organization.",
					"solution" : "Delete unnecessary ISO. Perform this operation with caution."
				},
				"5411013" : {
					"cause" : "The ISO file has been deleted.",
					"desc" : "The ISO file has been deleted.",
					"solution" : "Please refresh the ISO page and try again."
				},
				"5600600" : {
					"cause" : "File not found.",
					"desc" : "File not found.",
					"solution" : "File not found."
				},
				"5600601" : {
					"cause" : "Error occurred in file transfer.",
					"desc" : "Error occurred in file transfer.",
					"solution" : "Error occurred in file transfer."
				},
				"5600602" : {
					"cause" : "Error occurred in file transfer.",
					"desc" : "Error occurred in file transfer.",
					"solution" : "Error occurred in file transfer."
				},
				"5600603" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"5601006" : {
					"cause" : "The system is busy.",
					"desc" : "The system is busy.",
					"solution" : "The system is busy. Please try later."
				},
				"5602005" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "The application is abnormal. please delete the application."
				},
				"5602007" : {
					"cause" : "Status of object Conflict.",
					"desc" : "Status of object Conflict.",
					"solution" : "Please check the status of the VM."
				},
				"5602096" : {
					"cause" : "The VM Tools is not started.",
					"desc" : "The VM Tools is not started.",
					"solution" : "Please try later or contact your administrator."
				},
				"5602371" : {
					"cause" : "The CPU resource is insufficient.",
					"desc" : "The CPU resource is insufficient.",
					"solution" : "Please try again after the resource is enough."
				},
				"5602372" : {
					"cause" : "The memory resource is insufficient.",
					"desc" : "The memory resource is insufficient.",
					"solution" : "Please try again after the resource is enough."
				},
				"5602374" : {
					"cause" : "alternative hosts are fault.",
					"desc" : "alternative hosts are fault.",
					"solution" : "Please try again after addressing the host exception. If the fault cannot be rectified when the hosts are all powered off, try again after stopping the VMs forcibly."
				},
				"5602375" : {
					"cause" : "alternative hosts are in maintenance mode.",
					"desc" : "alternative hosts are in maintenance mode.",
					"solution" : "Please try again after addressing the host exception. If the fault cannot be rectified when the hosts are all powered off, try again after stopping the VMs forcibly."
				},
				"5602376" : {
					"cause" : "alternative hosts are unavailable.",
					"desc" : "alternative hosts are unavailable.",
					"solution" : "Please try again after addressing the host exception. If the fault cannot be rectified when the hosts are all powered off, try again after stopping the VMs forcibly."
				},
				"5602377" : {
					"cause" : "No alternative host.",
					"desc" : "No alternative host.",
					"solution" : "Handle host exceptions and then try again."
				},
				"5640015" : {
					"cause" : "Failed to connect the system with FusionCompute.",
					"desc" : "Failed to connect the system with FusionCompute.",
					"solution" : "Ensure that the system is connected to the hypervisor properly."
				},
				"5640016" : {
					"cause" : "Failed to connect the system with Unified Hardware Management.",
					"desc" : "Failed to connect the system with Unified Hardware Management.",
					"solution" : "Ensure that the system is connected to the hypervisor properly."
				},
				"5670033" : {
					"cause" : "A task for this object is not complete.",
					"desc" : "A task for this object is not complete.",
					"solution" : "Please try later."
				},
				"5790012" : {
					"cause" : "Binding VM failed.",
					"desc" : "Binding VM failed.",
					"solution" : "Contact Huawei technical support."
				},
				"5790013" : {
					"cause" : "Binding VM not supported with current listener status.",
					"desc" : "Binding VM not supported with current listener status.",
					"solution" : "Contact Huawei technical support."
				},
				"5790014" : {
					"cause" : "Failed to obtain IP addresses during the creation of load balancer VMs.",
					"desc" : "Failed to obtain IP addresses during the creation of load balancer VMs.",
					"solution" : "Contact Huawei technical support."
				},
				"5790015" : {
					"cause" : "The count of VM associated with listener reaches maximum.",
					"desc" : "The count of VM associated with listener reaches maximum.",
					"solution" : "Contact Huawei technical support."
				},
				"5790016" : {
					"cause" : "Listener not exist.",
					"desc" : "Listener not exist.",
					"solution" : "Contact Huawei technical support."
				},
				"5790017" : {
					"cause" : "The listener and the load balancer do not match.",
					"desc" : "The listener and the load balancer do not match.",
					"solution" : "Contact Huawei technical support."
				},
				"5790019" : {
					"cause" : "Current operation not supported for load balancer status.",
					"desc" : "Current operation not supported for load balancer status.",
					"solution" : "Contact Huawei technical support."
				},
				"5790021" : {
					"cause" : "The load balancer does not exist.",
					"desc" : "The load balancer does not exist.",
					"solution" : "Contact Huawei technical support."
				},
				"5790022" : {
					"cause" : "Load balancer status conflict.",
					"desc" : "Load balancer status conflict.",
					"solution" : "Contact Huawei technical support."
				},
				"5790023" : {
					"cause" : "Listener status conflict.",
					"desc" : "Listener status conflict.",
					"solution" : "Contact Huawei technical support."
				},
				"5790034" : {
					"cause" : "Binding VM not supported with current listener status.",
					"desc" : "Binding VM not supported with current listener status.",
					"solution" : "Contact Huawei technical support."
				},
				"5790036" : {
					"cause" : "Deassociating VM from listener not supported for current listener status.",
					"desc" : "Deassociating VM from listener not supported for current listener status.",
					"solution" : "Contact Huawei technical support."
				},
				"5790040" : {
					"cause" : "The number of VMs bound to a load balancer cannot exceed 20.",
					"desc" : "The number of VMs bound to a load balancer cannot exceed 20.",
					"solution" : "Contact Huawei technical support."
				},
				"5790043" : {
					"cause" : "The number of associated VM listeners cannot exceed five.",
					"desc" : "The number of associated VM listeners cannot exceed five.",
					"solution" : "Contact Huawei technical support."
				},
				"5790060" : {
					"cause" : "The load balancer does not match the listener.",
					"desc" : "The load balancer does not match the listener.",
					"solution" : "Contact Huawei technical support."
				},
				"5790061" : {
					"cause" : "A maximum of 100 VM IP addresses can be bound to the load balancer.",
					"desc" : "A maximum of 100 VM IP addresses can be bound to the load balancer.",
					"solution" : "Contact Huawei technical support."
				},
				"5790107" : {
					"cause" : "Database operation failed.",
					"desc" : "Database operation failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"5790108" : {
					"cause" : "Invalid load balancer ID.",
					"desc" : "Invalid load balancer ID.",
					"solution" : "Contact Huawei technical support."
				},
				"5790109" : {
					"cause" : "No listeners.",
					"desc" : "No listeners.",
					"solution" : "Contact Huawei technical support."
				},
				"5790110" : {
					"cause" : "LoadBalance not exist.",
					"desc" : "LoadBalance not exist.",
					"solution" : "Contact Huawei technical support."
				},
				"5790111" : {
					"cause" : "The load balancer status is invalid.",
					"desc" : "The load balancer status is invalid.",
					"solution" : "Contact Huawei technical support."
				},
				"5790112" : {
					"cause" : "No VMs.",
					"desc" : "No VMs.",
					"solution" : "Contact Huawei technical support."
				},
				"5790113" : {
					"cause" : "Listener not exist.",
					"desc" : "Listener not exist.",
					"solution" : "Please contact Huawei technical support."
				},
				"5790114" : {
					"cause" : "The listener and the load balancer do not match.",
					"desc" : "The listener and the load balancer do not match.",
					"solution" : "Please contact Huawei technical support."
				},
				"5800000" : {
					"cause" : "The user does not have the permission to perform the operation.",
					"desc" : "The user does not have the permission to perform the operation.",
					"solution" : "Contact the system administrator to confirm user data."
				},
				"5880002" : {
					"cause" : "Parameters invalid.",
					"desc" : "Parameters invalid.",
					"solution" : "Please modify parameters."
				},
				"5880003" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5880004" : {
					"cause" : "Query DB error.",
					"desc" : "Query DB error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5880005" : {
					"cause" : "VM resource does not exist.",
					"desc" : "VM resource does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5880006" : {
					"cause" : "App resource does not exist.",
					"desc" : "App resource does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5880007" : {
					"cause" : "Delete DB error.",
					"desc" : "Delete DB error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5880009" : {
					"cause" : "vm stutas do not support this operating.",
					"desc" : "vm stutas do not support this operating.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5880008" : {
					"cause" : "Save DB error.",
					"desc" : "Save DB error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
		        "0005200067": {
	                "cause":"Failed to stop the application,please application instance page layout,view deployment details.",
	                "desc":"Failed to stop the application,please application instance page layout,view deployment details.",
	                "solution":"Contact technical support."
	            },
	            "0005200068": {
	                "cause":"Failed to delete the application,please application instance page layout,view deployment details.",
	                "desc":"Failed to delete the application,please application instance page layout,view deployment details.",
	                "solution":"Contact technical support."
	            },
	            "0005200069": {
	                "cause":"Failed to create the application,please application instance page layout,view deployment details.",
	                "desc":"Failed to create the application,please application instance page layout,view deployment details.",
	                "solution":"Contact technical support."
	            },
                "1310083": {
	                "cause":"The current version of FusionCompute dose not support IPv6.",
	                "desc":"The current version of FusionCompute dose not support IPv6.",
	                "solution":"Contact technical support."
	            },
	            "5103105" : {
					"cause" : "Some vm does not exist or status is not running.",
					"desc" : "Some vm does not exist or status is not running.",
					"solution" : "Please select valid vms."
				},
                "1166029": {
	                "cause":"The current version of router dose not support ACL.",
	                "desc":"The current version of router dose not support ACL.",
	                "solution":"Contact technical support."
	            },
                "1184062": {
	                "cause":"The current version of router dose not support VPN.",
	                "desc":"The current version of router dose not support VPN.",
	                "solution":"Contact technical support."
	            },
				"1184063": {
	                "cause":"The IKE policy does not support AES encrytion for L2TP VPN connection.",
	                "desc":"The IKE policy does not support AES encrytion for L2TP VPN connection.",
	                "solution":"Contact technical support."
	            },"0005001111" : {
					"cause" : "Domain Manager cannot add self to VDC as VDC Manager.",
					"desc" : "Domain Manager cannot add self to VDC as VDC Manager.",
					"solution" : "Contact technical support."
	            },
				"1162660": {
	                "cause":"Remote network blocked.",
	                "desc":"Remote network blocked.",
	                "solution":"Contact technical support."
	            },
				"1162661": {
	                "cause":"Wrong password.",
	                "desc":"Wrong password.",
	                "solution":"Contact technical support."
	            },
				"1162662": {
	                "cause":"Disable shiftover failed.",
	                "desc":"Disable shiftover failed.",
	                "solution":"Contact technical support."
	            }
			};
			return exceptionMap;
		})