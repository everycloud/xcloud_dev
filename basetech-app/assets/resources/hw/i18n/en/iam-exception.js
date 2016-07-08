define([], function() {
			var exceptionMap = {
				"0000000001" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : ""
				},
				"0000010002" : {
					"cause" : "Parameter error.",
					"desc" : "Parameter error.",
					"solution" : "Check that the entered parameter is correct."
				},
				"0003010010" : {
			    "cause" : "User name can not be reserved words.",
			    "desc" : "User name can not be reserved words.",
			    "solution" : "Please enter another username."
		        },
				"0000030001" : {
					"cause" : "The user is not authorized to perform the operation.",
					"desc" : "The user is not authorized to perform the operation.",
					"solution" : "Check that you have rights to perform the operation."
				},
				"0003000001" : {
					"cause" : "Failed to verify the data length.",
					"desc" : "Failed to verify the data length.",
					"solution" : ""
				},
				"0003000002" : {
					"cause" : "Invalid data format.",
					"desc" : "Invalid data format.",
					"solution" : ""
				},
				"0003000003" : {
					"cause" : "The operation name ID does not exist.",
					"desc" : "The operation name ID does not exist.",
					"solution" : ""
				},
				"0003000004" : {
					"cause" : "The operation type does not exist.",
					"desc" : "The operation type does not exist.",
					"solution" : ""
				},
				"0003000006" : {
					"cause" : "The operation level does not exist.",
					"desc" : "The operation level does not exist.",
					"solution" : ""
				},
				"0003000007" : {
					"cause" : "The user IP address does not exist.",
					"desc" : "The user IP address does not exist.",
					"solution" : ""
				},
				"0003000009" : {
					"cause" : "The operation result cannot be left empty.",
					"desc" : "The operation result cannot be left empty.",
					"solution" : ""
				},
				"0003000010" : {
					"cause" : "The failure cause cannot be left empty.",
					"desc" : "The failure cause cannot be left empty.",
					"solution" : ""
				},
				"0003000011" : {
					"cause" : "The serial number does not exist.",
					"desc" : "The serial number does not exist.",
					"solution" : ""
				},
				"0003001001" : {
					"cause" : "The username already exists.",
					"desc" : "The username already exists.",
					"solution" : "The username already exists. Enter another username."
				},
				"0003001002" : {
					"cause" : "The password does not conform to password policies.",
					"desc" : "The password does not conform to password policies.",
					"solution" : "Check that the password conforms to the password policies."
				},
				"0003001003" : {
					"cause" : "The number of system administrators has reached the maximum value.",
					"desc" : "The number of system administrators has reached the maximum value.",
					"solution" : "The number of system administrators has reached the maximum value. Delete unnecessary system administrators and try to create the administrator. Perform this operation with caution."
				},
				"0003001004" : {
					"cause" : "You cannot delete an active user.",
					"desc" : "You cannot delete an active user.",
					"solution" : "You cannot delete an active user."
				},
				"0003001005" : {
					"cause" : "You cannot delete a default user.",
					"desc" : "You cannot delete a default user.",
					"solution" : "The default user cannot be deleted."
				},
				"0003001006" : {
					"cause" : "The user to be deleted does not exist.",
					"desc" : "The user to be deleted does not exist.",
					"solution" : "Refresh the page to check whether the user exists."
				},
				"0003001007" : {
					"cause" : "Cannot freeze yourself.",
					"desc" : "Cannot freeze yourself.",
					"solution" : ""
				},
				"0003001008" : {
					"cause" : "Cannot freeze the default user.",
					"desc" : "Cannot freeze the default user.",
					"solution" : ""
				},
				"0003001009" : {
					"cause" : "The mobile phone number is incorrect.",
					"desc" : "The mobile phone number is incorrect.",
					"solution" : "Ensure that the mobile phone number is correct."
				},
				"0003001010" : {
					"cause" : "The email address is incorrect.",
					"desc" : "The email address is incorrect.",
					"solution" : "Check whether the email address is correct."
				},
				"0003001011" : {
					"cause" : "The user type does not exist.",
					"desc" : "The user type does not exist.",
					"solution" : "Select another type."
				},
				"0003001012" : {
					"cause" : "The user does not exist.",
					"desc" : "The user does not exist.",
					"solution" : "Refresh the page to check whether the user exists."
				},
				"0003001013" : {
					"cause" : "The password is incorrect.",
					"desc" : "The password is incorrect.",
					"solution" : "Enter the correct password."
				},
				"0003001014" : {
					"cause" : "The verification code is incorrect.",
					"desc" : "The verification code is incorrect.",
					"solution" : "Enter the correct verification code."
				},
				"0003001015" : {
					"cause" : "The user is frozen.",
					"desc" : "The user is frozen.",
					"solution" : ""
				},
				"0003001016" : {
					"cause" : "The user is locked.",
					"desc" : "The user is locked.",
					"solution" : ""
				},
				"0003001017" : {
					"cause" : "The rights ID does not exist.",
					"desc" : "The rights ID does not exist.",
					"solution" : ""
				},
				"0003001018" : {
					"cause" : "The resource ID does not exist.",
					"desc" : "The resource ID does not exist.",
					"solution" : ""
				},
				"0003001019" : {
					"cause" : "The number of service administrators has reached the maximum value.",
					"desc" : "The number of service administrators has reached the maximum value.",
					"solution" : "Please contact the system administrator."
				},
				"0003001020" : {
					"cause" : "The password and confirm password are inconsistent.",
					"desc" : "The password and confirm password are inconsistent.",
					"solution" : "Enter the correct password and make sure that the confirm password and new password are consistent."
				},
				"0003001021" : {
					"cause" : "Encryption failed.",
					"desc" : "Encryption failed.",
					"solution" : "Please contact the system administrator."
				},
				"0003001022" : {
					"cause" : "Decryption failed.",
					"desc" : "Decryption failed.",
					"solution" : "Please contact the system administrator."
				},
				"0003001023" : {
					"cause" : "You cannot modify information about other users.",
					"desc" : "You cannot modify information about other users.",
					"solution" : "You cannot modify or delete information about other users."
				},
				"0003001024" : {
					"cause" : "You cannot modify information about the default user.",
					"desc" : "You cannot modify information about the default user.",
					"solution" : "You cannot modify information about the default user."
				},
				"0003001025" : {
					"cause" : "You cannot modify yourself.",
					"desc" : "You cannot modify yourself.",
					"solution" : "To modify information about the current user, click the username in the upper right corner."
				},
				"0003001026" : {
					"cause" : "The role list cannot be empty.",
					"desc" : "The role list cannot be empty.",
					"solution" : "The role list must be specified. Select a role list."
				},
				"0003001027" : {
					"cause" : "The AD authentication user does not exist.",
					"desc" : "The AD authentication user does not exist.",
					"solution" : "Check that the AD authentication username is correct."
				},
				"0003001028" : {
					"cause" : "The password for the AD authentication user is incorrect.",
					"desc" : "The password for the AD authentication user is incorrect.",
					"solution" : "Check that the AD authentication username and password are correct."
				},
				"0003001029" : {
					"cause" : "The AD authentication user is not allowed to log in to the AD server at this time.",
					"desc" : "The AD authentication user is not allowed to log in to the AD server at this time.",
					"solution" : "Please contact the AD system administrator."
				},
				"0003001030" : {
					"cause" : "The AD authentication user is not allowed to log in to the system from this client.",
					"desc" : "The AD authentication user is not allowed to log in to the system from this client.",
					"solution" : "Please contact the AD system administrator."
				},
				"0003001031" : {
					"cause" : "The password of the AD authentication user has expired.",
					"desc" : "The password of the AD authentication user has expired.",
					"solution" : "The password of the AD authentication user has expired. Please contact the AD system administrator to reset the password."
				},
				"0003001032" : {
					"cause" : "The AD authentication account is unavailable.",
					"desc" : "The AD authentication account is unavailable.",
					"solution" : "The AD authentication account is unavailable. Please contact the AD system administrator."
				},
				"0003001033" : {
					"cause" : "The AD authentication account has expired.",
					"desc" : "The AD authentication account has expired.",
					"solution" : "The AD authentication account is unavailable. Please contact the AD system administrator."
				},
				"0003001034" : {
					"cause" : "The password of the AD authentication user must be reset.",
					"desc" : "The password of the AD authentication user must be reset.",
					"solution" : "The AD authentication user must reset the password. Change the user password on the AD server."
				},
				"0003001035" : {
					"cause" : "The AD authentication account is locked.",
					"desc" : "The AD authentication account is locked.",
					"solution" : "The AD authentication account is locked. Please contact the AD system administrator."
				},
				"0003001036" : {
					"cause" : "The AD authentication user is not registered.",
					"desc" : "The AD authentication user is not registered.",
					"solution" : "Check that the username and password are correct."
				},
				"0003001037" : {
					"cause" : "Third-party authentication error.",
					"desc" : "Third-party authentication error.",
					"solution" : "Check that Third-party authentication configuration is correct."
				},
				"0003001038" : {
					"cause" : "Incorrect old password.",
					"desc" : "Incorrect old password.",
					"solution" : "Enter the correct old password."
				},
				"0003001039" : {
					"cause" : "Failed to load the certificate.",
					"desc" : "Failed to load the certificate.",
					"solution" : "Please load the certificate again."
				},
				"0003001040" : {
					"cause" : "The certificate storing path is left empty.",
					"desc" : "The certificate storing path is left empty.",
					"solution" : "Please load the certificate again."
				},
				"0003001041" : {
					"cause" : "The certificate to be loaded has not been selected.",
					"desc" : "The certificate to be loaded has not been selected.",
					"solution" : "Please select the certificate to be loaded."
				},
				"0003001042" : {
					"cause" : "The certificate format is incorrect.",
					"desc" : "The certificate format is incorrect.",
					"solution" : "Please ensure that the certificate format is correct."
				},
				"0003001043" : {
					"cause" : "No role for the domain is assigned to the user.",
					"desc" : "No role for the domain is assigned to the user.",
					"solution" : ""
				},
				"0003001044" : {
					"cause" : "The domain does not exist or cannot be operated by the user.",
					"desc" : "The domain does not exist or cannot be operated by the user.",
					"solution" : ""
				},
				"0003001045" : {
					"cause" : "The current login user does not have permission to assign this role or the role has been deleted.",
					"desc" : "The current login user does not have permission to assign this role or the role has been deleted.",
					"solution" : ""
				},
				"0003001046" : {
					"cause" : "No role for the VDC is assigned to the user.",
					"desc" : "No role for the VDC is assigned to the user.",
					"solution" : ""
				},
				"0003001047" : {
					"cause" : "The user is already unlocked.",
					"desc" : "The user is already unlocked.",
					"solution" : ""
				},
				"0003001048" : {
					"cause" : "The organization must contain at least one organization administrator.",
					"desc" : "The organization must contain at least one organization administrator.",
					"solution" : ""
				},
				"0003001049" : {
					"cause" : "Invalid IP address.",
					"desc" : "Invalid IP address.",
					"solution" : ""
				},
				"0003001050" : {
					"cause" : "The result of logical AND operation between the subnet IP address and the mask must be the same as the subnet IP address.",
					"desc" : "The result of logical AND operation between the subnet IP address and the mask must be the same as the subnet IP address.",
					"solution" : "Ensure that the result of logical AND operation between the subnet IP address and the mask must be the same as the subnet IP address."
				},
				"0003001051" : {
					"cause" : "The start IP address or end IP address of the IP address segment is not specified.",
					"desc" : "The start IP address or end IP address of the IP address segment is not specified.",
					"solution" : "Enter correct IP address segment."
				},
				"0003001052" : {
					"cause" : "The end IP address of the IP address segment is greater than the start IP address.",
					"desc" : "The end IP address of the IP address segment is greater than the start IP address.",
					"solution" : "Ensure that the start IP address is smaller than the end IP address."
				},
				"0003001053" : {
					"cause" : "Unlock the VDC security administrator before deleting the security administrator.",
					"desc" : "Unlock the VDC security administrator before deleting the security administrator.",
					"solution" : ""
				},
				"0003001054" : {
					"cause" : "The user type cannot be changed.",
					"desc" : "The user type cannot be changed.",
					"solution" : ""
				},
				"0003001055" : {
					"cause" : "The password is not allowed to be reset.",
					"desc" : "The password is not allowed to be reset.",
					"solution" : ""
				},
				"0003001056" : {
					"cause" : "The user is not allowed to be modified.",
					"desc" : "The user is not allowed to be modified.",
					"solution" : ""
				},
				"0003001057" : {
					"cause" : "The domain authorization of the user is not allowed to be modified or canceled.",
					"desc" : "The domain authorization of the user is not allowed to be modified or canceled.",
					"solution" : ""
				},
				"0003001058" : {
					"cause" : "You are not allowed to create sub-domains in the domain in this scenario.",
					"desc" : "You are not allowed to create sub-domains in the domain in this scenario.",
					"solution" : ""
				},
				"0003001059" : {
					"cause" : "You are not allowed to delete the domain in this scenario.",
					"desc" : "You are not allowed to delete the domain in this scenario.",
					"solution" : ""
				},
				"0003001061" : {
					"cause" : "The user is not allowed to be deleted.",
					"desc" : "The user is not allowed to be deleted.",
					"solution" : ""
				},
				"0003001062" : {
					"cause" : "The number of VDCs which user joins has reached the maximum value.",
					"desc" : "The number of VDCs which user joins has reached the maximum value.",
					"solution" : ""
				},
				"0003001063" : {
					"cause" : "The start date or end date is left blank.",
					"desc" : "The start date or end date is left blank.",
					"solution" : ""
				},
				"0003001064" : {
					"cause" : "The start time or end time is left empty.",
					"desc" : "The start time or end time is left empty.",
					"solution" : ""
				},
				"0003001065" : {
					"cause" : "The start date is later than the end date",
					"desc" : "The start date is later than the end date",
					"solution" : ""
				},
				"0003001066" : {
					"cause" : "The start time is later than the end time.",
					"desc" : "The start time is later than the end time.",
					"solution" : ""
				},
				"0003001067" : {
					"cause" : "Cannot lock or unlock yourself",
					"desc" : "Cannot lock or unlock yourself",
					"solution" : ""
				},
				"0003001069" : {
					"cause" : "The username or password is not correct.",
					"desc" : "The username or password is not correct.",
					"solution" : ""
				},
				"0003001070" : {
					"cause" : "The connected Project is incorrect.",
					"desc" : "The connected Project is incorrect.",
					"solution" : ""
				},
				"0003001071" : {
					"cause" : "The username cannot be left blank.",
					"desc" : "The username cannot be left blank.",
					"solution" : ""
				},
				"0003001072" : {
					"cause" : "A tenant cannot modify information about a system user.",
					"desc" : "A tenant cannot modify information about a system user.",
					"solution" : ""
				},
				"0003001073" : {
					"cause" : "The number of users has reached the maximum value.",
					"desc" : "The number of users has reached the maximum value.",
					"solution" : ""
				},
				"0003001074" : {
    			                "cause" : "keystone connect user password is not permitted to modify.",
    			                 "desc" : "keystone connect user password is not permitted to modify.",
    			                 "solution" : ""
    		                },
				"0003002001" : {
					"cause" : "The role name does not conform to the naming rules.",
					"desc" : "The role name does not conform to the naming rules.",
					"solution" : "Check that the role name conforms to the naming rules."
				},
				"0003002002" : {
					"cause" : "The role description exceeds the maximum number of characters allowed.",
					"desc" : "The role description exceeds the maximum number of characters allowed.",
					"solution" : "The description information exceeds 128 characters."
				},
				"0003002003" : {
					"cause" : "The role already exists.",
					"desc" : "The role already exists.",
					"solution" : "The role name already exists. Enter another name."
				},
				"0003002004" : {
					"cause" : "The number of roles has reached the maximum value.",
					"desc" : "The number of roles has reached the maximum value.",
					"solution" : "The number of roles has reached the maximum. Delete unnecessary roles and try to create a role. Exercise caution when deleting roles."
				},
				"0003002005" : {
					"cause" : "Failed to delete the role because it is associated to a user.",
					"desc" : "Failed to delete the role because it is associated to a user.",
					"solution" : "Failed to delete the role because it is associated to a user. Delete the user before you delete this role. Exercise caution when deleting users."
				},
				"0003002006" : {
					"cause" : "You cannot delete a default role.",
					"desc" : "You cannot delete a default role.",
					"solution" : "The default role cannot be deleted."
				},
				"0003002007" : {
					"cause" : "The default role cannot be modified.",
					"desc" : "The default role cannot be modified.",
					"solution" : "The default role cannot be modified."
				},
				"0003002008" : {
					"cause" : "The role type does not exist.",
					"desc" : "The role type does not exist.",
					"solution" : "The role type does not exist. Select another role type."
				},
				"0003002009" : {
					"cause" : "The role does not exist.",
					"desc" : "The role does not exist.",
					"solution" : "Refresh the page to check whether the role exists."
				},
				"0003002010" : {
					"cause" : "Invalid role ID.",
					"desc" : "Invalid role ID.",
					"solution" : ""
				},
				"0003002011" : {
					"cause" : "The rights list is left empty.",
					"desc" : "The rights list is left empty.",
					"solution" : "The rights list cannot be left empty. Select rights for the role."
				},
				"0003002012" : {
					"cause" : "The role is not allowed to configure FusionCompute roles.",
					"desc" : "The role is not allowed to configure FusionCompute roles.",
					"solution" : ""
				},
				"0003002013" : {
					"cause" : "The default role is not allowed to be modified.",
					"desc" : "The default role is not allowed to be modified.",
					"solution" : ""
				},
				"0003002014" : {
					"cause" : "The default role is not allowed to be deleted.",
					"desc" : "The default role is not allowed to be deleted.",
					"solution" : ""
				},
				"0003002015" : {
					"cause" : "The number of roles to be created exceeds the upper limit.",
					"desc" : "The number of roles to be created exceeds the upper limit.",
					"solution" : "Create a character reaches the maximum number, if you need to create the role, please contact the administrator."
				},
				"0003002016" : {
					"cause" : "A public service role is not allowed to be modified or deleted.",
					"desc" : "A public service role is not allowed to be modified or deleted.",
					"solution" : ""
				},
				"0003003001" : {
					"cause" : "Invalid password length.",
					"desc" : "Invalid password length.",
					"solution" : "Check that the password conforms to the password length policy."
				},
				"0003003002" : {
					"cause" : "The password must contain special characters.",
					"desc" : "The password must contain special characters.",
					"solution" : "Check that the password contains special characters."
				},
				"0003003003" : {
					"cause" : "The interval at which the password is changed is less than the allowed minimum value.",
					"desc" : "The interval at which the password is changed is less than the allowed minimum value.",
					"solution" : "Check that the password conforms to the password policies."
				},
				"0003003004" : {
					"cause" : "Previously used passwords are not allowed.",
					"desc" : "Previously used passwords are not allowed.",
					"solution" : "Check that the password conforms to the password reuse policy."
				},
				"0003003005" : {
					"cause" : "The password cannot contain the username or username in reverse order.",
					"desc" : "The password cannot contain the username or username in reverse order.",
					"solution" : "Check that the password does not contain the username or username in reverse order."
				},
				"0003003006" : {
					"cause" : "Failed to modify the password policy.",
					"desc" : "Failed to modify the password policy.",
					"solution" : ""
				},
				"0003003007" : {
					"cause" : "The password must contain at least two types of the following characters: uppercase letters, lowercase letters, digits, and special characters.",
					"desc" : "The password must contain at least two types of the following characters: uppercase letters, lowercase letters, digits, and special characters.",
					"solution" : ""
				},
				"0003004001" : {
					"cause" : "The VDC does not exist.",
					"desc" : "The VDC does not exist.",
					"solution" : ""
				},
				"0003004002" : {
					"cause" : "The user is not a VDC user.",
					"desc" : "The user is not a VDC user.",
					"solution" : ""
				},
				"0003004003" : {
					"cause" : "The VDC name already exists.",
					"desc" : "The VDC name already exists.",
					"solution" : ""
				},
				"0003004004" : {
					"cause" : "The number of VDCs has reached the maximum value.",
					"desc" : "The number of VDCs has reached the maximum value.",
					"solution" : ""
				},
				"0003004005" : {
					"cause" : "VDC exists in the organization.",
					"desc" : "VDC exists in the organization.",
					"solution" : ""
				},
				"0003004006" : {
					"cause" : "The VDC is not allowed to be deleted because it contains VDC networks.",
					"desc" : "The VDC is not allowed to be deleted because it contains VDC networks.",
					"solution" : ""
				},
				"0003004007" : {
					"cause" : "The VDC is not allowed to be deleted because it contains VM templates.",
					"desc" : "The VDC is not allowed to be deleted because it contains VM templates.",
					"solution" : ""
				},
				"0003004008" : {
					"cause" : "The VDC is not allowed to be deleted because it contains software.",
					"desc" : "The VDC is not allowed to be deleted because it contains software.",
					"solution" : ""
				},
				"0003004009" : {
					"cause" : "The VDC is not allowed to be deleted because it contains ISO files.",
					"desc" : "The VDC is not allowed to be deleted because it contains ISO files.",
					"solution" : ""
				},
				"0003004010" : {
					"cause" : "The VDC does not exist or the user does not belong to the VDC.",
					"desc" : "The VDC does not exist or the user does not belong to the VDC.",
					"solution" : ""
				},
				"0003004011" : {
					"cause" : "The default VDC is not allowed to be modified.",
					"desc" : "The default VDC is not allowed to be modified.",
					"solution" : ""
				},
				"0003004012" : {
					"cause" : "You are not allowed to delete the default VDC.",
					"desc" : "You are not allowed to delete the default VDC.",
					"solution" : ""
				},
				"0003004013" : {
					"cause" : "You are not allowed to modify the VDC member in this scenario.",
					"desc" : "You are not allowed to modify the VDC member in this scenario.",
					"solution" : ""
				},
				"0003004014" : {
					"cause" : "You are not allowed to delete the VDC member in this scenario.",
					"desc" : "You are not allowed to delete the VDC member in this scenario.",
					"solution" : ""
				},
				"0003004015" : {
					"cause" : "The system administrator is not allowed to upgrade.",
					"desc" : "The system administrator is not allowed to upgrade.",
					"solution" : ""
				},
				"0003004016" : {
					"cause" : "You are not allowed to modify the default organization name.",
					"desc" : "You are not allowed to modify the default organization name.",
					"solution" : ""
				},
				"0003004017" : {
					"cause" : "Failed to associate the AZ.",
					"desc" : "Failed to associate the AZ.",
					"solution" : ""
				},
				"0003004018" : {
					"cause" : "Failed to associate the AZ.",
					"desc" : "Failed to associate the AZ.",
					"solution" : ""
				},
				"0003004019" : {
					"cause" : "The VDC quota is out of range.",
					"desc" : "The VDC quota is out of range.",
					"solution" : ""
				},
				"0003004020" : {
					"cause" : "The VDC is not allowed to be deleted because it contains resources.",
					"desc" : "The VDC is not allowed to be deleted because it contains resources.",
					"solution" : ""
				},
				"0003004021" : {
					"cause" : "The CPU value cannot smaller than the used CPU.",
					"desc" : "The CPU value cannot smaller than the used CPU.",
					"solution" : ""
				},
				"0003004022" : {
					"cause" : "The memory size cannot smaller than the used memory.",
					"desc" : "The memory size cannot smaller than the used memory.",
					"solution" : ""
				},
				"0003004023" : {
					"cause" : "The number of storage resources to be configured cannot be smaller than that used in the system.",
					"desc" : "The number of storage resources to be configured cannot be smaller than that used in the system.",
					"solution" : ""
				},
				"0003004024" : {
					"cause" : "The number of VPCs to be configured cannot be smaller than that used in the system.",
					"desc" : "The number of VPCs to be configured cannot be smaller than that used in the system.",
					"solution" : ""
				},
				"0003004025" : {
					"cause" : "The number of elastic IP addresses to be configured cannot be smaller than that used in the system.",
					"desc" : "The number of elastic IP addresses to be configured cannot be smaller than that used in the system.",
					"solution" : ""
				},
				"0003004026" : {
					"cause" : "The number of security groups to be configured cannot be smaller than that used in the system.",
					"desc" : "The number of security groups to be configured cannot be smaller than that used in the system.",
					"solution" : ""
				},
				"0003004027" : {
					"cause" : "The configured value for the VM cannot smaller than that used by the VM.",
					"desc" : "The configured value for the VM cannot smaller than that used by the VM.",
					"solution" : ""
				},
				"0003004028" : {
					"cause" : "The enter quota values are smaller than distribution quota.",
					"desc" : "The enter quota values are smaller than distribution quota.",
					"solution" : ""
				},
				"0003004029" : {
					"cause" : "The keystone access account is not allowed to be added to a VDC.",
					"desc" : "The keystone access account is not allowed to be added to a VDC.",
					"solution" : ""
				},
				"0003004030" : {
					"cause" : "The number of records in the batch query exceeds the threshold.",
					"desc" : "The number of records in the batch query exceeds the threshold.",
					"solution" : ""
				},
				"0003004031" : {
					"cause" : "You are not allowed to delete the AZ of the VDC because the AZ contains resources.",
					"desc" : "You are not allowed to delete the AZ of the VDC because the AZ contains resources.",
					"solution" : ""
				},
				"0003004032" : {
					"cause" : "You are not allowed to modify the AZ of the VDC because the AZ contains resources.",
					"desc" : "You are not allowed to modify the AZ of the VDC because the AZ contains resources.",
					"solution" : ""
				},
				"0003004033" : {
					"cause" : "The last VDC administrator cannot be deleted or changed to a non-VDC administrator.",
					"desc" : "The last VDC administrator cannot be deleted or changed to a non-VDC administrator.",
					"solution" : ""
				},
				"0003004034" : {
					"cause" : "Failed to connect to the cloud resource pool.",
					"desc" : "Failed to connect to the cloud resource pool.",
					"solution" : ""
				},
				"0003004035": {
				"cause":"VPC quota is not limitation beyond VDC, please limit then modify the VDC quota",
				"desc":"VPC quota is not limitation beyond VDC, please limit then modify the VDC quota",
				"solution":""
				},
				"0003004036" : {
					"cause" : "You are not allowed to delete the cloud resource pool of the VDC because the pool contains resources.",
					"desc" : "You are not allowed to delete the cloud resource pool of the VDC because the pool contains resources.",
					"solution" : ""
				},
				"0003004037" : {
					"cause" : "You are not allowed to modify the cloud resource pool of the VDC because the pool contains resources.",
					"desc" : "You are not allowed to modify the cloud resource pool of the VDC because the pool contains resources.",
					"solution" : ""
				},
				"0003005001" : {
					"cause" : "The user is not authorized to perform the operation.",
					"desc" : "The user is not authorized to perform the operation.",
					"solution" : "Check that you have rights to perform the operation."
				},
				"0003005002" : {
					"cause" : "Service error.",
					"desc" : "Service error.",
					"solution" : "Service error. Please contact the system administrator."
				},
				"0003005005" : {
					"cause" : "Sequence mode error.",
					"desc" : "Sequence mode error.",
					"solution" : ""
				},
				"0003005006" : {
					"cause" : "Incorrect query number.",
					"desc" : "Incorrect query number.",
					"solution" : ""
				},
				"0003005007" : {
					"cause" : "The application name does not exist.",
					"desc" : "The application name does not exist.",
					"solution" : ""
				},
				"0003005008" : {
					"cause" : "Invalid time format.",
					"desc" : "Invalid time format.",
					"solution" : ""
				},
				"0003005009" : {
					"cause" : "Communication error.",
					"desc" : "Communication error.",
					"solution" : ""
				},
				"0003006001" : {
					"cause" : "The domain already exists.",
					"desc" : "The domain already exists.",
					"solution" : "The domain already exists. Configure the domain information again."
				},
				"0003006002" : {
					"cause" : "The number of domains has reached the maximum value.",
					"desc" : "The number of domains has reached the maximum value.",
					"solution" : "The number of domains has reached the maximum. Delete unnecessary domains and retry to create the domain. Exercise caution when deleting domains."
				},
				"0003006003" : {
					"cause" : "Resources or users exist in the domain.",
					"desc" : "Resources or users exist in the domain.",
					"solution" : "The domain cannot be deleted or create sub-domain because resources or users exist in the domain. Remove all resources and users from the domain before deleting it or creating sub-domain for it. Exercise caution when deleting resources and users."
				},
				"0003006004" : {
					"cause" : "The default domain cannot be deleted.",
					"desc" : "The default domain cannot be deleted.",
					"solution" : "The default domain cannot be deleted."
				},
				"0003006005" : {
					"cause" : "The default domain cannot be modified.",
					"desc" : "The default domain cannot be modified.",
					"solution" : "Information about the default domain cannot be modified."
				},
				"0003006006" : {
					"cause" : "The domain does not exist.",
					"desc" : "The domain does not exist.",
					"solution" : "Refresh the page to check whether the domain exists."
				},
				"0003006007" : {
					"cause" : "The non-domain node cannot be deleted.",
					"desc" : "The non-domain node cannot be deleted.",
					"solution" : "Refresh the page to check whether the node can be deleted."
				},
				"0003006008" : {
					"cause" : "No parent node exists in the domain.",
					"desc" : "No parent node exists in the domain.",
					"solution" : "Refresh the page to check whether the parent node exists in the domain."
				},
				"0003006009" : {
					"cause" : "The domain authorization granted to the user has been deleted.",
					"desc" : "The domain authorization granted to the user has been deleted.",
					"solution" : "Refresh the page to check whether the authorization exists in the domain."
				},
				"0003006010" : {
					"cause" : "The domain name already exists.",
					"desc" : "The domain name already exists.",
					"solution" : "Refresh the page to enter another domain name."
				},
				"0003007001" : {
				"cause" : "Export task being executed, please try again later.",
				"desc" : "Export task being executed, please try again later.",
				"solution" : "Export task being executed, please try again later."
		        }
			};
			return exceptionMap;
		})