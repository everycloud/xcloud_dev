define([], function() { 
	var exceptionMap = {
				"1000008" : {
					"cause" : "You are not authorized to perform this operation",
					"desc" : "You are not authorized to perform this operation",
					"solution" : "Please contact the system administrator."
				},
				"1181002" : {
					"cause" : "The VPC does not exist.",
					"desc" : "The VPC does not exist.",
					"solution" : "Please ensure the existence of the VPC."
				},
				"1200001" : {
					"cause" : "The Proxy VM does not exist.",
					"desc" : "The Proxy VM does not exist.",
					"solution" : "Please ensure the existence of the proxy VM in the VPC."
				},
				"401001" : {
					"cause" : "The file path of the script or software (ISO) is not specified.",
					"desc" : "The file path of the script or software (ISO) is not specified.",
					"solution" : "Please specify the file path of the script or software(ISO)."
				},
				"401003" : {
					"cause" : "The file path of the script or software (ISO) is invalid.",
					"desc" : "The file path of the script or software (ISO) is invalid.",
					"solution" : "Please enter valid file path of the script or software(ISO)."
				},
				"401007" : {
					"cause" : "Duplicate script (ISO/software) ID is duplicated.",
					"desc" : "Duplicate script (ISO/software) ID is duplicated.",
					"solution" : "Please contact the system administrator."
				},
				"404004" : {
					"cause" : "The script (ISO/software) file does not exist or fails to be removed.",
					"desc" : "The script (ISO/software) file does not exist or fails to be removed.",
					"solution" : "Please contact the system administrator."
				},
				"404006" : {
					"cause" : "The software(ISO) file does not exist or fails to be deleted.",
					"desc" : "The software(ISO) file does not exist or fails to be deleted.",
					"solution" : "Please contact the system administrator."
				},
				"404008" : {
					"cause" : "The script or software (ISO) file does not exist or fails to be queried.",
					"desc" : "The script or software (ISO) file does not exist or fails to be queried.",
					"solution" : "Please contact the system administrator."
				},
				"5100001" : {
					"cause" : "Some parameters are not specified.",
					"desc" : "Some parameters are not specified.",
					"solution" : "Please specify required parameters."
				},
				"5100002" : {
					"cause" : "Invalid parameters.",
					"desc" : "Invalid parameters.",
					"solution" : "Please modify the parameters."
				},
				"5100003" : {
					"cause" : "Internal service error.",
					"desc" : "Internal service error.",
					"solution" : "Please contact the system administrator."
				},
				"5100004" : {
					"cause" : "The request is empty.",
					"desc" : "The request is empty.",
					"solution" : "Please check the input request parameters."
				},
				"5100005" : {
					"cause" : "Invalid start page number.",
					"desc" : "Invalid start page number.",
					"solution" : "Please enter a valid start page number."
				},
				"5100006" : {
					"cause" : "Invalid number of records displayed on each page.",
					"desc" : "Invalid number of records displayed on each page.",
					"solution" : "Please enter a valid number."
				},
				"5100007" : {
					"cause" : "Database error.",
					"desc" : "Database error.",
					"solution" : "Please contact the system administrator."
				},
				"5102721" : {
					"cause" : "Query VM failed.",
					"desc" : "Query VM failed.",
					"solution" : "Please contact the system administrator."
				},
				"5103001" : {
					"cause" : "The software package does not exist.",
					"desc" : "The software package does not exist.",
					"solution" : "Please ensure the existence of the software package."
				},
				"5103002" : {
					"cause" : "The resource already exists.",
					"desc" : "The resource already exists.",
					"solution" : "Please contact the system administrator."
				},
				"5103003" : {
					"cause" : "The resource type does not exist.",
					"desc" : "The resource type does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"5103004" : {
					"cause" : "The resource is being used.",
					"desc" : "The resource is being used.",
					"solution" : "Please contact the system administrator."
				},
				"5103008" : {
					"cause" : "The number of uploaded software packages in the VDC reached the maximum value.",
					"desc" : "The number of uploaded software packages in the VDC reached the maximum value.",
					"solution" : "Please contact the system administrator."
				},
				"5103009" : {
					"cause" : "Total size of uploaded software packages reached the maximum value.",
					"desc" : "Total size of uploaded software packages reached the maximum value.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5103011" : {
					"cause" : "The software package or script is being repaired.",
					"desc" : "The software package or script is being repaired.",
					"solution" : "Please try again later."
				},
				"5103014" : {
					"cause" : "The software package size exceeds 4 GB.",
					"desc" : "The software package size exceeds 4 GB.",
					"solution" : "Please select a file smaller than 4 GB."
				},
				"5103015" : {
					"cause" : "The file does not exist.",
					"desc" : "The file does not exist.",
					"solution" : "Please select a file that exists."
				},
				"5103016" : {
					"cause" : "The file size exceeds 1 MB.",
					"desc" : "The file size exceeds 1 MB.",
					"solution" : "Please select a file smaller than 1 MB."
				},
				"5103017" : {
					"cause" : "The resource does not exist.",
					"desc" : "The resource does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"5103088" : {
					"cause" : "The number of uploaded software packages in the system has reached the upper limit.",
					"desc" : "The number of uploaded software packages in the system has reached the upper limit.",
					"solution" : "Please contact the system administrator."
				},
				"5400001" : {
					"cause" : "The VM has already been selected.",
					"desc" : "The VM has already been selected.",
					"solution" : "Please deselect the VM."
				},
				"5400002" : {
					"cause" : "No VM is selected.",
					"desc" : "No VM is selected.",
					"solution" : "Please select at least one VM."
				},
				"5400003" : {
					"cause" : "Invalid parameters.",
					"desc" : "Invalid parameters.",
					"solution" : "Please enter valid parameters."
				},
				"5400004" : {
					"cause" : "Software installation or script execution on the VM is in progress.",
					"desc" : "Software installation or script execution on the VM is in progress.",
					"solution" : "Please try again later."
				},
				"5400005" : {
					"cause" : "The number of VMs on which software installation or script execution is in progress has reached the upper limit.",
					"desc" : "The number of VMs on which software installation or script execution is in progress has reached the upper limit.",
					"solution" : "Please try again later."
				},
				"5410005" : {
					"cause" : "The script or software (ISO) does not exist.",
					"desc" : "The script or software (ISO) does not exist.",
					"solution" : "Please contact the system administrator."
				},
				"5411001" : {
					"cause" : "The name already exists in the database.",
					"desc" : "The name already exists in the database.",
					"solution" : "Please enter another name."
				},
				"5411011" : {
					"cause" : "The number of scripts (ISO/software) is out of bound.",
					"desc" : "The number of scripts (ISO/software) is out of bound.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5411013" : {
					"cause" : "The ISO file does not exist.",
					"desc" : "The ISO file does not exist.",
					"solution" : "Please upload ISO file again."
				},
				"5411014" : {
					"cause" : "Invalid ISO file name extension.",
					"desc" : "Invalid ISO file name extension.",
					"solution" : "Please select another ISO file with a valid file name extension"
				},
				"5411015" : {
					"cause" : "The ISO file size exceeds the threshold.",
					"desc" : "The ISO file size exceeds the threshold.",
					"solution" : "Please select another ISO file."
				},
				"5103105" : {
					"cause" : "Some vm does not exist or status is not running.",
					"desc" : "Some vm does not exist or status is not running.",
					"solution" : "Please select valid vms."
				},
				"0005201030" : {
					"cause" : "ftp account is not exist, please modify password to create",
					"desc" : "ftp account is not exist, please modify password to create",
					"solution" : "Please modify password to create"
				}
			};
			return exceptionMap;
		})