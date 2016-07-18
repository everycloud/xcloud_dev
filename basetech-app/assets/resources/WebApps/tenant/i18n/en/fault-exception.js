define([], function() {
			var exceptionMap = {
				"0008000000" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : ""
				},
				"0008000005" : {
					"cause" : "Email testing failed.",
					"desc" : "Email testing failed.",
					"solution" : ""
				},
				"0008000105" : {
					"cause" : "Alarms of this type are not masked.",
					"desc" : "Alarms of this type are not masked.",
					"solution" : "Please select target alarms again."
				},
				"0008000111" : {
					"cause" : "Failed to batch mask the alarms. A maximum of 100 alarms can be masked at a time.",
					"desc" : "Failed to batch mask the alarms. A maximum of 100 alarms can be masked at a time.",
					"solution" : "Please select target alarms to be masked again."
				},
				"0008000121" : {
					"cause" : "The start time cannot not be left empty.",
					"desc" : "The start time cannot not be left empty.",
					"solution" : ""
				},
				"0008000122" : {
					"cause" : "The end time cannot be left empty.",
					"desc" : "The end time cannot be left empty.",
					"solution" : ""
				},
				"0008000123" : {
					"cause" : "The start time cannot be greater than the end time.",
					"desc" : "The start time cannot be greater than the end time.",
					"solution" : ""
				},
				"0008000124" : {
					"cause" : "Incorrect date.",
					"desc" : "Incorrect date.",
					"solution" : ""
				},
				"0008000200" : {
					"cause" : "Internal Error.",
					"desc" : "Internal Error.",
					"solution" : "Contact the system administrator or see the online help."
				},
				"0008000202" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Contact the system administrator or see the online help."
				},
				"0008000203" : {
					"cause" : "The alarm is not cleared, and a timeout occurs. Please wait for a moment and query historical alarms.",
					"desc" : "The alarm is not cleared, and a timeout occurs. Please wait for a moment and query historical alarms.",
					"solution" : "Contact the system administrator or see the online help."
				},
				"0008000204" : {
					"cause" : "The alarm cannot be manually cleared.",
					"desc" : "The alarm cannot be manually cleared.",
					"solution" : "Contact the system administrator or see the online help."
				},
				"0008000205" : {
					"cause" : "The alarm has been cleared.",
					"desc" : "The alarm has been cleared.",
					"solution" : "Contact the system administrator or see the online help."
				},
				"0008000206" : {
					"cause" : "The alarm does not exist.",
					"desc" : "The alarm does not exist.",
					"solution" : "Contact the system administrator or see the online help."
				},
				"0008000304" : {
					"cause" : "The recipient address already exists.",
					"desc" : "The recipient address already exists.",
					"solution" : "Please select the recipient address again."
				},
				"0008000400" : {
					"cause" : "The snmp ip already exists.",
					"desc" : "The snmp ip already exists.",
					"solution" : "Please select the snmp ip again."
				},
				"0008000410" : {
					"cause" : "Failed to change the alarm threshold.",
					"desc" : "Failed to change the alarm threshold.",
					"solution" : "Please contact technical support engineers."
				},
				"0008000411" : {
					"cause" : "Alarms of this type have been masked.",
					"desc" : "Alarms of this type have been masked.",
					"solution" : "Please select target alarms again."
				},
				"0008000412" : {
					"cause" : "Failed to change the alarm threshold. The values of alarm threshold must meet the following requirements: Critical > Major > Minor > Warning.",
					"desc" : "Failed to change the alarm threshold. The values of alarm threshold must meet the following requirements: Critical > Major > Minor > Warning.",
					"solution" : "Please enter the correct values."
				},
				"0008220024" : {
					"cause" : "The mail server address or port configuration is incorrect or sending email address and password do not match.",
					"desc" : "The mail server address or port configuration is incorrect or sending email address and password do not match.",
					"solution" : ""
				},
				"0008220034" : {
					"cause" : "Enter a correct mail address and port number and make sure sending email address and password do match, or contact your administrator for help.",
					"desc" : "Enter a correct mail address and port number and make sure sending email address and password do match, or contact your administrator for help.",
					"solution" : ""
				}
			};
			return exceptionMap;
		})