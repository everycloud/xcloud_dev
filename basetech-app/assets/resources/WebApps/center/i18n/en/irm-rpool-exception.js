define([], function() {
			var exceptionMap = {
				"0000000001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0000010002" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000020": {
                    "cause":"Connect time out, please check the hypervisor IP and port are correct.",
                    "desc":"Connect time out, please check the hypervisor IP and port are correct.",
                    "solution":"Please check the hypervisor parameters are correct."
                 },
				"0000010006" : {
					"cause" : "The request has Invalid parameter.",
					"desc" : "The request has Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
                 "0000010007": {
        	       "cause":"Connect time out, please check the hypervisor IP and port are correct.",
                   "desc":"Connect time out, please check the hypervisor IP and port are correct.",
                   "solution":"Please check the hypervisor parameters are correct."
                },
				"0000010008" : {
					"cause" : "Migrate VMs failed because not all VMs in the same hypervisor.",
					"desc" : "Migrate VMs failed because not all VMs in the same hypervisor.",
					"solution" : "Please input VMs in the same hypervisor."
				},
				"0000010009" : {
					"cause" : "The number of created NICs exceeds the upper limit.",
					"desc" : "The number of created NICs exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0000010010" : {
					"cause" : "The object is not exit in domain.",
					"desc" : "The object is not exit in domain.",
					"solution" : "Please check the object in domain"
				},
				"0000010011" : {
					"cause" : "The type of upload file is not supported.",
					"desc" : "The type of upload file is not supported.",
					"solution" : "Please check the file type you uploaded."
				},
				"0000010012" : {
					"cause" : "The size of uploaded file exceeds the maximum.",
					"desc" : "The size of uploaded file exceeds the maximum.",
					"solution" : "Please check the file you uploaded."
				},
				"0000030004" : {
					"cause" : "The username or password is incorrect.",
					"desc" : "The username or password is incorrect.",
					"solution" : "Please change the username or password."
				},
				"0005101003" : {
					"cause" : "VSA VM template does not exist.",
					"desc" : "VSA VM template does not exist.",
					"solution" : "Please discover VSA VM template."
				},
				"0005104001" : {
					"cause" : "Hypervisor DVS cannot delete.",
					"desc" : "Hypervisor DVS cannot delete.",
					"solution" : "Hypervisor DVS cannot delete."
				},
                "0005104002" : {
					"cause" : "Network Resource Authentication failed.",
					"desc" : "Network Resource Authentication failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000005" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000006" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000007" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000008" : {
					"cause" : "You do not have rights to perform this operation.",
					"desc" : "You do not have rights to perform this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000009" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000010" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000011" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000015" : {
					"cause" : "The FusionManager is disconnected from the UHM. Attempting to connect to the UHM ... Please wait.",
					"desc" : "The FusionManager is disconnected from the UHM. Attempting to connect to the UHM ... Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000016" : {
					"cause" : "The FusionManager is disconnected from the VRM. Attempting to connect to the UHM ... Please wait.",
					"desc" : "The FusionManager is disconnected from the VRM. Attempting to connect to the UHM ... Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000017" : {
					"cause" : "The FusionManager is disconnected from the database. Attempting to connect to the database ... Please wait.",
					"desc" : "The FusionManager is disconnected from the database. Attempting to connect to the database ... Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000018" : {
					"cause" : "The number of requested resources exceeds the upper limit of the resource quota.",
					"desc" : "The number of requested resources exceeds the upper limit of the resource quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000019" : {
					"cause" : "Upload adaptor file failed. The name of this file contains the risky characters.(; | & $ > <)",
					"desc" : "Upload adaptor file failed. The name of this file contains the risky characters.(; | & $ > <)",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000021" : {
					"cause" : "The length of the parameter content exceeds the limit.",
					"desc" : "The length of the parameter content exceeds the limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000022" : {
					"cause" : "The network connection failed. Please ensure that the IP address and port configurations are correct.",
					"desc" : "The network connection failed. Please ensure that the IP address and port configurations are correct.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000023" : {
					"cause" : "The username or password is incorrect. Please check.",
					"desc" : "The username or password is incorrect. Please check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000024" : {
					"cause" : "The VRM version number is incorrect.",
					"desc" : "The VRM version number is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000025" : {
					"cause" : "The operation timed out.",
					"desc" : "The operation timed out.",
					"solution" : "Please contact Huawei technical support."
				},
				"1000026" : {
					"cause" : "A VMware internal error occurred.",
					"desc" : "A VMware internal error occurred.",
					"solution" : "Please log in to the vSphere and check whether the operation is successful."
				},
				"1000027" : {
					"cause" : "The connection status of hypervisor [{0}] is not Successful.",
					"desc" : "The connection status of hypervisor [{0}] is not Successful.",
					"solution" : "Please try again after the hypervisor connection is successful."
				},
				"1000028" : {
					"cause" : "The language setting of hypervisor [{0}] is invalid.",
					"desc" : "The language setting of hypervisor [{0}] is invalid.",
					"solution" : "Set the language for the hypervisor correctly."
				},
				"1000029" : {
					"cause" : "Failed to set the language for hypervisor [{0}].",
					"desc" : "Failed to set the language for hypervisor [{0}].",
					"solution" : "Please contact technical support."
				},
                "1000030": {
                    "cause": "Hypervisor connect failed ,please check the connector status is normal and try again.",
                    "desc": "Hypervisor connect failed ,please check the connector status is normal and try again.",
                    "solution": "Please check the hypervisor parameters are correct."
                },
				"1000031" : {
					"cause" : "The username or password is incorrect.",
					"desc" : "The username or password is incorrect.",
					"solution" : "Enter the correct username or password."
				},
				"1000032" : {
					"cause" : "The account will be locked for 5 minutes because incorrect passwords were entered three times.",
					"desc" : "The account will be locked for 5 minutes because incorrect passwords were entered three times.",
					"solution" : "Please try again 5 minutes later."
				},
				"1000033" : {
					"cause" : "The account is locked.",
					"desc" : "The account is locked.",
					"solution" : "Please wait 5 minutes."
				},
				"1000034" : {
					"cause" : "The username does not exist.",
					"desc" : "The username does not exist.",
					"solution" : "Please change the username."
				},
				"1000102" : {
					"cause" : "Modifying the management subnet ... Please try again later.",
					"desc" : "Modifying the management subnet ... Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000300" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000301" : {
					"cause" : "The user ID is invalid.",
					"desc" : "The user ID is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000302" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000303" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000304" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000305" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000306" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000307" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000308" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000309" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000310" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000311" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000312" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000313" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000500" : {
					"cause" : "The operation object does not exist.",
					"desc" : "The operation object does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000600" : {
					"cause" : "Invalid subnet mask.",
					"desc" : "Invalid subnet mask.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1000700" : {
					"cause" : "Network communication is abnormal.",
					"desc" : "Network communication is abnormal.",
					"solution" : "Please try again later."
				},
				"1001001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001004" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001005" : {
					"cause" : "The system is recovering. Please try again later.",
					"desc" : "The system is recovering. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001006" : {
					"cause" : "The system is busy. Please try again later.",
					"desc" : "The system is busy. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001007" : {
					"cause" : "The system is busy. Please try again later.",
					"desc" : "The system is busy. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001008" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001009" : {
					"cause" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"desc" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001010" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001011" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001012" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1001086" : {
					"cause" : "VM rules conflict,Please check and reconfigure.",
					"desc" : "VM rules conflict,Please check and reconfigure.",
					"solution" : "Please check the rules of the virtual machine configuration and try again."
				},
				"1001087" : {
					"cause" : "Parsing OVF file failed,Please check the format of OVF file.",
					"desc" : "Parsing OVF file failed,Please check the format of OVF file.",
					"solution" : "Please check the format of OVF file."
				},
				"1002000" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002001" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002002" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002004" : {
					"cause" : "The task does not exist.",
					"desc" : "The task does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002005" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "Ensure that the VM exists and try again."
				},
				"1002006" : {
					"cause" : "The VM does not exist.",
					"desc" : "The VM does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002007" : {
					"cause" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"desc" : "The object is executing another task that does not allow concurrent implementation of this operation.",
					"solution" : "Ensure that the object status is correct or try again later."
				},
				"1002013" : {
					"cause" : "Invalid input parameter.",
					"desc" : "Invalid input parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002015" : {
					"cause" : "Invalid input parameter name.",
					"desc" : "Invalid input parameter name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002016" : {
					"cause" : "The disk does not support for disaster VM and contact your administrator please.",
					"desc" : "The disk does not support for disaster VM and contact your administrator please.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002017" : {
					"cause" : "The value range of the upper limit is 1 to 100.",
					"desc" : "The value range of the upper limit is 1 to 100.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002018" : {
					"cause" : "A placeholder VM does not support this operation.",
					"desc" : "A placeholder VM does not support this operation.",
					"solution" : "Contact technical support."
				},
				"1002019" : {
					"cause" : "The entered description is invalid.",
					"desc" : "The entered description is invalid.",
					"solution" : "The entered description is invalid. Please enter a valid value."
				},
				"1002020" : {
					"cause" : "A disaster VM does not support this operation.",
					"desc" : "A disaster VM does not support this operation.",
					"solution" : "Contact technical support."
				},
				"1002022" : {
					"cause" : "Invalid IP address of the input parameter.",
					"desc" : "Invalid IP address of the input parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002023" : {
					"cause" : "Invalid input parameter.",
					"desc" : "Invalid input parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002024" : {
					"cause" : "The entered offset value is invalid.",
					"desc" : "The entered offset value is invalid.",
					"solution" : "The entered offset is invalid. Please enter a valid value."
				},
				"1002025" : {
					"cause" : "The port number is an integer ranging from 1 to 65535.",
					"desc" : "The port number is an integer ranging from 1 to 65535.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002026" : {
					"cause" : "The mobile phone number of the user is incorrect.",
					"desc" : "The mobile phone number of the user is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002027" : {
					"cause" : "The email format of the user is incorrect.",
					"desc" : "The email format of the user is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002028" : {
					"cause" : "The user description length is invalid.",
					"desc" : "The user description length is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002029" : {
					"cause" : "Duplicate username.",
					"desc" : "Duplicate username.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002030" : {
					"cause" : "The role selected by the user does not exist.",
					"desc" : "The role selected by the user does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002031" : {
					"cause" : "Failed to modify the user.",
					"desc" : "Failed to modify the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002032" : {
					"cause" : "The username length is invalid.",
					"desc" : "The username length is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002033" : {
					"cause" : "Incorrect username characters.",
					"desc" : "Incorrect username characters.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002034" : {
					"cause" : "Failed to add the user.",
					"desc" : "Failed to add the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002035" : {
					"cause" : "The current user cannot be deleted.",
					"desc" : "The current user cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002036" : {
					"cause" : "The default super administrator cannot be deleted.",
					"desc" : "The default super administrator cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002037" : {
					"cause" : "Failed to delete the user.",
					"desc" : "Failed to delete the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002038" : {
					"cause" : "Failed to change the password.",
					"desc" : "Failed to change the password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002039" : {
					"cause" : "You are not allowed to change the passwords of other users.",
					"desc" : "You are not allowed to change the passwords of other users.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002040" : {
					"cause" : "The old password is incorrect.",
					"desc" : "The old password is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002041" : {
					"cause" : "The password of the domain user cannot be changed.",
					"desc" : "The password of the domain user cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002042" : {
					"cause" : "The time for changing the password has not reached.",
					"desc" : "The time for changing the password has not reached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002043" : {
					"cause" : "The password has been used.",
					"desc" : "The password has been used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002044" : {
					"cause" : "Failed to reset the password.",
					"desc" : "Failed to reset the password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002045" : {
					"cause" : "Failed to query the user.",
					"desc" : "Failed to query the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002046" : {
					"cause" : "Invalid minimum time interval at which the password can be changed.",
					"desc" : "Invalid minimum time interval at which the password can be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002047" : {
					"cause" : "Invalid maximum password age.",
					"desc" : "Invalid maximum password age.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002048" : {
					"cause" : "Invalid modification for forcibly changing the password.",
					"desc" : "Invalid modification for forcibly changing the password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002049" : {
					"cause" : "Invalid number of times the same password can be used.",
					"desc" : "Invalid number of times the same password can be used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002050" : {
					"cause" : "Invalid password expiry warning.",
					"desc" : "Invalid password expiry warning.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002051" : {
					"cause" : "The password has expired.",
					"desc" : "The password has expired.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002052" : {
					"cause" : "Failed to obtain the password policy.",
					"desc" : "Failed to obtain the password policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002053" : {
					"cause" : "Failed to modify the password policy.",
					"desc" : "Failed to modify the password policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002054" : {
					"cause" : "Invalid IP address.",
					"desc" : "Invalid IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002055" : {
					"cause" : "The domain is too long.",
					"desc" : "The domain is too long.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002056" : {
					"cause" : "The role already exits.",
					"desc" : "The role already exits.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002057" : {
					"cause" : "The role does not exist.",
					"desc" : "The role does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002058" : {
					"cause" : "The role is in use.",
					"desc" : "The role is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002059" : {
					"cause" : "The selected rights do not exist.",
					"desc" : "The selected rights do not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002060" : {
					"cause" : "Failed to create the role.",
					"desc" : "Failed to create the role.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002061" : {
					"cause" : "Invalid role name.",
					"desc" : "Invalid role name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002062" : {
					"cause" : "Invalid role description.",
					"desc" : "Invalid role description.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002063" : {
					"cause" : "Failed to modify the role.",
					"desc" : "Failed to modify the role.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002064" : {
					"cause" : "Invalid host IP address.",
					"desc" : "Invalid host IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002065" : {
					"cause" : "Duplicate host IP address.",
					"desc" : "Duplicate host IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002066" : {
					"cause" : "Invalid BMC IP address.",
					"desc" : "Invalid BMC IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002067" : {
					"cause" : "Invalid BMC username.",
					"desc" : "Invalid BMC username.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002068" : {
					"cause" : "Invalid BMC password.",
					"desc" : "Invalid BMC password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002069" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002070" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002071" : {
					"cause" : "The host is in maintenance mode.",
					"desc" : "The host is in maintenance mode.",
					"solution" : "Exit maintenance mode and try again."
				},
				"1002072" : {
					"cause" : "The operation cannot be performed when the host is in the current state.",
					"desc" : "The operation cannot be performed when the host is in the current state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002073" : {
					"cause" : "The BMC IP address is unreachable.",
					"desc" : "The BMC IP address is unreachable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002074" : {
					"cause" : "The BMC username is empty.",
					"desc" : "The BMC username is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002075" : {
					"cause" : "The BMC password is empty.",
					"desc" : "The BMC password is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002076" : {
					"cause" : "The host has been started.",
					"desc" : "The host has been started.",
					"solution" : "Ensure that the host is in the correct state."
				},
				"1002077" : {
					"cause" : "The host has been stopped.",
					"desc" : "The host has been stopped.",
					"solution" : "Ensure that the host is in the correct state."
				},
				"1002078" : {
					"cause" : "The host has been shut down.",
					"desc" : "The host has been shut down.",
					"solution" : "Start the host before restarting it."
				},
				"1002079" : {
					"cause" : "Make sure that all the VMs are stopped before the host is safely restarted or powered off.",
					"desc" : "Make sure that all the VMs are stopped before the host is safely restarted or powered off.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002080" : {
					"cause" : "The BMC IP address is empty.",
					"desc" : "The BMC IP address is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002081" : {
					"cause" : "Host communication error.",
					"desc" : "Host communication error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002082" : {
					"cause" : "Invalid CPU quantity.",
					"desc" : "Invalid CPU quantity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002083" : {
					"cause" : "Invalid CPU quota.",
					"desc" : "Invalid CPU quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002084" : {
					"cause" : "Invalid CPU upper limit.",
					"desc" : "Invalid CPU upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002085" : {
					"cause" : "Invalid memory size.",
					"desc" : "Invalid memory size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002086" : {
					"cause" : "Invalid VM memory quota.",
					"desc" : "Invalid VM memory quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002087" : {
					"cause" : "Invalid disk ID.",
					"desc" : "Invalid disk ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002088" : {
					"cause" : "Invalid disk size.",
					"desc" : "Invalid disk size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002089" : {
					"cause" : "The number of hard disks on the VM exceeds the maximum.",
					"desc" : "The number of hard disks on the VM exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002090" : {
					"cause" : "The number of VMs to be created in batches exceeded 30.",
					"desc" : "The number of VMs to be created in batches exceeded 30.",
					"solution" : "Contact the administrator."
				},
				"1002091" : {
					"cause" : "The port group, to which the VM NIC belongs, is empty.",
					"desc" : "The port group, to which the VM NIC belongs, is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002092" : {
					"cause" : "The number of NICs on the VM exceeds the maximum.",
					"desc" : "The number of NICs on the VM exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002093" : {
					"cause" : "Invalid VM startup configuration.",
					"desc" : "Invalid VM startup configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002094" : {
					"cause" : "The VM fault processing policy does not conform to specifications.",
					"desc" : "The VM fault processing policy does not conform to specifications.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002095" : {
					"cause" : "The source host cannot be the same as the destination host.",
					"desc" : "The source host cannot be the same as the destination host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002096" : {
					"cause" : "The Tools is not installed or not running.",
					"desc" : "The Tools is not installed or not running.",
					"solution" : "Install and start the Tools on the VM and try again."
				},
				"1002097" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002098" : {
					"cause" : "The server does not exist.",
					"desc" : "The server does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002099" : {
					"cause" : "The specified logical resource cluster does not exist.",
					"desc" : "The specified logical resource cluster does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002100" : {
					"cause" : "VMs exist in the resource cluster.",
					"desc" : "VMs exist in the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002101" : {
					"cause" : "Hosts exist in the resource cluster.",
					"desc" : "Hosts exist in the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002102" : {
					"cause" : "The number of resource clusters exceeds the maximum (32).",
					"desc" : "The number of resource clusters exceeds the maximum (32).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002103" : {
					"cause" : "VMs that cannot be migrated exist on the host or insufficient resources of this cluster.",
					"desc" : "VMs that cannot be migrated exist on the host or insufficient resources of this cluster.",
					"solution" : "Please check and retry."
				},
				"1002104" : {
					"cause" : "A CD-ROM has been mounted to VM.",
					"desc" : "A CD-ROM has been mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002105" : {
					"cause" : "No CD-ROM is mounted to VM.",
					"desc" : "No CD-ROM is mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002106" : {
					"cause" : "Invalid shared URL.",
					"desc" : "Invalid shared URL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002107" : {
					"cause" : "The disk is not attached to the VM.",
					"desc" : "The disk is not attached to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002108" : {
					"cause" : "A CD-ROM has been mounted to VM.",
					"desc" : "A CD-ROM has been mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002109" : {
					"cause" : "No CD-ROM is mounted to VM.",
					"desc" : "No CD-ROM is mounted to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002110" : {
					"cause" : "Invalid VM memory limit.",
					"desc" : "Invalid VM memory limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002111" : {
					"cause" : "The OS type is incorrect.",
					"desc" : "The OS type is incorrect.",
					"solution" : "Select the OS of the correct type."
				},
				"1002112" : {
					"cause" : "The OS version is incorrect.",
					"desc" : "The OS version is incorrect.",
					"solution" : "Select the OS of the correct version."
				},
				"1002113" : {
					"cause" : "The CPU quota of the VM is invalid.",
					"desc" : "The CPU quota of the VM is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002114" : {
					"cause" : "The memory quota of the VM is invalid.",
					"desc" : "The memory quota of the VM is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002115" : {
					"cause" : "Failed to create a VM or add a NIC because of duplicate MAC address.",
					"desc" : "Failed to create a VM or add a NIC because of duplicate MAC address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002116" : {
					"cause" : "Failed to delete the NIC because of a MAC address releasing error.",
					"desc" : "Failed to delete the NIC because of a MAC address releasing error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002117" : {
					"cause" : "Failed to create a VM or add a NIC because of insufficient MAC addresses.",
					"desc" : "Failed to create a VM or add a NIC because of insufficient MAC addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002118" : {
					"cause" : "The domain information of the VM cannot exceed 1024 bytes.",
					"desc" : "The domain information of the VM cannot exceed 1024 bytes.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002119" : {
					"cause" : "The disk is being used by the VM.",
					"desc" : "The disk is being used by the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002120" : {
					"cause" : "The source resource cluster and the destination resource cluster are the same during host migration.",
					"desc" : "The source resource cluster and the destination resource cluster are the same during host migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002121" : {
					"cause" : "Invalid MAC address.",
					"desc" : "Invalid MAC address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002122" : {
					"cause" : "Snapshot is not allowed for shared disks.",
					"desc" : "Snapshot is not allowed for shared disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002123" : {
					"cause" : "The location cannot be empty.",
					"desc" : "The location cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002124" : {
					"cause" : "The storage ID cannot be empty.",
					"desc" : "The storage ID cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002125" : {
					"cause" : "The OS type cannot be empty.",
					"desc" : "The OS type cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002126" : {
					"cause" : "The snapshot status does not allow this operation.",
					"desc" : "The snapshot status does not allow this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002127" : {
					"cause" : "The hard disk slot ID already exists.",
					"desc" : "The hard disk slot ID already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002129" : {
					"cause" : "A resource cluster can contain a maximum of 128 hosts.",
					"desc" : "A resource cluster can contain a maximum of 128 hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002130" : {
					"cause" : "The VM snapshot does not exist.",
					"desc" : "The VM snapshot does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002131" : {
					"cause" : "The VM snapshot does not exist.",
					"desc" : "The VM snapshot does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002132" : {
					"cause" : "A snapshot is being created. You cannot create multiple snapshots for a VM simultaneously.",
					"desc" : "A snapshot is being created. You cannot create multiple snapshots for a VM simultaneously.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002133" : {
					"cause" : "The destination node or resource cluster does not have storage resources required for running the VM.",
					"desc" : "The destination node or resource cluster does not have storage resources required for running the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002134" : {
					"cause" : "The destination node or resource cluster does not have network resources required for running the VM.",
					"desc" : "The destination node or resource cluster does not have network resources required for running the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002135" : {
					"cause" : "The number of VM snapshots exceeds the maximum.",
					"desc" : "The number of VM snapshots exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002136" : {
					"cause" : "The disk is not shared and has been attached to a VM, or the disk is shared but has been attached to four VMs, or the disk status is not allowed to attach to VM.",
					"desc" : "The disk is not shared and has been attached to a VM, or the disk is shared but has been attached to four VMs, or the disk status is not allowed to attach to VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002137" : {
					"cause" : "The number of share disks attached to this VM is more than limit.",
					"desc" : "The number of share disks attached to this VM is more than limit.",
					"solution" : "Please try attaching nonshareable disk to this VM."
				},
				"1002138" : {
					"cause" : "Failed to attach the disk. The disk has been attached to the VM.",
					"desc" : "Failed to attach the disk. The disk has been attached to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002139" : {
					"cause" : "A memory snapshot must be created for a hibernated VM.",
					"desc" : "A memory snapshot must be created for a hibernated VM.",
					"solution" : "Please select Memory snapshot and try again."
				},
				"1002140" : {
					"cause" : "The length of the port group name is invalid.",
					"desc" : "The length of the port group name is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002141" : {
					"cause" : "The disk to be attached does not exist.",
					"desc" : "The disk to be attached does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002142" : {
					"cause" : "A VM to be cloned as a VM template cannot contain any disk.",
					"desc" : "A VM to be cloned as a VM template cannot contain any disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002143" : {
					"cause" : "The operation is not allowed when the resource cluster contains VMs that are in a transient state such as starting or migrating.",
					"desc" : "The operation is not allowed when the resource cluster contains VMs that are in a transient state such as starting or migrating.",
					"solution" : "Ensure that all VMs in the resource cluster are not in a transient state and try again."
				},
				"1002144" : {
					"cause" : "The memory overcommitment function cannot be enabled for the cluster because the cluster contains hosts that use iNICs.",
					"desc" : "The memory overcommitment function cannot be enabled for the cluster because the cluster contains hosts that use iNICs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002145" : {
					"cause" : "The resource cluster contains VMs whose memory quota is smaller than the memory specification.",
					"desc" : "The resource cluster contains VMs whose memory quota is smaller than the memory specification.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002146" : {
					"cause" : "A node that meets the storage requirements for starting the VM does not exist in the specified location.",
					"desc" : "A node that meets the storage requirements for starting the VM does not exist in the specified location.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002147" : {
					"cause" : "A node that meets the network requirements for starting the VM does not exist in the specified location.",
					"desc" : "A node that meets the network requirements for starting the VM does not exist in the specified location.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002148" : {
					"cause" : "Failed to modify the resource cluster database.",
					"desc" : "Failed to modify the resource cluster database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002149" : {
					"cause" : "Memory commitment is enabled for the resource cluster.",
					"desc" : "Memory commitment is enabled for the resource cluster.",
					"solution" : "Disable memory commitment for the resource cluster."
				},
				"1002150" : {
					"cause" : "The status of the destination node does not support migration.",
					"desc" : "The status of the destination node does not support migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002151" : {
					"cause" : "The storage or network of the destination node does not support VM running.",
					"desc" : "The storage or network of the destination node does not support VM running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002152" : {
					"cause" : "The number of source nodes or destination nodes exceeds the maximum concurrent number for migration.",
					"desc" : "The number of source nodes or destination nodes exceeds the maximum concurrent number for migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002153" : {
					"cause" : "The number of VMs that are being migrated in the resource cluster cannot exceed 40.",
					"desc" : "The number of VMs that are being migrated in the resource cluster cannot exceed 40.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002154" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002155" : {
					"cause" : "The specified VM is not a linked clone VM.",
					"desc" : "The specified VM is not a linked clone VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002156" : {
					"cause" : "The system is connecting to the specified storage resource.",
					"desc" : "The system is connecting to the specified storage resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002157" : {
					"cause" : "Incorrect storage type.",
					"desc" : "Incorrect storage type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002158" : {
					"cause" : "Insufficient storage resources.",
					"desc" : "Insufficient storage resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002159" : {
					"cause" : "The storage device does not exist.",
					"desc" : "The storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002160" : {
					"cause" : "The storage device does not exist.",
					"desc" : "The storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002161" : {
					"cause" : "Search criteria error.",
					"desc" : "Search criteria error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002162" : {
					"cause" : "Storage device error.",
					"desc" : "Storage device error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002163" : {
					"cause" : "The storage resource already exists.",
					"desc" : "The storage resource already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002164" : {
					"cause" : "The storage resource does not exist.",
					"desc" : "The storage resource does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002165" : {
					"cause" : "The storage resource is in use.",
					"desc" : "The storage resource is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002166" : {
					"cause" : "The storage IP address is in use.",
					"desc" : "The storage IP address is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002167" : {
					"cause" : "No storage device found.",
					"desc" : "No storage device found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002168" : {
					"cause" : "The storage device is in use.",
					"desc" : "The storage device is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002169" : {
					"cause" : "The storage resource name already exists in the system.",
					"desc" : "The storage resource name already exists in the system.",
					"solution" : "Change the storage resource name and try again."
				},
				"1002170" : {
					"cause" : "Disk type error.",
					"desc" : "Disk type error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002171" : {
					"cause" : "The disk does not exist or has been deleted.",
					"desc" : "The disk does not exist or has been deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002172" : {
					"cause" : "The disk status is not in use.",
					"desc" : "The disk status is not in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002173" : {
					"cause" : "Invalid disk size.",
					"desc" : "Invalid disk size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002174" : {
					"cause" : "Error in querying the number of disks in batches.",
					"desc" : "Error in querying the number of disks in batches.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002175" : {
					"cause" : "The disk is being attached.",
					"desc" : "The disk is being attached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002176" : {
					"cause" : "The subnet does not exist.",
					"desc" : "The subnet does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002177" : {
					"cause" : "Invalid VLAN ID.",
					"desc" : "Invalid VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002178" : {
					"cause" : "The number of subnets cannot exceed 50.",
					"desc" : "The number of subnets cannot exceed 50.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002179" : {
					"cause" : "Invalid subnet address.",
					"desc" : "Invalid subnet address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002180" : {
					"cause" : "Subnet address segment conflict.",
					"desc" : "Subnet address segment conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002181" : {
					"cause" : "Invalid subnet mask.",
					"desc" : "Invalid subnet mask.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002182" : {
					"cause" : "Invalid gateway.",
					"desc" : "Invalid gateway.",
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
				"1002190" : {
					"cause" : "The subnet has been associated with a port group.",
					"desc" : "The subnet has been associated with a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002191" : {
					"cause" : "The primary WINS server for the DHCP server is invalid.",
					"desc" : "The primary WINS server for the DHCP server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002192" : {
					"cause" : "The secondary WINS server for the DHCP server is invalid.",
					"desc" : "The secondary WINS server for the DHCP server is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002193" : {
					"cause" : "The end IP address of the reserved IP address segment cannot be less than the start IP address.",
					"desc" : "The end IP address of the reserved IP address segment cannot be less than the start IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002194" : {
					"cause" : "The reserved IP addresses must be within the subnet.",
					"desc" : "The reserved IP addresses must be within the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002195" : {
					"cause" : "The gateway must be within the subnet.",
					"desc" : "The gateway must be within the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002196" : {
					"cause" : "All VMs in the subnet must be shut down before changing the subnet attributes.",
					"desc" : "All VMs in the subnet must be shut down before changing the subnet attributes.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002197" : {
					"cause" : "Invalid virtual switch type.",
					"desc" : "Invalid virtual switch type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002198" : {
					"cause" : "The VLAN pool cannot be empty.",
					"desc" : "The VLAN pool cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002199" : {
					"cause" : "Snapshot is not allowed for VM template.",
					"desc" : "Snapshot is not allowed for VM template.",
					"solution" : "Please convert the VM Template to VM and try again."
				},
				"1002200" : {
					"cause" : "The value range of the VLAN ID is 2 to 4094.",
					"desc" : "The value range of the VLAN ID is 2 to 4094.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002201" : {
					"cause" : "The linked clone VM is not supported to create snapshot.",
					"desc" : "The linked clone VM is not supported to create snapshot.",
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
				"1002206" : {
					"cause" : "The virtual switch does not exist.",
					"desc" : "The virtual switch does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002207" : {
					"cause" : "The host port cannot be empty.",
					"desc" : "The host port cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002209" : {
					"cause" : "The uplink port does not exist.",
					"desc" : "The uplink port does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002210" : {
					"cause" : "The uplink port is in use.",
					"desc" : "The uplink port is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002211" : {
					"cause" : "The type of the uplink port NIC and that of the virtual switch mismatch.",
					"desc" : "The type of the uplink port NIC and that of the virtual switch mismatch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002212" : {
					"cause" : "The uplink aggregation port does not exist.",
					"desc" : "The uplink aggregation port does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002213" : {
					"cause" : "The uplink aggregation port is in use.",
					"desc" : "The uplink aggregation port is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002214" : {
					"cause" : "Hosts connected to the virtual switch cannot overlap.",
					"desc" : "Hosts connected to the virtual switch cannot overlap.",
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
				"1002217" : {
					"cause" : "The port group exists.",
					"desc" : "The port group exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002218" : {
					"cause" : "The virtual switch has uplink ports.",
					"desc" : "The virtual switch has uplink ports.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002219" : {
					"cause" : "The virtual switch has uplink aggregation ports.",
					"desc" : "The virtual switch has uplink aggregation ports.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002220" : {
					"cause" : "The bandwidth limit cannot be less than 0.",
					"desc" : "The bandwidth limit cannot be less than 0.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002221" : {
					"cause" : "The bandwidth limit must comply with the limit interval.",
					"desc" : "The bandwidth limit must comply with the limit interval.",
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
				"1002227" : {
					"cause" : "The port group, to which the VM NIC belongs, does not exist.",
					"desc" : "The port group, to which the VM NIC belongs, does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002228" : {
					"cause" : "The port group does not belong to this virtual switch.",
					"desc" : "The port group does not belong to this virtual switch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002229" : {
					"cause" : "Failed to delete the port group because it is associated with VMs.",
					"desc" : "Failed to delete the port group because it is associated with VMs.",
					"solution" : "Please delete the virtual machines under this route network, and then try again."
				},
				"1002230" : {
					"cause" : "Failed to associate the port group with the subnet.",
					"desc" : "Failed to associate the port group with the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002231" : {
					"cause" : "Failed to associate the port group with the subnet.",
					"desc" : "Failed to associate the port group with the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002232" : {
					"cause" : "Invalid port group ID.",
					"desc" : "Invalid port group ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002233" : {
					"cause" : "The priority and the bandwidth upper limit must be empty or specified together.",
					"desc" : "The priority and the bandwidth upper limit must be empty or specified together.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002234" : {
					"cause" : "Failed to obtain subnet information.",
					"desc" : "Failed to obtain subnet information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002235" : {
					"cause" : "VMs in the port group are not shut down.",
					"desc" : "VMs in the port group are not shut down.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002236" : {
					"cause" : "All VMs in the subnet must be shut down before modification of the subnet attributes.",
					"desc" : "All VMs in the subnet must be shut down before modification of the subnet attributes.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002237" : {
					"cause" : "The ID of the uplink port is invalid.",
					"desc" : "The ID of the uplink port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002238" : {
					"cause" : "The uplink port is not unique.",
					"desc" : "The uplink port is not unique.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002239" : {
					"cause" : "The status of the uplink port is invalid.",
					"desc" : "The status of the uplink port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002240" : {
					"cause" : "The aggregation policy is invalid.",
					"desc" : "The aggregation policy is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002241" : {
					"cause" : "The ID of the uplink aggregation port is invalid.",
					"desc" : "The ID of the uplink aggregation port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002242" : {
					"cause" : "The name of the uplink aggregation port is invalid.",
					"desc" : "The name of the uplink aggregation port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002243" : {
					"cause" : "The description of the uplink aggregation port is invalid.",
					"desc" : "The description of the uplink aggregation port is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002244" : {
					"cause" : "The number of uplink ports used for aggregation ranges from 1 to 8.",
					"desc" : "The number of uplink ports used for aggregation ranges from 1 to 8.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002245" : {
					"cause" : "Uplink port aggregation cannot be implemented among several iNICs.",
					"desc" : "Uplink port aggregation cannot be implemented among several iNICs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002247" : {
					"cause" : "The uplink port already exists in uplink port aggregation.",
					"desc" : "The uplink port already exists in uplink port aggregation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002248" : {
					"cause" : "Uplink port aggregation cannot be implemented among different types of NICs.",
					"desc" : "Uplink port aggregation cannot be implemented among different types of NICs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002250" : {
					"cause" : "The operation is invalid.",
					"desc" : "The operation is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002251" : {
					"cause" : "The system plane does not exist.",
					"desc" : "The system plane does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002252" : {
					"cause" : "Either the uplink port ID or uplink aggregation port ID can be configured.",
					"desc" : "Either the uplink port ID or uplink aggregation port ID can be configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002253" : {
					"cause" : "The ID of the system plane is invalid.",
					"desc" : "The ID of the system plane is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002255" : {
					"cause" : "The management system plane cannot be deleted.",
					"desc" : "The management system plane cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002256" : {
					"cause" : "VLAN ID conflict.",
					"desc" : "VLAN ID conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002257" : {
					"cause" : "Subnet address conflict.",
					"desc" : "Subnet address conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002258" : {
					"cause" : "Invalid priority.",
					"desc" : "Invalid priority.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002259" : {
					"cause" : "The CNA failed to create the system plane.",
					"desc" : "The CNA failed to create the system plane.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002260" : {
					"cause" : "The bandwidth upper limit is invalid.",
					"desc" : "The bandwidth upper limit is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002261" : {
					"cause" : "The previous task is being executed.",
					"desc" : "The previous task is being executed.",
					"solution" : "Please try again later."
				},
				"1002262" : {
					"cause" : "The name of the virtual switch is invalid.",
					"desc" : "The name of the virtual switch is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002263" : {
					"cause" : "The name of the port group is invalid.",
					"desc" : "The name of the port group is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002264" : {
					"cause" : "The name of the subnet is invalid.",
					"desc" : "The name of the subnet is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002265" : {
					"cause" : "The name of the system plane is invalid.",
					"desc" : "The name of the system plane is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002266" : {
					"cause" : "The name of the system plane is invalid.",
					"desc" : "The name of the system plane is invalid.",
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
				"1002272" : {
					"cause" : "The port used to create the system plane does not exist.",
					"desc" : "The port used to create the system plane does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002273" : {
					"cause" : "The number of storage system ports cannot exceed 4.",
					"desc" : "The number of storage system ports cannot exceed 4.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002274" : {
					"cause" : "The system plane already exists.",
					"desc" : "The system plane already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002275" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002276" : {
					"cause" : "The queried parameter is empty.",
					"desc" : "The queried parameter is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002277" : {
					"cause" : "The indicator identifier or name is empty.",
					"desc" : "The indicator identifier or name is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002278" : {
					"cause" : "The urn is empty.",
					"desc" : "The urn is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002279" : {
					"cause" : "The time format is incorrect.",
					"desc" : "The time format is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002280" : {
					"cause" : "The time granularity is incorrect.",
					"desc" : "The time granularity is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002281" : {
					"cause" : "The resource cluster with the same name already exists.",
					"desc" : "The resource cluster with the same name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002282" : {
					"cause" : "Fail to export VM template because of the space of appointed partition is insufficient.",
					"desc" : "Fail to export VM template because of the space of appointed partition is insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002283" : {
					"cause" : "The host is performing this operation.",
					"desc" : "The host is performing this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002284" : {
					"cause" : "The virtual switch name already exists.",
					"desc" : "The virtual switch name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002285" : {
					"cause" : "The VM cannot be started because it is in the running state.",
					"desc" : "The VM cannot be started because it is in the running state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002286" : {
					"cause" : "The VM is performing this operation.",
					"desc" : "The VM is performing this operation.",
					"solution" : "Please wait for that task to complete."
				},
				"1002287" : {
					"cause" : "The VM has no disk with a serial number of 1.",
					"desc" : "The VM has no disk with a serial number of 1.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002288" : {
					"cause" : "The VM is in the stopped state.",
					"desc" : "The VM is in the stopped state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002289" : {
					"cause" : "The VM is in hibernation.",
					"desc" : "The VM is in hibernation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002290" : {
					"cause" : "The VM cannot be hibernated because it is in the hibernation state.",
					"desc" : "The VM cannot be hibernated because it is in the hibernation state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002291" : {
					"cause" : "The VM is in the stopping state.",
					"desc" : "The VM is in the stopping state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002292" : {
					"cause" : "The resources of the resource cluster to which the source or destination node belongs are insufficient.",
					"desc" : "The resources of the resource cluster to which the source or destination node belongs are insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002293" : {
					"cause" : "The configuration of the memory overcommitment switches for the source and destination nodes must be the same.",
					"desc" : "The configuration of the memory overcommitment switches for the source and destination nodes must be the same.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002294" : {
					"cause" : "Shared disks exist on the VM or the template disk list.",
					"desc" : "Shared disks exist on the VM or the template disk list.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002295" : {
					"cause" : "VMs with attached CD drivers already exist on the host.",
					"desc" : "VMs with attached CD drivers already exist on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002296" : {
					"cause" : "Failed to query the data.",
					"desc" : "Failed to query the data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002297" : {
					"cause" : "The number of previous passwords that cannot be repeated or password expiry warning (days) is incorrect.",
					"desc" : "The number of previous passwords that cannot be repeated or password expiry warning (days) is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002298" : {
					"cause" : "The username or password is incorrect.",
					"desc" : "The username or password is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002299" : {
					"cause" : "Please change the password during the first login.",
					"desc" : "Please change the password during the first login.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002300" : {
					"cause" : "The password has expired. Please change it.",
					"desc" : "The password has expired. Please change it.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002301" : {
					"cause" : "The password is to expire. Do you want to change it?",
					"desc" : "The password is to expire. Do you want to change it?",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002302" : {
					"cause" : "Login failed.",
					"desc" : "Login failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002303" : {
					"cause" : "The user ID is empty.",
					"desc" : "The user ID is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002304" : {
					"cause" : "The password cannot contain the user name or reverse user name.",
					"desc" : "The password cannot contain the user name or reverse user name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002305" : {
					"cause" : "Invalid password length.",
					"desc" : "Invalid password length.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002306" : {
					"cause" : "It contains special characters",
					"desc" : "It contains special characters",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002307" : {
					"cause" : "The role name cannot be empty.",
					"desc" : "The role name cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002308" : {
					"cause" : "The rights list is empty.",
					"desc" : "The rights list is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002309" : {
					"cause" : "A disk with a snapshot taken cannot be attached to other VMs.",
					"desc" : "A disk with a snapshot taken cannot be attached to other VMs.",
					"solution" : "Select a disk for which no snapshot has been taken."
				},
				"1002310" : {
					"cause" : "The disk type does not allow the current operation.",
					"desc" : "The disk type does not allow the current operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002311" : {
					"cause" : "The host failed to take a snapshot of the VM memory.",
					"desc" : "The host failed to take a snapshot of the VM memory.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002312" : {
					"cause" : "This VM cannot be converted or cloned into a VM template because a snapshot has been taken for the VM.",
					"desc" : "This VM cannot be converted or cloned into a VM template because a snapshot has been taken for the VM.",
					"solution" : "Delete the VM snapshot or select a VM that does not have a snapshot taken."
				},
				"1002313" : {
					"cause" : "The host failed to start the VM when using the snapshot to restore the VM.",
					"desc" : "The host failed to start the VM when using the snapshot to restore the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002314" : {
					"cause" : "The computing resources are insufficient when this operation is performed on the VM.",
					"desc" : "The computing resources are insufficient when this operation is performed on the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002315" : {
					"cause" : "The host is scanning storage devices.",
					"desc" : "The host is scanning storage devices.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002316" : {
					"cause" : "The number of data storage devices exceeds 100.",
					"desc" : "The number of data storage devices exceeds 100.",
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
				"1002321" : {
					"cause" : "The number of uplinks that are added to the virtual switch reaches the upper limit.",
					"desc" : "The number of uplinks that are added to the virtual switch reaches the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002322" : {
					"cause" : "The number of VLAN pools reaches the upper limit.",
					"desc" : "The number of VLAN pools reaches the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002323" : {
					"cause" : "The number of port groups reaches the upper limit.",
					"desc" : "The number of port groups reaches the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002324" : {
					"cause" : "The number of port groups reaches the upper limit.",
					"desc" : "The number of port groups reaches the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002325" : {
					"cause" : "If the bandwidth upper limit and priority are both left empty previously, they must be specified together.",
					"desc" : "If the bandwidth upper limit and priority are both left empty previously, they must be specified together.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002326" : {
					"cause" : "Invalid network port mapping parameter.",
					"desc" : "Invalid network port mapping parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002327" : {
					"cause" : "Failed to configure the mapping between CNA NICs.",
					"desc" : "Failed to configure the mapping between CNA NICs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002328" : {
					"cause" : "The uplink port aggregation name already exists.",
					"desc" : "The uplink port aggregation name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002329" : {
					"cause" : "The rates of member ports in the uplink port aggregation are inconsistent.",
					"desc" : "The rates of member ports in the uplink port aggregation are inconsistent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002330" : {
					"cause" : "The uplink port is not a member port of the uplink port aggregation.",
					"desc" : "The uplink port is not a member port of the uplink port aggregation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002331" : {
					"cause" : "The first port in the management uplink port aggregation that the system automatically creates cannot be deleted.",
					"desc" : "The first port in the management uplink port aggregation that the system automatically creates cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002332" : {
					"cause" : "The parameter to be modified must be entered.",
					"desc" : "The parameter to be modified must be entered.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002333" : {
					"cause" : "The uplink port aggregation does not exist on the current host.",
					"desc" : "The uplink port aggregation does not exist on the current host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002334" : {
					"cause" : "Uplink port ID and operation must either exist or disappear at the same time.",
					"desc" : "Uplink port ID and operation must either exist or disappear at the same time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002335" : {
					"cause" : "You can delete only one port from an uplink port aggregation at a time.",
					"desc" : "You can delete only one port from an uplink port aggregation at a time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002336" : {
					"cause" : "Retain at least one port for an uplink port aggregation when deleting ports from the uplink port aggregation.",
					"desc" : "Retain at least one port for an uplink port aggregation when deleting ports from the uplink port aggregation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002337" : {
					"cause" : "You must add at least one port to an uplink port aggregation at a time.",
					"desc" : "You must add at least one port to an uplink port aggregation at a time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002338" : {
					"cause" : "The system plane does not exist on the current host.",
					"desc" : "The system plane does not exist on the current host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002339" : {
					"cause" : "A gateway address cannot be set for the storage link.",
					"desc" : "A gateway address cannot be set for the storage link.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002340" : {
					"cause" : "The subnet address and gateway address are not in the same network segment.",
					"desc" : "The subnet address and gateway address are not in the same network segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002341" : {
					"cause" : "The system plane name already exists.",
					"desc" : "The system plane name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002342" : {
					"cause" : "Tasks of this type cannot be canceled.",
					"desc" : "Tasks of this type cannot be canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002343" : {
					"cause" : "A completed task cannot be canceled.",
					"desc" : "A completed task cannot be canceled.",
					"solution" : "Ensure that the task has not completed before canceling the task."
				},
				"1002344" : {
					"cause" : "Failed to query data. Please retry later.",
					"desc" : "Failed to query data. Please retry later.",
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
				"1002347" : {
					"cause" : "Failed to attach the disk on the VRM.",
					"desc" : "Failed to attach the disk on the VRM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002348" : {
					"cause" : "The operation conflicts with ongoing operations of the object.",
					"desc" : "The operation conflicts with ongoing operations of the object.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002349" : {
					"cause" : "Stop the virtual machine.",
					"desc" : "Stop the virtual machine.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002350" : {
					"cause" : "Failed to send the command on the VRM.",
					"desc" : "Failed to send the command on the VRM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002351" : {
					"cause" : "Failed to send the command on the VRM.",
					"desc" : "Failed to send the command on the VRM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002352" : {
					"cause" : "Failed to connect to a remote device on the host.",
					"desc" : "Failed to connect to a remote device on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002353" : {
					"cause" : "Failed to access a remote file on the host.",
					"desc" : "Failed to access a remote file on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002354" : {
					"cause" : "Failed to access a remote file on the host.",
					"desc" : "Failed to access a remote file on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002355" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Insufficient resources, please try again later."
				},
				"1002356" : {
					"cause" : "Failed to connect to the host on the VRM.",
					"desc" : "Failed to connect to the host on the VRM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002357" : {
					"cause" : "Duplicate NIC name.",
					"desc" : "Duplicate NIC name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002358" : {
					"cause" : "A VM that is being cloned cannot be deleted or started.",
					"desc" : "A VM that is being cloned cannot be deleted or started.",
					"solution" : "Please try again later."
				},
				"1002359" : {
					"cause" : "The port groups, to which the NICs belong, must be on the same DVswitch.",
					"desc" : "The port groups, to which the NICs belong, must be on the same DVswitch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002360" : {
					"cause" : "The storage types of the source data and destination data are different.",
					"desc" : "The storage types of the source data and destination data are different.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002361" : {
					"cause" : "No computing node is found for copying the disk during the cloning.",
					"desc" : "No computing node is found for copying the disk during the cloning.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002362" : {
					"cause" : "Linked cloning is not supported, because the storage type is SAN or LOCAL.",
					"desc" : "Linked cloning is not supported, because the storage type is SAN or LOCAL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002363" : {
					"cause" : "Memory snapshots cannot be created for a stopped VM.",
					"desc" : "Memory snapshots cannot be created for a stopped VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002364" : {
					"cause" : "The Tools is not running.",
					"desc" : "The Tools is not running.",
					"solution" : "Install and start the Tools on the VM and try again."
				},
				"1002365" : {
					"cause" : "Incorrect input parameter.",
					"desc" : "Incorrect input parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002366" : {
					"cause" : "The VM template cannot be found.",
					"desc" : "The VM template cannot be found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002367" : {
					"cause" : "VM template does not exist.",
					"desc" : "VM template does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002368" : {
					"cause" : "Migration failed. A snapshot is being created on the VM or used to restore the VM.",
					"desc" : "Migration failed. A snapshot is being created on the VM or used to restore the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002369" : {
					"cause" : "The host is not in maintenance mode.",
					"desc" : "The host is not in maintenance mode.",
					"solution" : "Ensure that the host is in maintenance mode and try again."
				},
				"1002370" : {
					"cause" : "Failed to migrate all VMs on the host because the host is faulty.",
					"desc" : "Failed to migrate all VMs on the host because the host is faulty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002371" : {
					"cause" : "Insufficient CPU resources, please check CPU cores, CPU reserved and CPU limit.",
					"desc" : "Insufficient CPU resources, please check CPU cores, CPU reserved and CPU limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002372" : {
					"cause" : "Insufficient memory, please check memory cores, memory reserved and memory limit.",
					"desc" : "Insufficient memory, please check memory cores, memory reserved and memory limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002373" : {
					"cause" : "The number of created NICs on the host exceeds the upper limit.",
					"desc" : "The number of created NICs on the host exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002374" : {
					"cause" : "All the hosts in the selected cluster are abnormal.",
					"desc" : "All the hosts in the selected cluster are abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002375" : {
					"cause" : "All the hosts in the selected cluster are in maintenance mode.",
					"desc" : "All the hosts in the selected cluster are in maintenance mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002376" : {
					"cause" : "All the hosts in the selected cluster are unavailable.",
					"desc" : "All the hosts in the selected cluster are unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002377" : {
					"cause" : "No available host.",
					"desc" : "No available host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002378" : {
					"cause" : "The host is busy. Please try again later.",
					"desc" : "The host is busy. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002379" : {
					"cause" : "Only one NIC on the VM can be assigned with a gateway.",
					"desc" : "Only one NIC on the VM can be assigned with a gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002380" : {
					"cause" : "The host does not belong to the cluster.",
					"desc" : "The host does not belong to the cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002381" : {
					"cause" : "This operation is not allowed on the VM.",
					"desc" : "This operation is not allowed on the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002382" : {
					"cause" : "The VM is being cloned and does not support disk operations.",
					"desc" : "The VM is being cloned and does not support disk operations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002383" : {
					"cause" : "Inconsistent VM storage status.",
					"desc" : "Inconsistent VM storage status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002384" : {
					"cause" : "The data storage to which the VM belongs does not support snapshot creation.",
					"desc" : "The data storage to which the VM belongs does not support snapshot creation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002385" : {
					"cause" : "The current version does not support this USB controller type.",
					"desc" : "The current version does not support this USB controller type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002386" : {
					"cause" : "The controller of this type has been added to the VM.",
					"desc" : "The controller of this type has been added to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002387" : {
					"cause" : "The controller of this type is not added to the VM.",
					"desc" : "The controller of this type is not added to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002388" : {
					"cause" : "USB devices exist in the USB controller.",
					"desc" : "USB devices exist in the USB controller.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002389" : {
					"cause" : "The USB device has been allocated.",
					"desc" : "The USB device has been allocated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002390" : {
					"cause" : "The VM and USB device are on different hosts.",
					"desc" : "The VM and USB device are on different hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002391" : {
					"cause" : "The USB device is on another host.",
					"desc" : "The USB device is on another host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002392" : {
					"cause" : "The USB device is not allocated.",
					"desc" : "The USB device is not allocated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002393" : {
					"cause" : "The VM to which USB devices have been mounted cannot be migrated.",
					"desc" : "The VM to which USB devices have been mounted cannot be migrated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002394" : {
					"cause" : "The controller of this type is unavailable on the VM.",
					"desc" : "The controller of this type is unavailable on the VM.",
					"solution" : "Please add the controller of this type first."
				},
				"1002395" : {
					"cause" : "can't bind more usb to the VM.",
					"desc" : "can't bind more usb to the VM.",
					"solution" : "Please remove idle usb."
				},
				"1002396" : {
					"cause" : "The VM and the USB device are carried on different hosts.",
					"desc" : "The VM and the USB device are carried on different hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002397" : {
					"cause" : "The host providing the USB device is unavailable.",
					"desc" : "The host providing the USB device is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002398" : {
					"cause" : "A memory snapshot cannot be taken for a VM to which a USB device is attached.",
					"desc" : "A memory snapshot cannot be taken for a VM to which a USB device is attached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002399" : {
					"cause" : "The memory of the VM to which a USB device is attached cannot be backed up.",
					"desc" : "The memory of the VM to which a USB device is attached cannot be backed up.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002400" : {
					"cause" : "Send a message to the host failed.",
					"desc" : "Send a message to the host failed.",
					"solution" : "Please contact technical support engineers."
				},
				"1002401" : {
					"cause" : "The host returns the operation failed.",
					"desc" : "The host returns the operation failed.",
					"solution" : "Please contact technical support engineers."
				},
				"1002402" : {
					"cause" : "The modification can take effect only after the VM is restarted.",
					"desc" : "The modification can take effect only after the VM is restarted.",
					"solution" : "Restart the VM."
				},
				"1002403" : {
					"cause" : "The password is invalid.",
					"desc" : "The password is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002404" : {
					"cause" : "The workgroup information is invalid.",
					"desc" : "The workgroup information is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002405" : {
					"cause" : "The workgroup and domain cannot coexist.",
					"desc" : "The workgroup and domain cannot coexist.",
					"solution" : "Enter valid parameters."
				},
				"1002406" : {
					"cause" : "The domain name or the host name of the domain is invalid.",
					"desc" : "The domain name or the host name of the domain is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002407" : {
					"cause" : "The NIC name is invalid.",
					"desc" : "The NIC name is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002408" : {
					"cause" : "The IP address or subnet mask is invalid.",
					"desc" : "The IP address or subnet mask is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002409" : {
					"cause" : "The NIC SN is invalid.",
					"desc" : "The NIC SN is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002410" : {
					"cause" : "The gateway information is invalid.",
					"desc" : "The gateway information is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002411" : {
					"cause" : "The DNS information is invalid.",
					"desc" : "The DNS information is invalid.",
					"solution" : "Enter valid parameters."
				},
				"1002412" : {
					"cause" : "The number of customized NICs is different from that of the VM NICs.",
					"desc" : "The number of customized NICs is different from that of the VM NICs.",
					"solution" : "Enter valid parameters."
				},
				"1002413" : {
					"cause" : "The customized OS type is different from that used by the VM.",
					"desc" : "The customized OS type is different from that used by the VM.",
					"solution" : "Enter valid parameters."
				},
				"1002414" : {
					"cause" : "The protocol for mounting the CD-ROM drive is invalid.",
					"desc" : "The protocol for mounting the CD-ROM drive is invalid.",
					"solution" : "Use a valid protocol to mount the CD-ROM drive."
				},
				"1002415" : {
					"cause" : "The VM is busy. Please try later.",
					"desc" : "The VM is busy. Please try later.",
					"solution" : "Please try later."
				},
				"1002416" : {
					"cause" : "Failed to query the task failure causes.",
					"desc" : "Failed to query the task failure causes.",
					"solution" : "Please log in to the vSphere and check whether the VM hibernation is successful."
				},
				"1002417" : {
					"cause" : "The system does not support cascading of VRM nodes.",
					"desc" : "The system does not support cascading of VRM nodes.",
					"solution" : "Please contact the system administrator."
				},
				"1002418" : {
					"cause" : "User authentication failed.",
					"desc" : "User authentication failed.",
					"solution" : "Please contact the system administrator."
				},
				"1002419" : {
					"cause" : "The target cluster does not exist.",
					"desc" : "The target cluster does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1002420" : {
					"cause" : "The storage cluster which associated this host do not allow stopping this host.",
					"desc" : "The storage cluster which associated this host do not allow stopping this host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002421" : {
					"cause" : "The storage cluster which associated this host do not allow restarting this host.",
					"desc" : "The storage cluster which associated this host do not allow restarting this host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002422" : {
					"cause" : "The server has not been added to FusionManager.",
					"desc" : "The server has not been added to FusionManager.",
					"solution" : "Please add the server to FusionManager and try again."
				},
				"1002423" : {
					"cause" : "This operation is not allowed when the disk is in the current state.",
					"desc" : "This operation is not allowed when the disk is in the current state.",
					"solution" : "Contact the system administrator."
				},
				"1002425" : {
					"cause" : "Task at this stage is not allowed to cancel.",
					"desc" : "Task at this stage is not allowed to cancel.",
					"solution" : "Please contact Huawei technical support."
				},
				"1002426" : {
					"cause" : "The task has been canceled, unable to perform this operation.",
					"desc" : "The task has been canceled, unable to perform this operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"1002427" : {
					"cause" : "Failure to cancel the task.",
					"desc" : "Failure to cancel the task.",
					"solution" : "Please contact Huawei technical support."
				},
				"1002428" : {
					"cause" : "User canceled task.",
					"desc" : "User canceled task.",
					"solution" : "Check that the task is reasonably canceled."
				},
				"1002429" : {
					"cause" : "The current Affected by Snapshot settings of the VM disks conflict with the settings of the disks on the VM when the snapshot is being created. Please check the configurations.",
					"desc" : "The current Affected by Snapshot settings of the VM disks conflict with the settings of the disks on the VM when the snapshot is being created. Please check the configurations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002430" : {
					"cause" : "Failed to discover the cluster because no available data center is found.",
					"desc" : "Failed to discover the cluster because no available data center is found.",
					"solution" : "Check that the hypervisor user's session is active or the cluster to be discovered is managed in the data center."
				},
				"1002431" : {
					"cause" : "The shared disk is already attached to the maximum number of VMs.",
					"desc" : "The shared disk is already attached to the maximum number of VMs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002432" : {
					"cause" : "Failed to restore the VM.",
					"desc" : "Failed to restore the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002433" : {
					"cause" : "The host providing the VM does not meet requirements for starting the VM after the VM is restored using the snapshot. Migrate the VM to a proper host first.",
					"desc" : "The host providing the VM does not meet requirements for starting the VM after the VM is restored using the snapshot. Migrate the VM to a proper host first.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002434" : {
					"cause" : "The snapshot is not created for the VM.",
					"desc" : "The snapshot is not created for the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002435" : {
					"cause" : "The VM position is not compatible with the disk. Attach failed.",
					"desc" : "The VM position is not compatible with the disk. Attach failed",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002440" : {
					"cause" : "The host in its current state does not support this operation. Please try again later.",
					"desc" : "The host in its current state does not support this operation. Please try again later.",
					"solution" : "Please check and retry."
				},
				"1002441" : {
					"cause" : "This operation is not allowed because a storage-related task is in progress on the host.",
					"desc" : "This operation is not allowed because a storage-related task is in progress on the host.",
					"solution" : "Please check and retry."
				},
				"1002442" : {
					"cause" : "The VM cannot be migrated because a CD/DVD-ROM or tools drive has been mounted to VM.",
					"desc" : "The VM cannot be migrated because a CD/DVD-ROM or tools drive has been mounted to VM.",
					"solution" : "Please try again after unmounting the CD/DVD-ROM."
				},
				"1002443" : {
					"cause" : "The host is not ready. Please try again later.",
					"desc" : "The host is not ready. Please try again later.",
					"solution" : "Please check and retry."
				},
				"1002445" : {
					"cause" : "Create VM consistency snapshot fail because VM status is abnormal.",
					"desc" : "Create VM consistency snapshot fail because VM status is abnormal.",
					"solution" : "Please recheck VM status."
				},
				"1002450" : {
					"cause" : "The storage type of datastore does not support this kind of DISK (a non-persistent disk or with snapshot).",
					"desc" : "The storage type of datastore does not support this kind of DISK (a non-persistent disk or with snapshot).",
					"solution" : "Please contact Huawei technical support."
				},
				"1002451" : {
					"cause" : "Disks witch less than 4 GB space cannot be expanded.",
					"desc" : "Disks witch less than 4 GB space cannot be expanded.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002452" : {
					"cause" : "The shared disk does not support the modification to the IO upper limit.",
					"desc" : "The shared disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002453" : {
					"cause" : "The current status of the disk does not support the modification to the IO upper limit.",
					"desc" : "The current status of the disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002454" : {
					"cause" : "The disk IO upper limit is being modified and The current status of the disk does not support the modification to the IO upper limit.",
					"desc" : "The disk IO upper limit is being modified and The current status of the disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002455" : {
					"cause" : "The modification to the IO upper limit is failed.",
					"desc" : "The modification to the IO upper limit is failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002456" : {
					"cause" : "The disk does not support the modification to the IO upper limit.",
					"desc" : "The disk does not support the modification to the IO upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002457" : {
					"cause" : "Hosts mount the CD reached the maximum number of virtual machines.",
					"desc" : "Hosts mount the CD reached the maximum number of virtual machines.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002458" : {
					"cause" : "This snapshot is not allowed to be deleted because it contains delta disks.",
					"desc" : "This snapshot is not allowed to be deleted because it contains delta disks.",
					"solution" : "Delete VMs created using this snapshot and try again."
				},
				"1002459" : {
					"cause" : "This operation is not allowed because the target VM is a rapidly copied VM.",
					"desc" : "This operation is not allowed because the target VM is a rapidly copied VM.",
					"solution" : "Contact technical support."
				},
				"1002460" : {
					"cause" : "Disk format failed.",
					"desc" : "Disk format failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002461" : {
					"cause" : "Disk migration fails, the migration process may be provided by the virtual machine state changes, host or network status changes due to abnormalities.",
					"desc" : "Disk migration fails, the migration process may be provided by the virtual machine state changes, host or network status changes due to abnormalities.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002462" : {
					"cause" : "Disks with less than 4 GB space cannot be expanded.",
					"desc" : "Disks with less than 4 GB space cannot be expanded.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002463" : {
					"cause" : "Raw device mapping data store can only create a raw device mapping disks. The disk is a shared disk and has all the data store space, the configuration mode is normal, and the disk is not affected by snapshots and is persistent.",
					"desc" : "Raw device mapping data store can only create a raw device mapping disks. The disk is a shared disk and has all the data store space, the configuration mode is normal, and the disk is not affected by snapshots and is persistent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002464" : {
					"cause" : "Cannot modify Non-uniform memory access switch of the cluster because of it has one or more VMs in starting or migrating status.",
					"desc" : "Cannot modify Non-uniform memory access switch of the cluster because of it has one or more VMs in starting or migrating status.",
					"solution" : "Please try again later."
				},
				"1002465" : {
					"cause" : "This disk cannot be bound to the VM.",
					"desc" : "This disk cannot be bound to the VM.",
					"solution" : "Add the disk to a VDC and try again later."
				},
				"1002466" : {
					"cause" : "Set IOweight in host failed.",
					"desc" : "Set IOweight in host failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002467" : {
					"cause" : "The disk has not been bound to a VM.",
					"desc" : "The disk has not been bound to a VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002479" : {
					"cause" : "The OS in the VM does not support hibernation.",
					"desc" : "The OS in the VM does not support hibernation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002489" : {
					"cause" : "Failed to suspend the VM.",
					"desc" : "Failed to suspend the VM.",
					"solution" : "Please contact your administrator."
				},
				"1002491" : {
					"cause" : "A task of the VM disk is in progress. Try again after the task is complete.",
					"desc" : "A task of the VM disk is in progress. Try again after the task is complete.",
					"solution" : "Contact technical support."
				},
				"1002499" : {
					"cause" : "the VM has its CPU or memory hot swapped.",
					"desc" : "the VM has its CPU or memory hot swapped.",
					"solution" : "Do not create snapshots before the VM restarts if the VM has its CPU or memory hot swapped."
				},
				"1002500" : {
					"cause" : "This VM cannot be cloned into a VM template offline because a snapshot has been taken for the VM.",
					"desc" : "This VM cannot be cloned into a VM template offline because a snapshot has been taken for the VM.",
					"solution" : "Delete the VM snapshot or select a VM that does not have a snapshot taken."
				},
				"1002501" : {
					"cause" : "A VRM domain supports a maximum of 16 VRMs.",
					"desc" : "A VRM domain supports a maximum of 16 VRMs.",
					"solution" : "A VRM domain supports a maximum of 16 VRMs."
				},
				"1002502" : {
					"cause" : "The URL length is out of range.",
					"desc" : "The URL length is out of range.",
					"solution" : "The URL length is out of range. Please enter a valid URL."
				},
				"1002503" : {
					"cause" : "The entered size of the memory for hot add must be a multiple of 1024 MB.",
					"desc" : "The entered size of the memory for hot add must be a multiple of 1024 MB.",
					"solution" : "The entered size of the memory for hot add must be a multiple of 1024 MB. Please enter a correct memory value."
				},
				"1002504" : {
					"cause" : "The template cannot be converted to a VM because it contains a linked clone.",
					"desc" : "The template cannot be converted to a VM because it contains a linked clone.",
					"solution" : "Please select another VM template."
				},
				"1002505" : {
					"cause" : "The graphics card cannot be detached from the VM that is in the current state.",
					"desc" : "The graphics card cannot be detached from the VM that is in the current state.",
					"solution" : "The graphics card cannot be detached from the VM that is in the current state. Please try again later."
				},
				"1002506" : {
					"cause" : "Memory disks do not support migration.",
					"desc" : "Memory disks do not support migration.",
					"solution" : "Please select a disk that can be migrated."
				},
				"1002507" : {
					"cause" : "Failed to communicate with the other VRM.",
					"desc" : "Failed to communicate with the other VRM.",
					"solution" : "Please contact the system administrator."
				},
				"1002508" : {
					"cause" : "Failed to migrate because the VM contains shared disks.",
					"desc" : "Failed to migrate because the VM contains shared disks.",
					"solution" : "Please contact the system administrator."
				},
				"1002509" : {
					"cause" : "The VM or template does not exist.",
					"desc" : "The VM or template does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1002510" : {
					"cause" : "VMware VM does not support delay delete.",
					"desc" : "VMware VM does not support delay delete.",
					"solution" : "Please check delay parameters and try again."
				},
				"1002580" : {
					"cause" : "A linked clone cannot be repaired.",
					"desc" : "A linked clone cannot be repaired.",
					"solution" : "Please check and try again."
				},
				"1002600" : {
					"cause" : "This operation cannot be completed as the host is in use by the object such as VM .",
					"desc" : "This operation cannot be completed as the host is in use by the object such as VM .",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003000" : {
					"cause" : "The VLAN ID is out of range (1 to 4096).",
					"desc" : "The VLAN ID is out of range (1 to 4096).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003001" : {
					"cause" : "The IP address format or range is invalid or the end address is less than the start address (The IP address must be in the format of A.B.C.D, where A, B, C, and D range from 0 to 255.).",
					"desc" : "The IP address format or range is invalid or the end address is less than the start address (The IP address must be in the format of A.B.C.D, where A, B, C, and D range from 0 to 255.).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003002" : {
					"cause" : "The address prefix is out of range (0 to 32).",
					"desc" : "The address prefix is out of range (0 to 32).",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003003" : {
					"cause" : "The gateway address that comprises the IPv4 subnet address and IPv4 prefix is invalid.",
					"desc" : "The gateway address that comprises the IPv4 subnet address and IPv4 prefix is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003004" : {
					"cause" : "The IP addresses overlap existing ones.",
					"desc" : "The IP addresses overlap existing ones.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003005" : {
					"cause" : "The object does not exist.",
					"desc" : "The object does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003006" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003007" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003008" : {
					"cause" : "The object already exists.",
					"desc" : "The object already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003009" : {
					"cause" : "The object has been associated.",
					"desc" : "The object has been associated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003010" : {
					"cause" : "The object has been disassociated.",
					"desc" : "The object has been disassociated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003011" : {
					"cause" : "The IP address pool does not exist.",
					"desc" : "The IP address pool does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003012" : {
					"cause" : "Incorrect IP address pool type.",
					"desc" : "Incorrect IP address pool type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003013" : {
					"cause" : "Failed to deploy the IP address pool.",
					"desc" : "Failed to deploy the IP address pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003014" : {
					"cause" : "The IP address pool is in use.",
					"desc" : "The IP address pool is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003015" : {
					"cause" : "The port binding policy is in use.",
					"desc" : "The port binding policy is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003016" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003017" : {
					"cause" : "The service port is disconnected from the switch port.",
					"desc" : "The service port is disconnected from the switch port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003018" : {
					"cause" : "Failed to create the VLAN.",
					"desc" : "Failed to create the VLAN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003019" : {
					"cause" : "Failed to obtain the service port number.",
					"desc" : "Failed to obtain the service port number.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003020" : {
					"cause" : "Failed to obtain the switch port number.",
					"desc" : "Failed to obtain the switch port number.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003021" : {
					"cause" : "Failed to set the SAN device address and network information.",
					"desc" : "Failed to set the SAN device address and network information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003022" : {
					"cause" : "The VLAN area for the VLAN pool conflicts with another one.",
					"desc" : "The VLAN area for the VLAN pool conflicts with another one.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003023" : {
					"cause" : "The VLAN is in use.",
					"desc" : "The VLAN is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003024" : {
					"cause" : "A VLANIF conflict occurred.",
					"desc" : "A VLANIF conflict occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003025" : {
					"cause" : "The subnet to be configured is in use.",
					"desc" : "The subnet to be configured is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003026" : {
					"cause" : "The subnet to be configured is in a VLAN pool.",
					"desc" : "The subnet to be configured is in a VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003027" : {
					"cause" : "The aggregation switch does not exist.",
					"desc" : "The aggregation switch does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003028" : {
					"cause" : "Operation failed because the object is being created, modified or deleted.",
					"desc" : "Operation failed because the object is being created, modified or deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003030" : {
					"cause" : "The host is powered on or inaccessible.",
					"desc" : "The host is powered on or inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003031" : {
					"cause" : "The host is powered off or inaccessible.",
					"desc" : "The host is powered off or inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003032" : {
					"cause" : "The host is powered off or inaccessible.",
					"desc" : "The host is powered off or inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003033" : {
					"cause" : "Failed to delete the SAN device storage pool because a LUN exists.",
					"desc" : "Failed to delete the SAN device storage pool because a LUN exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003034" : {
					"cause" : "The VLAN is in use.",
					"desc" : "The VLAN is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003035" : {
					"cause" : "Incorrect next-hop address.",
					"desc" : "Incorrect next-hop address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003036" : {
					"cause" : "The port is not an uplink one.",
					"desc" : "The port is not an uplink one.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003037" : {
					"cause" : "The port to be added or deleted is in use.",
					"desc" : "The port to be added or deleted is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003038" : {
					"cause" : "The configuration policy of the host is used.",
					"desc" : "The configuration policy of the host is used.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"solution" : "Please try again later."
				},
				"1003044" : {
					"cause" : "The virtual firewall does not exist.",
					"desc" : "The virtual firewall does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1003045" : {
					"cause" : "The switch has routing services configured.",
					"desc" : "The switch has routing services configured.",
					"solution" : "Delete the routing services on the switch."
				},
				"1003046" : {
					"cause" : "The protol is invalid.",
					"desc" : "The protol is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003047" : {
					"cause" : "The port range is invalid.",
					"desc" : "The port range is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003048" : {
					"cause" : "The Priority of ACL has already exist.",
					"desc" : "The Priority of ACL has already exist.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1003054" : {
					"cause" : "The device does not exist.",
					"desc" : "The device does not exist.",
					"solution" : "Please refresh the device list."
				},
				"1003055" : {
					"cause" : "The password does not meet the requirements.",
					"desc" : "The password does not meet the requirements.",
					"solution" : "Please check the user information to the password requirements section."
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
				"1003059" : {
					"cause" : "There is no available resource.",
					"desc" : "There is no available resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003060" : {
					"cause" : "Failed to import resource configurations.",
					"desc" : "Failed to import resource configurations.",
					"solution" : "Modify the resource configuration file."
				},
				"1003061" : {
					"cause" : "There is no enough service set resource.",
					"desc" : "There is no enough service set resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003062" : {
					"cause" : "The device is unreachable.",
					"desc" : "The device is unreachable.",
					"solution" : "Check the device network."
				},
				"1003063" : {
					"cause" : "Some parameters are not configured.",
					"desc" : "Some parameters are not configured.",
					"solution" : "Check the device configuration information."
				},
				"1003064" : {
					"cause" : "Save ip, user name, password and other information to UHM failed.",
					"desc" : "Save ip, user name, password and other information to UHM failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1003065" : {
					"cause" : "Firewall resource file error。",
					"desc" : "Firewall resource file error。",
					"solution" : "Please check the firewall resource file。"
				},
				"1003066" : {
					"cause" : "Firewall resource file is not xml type。",
					"desc" : "Firewall resource file is not xml type。",
					"solution" : "Please check the firewall resource file。"
				},
				"1003067" : {
					"cause" : "The file is larger than the maximum value。",
					"desc" : "The file is larger than the maximum value。",
					"solution" : "Please check the firewall resource file。"
				},
				"1005000" : {
					"cause" : "The name already exists.",
					"desc" : "The name already exists.",
					"solution" : "Please enter another name."
				},
				"1005002" : {
					"cause" : "An exception occurred in file operations.",
					"desc" : "An exception occurred in file operations.",
					"solution" : "Please contact Huawei technical support."
				},
				"1005003" : {
					"cause" : "The data store operation is invalid.",
					"desc" : "The data store operation is invalid.",
					"solution" : "Please contact Huawei technical support."
				},
				"1005004" : {
					"cause" : "The action is not allowed in this state.",
					"desc" : "The action is not allowed in this state.",
					"solution" : "Please contact Huawei technical support."
				},
				"1005005" : {
					"cause" : "The name is invalid",
					"desc" : "The name is invalid",
					"solution" : "Enter valid parameters."
				},
				"1005006" : {
					"cause" : "Another operation involving the object is currently in progress.",
					"desc" : "Another operation involving the object is currently in progress.",
					"solution" : "Please try again later."
				},
				"1005007" : {
					"cause" : "This operation is not supported during an upgrade.",
					"desc" : "This operation is not supported during an upgrade.",
					"solution" : "Please try again later."
				},
				"1010001" : {
					"cause" : "Failed to delete the host because it is in use.",
					"desc" : "Failed to delete the host because it is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010002" : {
					"cause" : "No new host found.",
					"desc" : "No new host found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010012" : {
					"cause" : "Failed to perform batch operations on the hosts.",
					"desc" : "Failed to perform batch operations on the hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010013" : {
					"cause" : "You cannot power on, power off, restart, and isolate the host where the management VM is located.",
					"desc" : "You cannot power on, power off, restart, and isolate the host where the management VM is located.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010014" : {
					"cause" : "You cannot safely power off, safely restart, or enter or exit the maintenance mode on a host that is not in a virtualized resource cluster.",
					"desc" : "You cannot safely power off, safely restart, or enter or exit the maintenance mode on a host that is not in a virtualized resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010015" : {
					"cause" : "Power-on failed because the host does not exist.",
					"desc" : "Power-on failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010016" : {
					"cause" : "Power-on failed because the host does not exist.",
					"desc" : "Power-on failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010017" : {
					"cause" : "Power-off failed because the host does not exist.",
					"desc" : "Power-off failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010018" : {
					"cause" : "Power-off failed because the host does not exist.",
					"desc" : "Power-off failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010019" : {
					"cause" : "Restart failed because the host does not exist.",
					"desc" : "Restart failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010020" : {
					"cause" : "Restart failed because the host does not exist.",
					"desc" : "Restart failed because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010021" : {
					"cause" : "Failed to enter the maintenance mode because the host does not exist.",
					"desc" : "Failed to enter the maintenance mode because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010022" : {
					"cause" : "Failed to exit the maintenance mode because the host does not exist.",
					"desc" : "Failed to exit the maintenance mode because the host does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010023" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010024" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010025" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010026" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010027" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010028" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010029" : {
					"cause" : "Failed to enter the maintenance mode because the system is abnormal.",
					"desc" : "Failed to enter the maintenance mode because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010030" : {
					"cause" : "Failed to exit the maintenance mode because the system is abnormal.",
					"desc" : "Failed to exit the maintenance mode because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010031" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010032" : {
					"cause" : "Failed to power on the host because the system is abnormal.",
					"desc" : "Failed to power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010033" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010034" : {
					"cause" : "Failed to power off the host because the system is abnormal.",
					"desc" : "Failed to power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010035" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010036" : {
					"cause" : "Failed to restart the host because the system is abnormal.",
					"desc" : "Failed to restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010037" : {
					"cause" : "Failed to enter maintenance mode on the server.",
					"desc" : "Failed to enter maintenance mode on the server.",
					"solution" : "Migrate or stop VMs running on the server before entering maintenance mode."
				},
				"1010038" : {
					"cause" : "Failed to exit the maintenance mode because the system is abnormal.",
					"desc" : "Failed to exit the maintenance mode because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010039" : {
					"cause" : "The host is in maintenance mode, the operation cannot be repeated.",
					"desc" : "The host is in maintenance mode, the operation cannot be repeated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010040" : {
					"cause" : "The host cannot exit the maintenance mode. Please try again later.",
					"desc" : "The host cannot exit the maintenance mode. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010041" : {
					"cause" : "Failed to safely power off the host because the host is not in the hypervisor.",
					"desc" : "Failed to safely power off the host because the host is not in the hypervisor.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010042" : {
					"cause" : "Failed to safely power off the host because the system is abnormal.",
					"desc" : "Failed to safely power off the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010043" : {
					"cause" : "Failed to safely power on the host because the system is abnormal.",
					"desc" : "Failed to safely power on the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010044" : {
					"cause" : "Failed to safely restart the host because the host is not in the hypervisor.",
					"desc" : "Failed to safely restart the host because the host is not in the hypervisor.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010045" : {
					"cause" : "Failed to safely restart the host because the system is abnormal.",
					"desc" : "Failed to safely restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010046" : {
					"cause" : "Failed to safely restart the host because the system is abnormal.",
					"desc" : "Failed to safely restart the host because the system is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010047" : {
					"cause" : "Power on all or power off all task exist.",
					"desc" : "Power on all or power off all task exist.",
					"solution" : "Please try again later."
				},
				"1010048" : {
					"cause" : "Power on all or power off all task exist.",
					"desc" : "Power on all or power off all task exist.",
					"solution" : "Please try again later."
				},
				"1010049" : {
					"cause" : "Start applications failed.",
					"desc" : "Start applications failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010050" : {
					"cause" : "Stop applications failed.",
					"desc" : "Stop applications failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010051" : {
					"cause" : "Start FusionStorage service failed.",
					"desc" : "Start FusionStorage service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010052" : {
					"cause" : "Stop FusionStorage service failed.",
					"desc" : "Stop FusionStorage service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010053" : {
					"cause" : "Power on host failed.",
					"desc" : "Power on host failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010054" : {
					"cause" : "Power off host failed.",
					"desc" : "Power off host failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010055" : {
					"cause" : "The device IP address is unreachable.",
					"desc" : "The device IP address is unreachable.",
					"solution" : "Please contact Huawei technical support."
				},
				"1010056" : {
					"cause" : "The username or security name or password is incorrect.",
					"desc" : "The username or security name or password is incorrect.",
					"solution" : "Please contact Huawei technical support."
				},
				"1010057" : {
					"cause" : "Failed to discover the device.",
					"desc" : "Failed to discover the device.",
					"solution" : "Please contact technical support."
				},
				"1010058" : {
					"cause" : "The IP address or Mac address of the device already exists in the system.",
					"desc" : "The IP address or Mac address of the device already exists in the system.",
					"solution" : "Please ensure that the device is not already added."
				},
				"1010059" : {
					"cause" : "The entered number of blades is greater than the actual number.",
					"desc" : "The entered number of blades is greater than the actual number.",
					"solution" : "Please ensure that the entered number of disks is correct."
				},
				"1010060" : {
					"cause" : "Failed to connect to the host using this BMC IP address.",
					"desc" : "Failed to connect to the host using this BMC IP address.",
					"solution" : "Please ensure that the BMC IP address is correct."
				},
				"1010061" : {
					"cause" : "The device is already added.",
					"desc" : "The device is already added.",
					"solution" : "Please contact technical support."
				},
				"1010062" : {
					"cause" : "The file format for adding devices in batches is invalid.",
					"desc" : "The file format for adding devices in batches is invalid.",
					"solution" : "Please download the latest batch adding template."
				},
				"1010063" : {
					"cause" : "The parameters in the batch adding template are invalid.",
					"desc" : "The parameters in the batch adding template are invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"1010064" : {
					"cause" : "The BMC username or password is incorrect, the account is locked, or the in-use IPMI version is incorrect.",
					"desc" : "The BMC username or password is incorrect, the account is locked, or the in-use IPMI version is incorrect.",
					"solution" : "Ensure that the BMC username and password and the IPMI version are all correct."
				},
				"1010065" : {
					"cause" : "The OS username or password is incorrect or the account has been locked.",
					"desc" : "The OS username or password is incorrect or the account has been locked.",
					"solution" : "Specify valid OS username and password of the host."
				},
				"1010066" : {
					"cause" : "The template for adding devices in batches is empty.",
					"desc" : "The template for adding devices in batches is empty.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"1010067" : {
					"cause" : "The parameters in the batch adding template are invalid.",
					"desc" : "The parameters in the batch adding template are invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"1010068" : {
					"cause" : "The parameters in the batch adding template are invalid.",
					"desc" : "The parameters in the batch adding template are invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"1010069" : {
					"cause" : "Failed to set host startup options, please check the selected host status is normal.",
					"desc" : "Failed to set host startup options, please check the selected host status is normal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010071" : {
					"cause" : "Failed to add some blades.",
					"desc" : "Failed to add some blades.",
					"solution" : "Please contact Huawei technical support."
				},
				"1010072" : {
					"cause" : "The host is not powered on or its management IP address is unreachable.",
					"desc" : "The host is not powered on or its management IP address is unreachable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010073" : {
					"cause" : "The name of the device already exists in the system.",
					"desc" : "The name of the device already exists in the system.",
					"solution" : "Specify valid parameters."
				},
				"1010074" : {
					"cause" : "Obtaining device specifications...Please try again later.",
					"desc" : "Obtaining device specifications...Please try again later.",
					"solution" : "Please try again later."
				},
				"1010075" : {
					"cause" : "The name of the zone already exists in the system.",
					"desc" : "The name of the zone already exists in the system.",
					"solution" : "Specify valid parameters."
				},
				"1010076" : {
					"cause" : "Complete server information is required when the server is not in the Ready state.",
					"desc" : "Complete server information is required when the server is not in the Ready state.",
					"solution" : "Please enter complete server information."
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
				"1010079" : {
					"cause" : "The basic information is invalid.",
					"desc" : "The basic information is invalid.",
					"solution" : "Specify valid batch adding template parameters."
				},
				"1010080" : {
					"cause" : "The host is not connected to any hypervisor.",
					"desc" : "The host is not connected to any hypervisor.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010081" : {
					"cause" : "The host is not contained in the cluster.",
					"desc" : "The host is not contained in the cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010082" : {
					"cause" : "Servers of this type do not support specification refresh.",
					"desc" : "Servers of this type do not support specification refresh.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1010088" : {
					"cause" : "The OS username or password is incorrect or the account has been locked or the SSH connection timed out.",
					"desc" : "The OS username or password is incorrect or the account has been locked or the SSH connection timed out.",
					"solution" : "Specify valid OS username and password of the host."
				},
				"1010089" : {
					"cause" : "There were no hosts available to complete the specified operation.",
					"desc" : "There were no hosts available to complete the specified operation.",
					"solution" : "Please contact the system administrator."
				},
				"1010090" : {
					"cause" : "The operation could not be performed because the HA software is not installed on this host.",
					"desc" : "The operation could not be performed because the HA software is not installed on this host.",
					"solution" : "Please install the HA software on this host."
				},
				"1010091" : {
					"cause" : "Cannot perform operation as the host is running in emergency mode.",
					"desc" : "Cannot perform operation as the host is running in emergency mode.",
					"solution" : "Please contact the system administrator."
				},
				"1010092" : {
					"cause" : "The specified host is disabled and cannot be re-enabled until after it has rebooted.",
					"desc" : "The specified host is disabled and cannot be re-enabled until after it has rebooted.",
					"solution" : "Please reboot the host."
				},
				"1010093" : {
					"cause" : "Not enough host memory is available to perform this operation.",
					"desc" : "Not enough host memory is available to perform this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010094" : {
					"cause" : "Host monitor account is needed to be set.",
					"desc" : "Host monitor account is needed to be set.",
					"solution" : "Please set host monitor account."
				},
				"1010095" : {
					"cause" : "Failed to start VMs using storage resources on the data store.",
					"desc" : "Failed to start VMs using storage resources on the data store.",
					"solution" : "Please refer to suggestions for handling subtasks."
				},
				"1010096" : {
					"cause" : "Failed to disable active/standby switchover or stop the CNAs.",
					"desc" : "Failed to disable active/standby switchover or stop the CNAs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010097" : {
					"cause" : "Failed to stop VMs using storage resources on the data store.",
					"desc" : "Failed to stop VMs using storage resources on the data store.",
					"solution" : "Please refer to suggestions for handling subtasks."
				},
				"1010099" : {
					"cause" : "The operation timed out.",
					"desc" : "The operation timed out.",
					"solution" : "Please contract your administrator or view the help manual."
				},
				"1010100" : {
					"cause" : "The BMC username or password is incorrect or the account has been locked.",
					"desc" : "The BMC username or password is incorrect or the account has been locked.",
					"solution" : "Specify valid BMC username and password of the host."
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
				"1010123" : {
					"cause" : "Get the third LCNA fail.",
					"desc" : "Get the third LCNA fail.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010124" : {
					"cause" : "Add host to cluster fail.",
					"desc" : "Add host to cluster fail.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010125" : {
					"cause" : "Host is not found in management cluster.",
					"desc" : "Host is not found in management cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010126" : {
					"cause" : "Associate host fail.",
					"desc" : "Associate host fail.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010127" : {
					"cause" : "Expand host is not ready.",
					"desc" : "Expand host is not ready.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1010128" : {
					"cause" : "Incorrect BMC address.",
					"desc" : "Incorrect BMC address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1011090" : {
					"cause" : "Set SNMP Trap fails.",
					"desc" : "Set SNMP Trap fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020001" : {
					"cause" : "The switch cannot be found. Check whether the MAC address of the switch is correct.",
					"desc" : "The switch cannot be found. Check whether the MAC address of the switch is correct.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020002" : {
					"cause" : "No new switch found.",
					"desc" : "No new switch found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020003" : {
					"cause" : "The obtained switch information is empty.",
					"desc" : "The obtained switch information is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020004" : {
					"cause" : "Switch operation error.",
					"desc" : "Switch operation error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020005" : {
					"cause" : "Switch query error.",
					"desc" : "Switch query error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020006" : {
					"cause" : "Switch port query error.",
					"desc" : "Switch port query error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020008" : {
					"cause" : "Invalid routing parameter.",
					"desc" : "Invalid routing parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020009" : {
					"cause" : "Invalid IP address.",
					"desc" : "Invalid IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020010" : {
					"cause" : "Invalid subnet mask format.",
					"desc" : "Invalid subnet mask format.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020011" : {
					"cause" : "Invalid gateway address format.",
					"desc" : "Invalid gateway address format.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020012" : {
					"cause" : "Failed to create the route on the switch.",
					"desc" : "Failed to create the route on the switch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020013" : {
					"cause" : "Failed to query the route on the switch.",
					"desc" : "Failed to query the route on the switch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020014" : {
					"cause" : "Failed to delete the route on the switch.",
					"desc" : "Failed to delete the route on the switch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020015" : {
					"cause" : "Failed to modify the route on the switch.",
					"desc" : "Failed to modify the route on the switch.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020016" : {
					"cause" : "Invalid uplink port parameter.",
					"desc" : "Invalid uplink port parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020017" : {
					"cause" : "The switch port cannot be empty.",
					"desc" : "The switch port cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020018" : {
					"cause" : "The VLAN ID conflicts with the system reserved VLAN ID.",
					"desc" : "The VLAN ID conflicts with the system reserved VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020019" : {
					"cause" : "Failed to query the uplink port.",
					"desc" : "Failed to query the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020020" : {
					"cause" : "Failed to configure the uplink port.",
					"desc" : "Failed to configure the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020021" : {
					"cause" : "Failed to modify the uplink port.",
					"desc" : "Failed to modify the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020022" : {
					"cause" : "Failed to query the uplink port.",
					"desc" : "Failed to query the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020023" : {
					"cause" : "Failed to delete the uplink port.",
					"desc" : "Failed to delete the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020024" : {
					"cause" : "Failed to configure the uplink port.",
					"desc" : "Failed to configure the uplink port.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020025" : {
					"cause" : "Failed to delete the uplink port.",
					"desc" : "Failed to delete the uplink port.",
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
				"1020031" : {
					"cause" : "Only one uplink port can be configured.",
					"desc" : "Only one uplink port can be configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020034" : {
					"cause" : "The VLAN ID does not exist in the VLAN pool. Please create a VLAN pool that contains the VLAN ID.",
					"desc" : "The VLAN ID does not exist in the VLAN pool. Please create a VLAN pool that contains the VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020035" : {
					"cause" : "Configuration failed. The number of trunks on the switch exists the upper limit.",
					"desc" : "Configuration failed. The number of trunks on the switch exists the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020036" : {
					"cause" : "Configuration failed. The number of ports in the trunk exists the upper limit.",
					"desc" : "Configuration failed. The number of ports in the trunk exists the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020037" : {
					"cause" : "The IP address starting with 127 is invalid. This IP address is reserved as a loopback address. Please enter a valid value ranging from 1 to 223.",
					"desc" : "The IP address starting with 127 is invalid. This IP address is reserved as a loopback address. Please enter a valid value ranging from 1 to 223.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020038" : {
					"cause" : "Failed to send the configuration due to a switch port error.",
					"desc" : "Failed to send the configuration due to a switch port error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020039" : {
					"cause" : "Network addresses or broadcasting addresses are not supported.",
					"desc" : "Network addresses or broadcasting addresses are not supported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020040" : {
					"cause" : "Operation failed.",
					"desc" : "Operation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1020050" : {
					"cause" : "The zone not access switches.",
					"desc" : "The zone not access switches.",
					"solution" : "Please access switch and try again."
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
				"1020053" : {
					"cause" : "The connection failed or the SSH service has not been configured on the switch.",
					"desc" : "The connection failed or the SSH service has not been configured on the switch.",
					"solution" : "Please contact Huawei technical support."
				},
				"1020054" : {
					"cause" : "An uplink port you configured is not on the switch.",
					"desc" : "An uplink port you configured is not on the switch.",
					"solution" : "Please enter exist uplink port."
				},
				"1020055" : {
					"cause" : "Failed to log in to the SAN device.",
					"desc" : "Failed to log in to the SAN device.",
					"solution" : "Ensure that the specified parameters are correct."
				},
				"1029997" : {
					"cause" : "Version not correct.Check connect params.",
					"desc" : "Version not correct.Check connect params.",
					"solution" : "Please check your version or connect params correct."
				},
				"1029998" : {
					"cause" : "SNMP connect params error.",
					"desc" : "SNMP connect params error.",
					"solution" : "Please input correct SNMP params."
				},
				"1029999" : {
					"cause" : "SSH connect params error.",
					"desc" : "SSH connect params error.",
					"solution" : "Please input correct SSH params."
				},
				"1030000" : {
					"cause" : "Failed to delete the device because services have been deployed on it.",
					"desc" : "Failed to delete the device because services have been deployed on it.",
					"solution" : "Please delete the services deployed on the device first."
				},
				"1030001" : {
					"cause" : "The selected storage device does not exist.",
					"desc" : "The selected storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1030002" : {
					"cause" : "The selected storage device does not exist.",
					"desc" : "The selected storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1030003" : {
					"cause" : "The selected storage device does not exist.",
					"desc" : "The selected storage device does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1030004" : {
					"cause" : "Incorrect SAN device disk capacity information.",
					"desc" : "Incorrect SAN device disk capacity information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1030005" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1030006" : {
					"cause" : "The user has the importing task, please wait.",
					"desc" : "The user has the importing task, please wait.",
					"solution" : "Please try again later."
				},
				"1030007" : {
					"cause" : "The size of the batch import template exceeds 2 MB.",
					"desc" : "The size of the batch import template exceeds 2 MB.",
					"solution" : "Downsize the batch import template."
				},
				"1030008" : {
					"cause" : "The number of devices to be imported exceeds 500.",
					"desc" : "The number of devices to be imported exceeds 500.",
					"solution" : "Reduce the number of devices to be imported in batches."
				},
				"1030083" : {
					"cause" : "Servers in this resource state do not support specification refresh, please try again later.",
					"desc" : "Servers in this resource state do not support specification refresh, please try again later.",
					"solution" : "Please try again later."
				},
				"1030084" : {
					"cause" : "Host has been powered off, you cannot do this operation.",
					"desc" : "Host has been powered off, you cannot do this operation.",
					"solution" : "Please try again later."
				},
				"1040001" : {
					"cause" : "Invalid resource cluster parameters.",
					"desc" : "Invalid resource cluster parameters.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040002" : {
					"cause" : "No host is selected.",
					"desc" : "No host is selected.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040003" : {
					"cause" : "Storage device configuration is empty.",
					"desc" : "Storage device configuration is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040004" : {
					"cause" : "Network configuration is empty.",
					"desc" : "Network configuration is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040005" : {
					"cause" : "The host is used by another resource cluster.",
					"desc" : "The host is used by another resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040006" : {
					"cause" : "Failed to add the resource cluster due to a database error.",
					"desc" : "Failed to add the resource cluster due to a database error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040007" : {
					"cause" : "Failed to modify the resource cluster due to a database error.",
					"desc" : "Failed to modify the resource cluster due to a database error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040008" : {
					"cause" : "The storage device is used by another resource cluster.",
					"desc" : "The storage device is used by another resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040009" : {
					"cause" : "The length of the resource cluster name exceeds the limit.",
					"desc" : "The length of the resource cluster name exceeds the limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040011" : {
					"cause" : "The number of resource clusters exceeds 64.",
					"desc" : "The number of resource clusters exceeds 64.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040012" : {
					"cause" : "Failed to modify advanced configuration for the resource cluster.",
					"desc" : "Failed to modify advanced configuration for the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040013" : {
					"cause" : "Failed to provision the resource cluster.",
					"desc" : "Failed to provision the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040014" : {
					"cause" : "Failed to delete the resource cluster.",
					"desc" : "Failed to delete the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040015" : {
					"cause" : "Disconnected with the hypervisor.",
					"desc" : "Disconnected with the hypervisor.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040016" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040017" : {
					"cause" : "Resource cluster operation failed due to a host error.",
					"desc" : "Resource cluster operation failed due to a host error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040018" : {
					"cause" : "Resource cluster operation failed due to a storage resource error.",
					"desc" : "Resource cluster operation failed due to a storage resource error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040019" : {
					"cause" : "The resource cluster is not a planned one and cannot be provisioned.",
					"desc" : "The resource cluster is not a planned one and cannot be provisioned.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040020" : {
					"cause" : "The management resource cluster cannot be deleted.",
					"desc" : "The management resource cluster cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040021" : {
					"cause" : "Failed to delete the resource cluster because provisioning, capacity expansion, or capacity reduction is performed on the resource cluster.",
					"desc" : "Failed to delete the resource cluster because provisioning, capacity expansion, or capacity reduction is performed on the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040022" : {
					"cause" : "Failed to delete the VM because the VM cannot be verified.",
					"desc" : "Failed to delete the VM because the VM cannot be verified.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040023" : {
					"cause" : "Failed to delete the resource cluster because the resource cluster contains VMs.",
					"desc" : "Failed to delete the resource cluster because the resource cluster contains VMs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040024" : {
					"cause" : "The resource cluster does not exist.",
					"desc" : "The resource cluster does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040025" : {
					"cause" : "Failed to delete the resource cluster because the resource cluster is occupied by the user resource quota.",
					"desc" : "Failed to delete the resource cluster because the resource cluster is occupied by the user resource quota.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040026" : {
					"cause" : "Do not perform other operations until the resource cluster provisioning is complete.",
					"desc" : "Do not perform other operations until the resource cluster provisioning is complete.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040027" : {
					"cause" : "Wait until the capacity expansion is complete.",
					"desc" : "Wait until the capacity expansion is complete.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040028" : {
					"cause" : "Capacity reduction failed because provisioning, capacity expansion, or capacity reduction is performed on the resource cluster.",
					"desc" : "Capacity reduction failed because provisioning, capacity expansion, or capacity reduction is performed on the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040029" : {
					"cause" : "Capacity reduction failed. Please select a host from the resource cluster.",
					"desc" : "Capacity reduction failed. Please select a host from the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040030" : {
					"cause" : "Capacity reduction failed because the management VM is located on selected host.",
					"desc" : "Capacity reduction failed because the management VM is located on selected host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040031" : {
					"cause" : "Capacity reduction failed. Please set the host to maintenance state again, or contact technical support.",
					"desc" : "Capacity reduction failed. Please set the host to maintenance state again, or contact technical support.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040033" : {
					"cause" : "Capacity expansion failed because resource cluster provisioning, capacity expansion, capacity reduction, or deletion is being performed.",
					"desc" : "Capacity expansion failed because resource cluster provisioning, capacity expansion, capacity reduction, or deletion is being performed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040034" : {
					"cause" : "Failed to delete the resource cluster because the resource cluster contains network resource.",
					"desc" : "Failed to delete the resource cluster because the resource cluster contains network resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040035" : {
					"cause" : "Capacity expansion failed because the resource cluster does not contain hosts.",
					"desc" : "Capacity expansion failed because the resource cluster does not contain hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040036" : {
					"cause" : "When creating or modifying the resource cluster, the user does not have any management domain.",
					"desc" : "When creating or modifying the resource cluster, the user does not have any management domain.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040037" : {
					"cause" : "The domain on which the user does not operation rights is selected.",
					"desc" : "The domain on which the user does not operation rights is selected.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040038" : {
					"cause" : "Only deletion is allowed because the last deletion or provisioning operation of the resource cluster failed.",
					"desc" : "Only deletion is allowed because the last deletion or provisioning operation of the resource cluster failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040039" : {
					"cause" : "Only the same capacity reduction is allowed because the last capacity reduction of the resource cluster failed.",
					"desc" : "Only the same capacity reduction is allowed because the last capacity reduction of the resource cluster failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040042" : {
					"cause" : "Hosts at the different locations cannot be added.",
					"desc" : "Hosts at the different locations cannot be added.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040043" : {
					"cause" : "Storage devices at the different locations cannot be added.",
					"desc" : "Storage devices at the different locations cannot be added.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040044" : {
					"cause" : "The resource cluster license is not verified.",
					"desc" : "The resource cluster license is not verified.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040045" : {
					"cause" : "The host name already exists.",
					"desc" : "The host name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040046" : {
					"cause" : "The raw device resource cluster cannot be created because the BMC IP address pool does not exist on the raw device.",
					"desc" : "The raw device resource cluster cannot be created because the BMC IP address pool does not exist on the raw device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040047" : {
					"cause" : "The cluster cannot be delivered or expanded because the applied resources exceed the limit allowed by the license.",
					"desc" : "The cluster cannot be delivered or expanded because the applied resources exceed the limit allowed by the license.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040048" : {
					"cause" : "The cluster cannot be delivered or expanded because the license file has expired.",
					"desc" : "The cluster cannot be delivered or expanded because the license file has expired.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040049" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040050" : {
					"cause" : "Parameter error.",
					"desc" : "Parameter error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040051" : {
					"cause" : "A resource cluster exists in the domain.",
					"desc" : "A resource cluster exists in the domain.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040052" : {
					"cause" : "The domain does not exist.",
					"desc" : "The domain does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040053" : {
					"cause" : "Capacity reduction failed because the subnet is used by a port group.",
					"desc" : "Capacity reduction failed because the subnet is used by a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040054" : {
					"cause" : "Capacity reduction failed because the VLAN pool is used by a port group.",
					"desc" : "Capacity reduction failed because the VLAN pool is used by a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040055" : {
					"cause" : "Storage resource does not exist.",
					"desc" : "Storage resource does not exist.",
					"solution" : "Please choose valid storage resource."
				},
				"1040056" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please choose valid storage resource."
				},
				"1040057" : {
					"cause" : "The automation level parameter for resource scheduling is invalid.",
					"desc" : "The automation level parameter for resource scheduling is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040058" : {
					"cause" : "The migration threshold parameter for resource scheduling is invalid.",
					"desc" : "The migration threshold parameter for resource scheduling is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040059" : {
					"cause" : "The rule type of resource scheduling is invalid.",
					"desc" : "The rule type of resource scheduling is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040060" : {
					"cause" : "The name of the resource scheduling rule is invalid.",
					"desc" : "The name of the resource scheduling rule is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040061" : {
					"cause" : "The operation type of the resource scheduling rule is invalid.",
					"desc" : "The operation type of the resource scheduling rule is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040062" : {
					"cause" : "The resource scheduling rule name already exists.",
					"desc" : "The resource scheduling rule name already exists.",
					"solution" : "Please use another name which is not being used."
				},
				"1040063" : {
					"cause" : "The VM cannot be added to the resource scheduling rule of the cluster because the VM does not belong to this cluster.",
					"desc" : "The VM cannot be added to the resource scheduling rule of the cluster because the VM does not belong to this cluster.",
					"solution" : "Please use another VM which belongs to this cluster."
				},
				"1040064" : {
					"cause" : "You cannot modify or delete the resource scheduling rule because it does not belong to the destination cluster.",
					"desc" : "You cannot modify or delete the resource scheduling rule because it does not belong to the destination cluster.",
					"solution" : "Please use another resource scheduling rule which belongs to this cluster."
				},
				"1040065" : {
					"cause" : "The resource scheduling rule ID is empty.",
					"desc" : "The resource scheduling rule ID is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040066" : {
					"cause" : "The number of VMs in the DRS anti-affinity rules exceeds the number of hosts in the cluster or 2.",
					"desc" : "The number of VMs in the DRS anti-affinity rules exceeds the number of hosts in the cluster or 2.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040067" : {
					"cause" : "The number of DRS rules cannot exceed 20.",
					"desc" : "The number of DRS rules cannot exceed 20.",
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
				"1040079" : {
					"cause" : "The cluster cannot be provisioned or expanded because the license file has expired.",
					"desc" : "The cluster cannot be provisioned or expanded because the license file has expired.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040080" : {
					"cause" : "Failed to reduce the capacity of all hosts in the cluster because the cluster contains VMs.",
					"desc" : "Failed to reduce the capacity of all hosts in the cluster because the cluster contains VMs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040081" : {
					"cause" : "You cannot perform capacity expansion for management node and common host at the same time.",
					"desc" : "You cannot perform capacity expansion for management node and common host at the same time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040082" : {
					"cause" : "If the cluster contains hosts that adopt the iNIC straight-through mode, memory overcommitment must be disabled.",
					"desc" : "If the cluster contains hosts that adopt the iNIC straight-through mode, memory overcommitment must be disabled.",
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
				"1040087" : {
					"cause" : "Failed to enable memory overcommitment because the cluster does not have sufficient host physical memory.",
					"desc" : "Failed to enable memory overcommitment because the cluster does not have sufficient host physical memory.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040088" : {
					"cause" : "Applications are being created in the cluster. Do not perform other operations.",
					"desc" : "Applications are being created in the cluster. Do not perform other operations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040089" : {
					"cause" : "Failed to modify basic information about the resource cluster.",
					"desc" : "Failed to modify basic information about the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040090" : {
					"cause" : "The log has been deleted.",
					"desc" : "The log has been deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040091" : {
					"cause" : "The resource group for computing resource scheduling does not exist.",
					"desc" : "The resource group for computing resource scheduling does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040092" : {
					"cause" : "Duplicate rule name of computing resource scheduling.",
					"desc" : "Duplicate rule name of computing resource scheduling.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040093" : {
					"cause" : "The board layout information file does not exist.",
					"desc" : "The board layout information file does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040094" : {
					"cause" : "The pre-installation is not complete.",
					"desc" : "The pre-installation is not complete.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040095" : {
					"cause" : "Status conflict occurred during management cluster provisioning.",
					"desc" : "Status conflict occurred during management cluster provisioning.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040096" : {
					"cause" : "Status conflict occurred during management cluster clearing.",
					"desc" : "Status conflict occurred during management cluster clearing.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040097" : {
					"cause" : "The cluster name already exists.",
					"desc" : "The cluster name already exists.",
					"solution" : "Please enter a new cluster name and try again later."
				},
				"1040098" : {
					"cause" : "A non-FusionStorage management cluster cannot be deleted.",
					"desc" : "A non-FusionStorage management cluster cannot be deleted.",
					"solution" : "Please contact technical support."
				},
				"1040099" : {
					"cause" : "Only one data store can be deleted at a time.",
					"desc" : "Only one data store can be deleted at a time.",
					"solution" : "Please select only one data store."
				},
				"1040100" : {
					"cause" : "The data store cannot be deleted because it has in-use disks.",
					"desc" : "The data store cannot be deleted because it has in-use disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040101" : {
					"cause" : "Only storage pools of the same type can be selected from the same cluster.",
					"desc" : "Only storage pools of the same type can be selected from the same cluster.",
					"solution" : "Please select storage pools of the same storage type."
				},
				"1040102" : {
					"cause" : "The resource type is empty.",
					"desc" : "The resource type is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040103" : {
					"cause" : "The resource type is invalid.",
					"desc" : "The resource type is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040104" : {
					"cause" : "The resource name is empty.",
					"desc" : "The resource name is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040105" : {
					"cause" : "The VM does not belong to this cluster.",
					"desc" : "The VM does not belong to this cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040106" : {
					"cause" : "The host does not belong to this cluster.",
					"desc" : "The host does not belong to this cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040107" : {
					"cause" : "The resource group type does not match the resource type.",
					"desc" : "The resource group type does not match the resource type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040108" : {
					"cause" : "The resource group name already exists.",
					"desc" : "The resource group name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040109" : {
					"cause" : "The selected resource group member type is empty.",
					"desc" : "The selected resource group member type is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040110" : {
					"cause" : "The new resource group member type is invalid.",
					"desc" : "The new resource group member type is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040111" : {
					"cause" : "The resource is already added to the resource group.",
					"desc" : "The resource is already added to the resource group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040112" : {
					"cause" : "The resource group is empty.",
					"desc" : "The resource group is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040113" : {
					"cause" : "The VM group is already added to a rule.",
					"desc" : "The VM group is already added to a rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040114" : {
					"cause" : "The resource scheduling condition is invalid.",
					"desc" : "The resource scheduling condition is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040115" : {
					"cause" : "The resource scheduling condition is empty.",
					"desc" : "The resource scheduling condition is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040116" : {
					"cause" : "The resource scheduling time threshold setting is invalid.",
					"desc" : "The resource scheduling time threshold setting is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040117" : {
					"cause" : "The migration threshold set for resource scheduling is invalid.",
					"desc" : "The migration threshold set for resource scheduling is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040118" : {
					"cause" : "Some resources are not contained in the resource group.",
					"desc" : "Some resources are not contained in the resource group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040119" : {
					"cause" : "The resource group is already added to a rule.",
					"desc" : "The resource group is already added to a rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040120" : {
					"cause" : "A VM is already added to the mutual-exclusive rule.",
					"desc" : "A VM is already added to the mutual-exclusive rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040121" : {
					"cause" : "The resource allocation policy for the cluster is invalid.",
					"desc" : "The resource allocation policy for the cluster is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040122" : {
					"cause" : "The host group is already added to a rule.",
					"desc" : "The host group is already added to a rule.",
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
				"1040125" : {
					"cause" : "Failed to install the OS on the CNA.",
					"desc" : "Failed to install the OS on the CNA.",
					"solution" : "Please contact Huawei technical support."
				},
				"1040126" : {
					"cause" : "Failed to change the binding mode because resource cluster provisioning, capacity expansion, capacity reduction, or deletion is being performed.",
					"desc" : "Failed to change the binding mode because resource cluster provisioning, capacity expansion, capacity reduction, or deletion is being performed.",
					"solution" : "Provisioning, capacity expansion, or capacity reduction is being performed on the resource cluster. Please wait."
				},
				"1040127" : {
					"cause" : "Modifying the binding mode ... Please wait.",
					"desc" : "Modifying the binding mode ... Please wait.",
					"solution" : "Modifying the binding mode ... Please wait."
				},
				"1040128" : {
					"cause" : "The binding mode of the resource cluster is being modified or fails to be modified. The capacity expansion can be performed only after the binding mode is modified successfully.",
					"desc" : "The binding mode of the resource cluster is being modified or fails to be modified. The capacity expansion can be performed only after the binding mode is modified successfully.",
					"solution" : "Before the capacity expansion/reduction, make sure that the binding mode is modified successfully."
				},
				"1040129" : {
					"cause" : "The binding mode of the resource cluster is being modified or fails to be modified. The capacity expansion can be performed only after the binding mode is modified successfully.",
					"desc" : "The binding mode of the resource cluster is being modified or fails to be modified. The capacity expansion can be performed only after the binding mode is modified successfully.",
					"solution" : "Before the capacity expansion/reduction, make sure that the binding mode is modified successfully."
				},
				"1040130" : {
					"cause" : "The binding mode of the resource cluster is being modified. The resource cluster can be deleted only after the binding mode is modified successfully.",
					"desc" : "The binding mode of the resource cluster is being modified. The resource cluster can be deleted only after the binding mode is modified successfully.",
					"solution" : "Wait until the binding mode is modified successfully."
				},
				"1040131" : {
					"cause" : "The raw device resource cluster cannot be modified.",
					"desc" : "The raw device resource cluster cannot be modified.",
					"solution" : "The raw device resource cluster cannot be modified."
				},
				"1040132" : {
					"cause" : "Duplicate data storage name.",
					"desc" : "Duplicate data storage name.",
					"solution" : "Please change the storage name."
				},
				"1040133" : {
					"cause" : "UHM system error.",
					"desc" : "UHM system error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040134" : {
					"cause" : "Failed to expand the server capacity.",
					"desc" : "Failed to expand the server capacity.",
					"solution" : "Please expand the data store in the resource cluster."
				},
				"1040135" : {
					"cause" : "The capacity of at least one server in the resource cluster cannot be reduced.",
					"desc" : "The capacity of at least one server in the resource cluster cannot be reduced.",
					"solution" : "The capacity of at least one server in the resource cluster cannot be reduced."
				},
				"1040136" : {
					"cause" : "The capacity of at least one data store in the resource cluster cannot be reduced.",
					"desc" : "The capacity of at least one data store in the resource cluster cannot be reduced.",
					"solution" : "The capacity of at least one data store in the resource cluster cannot be reduced."
				},
				"1040137" : {
					"cause" : "The operation failed because provisioning, capacity expansion, or capacity reduction is performed on the resource cluster.",
					"desc" : "The operation failed because provisioning, capacity expansion, or capacity reduction is performed on the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040138" : {
					"cause" : "This operation cannot be performed because the network is being created,modified,or deleted in this cluster.",
					"desc" : "This operation cannot be performed because the network is being created,modified,or deleted in this cluster.",
					"solution" : "Please try again later."
				},
				"1040139" : {
					"cause" : "The DRS recommendation does not exist or already executed.",
					"desc" : "The DRS recommendation does not exist or already executed.",
					"solution" : "Please refresh the page and select the existing DRS recommendation."
				},
				"1040140" : {
					"cause" : "Cannot query CPU quantity in this cluster.",
					"desc" : "Cannot query CPU quantity in this cluster.",
					"solution" : "Please contact the system administrator."
				},
				"1040141" : {
					"cause" : "The license for the edition you requested is not available.",
					"desc" : "The license for the edition you requested is not available.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040142" : {
					"cause" : "Your license has expired.  Please contact your support representative.",
					"desc" : "Your license has expired.  Please contact your support representative.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040143" : {
					"cause" : "The required number of CPU cores over cluster number of CPU cores.",
					"desc" : "The required number of CPU cores over cluster number of CPU cores.",
					"solution" : "Please contact the system administrator."
				},
				"1040144" : {
					"cause" : "The OS version is empty.",
					"desc" : "The OS version is empty.",
					"solution" : "Please specify an OS version."
				},
				"1040145" : {
					"cause" : "The number of required CPUs exceeds the number of CPUs installed in the host.",
					"desc" : "The number of required CPUs exceeds the number of CPUs installed in the host.",
					"solution" : "Please contact the system administrator."
				},
				"1040146" : {
					"cause" : "Opensm has been enabled on multiple hosts.",
					"desc" : "Opensm has been enabled on multiple hosts.",
					"solution" : "Please select a single host for capacity reduction each time."
				},
				"1040147" : {
					"cause" : "The host has been associated with FusionStorage.",
					"desc" : "The host has been associated with FusionStorage.",
					"solution" : "Please delete the FusionStorage resource on the host and try again later."
				},
				"1040148" : {
					"cause" : "The host [{0}] is starting the opensm process.",
					"desc" : "The host [{0}] is starting the opensm process.",
					"solution" : "Please try again later."
				},
				"1040149" : {
					"cause" : "A mutually-exclusive rule is already added to a VM on the destination host.",
					"desc" : "A mutually-exclusive rule is already added to a VM on the destination host.",
					"solution" : "Please select another host."
				},
				"1040150" : {
					"cause" : "The IMC setting parameter is invalid.",
					"desc" : "The IMC setting parameter is invalid.",
					"solution" : "Please correct the parameter and try again."
				},
				"1040151" : {
					"cause" : "The IMC switch parameter is invalid.",
					"desc" : "The IMC switch parameter is invalid.",
					"solution" : "Please correct the parameter and try again."
				},
				"1040152" : {
					"cause" : "This operation is not allowed because the VM is being cloned.",
					"desc" : "This operation is not allowed because the VM is being cloned.",
					"solution" : "Please try again later."
				},
				"1040153" : {
					"cause" : "Failed to migrate all VMs in the keep-together group.",
					"desc" : "Failed to migrate all VMs in the keep-together group.",
					"solution" : "Please check the selected VMs."
				},
				"1040154" : {
					"cause" : "The VM cannot be migrated because a CD/DVD-ROM or tools drive has been mounted to VM.",
					"desc" : "The VM cannot be migrated because a CD/DVD-ROM or tools drive has been mounted to VM.",
					"solution" : "Please try again after unmounting the CD/DVD-ROM."
				},
				"1040155" : {
					"cause" : "The operation failed because the cluster contains a host whose CPU is incompatible with the specified IMC mode.",
					"desc" : "The operation failed because the cluster contains a host whose CPU is incompatible with the specified IMC mode.",
					"solution" : "Please check the host CPU spec."
				},
				"1040156" : {
					"cause" : "The cluster contains hibernating or running VMs whose CPUs are incompatible with the specified IMC mode. Please wakeup the hibernating VMs, then migrate the running VMs to another cluster or stop the VMs, and then try again.",
					"desc" : "The cluster contains hibernating or running VMs whose CPUs are incompatible with the specified IMC mode. Please wakeup the hibernating VMs, then migrate the running VMs to another cluster or stop the VMs, and then try again.",
					"solution" : "Please wakeup the hibernating VMs, then migrate the running VMs to another cluster or stop the VMs, and then try again."
				},
				"1040157" : {
					"cause" : "The OS image does not reside in the specified directory.",
					"desc" : "The OS image does not reside in the specified directory.",
					"solution" : "Please check whether the ISO image is successfully uploaded and whether the permissions on the image file are correctly set."
				},
				"1040158" : {
					"cause" : "The IMC mode is incompatible with the CPU baseline of a running or hibernating VM in the cluster. Migrate the VM to another cluster or stop the VM and try again.",
					"desc" : "The IMC mode is incompatible with the CPU baseline of a running or hibernating VM in the cluster. Migrate the VM to another cluster or stop the VM and try again.",
					"solution" : "Please migrate the VM to another cluster or stop the VM and try again."
				},
				"1040159" : {
					"cause" : "Failed to configure the IMC mode for the host. Check the host IMC configurations and try again.",
					"desc" : "Failed to configure the IMC mode for the host. Check the host IMC configurations and try again.",
					"solution" : "Please check the host IMC configurations and try again."
				},
				"1040160" : {
					"cause" : "The operation failed for the host because the host CPU is incompatible with the specified IMC mode.",
					"desc" : "The operation failed for the host because the host CPU is incompatible with the specified IMC mode.",
					"solution" : "Please check the host CPU spec."
				},
				"1040161" : {
					"cause" : "The operation failed because the VM CPU is incompatible with the specified IMC mode.",
					"desc" : "The operation failed because the VM CPU is incompatible with the specified IMC mode.",
					"solution" : "Please check the VM CPU IMC mode."
				},
				"1040162" : {
					"cause" : "The scheduled run time cannot be configured for this VM because the VM is not created on FusionManager.",
					"desc" : "The scheduled run time cannot be configured for this VM because the VM is not created on FusionManager.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040163" : {
					"cause" : "There are unsteady VMs in the resource cluster, this operation is not allowed.",
					"desc" : "There are unsteady VMs in the resource cluster, this operation is not allowed.",
					"solution" : "Please wait for the VMs to be stable and try again."
				},
				"1040164" : {
					"cause" : "There are hosts which are in initialization state in the resource cluster, this operation is not allowed.",
					"desc" : "There are hosts which are in initialization state in the resource cluster, this operation is not allowed.",
					"solution" : "Please wait for a minute."
				},
				"1040165" : {
					"cause" : "The operation failed because the CPU configuration of the destination host is incompatible with that of the current VM.",
					"desc" : "The operation failed because the CPU configuration of the destination host is incompatible with that of the current VM.",
					"solution" : "Please check the VM CPU spec."
				},
				"1040166" : {
					"cause" : "Install OS failed.",
					"desc" : "Install OS failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040167" : {
					"cause" : "Installation source is not found.",
					"desc" : "Installation source is not found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1040168" : {
					"cause" : "System is performing other tasks.",
					"desc" : "System is performing other tasks.",
					"solution" : "please try later."
				},
				"1040169" : {
					"cause" : "Failed to install the OS for the server because the server does not have a disk that meets configuration requirements.",
					"desc" : "Failed to install the OS for the server because the server does not have a disk that meets configuration requirements.",
					"solution" : "Configure a disk that meets configuration requirements for the server."
				},
				"1040170" : {
					"cause" : "This host cannot be removed because it is the only one host associated with the shared storage resource.",
					"desc" : "This host cannot be removed because it is the only one host associated with the shared storage resource.",
					"solution" : "Please contact Huawei technical support."
				},
				"1040171" : {
					"cause" : "No disk is available in the ZK slot of the LCNA.",
					"desc" : "No disk is available in the ZK slot of the LCNA.",
					"solution" : "Ensure that the ZK slot of the LCNA has a disk available."
				},
				"1040172" : {
					"cause" : "No blade is available or discovered in the LCNA slot.",
					"desc" : "No blade is available or discovered in the LCNA slot.",
					"solution" : "Ensure that the LCNA slot has a blade available."
				},
				"1040188" : {
					"cause" : "No find management cluster.",
					"desc" : "No find management cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050000" : {
					"cause" : "The name of the port group is not set.",
					"desc" : "The name of the port group is not set.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050001" : {
					"cause" : "Invalid port group name.",
					"desc" : "Invalid port group name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050002" : {
					"cause" : "The subnet ID and VLAN ID must have one and only one value.",
					"desc" : "The subnet ID and VLAN ID must have one and only one value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050003" : {
					"cause" : "Invalid subnet ID.",
					"desc" : "Invalid subnet ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050004" : {
					"cause" : "Invalid VLAN ID.",
					"desc" : "Invalid VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050005" : {
					"cause" : "The ID of the port group is not set.",
					"desc" : "The ID of the port group is not set.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050006" : {
					"cause" : "The port group does not exist or the port group ID is invalid.",
					"desc" : "The port group does not exist or the port group ID is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050007" : {
					"cause" : "Invalid port group description.",
					"desc" : "Invalid port group description.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050008" : {
					"cause" : "Insufficient user resource or invalid user ID.",
					"desc" : "Insufficient user resource or invalid user ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050009" : {
					"cause" : "The port group does not exist.",
					"desc" : "The port group does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050010" : {
					"cause" : "The type of the port group is not set.",
					"desc" : "The type of the port group is not set.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050011" : {
					"cause" : "Failed to set the bandwidth rate limit.",
					"desc" : "Failed to set the bandwidth rate limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050012" : {
					"cause" : "The value of priority is invalid.",
					"desc" : "The value of priority is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050013" : {
					"cause" : "The subnets or VLANs in the port group list do not belong to the same resource cluster.",
					"desc" : "The subnets or VLANs in the port group list do not belong to the same resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050014" : {
					"cause" : "Max. bandwidth and Priority are not configured together.",
					"desc" : "Max. bandwidth and Priority are not configured together.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050015" : {
					"cause" : "The subnet value cannot be changed.",
					"desc" : "The subnet value cannot be changed.",
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050022" : {
					"cause" : "The DVS is not associated with any VLAN pool.",
					"desc" : "The DVS is not associated with any VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1050027" : {
					"cause" : "The VLAN ID already used in DVS.",
					"desc" : "The VLAN ID already used in DVS.",
					"solution" : "Please change another VLAN ID."
				},
				"1050028" : {
					"cause" : "VSS does not exist.",
					"desc" : "VSS does not exist.",
					"solution" : "Contact technical support."
				},
				"1050042" : {
					"cause" : "Associate DVS fail.",
					"desc" : "Associate DVS fail.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060001" : {
					"cause" : "No new storage found.",
					"desc" : "No new storage found.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060002" : {
					"cause" : "Failed to delete the storage because it has been attached to a resource cluster.",
					"desc" : "Failed to delete the storage because it has been attached to a resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060003" : {
					"cause" : "The disk list and disk quantity exist at the same time.",
					"desc" : "The disk list and disk quantity exist at the same time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060004" : {
					"cause" : "No valid disk parameter in tier.",
					"desc" : "No valid disk parameter in tier.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060005" : {
					"cause" : "No valid tier exists.",
					"desc" : "No valid tier exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060006" : {
					"cause" : "Invalid IP SAN SN.",
					"desc" : "Invalid IP SAN SN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060007" : {
					"cause" : "The storage name is too long or too short.",
					"desc" : "The storage name is too long or too short.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060008" : {
					"cause" : "The storage description is too long.",
					"desc" : "The storage description is too long.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060009" : {
					"cause" : "The threshold parameter is not in the valid range.",
					"desc" : "The threshold parameter is not in the valid range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060010" : {
					"cause" : "The migration mode setting is not invalid specified range.",
					"desc" : "The migration mode setting is not invalid specified range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060011" : {
					"cause" : "The RAIDlv setting is not invalid specified range.",
					"desc" : "The RAIDlv setting is not invalid specified range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060012" : {
					"cause" : "The disk type conflicts with tier.",
					"desc" : "The disk type conflicts with tier.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060013" : {
					"cause" : "Invalid hot backup policy.",
					"desc" : "Invalid hot backup policy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060014" : {
					"cause" : "Unknown disk type.",
					"desc" : "Unknown disk type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060015" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060016" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060017" : {
					"cause" : "Duplicate storage name.",
					"desc" : "Duplicate storage name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060018" : {
					"cause" : "The number of selected disks is less than the rest number or minimum number of disks in the RAID group.",
					"desc" : "The number of selected disks is less than the rest number or minimum number of disks in the RAID group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060019" : {
					"cause" : "The status of the selected disk is abnormal. Please check the disk status.",
					"desc" : "The status of the selected disk is abnormal. Please check the disk status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060020" : {
					"cause" : "The selected disk is in use.",
					"desc" : "The selected disk is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060021" : {
					"cause" : "The storage space on the destination data store is insufficient.",
					"desc" : "The storage space on the destination data store is insufficient.",
					"solution" : "Ensure that the destination data store has sufficient storage space."
				},
				"1060022" : {
					"cause" : "The FusionStorage disks cannot be migrated.",
					"desc" : "The FusionStorage disks cannot be migrated.",
					"solution" : "Ensure that the disks to be migrated are not FusionStorage disks."
				},
				"1060023" : {
					"cause" : "The storage space is insufficient.",
					"desc" : "The storage space is insufficient.",
					"solution" : "Ensure that the storage space is sufficient."
				},
				"1060024" : {
					"cause" : "The data store does not exist.",
					"desc" : "The data store does not exist.",
					"solution" : "Ensure that the data store exists."
				},
				"1060025" : {
					"cause" : "The disk is used for memory swap.",
					"desc" : "The disk is used for memory swap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060026" : {
					"cause" : "A shared disk cannot be formatted.",
					"desc" : "A shared disk cannot be formatted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060027" : {
					"cause" : "The data store of this storage type does not support disks in thin-provisioning mode.",
					"desc" : "The data store of this storage type does not support disks in thin-provisioning mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060028" : {
					"cause" : "Failed to delete the storage pool because it contains a LUN.",
					"desc" : "Failed to delete the storage pool because it contains a LUN.",
					"solution" : "Please delete the LUN in the storage pool."
				},
				"1060029" : {
					"cause" : "The VM or template has undone task, please try later when the task is done.",
					"desc" : "The VM or template has undone task, please try later when the task is done.",
					"solution" : "Please try later when the task is done."
				},
				"1060030" : {
					"cause" : "The remaining space in the storage pool is insufficient.",
					"desc" : "The remaining space in the storage pool is insufficient.",
					"solution" : "Ensure that the available storage space is sufficient."
				},
				"1060031" : {
					"cause" : "The specified storage pool does not exist.",
					"desc" : "The specified storage pool does not exist.",
					"solution" : "Please ensure that the storage pool exists."
				},
				"1060032" : {
					"cause" : "Creating the LUN timed out.",
					"desc" : "Creating the LUN timed out.",
					"solution" : "Please create the LUN again."
				},
				"1060033" : {
					"cause" : "The communication between the SAN device failed.",
					"desc" : "The communication between the SAN device failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060034" : {
					"cause" : "The data store is not allowed to be updated because it is being deleted or created.",
					"desc" : "The data store is not allowed to be updated because it is being deleted or created.",
					"solution" : "Please retry later."
				},
				"1060035" : {
					"cause" : "The data store is in use.",
					"desc" : "The data store is in use.",
					"solution" : "Please retry later."
				},
				"1060036" : {
					"cause" : "The given datastore path isn't currently accessible.",
					"desc" : "The given datastore path isn't currently accessible.",
					"solution" : "Please contact the system administrator."
				},
				"1060037" : {
					"cause" : "The storage resource does not support this operation.",
					"desc" : "The storage resource does not support this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060038" : {
					"cause" : "Hypervisor does not exist.",
					"desc" : "Hypervisor does not exist.",
					"solution" : "Please refresh the page and check if the hypervisor exists."
				},
				"1060039" : {
					"cause" : "The disaster recovery storage group name already exists.",
					"desc" : "The disaster recovery storage group name already exists.",
					"solution" : "Change the disaster recovery storage group name and try again."
				},
				"1060040" : {
					"cause" : "The selected data store cannot be added to the current disaster recovery storage group.",
					"desc" : "The selected data store cannot be added to the current disaster recovery storage group.",
					"solution" : "Check that the selected data store list does not contain any data store that is added to other disaster recovery storage groups."
				},
				"1060041" : {
					"cause" : "The disaster recovery storage group cannot be deleted because it contains data stores.",
					"desc" : "The disaster recovery storage group cannot be deleted because it contains data stores.",
					"solution" : "Delete data stores in the disaster recovery storage group and try again."
				},
				"1060042" : {
					"cause" : "The disaster recovery storage group does not exist.",
					"desc" : "The disaster recovery storage group does not exist.",
					"solution" : "Ensure that the disaster recovery storage group exists."
				},
				"1060043" : {
					"cause" : "The data store not in FusionManager, please update hypervisor first.",
					"desc" : "The data store not in FusionManager, please update hypervisor first.",
					"solution" : "please update hypervisor first."
				},
				"1060044" : {
					"cause" : "The data store does not exist, please refresh page first.",
					"desc" : "The data store does not exist, please refresh page first.",
					"solution" : "please refresh page first."
				},
				"1060045" : {
					"cause" : "The datastore does not exist.",
					"desc" : "The datastore does not exist.",
					"solution" : "The datastore does not exist."
				},
				"1060046" : {
					"cause" : "Failed to bind the host to the data store.",
					"desc" : "Failed to bind the host to the data store.",
					"solution" : "Please try again after reducing the data store capacity."
				},
				"1060047" : {
					"cause" : "No disk is attached to the VM.",
					"desc" : "No disk is attached to the VM.",
					"solution" : "Ensure that a disk is attached to the VM."
				},
				"1060048" : {
					"cause" : "The operation is not allowed, because storage in is in maintenance mode.",
					"desc" : "The operation is not allowed, because storage in is in maintenance mode.",
					"solution" : "Ensure storage exit maintenance mode."
				},
				"1060050" : {
					"cause" : "A FusionStorage disk can have a maximum storage space of 16383 GB.",
					"desc" : "A FusionStorage disk can have a maximum storage space of 16383 GB.",
					"solution" : "Ensure storage exit maintenance mode."
				},
				"1060051" : {
					"cause" : "Storage type is not ipsan or dsware.",
					"desc" : "Storage type is not ipsan or dsware.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060052" : {
					"cause" : "The storage Selected that are not allowed to migrate disk.",
					"desc" : "The storage Selected that are not allowed to migrate disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060120" : {
					"cause" : "The storage type cannot create thick format.",
					"desc" : "The storage type cannot create thick format.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1060137" : {
					"cause" : "Adding the data store...",
					"desc" : "Adding the data store...",
					"solution" : "Please contact Huawei technical support."
				},
				"1060138" : {
					"cause" : "Deleting the data store...",
					"desc" : "Deleting the data store...",
					"solution" : "Please contact Huawei technical support."
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
				"1060141" : {
					"cause" : "A system exception may have occurred.",
					"desc" : "A system exception may have occurred.",
					"solution" : "Please contact Huawei technical support."
				},
				"1060142" : {
					"cause" : "A system exception may have occurred.",
					"desc" : "A system exception may have occurred.",
					"solution" : "Please contact Huawei technical support."
				},
				"1060143" : {
					"cause" : "The disk ID is empty.",
					"desc" : "The disk ID is empty.",
					"solution" : "Please contact Huawei technical support."
				},
				"1060144" : {
					"cause" : "The disk is being baked up or restored.",
					"desc" : "The disk is being baked up or restored.",
					"solution" : "Please contact Huawei technical support."
				},
				"1060180" : {
					"cause" : "The data storage status is abnormal.",
					"desc" : "The data storage status is abnormal.",
					"solution" : "Please check the data storage status."
				},
				"1070004" : {
					"cause" : "The number of VMs to be operated in batches exceeds 100.",
					"desc" : "The number of VMs to be operated in batches exceeds 100.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070007" : {
					"cause" : "The template which the specified VM related to does not exist,the operation is not supported.",
					"desc" : "The template which the specified VM related to does not exist,the operation is not supported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070008" : {
					"cause" : "Failed to restore the VM because the number of VM disks has reached the upper limit.",
					"desc" : "Failed to restore the VM because the number of VM disks has reached the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070009" : {
					"cause" : "The VM is already being restored.",
					"desc" : "The VM is already being restored.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070010" : {
					"cause" : "The number of volumes to be operated in batches exceeds 100.",
					"desc" : "The number of volume to be operated in batches exceeds 100.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070011" : {
					"cause" : "The number of VMs to be migrated in batches exceeds 40.",
					"desc" : "The number of VMs to be migrated in batches exceeds 40.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070012" : {
					"cause" : "The number of VMs for which disk resources are to be reclaimed in batches exceeded 40.",
					"desc" : "The number of VMs for which disk resources are to be reclaimed in batches exceeded 40.",
					"solution" : "Select less than 40 VMs."
				},
				"1070017" : {
					"cause" : "Failed to attach disks to the VM.",
					"desc" : "Failed to attach disks to the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070018" : {
					"cause" : "Failed to delete the disk from the VM.",
					"desc" : "Failed to delete the disk from the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070019" : {
					"cause" : "Failed to attach the disk to the VM. The rollback operation failed.",
					"desc" : "Failed to attach the disk to the VM. The rollback operation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070020" : {
					"cause" : "Failed to detach the disk from the VM. The rollback operation failed.",
					"desc" : "Failed to detach the disk from the VM. The rollback operation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070021" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070022" : {
					"cause" : "Failed to restore the VM due to VM status conflict. Only running or stopped VMs can be restored.",
					"desc" : "Failed to restore the VM due to VM status conflict. Only running or stopped VMs can be restored.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070023" : {
					"cause" : "The current user does not belong to any domain.",
					"desc" : "The current user does not belong to any domain.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070024" : {
					"cause" : "Task execution failed.",
					"desc" : "Task execution failed.",
					"solution" : "Please log in to the vCenter to view the details."
				},
				"1070025" : {
					"cause" : "An exception occurred during migration.",
					"desc" : "An exception occurred during migration.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070033" : {
					"cause" : "A task for this VM is not complete.",
					"desc" : "A task for this VM is not complete.",
					"solution" : "Please try again later."
				},
				"1070038" : {
					"cause" : "The NIC does not exist.",
					"desc" : "The NIC does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070039" : {
					"cause" : "Hypervisor inner error.",
					"desc" : "Hypervisor inner error.",
					"solution" : "Hypervisor inner error, please try later."
				},
				"1070040" : {
					"cause" : "This operation is not allowed because the snapshot is in use.",
					"desc" : "This operation is not allowed because the snapshot is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070042" : {
					"cause" : "The VM in the current state does not support this operation.",
					"desc" : "The VM in the current state does not support this operation.",
					"solution" : "Ensure that the VM status supports this operation."
				},
				"1070043" : {
					"cause" : "This operation is not supported because the VM in its current state only supports the change of the CPU quantity to a double of the current number of CPUs.",
					"desc" : "This operation is not supported because the VM in its current state only supports the change of the CPU quantity to a double of the current number of CPUs.",
					"solution" : "Ensure that the VM status supports this operation."
				},
				"1070046" : {
					"cause" : "The datastore status does not support this operation or not bind all hosts in the cluster or is used.",
					"desc" : "The datastore status does not support this operation or not bind all hosts in the cluster or is used.",
					"solution" : "Ensure that the datastore status supports this operation or bind all hosts in the cluster."
				},
				"1070050" : {
					"cause" : "This MAC address is not configured nor contained in the MAC address segment. Choose Resources > Virtualization Resources > Hypervisors to configure the MAC address for the hypervisor.",
					"desc" : "This MAC address is not configured nor contained in the MAC address segment. Choose Resources > Virtualization Resources > Hypervisors to configure the MAC address for the hypervisor.",
					"solution" : "Enter a configured MAC address or select a MAC address that is contained in the MAC address segment."
				},
				"1070051" : {
					"cause" : "The MAC address already exists.",
					"desc" : "The MAC address already exists.",
					"solution" : "Select a MAC address that is not configured."
				},
				"1070052" : {
					"cause" : "CPU resources in the cluster are insufficient.",
					"desc" : "CPU resources in the cluster are insufficient.",
					"solution" : "Please check resources."
				},
				"1070053" : {
					"cause" : "Memory resources in the cluster are insufficient.",
					"desc" : "Memory resources in the cluster are insufficient.",
					"solution" : "Please check resources."
				},
				"1070054" : {
					"cause" : "Storage resources in the cluster are insufficient.",
					"desc" : "Storage resources in the cluster are insufficient.",
					"solution" : "Please check resources."
				},
				"1070055" : {
					"cause" : "CPU resources in the orgVDC are insufficient.",
					"desc" : "CPU resources in the orgVDC are insufficient.",
					"solution" : "Please check resources."
				},
				"1070056" : {
					"cause" : "Memory resources in the orgVDC are insufficient.",
					"desc" : "Memory resources in the orgVDC are insufficient.",
					"solution" : "Please check resources."
				},
				"1070057" : {
					"cause" : "Storage resources in the orgVDC are insufficient.",
					"desc" : "Storage resources in the orgVDC are insufficient.",
					"solution" : "Please check resources."
				},
				"1070058" : {
					"cause" : "A delete task for this VM or VM template is not complete.",
					"desc" : "A delete task for this VM or VM template is not complete.",
					"solution" : "Please wait for that task to complete."
				},
				"1070060" : {
					"cause" : "This template is not a VM template.",
					"desc" : "This template is not a VM template.",
					"solution" : "Please select a VM template."
				},
				"1070061" : {
					"cause" : "The host status is abnormal.",
					"desc" : "The host status is abnormal.",
					"solution" : "Ensure that the host status is normal."
				},
				"1070062" : {
					"cause" : "The free physical memory of the host is insufficient when iCache is configured.",
					"desc" : "The free physical memory of the host is insufficient when iCache is configured.",
					"solution" : "Please try later."
				},
				"1070063" : {
					"cause" : "Memory capacity expansion timed out when iCache is configured.",
					"desc" : "Memory capacity expansion timed out when iCache is configured.",
					"solution" : "Please try later."
				},
				"1070064" : {
					"cause" : "Memory capacity reduction failed when iCache configurations are cleared.",
					"desc" : "Memory capacity reduction failed when iCache configurations are cleared.",
					"solution" : "Please try later."
				},
				"1070065" : {
					"cause" : "The memory to be released exceeded the limit.",
					"desc" : "The memory to be released exceeded the limit.",
					"solution" : "Please try later."
				},
				"1070066" : {
					"cause" : "The underlying-layer processing is abnormal when iCache is configured.",
					"desc" : "The underlying-layer processing is abnormal when iCache is configured.",
					"solution" : "Please try later."
				},
				"1070067" : {
					"cause" : "The template is configured with iCache.",
					"desc" : "The template is configured with iCache.",
					"solution" : "No suggestion is available."
				},
				"1070068" : {
					"cause" : "The system disk of the template is a nonpersistent disk.",
					"desc" : "The system disk of the template is a nonpersistent disk.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"1070069" : {
					"cause" : "The template does not contain a system disk.",
					"desc" : "The template does not contain a system disk.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"1070070" : {
					"cause" : "The template is configured with iCache.",
					"desc" : "The template is configured with iCache.",
					"solution" : "Select a VM with iCache not configured."
				},
				"1070071" : {
					"cause" : "The template contains linked clone VMs.",
					"desc" : "The template contains linked clone VMs.",
					"solution" : "Select a VM with iCache not configured."
				},
				"1070072" : {
					"cause" : "The number of templates with iCache configured exceeded the upper limit.",
					"desc" : "The number of templates with iCache configured exceeded the upper limit.",
					"solution" : "No suggestion is available."
				},
				"1070073" : {
					"cause" : "This VM does not support the linked clone technology.",
					"desc" : "This VM does not support the linked clone technology.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"1070074" : {
					"cause" : "The VM of this storage type does not support iCache configurations.",
					"desc" : "The VM of this storage type does not support iCache configurations.",
					"solution" : "Select a VM that supports the linked clone technology."
				},
				"1070075" : {
					"cause" : "No CD-ROM drive is available on the VM.",
					"desc" : "No CD-ROM drive is available on the VM.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070076" : {
					"cause" : "VM templates do not support this operation.",
					"desc" : "VM templates do not support this operation.",
					"solution" : "Please select a VM that is not a VM template."
				},
				"1070077" : {
					"cause" : "This NIC does not exist on the VM.",
					"desc" : "This NIC does not exist on the VM.",
					"solution" : "Please select a proper NIC."
				},
				"1070078" : {
					"cause" : "There is virtual machine selected by resource group already not exist.",
					"desc" : "There is virtual machine selected by resource group already not exist.",
					"solution" : "Please refresh the page and select the existing virtual machine."
				},
				"1070079" : {
					"cause" : "There is host selected by resource group already not exist.",
					"desc" : "There is host selected by resource group already not exist.",
					"solution" : "Please refresh the page and select the existing host."
				},
				"1070080" : {
					"cause" : "A snapshot task is in progress, a single VM cannot handle multiple snapshot task simultaneously.",
					"desc" : "A snapshot task is in progress, a single VM cannot handle multiple snapshot task simultaneously.",
					"solution" : "Please wait the in-progress snapshot task to be completed before starting another snapshot task."
				},
				"1070081" : {
					"cause" : "There is another VM disk operation in progress, not support new operation.",
					"desc" : "There is another VM disk operation in progress, not support new operation.",
					"solution" : "Please wait some minutes and try again."
				},
				"1070082" : {
					"cause" : "The system disk is not allowed to be detach.",
					"desc" : "The system disk is not allowed to be detach.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070083" : {
					"cause" : "The VM is not allowed to delete when it's not stopped.",
					"desc" : "The VM is not allowed to delete when it's not stopped.",
					"solution" : "Please shut down the VM before deleting."
				},
				"1070084" : {
					"cause" : "The VM is not allowed to set reservation larger than limit[{0}].",
					"desc" : "The VM is not allowed to set reservation larger than limit[{0}].",
					"solution" : "Please config VM with valid reservation."
				},
				"1070085" : {
					"cause" : "Insufficient capacity on each physical CPU.",
					"desc" : "Insufficient capacity on each physical CPU.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070086" : {
					"cause" : "SMI-S service exceptions, please log SAN devices to be checked.",
					"desc" : "SMI-S service exceptions, please log SAN devices to be checked.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070087" : {
					"cause" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"desc" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"solution" : "Please select disks that support resource reclamation."
				},
				"1070088" : {
					"cause" : "Failed to create the memory swap disk.",
					"desc" : "Failed to create the memory swap disk.",
					"solution" : "Please contact the system administrator."
				},
				"1070089" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070090" : {
					"cause" : "Failed to delete the VM snapshot.",
					"desc" : "Failed to delete the VM snapshot.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070091" : {
					"cause" : "Insufficient host CPU resources.",
					"desc" : "Insufficient host CPU resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070092" : {
					"cause" : "The specified number of CPUs has exceeded the upper limit {0} supported by the VM OS.",
					"desc" : "The specified number of CPUs has exceeded the upper limit {0} supported by the VM OS.",
					"solution" : "Reduce the number of CPUs and try again."
				},
				"1070093" : {
					"cause" : "Failed to expand the disk capacity.",
					"desc" : "Failed to expand the disk capacity.",
					"solution" : "Please confirm the maximum disk size supported by the data store."
				},
				"1070094" : {
					"cause" : "Cannot take a memory snapshot, since the virtual machine is configured with independent disks.",
					"desc" : "Cannot take a memory snapshot, since the virtual machine is configured with independent disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070095" : {
					"cause" : "Virtual machine is configured to use a device that prevents the operation, such as disk is not in persistent mode.",
					"desc" : "Virtual machine is configured to use a device that prevents the operation, such as disk is not in persistent mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070096" : {
					"cause" : "The VM has a snapshot.",
					"desc" : "The VM has a snapshot.",
					"solution" : "Delete the VM snapshot (if allowed) and try again."
				},
				"1070097" : {
					"cause" : "The storage type can only create thin disk.",
					"desc" : "The storage type can only create thin disk.",
					"solution" : "Please select thin disk to create."
				},
				"1070098" : {
					"cause" : "The host is disconnection from the network.",
					"desc" : "The host is disconnection from the network.",
					"solution" : "Ensure that the host is in a correct state or contact technical support engineers."
				},
				"1070099" : {
					"cause" : "Readable and writable storage space is insufficient.",
					"desc" : "Readable and writable storage space is insufficient.",
					"solution" : "Ensure that the data store has sufficient storage space."
				},
				"1070100" : {
					"cause" : "This disk cannot be reclaimed. If it contains a snapshot, delete the snapshot and try again. If it is a non-thin-provisioning disk, a shared disk, a system disk on a linked clone, or it uses non-virtualized storage resources, it cannot be reclaimed.",
					"desc" : "This disk cannot be reclaimed. If it contains a snapshot, delete the snapshot and try again. If it is a non-thin-provisioning disk, a shared disk, a system disk on a linked clone, or it uses non-virtualized storage resources, it cannot be reclaimed.",
					"solution" : "Select a valid disk."
				},
				"1070101" : {
					"cause" : "Resource reclamation can be performed for only hibernated or stopped VM.",
					"desc" : "Resource reclamation can be performed for only hibernated or stopped VM.",
					"solution" : "Select a hibernated or stopped VM."
				},
				"1070102" : {
					"cause" : "Failed to reclaim disk resources.",
					"desc" : "Failed to reclaim disk resources.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070103" : {
					"cause" : "Memory swap disks cannot be reclaimed.",
					"desc" : "Memory swap disks cannot be reclaimed.",
					"solution" : "Select other disks."
				},
				"1070104" : {
					"cause" : "VM templates do not support resource reclamation.",
					"desc" : "VM templates do not support resource reclamation.",
					"solution" : "Select a common VM."
				},
				"1070105" : {
					"cause" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"desc" : "Only disks with Windows NTFS-based partitions support resource reclamation.",
					"solution" : "Please select disks that support resource reclamation."
				},
				"1070106" : {
					"cause" : "A snapshot request on a VM whose state has not changed since a previous successful snapshot.",
					"desc" : "A snapshot request on a VM whose state has not changed since a previous successful snapshot.",
					"solution" : "Please try again when VM state changed."
				},
				"1070107" : {
					"cause" : "A VMotion interface is not configured (or is misconfigured) on either the source or destination host.",
					"desc" : "A VMotion interface is not configured (or is misconfigured) on either the source or destination host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070108" : {
					"cause" : "A network associated with the VM is not allowed to finish this operation.",
					"desc" : "A network associated with the VM is not allowed to finish this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070109" : {
					"cause" : "The host has an invalid state.",
					"desc" : "The host has an invalid state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070110" : {
					"cause" : "Execute VM command timeout.",
					"desc" : "Execute VM command timeout.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070111" : {
					"cause" : "VM delete failed: there is elastic ip or NAPT assigned to the NIC.",
					"desc" : "VM delete failed: there is elastic ip or NAPT assigned to the NIC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070112" : {
					"cause" : "VM and the selected network are not in same cluster.",
					"desc" : "VM and the selected network are not in same cluster.",
					"solution" : "Please select other network and try again."
				},
				"1070113" : {
					"cause" : "There is an elastic ip or NAPT assigned to the NIC.",
					"desc" : "There is an elastic ip or NAPT assigned to the NIC.",
					"solution" : "Please unbind the elastic ip first and then retry."
				},
				"1070114" : {
					"cause" : "There is an elastic ip assigned to the VM.",
					"desc" : "There is an elastic ip or NAPT assigned to the VM.",
					"solution" : "Please unbind the elastic ip first and then retry."
				},
				"10700115" : {
					"cause" : "There is an DNAT assigned to the VM.",
					"desc" : "There is an DNAT assigned to the VM.",
					"solution" : "Please delete DNAT first and then retry."
				},
				"10700116" : {
					"cause" : "VM is in security group.",
					"desc" : "VM is in security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070115" : {
					"cause" : "The VM does not support online VM cloning because the number of VM snapshots exceeds the upper limit.",
					"desc" : "The VM does not support online VM cloning because the number of VM snapshots exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070116" : {
					"cause" : "VM has independent disks, and is not allowed to finish this operation.",
					"desc" : "VM has independent disks, and is not allowed to finish this operation.",
					"solution" : "Please firstly delete independent disks and try again."
				},
				"1070117" : {
					"cause" : "VM has no-virtual type disks, and is not allowed to finish this operation.",
					"desc" : "VM has no-virtual type disks, and is not allowed to finish this operation.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1070120" : {
					"cause" : "The NIC is exist.",
					"desc" : "The NIC is exist.",
					"solution" : "Please refresh the page and add NIC again."
				},
				"1070121" : {
					"cause" : "The guest operating system is not supported.",
					"desc" : "The guest operating system is not supported.",
					"solution" : "Please select other operating system."
				},
				"1070122" : {
					"cause" : "VM is in VM-group of DRS resource group management.",
					"desc" : "VM is in VM-group of DRS resource group management.",
					"solution" : "Please delete VM from VM-group and try again."
				},
				"1070123" : {
					"cause" : "No host is compatible with the virtual machine.",
					"desc" : "No host is compatible with the virtual machine.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070124" : {
					"cause" : "Network ID or VPC ID is not accordance with VM's network.",
					"desc" : "Network ID or VPC ID is not accordance with VM's network.",
					"solution" : "Ensure that the entered network ID or VPC ID is valid for VM."
				},
				"1070126" : {
					"cause" : "The VM is not stopped, cannot do it.",
					"desc" : "The VM is not stopped, cannot do it.",
					"solution" : "Please recheck VM status."
				},
				"1070128" : {
					"cause" : "A non-placeholder VM does not allow this operation.",
					"desc" : "A non-placeholder VM does not allow this operation.",
					"solution" : "Contact technical support."
				},
				"1070129" : {
					"cause" : "No host is available for DR VM cache data synchronization.",
					"desc" : "No host is available for DR VM cache data synchronization.",
					"solution" : "Contact technical support."
				},
				"1070130" : {
					"cause" : "Failed to start DR VM cache data synchronization.",
					"desc" : "Failed to start DR VM cache data synchronization.",
					"solution" : "Contact technical support."
				},
				"1070131" : {
					"cause" : "Invalid VM DR parameters.",
					"desc" : "Invalid VM DR parameters.",
					"solution" : "Contact technical support."
				},
				"1070132" : {
					"cause" : "Invalid drill VM parameters.",
					"desc" : "Invalid drill VM parameters.",
					"solution" : "Contact technical support."
				},
				"1070133" : {
					"cause" : "Failed to query the process of DR VM cache data synchronization.",
					"desc" : "Failed to query the process of DR VM cache data synchronization.",
					"solution" : "Contact technical support."
				},
				"1070134" : {
					"cause" : "Failed to start disk DR.",
					"desc" : "Failed to start disk DR.",
					"solution" : "Contact technical support."
				},
				"1070135" : {
					"cause" : "Failed to stop disk DR.",
					"desc" : "Failed to stop disk DR.",
					"solution" : "Contact technical support."
				},
				"1070136" : {
					"cause" : "The path is incorrect or the installation file is not stored in this path.",
					"desc" : "The path is incorrect or the installation file is not stored in this path.",
					"solution" : "Ensure that the path is correct and the installation file is stored in this path."
				},
				"1070137" : {
					"cause" : "The VM bind HBA card failed.",
					"desc" : "The VM bind HBA card failed.",
					"solution" : "Please contact the system administrator."
				},
				"1070138" : {
					"cause" : "The VM unbind HBA card failed.",
					"desc" : "The VM unbind HBA card failed.",
					"solution" : "Please contact the system administrator."
				},
				"1070139" : {
					"cause" : "The HBA card had been bound to other VM.",
					"desc" : "The HBA card had been bound to other VM.",
					"solution" : "Please choose other HBA card."
				},
				"1070140" : {
					"cause" : "The VM has bound HBA card.",
					"desc" : "The VM has bound HBA card.",
					"solution" : "Please first unbind the HBA card."
				},
				"1070141" : {
					"cause" : "The VM has no bound HBA card.",
					"desc" : "The VM has no bound HBA card.",
					"solution" : "The VM has no bound HBA card and so cannot execute unbind operation."
				},
				"1070142" : {
					"cause" : "The VM doesn't has a memory swap disk, so cannot hibernate it.",
					"desc" : "The VM doesn't has a memory swap disk, so cannot hibernate it.",
					"solution" : "Please make the memory swap disk feature on."
				},
				"1070143" : {
					"cause" : "The number of nuclei per slot CPU is not valid, please input again.",
					"desc" : "The number of nuclei per slot CPU is not valid, please input again.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070149" : {
					"cause" : "The template contains a disk that does not match the current VM disk.",
					"desc" : "The template contains a disk that does not match the current VM disk.",
					"solution" : "please try again."
				},
				"1070150" : {
					"cause" : "Invalid disk parameters.",
					"desc" : "Invalid disk parameters.",
					"solution" : "please try again."
				},
				"1070151" : {
					"cause" : "The VM has been incorporated into FusionManager.",
					"desc" : "The VM has been incorporated into FusionManager.",
					"solution" : "Please choose a VM has not been incorporated into FusionManager."
				},
				"1070152" : {
					"cause" : "Failed to incorporate the VM because it is used by an application instance.",
					"desc" : "Failed to incorporate the VM because it is used by an application instance.",
					"solution" : "Select a VM that is not used by an application instance."
				},
				"1070155" : {
					"cause" : "The selected data storages contains data storages which is inaccessible for the source VM.",
					"desc" : "The selected data storages contains data storages which is inaccessible for the source VM.",
					"solution" : "Please choose other data storages."
				},
				"1070160" : {
					"cause" : "A drill VM cannot be created on a non-placeholder VM.",
					"desc" : "A drill VM cannot be created on a non-placeholder VM.",
					"solution" : "Contact technical support."
				},
				"1070161" : {
					"cause" : "Failed to create a drill VM because the current VM does not have an available snapshot.",
					"desc" : "Failed to create a drill VM because the current VM does not have an available snapshot.",
					"solution" : "Contact technical support."
				},
				"1070162" : {
					"cause" : "The placeholder VM already has a drill VM.",
					"desc" : "The placeholder VM already has a drill VM.",
					"solution" : "Contact technical support."
				},
				"1070163" : {
					"cause" : "The operation is not allowed because the placeholder VM has a drill VM.",
					"desc" : "The operation is not allowed because the placeholder VM has a drill VM.",
					"solution" : "Contact technical support."
				},
				"1070164" : {
					"cause" : "Failed to restore the VM because the VM does not have a snapshot.",
					"desc" : "Failed to restore the VM because the VM does not have a snapshot.",
					"solution" : "Contact technical support."
				},
				"1070165" : {
					"cause" : "The placeholder VM does not exist.",
					"desc" : "The placeholder VM does not exist.",
					"solution" : "Contact technical support."
				},
				"1070166" : {
					"cause" : "Failed to set the VM to a placeholder VM.",
					"desc" : "Failed to set the VM to a placeholder VM.",
					"solution" : "Contact technical support."
				},
				"1070167" : {
					"cause" : "Only a VM in the stopped state allows NIC information modification.",
					"desc" : "Only a VM in the stopped state allows NIC information modification.",
					"solution" : "Please recheck VM status."
				},
				"1070168" : {
					"cause" : "The VM cannot be exported when the VM is running because it has non-virtualized disks.",
					"desc" : "The VM cannot be exported when the VM is running because it has non-virtualized disks.",
					"solution" : "Contact technical support."
				},
				"1070169" : {
					"cause" : "Failed to format the disk. Failed to stop disk DR.",
					"desc" : "Failed to format the disk. Failed to stop disk DR.",
					"solution" : "Please recheck VM status."
				},
				"1070170" : {
					"cause" : "The VM OS does not support detaching a disk when the VM is running.",
					"desc" : "The VM OS does not support detaching a disk when the VM is running.",
					"solution" : "Contact technical support."
				},
				"1070177" : {
					"cause" : "The VM cannot be deleted because it has copies. To delete the VM, delete all its copies first.",
					"desc" : "The VM cannot be deleted because it has copies. To delete the VM, delete all its copies first.",
					"solution" : "Contact technical support."
				},
				"1070200" : {
					"cause" : "Cannot access VM config file.",
					"desc" : "Cannot access VM config file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070201" : {
					"cause" : "The task is already canceled or complete.",
					"desc" : "The task is already canceled or complete.",
					"solution" : "Refresh the page and try again."
				},
				"1070202" : {
					"cause" : "Vmware remote exception.",
					"desc" : "Vmware remote exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070203" : {
					"cause" : "Vmware runtime fault.",
					"desc" : "Vmware runtime fault.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070204" : {
					"cause" : "This task cannot be canceled.",
					"desc" : "This task cannot be canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070205" : {
					"cause" : "The VM status was changed during migration.",
					"desc" : "The VM status was changed during migration.",
					"solution" : "Please contact technical support."
				},
				"1070206" : {
					"cause" : "Restoration of the suspended VM failed on the host.",
					"desc" : "Restoration of the suspended VM failed on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070207" : {
					"cause" : "The current state of the VM does not allow this operation, please shut down the VM and retry.",
					"desc" : "The current state of the VM does not allow this operation, please shut down the VM and retry.",
					"solution" : "Please shut down the VM and retry."
				},
				"1070208" : {
					"cause" : "The operation of configuring iCache was partially failed.",
					"desc" : "The operation of configuring iCache was partially failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070209" : {
					"cause" : "This storage type does not support iCache.",
					"desc" : "This storage type does not support iCache.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070210" : {
					"cause" : "The iCache operation failed.",
					"desc" : "The iCache operation failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070211" : {
					"cause" : "The cluster does not contain a data store that supports disks in thick provisioning lazy zeroed mode.",
					"desc" : "The cluster does not contain a data store that supports disks in thick provisioning lazy zeroed mode.",
					"solution" : "Use other types of storage."
				},
				"1070212" : {
					"cause" : "The virtual machine is being created, the operation is not supported.",
					"desc" : "The virtual machine is being created, the operation is not supported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070213" : {
					"cause" : "Allocated ip failed.",
					"desc" : "Allocated ip failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070214" : {
					"cause" : "Custom specifications do not exist.",
					"desc" : "Custom specifications do not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070215" : {
					"cause" : "The host returned an error message during template importing or exporting.",
					"desc" : "The host returned an error message during template importing or exporting.",
					"solution" : "Please check whether the host is normal."
				},
				"1070216" : {
					"cause" : "The host failed to connect to the shared directory.",
					"desc" : "The host failed to connect to the shared directory.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"1070217" : {
					"cause" : "Failed to parse the XML file.",
					"desc" : "Failed to parse the XML file.",
					"solution" : "Please check whether the format of the XML file is correct."
				},
				"1070218" : {
					"cause" : "The XML file does not match the image, please check the image file.",
					"desc" : "The XML file does not match the image, please check the image file.",
					"solution" : "Please check the image file."
				},
				"1070219" : {
					"cause" : "Invalid disk size, please enter a valid disk size.",
					"desc" : "Invalid disk size, please enter a valid disk size.",
					"solution" : "Please enter a valid disk size."
				},
				"1070220" : {
					"cause" : "Query volume failed when install patch.",
					"desc" : "Query volume failed when install patch.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070221" : {
					"cause" : "VM system volume not exists.",
					"desc" : "VM system volume not exists.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070222" : {
					"cause" : "VM system volume don't support the operation.",
					"desc" : "VM system volume don't support the operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070223" : {
					"cause" : "Install patch to VM failed.",
					"desc" : "Install patch to VM failed.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070224" : {
					"cause" : "Current OS type don't support the operation.",
					"desc" : "Current OS type don't support the operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070226" : {
					"cause" : "The disk operation failed.",
					"desc" : "The disk operation failed.",
					"solution" : "Please confirm the maximum disk size supported by the data store."
				},
				"1070227" : {
					"cause" : "The user of virtual machine cancel hibernate.",
					"desc" : "The user of virtual machine cancel hibernate.",
					"solution" : "Please confirm."
				},
				"1070228" : {
					"cause" : "The VSS plug-in is not installed on this virtual machine.",
					"desc" : "The VSS plug-in is not installed on this virtual machine.",
					"solution" : "Please install VSS plug-in on this virtual machine."
				},
				"1070229" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a shared disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a shared disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070230" : {
					"cause" : "The NIC used by the VM does not exist or is unavailable.",
					"desc" : "The NIC used by the VM does not exist or is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070231" : {
					"cause" : "The specified VM is not currently resident on the specified host.",
					"desc" : "The specified VM is not currently resident on the specified host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070232" : {
					"cause" : "This operation cannot be performed because the specified VM is protected by xHA.",
					"desc" : "This operation cannot be performed because the specified VM is protected by xHA.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070233" : {
					"cause" : "Cannot find a plan for placement of VMs as there are no other hosts available.",
					"desc" : "Cannot find a plan for placement of VMs as there are no other hosts available.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070234" : {
					"cause" : "Error from bootloader: no bootable disk.",
					"desc" : "Error from bootloader: no bootable disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070235" : {
					"cause" : "The volume is being created.",
					"desc" : "The volume is being created.",
					"solution" : "Please try again later."
				},
				"1070236" : {
					"cause" : "Unable to find partition containing kernel.",
					"desc" : "Unable to find partition containing kernel.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070237" : {
					"cause" : "You attempted to run a VM on a host which doesn't have access to an Storage Repository needed by the VM.",
					"desc" : "You attempted to run a VM on a host which doesn't have access to an Storage Repository needed by the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070238" : {
					"cause" : "The snapshot is failed to delete.",
					"desc" : "The snapshot is failed to delete.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070239" : {
					"cause" : "Create VM failed because the hypervisor not support static inject net.",
					"desc" : "Create VM failed because the hypervisor not support static inject net.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070240" : {
					"cause" : "System copies the disk failed, please try again.",
					"desc" : "System copies the disk failed, please try again.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070241" : {
					"cause" : "Memory reservation must be equal to memory quantity because of no memory swap volume exists in the VM.",
					"desc" : "Memory reservation must be equal to memory quantity because of no memory swap volume exists in the VM.",
					"solution" : "Please enable the memory swapping for the VM or check the memory reservation is equal to the memory quantity."
				},
				"1070250" : {
					"cause" : "Failed to create the storage device.",
					"desc" : "Failed to create the storage device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070251" : {
					"cause" : "Failed to delete the storage device.",
					"desc" : "Failed to delete the storage device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070252" : {
					"cause" : "Unknown error occurred.",
					"desc" : "Unknown error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070253" : {
					"cause" : "Modify the XML file name failed.",
					"desc" : "Modify the XML file name failed.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"1070254" : {
					"cause" : "Failed to create the directory for storing exported data.",
					"desc" : "Failed to create the directory for storing exported data.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"1070255" : {
					"cause" : "Command execution on the host failed.",
					"desc" : "Command execution on the host failed.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"1070256" : {
					"cause" : "VM migration across AZs is not supported.",
					"desc" : "VM migration across AZs is not supported.",
					"solution" : "Please check the operation permission for the shared directory."
				},
				"1070280" : {
					"cause" : "Failed to bind the host which is in maintenance mode.",
					"desc" : "Failed to bind the host which is in maintenance mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070281" : {
					"cause" : "Failed to stop the VM because the VM restarted or an internal exception occurred. Log in to the VM to view the system logs.",
					"desc" : "Failed to stop the VM because the VM restarted or an internal exception occurred. Log in to the VM to view the system logs.",
					"solution" : "Please Log in to the VM to view the system logs."
				},
				"1070300" : {
					"cause" : "UUID is duplicate.",
					"desc" : "UUID is duplicate.",
					"solution" : "Please change another UUID."
				},
				"1070388" : {
					"cause" : "Incorrect VNC password. The VNC password can contain only letters and digits.",
					"desc" : "Incorrect VNC password. The VNC password can contain only letters and digits.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070389" : {
					"cause" : "Don't delete the VM when the status is recycling",
					"desc" : "Don't delete the VM when the status is recycling",
					"solution" : "null"
				},
				"1070452" : {
					"cause" : "No appropriate VM template for reinstalling the OS.",
					"desc" : "No appropriate VM template for reinstalling the OS.",
					"solution" : "Please choose other VM templates."
				},
				"1070497" : {
					"cause" : "Failed to query the memory swap disk.",
					"desc" : "Failed to query the memory swap disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070498" : {
					"cause" : "The operation timed out.",
					"desc" : "The operation timed out.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070499" : {
					"cause" : "An internal error occurred. Please check the system running status.",
					"desc" : "An internal error occurred. Please check the system running status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070500" : {
					"cause" : "System internal error.",
					"desc" : "System internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070501" : {
					"cause" : "Failed to register the task for restoring VMs.",
					"desc" : "Failed to register the task for restoring VMs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070502" : {
					"cause" : "Failed to stop the VM.",
					"desc" : "Failed to stop the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070503" : {
					"cause" : "Failed to use a VM template to clone a new VM.",
					"desc" : "Failed to use a VM template to clone a new VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070504" : {
					"cause" : "Failed to detach the disk of the old VM.",
					"desc" : "Failed to detach the disk of the old VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070505" : {
					"cause" : "Failed to detach the disk of the new VM.",
					"desc" : "Failed to detach the disk of the new VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070506" : {
					"cause" : "Failed to attach the disk from the new VM to the old VM.",
					"desc" : "Failed to attach the disk from the new VM to the old VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070507" : {
					"cause" : "Failed to attach the disk from the restored VM to the faulty VM.",
					"desc" : "Failed to attach the disk from the restored VM to the faulty VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070508" : {
					"cause" : "Failed to start the VM.",
					"desc" : "Failed to start the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070509" : {
					"cause" : "Failed to delete the new VM.",
					"desc" : "Failed to delete the new VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070511" : {
					"cause" : "This operation cannot be performed because other tasks are being performed on the VM. Please try again later.",
					"desc" : "This operation cannot be performed because other tasks are being performed on the VM. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070512" : {
					"cause" : "The capacity of the storage where the disk is located is insufficient.",
					"desc" : "The capacity of the storage where the disk is located is insufficient.",
					"solution" : "Please expand the capacity of the storage where the disk is located."
				},
				"1070513" : {
					"cause" : "The disk capacity can only be expanded.",
					"desc" : "The disk capacity can only be expanded.",
					"solution" : "Please enter a value that is greater than the current disk size."
				},
				"1070514" : {
					"cause" : "The cluster does not contain a data store that supports disks in thin-provisioning mode.",
					"desc" : "The cluster does not contain a data store that supports disks in thin-provisioning mode.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070515" : {
					"cause" : "The destination host is faulty.",
					"desc" : "The destination host is faulty.",
					"solution" : "Ensure that the destination host is working properly."
				},
				"1070516" : {
					"cause" : "The VM file is inaccessible.",
					"desc" : "The VM file is inaccessible.",
					"solution" : "Ensure that a VM file exists."
				},
				"1070517" : {
					"cause" : "The destination storage space is insufficient.",
					"desc" : "The destination storage space is insufficient.",
					"solution" : "Ensure that the destination storage space is sufficient."
				},
				"1070518" : {
					"cause" : "A parameter is invalid.",
					"desc" : "A parameter is invalid.",
					"solution" : "Ensure that the entered parameters are valid."
				},
				"1070519" : {
					"cause" : "The destination data store does not support migration.",
					"desc" : "The destination data store does not support migration.",
					"solution" : "Ensure that the destination data store supports migration."
				},
				"1070520" : {
					"cause" : "The destination data store is inaccessible.",
					"desc" : "The destination data store is inaccessible.",
					"solution" : "Ensure that the destination data store is in the normal state."
				},
				"1070521" : {
					"cause" : "The VM template does not support migration.",
					"desc" : "The VM template does not support migration.",
					"solution" : "Ensure that the VM is not a VM template."
				},
				"1070522" : {
					"cause" : "A system exception occurred.",
					"desc" : "A system exception occurred.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070523" : {
					"cause" : "The migration timed out.",
					"desc" : "The migration timed out.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070524" : {
					"cause" : "The migration configuration is incorrect.",
					"desc" : "The migration configuration is incorrect.",
					"solution" : "Please contact Huawei technical support."
				},
				"1070525" : {
					"cause" : "A cool migration is being performed for this VM.",
					"desc" : "A cool migration is being performed for this VM.",
					"solution" : "Ensure that the VM status is correct for migration."
				},
				"1070526" : {
					"cause" : "Failed to register the disk.",
					"desc" : "Failed to register the disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070527" : {
					"cause" : "The VM status is incorrect.",
					"desc" : "The VM status is incorrect.",
					"solution" : "Ensure that the VM is in the correct statue."
				},
				"1070528" : {
					"cause" : "The clock mode of the VM is invalid.",
					"desc" : "The clock mode of the VM is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070529" : {
					"cause" : "The VM OS does not support CPU hot add.",
					"desc" : "The VM OS does not support CPU hot add.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070530" : {
					"cause" : "The VM does not support CPU hot swapping.",
					"desc" : "The VM does not support CPU hot swapping.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070531" : {
					"cause" : "The CPU hot swapping function attribute is modified incorrectly.",
					"desc" : "The CPU hot swapping function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070532" : {
					"cause" : "The VM OS does not support memory installation without stopping the VM.",
					"desc" : "The VM OS does not support memory installation without stopping the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070533" : {
					"cause" : "The memory hot swapping function attribute is modified incorrectly.",
					"desc" : "The memory hot swapping function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070534" : {
					"cause" : "An error occurred on the host.",
					"desc" : "An error occurred on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070535" : {
					"cause" : "Failed to send messages to the host.",
					"desc" : "Failed to send messages to the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070536" : {
					"cause" : "Failed to send messages to the host.",
					"desc" : "Failed to send messages to the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070537" : {
					"cause" : "An error occurred on the host.",
					"desc" : "An error occurred on the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070538" : {
					"cause" : "The CPU and memory parameters for the running VM are modified successfully. The new CPU parameters can take effect only after the VM restarts.",
					"desc" : "The CPU and memory parameters for the running VM are modified successfully. The new CPU parameters can take effect only after the VM restarts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070539" : {
					"cause" : "The CPU and memory parameters for the running VM are modified successfully. The new memory parameters can take effect only after the VM restarts.",
					"desc" : "The CPU and memory parameters for the running VM are modified successfully. The new memory parameters can take effect only after the VM restarts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070541" : {
					"cause" : "Memory snapshots cannot be created for a VM that uses disks for which the Affected by Snapshot parameter is set to No.",
					"desc" : "Memory snapshots cannot be created for a VM that uses disks for which the Affected by Snapshot parameter is set to No.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070542" : {
					"cause" : "The disk does not exist or does not belong to the virtual machine.",
					"desc" : "The disk does not exist or does not belong to the virtual machine.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070543" : {
					"cause" : "The virtual machine must be shut down or boot status.",
					"desc" : "The virtual machine must be shut down or boot status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070544" : {
					"cause" : "The run state virtual machine with snapshot cannot migrate disks.",
					"desc" : "The run state virtual machine with snapshot cannot migrate disks.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070545" : {
					"cause" : "Virtual machine has the share disk, the operation is not allowed.",
					"desc" : "Virtual machine has the share disk, the operation is not allowed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070546" : {
					"cause" : "Virtual machine is the link to the cloned virtual machine, the operation is not allowed.",
					"desc" : "Virtual machine is the link to the cloned virtual machine, the operation is not allowed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070547" : {
					"cause" : "Preparation of network failure.",
					"desc" : "Preparation of network failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070548" : {
					"cause" : "Preparation of disk failure.",
					"desc" : "Preparation of disk failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070549" : {
					"cause" : "Computing nodes transfer failure.",
					"desc" : "Computing nodes transfer failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070550" : {
					"cause" : "The VMware component does not support this operation.",
					"desc" : "The VMware component does not support this operation.",
					"solution" : "Perform this operation on the FusionCompute."
				},
				"1070551" : {
					"cause" : "The host and data storage is not related.",
					"desc" : "The host and data storage is not related.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070552" : {
					"cause" : "The VM disk is inaccessible.",
					"desc" : "The VM disk is inaccessible.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070553" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Refresh the page and try again."
				},
				"1070554" : {
					"cause" : "File-mode VMs do not support migration in Change host and data store mode.",
					"desc" : "File-mode VMs do not support migration in Change host and data store mode.",
					"solution" : "Select VMs that are not in file mode."
				},
				"1070555" : {
					"cause" : "Cannot Disable Drs On Clusters With VApps.",
					"desc" : "Cannot Disable Drs On Clusters With VApps.",
					"solution" : "please delete all the vApps from the hypervisor first."
				},
				"1070580" : {
					"cause" : "Snapshot is not allowed to be created because the VM disks use storage of different types.",
					"desc" : "Snapshot is not allowed to be created because the VM disks use storage of different types.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1070600" : {
					"cause" : "The VM status is incorrect.",
					"desc" : "The VM status is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075000" : {
					"cause" : "The VM configuration is incorrect.",
					"desc" : "The VM configuration is incorrect.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075002" : {
					"cause" : "The system does not support this operation.",
					"desc" : "The system does not support this operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075005" : {
					"cause" : "The VM does not support hot-plugging of CPUs.",
					"desc" : "The VM does not support hot-plugging of CPUs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075006" : {
					"cause" : "Virtual machine State conflict, does not allow this operation.",
					"desc" : "Virtual machine State conflict, does not allow this operation.",
					"solution" : "Please refresh the virtual machine state."
				},
				"1075007" : {
					"cause" : "The VM does not support hot-plugging of memory.",
					"desc" : "The VM does not support hot-plugging of memory.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075009" : {
					"cause" : "The number of virtual devices exceeds the maximum.",
					"desc" : "The number of virtual devices exceeds the maximum.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075099" : {
					"cause" : "The input memory size is not 4 MB's multiple.",
					"desc" : "The input memory size is not 4 MB's multiple.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075013" : {
					"cause" : "The host is faulty.",
					"desc" : "The host is faulty.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075014" : {
					"cause" : "VMware licenses are not enough.",
					"desc" : "VMware licenses are not enough.",
					"solution" : "Please contact your administrator to buy licenses."
				},
				"1075015" : {
					"cause" : "A VMware Tools response exception occurred.",
					"desc" : "A VMware Tools response exception occurred.",
					"solution" : "Please contact the system administrator."
				},
				"1075016" : {
					"cause" : "Failed to customize the VM when creating the VM.",
					"desc" : "Failed to customize the VM when creating the VM.",
					"solution" : "Please check that the VM template is configured correctly."
				},
				"1075017" : {
					"cause" : "Insufficient resources to satisfy configured failover level for HA.",
					"desc" : "Insufficient resources to satisfy configured failover level for HA.",
					"solution" : "Please choose valid reservation to modify the VM."
				},
				"1075018" : {
					"cause" : "The host does not have sufficient CPU resources to satisfy the reservation.",
					"desc" : "The host does not have sufficient CPU resources to satisfy the reservation.",
					"solution" : "Please choose valid reservation to modify the VM."
				},
				"1075019" : {
					"cause" : "The host does not have sufficient Memory resources to satisfy the reservation.",
					"desc" : "The host does not have sufficient Memory resources to satisfy the reservation.",
					"solution" : "Please choose valid reservation to modify the VM."
				},
				"1075020" : {
					"cause" : "Disks that are not attached to a VM do not support capacity expansion.",
					"desc" : "Disks that are not attached to a VM do not support capacity expansion.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075021" : {
					"cause" : "The VM ID in the request is incorrect.",
					"desc" : "The VM ID in the request is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075022" : {
					"cause" : "The target disk size must be greater than the source disk size.",
					"desc" : "The target disk size must be greater than the source disk size.",
					"solution" : "Please modify the size of disk."
				},
				"1075023" : {
					"cause" : "The disk contains snapshots or is a system disk of a linked clone.",
					"desc" : "The disk contains snapshots or is a system disk of a linked clone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075024" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075025" : {
					"cause" : "Expanding the disk capacity...Do not start other disk capacity expansion tasks on the VM.",
					"desc" : "Expanding the disk capacity...Do not start other disk capacity expansion tasks on the VM.",
					"solution" : "Please wait..."
				},
				"1075026" : {
					"cause" : "VM templates do not support disk capacity.",
					"desc" : "VM templates do not support disk capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075027" : {
					"cause" : "The target disk size must be less than the upper limit of the storage type capacity.",
					"desc" : "The target disk size must be less than the upper limit of the storage type capacity.",
					"solution" : "Please change the size of the target disk to be expanded."
				},
				"1075028" : {
					"cause" : "Shared disks do not support disk capacity expansion.",
					"desc" : "Shared disks do not support disk capacity expansion.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075029" : {
					"cause" : "The storage type cannot create non-persistent disk.",
					"desc" : "The storage type cannot create non-persistent disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075030" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"solution" : "Please try later when the task is done."
				},
				"1075031" : {
					"cause" : "Only the normal disk can be unpersistent.",
					"desc" : "Only the normal disk can be unpersistent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075032" : {
					"cause" : "Only the virtual storage disk can be modified the persistent property.",
					"desc" : "Only the virtual storage disk can be modified the persistent property.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075033" : {
					"cause" : "Cannot query disk from BSB.",
					"desc" : "Cannot query disk from BSB.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075034" : {
					"cause" : "The status of disk or the status of attached VM is conflicted, cannot modify the persistent property.",
					"desc" : "The status of disk or the status of attached VM is conflicted, cannot modify the persistent property.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075035" : {
					"cause" : "The storage type cannot create thin disk.",
					"desc" : "The storage type cannot create thin disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075036" : {
					"cause" : "The Not affected by snapshots setting of the disk cannot be changed because the disk has snapshots created.",
					"desc" : "The Not affected by snapshots setting of the disk cannot be changed because the disk has snapshots created.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075037" : {
					"cause" : "Disk migration failed. If the disk is a shared disk, detach it from the VM and try again. If the disk is a non-persistent disk, stop the VM and try again. If the disk has snapshots created, stop the VM or delete the snapshots and try again. If the disk is being created or is copying data, ensure that the disk is working properly and try again after the operation is complete. If the disk is a linked clone system disk or a non-virtualized disk, the disk does not support migration.",
					"desc" : "Disk migration failed. If the disk is a shared disk, detach it from the VM and try again. If the disk is a non-persistent disk, stop the VM and try again. If the disk has snapshots created, stop the VM or delete the snapshots and try again. If the disk is being created or is copying data, ensure that the disk is working properly and try again after the operation is complete. If the disk is a linked clone system disk or a non-virtualized disk, the disk does not support migration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075038" : {
					"cause" : "The destination data store does not support migration because it is not virtualized.",
					"desc" : "The destination data store does not support migration because it is not virtualized.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075039" : {
					"cause" : "Resize disk failed.",
					"desc" : "Resize disk failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075040" : {
					"cause" : "Disk size is not times of 1024.",
					"desc" : "Disk size is not times of 1024.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075041" : {
					"cause" : "Query migrate progress time out.",
					"desc" : "Query migrate progress time out.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075042" : {
					"cause" : "The task has been canceled.",
					"desc" : "The task has been canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075043" : {
					"cause" : "No host can access srcDs and dstDs.",
					"desc" : "No host can access srcDs and dstDs.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075044" : {
					"cause" : "The disk is migrating.",
					"desc" : "The disk is migrating.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075045" : {
					"cause" : "Parameter: refreshflag is invalid.",
					"desc" : "Parameter: refreshflag is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075046" : {
					"cause" : "Failed to invoke the FusionStorage protocol to expand disk.",
					"desc" : "Failed to invoke the FusionStorage protocol to expand disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075047" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075048" : {
					"cause" : "No NIC is configured for the VM.",
					"desc" : "No NIC is configured for the VM.",
					"solution" : "Select a proper boot device."
				},
				"1075049" : {
					"cause" : "No disk is configured for the VM.",
					"desc" : "No disk is configured for the VM.",
					"solution" : "Select a proper boot device."
				},
				"1075050" : {
					"cause" : "The VM computer name does not meet configuration requirements. It can contain a maximum of 13 characters, which can be letters, digits, and hyphens (-) but cannot comprise only digits.",
					"desc" : "The VM computer name does not meet configuration requirements. It can contain a maximum of 13 characters, which can be letters, digits, and hyphens (-) but cannot comprise only digits.",
					"solution" : "Enter a valid VM computer name."
				},
				"1075051" : {
					"cause" : "The VMware Tools is not installed on the VM template.",
					"desc" : "The VMware Tools is not installed on the VM template.",
					"solution" : "Install the latest VMware Tools on the VM template."
				},
				"1075052" : {
					"cause" : "The available CPU resource is insufficient.",
					"desc" : "The available CPU resource is insufficient.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075053" : {
					"cause" : "The available memory resource is insufficient.",
					"desc" : "The available memory resource is insufficient.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075054" : {
					"cause" : "A virtual machine creation or configuration fails because a device specification contains an invalid value.",
					"desc" : "A virtual machine creation or configuration fails because a device specification contains an invalid value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075055" : {
					"cause" : "This hypervisor does not support this operation.",
					"desc" : "This hypervisor does not support this operation.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075056" : {
					"cause" : "This storage type does not support cold migration.",
					"desc" : "This storage type does not support cold migration.",
					"solution" : "Make sure that the VM is running. If the fault persists after the VM is running, contact your administrator or view the help manual."
				},
				"1075059" : {
					"cause" : "The VM's configuration does not supports the live migration of a basic block device to a virtual storage device.",
					"desc" : "The VM's configuration does not supports the live migration of a basic block device to a virtual storage device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075060" : {
					"cause" : "This disk cannot be operate because it has parent node.",
					"desc" : "This disk cannot be operate because it has parent node.",
					"solution" : "null"
				},
				"1075061" : {
					"cause" : "The operation is not allowed because the storage resources in the disaster recovery storage group are insufficient.",
					"desc" : "The operation is not allowed because the storage resources in the disaster recovery storage group are insufficient.",
					"solution" : "The operation is not allowed because the storage resources in the disaster recovery storage group are insufficient."
				},
				"1075062" : {
					"cause" : "Disk size less than 2043G does not support to resize to over 2043G.",
					"desc" : "Disk size less than 2043G does not support to resize to over 2043G.",
					"solution" : "Please input another size."
				},
				"1075063" : {
					"cause" : "Disk size is more than the destination storage max space.",
					"desc" : "Disk size is more than the destination storage max space.",
					"solution" : "Please select other destination storage."
				},
				"1075064" : {
					"cause" : "Mode configuration source disk and the destination disk configuration mode is not consistent.",
					"desc" : "Mode configuration source disk and the destination disk configuration mode is not consistent.",
					"solution" : "Please select the same disk."
				},
				"1075065" : {
					"cause" : "It does not support adjust capacity online for the Non-persistent disk.",
					"desc" : "It does not support adjust capacity online for the Non-persistent disk.",
					"solution" : "Please contact Huawei technical support."
				},
				"1075066" : {
					"cause" : "Non-virtualized disk does not support online clone.",
					"desc" : "Non-virtualized disk does not support online clone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075067" : {
					"cause" : "The datastores where the template and link cloned VM are located must be same type.",
					"desc" : "The datastores where the template and link cloned VM are located must be same type.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075068" : {
					"cause" : "The template and link cloned VM cannot depoly on different datastore which storage type is FusionStorage.",
					"desc" : "The template and link cloned VM cannot depoly on different datastore which storage type is FusionStorage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075069" : {
					"cause" : "The share disk cannot support this operation.",
					"desc" : "The share disk cannot support this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075070" : {
					"cause" : "VM migration failed because the CPU configuration of the destination host is incompatible with that of this VM.",
					"desc" : "VM migration failed because the CPU configuration of the destination host is incompatible with that of this VM.",
					"solution" : "null"
				},
				"1075071" : {
					"cause" : "The operation failed because the system is performing an operation that conflicts with this operation.",
					"desc" : "The operation failed because the system is performing an operation that conflicts with this operation.",
					"solution" : "Please try again later."
				},
				"1075072" : {
					"cause" : "Create the VM Snap fail when the VM is exported.",
					"desc" : "Create the VM Snap fail when the VM is exported.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075073" : {
					"cause" : "Don' export VM because exists independence volume.",
					"desc" : "Don' export VM because exists independence volume.",
					"solution" : "Please try again delete independence volume."
				},
				"1075080" : {
					"cause" : "The VM has backup policy or backup set, can't be converted to template.",
					"desc" : "The VM has backup policy or backup set, can't be converted to template.",
					"solution" : "Please firstly delete the backup policy or backup set."
				},
				"1075081" : {
					"cause" : "Only one clone can be live created at a time.",
					"desc" : "Only one clone can be live created at a time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1075082" : {
					"cause" : "The VM in its current state does not support cloning.",
					"desc" : "The VM in its current state does not support cloning.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080000" : {
					"cause" : "Invalid subnet information.",
					"desc" : "Invalid subnet information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080001" : {
					"cause" : "The subnet or mask prefix format is illegal.",
					"desc" : "The subnet or mask prefix format is illegal.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"cause" : "The gateway is not in the subnet.",
					"desc" : "The gateway is not in the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080005" : {
					"cause" : "The subnet does not exist or has been deleted.",
					"desc" : "The subnet does not exist or has been deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080006" : {
					"cause" : "Do not select a used VLAN ID.",
					"desc" : "Do not select a used VLAN ID.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080007" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080008" : {
					"cause" : "The subnet name already exists.",
					"desc" : "The subnet name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080009" : {
					"cause" : "{0} does not exist in the subnet selected by the resource cluster.",
					"desc" : "{0} does not exist in the subnet selected by the resource cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080010" : {
					"cause" : "Subnet {0} selected by the resource cluster is being used by other resource cluster.",
					"desc" : "Subnet {0} selected by the resource cluster is being used by other resource cluster.",
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
				"1080013" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080014" : {
					"cause" : "Invalid DHCP IP address.",
					"desc" : "Invalid DHCP IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080015" : {
					"cause" : "The aggregation switch does not exist.",
					"desc" : "The aggregation switch does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080016" : {
					"cause" : "The VLAN ID is used.",
					"desc" : "The VLAN ID is used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080017" : {
					"cause" : "The subnet segment is used.",
					"desc" : "The subnet segment is used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080018" : {
					"cause" : "The subnet is being created or deleted.",
					"desc" : "The subnet is being created or deleted.",
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
				"1080024" : {
					"cause" : "The management subnet information does not exist in the database.",
					"desc" : "The management subnet information does not exist in the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080025" : {
					"cause" : "Failed to create the subnet.",
					"desc" : "Failed to create the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080026" : {
					"cause" : "Failed to assign the IP addresses on the management network.",
					"desc" : "Failed to assign the IP addresses on the management network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080027" : {
					"cause" : "Failed to update the management subnet information.",
					"desc" : "Failed to update the management subnet information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080028" : {
					"cause" : "Failed to update the CNA information.",
					"desc" : "Failed to update the CNA information.",
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
				"1080036" : {
					"cause" : "Failed to obtain the CNA information.",
					"desc" : "Failed to obtain the CNA information.",
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
				"1080039" : {
					"cause" : "Failed to query the subnet information.",
					"desc" : "Failed to query the subnet information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080040" : {
					"cause" : "The management subnet information already exists.",
					"desc" : "The management subnet information already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080041" : {
					"cause" : "Failed to delete the subnet.",
					"desc" : "Failed to delete the subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080042" : {
					"cause" : "Failed to modify the subnet because it has been used by a port group.",
					"desc" : "Failed to modify the subnet because it has been used by a port group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080043" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
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
					"cause" : "There is not enough IP in the subnet.",
					"desc" : "There is not enough IP in the subnet.",
					"solution" : "Please choose another network."
				},
				"1080052" : {
					"cause" : "The subnet of network overlaps with the other subnet in VPC.",
					"desc" : "The subnet of network overlaps with the other subnet in VPC.",
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
					"cause" : "The subnet of network overlaps with the subnet of external network or DHCP server.",
					"desc" : "The subnet of network overlaps with the subnet of external network or DHCP server.",
					"solution" : "null"
				},
				"1080057" : {
					"cause" : "The subnet of network overlaps with the subnet of physical manager network.",
					"desc" : "The subnet of network overlaps with the subnet of physical manager network.",
					"solution" : "null"
				},
				"1080058" : {
					"cause" : "The subnet of network overlaps with the subnet of physical business network.",
					"desc" : "The subnet of network overlaps with the subnet of physical business network.",
					"solution" : "null"
				},
				"1080059" : {
					"cause" : "Reserve IP segments contains already allocated IP.",
					"desc" : "Reserve IP segments contains already allocated IP.",
					"solution" : "null"
				},
				"1080060" : {
					"cause" : "Failed to modify the subnet because it is being used by some clusters.",
					"desc" : "Failed to modify the subnet because it is being used by some clusters.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"cause" : "The assigned private IP address has been retained in the system or reserved IP segment.",
					"desc" : "The assigned private IP address has been retained in the system or reserved IP segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080065" : {
					"cause" : "The input IP is not available.",
					"desc" : "The input IP is not available.",
					"solution" : "Please input IP again."
				},
				"1080066" : {
					"cause" : "The available IP ranges do not include the allocated IP.",
					"desc" : "The available IP ranges do not include the allocated IP.",
					"solution" : "Please input the available IP range again."
				},
				"1080067" : {
					"cause" : "Only the subnet with static inject or internal DHCP can appointed IP.",
					"desc" : "Only the subnet with static inject or internal DHCP can appointed IP.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080068" : {
					"cause" : "The assigned private IP address is in the reserved IP segment.",
					"desc" : "The assigned private IP address is in the reserved IP segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1080070" : {
					"cause" : "The total IP of the subnet is great than 65536.",
					"desc" : "The total IP of the subnet is great than 65536.",
					"solution" : "Contact technical support."
				},
				"1080071" : {
					"cause" : "Invalid IPv6 subnet. (Invalid subnet or mask, or the subnet does not match the mask. Invalid subnets: ::/128, ::1/128. System reserved subnets: FF00::/8, FE80::/10.)",
					"desc" : "Invalid IPv6 subnet. (Invalid subnet or mask, or the subnet does not match the mask. Invalid subnets: ::/128, ::1/128. System reserved subnets: FF00::/8, FE80::/10.)",
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
					"solution" : "Please contact technical support engineers."
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
				"1083001" : {
					"cause" : "The subnet mask format is wrong.",
					"desc" : "The subnet mask format is wrong.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1083002" : {
					"cause" : "Enter the correct gateway information.",
					"desc" : "Enter the correct gateway information.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1083007" : {
					"cause" : "The management subnet cannot be modified because the networking mode has not been configured.",
					"desc" : "The management subnet cannot be modified because the networking mode has not been configured.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1083008" : {
					"cause" : "Failed to modify the subnet because the subnet has been added to a cluster. Please open the page again.",
					"desc" : "Failed to modify the subnet because the subnet has been added to a cluster. Please open the page again.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1089998" : {
					"cause" : "The networking mode cannot be modified because the subnet, VLAN, router, or aggregation switch IP address has been configured in the system.",
					"desc" : "The networking mode cannot be modified because the subnet, VLAN, router, or aggregation switch IP address has been configured in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1089999" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090002" : {
					"cause" : "The VLAN range of the VLAN pool overlaps with that of an existing VLAN pool.",
					"desc" : "The VLAN range of the VLAN pool overlaps with that of an existing VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090003" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1090012" : {
					"cause" : "The VLAN POOL associated with DVS.",
					"desc" : "The VLAN POOL associated with DVS.",
					"solution" : "Please unassociated VLAN POOL with DVS."
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
				"1090019" : {
					"cause" : "The DVS which config vtep IP can attach VXLAN pool.Please configurate VTEP IP for the DVS, update hypervisor and retry.",
					"desc" : "The DVS which config vtep IP can attach VXLAN pool.Please configurate VTEP IP for the DVS, update hypervisor and retry.",
					"solution" : "Please input the network name again."
				},
                "1090020" : {
					"cause" : "VLAN pool has been used.",
					"desc" : "VLAN pool has been used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1090050" : {
					"cause" : "The VLAN is not in the VLAN pool.",
					"desc" : "The VLAN is not in the VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1090055" : {
					"cause" : "VLAN pool management usage does not support VXLAN.",
					"desc" : "VLAN pool management usage does not support VXLAN.",
					"solution" : "Please select VLAN"
				},
				"1090056" : {
					"cause" : "There is no available Device connection VLAN",
					"desc" : "There is no available Device connection VLAN",
					"solution" : "Please contact the system administrator."
				},
				"1090057" : {
					"cause" : "VLAN pool management usage does not support to attach DVS.",
					"desc" : "VLAN pool management usage does not support to attach DVS.",
					"solution" : "Please do not attach."
				},
				"1090058" : {
					"cause" : "The vlan not exist.",
					"desc" : "The vlan not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100001" : {
					"cause" : "Failed to create the connection due to a communication exception.",
					"desc" : "Failed to create the connection due to a communication exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100002" : {
					"cause" : "Login failed because the username or password is incorrect.",
					"desc" : "Login failed because the username or password is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100003" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100004" : {
					"cause" : "The number of FusionStorage devices has reached the upper limit.",
					"desc" : "The number of FusionStorage devices has reached the upper limit.",
					"solution" : "Please contact Huawei technical support."
				},
				"1100005" : {
					"cause" : "3 times the original password input error.",
					"desc" : "3 times the original password input error.",
					"solution" : "Please wait 5 minute and try again."
				},
				"1100006" : {
					"cause" : "User does not exist.",
					"desc" : "User does not exist.",
					"solution" : "Please check the user."
				},
				"1100007" : {
					"cause" : "The local modifications to the UHM user password failure.",
					"desc" : "The local modifications to the UHM user password failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100008" : {
					"cause" : "Process restart failed.",
					"desc" : "Process restart failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1100009" : {
					"cause" : "The entered FusionStorage management IP address already exists in the system.",
					"desc" : "The entered FusionStorage management IP address already exists in the system.",
					"solution" : "Please specify the FusionStorage management IP to another value and try again later."
				},
				"1100012" : {
					"cause" : "The entered FusionStorage Domain name already exists in the system.",
					"desc" : "The entered FusionStorage Domain name already exists in the system.",
					"solution" : "Please specify the FusionStorage Domain name to another value and try again later."
				},
				"1100010" : {
					"cause" : "The FusionStorage is communicating with the FusionManager.",
					"desc" : "The FusionStorage is communicating with the FusionManager.",
					"solution" : "Please try again after the ongoing cluster operation is complete."
				},
				"1100011" : {
					"cause" : "The entered server IP address of the FusionStorage device is already used in the system.",
					"desc" : "The entered server IP address of the FusionStorage device is already used in the system.",
					"solution" : "Ensure that the entered server IP address of the FusionStorage device is unique in the system."
				},
				"1100100" : {
					"cause" : "The VMware SDK tool may fail to be installed.",
					"desc" : "The VMware SDK tool may fail to be installed.",
					"solution" : "Install the VMware SDK tool and try again. If the VMware SDK tool is already installed, contact technical support."
				},
				"1100101" : {
					"cause" : "VMware hypervisor does not support this function.",
					"desc" : "VMware hypervisor does not support this function.",
					"solution" : "Contact the system administrator."
				},
				"1110001" : {
					"cause" : "The organization ID is empty.",
					"desc" : "The organization ID is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110002" : {
					"cause" : "A orgVDC has been allocated to the organization.",
					"desc" : "A orgVDC has been allocated to the organization.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110003" : {
					"cause" : "The orgVDC specifications do not meet the requirements: The maximum CPU, memory, and storage are not in the valid range.",
					"desc" : "The orgVDC specifications do not meet the requirements: The maximum CPU, memory, and storage are not in the valid range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110004" : {
					"cause" : "The select resource cluster list in the orgVDC specifications is empty.",
					"desc" : "The select resource cluster list in the orgVDC specifications is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110005" : {
					"cause" : "The select resource cluster in the orgVDC specifications does not exist.",
					"desc" : "The select resource cluster in the orgVDC specifications does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110006" : {
					"cause" : "The orgVDC does not exist.",
					"desc" : "The orgVDC does not exist.",
					"solution" : "The orgVDC doesn't exist, please refresh the page and try again."
				},
				"1110007" : {
					"cause" : "The orgVDC has network resources associated.",
					"desc" : "The orgVDC has network resources associated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110008" : {
					"cause" : "The VCPU upper limit modified by the orgVDC is less than the used capacity.",
					"desc" : "The VCPU upper limit modified by the orgVDC is less than the used capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110009" : {
					"cause" : "The memory upper limit modified by the orgVDC is less than the used capacity.",
					"desc" : "The memory upper limit modified by the orgVDC is less than the used capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110010" : {
					"cause" : "The storage upper limit modified by the orgVDC is less than the used capacity.",
					"desc" : "The storage upper limit modified by the orgVDC is less than the used capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110011" : {
					"cause" : "The orgVDC specifications are null.",
					"desc" : "The orgVDC specifications are null.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110012" : {
					"cause" : "The orgVDC ID list is null.",
					"desc" : "The orgVDC ID list is null.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110013" : {
					"cause" : "Duplicate organization VDC name.",
					"desc" : "Duplicate organization VDC name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110014" : {
					"cause" : "The number of organization VDCs in the system exceeds the upper limit.",
					"desc" : "The number of organization VDCs in the system exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110015" : {
					"cause" : "The number of organization VDCs in the organization exceeds the upper limit.",
					"desc" : "The number of organization VDCs in the organization exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110016" : {
					"cause" : "The organization VDC contains applications and cannot be deleted.",
					"desc" : "The organization VDC contains applications and cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110017" : {
					"cause" : "The organization VDC does not exist.",
					"desc" : "The organization VDC does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110018" : {
					"cause" : "The CPU upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The CPU upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110019" : {
					"cause" : "The memory upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The memory upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110020" : {
					"cause" : "The storage upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The storage upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110021" : {
					"cause" : "The orgVDC failed to be deleted.",
					"desc" : "The orgVDC failed to be deleted.",
					"solution" : "Please check that no VPC is associated with this orgVDC."
				},
				"1110022" : {
					"cause" : "The organization VDC contains VMs and cannot be deleted.",
					"desc" : "The organization VDC contains VMs and cannot be deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1110023" : {
					"cause" : "Cann't disassociate the cluster from VDC because some VMs in the cluster.",
					"desc" : "Cann't disassociate the cluster from VDC because some VMs in the cluster.",
					"solution" : "Please delete the VM from cluster first."
				},
				"1110024" : {
					"cause" : "Cann't disassociate the cluster from VDC because some apps in the cluster.",
					"desc" : "Cann't disassociate the cluster from VDC because some apps in the cluster.",
					"solution" : "Please delete the app from cluster first."
				},
				"1110026" : {
					"cause" : "The public IP upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The public IP upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "The public IP upper limit modified by the organization VDC should be more than the used capacity."
				},
				"1110027" : {
					"cause" : "The hardware firewall upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The hardware firewall upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "The hardware firewall upper limit modified by the organization VDC should be more than the used capacity."
				},
				"1110028" : {
					"cause" : "The software firewall upper limit modified by the organization VDC is less than the used capacity.",
					"desc" : "The software firewall upper limit modified by the organization VDC is less than the used capacity.",
					"solution" : "The software firewall upper limit modified by the organization VDC is less than the used capacity."
				},
				"1111112" : {
					"cause" : "The vCenter processing failed. You can log in to the vCenter to check failure causes and handling suggestions.",
					"desc" : "The vCenter processing failed. You can log in to the vCenter to check failure causes and handling suggestions.",
					"solution" : "The vCenter processing failed. You can log in to the vCenter to check failure causes and handling suggestions."
				},
				"1111113" : {
					"cause" : "The XenServer processing failed.",
					"desc" : "The XenServer processing failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120001" : {
					"cause" : "Failed to modify the time zone.",
					"desc" : "Failed to modify the time zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120002" : {
					"cause" : "Failed to modify the NTP configuration.",
					"desc" : "Failed to modify the NTP configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120003" : {
					"cause" : "Failed to update the BMC IP address pool.",
					"desc" : "Failed to update the BMC IP address pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120004" : {
					"cause" : "Failed to query the BMC IP address pool.",
					"desc" : "Failed to query the BMC IP address pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120005" : {
					"cause" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing subnet.",
					"desc" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120006" : {
					"cause" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing VLAN pool.",
					"desc" : "The VLAN ID of the BMC IP address pool conflicts with the VLAN ID of an existing VLAN pool.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1120013" : {
					"cause" : "Failed to create the BMC IP address pool.",
					"desc" : "Failed to create the BMC IP address pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1130000" : {
					"cause" : "No assignable VLAN.",
					"desc" : "No assignable VLAN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1130001" : {
					"cause" : "Failed to modify the configuration file.",
					"desc" : "Failed to modify the configuration file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1130002" : {
					"cause" : "System error.",
					"desc" : "System error.",
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
				"1140001" : {
					"cause" : "The data center name already exists.",
					"desc" : "The data center name already exists.",
					"solution" : "Please specify a new data center name."
				},
				"1140002" : {
					"cause" : "The maximum number of data centers has been reached.",
					"desc" : "The maximum number of data centers has been reached.",
					"solution" : "Please check whether 10 data centers have been created. If so, delete unwanted data centers and create a data center again."
				},
				"1140003" : {
					"cause" : "The specified data center does not exist.",
					"desc" : "The specified data center does not exist.",
					"solution" : "Please refresh the page and check whether the data center exists."
				},
				"1140004" : {
					"cause" : "There are resources in data center, not allowed to delete.",
					"desc" : "There are resources in data center, not allowed to delete.",
					"solution" : "Please delete the hypervisor in the data center first."
				},
				"1140011" : {
					"cause" : "This hypervisor name already exists.",
					"desc" : "This hypervisor name already exists.",
					"solution" : "Please enter a new name."
				},
				"1140012" : {
					"cause" : "The maximum number of hypervisors has been reached.",
					"desc" : "The maximum number of hypervisors has been reached.",
					"solution" : "Please contact the system administrator."
				},
				"1140013" : {
					"cause" : "Hypervisor does not exist.",
					"desc" : "Hypervisor does not exist.",
					"solution" : "Please refresh the page and check if the hypervisor exists."
				},
				"1140014" : {
					"cause" : "The hypervisor cannot be deleted because a cluster in the hypervisor has been associated with a zone.",
					"desc" : "The hypervisor cannot be deleted because a cluster in the hypervisor has been associated with a zone.",
					"solution" : "Please disassociate the cluster from the zone first."
				},
				"1140015" : {
					"cause" : "The connector already exists in the hypervisor.",
					"desc" : "The connector already exists in the hypervisor.",
					"solution" : "Please enter a new value."
				},
				"1140016" : {
					"cause" : "System inner communication exception.",
					"desc" : "System inner communication exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140017" : {
					"cause" : "The hypervisor is being updated. Please try again later.",
					"desc" : "The hypervisor is being updated. Please try again later.",
					"solution" : "Please refresh the page and ensure that the hypervisor is being updated."
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
					"cause" : "The DVS is associating with VSA network.",
					"desc" : "The DVS is associating with VSA network.",
					"solution" : "Please disassociate DVS and VSA network."
				},
				"1140021" : {
					"cause" : "Zone name already exists.",
					"desc" : "Zone name already exists.",
					"solution" : "Please enter a not exist zone name."
				},
				"1140022" : {
					"cause" : "Zone number reaches the max value.",
					"desc" : "Zone number reaches the max value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140023" : {
					"cause" : "The selected zone does not exist.",
					"desc" : "The selected zone does not exist.",
					"solution" : "Please confirm the zone exists."
				},
				"1140024" : {
					"cause" : "There has resource under the zone.",
					"desc" : "There has resource under the zone.",
					"solution" : "Please delete the resource pool under the zone."
				},
				"1140025" : {
					"cause" : "The zone contains hosts.",
					"desc" : "The zone contains hosts.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140026" : {
					"cause" : "The zone contains storage devices.",
					"desc" : "The zone contains storage devices.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140027" : {
					"cause" : "The zone contains switches.",
					"desc" : "The zone contains switches.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140028" : {
					"cause" : "The VDC is updating, cannot update it in the same time.",
					"desc" : "The VDC is updating, cannot update it in the same time.",
					"solution" : "Please try it later."
				},
				"1140029" : {
					"cause" : "The organization does not exist.",
					"desc" : "The organization does not exist.",
					"solution" : "The organization that you selected has been deleted, please confirm."
				},
				"1140040" : {
					"cause" : "The cluster associated with same DVS must be in same zone.",
					"desc" : "The cluster associated with same DVS must be in same zone.",
					"solution" : "Please select correct zone or cluster."
				},
				"1140041" : {
					"cause" : "This hypervisor already exists.",
					"desc" : "This hypervisor already exists.",
					"solution" : "Please modify hypervisor parameters."
				},
				"1140042" : {
					"cause" : "The cluster contains orgVDCs.",
					"desc" : "The cluster contains orgVDCs.",
					"solution" : "Delete orgVDCs in the cluster first."
				},
				"1140043" : {
					"cause" : "The hypervisor contains an orgVDC.",
					"desc" : "The hypervisor contains an orgVDC.",
					"solution" : "Please delete the orgVDC in the hypervisor first."
				},
				"1140044" : {
					"cause" : "The cluster cannot be disassociated from the zone. An external or organization network is associated with this cluster.",
					"desc" : "The cluster cannot be disassociated from the zone. An external or organization network is associated with this cluster.",
					"solution" : "Delete the external or organization network associated with this cluster first."
				},
				"1140045" : {
					"cause" : "The cluster already associated with a zone.",
					"desc" : "The cluster already associated with a zone.",
					"solution" : "TODO:Not Translated yet."
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
				"1140048" : {
					"cause" : "Storage does not exist or is not associated, please make sure storage exists or resource of hypervisor have been updated.",
					"desc" : "Storage does not exist or is not associated, please make sure storage exists or resource of hypervisor have been updated.",
					"solution" : "Please make sure storage exists or resource of hypervisor have been updated."
				},
				"1140049" : {
					"cause" : "The storage does not exist or is not associated with the hypervisor, make sure the storage already exist or the resources of the hypervisor has been updated.",
					"desc" : "The storage does not exist or is not associated with the hypervisor, make sure the storage already exist or the resources of the hypervisor has been updated.",
					"solution" : "Please update the resources of the hypervisor."
				},
				"1140050" : {
					"cause" : "The source MAC address to be modified does not exist.",
					"desc" : "The source MAC address to be modified does not exist.",
					"solution" : "Ensure that the MAC address to be modified exists."
				},
				"1140051" : {
					"cause" : "The MAC address already exists.",
					"desc" : "The MAC address already exists.",
					"solution" : "Enter a MAC address that does not exist."
				},
				"1140052" : {
					"cause" : "The MAC address is contained in the MAC address segment.",
					"desc" : "The MAC address is contained in the MAC address segment.",
					"solution" : "Enter a MAC address that is not contained in the MAC address segment."
				},
				"1140053" : {
					"cause" : "A maximum of 5 MAC address segments can be configured.",
					"desc" : "A maximum of 5 MAC address segments can be configured.",
					"solution" : "You are not allowed to configure more MAC address segments."
				},
				"1140054" : {
					"cause" : "This MAC address segment and other MAC address segments overlap.",
					"desc" : "This MAC address segment and other MAC address segments overlap.",
					"solution" : "Ensure that the entered MAC address segment does not overlap the existing MAC address segments."
				},
				"1140055" : {
					"cause" : "The reserved MAC address segments (28:6E:D4:88:B2:A1 to 28:6E:D4:88:C6:28) cannot be used.",
					"desc" : "The reserved MAC address segments (28:6E:D4:88:B2:A1 to 28:6E:D4:88:C6:28) cannot be used.",
					"solution" : "Do not enter a reserved MAC address."
				},
				"1140056" : {
					"cause" : "The start MAC address in the MAC address segment is greater than the end MAC address.",
					"desc" : "The start MAC address in the MAC address segment is greater than the end MAC address.",
					"solution" : "Enter that the start MAC address in the MAC address segment is less than the end MAC address"
				},
				"1140057" : {
					"cause" : "The MAC address segment is not allowed to be empty.",
					"desc" : "The MAC address segment is not allowed to be empty.",
					"solution" : "Please enter at least one MAC address segment."
				},
				"1140058" : {
					"cause" : "This MAC address segment contains the independent MAC address.",
					"desc" : "This MAC address segment contains the independent MAC address.",
					"solution" : "Ensure that the entered MAC address segment does not contain the independent MAC address."
				},
				"1140059" : {
					"cause" : "This MAC address segment already exists.",
					"desc" : "This MAC address segment already exists.",
					"solution" : "Please enter a new MAC address segment."
				},
				"1140060" : {
					"cause" : "MAC is invalid.",
					"desc" : "MAC is invalid.",
					"solution" : "Please change another valid MAC address."
				},
				"1140061" : {
					"cause" : "This MAC address segment contains multicast or broadcast address which is invalid.",
					"desc" : "This MAC address segment contains multicast or broadcast address which is invalid.",
					"solution" : "Please change another valid MAC address segment."
				},
				"1140062" : {
					"cause" : "MAC multicast or broadcast address is invalid.",
					"desc" : "MAC multicast or broadcast address is invalid.",
					"solution" : "Please change another valid MAC address."
				},
				"1140063" : {
					"cause" : "The zone contains subrack.",
					"desc" : "The zone contains subrack.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140064" : {
					"cause" : "The hypervisor contains VM.",
					"desc" : "The hypervisor contains VM.",
					"solution" : "Please delete the VM in the hypervisor first."
				},
				"1140065" : {
					"cause" : "The hypervisor contains a disaster recovery storage group.",
					"desc" : "The hypervisor contains a disaster recovery storage group.",
					"solution" : "Please delete the disaster recovery storage group first."
				},
				"1140066" : {
					"cause" : "Failed to disassociate the cluster from the zone. The data store associated with the cluster is already added to a disaster recovery storage group.",
					"desc" : "Failed to disassociate the cluster from the zone. The data store associated with the cluster is already added to a disaster recovery storage group.",
					"solution" : "Remove all of the datastores associated with this cluster from disaster recovery storage group first."
				},
				"1140067" : {
					"cause" : "Failed to disassociate the cluster from the zone. The DVS in the cluster is already associated with a VLAN pool.",
					"desc" : "Failed to disassociate the cluster from the zone. The DVS in the cluster is already associated with a VLAN pool.",
					"solution" : "Unassociate the DVS with the VLAN pool first."
				},
				"1140068" : {
					"cause" : "Failed to disassociate the cluster from the zone. The cluster is already associated with a VSA or VTEP network.",
					"desc" : "Failed to disassociate the cluster from the zone. The cluster is already associated with a VSA or VTEP network.",
					"solution" : "Remove all of the VSA network and VTEP network which this cluster was associated with first."
				},
				"1140069" : {
					"cause" : "Existing router in resources partition, modify the network is not allowed.",
					"desc" : "Existing router in resources partition, modify the network is not allowed.",
					"solution" : "Please delete the router from resource partition."
				},
				"1140071" : {
					"cause" : "The zone contains firewall.",
					"desc" : "The zone contains firewall.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140072" : {
					"cause" : "The zone contains load balancers.",
					"desc" : "The zone contains load balancers.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1140073" : {
					"cause" : "The zone contains an aggregation switch.",
					"desc" : "The zone contains an aggregation switch.",
					"solution" : "Please add other type."
				},
				"1150001" : {
					"cause" : "This operation is not allowed on the storage resource whose type is FusionStorage.",
					"desc" : "This operation is not allowed on the storage resource whose type is FusionStorage.",
					"solution" : "Please try shut down the VM and try again, or contact your administrator."
				},
				"1150002" : {
					"cause" : "FusionStorage System error.",
					"desc" : "FusionStorage System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150003" : {
					"cause" : "The system cannot connect to the FusionStorage.",
					"desc" : "The system cannot connect to the FusionStorage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150004" : {
					"cause" : "Abnormal communication with the FusionStorage.",
					"desc" : "Abnormal communication with the FusionStorage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150005" : {
					"cause" : "The FusionStorage system is performing the rebalance operation. Please wait.",
					"desc" : "The FusionStorage system is performing the rebalance operation. Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150006" : {
					"cause" : "Capacity expansion failed for {0} hosts.{1}",
					"desc" : "Capacity expansion failed for {0} hosts.{1}",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150007" : {
					"cause" : "The target storage pool does not exist.",
					"desc" : "The target storage pool does not exist.",
					"solution" : "Refresh the page and try again."
				},
				"1150008" : {
					"cause" : "The IP address already exists in the system.",
					"desc" : "The IP address already exists in the system.",
					"solution" : "Ensure that the IP address is unique in the system."
				},
				"1150009" : {
					"cause" : "The IP address format is incorrect.",
					"desc" : "The IP address format is incorrect.",
					"solution" : "Ensure that the IP address format is correct."
				},
				"1150010" : {
					"cause" : "The host for capacity expansion already exists in the storage.",
					"desc" : "The host for capacity expansion already exists in the storage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150011" : {
					"cause" : "The FusionStorage process exists on the host. The host may be in use or contain old data.",
					"desc" : "The FusionStorage process exists on the host. The host may be in use or contain old data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150012" : {
					"cause" : "The number of hard disks on the host is insufficient.",
					"desc" : "The number of hard disks on the host is insufficient.",
					"solution" : "Please check that the number of hard disks on the host satisfy configuration demand."
				},
				"1150013" : {
					"cause" : "The sizes of disks on hosts are different.",
					"desc" : "The sizes of disks on hosts are different.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150014" : {
					"cause" : "The types of disks on hosts are different.",
					"desc" : "The types of disks on hosts are different.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150015" : {
					"cause" : "The number of service disks is out of range.",
					"desc" : "The number of service disks is out of range.",
					"solution" : "Ensure that the number of service disks is within the range of the disk specifications.l."
				},
				"1150016" : {
					"cause" : "The host may have the following problems: 1. Insufficient memory. 2. The disks of the host contain old data. 3. Disk error.",
					"desc" : "The host may have the following problems: 1. Insufficient memory. 2. The disks of the host contain old data. 3. Disk error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150017" : {
					"cause" : "The FusionStorage system is busy and this operation cannot be performed. Please wait.",
					"desc" : "The FusionStorage system is busy and this operation cannot be performed. Please wait.",
					"solution" : "Please wait."
				},
				"1150018" : {
					"cause" : "The FusionStorage fails to communicate with the host.",
					"desc" : "The FusionStorage fails to communicate with the host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150019" : {
					"cause" : "Some invalid hosts exist in the FusionStorage system.",
					"desc" : "Some invalid hosts exist in the FusionStorage system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150020" : {
					"cause" : "A host is being deleted from the storage pool. Please try again later.",
					"desc" : "A host is being deleted from the storage pool. Please try again later.",
					"solution" : "Please try again later."
				},
				"1150021" : {
					"cause" : "Disk slots settings not correct.",
					"desc" : "Disk slots settings not correct.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150022" : {
					"cause" : "The specified management IP address is invalid.",
					"desc" : "The specified management IP address is invalid.",
					"solution" : "Enter the correct management IP address."
				},
				"1150023" : {
					"cause" : "No FusionStorage client exists in the system.",
					"desc" : "No FusionStorage client exists in the system.",
					"solution" : "Add a FusionStorage client and try again."
				},
				"1150024" : {
					"cause" : "The host list for capacity reduction contains several hosts that have been added to the storage pool, please reduce the capacities of hosts in the cluster one by one.",
					"desc" : "The host list for capacity reduction contains several hosts that have been added to the storage pool, please reduce the capacities of hosts in the cluster one by one.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150025" : {
					"cause" : "The cluster contains several hosts that have been added to the storage pool, please reduce the capacities of hosts in the cluster one by one first.",
					"desc" : "The cluster contains several hosts that have been added to the storage pool, please reduce the capacities of hosts in the cluster one by one first.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150026" : {
					"cause" : "Disk number is less or equal with current system configuration.",
					"desc" : "Disk number is less or equal with current system configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150027" : {
					"cause" : "Security-level topology for the FusionStorage cannot be a heterogeneous topology.",
					"desc" : "Security-level topology for the FusionStorage cannot be a heterogeneous topology.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150028" : {
					"cause" : "Data rebalancing in a partition is in progress. Please wait.",
					"desc" : "Data rebalancing in a partition is in progress. Please wait.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150029" : {
					"cause" : "The storage pool name is incorrect.",
					"desc" : "The storage pool name is incorrect.",
					"solution" : "The name is a string of 1 to 64 characters, which can contain only letters, digits, and underscores (_)."
				},
				"1150030" : {
					"cause" : "This operation is not allowed because no FusionStorage pool exists in the system.",
					"desc" : "This operation is not allowed because no FusionStorage pool exists in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150031" : {
					"cause" : "The data disk used by the management cluster does not exist or is unavailable.",
					"desc" : "The data disk used by the management cluster does not exist or is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150032" : {
					"cause" : "Operation failed.",
					"desc" : "Operation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150033" : {
					"cause" : "Operation failed.",
					"desc" : "Operation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150034" : {
					"cause" : "{0}hosts failed to create the FusionStorage client.{1}",
					"desc" : "{0}hosts failed to create the FusionStorage client.{1}",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150035" : {
					"cause" : "{0}hosts failed to clear the FusionStorage node.{1}",
					"desc" : "{0}hosts failed to clear the FusionStorage node.{1}",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150036" : {
					"cause" : "The operation request timed out.",
					"desc" : "The operation request timed out.",
					"solution" : "Ensure that the network is connected and try again."
				},
				"1150037" : {
					"cause" : "Failed to configure FusionStorage parameters.",
					"desc" : "Failed to configure FusionStorage parameters.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150038" : {
					"cause" : "The specified IP address, port, username, or password may be incorrect, or the network is disconnected.",
					"desc" : "The specified IP address, port, username, or password may be incorrect, or the network is disconnected.",
					"solution" : "Ensure that the specified IP address, username, and password are correct and the network is connected."
				},
				"1150039" : {
					"cause" : "The NVDIMM is faulty. Please replace it.",
					"desc" : "The NVDIMM is faulty. Please replace it.",
					"solution" : "The NVDIMM is faulty. Please replace it."
				},
				"1150040" : {
					"cause" : "Failed to obtain the storage IP address of the node.",
					"desc" : "Failed to obtain the storage IP address of the node.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150041" : {
					"cause" : "A FusionStorage management cluster already exists in the system.",
					"desc" : "A FusionStorage management cluster already exists in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150043" : {
					"cause" : "The sizes of data disks used by the management cluster are different.",
					"desc" : "The sizes of data disks used by the management cluster are different.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150044" : {
					"cause" : "The types of data disks used by the management cluster are different.",
					"desc" : "The types of data disks used by the management cluster are different.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150045" : {
					"cause" : "This operation is not allowed because no FusionStorage management cluster exists in the system.",
					"desc" : "This operation is not allowed because no FusionStorage management cluster exists in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150046" : {
					"cause" : "Failed to delete the FusionStorage management cluster.",
					"desc" : "Failed to delete the FusionStorage management cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150048" : {
					"cause" : "A disk that has not been authenticated by Huawei exists in the system.",
					"desc" : "A disk that has not been authenticated by Huawei exists in the system.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150050" : {
					"cause" : "The FusionStorage client does not exist.",
					"desc" : "The FusionStorage client does not exist.",
					"solution" : "Refresh the page and try again."
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
				"1150055" : {
					"cause" : "The FusionStorageManager failed to connect to the host.",
					"desc" : "The FusionStorageManager failed to connect to the host.",
					"solution" : "Ensure that the FusionStorage Manager can communicate with the host."
				},
				"1150056" : {
					"cause" : "The FusionStorage Manager failed to start the task.",
					"desc" : "The FusionStorage Manager failed to start the task.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150057" : {
					"cause" : "No FusionStorage device is available.",
					"desc" : "No FusionStorage device is available.",
					"solution" : "Ensure that a FusionStorage device is available."
				},
				"1150058" : {
					"cause" : "No installation file exists.",
					"desc" : "No installation file exists.",
					"solution" : "Please contact technical support."
				},
				"1150059" : {
					"cause" : "The management IP address cannot be changed because no FusionStorage device is available.",
					"desc" : "The management IP address cannot be changed because no FusionStorage device is available.",
					"solution" : "Please check if FusionStorage logic device is available."
				},
				"1150060" : {
					"cause" : "No blade is installed in the specified slots.",
					"desc" : "No blade is installed in the specified slots.",
					"solution" : "Change the slot range or install blades in the specified slots."
				},
				"1150061" : {
					"cause" : "A database blade is installed in the specified slots.",
					"desc" : "A database blade is installed in the specified slots.",
					"solution" : "Change the slot range."
				},
				"1150062" : {
					"cause" : "The specified slot range contains less than 3 slots.",
					"desc" : "The specified slot range contains less than 3 slots.",
					"solution" : "Change the slot range and ensure that the slot range contains at least 3 slots."
				},
				"1150064" : {
					"cause" : "The Storage Cluster exists on Logical device, delete failed.",
					"desc" : "The Storage Cluster exists on Logical device, delete failed.",
					"solution" : "Please Clean the Storage Cluster first."
				},
				"1150065" : {
					"cause" : "The entered slot ID range contains slot IDs included in the slot ID range of an existing FusionStorage Manager.",
					"desc" : "The entered slot ID range contains slot IDs included in the slot ID range of an existing FusionStorage Manager.",
					"solution" : "Please enter the correct slot ID range."
				},
				"1150067" : {
					"cause" : "Failed to install FusionStorageAgent.",
					"desc" : "Failed to install FusionStorageAgent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1150068" : {
					"cause" : "Query dsware storage status fail.",
					"desc" : "Query dsware storage status fail.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162012" : {
					"cause" : "The SNAT current network is open.",
					"desc" : "The SNAT current network is open.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162013" : {
					"cause" : "This network is being used by VPN connection.",
					"desc" : "This network is being used by VPN connection.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162014" : {
					"cause" : "This network is being used by direct network.",
					"desc" : "This network is being used by direct network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162015" : {
					"cause" : "This network is being used by software virtual firewall.",
					"desc" : "This network is being used by software virtual firewall.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162016" : {
					"cause" : "There are manually acquired IP addresses in this network.",
					"desc" : "There are manually acquired IP addresses in this network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162017" : {
					"cause" : "This network is being used by VLB.",
					"desc" : "This network is being used by VLB.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162018" : {
					"cause" : "It doesn't support this operation because the VM is associated with VLB.",
					"desc" : "It doesn't support this operation because the VM is associated with VLB.",
					"solution" : "Please dissociate the VM from VLB and try again."
				},
				"1162019" : {
					"cause" : "It doesn't support this operation because the network is associated with DNAT.",
					"desc" : "It doesn't support this operation because the network is associated with DNAT.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162020" : {
					"cause" : "It doesn't support this operation because the network is associated with EIP.",
					"desc" : "It doesn't support this operation because the network is associated with EIP.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162117" : {
					"cause" : "The current state of the network does not support this operation, please try again later.",
					"desc" : "The current state of the network does not support this operation, please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162118" : {
					"cause" : "The new number of available IP addresses is less than the number of IP addresses assigned to the network.",
					"desc" : "The new number of available IP addresses is less than the number of IP addresses assigned to the network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162200" : {
					"cause" : "The number of VPC specification exceeds the upper limit.",
					"desc" : "The number of VPC specification exceeds the upper limit.",
					"solution" : "null"
				},
				"1162201" : {
					"cause" : "The VPC specification name already exists.",
					"desc" : "The VPC specification name already exists.",
					"solution" : "null"
				},
				"1162202" : {
					"cause" : "The VPC specification does not exist.",
					"desc" : "The VPC specification does not exist.",
					"solution" : "null"
				},
				"1162203" : {
					"cause" : "The VPC specification is in use.",
					"desc" : "The VPC specification is in use.",
					"solution" : "null"
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
				"1162502" : {
					"cause" : "The subnet is not available or deleted.",
					"desc" : "The subnet is not available or deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162503" : {
					"cause" : "The VLAN ID is not available or the corresponding VLAN pool is unavailable.",
					"desc" : "The VLAN ID is not available or the corresponding VLAN pool is unavailable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162504" : {
					"cause" : "The subnet is not available or deleted.",
					"desc" : "The subnet is not available or deleted.",
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
					"cause" : "The VPC does not exist.",
					"desc" : "The VPC does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1162509" : {
					"cause" : "Failed to create the subnet on the VFW.",
					"desc" : "Failed to create the subnet on the VFW.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1162513" : {
					"cause" : "Failed to delete the subnet on the VFW.",
					"desc" : "Failed to delete the subnet on the VFW.",
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162520" : {
					"cause" : "The VLAN has been used by a VLAN-type network and cannot be used to create subnet-type network.",
					"desc" : "The VLAN has been used by a VLAN-type network and cannot be used to create subnet-type network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162521" : {
					"cause" : "The VLAN has been used by a subnet of another network.",
					"desc" : "The VLAN has been used by a subnet of another network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162522" : {
					"cause" : "The network is not a direct network.",
					"desc" : "The network is not a direct network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162523" : {
					"cause" : "There is no available VSA manager network.",
					"desc" : "There is no available VSA manager network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162524" : {
					"cause" : "A VPC can create a maximum of 200 DHCP network.",
					"desc" : "A VPC can create a maximum of 200 DHCP network.",
					"solution" : "Please contact your administrator."
				},
				"1162525" : {
					"cause" : "There is no available VTEP network.",
					"desc" : "There is no available VTEP network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162526" : {
					"cause" : "Failed to delete DHCP subnet on VSA.",
					"desc" : "Failed to delete DHCP subnet on VSA.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162527" : {
					"cause" : "Subnet and the public IP pool conflicts.",
					"desc" : "Subnet and the public IP pool conflicts.",
					"solution" : "Please refresh the manual IP list and try again."
				},
				"1162528" : {
					"cause" : "The manual IP doesn't exist",
					"desc" : "The manual IP doesn't exist",
					"solution" : "Please refresh the manual IP list and try again."
				},
				"1162529" : {
					"cause" : "The DHCP server for external network does not exist.",
					"desc" : "The DHCP server for external network does not exist.",
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
				"1162545" : {
					"cause" : "The vlan of the external network does not associate with the selected DVS.",
					"desc" : "The vlan of the external network does not associate with the selected DVS.",
					"solution" : "Contact technical support."
				},
				"1162550" : {
					"cause" : "The current router does not support the VXLAN network.",
					"desc" : "The current router does not support the VXLAN network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
                "1162650": {
					"cause":"The orgnetwork query time out.",
					"desc":"The orgnetwork query time out.",
					"solution":"Please contact your administrator or view the help manual."
				},
				"1163001" : {
					"cause" : "Operations are not allowed when the VFW is in the current state.",
					"desc" : "Operations are not allowed when the VFW is in the current state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163002" : {
					"cause" : "Failed to set the VFW properties.",
					"desc" : "Failed to set the VFW properties.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163003" : {
					"cause" : "The association relationship between the VFW and the VPC is abnormal.",
					"desc" : "The association relationship between the VFW and the VPC is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163004" : {
					"cause" : "No available VFW exists in the resource zone.",
					"desc" : "No available VFW exists in the resource zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163005" : {
					"cause" : "The VFW does not belong to the current resource zone.",
					"desc" : "The VFW does not belong to the current resource zone.",
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
					"cause" : "There is elastic IP in VPC, cannot release virtual firewall.",
					"desc" : "There is elastic IP in VPC, cannot release virtual firewall.",
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
				"1166001" : {
					"cause" : "The ACL does not exist.",
					"desc" : "The ACL does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166003" : {
					"cause" : "The virtual firewall is freezed.cannot create ACL.",
					"desc" : "The virtual firewall is freezed.cannot create ACL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166004" : {
					"cause" : "The status of virtual fire wall is not ready. cannot delete ACL.",
					"desc" : "The status of virtual fire wall is not ready. cannot delete ACL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166005" : {
					"cause" : "The status of VFW is not ready. cannot add ACL rule.",
					"desc" : "The status of VFW is not ready. cannot add ACL rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166006" : {
					"cause" : "The virtual firewall is freezed.cannot create ACL rule.",
					"desc" : "The virtual firewall is freezed.cannot create ACL rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166007" : {
					"cause" : "The firewall ACL has already existed.",
					"desc" : "The firewall ACL has already existed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166009" : {
					"cause" : "Create ACL failed on the device.",
					"desc" : "Create ACL failed on the device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166011" : {
					"cause" : "Create ACL rule failed on the device.",
					"desc" : "Create ACL rule failed on the device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166012" : {
					"cause" : "Delete ACL rule failed on the device.",
					"desc" : "Delete ACL rule failed on the device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166013" : {
					"cause" : "The status of ACL is not ready. cannot delete it.",
					"desc" : "The status of ACL is not ready. cannot delete it.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166014" : {
					"cause" : "The status of ACL is not ready.",
					"desc" : "The status of ACL is not ready.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166015" : {
					"cause" : "The status of ACL is not ready.",
					"desc" : "The status of ACL is not ready.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166016" : {
					"cause" : "The status of VPC does not allow to create firewall ACL.",
					"desc" : "The status of VPC does not allow to create firewall ACL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166017" : {
					"cause" : "The network is not route network.cannot create NetACL.",
					"desc" : "The network is not route network.cannot create NetACL.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166018" : {
					"cause" : "The VPC is not applied any router.",
					"desc" : "The VPC is not applied any router.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166019" : {
					"cause" : "Elastic IP and the ACL belong to different VFW.",
					"desc" : "Elastic IP and the ACL belong to different VFW.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166020" : {
					"cause" : "The ACL is not firewall ACL.cannot create firewall ACL rule.",
					"desc" : "The ACL is not firewall ACL.cannot create firewall ACL rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166021" : {
					"cause" : "The ACL is not NetACL. cannot create NetACL rule.",
					"desc" : "The ACL is not NetACL. cannot create NetACL rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166022" : {
					"cause" : "The ACL rule does not exist.",
					"desc" : "The ACL rule does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166023" : {
					"cause" : "The network status is not ready. cannot create NetACL rule.",
					"desc" : "The network status is not ready. cannot create NetACL rule.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166025" : {
					"cause" : "ACL rule is not steady, and then the operation is not permitted.",
					"desc" : "ACL rule is not steady, and then the operation is not permitted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1166027" : {
					"cause" : "The firewall rule does not belong to the VPC.",
					"desc" : "The firewall rule does not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1166028" : {
					"cause" : "The current network mode does not support intra-zone ACL.",
					"desc" : "The current network mode does not support intra-zone ACL.",
					"solution" : "Contact technical support."
				},
				"1167002" : {
					"cause" : "SNAT is not enabled.",
					"desc" : "SNAT is not enabled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167007" : {
					"cause" : "No available public port.",
					"desc" : "No available public port.",
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
				"1167015" : {
					"cause" : "Failed to enable NAT on the device.",
					"desc" : "Failed to enable NAT on the device.",
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167032" : {
					"cause" : "Some ports that are excluded from the modified port range are in use.",
					"desc" : "Some ports that are excluded from the modified port range are in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167033" : {
					"cause" : "The VM does not have a NIC that supports DNAT.",
					"desc" : "The VM does not have a NIC that supports DNAT.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167034" : {
					"cause" : "The zone does not have parameters configured for VM access through a public network.",
					"desc" : "The zone does not have parameters configured for VM access through a public network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167035" : {
					"cause" : "The network is not a routed network.",
					"desc" : "The network is not a routed network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167036" : {
					"cause" : "SNAT is already configured on the network.",
					"desc" : "SNAT is already configured on the network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167037" : {
					"cause" : "The system does not support this protocol.",
					"desc" : "The system does not support this protocol.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167038" : {
					"cause" : "The network is not contained in the specified VPC.",
					"desc" : "The network is not contained in the specified VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167039" : {
					"cause" : "The network has not been created.",
					"desc" : "The network has not been created.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167040" : {
					"cause" : "SNAT is not enabled on any network in the VPC.",
					"desc" : "SNAT is not enabled on any network in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167041" : {
					"cause" : "DNAT is already enabled on the VM.",
					"desc" : "DNAT is already enabled on the VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167045" : {
					"cause" : "The NIC and private port has been configured DNAT.",
					"desc" : "The NIC and private port has been configured DNAT.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167046" : {
					"cause" : "Failed to create external sub-interface.",
					"desc" : "Failed to create external sub-interface.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167047" : {
					"cause" : "The private IP address and private port has been configured DNAT.",
					"desc" : "The private IP address and private port has been configured DNAT.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167048" : {
					"cause" : "The public IP address and public port has been configured DNAT.",
					"desc" : "The public IP address and public port has been configured DNAT.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167049" : {
					"cause" : "No available public IP address in VPC.",
					"desc" : "No available public IP address in VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167050" : {
					"cause" : "The public IP address is already used in VPC.",
					"desc" : "The public IP address is already used in VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167051" : {
					"cause" : "It has reached the upper limit of public IP under VDC.",
					"desc" : "It has reached the upper limit of public IP under VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167052" : {
					"cause" : "It has reached the upper limit of hardware virtual firewall under VDC.",
					"desc" : "It has reached the upper limit of hardware virtual firewall under VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167053" : {
					"cause" : "It has reached the upper limit of software virtual firewall under VDC.",
					"desc" : "It has reached the upper limit of software virtual firewall under VDC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167054" : {
					"cause" : "The assigned public IP is not under VPC public IP.",
					"desc" : "The assigned public IP is not under VPC public IP.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167055" : {
					"cause" : "The assigned public IP does not exist under VPC.",
					"desc" : "The assigned public IP does not exist under VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167056" : {
					"cause" : "The assigned public IP and the public IP of Opened SNAT are inconsistent.",
					"desc" : "The assigned public IP and the public IP of Opened SNAT are inconsistent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167057" : {
					"cause" : "There are public IP under VPC, does not allow to release the virtual firewall.",
					"desc" : "There are public IP under VPC, does not allow to release the virtual firewall.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167058" : {
					"cause" : "The appointed public IP does not exist in public IP pool.",
					"desc" : "The appointed public IP does not exist in public IP pool.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167059" : {
					"cause" : "The available public IP under the zone is insufficient.",
					"desc" : "The available public IP under the zone is insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167060" : {
					"cause" : "The available public IP of appointed public IP pool is insufficient.",
					"desc" : "The available public IP of appointed public IP pool is insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167061" : {
					"cause" : "Insufficient public IP addresses for the external network of the virtual firewall.",
					"desc" : "Insufficient public IP addresses for the external network of the virtual firewall.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167062" : {
					"cause" : "The public port is already in use.",
					"desc" : "The public port is already in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167063" : {
					"cause" : "The VM or network does not belong to the VPC.",
					"desc" : "The VM or network does not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1167064" : {
					"cause" : "DNAT does not belong to the VPC.",
					"desc" : "DNAT does not belong to the VPC.",
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
				"1167207" : {
					"cause" : "The pointed nic does not exist.",
					"desc" : "The pointed nic does not exist.",
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
					"cause" : "The elastic IP address is being unbound from?the VM.",
					"desc" : "The elastic IP address is being unbound from?the VM.",
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
					"cause" : "The applied public IP exceed the maximun number.",
					"desc" : "The applied public IP exceed the maximun number.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167215" : {
					"cause" : "There is no NIC can be bound to elastic ip.",
					"desc" : "There is no NIC can be bound to elastic ip.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167216" : {
					"cause" : "The EIP VPC is not consistent with the NIC VPC.",
					"desc" : "The EIP VPC is not consistent with the NIC VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167217" : {
					"cause" : "This EIP has ACL rules.",
					"desc" : "This EIP has ACL rules.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167218" : {
					"cause" : "The private IP does not exist.",
					"desc" : "The private IP does not exist.",
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
				"1167232" : {
					"cause" : "The elastic IP address does not belong to the VPC.",
					"desc" : "The elastic IP address does not belong to the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167300" : {
					"cause" : "Duplicate IP address pool name.",
					"desc" : "Duplicate IP address pool name.",
					"solution" : "Please reenter a name."
				},
				"1167301" : {
					"cause" : "Public IP addresses have been added to other public IP address pools.",
					"desc" : "Public IP addresses have been added to other public IP address pools.",
					"solution" : "Please change the public IP address segment."
				},
				"1167302" : {
					"cause" : "The public IP address pool does not exist.",
					"desc" : "The public IP address pool does not exist.",
					"solution" : "Please refresh the public IP address pool list again."
				},
				"1167303" : {
					"cause" : "IP addresses in the IP address pool are allocated or in use. Therefore, the IP address pool cannot be deleted.",
					"desc" : "IP addresses in the IP address pool are allocated or in use. Therefore, the IP address pool cannot be deleted.",
					"solution" : "Please contact the system administrator."
				},
				"1167304" : {
					"cause" : "IP addresses in the IP address pool do not exist.",
					"desc" : "IP addresses in the IP address pool do not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1167305" : {
					"cause" : "IP addresses in the IP address pool are in use.",
					"desc" : "IP addresses in the IP address pool are in use.",
					"solution" : "Please contact the system administrator."
				},
				"1167306" : {
					"cause" : "You can add a maximum of 1024 IP address segments in a public IP address pool.",
					"desc" : "You can add a maximum of 1024 IP address segments in a public IP address pool.",
					"solution" : "Please contact the system administrator."
				},
				"1167307" : {
					"cause" : "You can add a maximum of 16 IP address pools in a zone.",
					"desc" : "You can add a maximum of 16 IP address pools in a zone.",
					"solution" : "Please contact the system administrator."
				},
				"1167308" : {
					"cause" : "The IP and zone id do not match.",
					"desc" : "The IP and zone id do not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1167309" : {
					"cause" : "The subnet of the public IP address segment conflicts with the external network subnet.",
					"desc" : "The subnet of the public IP address segment conflicts with the external network subnet.",
					"solution" : "Please contact the system administrator."
				},
				"1167310" : {
					"cause" : "The public IP address is already released.",
					"desc" : "The public IP address is already released.",
					"solution" : "Please contact the system administrator."
				},
				"1167311" : {
					"cause" : "The public IP address segments are conflicted in the public IP pool.",
					"desc" : "The public IP address segments are conflicted in the public IP pool.",
					"solution" : "Please contact the system administrator."
				},
                "1167321" : {
					"cause" : "Public IP number exceeds the maximum size.",
					"desc" : "Public IP number exceeds the maximum size.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1169002" : {
					"cause" : "This IP is not set on VFW.",
					"desc" : "This IP is not set on VFW.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1169101" : {
					"cause" : "The IP bandwidth specification does not exist.",
					"desc" : "The IP bandwidth specification does not exist.",
					"solution" : "Please refresh the IP bandwidth specification list and try again."
				},
				"1169103" : {
					"cause" : "The number of IP bandwidth specification exceeds the upper limit.",
					"desc" : "The number of IP bandwidth specification exceeds the upper limit.",
					"solution" : "null"
				},
				"1169105" : {
					"cause" : "Failed to configure IP bandwith on the device.",
					"desc" : "Failed to configure IP bandwith on the device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1170011" : {
					"cause" : "The VSA Management Subnet exceeds the maximum value of 16 in One Zone.",
					"desc" : "The VSA Management Subnet exceeds the maximum value of 16 in One Zone.",
					"solution" : "Please re network planning."
				},
				"1170012" : {
					"cause" : "The network name is conflict with others.",
					"desc" : "The network name is conflict with others.",
					"solution" : "Please input the network name again."
				},
				"1170014" : {
					"cause" : "The IP ranges are conflict with the exist IP ranges",
					"desc" : "The IP ranges are conflict with the exist IP ranges",
					"solution" : "Please input again"
				},
				"1170015" : {
					"cause" : "The network is in use",
					"desc" : "The network is in use",
					"solution" : "Please operate when network is not in use"
				},
				"1170016" : {
					"cause" : "The VSA network does not exist",
					"desc" : "The VSA network does not exist",
					"solution" : ""
				},
				"1170017" : {
					"cause" : "VLAN number already exists in the current zone.",
					"desc" : "VLAN number already exists in the current zone.",
					"solution" : "Please re select the VLAN number."
				},
				"1170018" : {
					"cause" : "Subnet already exists in other zone.",
					"desc" : "Subnet already exists in other zone.",
					"solution" : "Please input subnet info again"
				},
				"1170021" : {
					"cause" : "The available IP is invalid.",
					"desc" : "The available IP is invalid.",
					"solution" : "Please re network planning."
				},
				"1170022" : {
					"cause" : "The available IP ranges are conflict.",
					"desc" : "The available IP ranges are conflict.",
					"solution" : "Please input the available IP ranges again."
				},
				"1170024" : {
					"cause" : "This VLAN conflicts with a VLAN in the VLAN pool.",
					"desc" : "This VLAN conflicts with a VLAN in the VLAN pool.",
					"solution" : "Please contact Huawei technical support."
				},
				"1170025" : {
					"cause" : "Subnet available IP total number exceeds the maximum limit the size of 128",
					"desc" : "Subnet available IP total number exceeds the maximum limit the size of 128",
					"solution" : "Please input subnet info again"
				},
				"1170026" : {
					"cause" : "VSA Management Network and External Network have overlapping",
					"desc" : "VSA Management Network and External Network have overlapping",
					"solution" : "Please input again"
				},
				"1170027" : {
					"cause" : "The VSA management network overlaps with the VPC network.",
					"desc" : "The VSA management network overlaps with the VPC network.",
					"solution" : "Please input again."
				},
				"1170028" : {
					"cause" : "Only FusionCompute support DHCP server.",
					"desc" : "Only FusionCompute support DHCP server.",
					"solution" : "Contact technical support."
				},
				"1170029" : {
					"cause" : "The vlan is different, and the subnet should be different.",
					"desc" : "The vlan is different, and the subnet should be different.",
					"solution" : "Contact technical support."
				},
				"1180000" : {
					"cause" : "No available DHCP VSA in the VPC.",
					"desc" : "No available DHCP VSA in the VPC.",
					"solution" : "Please contact the system administrator."
				},
				"11800120" : {
					"cause" : "VM status is not running.",
					"desc" : "VM status is not running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180100" : {
					"cause" : "The DHCP server does not exist.",
					"desc" : "The DHCP server does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180101" : {
					"cause" : "Failed to create the VSA VM.",
					"desc" : "Failed to create the VSA VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180102" : {
					"cause" : "Failed to add the VSA external interface.",
					"desc" : "Failed to add the VSA external interface.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180103" : {
					"cause" : "Failed to add the VSA.",
					"desc" : "Failed to add the VSA.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180104" : {
					"cause" : "VSA VM template does not exist.",
					"desc" : "VSA VM template does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180105" : {
					"cause" : "VPC has already applyed virtual firewall.",
					"desc" : "VPC has already applyed virtual firewall.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"cause" : "The external network and VPC does not belong same zone.",
					"desc" : "The external network and VPC does not belong same zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180110" : {
					"cause" : "IP assignment mode of external network is not static-manual.",
					"desc" : "IP assignment mode of external network is not static-manual.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180111" : {
					"cause" : "Firewall VSA status does not allow this operation.",
					"desc" : "Firewall VSA status does not allow this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180112" : {
					"cause" : "Get firewall VSA VM ip failed.",
					"desc" : "Get firewall VSA VM ip failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180113" : {
					"cause" : "There is no available external netowrk.",
					"desc" : "There is no available external netowrk.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180114" : {
					"cause" : "There is no available VSA manage network.",
					"desc" : "There is no available VSA manage network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180115" : {
					"cause" : "There is no available VTEP network.",
					"desc" : "There is no available VTEP network.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180116" : {
					"cause" : "Firewall VSA is not in the VPC.",
					"desc" : "Firewall VSA is not in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180117" : {
					"cause" : "No firewall VSA exist.",
					"desc" : "No firewall VSA exist.",
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
					"cause" : "Create VSA VM failed.",
					"desc" : "Create VSA VM failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180122" : {
					"cause" : "There are external networks whose IP address assignment mode is set to internal DHCP in the zone.",
					"desc" : "There are external networks whose IP address assignment mode is set to internal DHCP in the zone.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180123" : {
					"cause" : "The nic type of host don't support vxlan.",
					"desc" : "The nic type of host don't support vxlan.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180125" : {
					"cause" : "Failed to add route.",
					"desc" : "Failed to add route.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1180126" : {
					"cause" : "DHCP server status does not allow this operation.",
					"desc" : "DHCP server status does not allow this operation.",
					"solution" : "Please refresh and try again."
				},
				"1180127" : {
					"cause" : "Failed to delete route.",
					"desc" : "Failed to delete route.",
					"solution" : "Please contact your administrator or view the help manual."
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
				"1180130" : {
					"cause" : "Only FusionComputer supports the creation of a DHCP server.",
					"desc" : "Only FusionComputer supports the creation of a DHCP server.",
					"solution" : "Contact technical support."
				},
				"1181000" : {
					"cause" : "The VPC name already exists.",
					"desc" : "The VPC name already exists.",
					"solution" : "null"
				},
				"1181001" : {
					"cause" : "The selected VDC does not available resource or network.",
					"desc" : "The selected VDC does not available resource or network.",
					"solution" : "null"
				},
				"1181002" : {
					"cause" : "The VPC does not exist.",
					"desc" : "The VPC does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"1181003" : {
					"cause" : "The upper limit is less than the number of internal networks in the VPC.",
					"desc" : "The upper limit is less than the number of internal networks in the VPC.",
					"solution" : "null"
				},
				"1181004" : {
					"cause" : "The upper limit is less than the number of direct networks in the VPC.",
					"desc" : "The upper limit is less than the number of direct networks in the VPC.",
					"solution" : "null"
				},
				"1181005" : {
					"cause" : "The upper limit is less than the number of routed networks in the VPC.",
					"desc" : "The upper limit is less than the number of routed networks in the VPC.",
					"solution" : "null"
				},
				"1181006" : {
					"cause" : "The upper limit is less than the number of elastic IP addresses in the VPC.",
					"desc" : "The upper limit is less than the number of elastic IP addresses in the VPC.",
					"solution" : "null"
				},
				"1181007" : {
					"cause" : "The network is an existing network in the VPC, and therefore cannot be deleted.",
					"desc" : "The network is an existing network in the VPC, and therefore cannot be deleted.",
					"solution" : "null"
				},
				"1181008" : {
					"cause" : "The VPC cannot be deleted because it has been associated with a virtual firewall.",
					"desc" : "The VPC cannot be deleted because it has been associated with a virtual firewall.",
					"solution" : "null"
				},
				"1181010" : {
					"cause" : "The VLAN does not exist in the specified VPC.",
					"desc" : "The VLAN does not exist in the specified VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1181011" : {
					"cause" : "The IP addresses reserved in the gateway and subnet are duplicated. The second and third IP addresses in the subnet are reserved by the system and cannot be used as gateway addresses.",
					"desc" : "The IP addresses reserved in the gateway and subnet are duplicated. The second and third IP addresses in the subnet are reserved by the system and cannot be used as gateway addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1181012" : {
					"cause" : "The VPC cannot be deleted because it has elastic IP.",
					"desc" : "The VPC cannot be deleted because it has elastic IP.",
					"solution" : "null"
				},
				"1181013" : {
					"cause" : "The VPC contains security groups and cannot be deleted.",
					"desc" : "The VPC contains security groups and cannot be deleted.",
					"solution" : "null"
				},
				"1181014" : {
					"cause" : "The number of VPCs in the zone exceeds the upper limit.",
					"desc" : "The number of VPCs in the zone exceeds the upper limit.",
					"solution" : "null"
				},
				"1181015" : {
					"cause" : "The VPC is not steady, and then the operation is not permitted.",
					"desc" : "The VPC is not steady, and then the operation is not permitted.",
					"solution" : "null"
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
					"cause" : "The VPN gateway cannot be created for the VPC because the VPC does not apply?a virtual firewall of hardware device.",
					"desc" : "The VPN gateway cannot be created for the VPC because the VPC does not apply?a virtual firewall of hardware device.",
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183002" : {
					"cause" : "The remote gateway does not exist.",
					"desc" : "The remote gateway does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183003" : {
					"cause" : "The remote gateway subnet information does not exist.",
					"desc" : "The remote gateway subnet information does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183004" : {
					"cause" : "The remote gateway is already in use.",
					"desc" : "The remote gateway is already in use.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183005" : {
					"cause" : "The remote gateway name already exists.",
					"desc" : "The remote gateway name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183006" : {
					"cause" : "The remote gateway and the VPC do not match.",
					"desc" : "The remote gateway and the VPC do not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183007" : {
					"cause" : "The number of remote networks has reached the upper limit allowed by the remote gateway.",
					"desc" : "The number of remote networks has reached the upper limit allowed by the remote gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1183008" : {
					"cause" : "The number of remote gateways exceeds the upper limit permitted by the VPC.",
					"desc" : "The number of remote gateways exceeds the upper limit permitted by the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184000" : {
					"cause" : "The remote gateway conflicts with the local gateway.",
					"desc" : "The remote gateway conflicts with the local gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184001" : {
					"cause" : "The remote gateway conflicts with other VPC remote gateways.",
					"desc" : "The remote gateway conflicts with other VPC remote gateways.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184002" : {
					"cause" : "The local gateway is different from the VPC local gateway.",
					"desc" : "The local gateway is different from the VPC local gateway.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184003" : {
					"cause" : "Subnets configured for the remote user conflict.",
					"desc" : "Subnets configured for the remote user conflict.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184004" : {
					"cause" : "The remote user subnet conflicts with the VPC remote user subnet.",
					"desc" : "The remote user subnet conflicts with the VPC remote user subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184005" : {
					"cause" : "The remote user subnet conflicts with the VPC subnet.",
					"desc" : "The remote user subnet conflicts with the VPC subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184006" : {
					"cause" : "The VPN connection name already exists.",
					"desc" : "The VPN connection name already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184007" : {
					"cause" : "The VPN connection already exits.",
					"desc" : "The VPN connection already exits.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184008" : {
					"cause" : "The VPN connection does not exist.",
					"desc" : "The VPN connection does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184009" : {
					"cause" : "The VPN connection is not compatible with the VPC.",
					"desc" : "The VPN connection is not compatible with the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184010" : {
					"cause" : "The VPN connection in its current state does not support this operation.",
					"desc" : "The VPN connection in its current state does not support this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184011" : {
					"cause" : "The local subnet of the VPN connection does not exist.",
					"desc" : "The local subnet of the VPN connection does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184012" : {
					"cause" : "The authentication mode in the IKE policy cannot be changed.",
					"desc" : "The authentication mode in the IKE policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184013" : {
					"cause" : "The authentication algorithm in the IKE policy cannot be changed.",
					"desc" : "The authentication algorithm in the IKE policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184014" : {
					"cause" : "The encryption algorithm in the IKE policy cannot be changed.",
					"desc" : "The encryption algorithm in the IKE policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184015" : {
					"cause" : "The DH algorithm in the IKE policy cannot be changed.",
					"desc" : "The DH algorithm in the IKE policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184016" : {
					"cause" : "The life time of the IKE policy cannot be changed.",
					"desc" : "The life time of the IKE policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184017" : {
					"cause" : "The authentication algorithm in the ESP policy cannot be changed.",
					"desc" : "The authentication algorithm in the ESP policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184018" : {
					"cause" : "The encryption algorithm in the ESP policy cannot be changed.",
					"desc" : "The encryption algorithm in the ESP policy cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184019" : {
					"cause" : "The DPD detection retransmit interval cannot be changed.",
					"desc" : "The DPD detection retransmit interval cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184020" : {
					"cause" : "The DPD detection timeout duration cannot be changed.",
					"desc" : "The DPD detection timeout duration cannot be changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184021" : {
					"cause" : "The local gateway is not using an elastic IP address.",
					"desc" : "The local gateway is not using an elastic IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184022" : {
					"cause" : "The local network is not compatible with the VPC.",
					"desc" : "The local network is not compatible with the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184023" : {
					"cause" : "The number of VPNs has reached the upper limit allowed by the VPC.",
					"desc" : "The number of VPNs has reached the upper limit allowed by the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184024" : {
					"cause" : "Remote subnet information is incorrect because of invalid IP address, incorrect subnet mask, or unmatched IP address and subnet mask.",
					"desc" : "Remote subnet information is incorrect because of invalid IP address, incorrect subnet mask, or unmatched IP address and subnet mask.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184025" : {
					"cause" : "Create a VPN connection fails from bottom.",
					"desc" : "Create a VPN connection fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184026" : {
					"cause" : "Update a VPN connection fails from bottom.",
					"desc" : "Update a VPN connection fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184027" : {
					"cause" : "Delete a VPN connection fails from bottom.",
					"desc" : "Delete a VPN connection fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184028" : {
					"cause" : "The VPN gateway and the VPC do not match.",
					"desc" : "The VPN gateway and the VPC do not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184029" : {
					"cause" : "Incorrect remote gateway subnet information for the L2TP client. The address is not an IP address, the subnet mask is incorrect, or IP address and the subnet mask do not match.",
					"desc" : "Incorrect remote gateway subnet information for the L2TP client. The address is not an IP address, the subnet mask is incorrect, or IP address and the subnet mask do not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184030" : {
					"cause" : "One VPC supports only one L2TP VPN connection and an L2TP VPN connection already exists in the VPC.",
					"desc" : "One VPC supports only one L2TP VPN connection and an L2TP VPN connection already exists in the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184031" : {
					"cause" : "The network conflicts with the remote network of the VPC.",
					"desc" : "The network conflicts with the remote network of the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184032" : {
					"cause" : "The network conflicts with the subnet of the L2TP VPN.",
					"desc" : "The network conflicts with the subnet of the L2TP VPN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184033" : {
					"cause" : "The subnet information of the L2TP VPN conflicts with another L2TP VPN subnet.",
					"desc" : "The subnet information of the L2TP VPN conflicts with another L2TP VPN subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184034" : {
					"cause" : "The remote user subnet conflicts with the subnet of the L2TP VPN.",
					"desc" : "The remote user subnet conflicts with the subnet of the L2TP VPN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184035" : {
					"cause" : "The L2TP VPN subnet conflicts with the remote user subnet.",
					"desc" : "The L2TP VPN subnet conflicts with the remote user subnet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184036" : {
					"cause" : "The L2TP VPN username already exists.",
					"desc" : "The L2TP VPN username already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184039" : {
					"cause" : "VPC does not apply a virtual firewall of hardware device.",
					"desc" : "VPC does not apply a virtual firewall of hardware device.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184040" : {
					"cause" : "Current VPC does not create the VPN gateway, please create first.",
					"desc" : "Current VPC does not create the VPN gateway, please create first.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184041" : {
					"cause" : "Current VPC already exists IPSec VPN connections, not allowed to create other types of VPN connections.",
					"desc" : "Current VPC already exists IPSec VPN connections, not allowed to create other types of VPN connections.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184042" : {
					"cause" : "Current VPC already exists L2TP VPN connections, not allowed to create other types of VPN connections.",
					"desc" : "Current VPC already exists L2TP VPN connections, not allowed to create other types of VPN connections.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184043" : {
					"cause" : "Current VPC associates software firewall, and software firewall only supports IPsecVPN connection, does not support other types.",
					"desc" : "Current VPC associates software firewall, and software firewall only supports IPsecVPN connection, does not support other types.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184044" : {
					"cause" : "The number of L2TP-vpn users has reached the upper limit allowed by the VPC.",
					"desc" : "The number of L2TP-vpn users has reached the upper limit allowed by the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184045" : {
					"cause" : "Create L2TP-VPN users fails from bottom.",
					"desc" : "Create L2TP-VPN users fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184046" : {
					"cause" : "Update L2TP-VPN users fails from bottom.",
					"desc" : "Update L2TP-VPN users fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184047" : {
					"cause" : "Delete L2TP-VPN users fails from bottom.",
					"desc" : "Delete L2TP-VPN users fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184048" : {
					"cause" : "Create a VPN fails from bottom.",
					"desc" : "Create a VPN fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184049" : {
					"cause" : "Update a VPN fails from bottom.",
					"desc" : "Update a VPN fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184050" : {
					"cause" : "Delete a VPN fails from bottom.",
					"desc" : "Delete a VPN fails from bottom.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184051" : {
					"cause" : "The L2TP VPN connection user name is repeated with firewall SSH user names.",
					"desc" : "The L2TP VPN connection user name is repeated with firewall SSH user names.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184052" : {
					"cause" : "The L2TP VPN connection name is l2tp (case insensitive), the name is illegal.",
					"desc" : "The L2TP VPN connection name is l2tp (case insensitive), the name is illegal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184053" : {
					"cause" : "The IKE pre shared old key is incorrect.",
					"desc" : "The IKE pre shared old key is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184054" : {
					"cause" : "The tunnel old key is incorrect.",
					"desc" : "The tunnel old key is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184055" : {
					"cause" : "The old password of L2TP VPN user is incorrect.",
					"desc" : "The old password of L2TP VPN user is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184056" : {
					"cause" : "L2TP VPN service is abnormal.",
					"desc" : "L2TP VPN service is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184057" : {
					"cause" : "L2TP VPN user does not exist.",
					"desc" : "L2TP VPN user does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184058" : {
					"cause" : "The status of L2TP VPN user is not allowed to operate.",
					"desc" : "The status of L2TP VPN user is not allowed to operate.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184059" : {
					"cause" : "L2TP VPN user not belongs to the VPC.",
					"desc" : "L2TP VPN user not belongs to the VPC.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184060" : {
					"cause" : "The network cannot add l2tp user.",
					"desc" : "The network cannot add l2tp user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1184061" : {
					"cause" : "Can not create L2TP VPN users because the network does not apply to VDC.",
					"desc" : "Can not create L2TP VPN users because the network does not apply to VDC.",
					"solution" : "Contact the system administrator."
				},
				"1190501" : {
					"cause" : "The device already exists.",
					"desc" : "The device already exists.",
					"solution" : "Ensure that the device has not been added to the system."
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
				"1190504" : {
					"cause" : "Failed to add data to the database.",
					"desc" : "Failed to add data to the database.",
					"solution" : "Ensure that the logic for adding data is correct."
				},
				"1190505" : {
					"cause" : "Failed to add the service.",
					"desc" : "Failed to add the service.",
					"solution" : "Ensure the logic for adding services is correct."
				},
				"1190507" : {
					"cause" : "The device does not exist.",
					"desc" : "The device does not exist.",
					"solution" : "Ensure that the device exists."
				},
				"1190508" : {
					"cause" : "Failed to delete the service.",
					"desc" : "Failed to delete the service.",
					"solution" : "Ensure that the device can be deleted."
				},
				"1190509" : {
					"cause" : "The service cannot be deleted because it is in use.",
					"desc" : "The service cannot be deleted because it is in use.",
					"solution" : "Stop the in-use service first."
				},
				"1190510" : {
					"cause" : "Failed to update the service.",
					"desc" : "Failed to update the service.",
					"solution" : "Ensure that the update information is correct."
				},
				"1190511" : {
					"cause" : "Failed to update the database.",
					"desc" : "Failed to update the database.",
					"solution" : "Ensure that the update information is correct."
				},
				"1190512" : {
					"cause" : "Invalid username or password.",
					"desc" : "Invalid username or password.",
					"solution" : "Get the correct device username and password."
				},
				"1190513" : {
					"cause" : "Invalid device interface name.",
					"desc" : "Invalid device interface name.",
					"solution" : "Input correct interface name of device."
				},
				"1190514" : {
					"cause" : "Failed to query device interface name.",
					"desc" : "Failed to query device interface name.",
					"solution" : "Ensure that the update information is correct."
				},
				"1190515" : {
					"cause" : "Failed to log in to the device.",
					"desc" : "Failed to log in to the device.",
					"solution" : "Ensure that your input params is correct."
				},
				"1190533" : {
					"cause" : "The BMC IP address conflicts with the OS IP address.",
					"desc" : "The BMC IP address conflicts with the OS IP address.",
					"solution" : "Ensure that the BMC IP address and the OS IP address are correct."
				},
				"1200001" : {
					"cause" : "The deployment service does not exist.",
					"desc" : "The deployment service does not exist.",
					"solution" : "Refresh the page."
				},
				"1200002" : {
					"cause" : "Failed to stop the deployment service.",
					"desc" : "Failed to stop the deployment service.",
					"solution" : "Please try again later."
				},
				"1200003" : {
					"cause" : "Failed to modify NIC information.",
					"desc" : "Failed to modify NIC information.",
					"solution" : "Please contact technical support."
				},
				"1200004" : {
					"cause" : "Failed to connect to the deployment service VM.",
					"desc" : "Failed to connect to the deployment service VM.",
					"solution" : "Please contact technical support."
				},
				"1200005" : {
					"cause" : "System exception.",
					"desc" : "System exception.",
					"solution" : "Please contact technical support."
				},
				"1200006" : {
					"cause" : "Authentication failed.",
					"desc" : "Authentication failed.",
					"solution" : "Please contact technical support."
				},
				"1200007" : {
					"cause" : "The task does not exist.",
					"desc" : "The task does not exist.",
					"solution" : "Please contact technical support."
				},
				"1200008" : {
					"cause" : "Failed to modify route information.",
					"desc" : "Failed to modify route information.",
					"solution" : "Please contact technical support."
				},
				"1200009" : {
					"cause" : "Failed to create the static route file on the deployment service VM.",
					"desc" : "Failed to create the static route file on the deployment service VM.",
					"solution" : "Please contact technical support."
				},
				"1200010" : {
					"cause" : "No static route file exists on the deployment service VM.",
					"desc" : "No static route file exists on the deployment service VM.",
					"solution" : "Please contact technical support."
				},
				"1200011" : {
					"cause" : "Failed to create the deployment service VM.",
					"desc" : "Failed to create the deployment service VM.",
					"solution" : "Please contact technical support."
				},
				"1200012" : {
					"cause" : "Failed to start the deployment service VM.",
					"desc" : "Failed to start the deployment service VM.",
					"solution" : "Please contact technical support."
				},
				"1200013" : {
					"cause" : "The deployment service already exists.",
					"desc" : "The deployment service already exists.",
					"solution" : "Refresh the page."
				},
				"1200014" : {
					"cause" : "This operation is not allowed because of deployment service status conflict.",
					"desc" : "This operation is not allowed because of deployment service status conflict.",
					"solution" : "Refresh the page and try again."
				},
				"1200015" : {
					"cause" : "The deployment service VM template does not exist.",
					"desc" : "The deployment service VM template does not exist.",
					"solution" : "Please contact technical support."
				},
				"1200016" : {
					"cause" : "Failed to obtain an IP address for the deployment service VM.",
					"desc" : "Failed to obtain an IP address for the deployment service VM.",
					"solution" : "Please contact technical support."
				},
				"1200017" : {
					"cause" : "Proxy VM is not running.",
					"desc" : "Proxy VM is not running.",
					"solution" : "Please check the proxy VM status."
				},
				"1200023" : {
					"cause" : "Proxy VM networks exceeds the upper limit.",
					"desc" : "Proxy VM networks exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1200024" : {
					"cause" : "Proxy VM route networks exceeds the upper limit.",
					"desc" : "Proxy VM route networks exceeds the upper limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1200025" : {
					"cause" : "Proxy VM networks repeat.",
					"desc" : "Proxy VM networks repeat.",
					"solution" : "Please remove the repeated networks."
				},
				"1200090" : {
					"cause" : "This storage type does not support copy.",
					"desc" : "This storage type does not support copy.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1211001" : {
					"cause" : "The multicast IP address pool does not exist.",
					"desc" : "The multicast IP address pool does not exist.",
					"solution" : "Please check and retry."
				},
				"1211002" : {
					"cause" : "The multicast IP address pool has been allocated.",
					"desc" : "The multicast IP address pool has been allocated.",
					"solution" : "Please check and retry."
				},
				"1211003" : {
					"cause" : "No multicast IP address pool is available.",
					"desc" : "No multicast IP address pool is available.",
					"solution" : "Please check and retry."
				},
				"1211004" : {
					"cause" : "The multicast IP address has been reclaimed.",
					"desc" : "The multicast IP address has been reclaimed.",
					"solution" : "Please check and retry."
				},
				"1211005" : {
					"cause" : "The zone does not exist.",
					"desc" : "The zone does not exist.",
					"solution" : "Please check and retry."
				},
				"1211006" : {
					"cause" : "The multicast IP address pools overlap.",
					"desc" : "The multicast IP address pools overlap.",
					"solution" : "Please check and retry."
				},
				"1211007" : {
					"cause" : "The multicast IP address pool exceed the maximun number.",
					"desc" : "The multicast IP address pool exceed the maximun number.",
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
					"cause" : "The VPC has routed network, so the router cannot be deleted",
					"desc" : "The VPC has routed network, so the router cannot be deleted",
					"solution" : ""
				},
				"1220006" : {
					"cause" : "The current network mode does not support hardware router.",
					"desc" : "The current network mode does not support hardware router.",
					"solution" : ""
				},
				"1220007" : {
					"cause" : "The router does not belong to the VPC.",
					"desc" : "The router does not belong to the VPC.",
					"solution" : "Contact technical support."
				},
				"1221001" : {
					"cause" : "VRF does not exist",
					"desc" : "VRF does not exist",
					"solution" : "Please contact the system administrator."
				},
				"1260001" : {
					"cause" : "The adaptor package is in use, cannot uninstall.",
					"desc" : "The adaptor package is in use, cannot uninstall.",
					"solution" : "Please try again later."
				},
				"1290002" : {
					"cause" : "VSAM does not exist.",
					"desc" : "VSAM does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290006" : {
					"cause" : "Recover VSAM data failed,please retry.",
					"desc" : "Recover VSAM data failed,please retry.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290007" : {
					"cause" : "VSAM is auditing.",
					"desc" : "VSAM is auditing.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290011" : {
					"cause" : "The MAC address is duplicate.",
					"desc" : "The MAC address is duplicate.",
					"solution" : "Contact technical support."
				},
				"1290012" : {
					"cause" : "The VSA VM does not exist.",
					"desc" : "The VSA VM does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290013" : {
					"cause" : "VSA DHCP service is not on.",
					"desc" : "VSA DHCP service is not on.",
					"solution" : "Please contact your administrator."
				},
				"1290026" : {
					"cause" : "Domain name is invalid.",
					"desc" : "Domain name is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290035" : {
					"cause" : "DHCP server is busy, please try again later.",
					"desc" : "DHCP server is busy, please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290044" : {
					"cause" : "DHCP relay service is abnormal.",
					"desc" : "DHCP relay service is abnormal.",
					"solution" : "Please try again later."
				},
				"1290045" : {
					"cause" : "Different Interface IpRange Conflict.",
					"desc" : "Different Interface IpRange Conflict.",
					"solution" : "Please change the subnet and try again."
				},
				"1290046" : {
					"cause" : "Route information is configured on the interface.",
					"desc" : "Route information is configured on the interface.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1290063" : {
					"cause" : "The time on the system service VM and its management node is inconsistent.Contact the system administrator to modify time settings and ensure that the VM time is consistent with the management node time.",
					"desc" : "The time on the system service VM and its management node is inconsistent.Contact the system administrator to modify time settings and ensure that the VM time is consistent with the management node time.",
					"solution" : "The time on the system service VM and its management node is inconsistent.Contact the system administrator to modify time settings and ensure that the VM time is consistent with the management node time."
				},
				"1290643" : {
					"cause" : "The VSAM can not be connected.",
					"desc" : "The VSAM can not be connected.Please check your configration.",
					"solution" : "The VSAM can not be connected.Please check your vsam configuration."
				},
				"1290644" : {
					"cause" : "The VSAM status is connecting.Please wait for a moment.",
					"desc" : "The VSAM status is connecting.Please wait for a moment.",
					"solution" : "The VSAM status is connecting.Please wait for a moment."
				},
				"1290646" : {
					"cause" : "The ips input is not in the same network segment.",
					"desc" : "The ips input is not in the same network segment.",
					"solution" : "The ips input is not in the same network segment."
				},
				"1290647" : {
					"cause" : "The ips input is conflict.",
					"desc" : "The ips input is conflict.",
					"solution" : "The ips input is conflict."
				},
				"1290648" : {
					"cause" : "The vsam is deply in single mode, the ips input must be same.",
					"desc" : "The vsam is deply in single mode, the ips input must be same.",
					"solution" : "The vsam is deply in single mode, the ips input must be same."
				},
				"1290649" : {
					"cause" : "Gateway is conflict with netmask.",
					"desc" : "Gateway is conflict with netmask.",
					"solution" : "Gateway is conflict with netmask."
				},
				"1290650" : {
					"cause" : "Ip input is illegal.",
					"desc" : "Ip input is illegal.",
					"solution" : "Ip input is illegal."
				},
				"1290651" : {
					"cause" : "Netmask is illegal.",
					"desc" : "Netmask is illegal.",
					"solution" : "Netmask is illegal."
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
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310022" : {
					"cause" : "The VM status must be running or stopped or hibernated or pause.",
					"desc" : "The VM status must be running or stopped or hibernated or pause.",
					"solution" : "Please check VM status."
				},
				"1310023" : {
					"cause" : "The NIC does not belong to the VPC where the security group is located.",
					"desc" : "The NIC does not belong to the VPC where the security group is located.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310024" : {
					"cause" : "NICs of this network type cannot be added to a security group.",
					"desc" : "NICs of this network type cannot be added to a security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310025" : {
					"cause" : "The member to be added has already been added to a security group and cannot be added to another security group.",
					"desc" : "The member to be added has already been added to a security group and cannot be added to another security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310026" : {
					"cause" : "There is same member to add.",
					"desc" : "There is same member to add.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310027" : {
					"cause" : "The member to be deleted from the security group does not exist.",
					"desc" : "The member to be deleted from the security group does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310028" : {
					"cause" : "The default security group has no rules.",
					"desc" : "The default security group has no rules.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310029" : {
					"cause" : "The NIC does not belong to FusionCompute and therefore cannot be added to a security group.",
					"desc" : "The NIC does not belong to FusionCompute and therefore cannot be added to a security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310030" : {
					"cause" : "The operation cannot be performed because the security group is being audited.",
					"desc" : "The operation cannot be performed because the security group is being audited.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310031" : {
					"cause" : "The member is being added to a security group.",
					"desc" : "The member is being added to a security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310032" : {
					"cause" : "The member is being deleted from a security group.",
					"desc" : "The member is being deleted from a security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310033" : {
					"cause" : "The number of members in the security group exceeds the limit.",
					"desc" : "The number of members in the security group exceeds the limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310034" : {
					"cause" : "NICs of this type cannot be added to a security group.",
					"desc" : "NICs of this type cannot be added to a security group.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310050" : {
					"cause" : "The current VPC contains multiple security groups of the same name.",
					"desc" : "The current VPC contains multiple security groups of the same name.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310051" : {
					"cause" : "The number of security groups in the current VPC exceeds the limit.",
					"desc" : "The number of security groups in the current VPC exceeds the limit.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310052" : {
					"cause" : "The security group does not exist.",
					"desc" : "The security group does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310053" : {
					"cause" : "The security group is authorized to communicate with other security groups.",
					"desc" : "The security group is authorized to communicate with other security groups.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310054" : {
					"cause" : "The security group has members.",
					"desc" : "The security group has members.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310055" : {
					"cause" : "The querying limit exceeds.",
					"desc" : "The querying limit exceeds.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310056" : {
					"cause" : "The ip range of rule is invalid.",
					"desc" : "The ip range of rule is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310057" : {
					"cause" : "The port of rule is invalid.",
					"desc" : "The port of rule is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310058" : {
					"cause" : "The rule already exists.",
					"desc" : "The rule already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310059" : {
					"cause" : "The authorized security group does not exist.",
					"desc" : "The authorized security group does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310063" : {
					"cause" : "The security group rule is being created.",
					"desc" : "The security group rule is being created.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310064" : {
					"cause" : "The security group rule is being deleted.",
					"desc" : "The security group rule is being deleted.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310065" : {
					"cause" : "The VPC does not contain FusionCompute resources.",
					"desc" : "The VPC does not contain FusionCompute resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310066" : {
					"cause" : "The security group name is invalid.",
					"desc" : "The security group name is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1310067" : {
					"cause" : "Delete operation failed,Please quit security groups first.",
					"desc" : "Delete operation failed,Please quit security groups first.",
					"solution" : "Please quit security groups first."
				},
				"1310074" : {
					"cause" : "The security group does not belong to the VPC.",
					"desc" : "The security group does not belong to the VPC.",
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
				"1400001" : {
					"cause" : "Connect to DPS timeout.",
					"desc" : "Connect to DPS timeout.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400002" : {
					"cause" : "Connect to DPS failed: username or password not valid, or user is locked.",
					"desc" : "Connect to DPS failed: username or password not valid, or user is locked.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400003" : {
					"cause" : "DPS doesn't configure yet.",
					"desc" : "DPS doesn't configure yet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400004" : {
					"cause" : "Connect to DPS failed.",
					"desc" : "Connect to DPS failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400005" : {
					"cause" : "Connect to DPS failed: server doesn't response.",
					"desc" : "Connect to DPS failed: server doesn't response.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400006" : {
					"cause" : "There is no record in DPS.",
					"desc" : "There is no record in DPS.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400007" : {
					"cause" : "Execute backup task failed.",
					"desc" : "Execute backup task failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400008" : {
					"cause" : "Failed to execute the restoration task.",
					"desc" : "Failed to execute the restoration task.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400009" : {
					"cause" : "Query task failed: taskID doesn't match taskType.",
					"desc" : "Query task failed: taskID doesn't match taskType.",
					"solution" : "Please use valid taskID."
				},
				"1400010" : {
					"cause" : "The license file is expired or is unauthorized to the user.",
					"desc" : "The license file is expired or is unauthorized to the user.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400011" : {
					"cause" : "The designated task does not exist.",
					"desc" : "The designated task does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1400181" : {
					"cause" : "Query task failed: taskID not belong to VM.",
					"desc" : "Query task failed: taskID not belong to VM.",
					"solution" : "Please use valid taskID or VMID."
				},
				"1400182" : {
					"cause" : "There is no storage matched the designated type of backup space in DPS.",
					"desc" : "There is no storage matched the designated type of backup space in DPS.",
					"solution" : "Please use valid storage type"
				},
				"1400183" : {
					"cause" : "The hypervisor of designated VM doesn't exist in DPS.",
					"desc" : "The hypervisor of designated VM doesn't exist in DPS.",
					"solution" : "Please use valid VMID."
				},
				"1400184" : {
					"cause" : "Query task failed: the designated task is not backup or restore task .",
					"desc" : "Query task failed: the designated task is not backup or restore task .",
					"solution" : "Please use valid taskID."
				},
				"1400191" : {
					"cause" : "The backup policy is not associated with the VM.",
					"desc" : "The backup policy is not associated with the VM.",
					"solution" : "Please check and retry."
				},
				"1400193" : {
					"cause" : "The VM has a backup set, can't be deleted.",
					"desc" : "The VM has a backup set, can't be deleted.",
					"solution" : "Please delete the backup set before deleting the VM."
				},
				"1400194" : {
					"cause" : "The VM has a backup policy, can't be deleted.",
					"desc" : "The VM has a backup policy, can't be deleted.",
					"solution" : "Please delete the backup policy before deleting the VM."
				},
				"1400195" : {
					"cause" : "No available backup server.",
					"desc" : "No available backup server.",
					"solution" : "Please check and retry."
				},
				"1400196" : {
					"cause" : "This is a VSA virtual machine, and cannot be deleted",
					"desc" : "This is a VSA virtual machine, and cannot be deleted",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410001" : {
					"cause" : "The virtual machine does not exist.",
					"desc" : "The virtual machine does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410002" : {
					"cause" : "The datastore does not exist.",
					"desc" : "The datastore does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410003" : {
					"cause" : "The volume is frozen.",
					"desc" : "The volume is frozen.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410004" : {
					"cause" : "The volume status is not frozen state.",
					"desc" : "The volume status is not frozen state.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410005" : {
					"cause" : "The volume is not allowed to be detach, because the volume status is not attached.",
					"desc" : "The volume is not allowed to be detach, because the volume status is not attached.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410006" : {
					"cause" : "The measurement configuration path creation failed.",
					"desc" : "The measurement configuration path creation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410007" : {
					"cause" : "Cannot unmount the volume which does not mount to specific VM yet.",
					"desc" : "Cannot unmount the volume which does not mount to specific VM yet.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410008" : {
					"cause" : "The volume is not allowed to be deleted, because the volume status is not created.",
					"desc" : "The volume is not allowed to be deleted, because the volume status is not created.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410009" : {
					"cause" : "The volume of the cluster is inconsistent with the virtual machine cluster.",
					"desc" : "The volume of the cluster is inconsistent with the virtual machine cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410010" : {
					"cause" : "The device type of volume is not same as the one of VM.",
					"desc" : "The device type of volume is not same as the one of VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410011" : {
					"cause" : "The operation failed because no data store provided by a SAN-SATA storage device is found in the cluster.",
					"desc" : "The operation failed because no data store provided by a SAN-SATA storage device is found in the cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410012" : {
					"cause" : "the 'SAN-Any' type of data storage resources insufficient.",
					"desc" : "the 'SAN-Any' type of data storage resources insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410013" : {
					"cause" : "The operation failed because no data store provided by a SAN-SSD storage device is found in the cluster.",
					"desc" : "The operation failed because no data store provided by a SAN-SSD storage device is found in the cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410014" : {
					"cause" : "The operation failed because no data store provided by a SAN-SAS&FC storage device is found in the cluster.",
					"desc" : "The operation failed because no data store provided by a SAN-SAS&FC storage device is found in the cluster.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410015" : {
					"cause" : "Possible causes: 1.Under the cluster storage or CPU resources are insufficient; 2.The disk storage conditions are not met storage resources under the cluster; 3.Virtual machine template selected is unusable.",
					"desc" : "Possible causes: 1.Under the cluster storage or CPU resources are insufficient; 2.The disk storage conditions are not met storage resources under the cluster; 3.Virtual machine template selected is unusable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410016" : {
					"cause" : "Volume is being used by VM.",
					"desc" : "Volume is being used by VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410017" : {
					"cause" : "Such operation is prohibitive to this host because it will cause the disconnection to the virtual environment.",
					"desc" : "Such operation is prohibitive to this host because it will cause the disconnection to the virtual environment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410018" : {
					"cause" : "The specified storage resources are insufficient or cannot meet the virtual machine to start the normal storage.",
					"desc" : "The specified storage resources are insufficient or cannot meet the virtual machine to start the normal storage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410019" : {
					"cause" : "Disaster recovery storage resources in the cluster are insufficient or no disaster recovery storage is available to support VM start.",
					"desc" : "Disaster recovery storage resources in the cluster are insufficient or no disaster recovery storage is available to support VM start.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410020" : {
					"cause" : "Storage resources in the specified host are insufficient or no storage is available to support VM start.",
					"desc" : "Storage resources in the specified host are insufficient or no storage is available to support VM start.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410021" : {
					"cause" : "Attach block storage failed, for the VPC of the VM is not equals to the VPC of the block storage.",
					"desc" : "Attach block storage failed, for the VPC of the VM is not equals to the VPC of the block storage.",
					"solution" : "Please check the storage and the VM."
				},
				"1410022" : {
					"cause" : "NAS-type normal disk do not support capacity expansion on line.",
					"desc" : "NAS-type normal disk do not support capacity expansion on line.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410023" : {
					"cause" : "The volume does not mount to current VM.",
					"desc" : "The volume does not mount to current VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1410024" : {
					"cause" : "The source volume is not the system disk of current VM.",
					"desc" : "The source volume is not the system disk of current VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1420000" : {
					"cause" : "CommVault server doesn't configure yet.",
					"desc" : "CommVault server doesn't configure yet.",
					"solution" : "Please configure CommVault server."
				},
				"1420001" : {
					"cause" : "Connect to CommVault server failed.",
					"desc" : "Connect to CommVault server failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1420002" : {
					"cause" : "CommVault server name does not exists.",
					"desc" : "CommVault server name does not exists.",
					"solution" : "Please enter the correct CommVault server name."
				},
				"1420003" : {
					"cause" : "Login/Password is invalid.",
					"desc" : "Login/Password is invalid.",
					"solution" : "Please enter the correct Login/Password."
				},
				"1420004" : {
					"cause" : "CommVault client is not installed on FusionManager.",
					"desc" : "CommVault client is not installed on FusionManager.",
					"solution" : "Please install CommVault client on FusionManager."
				},
				"1502003" : {
					"cause" : "The entered VXLAN ID is invalid. Enter a value ranging from 4096 to 16777215.",
					"desc" : "The entered VXLAN ID is invalid. Enter a value ranging from 4096 to 16777215.",
					"solution" : "Please enter a value ranging from 4096 to 16777215."
				},
				"1502004" : {
					"cause" : "The value of a start VXLAN ID must be less than the end VXLAN ID in a VXLAN pool.",
					"desc" : "The value of a start VXLAN ID must be less than the end VXLAN ID in a VXLAN pool.",
					"solution" : "The value of a start VXLAN ID must be less than the end VXLAN ID in a VXLAN pool."
				},
				"1502005" : {
					"cause" : "The ranges of VXLAN pools cannot overlap.",
					"desc" : "The ranges of VXLAN pools cannot overlap.",
					"solution" : "Please enter correct VXLAN pools information."
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
				"1502043" : {
					"cause" : "This storage type does not support migrate.",
					"desc" : "This storage type does not support migrate.",
					"solution" : "Please contact your administrator."
				},
				"1502044" : {
					"cause" : "The share volume cannot be thick delay volume.",
					"desc" : "The share volume cannot be thick delay volume.",
					"solution" : "Please contact your administrator."
				},
				"1510001" : {
					"cause" : "Cancel task failed.",
					"desc" : "Cancel task failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1510002" : {
					"cause" : "Task status is changed.",
					"desc" : "Task status is changed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1510003" : {
					"cause" : "Task not exist.",
					"desc" : "Task not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1510006" : {
					"cause" : "This type cannot be canceled.",
					"desc" : "This type cannot be canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1600001" : {
					"cause" : "The zone has resources associated with.",
					"desc" : "The zone has resources associated with.",
					"solution" : "Contact technical support."
				},
				"16000014" : {
					"cause" : "Failed to associate the resource because the resource cluster has no the same datastore.",
					"desc" : "Failed to associate the resource because the resource cluster has no the same datastore.",
					"solution" : "Contact technical support."
				},
				"16000015" : {
					"cause" : "Failed to associate the resource because the resource cluster has no the same DVS.",
					"desc" : "Failed to associate the resource because the resource cluster has no the same DVS.",
					"solution" : "Contact technical support."
				},
				"1600002" : {
					"cause" : "The available zone does not exist.",
					"desc" : "The available zone does not exist.",
					"solution" : "Contact technical support."
				},
				"1600003" : {
					"cause" : "The available zone does not have resources to disassociate from.",
					"desc" : "The available zone does not have resources to disassociate from.",
					"solution" : "Contact technical support."
				},
				"1600004" : {
					"cause" : "Failed to identify the resource type.",
					"desc" : "Failed to identify the resource type.",
					"solution" : "Contact technical support."
				},
				"1600005" : {
					"cause" : "The resources from which the available zone attempts to disassociate do not belong to this available zone.",
					"desc" : "The resources from which the available zone attempts to disassociate do not belong to this available zone.",
					"solution" : "Contact technical support."
				},
				"1600006" : {
					"cause" : "An available zone with the same name already exists in the system.",
					"desc" : "An available zone with the same name already exists in the system.",
					"solution" : "Contact technical support."
				},
				"1600007" : {
					"cause" : "Failed to delete the resource cluster because the resource cluster is occupied by available zone.",
					"desc" : "Failed to delete the resource cluster because the resource cluster is occupied by available zone.",
					"solution" : "Contact technical support."
				},
				"1600008" : {
					"cause" : "Failed to associate the resource because the resource is occupied by available zone.",
					"desc" : "Failed to associate the resource because the resource is occupied by available zone.",
					"solution" : "Contact technical support."
				},
				"1600009" : {
					"cause" : "Failed to associate the resource because the resource cluster is not in the same hypervisor.",
					"desc" : "Failed to associate the resource because the resource cluster is not in the same hypervisor.",
					"solution" : "Contact technical support."
				},
				"1600010" : {
					"cause" : "There is no cluster in the available zone.",
					"desc" : "There is no cluster in the available zone.",
					"solution" : "Contact technical support."
				},
				"1600011" : {
					"cause" : "The number of AZs reaches the max value",
					"desc" : "The number of AZs reaches the max value",
					"solution" : "Contact technical support."
				},
				"1600012" : {
					"cause" : "Failed to delete the resource cluster because the available zone has resource",
					"desc" : "Failed to delete the resource cluster because the available zone has resource",
					"solution" : "Contact technical support."
				},
				"1600013" : {
					"cause" : "Failed to associate the resource because the resource cluster did not associate zone.",
					"desc" : "Failed to associate the resource because the resource cluster did not associate zone.",
					"solution" : "请联系技术支持工程师。"
				},
				"1600014" : {
					"cause" : "The AZ and clusters to be associated with it must have the same storage.",
					"desc" : "The AZ and clusters to be associated with it must have the same storage.",
					"solution" : "Contact technical support."
				},
				"1600015" : {
					"cause" : "The AZ and clusters to be associated with it must have the same DVS.",
					"desc" : "The AZ and clusters to be associated with it must have the same DVS.",
					"solution" : "Contact technical support."
				},
				"1600016" : {
					"cause" : "The resource not belong the AZ.",
					"desc" : "The resource not belong the AZ.",
					"solution" : "Contact technical support."
				},
				"1700001" : {
					"cause" : "The tag to be deleted has already been associated with resources.",
					"desc" : "The tag to be deleted has already been associated with resources.",
					"solution" : "Contact technical support."
				},
				"1700011" : {
					"cause" : "Scheduler cannot find resource cluster match tags condition.",
					"desc" : "Scheduler cannot find resource cluster match tags condition.",
					"solution" : "Contact technical support."
				},
				"1700012" : {
					"cause" : "Scheduler cannot find resource cluster cause available zone is not associated with resource cluster.",
					"desc" : "Scheduler cannot find resource cluster cause available zone is not associated with resource cluster.",
					"solution" : "Contact technical support."
				},
				"7000000" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"7000001" : {
					"cause" : "The selected resource cluster does not exist.",
					"desc" : "The selected resource cluster does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"7000002" : {
					"cause" : "Current status of the association operation cannot be performed, please refresh the page to retry.",
					"desc" : "Current status of the association operation cannot be performed, please refresh the page to retry.",
					"solution" : "please refresh the page to retry."
				},
				"7000003" : {
					"cause" : "To associate the current state of operation cannot be performed, please refresh the page to retry.",
					"desc" : "To associate the current state of operation cannot be performed, please refresh the page to retry.",
					"solution" : "please refresh the page to retry."
				},
		        "7409000": {
		            "cause":"Backup system error.",
		            "desc":"Backup system error.",
		            "solution":"Please contact your administrator or view the help manual."
				},
                "1310083": {
	                "cause":"The current version of FusionCompute dose not support IPv6.",
	                "desc":"The current version of FusionCompute dose not support IPv6.",
	                "solution":"Contact technical support."
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
	            },
                "1080156": {
	                "cause":"Subnet available ip range collide with DHCP server IP or gateway.",
	                "desc":"Subnet available ip range collide with DHCP server IP or gateway.",
	                "solution":"Please input valid subnet information."
	            },
                "1040173": {
	                "cause":"Subnet collide with DHCP server subnet.",
	                "desc":"Subnet collide with DHCP server subnet.",
	                "solution":"Please input valid subnet information."
	            },
	            "1080157": {
	                "cause":"Failed to start the security VM due to resource insufficiency. Ensure that the anti-virus function is enabled on the host and the host antivirus settings are correct.",
	                "desc":"Failed to start the security VM due to resource insufficiency. Ensure that the anti-virus function is enabled on the host and the host antivirus settings are correct.",
	                "solution":"Ensure that the anti-virus function is enabled on the host and the host antivirus settings are correct."
	            },
                "1080158": {
                    "cause":"The reserved memory ratio must be set to 100% for a secure service VM or secure user VM.",
                    "desc":"The reserved memory ratio must be set to 100% for a secure service VM or secure user VM.",
                    "solution":"Contact technical support。"
                },
                "1080159": {
                    "cause":"A secure service VM cannot be allowed to this opreate.",
                    "desc":"A secure service VM cannot be allowed to this opreate.",
                    "solution":"Contact technical support。"
                },
                "1080160": {
                    "cause":"The number of secure user VMs on the host reaches the upper limit or the antivirus function is not enabled on the host.",
                    "desc":"The number of secure user VMs on the host reaches the upper limit or the antivirus function is not enabled on the host.",
                    "solution":"Contact technical support。"
                },
                "1075079": {
	                "cause":"The VM does not allow this operation.",
	                "desc":"The VM does not allow this operation.",
	                "solution":"Contact technical support."
	            },
	            "1070257":{
	            	"cause":"Parse excel file error.",
	                "desc":"Parse excel file error.",
	                "solution":"Please contact technical support."
	            },
	            "1070258":{
	            	"cause":"Adaptor already installed.",
	                "desc":"Adaptor already installed.",
	                "solution":"Please contact technical support."
	            },
	            "1070259":{
	            	"cause":"Delete FusionStorage fail.",
	                "desc":"Delete FusionStorage fail.",
	                "solution":"Please contact technical support."
	            },
	            "1002599":{
	            	"cause":"Cross-cluster live VM cloning using this VM is not supported because the VM has not been added to FusionManager.",
	                "desc":"Cross-cluster live VM cloning using this VM is not supported because the VM has not been added to FusionManager.",
	                "solution":"Add the VM to FusionManager for management."
	            },
	            "1002559":{
	            	"cause":"The VM include share volume,can't transfer vm.",
	                "desc":"The VM include share volume,can't transfer vm.",
	                "solution":"Please contact technical support."
	            },
	            "100100004":{
	            	"cause":"Report name already exist.",
	            	"desc":"Report name already exist.",
	            	"solution":"Please input a difference name."
	            },
	            "100100005":{
	            	"cause":"Customize the number of reports more than 50 copies, please remove the extra custom reports.",
	            	"desc":"Customize the number of reports more than 50 copies, please remove the extra custom reports.",
	            	"solution":"please remove the extra custom reports."
	            },
	            "1070175":{
	            	"cause":"Linked clone vm is not exported.",
	            	"desc":"Linked clone vm is not exported.",
	            	"solution":"Please contact technical support."
	            },
				"1075075":{
	            	"cause":"This configuration does not support custom client operating system ��windows7Server64Guest��,please see vCenter data��",
	            	"desc":"This configuration does not support custom client operating system ��windows7Server64Guest��,please see vCenter data.",
	            	"solution":"Please contact technical support."
	            },
	            "100100006":{
	            	"cause":"File and system does not match.",
	            	"desc":"File and system does not match.",
	            	"solution":"Please confirm the file was downloaded from system,Otherwise please contact technical support."
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