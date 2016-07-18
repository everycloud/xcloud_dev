define([],function() {
			var exceptionMap = {
				"0007400000" : {
					"cause" : "Internal error occurred.",
					"desc" : "Internal error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007400001" : {
					"cause" : "Number format failed.",
					"desc" : "Number format failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007400002" : {
					"cause" : "Catch IO exception.",
					"desc" : "Catch IO exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007401000" : {
					"cause" : "Parameter error occurred.",
					"desc" : "Parameter error occurred.",
					"solution" : "Enter valid parameters."
				},
				"0007401001" : {
					"cause" : "Input parameter is null.",
					"desc" : "Input parameter is null.",
					"solution" : "Enter valid parameters."
				},
				"0007401002" : {
					"cause" : "Input parameter is illegal.",
					"desc" : "Input parameter is illegal.",
					"solution" : "Enter valid parameters."
				},
				"0007401003" : {
					"cause" : "Number of input parameters is illegal.",
					"desc" : "Number of input parameters is illegal.",
					"solution" : "Enter valid parameters."
				},
				"0007401004" : {
					"cause" : "Output parameter is null.",
					"desc" : "Output parameter is null.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007401005" : {
					"cause" : "Output parameter is illegal.",
					"desc" : "Output parameter is illegal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007401006" : {
					"cause" : "IP address is illegal.",
					"desc" : "IP address is illegal.",
					"solution" : "Enter valid IP address"
				},
				"0007402000" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007402001" : {
					"cause" : "Failed to get FusionManager IP address.",
					"desc" : "Failed to get FusionManager IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007402002" : {
					"cause" : "Deploy scenarios error occurred.",
					"desc" : "Deploy scenarios error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007402003" : {
					"cause" : "Failed to get parameter from configuration file.",
					"desc" : "Failed to get parameter from configuration file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007402004" : {
					"cause" : "System anomalies.",
					"desc" : "System anomalies.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007402100" : {
					"cause" : "Alarm error occurred.",
					"desc" : "Alarm error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007402700" : {
					"cause" : "UHM rest operation error occurred.",
					"desc" : "UHM rest operation error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403001" : {
					"cause" : "Failed to insert data to the database.",
					"desc" : "Failed to insert data to the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403002" : {
					"cause" : "Failed to update the database.",
					"desc" : "Failed to update the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403003" : {
					"cause" : "Failed to delete data.",
					"desc" : "Failed to delete data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403004" : {
					"cause" : "Failed to query data.",
					"desc" : "Failed to query data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403005" : {
					"cause" : "The format of the data in the database is incorrect.",
					"desc" : "The format of the data in the database is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403006" : {
					"cause" : "The data in the database is incomplete.",
					"desc" : "The data in the database is incomplete.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007403007" : {
					"cause" : "Failed to clean up data.",
					"desc" : "Failed to clean up data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404001" : {
					"cause" : "Failed to read the file.",
					"desc" : "Failed to read the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404002" : {
					"cause" : "Failed to write the file.",
					"desc" : "Failed to write the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404003" : {
					"cause" : "Storage space is insufficient.",
					"desc" : "Storage space is insufficient.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404004" : {
					"cause" : "Failed to move the file.",
					"desc" : "Failed to move the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404005" : {
					"cause" : "Failed to copy the file.",
					"desc" : "Failed to copy the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404006" : {
					"cause" : "Failed to delete the file.",
					"desc" : "Failed to delete the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404007" : {
					"cause" : "The file does not exist.",
					"desc" : "The file does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404008" : {
					"cause" : "Failed to access the file.",
					"desc" : "Failed to access the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404009" : {
					"cause" : "Failed to generate a file.",
					"desc" : "Failed to generate a file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404010" : {
					"cause" : "Failed to parse the file.",
					"desc" : "Failed to parse the file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007404011" : {
					"cause" : "Failed to generate a file folder.",
					"desc" : "Failed to generate a file folder.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405000" : {
					"cause" : "OS installation failed.",
					"desc" : "OS installation failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405100" : {
					"cause" : "The subnet already exists.",
					"desc" : "The subnet already exists.",
					"solution" : "Please confirm the subnet exists."
				},
				"0007405101" : {
					"cause" : "The subnet does not exist.",
					"desc" : "The subnet does not exist.",
					"solution" : "Please confirm the subnet does not exist."
				},
				"0007405102" : {
					"cause" : "The subnet is illegal.",
					"desc" : "The subnet is illegal.",
					"solution" : "Enter valid subnet."
				},
				"0007405103" : {
					"cause" : "mask is illegal.",
					"desc" : "mask is illegal.",
					"solution" : "Enter valid mask."
				},
				"0007405104" : {
					"cause" : "The gateway address is not in the subnet.",
					"desc" : "The gateway address is not in the subnet.",
					"solution" : "Please confirm the gateway is not in subnet."
				},
				"0007405105" : {
					"cause" : "gateway is illegal.",
					"desc" : "gateway is illegal.",
					"solution" : "Enter valid gateway"
				},
				"0007405106" : {
					"cause" : "Failed to generate DHCP configuration.",
					"desc" : "Failed to generate DHCP configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405107" : {
					"cause" : "The host IP address does not match the management network configuration.",
					"desc" : "The host IP address does not match the management network configuration.",
					"solution" : "Please confirm that the host IP address matches the management network configuration."
				},
				"0007405108" : {
					"cause" : "The system has old network information.",
					"desc" : "The system has old network information.",
					"solution" : "Please confirm that the system does not have old network information."
				},
				"0007405200" : {
					"cause" : "The node profile does not exist.",
					"desc" : "The node profile does not exist.",
					"solution" : "Please confirm node profile does not exist."
				},
				"0007405201" : {
					"cause" : "The node is being processed.",
					"desc" : "The node is being processed.",
					"solution" : "Please confirm node is dealing."
				},
				"0007405202" : {
					"cause" : "The host IP address is not configured.",
					"desc" : "The host IP address is not configured.",
					"solution" : "Please config host IP address."
				},
				"0007405203" : {
					"cause" : "Failed to delete the node information.",
					"desc" : "Failed to delete the node information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405204" : {
					"cause" : "The node information does not exist.",
					"desc" : "The node information does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405205" : {
					"cause" : "The MAC address is illegal.",
					"desc" : "The MAC address is illegal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405206" : {
					"cause" : "The node IP address is illegal.",
					"desc" : "The node IP address is illegal.",
					"solution" : "Please enter a valid node IP address."
				},
				"0007405207" : {
					"cause" : "The management network does not exist.",
					"desc" : "The management network does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405208" : {
					"cause" : "The node IP address is not in the management network segment.",
					"desc" : "The node IP address is not in the management network segment.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405209" : {
					"cause" : "Invalid node name.",
					"desc" : "Invalid node name.",
					"solution" : "Please enter a valid node name."
				},
				"0007405300" : {
					"cause" : "Failed to add node configuration.",
					"desc" : "Failed to add node configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405301" : {
					"cause" : "Failed to delete node configuration.",
					"desc" : "Failed to delete node configuration.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007405400" : {
					"cause" : "The OS image does not reside in the specified directory.",
					"desc" : "The OS image does not reside in the specified directory.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007406000" : {
					"cause" : "Run the script error.",
					"desc" : "Run the script error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007406001" : {
					"cause" : "Script error during the running process.",
					"desc" : "Script error during the running process.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007406002" : {
					"cause" : "The result returned by the script is null.",
					"desc" : "The result returned by the script is null.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007406003" : {
					"cause" : "The result returned by the script is incorrect.",
					"desc" : "The result returned by the script is incorrect.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007407000" : {
					"cause" : "UI exception occurred.",
					"desc" : "UI exception occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007407001" : {
					"cause" : "Authentication failed.",
					"desc" : "Authentication failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007407002" : {
					"cause" : "You do not have rights to perform this operation.",
					"desc" : "You do not have rights to perform this operation.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007407003" : {
					"cause" : "Failed to get user information.",
					"desc" : "Failed to get user information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408000" : {
					"cause" : "License management internal error.",
					"desc" : "License management internal error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408001" : {
					"cause" : "Failed to obtain the ESN.",
					"desc" : "Failed to obtain the ESN.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408002" : {
					"cause" : "ESN does not match or license file error.",
					"desc" : "ESN does not match or license file error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408003" : {
					"cause" : "The default license is empty.",
					"desc" : "The default license is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408004" : {
					"cause" : "The default license is illegal.",
					"desc" : "The default license is illegal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408005" : {
					"cause" : "Failed to obtain the license feature.",
					"desc" : "Failed to obtain the license feature.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408006" : {
					"cause" : "Failed to verify the license feature.",
					"desc" : "Failed to verify the license feature.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408007" : {
					"cause" : "Failed to save the license information.",
					"desc" : "Failed to save the license information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408008" : {
					"cause" : "The license file has expired.",
					"desc" : "The license file has expired.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408009" : {
					"cause" : "The uploading of the license file is canceled.",
					"desc" : "The uploading of the license file is canceled.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408010" : {
					"cause" : "The resource exceeds the authorized license resource.",
					"desc" : "The resource exceeds the authorized license resource.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408011" : {
					"cause" : "License is invalid.",
					"desc" : "License is invalid.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408012" : {
					"cause" : "Select none file to upload.",
					"desc" : "Select none file to upload.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408013" : {
					"cause" : "Name of file to be uploaded is empty.",
					"desc" : "Name of file to be uploaded is empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408014" : {
					"cause" : "The license file to be uploaded does not exist.",
					"desc" : "The license file to be uploaded does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408015" : {
					"cause" : "Failed to upload the license file to the license server.",
					"desc" : "Failed to upload the license file to the license server.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007408016" : {
					"cause" : "The number of resources allowed in the uploaded license file is less than that of in-use\u00A0resources.",
					"desc" : "The number of resources allowed in the uploaded license file is less than that of in-use\u00A0resources.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409000" : {
					"cause" : "Manual backup failure.",
					"desc" : "Manual backup failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409001" : {
					"cause" : "A manual backup task is in progress. Please try again later.",
					"desc" : "A manual backup task is in progress. Please try again later.",
					"solution" : "A manual backup task is in progress. Please try again later."
				},
				"0007409002" : {
					"cause" : "No component is selected for issuing the backup command. Select the component first.",
					"desc" : "No component is selected for issuing the backup command. Select the component first.",
					"solution" : "Select the component first."
				},
				"0007409003" : {
					"cause" : "Failed to add the FTP server.",
					"desc" : "Failed to add the FTP server.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409004" : {
					"cause" : "System anomalies.",
					"desc" : "System anomalies.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409100" : {
					"cause" : "Auto backup failure.",
					"desc" : "Auto backup failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409101" : {
					"cause" : "Auto backup failure. Unknown error.",
					"desc" : "Auto backup failure. Unknown error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409102" : {
					"cause" : "Auto backup failure. System error.",
					"desc" : "Auto backup failure. System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409106" : {
					"cause" : "Auto backup failure. DB status is abnormal.",
					"desc" : "Auto backup failure. DB status is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409107" : {
					"cause" : "Auto backup failure. DB operation failure.",
					"desc" : "Auto backup failure. DB operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409108" : {
					"cause" : "Auto backup failure. Local disk space is not enough.",
					"desc" : "Auto backup failure. Local disk space is not enough.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409109" : {
					"cause" : "Auto backup failure. The local backup file sn is overflow.",
					"desc" : "Auto backup failure. The local backup file sn is overflow.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409112" : {
					"cause" : "Auto backup failure. Local file operation failure.",
					"desc" : "Auto backup failure. Local file operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409123" : {
					"cause" : "Auto backup failure. The script input parameters are wrong.",
					"desc" : "Auto backup failure. The script input parameters are wrong.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409124" : {
					"cause" : "Auto backup failure. Init log error.",
					"desc" : "Auto backup failure. Init log error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409200" : {
					"cause" : "Restore failure.",
					"desc" : "Restore failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409201" : {
					"cause" : "Restore failure. Unknown error.",
					"desc" : "Restore failure. Unknown error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409202" : {
					"cause" : "Restore failure. System error.",
					"desc" : "Restore failure. System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409203" : {
					"cause" : "Restore failure. Another manual backup task is running.",
					"desc" : "Restore failure. Another manual backup task is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409204" : {
					"cause" : "Restore failure. Another auto backup task is running.",
					"desc" : "Restore failure. Another auto backup task is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409205" : {
					"cause" : "Restore failure. Another restore task is running.",
					"desc" : "Restore failure. Another restore task is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409207" : {
					"cause" : "Restore failure. DB operation failure.",
					"desc" : "Restore failure. DB operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409208" : {
					"cause" : "Restore failure. Local disk space is not enough.",
					"desc" : "Restore failure. Local disk space is not enough.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409212" : {
					"cause" : "Restore failure. Local file operation failure.",
					"desc" : "Restore failure. Local file operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409217" : {
					"cause" : "Restore failure. The FusionManager version number does not match.",
					"desc" : "Restore failure. The FusionManager version number does not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409218" : {
					"cause" : "Restore failure. The FusionManager version file does not exist.",
					"desc" : "Restore failure. The FusionManager version file does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409219" : {
					"cause" : "Restore failure. SHA checksum failed.",
					"desc" : "Restore failure. SHA checksum failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409220" : {
					"cause" : "Restore failure. Stop FusionManager process fails.",
					"desc" : "Restore failure. Stop FusionManager process fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409221" : {
					"cause" : "Restore failure. Start FusionManager process fails.",
					"desc" : "Restore failure. Start FusionManager process fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409222" : {
					"cause" : "Restore failure. Start database fails.",
					"desc" : "Restore failure. Start database fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409223" : {
					"cause" : "Restore failure. The script input parameters are wrong.",
					"desc" : "Restore failure. The script input parameters are wrong.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409224" : {
					"cause" : "Restore failure. Init log error.",
					"desc" : "Restore failure. Init log error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409300" : {
					"cause" : "Upload backup file failure.",
					"desc" : "Upload backup file failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409301" : {
					"cause" : "Upload backup file failure. Unknown error.",
					"desc" : "Upload backup file failure. Unknown error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409309" : {
					"cause" : "Upload backup file failure. The local backup file sn is overflow.",
					"desc" : "Upload backup file failure. The local backup file sn is overflow.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409310" : {
					"cause" : "Upload backup file failure. The user name or password is wrong while connecting to the third backup server.",
					"desc" : "Upload backup file failure. The user name or password is wrong while connecting to the third backup server.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409311" : {
					"cause" : "Upload backup file failure. The third backup server is unreachable.",
					"desc" : "Upload backup file failure. The third backup server is unreachable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409312" : {
					"cause" : "Upload backup file failure. Local file operation failure.",
					"desc" : "Upload backup file failure. Local file operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409313" : {
					"cause" : "Upload backup file failure. Remote file operation failure.",
					"desc" : "Upload backup file failure. Remote file operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409314" : {
					"cause" : "There is no file need to be transferred to the third backup server.",
					"desc" : "There is no file need to be transferred to the third backup server.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409315" : {
					"cause" : "Upload backup file failure. There are files which have the same time in local host.",
					"desc" : "Upload backup file failure. There are files which have the same time in local host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409316" : {
					"cause" : "Upload backup file failure. There are too many backup files in local host.",
					"desc" : "Upload backup file failure. There are too many backup files in local host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409317" : {
					"cause" : "The FTP password is empty.",
					"desc" : "The FTP password is empty.",
					"solution" : "Please Enter the password"
				},
				"0007409323" : {
					"cause" : "Upload backup file failure. The script input parameters are wrong.",
					"desc" : "Upload backup file failure. The script input parameters are wrong.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409324" : {
					"cause" : "Upload backup file failure. Init log error.",
					"desc" : "Upload backup file failure. Init log error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409325" : {
					"cause" : "Upload backup file failure. Remote backup files and local backup files are inconsistent.",
					"desc" : "Upload backup file failure. Remote backup files and local backup files are inconsistent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409400" : {
					"cause" : "Backup and restore base error.",
					"desc" : "Backup and restore base error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409401" : {
					"cause" : "Unknown error.",
					"desc" : "Unknown error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409402" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409403" : {
					"cause" : "Another manual backup task is running.",
					"desc" : "Another manual backup task is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409404" : {
					"cause" : "Another auto backup task is running.",
					"desc" : "Another auto backup task is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409405" : {
					"cause" : "Another restore task is running.",
					"desc" : "Another restore task is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409406" : {
					"cause" : "DB status is abnormal.",
					"desc" : "DB status is abnormal.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409407" : {
					"cause" : "DB operation failure.",
					"desc" : "DB operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409408" : {
					"cause" : "Local disk space is not enough.",
					"desc" : "Local disk space is not enough.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409409" : {
					"cause" : "The local backup file sn is overflow.",
					"desc" : "The local backup file sn is overflow.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409410" : {
					"cause" : "The user name or password is wrong while connecting to the third backup server.",
					"desc" : "The user name or password is wrong while connecting to the third backup server.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409411" : {
					"cause" : "The third backup server is unreachable.",
					"desc" : "The third backup server is unreachable.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409412" : {
					"cause" : "Local file operation failure.",
					"desc" : "Local file operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409413" : {
					"cause" : "Remote file operation failure.",
					"desc" : "Remote file operation failure.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409414" : {
					"cause" : "There is no file need to be transferred to the third backup server.",
					"desc" : "There is no file need to be transferred to the third backup server.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409415" : {
					"cause" : "There are files which have the same time in local host.",
					"desc" : "There are files which have the same time in local host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409416" : {
					"cause" : "There are too many auto backup files in local host.",
					"desc" : "There are too many auto backup files in local host.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409417" : {
					"cause" : "The FusionManager version number does not match.",
					"desc" : "The FusionManager version number does not match.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409418" : {
					"cause" : "The FusionManager version file does not exist.",
					"desc" : "The FusionManager version file does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409419" : {
					"cause" : "SHA checksum failed.",
					"desc" : "SHA checksum failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409420" : {
					"cause" : "Stop FusionManager process fails.",
					"desc" : "Stop FusionManager process fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409421" : {
					"cause" : "Start FusionManager process fails.",
					"desc" : "Start FusionManager process fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409422" : {
					"cause" : "Start database fails.",
					"desc" : "Start database fails.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409423" : {
					"cause" : "The script input parameters are wrong.",
					"desc" : "The script input parameters are wrong.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409424" : {
					"cause" : "Init log error.",
					"desc" : "Init log error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409425" : {
					"cause" : "Remote backup files and local backup files are inconsistent.",
					"desc" : "Remote backup files and local backup files are inconsistent.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007409426" : {
					"cause" : "The operation failed for other components.",
					"desc" : "The operation failed for other components.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410000" : {
					"cause" : "Time management error occurred.",
					"desc" : "Time management error occurred.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410001" : {
					"cause" : "Failed to configure the UHM time zone information.",
					"desc" : "Failed to configure the UHM time zone information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410002" : {
					"cause" : "Failed to configure the UHM time synchronization information.",
					"desc" : "Failed to configure the UHM time synchronization information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410003" : {
					"cause" : "Failed to configure the FusionCompute time synchronization information.",
					"desc" : "Failed to configure the FusionCompute time synchronization information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410004" : {
					"cause" : "Failed to configure the FusionCompute time zone information.",
					"desc" : "Failed to configure the FusionCompute time zone information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410005" : {
					"cause" : "Failed to query the FusionCompute synchronization information.",
					"desc" : "Failed to query the FusionCompute synchronization information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410006" : {
					"cause" : "The parameters are inconsistent with data in db.",
					"desc" : "The parameters are inconsistent with data in db.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410007" : {
					"cause" : "The configured time server IP address conflicts with the FusionManager IP address.",
					"desc" : "The configured time server IP address conflicts with the FusionManager IP address.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410008" : {
					"cause" : "There is a repetition of input IP addresses.",
					"desc" : "There is a repetition of input IP addresses.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410010" : {
					"cause" : "Failed to modify the time zone config file.",
					"desc" : "Failed to modify the time zone config file.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410011" : {
					"cause" : "The DST start or end time cannot be empty.",
					"desc" : "The DST start or end time cannot be empty.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410012" : {
					"cause" : "The configured time server IP address is the same as that of the CNA on which the FusionManager is running.",
					"desc" : "The configured time server IP address is the same as that of the CNA on which the FusionManager is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410013" : {
					"cause" : "The real DST end time and start time cannot be in the same month.",
					"desc" : "The real DST end time and start time cannot be in the same month.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410014" : {
					"cause" : "Failed to obtain the urn of the CNA on which the FusionManager is running.",
					"desc" : "Failed to obtain the urn of the CNA on which the FusionManager is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410015" : {
					"cause" : "Failed to obtain the NTP information of the CNA on which the FusionManager is running.",
					"desc" : "Failed to obtain the NTP information of the CNA on which the FusionManager is running.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410016" : {
					"cause" : "No external time server is available.",
					"desc" : "No external time server is available.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410017" : {
					"cause" : "System Exception.",
					"desc" : "System Exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410018" : {
					"cause" : "Failed to obtain the connector of FusionStorage.",
					"desc" : "Failed to obtain the connector of FusionStorage.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410019" : {
					"cause" : "Failed to configure the FusionStorage time synchronization information.",
					"desc" : "Failed to configure the FusionStorage time synchronization information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410020" : {
					"cause" : "Failed to configure the FusionStorage time zone information.",
					"desc" : "Failed to configure the FusionStorage time zone information.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410021" : {
					"cause" : "Failed to obtain information about the current deployment scenario.",
					"desc" : "Failed to obtain information about the current deployment scenario.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410022" : {
					"cause" : "NTP server tuning in progress. Please try again later.",
					"desc" : "NTP server tuning in progress. Please try again later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410023" : {
					"cause" : "Configuring the clock source or time zone... Please try again 3 minutes later.",
					"desc" : "Configuring the clock source or time zone... Please try again 3 minutes later.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410025" : {
					"cause" : "Forcible synchronization between FusionManager and the upper-layer time server failed.",
					"desc" : "Forcible synchronization between FusionManager and the upper-layer time server failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410026" : {
					"cause" : "Forcible synchronization between FusionCompute and the upper-layer time server failed.",
					"desc" : "Forcible synchronization between FusionCompute and the upper-layer time server failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410027" : {
					"cause" : "Disable HA service failed.",
					"desc" : "Disable HA service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410028" : {
					"cause" : "Enable HA service failed.",
					"desc" : "Enable HA service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410029" : {
					"cause" : "Restart HA service failed.",
					"desc" : "Restart HA service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410030" : {
					"cause" : "Restart FusionManager service failed.",
					"desc" : "Restart FusionManager service failed.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410500" : {
					"cause" : "The system is saving the time synchronization data.",
					"desc" : "The system is saving the time synchronization data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410501" : {
					"cause" : "The system is saving the time zone data.",
					"desc" : "The system is saving the time zone data.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007410502" : {
					"cause" : "The system is forcibly synchronizing the system time.",
					"desc" : "The system is forcibly synchronizing the system time.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411000" : {
					"cause" : "Internal error in system check.",
					"desc" : "Internal error in system check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411001" : {
					"cause" : "Failed to start the software check.",
					"desc" : "Failed to start the software check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411002" : {
					"cause" : "Failed to start the hardware check.",
					"desc" : "Failed to start the hardware check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411003" : {
					"cause" : "Conflict in the software check.",
					"desc" : "Conflict in the software check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411004" : {
					"cause" : "Conflict in the hardware check.",
					"desc" : "Conflict in the hardware check.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411005" : {
					"cause" : "The hardware check cannot be performed during hardware detection.",
					"desc" : "The hardware check cannot be performed during hardware detection.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411006" : {
					"cause" : "Failed to query the software check status.",
					"desc" : "Failed to query the software check status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411007" : {
					"cause" : "The management cluster has not been created, and software check cannot start.",
					"desc" : "The management cluster has not been created, and software check cannot start.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411008" : {
					"cause" : "Failed to obtain the host list.",
					"desc" : "Failed to obtain the host list.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411009" : {
					"cause" : "Failed to synchronize the management cluster status because no board information is available.",
					"desc" : "Failed to synchronize the management cluster status because no board information is available.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411010" : {
					"cause" : "Failed to synchronize the management cluster status because the hardware check is not complete.",
					"desc" : "Failed to synchronize the management cluster status because the hardware check is not complete.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411011" : {
					"cause" : "Failed to synchronize the management cluster again because the management cluster already exists.",
					"desc" : "Failed to synchronize the management cluster again because the management cluster already exists.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411012" : {
					"cause" : "Failed to synchronize the management cluster because no disk is available in the ZK slot of the LCNA.",
					"desc" : "Failed to synchronize the management cluster because no disk is available in the ZK slot of the LCNA.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007411013" : {
					"cause" : "Failed to synchronize the management cluster because no blade is available or discovered in the LCNA slot.",
					"desc" : "Failed to synchronize the management cluster because no blade is available or discovered in the LCNA slot.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412001" : {
					"cause" : "Failed to obtain software archive.",
					"desc" : "Failed to obtain software archive.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412002" : {
					"cause" : "Failed to obtain hardware archive.",
					"desc" : "Failed to obtain hardware archive.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412003" : {
					"cause" : "Generating device archives…",
					"desc" : "Generating device archives…",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412004" : {
					"cause" : "Discovering the blade server…",
					"desc" : "Discovering the blade server…",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412005" : {
					"cause" : "Device archive template does not exist, and device archive cannot be created.",
					"desc" : "Device archive template does not exist, and device archive cannot be created.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412006" : {
					"cause" : "Deploying devices…",
					"desc" : "Deploying devices…",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412007" : {
					"cause" : "Failed to obtain information about some switches.",
					"desc" : "Failed to obtain information about some switches.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412008" : {
					"cause" : "Failed to obtain information about some blade servers.",
					"desc" : "Failed to obtain information about some blade servers.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412009" : {
					"cause" : "Failed to deploy all switches.",
					"desc" : "Failed to deploy all switches.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412010" : {
					"cause" : "Failed to generate device archives.",
					"desc" : "Failed to generate device archives.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412011" : {
					"cause" : "Failed to decompress device archives.",
					"desc" : "Failed to decompress device archives.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412012" : {
					"cause" : "An internal UHM system error.",
					"desc" : "An internal UHM system error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412013" : {
					"cause" : "Device archive obtaining timed out",
					"desc" : "Device archive obtaining timed out",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412014" : {
					"cause" : "Failed to query device archive generation progress.",
					"desc" : "Failed to query device archive generation progress.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007412015" : {
					"cause" : "Failed to deploy all servers.",
					"desc" : "Failed to deploy all servers.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007413001" : {
					"cause" : "Failed to get the equipment maintenance channel.",
					"desc" : "Failed to get the equipment maintenance channel.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007413002" : {
					"cause" : "Failed to configure the equipment maintenance channel.",
					"desc" : "Failed to configure the equipment maintenance channel.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007413003" : {
					"cause" : "Input parameter is illegal.",
					"desc" : "Input parameter is illegal.",
					"solution" : "Enter valid parameter"
				},
				"0007413004" : {
					"cause" : "IP is out of range.",
					"desc" : "IP is out of range.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007413005" : {
					"cause" : "IP or username repeated.",
					"desc" : "IP or username repeated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007413006" : {
					"cause" : "Total record number has exceeded max value.",
					"desc" : "Total record number has exceeded max value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007413007" : {
					"cause" : "Incorrect old password.",
					"desc" : "Incorrect old password.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007414000" : {
					"cause" : "Internal error in installation source.",
					"desc" : "Internal error in installation source.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007414001" : {
					"cause" : "There is a repetition of the installation source.",
					"desc" : "There is a repetition of the installation source.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007414002" : {
					"cause" : "The installation source does not exist.",
					"desc" : "The installation source does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007414003" : {
					"cause" : "Failed to create installation source.",
					"desc" : "Failed to create installation source.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0007414004" : {
					"cause" : "Installation source is in use.",
					"desc" : "Installation source is in use.",
					"solution" : "Please contact your administrator or view the help manual."
				}
			};
			return exceptionMap;
		})