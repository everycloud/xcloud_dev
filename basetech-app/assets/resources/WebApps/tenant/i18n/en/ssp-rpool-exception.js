define([ "tiny-lib/underscore" ], function(_) {
			var exceptionMap = {
				"#1010072" : {
					"cause" : "The host is powered off, the management IP address is unreachable, the password for logging in to the SMM is incorrect, or the SMM is disconnected.",
					"desc" : "The host is powered off, the management IP address is unreachable, the password for logging in to the SMM is incorrect, or the SMM is disconnected.",
					"solution" : "Contact the system administrator."
				},
				"0000000001" : {
					"cause" : "Internal error.",
					"desc" : "Internal error.",
					"solution" : "Contact the system administrator."
				},
				"0000010002" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Contact the system administrator."
				},
				"0000010004" : {
					"cause" : "You do not have the permission.",
					"desc" : "You do not have the permission.",
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
				"0000020000" : {
					"cause" : "Database error.",
					"desc" : "Database error.",
					"solution" : "Contact the system administrator."
				},
				"0005010001" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support."
				},
				"0005010002" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact the system administrator."
				},
				"0005010019" : {
					"cause" : "The operation timed out.",
					"desc" : "The operation timed out.",
					"solution" : "Please contact Huawei technical support."
				},
				"0005010022" : {
					"cause" : "The language setting of hypervisor [{0}] is invalid.",
					"desc" : "The language setting of hypervisor [{0}] is invalid.",
					"solution" : "Set the language for the hypervisor correctly."
				},
				"0005010066" : {
					"cause" : "Invalid input parameter name.",
					"desc" : "Invalid input parameter name.",
					"solution" : "Contact technical support."
				},
				"0005010127" : {
					"cause" : "The number of hard disks on the VM exceeds the maximum.",
					"desc" : "The number of hard disks on the VM exceeds the maximum.",
					"solution" : "Contact technical support."
				},
				"0005010145" : {
					"cause" : "A CD-ROM has been mounted to VM.",
					"desc" : "A CD-ROM has been mounted to VM.",
					"solution" : "Contact the system administrator."
				},
				"0005010156" : {
					"cause" : "The disk is being used by the VM.",
					"desc" : "The disk is being used by the VM.",
					"solution" : "Contact technical support."
				},
				"0005010186" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"0005010190" : {
					"cause" : "Insufficient storage resources.",
					"desc" : "Insufficient storage resources.",
					"solution" : "Contact the system administrator."
				},
				"0005010205" : {
					"cause" : "Error in querying the number of disks in batches.",
					"desc" : "Error in querying the number of disks in batches.",
					"solution" : "Contact the system administrator."
				},
				"0005010232" : {
					"cause" : "The port group, to which the VM NIC belongs, does not exist.",
					"desc" : "The port group, to which the VM NIC belongs, does not exist.",
					"solution" : "Contact technical support."
				},
				"0005010280" : {
					"cause" : "The VM is performing this operation.",
					"desc" : "The VM is performing this operation.",
					"solution" : "Contact the system administrator."
				},
				"0005010366" : {
					"cause" : "The VM is being cloned and does not support disk operations.",
					"desc" : "The VM is being cloned and does not support disk operations.",
					"solution" : "Contact the system administrator."
				},
				"0005010409" : {
					"cause" : "User canceled task.",
					"desc" : "User canceled task.",
					"solution" : "Check that the task is reasonably canceled."
				},
				"0005010434" : {
					"cause" : "This disk can not bind the virtual machine, the virtual machine join the organization please try again.",
					"desc" : "This disk can not bind the virtual machine, the virtual machine join the organization please try again.",
					"solution" : "Contact the system administrator."
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
					"solution" : "Contact technical support."
				},
				"0005010488" : {
					"cause" : "The name is invalid",
					"desc" : "The name is invalid",
					"solution" : "Enter valid parameters."
				},
				"0005010489" : {
					"cause" : "Another operation involving the object is currently in progress.",
					"desc" : "Another operation involving the object is currently in progress.",
					"solution" : "Please try again later."
				},
				"0005010491" : {
					"cause" : "The created or attached disk does not support DR.",
					"desc" : "The created or attached disk does not support DR.",
					"solution" : "Contact technical support."
				},
				"0005010492" : {
					"cause" : "The destination node or resource cluster does not have storage resources required for running the VM.",
					"desc" : "The destination node or resource cluster does not have storage resources required for running the VM.",
					"solution" : "Contact technical support."
				},
				"0005011011" : {
					"cause" : "Insufficient resources.",
					"desc" : "Insufficient resources.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact the system administrator."
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
					"solution" : "Contact the system administrator."
				},
				"0005011053" : {
					"cause" : "The system disk is not allowed to be deleted on line.",
					"desc" : "The system disk is not allowed to be deleted on line.",
					"solution" : "Contact the system administrator."
				},
				"0005011056" : {
					"cause" : "Insufficient capacity on each physical CPU.",
					"desc" : "Insufficient capacity on each physical CPU.",
					"solution" : "Contact technical support."
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
				"0005011069" : {
					"cause" : "Readable and writable storage space is insufficient.",
					"desc" : "Readable and writable storage space is insufficient.",
					"solution" : "Ensure that the data store has sufficient storage space."
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
				"0005011085" : {
					"cause" : "The guest operating system is not supported.",
					"desc" : "The guest operating system is not supported.",
					"solution" : "Please select other operating system."
				},
				"0005011087" : {
					"cause" : "No host is compatible with the virtual machine.",
					"desc" : "No host is compatible with the virtual machine.",
					"solution" : "Contact technical support."
				},
				"0005011101" : {
					"cause" : "Can not access vm config file.",
					"desc" : "Can not access vm config file.",
					"solution" : "Contact technical support."
				},
				"0005011125" : {
					"cause" : "The disk operation failed.",
					"desc" : "The disk operation failed.",
					"solution" : "Please confirm the maximum disk size supported by the data store."
				},
				"0005011127" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a shared disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a shared disk.",
					"solution" : "Contact the system administrator."
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
				"0005011195" : {
					"cause" : "The VMware component does not support this operation.",
					"desc" : "The VMware component does not support this operation.",
					"solution" : "Perform this operation on the FusionCompute."
				},
				"0005011197" : {
					"cause" : "The VM disk is inaccessible.",
					"desc" : "The VM disk is inaccessible.",
					"solution" : "Contact technical support."
				},
				"0005011198" : {
					"cause" : "The object does not exist in the system.",
					"desc" : "The object does not exist in the system.",
					"solution" : "Refresh the page and try again."
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
					"solution" : "Contact technical support."
				},
				"0005011206" : {
					"cause" : "The number of virtual devices exceeds the maximum.",
					"desc" : "The number of virtual devices exceeds the maximum.",
					"solution" : "Contact the system administrator."
				},
				"0005011207" : {
					"cause" : "The host is faulty.",
					"desc" : "The host is faulty.",
					"solution" : "Contact technical support."
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
				"0005011215" : {
					"cause" : "The VM ID in the request is incorrect.",
					"desc" : "The VM ID in the request is incorrect.",
					"solution" : "Contact the system administrator."
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
				"0005011220" : {
					"cause" : "VM templates do not support disk capacity.",
					"desc" : "VM templates do not support disk capacity.",
					"solution" : "Contact technical support."
				},
				"0005011221" : {
					"cause" : "The target disk size must be less than the upper limit of the storage type capacity.",
					"desc" : "The target disk size must be less than the upper limit of the storage type capacity.",
					"solution" : "Please change the size of the target disk to be expanded."
				},
				"0005011223" : {
					"cause" : "The storage device of this type does not support nonpersistent delta disks.",
					"desc" : "The storage device of this type does not support nonpersistent delta disks.",
					"solution" : "Contact the system administrator."
				},
				"0005011224" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"solution" : "Contact the system administrator."
				},
				"0005011225" : {
					"cause" : "Only the normal disk can be unpersistent.",
					"desc" : "Only the normal disk can be unpersistent.",
					"solution" : "Contact the system administrator."
				},
				"0005011226" : {
					"cause" : "Only the virtual storage disk can be modified the persistent property.",
					"desc" : "Only the virtual storage disk can be modified the persistent property.",
					"solution" : "Contact the system administrator."
				},
				"0005011227" : {
					"cause" : "Can't query disk from BSB.",
					"desc" : "Can't query disk from BSB.",
					"solution" : "Contact the system administrator."
				},
				"0005011228" : {
					"cause" : "The status of disk or the status of attached VM is conflicted, cannot modify the persistent property.",
					"desc" : "The status of disk or the status of attached VM is conflicted, cannot modify the persistent property.",
					"solution" : "Contact the system administrator."
				},
				"0005011230" : {
					"cause" : "The Not affected by snapshots setting of the disk cannot be changed because the disk has snapshots created.",
					"desc" : "The Not affected by snapshots setting of the disk cannot be changed because the disk has snapshots created.",
					"solution" : "Contact the system administrator."
				},
				"0005011239" : {
					"cause" : "Parameter: refreshflag is invalid.",
					"desc" : "Parameter: refreshflag is invalid.",
					"solution" : "Contact the system administrator."
				},
				"0005011241" : {
					"cause" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"desc" : "The Affected by Snapshot parameter must be set to No for a nonpersistent disk.",
					"solution" : "Contact the system administrator."
				},
				"0005011246" : {
					"cause" : "This hypervisor does not support this operation.",
					"desc" : "This hypervisor does not support this operation.",
					"solution" : "Contact technical support."
				},
				"0005012023" : {
					"cause" : "The disk is used for memory swap.",
					"desc" : "The disk is used for memory swap.",
					"solution" : "Contact the system administrator."
				},
				"0005012024" : {
					"cause" : "A shared disk cannot be formatted.",
					"desc" : "A shared disk cannot be formatted.",
					"solution" : "Contact the system administrator."
				},
				"0005012025" : {
					"cause" : "The data store of this storage type does not support disks in thin-provisioning mode.",
					"desc" : "The data store of this storage type does not support disks in thin-provisioning mode.",
					"solution" : "Contact the system administrator."
				},
				"0005012034" : {
					"cause" : "The given datastore path isn't currently accessible.",
					"desc" : "The given datastore path isn't currently accessible.",
					"solution" : "Contact technical support."
				},
				"0005012041" : {
					"cause" : "The data store not in FusionManager, please update hypervisor first.",
					"desc" : "The data store not in FusionManager, please update hypervisor first.",
					"solution" : "Contact the system administrator."
				},
				"0005012046" : {
					"cause" : "The operation is not allowed, because storage in is in maintenance mode.",
					"desc" : "The operation is not allowed, because storage in is in maintenance mode.",
					"solution" : "Contact the system administrator."
				},
				"0005012050" : {
					"cause" : "The data store of this type does not support thick provision lazy zeroed disks.",
					"desc" : "The data store of this type does not support thick provision lazy zeroed disks.",
					"solution" : "Contact the system administrator."
				},
				"0005012063" : {
					"cause" : "The volume is not allowed to be detach, because the volume status is not attached.",
					"desc" : "The volume is not allowed to be detach, because the volume status is not attached.",
					"solution" : "Contact the system administrator."
				},
				"0005012082" : {
					"cause" : "The disk does not exist or has been deleted.",
					"desc" : "The disk does not exist or has been deleted.",
					"solution" : "Contact the system administrator."
				},
				"0005101000" : {
					"cause" : "The VPC specifications do not exist.",
					"desc" : "The VPC specifications do not exist.",
					"solution" : "The VPC specifications do not exist."
				},
				"0005101001" : {
					"cause" : "The number of VPCs reaches the maximum value (16).",
					"desc" : "The number of VPCs reaches the maximum value (16).",
					"solution" : "The number of VPCs reaches the maximum value (16)."
				},
				"0005101002" : {
					"cause" : "Duplicate name.",
					"desc" : "Duplicate name.",
					"solution" : "Duplicate name."
				},
				"0005101003" : {
					"cause" : "VSA VM template does not exist.",
					"desc" : "VSA VM template does not exist.",
					"solution" : "Please discover VSA VM template."
				},
				"0005101004" : {
					"cause" : "This operation cannot be performed because a network exists in the VPC.",
					"desc" : "This operation cannot be performed because a network exists in the VPC.",
					"solution" : "Delete the network first."
				},
				"0005101005" : {
					"cause" : "This operation cannot be performed because a router exists in the VPC.",
					"desc" : "This operation cannot be performed because a router exists in the VPC.",
					"solution" : "Delete the router first."
				},
				"0005101006" : {
					"cause" : "This operation cannot be performed because a disk exists in the VPC.",
					"desc" : "This operation cannot be performed because a disk exists in the VPC.",
					"solution" : "Delete the disk first."
				},
				"0005101007" : {
					"cause" : "This operation cannot be performed because a VM exists in the VPC.",
					"desc" : "This operation cannot be performed because a VM exists in the VPC.",
					"solution" : "Delete the VM first."
				},
				"0005101008" : {
					"cause" : "This operation cannot be performed because a security group exists in the VPC.",
					"desc" : "This operation cannot be performed because a security group exists in the VPC.",
					"solution" : "Delete the security group first."
				},
				"0005101010" : {
					"cause" : "The IP band width specification number reached the maximum value of 128.",
					"desc" : "The IP band width specification number reached the maximum value of 128.",
					"solution" : "The IP band width specification number reached the maximum value of 128."
				},
				"0005201001" : {
					"cause" : "Some parameter is missing.",
					"desc" : "Some parameter is missing.",
					"solution" : "Please input required paratemer."
				},
				"0005201002" : {
					"cause" : "The internal service error.",
					"desc" : "The internal service error.",
					"solution" : "Contact the system administrator."
				},
				"0005201003" : {
					"cause" : "The database internal error.",
					"desc" : "The database internal error.",
					"solution" : "Contact the system administrator."
				},
				"0005201004" : {
					"cause" : "The script or software (ISO) does not exist.",
					"desc" : "The script or software (ISO) does not exist.",
					"solution" : "Contact the system administrator."
				},
				"0005201005" : {
					"cause" : "The script or software (ISO) file does not exist or query failed.",
					"desc" : "The script or software (ISO) file does not exist or query failed.",
					"solution" : "Contact the system administrator."
				},
				"0005201006" : {
					"cause" : "The file path of script or software (ISO) is null.",
					"desc" : "The file path of script or software (ISO) is null.",
					"solution" : "Please input the file path of script or software (ISO) by yourself."
				},
				"0005201007" : {
					"cause" : "The file path of script or software (ISO) is invalid.",
					"desc" : "The file path of script or software (ISO) is invalid.",
					"solution" : "Please input valid file path of script or software (ISO)."
				},
				"0005201008" : {
					"cause" : "The ID of the script file (ISO or software) already exists.",
					"desc" : "The ID of the script file (ISO or software) already exists.",
					"solution" : "Contact the system administrator."
				},
				"0005201009" : {
					"cause" : "The name of the script file (ISO or software) already exists.",
					"desc" : "The name of the script file (ISO or software) already exists.",
					"solution" : "Please enter another name for the script file (ISO or software)."
				},
				"0005201010" : {
					"cause" : "The number of script is out of bound.",
					"desc" : "The number of script is out of bound.",
					"solution" : "Contact the system administrator."
				},
				"0005201011" : {
					"cause" : "The script file (ISO or software) does not exist or failed to be removed.",
					"desc" : "The script file (ISO or software) does not exist or failed to be removed.",
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
					"solution" : "Contact the system administrator."
				},
				"0005202004" : {
					"cause" : "The internal service error.",
					"desc" : "The internal service error.",
					"solution" : "Contact the system administrator."
				},
				"0005203001" : {
					"cause" : "Some parameter is invalid.",
					"desc" : "Some parameter is invalid.",
					"solution" : "Please input valid paratemer."
				},
				"0005203002" : {
					"cause" : "Users no operating authority.",
					"desc" : "Users no operating authority.",
					"solution" : "Contact the system administrator."
				},
				"0005203003" : {
					"cause" : "VM database throws exception.",
					"desc" : "VM database throws exception.",
					"solution" : "Contact the system administrator."
				},
				"0005203004" : {
					"cause" : "Invoke IRM failed .",
					"desc" : "Invoke IRM failed .",
					"solution" : "Contact the system administrator."
				},
				"0005203005" : {
					"cause" : "The VM template does not exist.",
					"desc" : "The VM template does not exist.",
					"solution" : "Contact the system administrator."
				},
				"0005203006" : {
					"cause" : "Can not delete registration status.",
					"desc" : "Can not delete registration status.",
					"solution" : "Contact the system administrator."
				},
				"0005203007" : {
					"cause" : "VM template is being used , operation is not allowed.",
					"desc" : "VM template is being used , operation is not allowed.",
					"solution" : "Contact the system administrator."
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
					"solution" : "Contact technical support."
				},
				"0005203012" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
				},
				"0005203013" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
				},
				"0005203014" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
				},
				"0005203015" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
				},
				"0005203017" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
				},
				"0005203019" : {
					"cause" : "A VM is failed to be created, and therefore it cannot be made into a template",
					"desc" : "A VM is failed to be created, and therefore it cannot be made into a template",
					"solution" : "Delete the VM template and create a new VM template"
				},
				"0005203020" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support."
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
					"solution" : "Refresh the page."
				},
				"0005203029" : {
					"cause" : "Failed to create the VM template, because the available resource cluster does not exist",
					"desc" : "Failed to create the VM template, because the available resource cluster does not exist",
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
					"solution" : "Delete application templates that use the VM template and retry to deregister the VM template"
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
					"cause" : "The external system communication is abnormal. For example, the returned message is empty, or the field is incorrect",
					"desc" : "The external system communication is abnormal. For example, the returned message is empty, or the field is incorrect",
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
					"solution" : "Please try later."
				},
				"0005203041" : {
					"cause" : "Published vmTempalte number reach limit(100)",
					"desc" : "Published vmTempalte number reach limit(100)",
					"solution" : "Delete unnecessary VM templates."
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
					"solution" : "Enter another VM template name."
				},
				"0005203045" : {
					"cause" : "The software can be installed only on the VM templates that have been creating",
					"desc" : "The software can be installed only on the VM templates that have been creating",
					"solution" : "Refresh the page."
				},
				"0005203046" : {
					"cause" : "The VM template has been created successfully",
					"desc" : "The VM template has been created successfully",
					"solution" : "Contact the administrator."
				},
				"0005203047" : {
					"cause" : "The number of VM disks has reached the upper limit",
					"desc" : "The number of VM disks has reached the upper limit",
					"solution" : "Contact technical support."
				},
				"0005203048" : {
					"cause" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored",
					"desc" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored",
					"solution" : "Check the VM state, and restore the VM again"
				},
				"0005203049" : {
					"cause" : "The system resources are insufficient",
					"desc" : "The system resources are insufficient",
					"solution" : "Contact technical support."
				},
				"0005203050" : {
					"cause" : "The VM template information cannot be found",
					"desc" : "The VM template information cannot be found",
					"solution" : "Contact technical support."
				},
				"0005203051" : {
					"cause" : "The VM template is being used to create applications",
					"desc" : "The VM template is being used to create applications",
					"solution" : "Please try later."
				},
				"0005203052" : {
					"cause" : "The VM is in stopped or hibernation state",
					"desc" : "The VM is in stopped or hibernation state",
					"solution" : "Contact technical support."
				},
				"0005203053" : {
					"cause" : "The VM template is being created",
					"desc" : "The VM template is being created",
					"solution" : "Contact technical support."
				},
				"0005203054" : {
					"cause" : "The VM is entering hibernation",
					"desc" : "The VM is entering hibernation",
					"solution" : "Contact technical support."
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
					"solution" : "Contact the administrator."
				},
				"0005203059" : {
					"cause" : "Only the stopped VM can be published",
					"desc" : "Only the stopped VM can be published",
					"solution" : "Please try later or Contact technical support"
				},
				"0005203060" : {
					"cause" : "Only the VM Template can be published",
					"desc" : "Only the VM Template can be published",
					"solution" : "Please try later or contact technical support."
				},
				"0005203061" : {
					"cause" : "You cannot modify a VM that is in wrong status",
					"desc" : "You cannot modify a VM that is in wrong status",
					"solution" : "Review the VM template status"
				},
				"0005203062" : {
					"cause" : "Discovering VM templates ...",
					"desc" : "Discovering VM templates ...",
					"solution" : "Check whether the current policy exists."
				},
				"0005203063" : {
					"cause" : "The VM template has been associated with a VM logical template, and therefore the VM template publication cannot be canceled",
					"desc" : "The VM template has been associated with a VM logical template, and therefore the VM template publication cannot be canceled",
					"solution" : "Contact technical support."
				},
				"0005203064" : {
					"cause" : "The VM template has not been published, and therefore cannot be associated with a VM logical template",
					"desc" : "The VM template has not been published, and therefore cannot be associated with a VM logical template",
					"solution" : "Please deassociate the VM logical template from the VM template and try again."
				},
				"0005203065" : {
					"cause" : "The VM template has been associated with a VM logical template",
					"desc" : "The VM template has been associated with a VM logical template",
					"solution" : "Please publish the VM template and try again"
				},
				"0005203066" : {
					"cause" : "A VM template in the same cluster has been associated with the logical VM template",
					"desc" : "A VM template in the same cluster has been associated with the logical VM template",
					"solution" : "Deassociate the logical VM template from the VM template and associate the VM template to a new logical VM template."
				},
				"0005203067" : {
					"cause" : "The number of added vm templates reaches the maximum",
					"desc" : "The number of added vm templates reaches the maximum",
					"solution" : "Please view the associated VM template."
				},
				"0005203068" : {
					"cause" : "The number of added vm templates reaches the maximum",
					"desc" : "The number of added vm templates reaches the maximum",
					"solution" : "Delete unnecessary vm templates and retry to create vm template. Perform this operation with caution"
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
				"0005203077" : {
					"cause" : "The VM template is related the VM logic template, delete failed.",
					"desc" : "The VM template is related the VM logic template, delete failed.",
					"solution" : "Please unrelated VM logic template first"
				},
				"0005201030" : {
					"cause" : "ftp account is not exist, please modify password to create",
					"desc" : "ftp account is not exist, please modify password to create",
					"solution" : "Please modify password to create"
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
					"solution" : "Please try again later."
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
					"solution" : "Contact technical support."
				},
				"1002132" : {
					"cause" : "A snapshot is being created. You cannot create multiple snapshots for a VM simultaneously.",
					"desc" : "A snapshot is being created. You cannot create multiple snapshots for a VM simultaneously.",
					"solution" : "Contact technical support."
				},
				"1002134" : {
					"cause" : "The destination node or resource cluster does not have network resources required for running the VM.",
					"desc" : "The destination node or resource cluster does not have network resources required for running the VM.",
					"solution" : "Contact technical support."
				},
				"1002147" : {
					"cause" : "A node that meets the network requirements for starting the VM does not exist in the specified location.",
					"desc" : "A node that meets the network requirements for starting the VM does not exist in the specified location.",
					"solution" : "Contact technical support."
				},
				"1002151" : {
					"cause" : "The storage or network of the destination node does not support VM running.",
					"desc" : "The storage or network of the destination node does not support VM running.",
					"solution" : "Contact technical support."
				},
				"1002166" : {
					"cause" : "The storage IP address is in use.",
					"desc" : "The storage IP address is in use.",
					"solution" : "Contact technical support."
				},
				"1002177" : {
					"cause" : "Invalid VLAN ID.",
					"desc" : "Invalid VLAN ID.",
					"solution" : "Contact technical support."
				},
				"1002183" : {
					"cause" : "The reserved IP addresses cannot contain the gateway.",
					"desc" : "The reserved IP addresses cannot contain the gateway.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1002187" : {
					"cause" : "The secondary DNS server for the DHCP server is invalid.",
					"desc" : "The secondary DNS server for the DHCP server is invalid.",
					"solution" : "Contact technical support."
				},
				"1002189" : {
					"cause" : "The domain name of the DHCP server is invalid.",
					"desc" : "The domain name of the DHCP server is invalid.",
					"solution" : "Contact technical support."
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
				"1002198" : {
					"cause" : "The VLAN pool cannot be empty.",
					"desc" : "The VLAN pool cannot be empty.",
					"solution" : "Contact technical support."
				},
				"1002200" : {
					"cause" : "The value range of the VLAN ID is 2 to 4094.",
					"desc" : "The value range of the VLAN ID is 2 to 4094.",
					"solution" : "Contact technical support."
				},
				"1002202" : {
					"cause" : "The start VLAN ID is less than the end VLAN ID.",
					"desc" : "The start VLAN ID is less than the end VLAN ID.",
					"solution" : "Contact technical support."
				},
				"1002203" : {
					"cause" : "The start VLAN ID must be less than or equal to the end VLAN ID.",
					"desc" : "The start VLAN ID must be less than or equal to the end VLAN ID.",
					"solution" : "Contact technical support."
				},
				"1002205" : {
					"cause" : "VLAN pools cannot overlap.",
					"desc" : "VLAN pools cannot overlap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1002215" : {
					"cause" : "The VLAN pool does not exist.",
					"desc" : "The VLAN pool does not exist.",
					"solution" : "Contact technical support."
				},
				"1002216" : {
					"cause" : "The VLAN pool is in use.",
					"desc" : "The VLAN pool is in use.",
					"solution" : "Contact technical support."
				},
				"1002222" : {
					"cause" : "Either the subnet ID or VLAN ID can be configured.",
					"desc" : "Either the subnet ID or VLAN ID can be configured.",
					"solution" : "Contact technical support."
				},
				"1002224" : {
					"cause" : "The VLAN does not exist in the VLAN pool.",
					"desc" : "The VLAN does not exist in the VLAN pool.",
					"solution" : "Contact technical support."
				},
				"1002225" : {
					"cause" : "The associated VLAN of the subnet selected for the port group does not exist in the VLAN pool.",
					"desc" : "The associated VLAN of the subnet selected for the port group does not exist in the VLAN pool.",
					"solution" : "Contact technical support."
				},
				"1002229" : {
					"cause" : "Failed to delete the port group because it is associated with VMs.",
					"desc" : "Failed to delete the port group because it is associated with VMs.",
					"solution" : "Please delete the virtual machines under this route network, and then try again."
				},
				"1002243" : {
					"cause" : "The description of the uplink aggregation port is invalid.",
					"desc" : "The description of the uplink aggregation port is invalid.",
					"solution" : "Contact technical support."
				},
				"1002256" : {
					"cause" : "VLAN ID conflict.",
					"desc" : "VLAN ID conflict.",
					"solution" : "Contact technical support."
				},
				"1002267" : {
					"cause" : "The description of the virtual switch is invalid.",
					"desc" : "The description of the virtual switch is invalid.",
					"solution" : "Contact technical support."
				},
				"1002268" : {
					"cause" : "The description of the port group is invalid.",
					"desc" : "The description of the port group is invalid.",
					"solution" : "Contact technical support."
				},
				"1002269" : {
					"cause" : "The description of the subnet is invalid.",
					"desc" : "The description of the subnet is invalid.",
					"solution" : "Contact technical support."
				},
				"1002270" : {
					"cause" : "The description of the system plane is invalid.",
					"desc" : "The description of the system plane is invalid.",
					"solution" : "Contact technical support."
				},
				"1002271" : {
					"cause" : "The description of the uplink port is invalid.",
					"desc" : "The description of the uplink port is invalid.",
					"solution" : "Contact technical support."
				},
				"1002317" : {
					"cause" : "The reserved IP addresses have been assigned.",
					"desc" : "The reserved IP addresses have been assigned.",
					"solution" : "Contact technical support."
				},
				"1002318" : {
					"cause" : "The IP address of the gateway is in use.",
					"desc" : "The IP address of the gateway is in use.",
					"solution" : "Contact technical support."
				},
				"1002319" : {
					"cause" : "The IP address and the subnet mask mismatch.",
					"desc" : "The IP address and the subnet mask mismatch.",
					"solution" : "Contact technical support."
				},
				"1002320" : {
					"cause" : "The available IP addresses in the subnet are insufficient.",
					"desc" : "The available IP addresses in the subnet are insufficient.",
					"solution" : "Contact technical support."
				},
				"1002322" : {
					"cause" : "The number of VLAN pools reaches the upper limit.",
					"desc" : "The number of VLAN pools reaches the upper limit.",
					"solution" : "Contact technical support."
				},
				"1002326" : {
					"cause" : "Invalid network port mapping parameter.",
					"desc" : "Invalid network port mapping parameter.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1002359" : {
					"cause" : "The port groups, to which the NICs belong, must be on the same DVswitch.",
					"desc" : "The port groups, to which the NICs belong, must be on the same DVswitch.",
					"solution" : "Contact technical support."
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
					"solution" : "Please try again later."
				},
				"1003044" : {
					"cause" : "The virtual firewall does not exist.",
					"desc" : "The virtual firewall does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1003045" : {
					"cause" : "The switch has routing services configured.",
					"desc" : "The switch has routing services configured.",
					"solution" : "Delete the routing services on the switch."
				},
				"1003050" : {
					"cause" : "The end IP address is less than the start IP address.",
					"desc" : "The end IP address is less than the start IP address.",
					"solution" : "Contact technical support."
				},
				"1003051" : {
					"cause" : "The IP address pool is being created and cannot be updated.",
					"desc" : "The IP address pool is being created and cannot be updated.",
					"solution" : "Contact technical support."
				},
				"1003052" : {
					"cause" : "The IP address pool is being deleted and cannot be updated.",
					"desc" : "The IP address pool is being deleted and cannot be updated.",
					"solution" : "Contact technical support."
				},
				"1003053" : {
					"cause" : "The number of IP addresses after the modification is less than the number of IP addresses that are used currently.",
					"desc" : "The number of IP addresses after the modification is less than the number of IP addresses that are used currently.",
					"solution" : "Contact technical support."
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
					"cause" : "Duplicate names。",
					"desc" : "Duplicate names。",
					"solution" : "Please check the name。"
				},
				"1010055" : {
					"cause" : "The device IP address is unreachable.",
					"desc" : "The device IP address is unreachable.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1010077" : {
					"cause" : "The password is incorrect or the device IP address is unreachable.",
					"desc" : "The password is incorrect or the device IP address is unreachable.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1020027" : {
					"cause" : "Failed to delete the VLAN and IP address of the uplink port.",
					"desc" : "Failed to delete the VLAN and IP address of the uplink port.",
					"solution" : "Contact technical support."
				},
				"1020028" : {
					"cause" : "Failed to modify the VLAN and IP address for the uplink port.",
					"desc" : "Failed to modify the VLAN and IP address for the uplink port.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact the system administrator."
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
					"solution" : "Contact technical support."
				},
				"1040124" : {
					"cause" : "Failed to allocate available management IP addresses.",
					"desc" : "Failed to allocate available management IP addresses.",
					"solution" : "Contact technical support."
				},
				"1040138" : {
					"cause" : "This operation cannot be performed because the network is being created,modified,or deleted in this cluster.",
					"desc" : "This operation cannot be performed because the network is being created,modified,or deleted in this cluster.",
					"solution" : "Please try again later."
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
					"solution" : "Contact technical support."
				},
				"1070025" : {
					"cause" : "The VM has been frozen.",
					"desc" : "The VM has been frozen.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1070112" : {
					"cause" : "VM and the selected network are not in same cluster.",
					"desc" : "VM and the selected network are not in same cluster.",
					"solution" : "Please select other network and try again."
				},
				"1070113" : {
					"cause" : "There is an elastic ip or NAPT assigned to the nic.",
					"desc" : "There is an elastic ip or NAPT assigned to the nic.",
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
				"1070118" : {
					"cause" : "It doesn't support adding iNIC network card on line.",
					"desc" : "It doesn't support adding iNIC network card on line.",
					"solution" : "Contact technical support."
				},
				"1070119" : {
					"cause" : "It doesn't support deleting iNIC network card on line.",
					"desc" : "It doesn't support deleting iNIC network card on line.",
					"solution" : "Contact technical support."
				},
				"1070124" : {
					"cause" : "Network ID or VPC ID is not accordance with VM's network.",
					"desc" : "Network ID or VPC ID is not accordance with VM's network.",
					"solution" : "Ensure that the entered network ID or VPC ID is valid for VM."
				},
				"1070213" : {
					"cause" : "Allocated ip failed.",
					"desc" : "Allocated ip failed.",
					"solution" : "Contact technical support."
				},
				"1070228" : {
					"cause" : "The VSS plug-in is not installed on this virtual machine.",
					"desc" : "The VSS plug-in is not installed on this virtual machine.",
					"solution" : "Please install VSS plug-in on this virtual machine."
				},
				"1070547" : {
					"cause" : "Preparation of network failure.",
					"desc" : "Preparation of network failure.",
					"solution" : "Contact technical support."
				},
				"1075048" : {
					"cause" : "No NIC is configured for the VM.",
					"desc" : "No NIC is configured for the VM.",
					"solution" : "Select a proper boot device."
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
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1080037" : {
					"cause" : "Failed to obtain the cloud management IP address.",
					"desc" : "Failed to obtain the cloud management IP address.",
					"solution" : "Contact technical support."
				},
				"1080038" : {
					"cause" : "Failed to update the management IP address.",
					"desc" : "Failed to update the management IP address.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1080053" : {
					"cause" : "There is no available IP in the subnet, subnet is filled with reserved IP.",
					"desc" : "There is no available IP in the subnet, subnet is filled with reserved IP.",
					"solution" : "Contact technical support."
				},
				"1080054" : {
					"cause" : "The subnet of network overlaps with the subnet of VPN remote user network.",
					"desc" : "The subnet of network overlaps with the subnet of VPN remote user network.",
					"solution" : "Contact technical support."
				},
				"1080055" : {
					"cause" : "The subnet of network overlaps with the subnet of VSA network.",
					"desc" : "The subnet of network overlaps with the subnet of VSA network.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1080062" : {
					"cause" : "The assigned private IP address is not in subnet.",
					"desc" : "The assigned private IP address is not in subnet.",
					"solution" : "Contact technical support."
				},
				"1080063" : {
					"cause" : "No IP address in the network needs to be repaired.",
					"desc" : "No IP address in the network needs to be repaired.",
					"solution" : "Contact technical support."
				},
				"1080064" : {
					"cause" : "The assigned private IP address has been retained in the system or reserved IP segment.",
					"desc" : "The assigned private IP address has been retained in the system or reserved IP segment.",
					"solution" : "Contact technical support."
				},
				"1080067" : {
					"cause" : "Only the subnet with static inject or internal dhcp can appointed IP.",
					"desc" : "Only the subnet with static inject or internal dhcp can appointed IP.",
					"solution" : "Contact technical support."
				},
				"1080068" : {
					"cause" : "The assigned private IP address is in the reserved IP segment.",
					"desc" : "The assigned private IP address is in the reserved IP segment.",
					"solution" : "Contact technical support."
				},
				"1080101" : {
					"cause" : "The available IP address segments contain the floating IP address or management IP address of FusionManager.",
					"desc" : "The available IP address segments contain the floating IP address or management IP address of FusionManager.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
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
					"solution" : "Contact the system administrator."
				},
				"1090017" : {
					"cause" : "Failed to add the cluster to the VDC because the VLAN pool associated with the DVS in the cluster does not contain all VLANs used by the VDC.",
					"desc" : "Failed to add the cluster to the VDC because the VLAN pool associated with the DVS in the cluster does not contain all VLANs used by the VDC.",
					"solution" : "Contact the system administrator."
				},
				"1090018" : {
					"cause" : "The VLAN is not applicable.",
					"desc" : "The VLAN is not applicable.",
					"solution" : "Contact the system administrator."
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
				"1100009" : {
					"cause" : "The entered FusionStorage management IP address already exists in the system.",
					"desc" : "The entered FusionStorage management IP address already exists in the system.",
					"solution" : "Please specify the FusionStorage management IP to another value and try again later."
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
					"solution" : "Contact technical support."
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
					"cause" : "The IP address already exists in the system.",
					"desc" : "The IP address already exists in the system.",
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
					"solution" : "Enter the correct management IP address."
				},
				"1150036" : {
					"cause" : "The operation request timed out.",
					"desc" : "The operation request timed out.",
					"solution" : "Ensure that the network is connected and try again."
				},
				"1150038" : {
					"cause" : "The specified IP address, port, username, or password may be incorrect, or the network is disconnected.",
					"desc" : "The specified IP address, port, username, or password may be incorrect, or the network is disconnected.",
					"solution" : "Ensure that the specified IP address, username, and password are correct and the network is connected."
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
					"solution" : "Contact the system administrator."
				},
				"1162004" : {
					"cause" : "The network does not exist.",
					"desc" : "The network does not exist.",
					"solution" : "Contact technical support."
				},
				"1162005" : {
					"cause" : "This network is being used by VM.",
					"desc" : "This network is being used by VM.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162019" : {
					"cause" : "It doesn't support this operation because the network is associated with DNAT.",
					"desc" : "It doesn't support this operation because the network is associated with DNAT.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1162019" : {
					"cause" : "It doesn't support this operation because the network is associated with EIP.",
					"desc" : "It doesn't support this operation because the network is associated with EIP.",
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
					"solution" : "Contact technical support."
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
					"cause" : "The current state of the network does not support this operation, please try again later.",
					"desc" : "The current state of the network does not support this operation, please try again later.",
					"solution" : "Please try later."
				},
				"1162118" : {
					"cause" : "The new number of available IP addresses is less than the number of IP addresses assigned to the network.",
					"desc" : "The new number of available IP addresses is less than the number of IP addresses assigned to the network.",
					"solution" : "Contact technical support."
				},
				"1162200" : {
					"cause" : "The number of VPC specification templates exceeds the upper limit.",
					"desc" : "The number of VPC specification templates exceeds the upper limit.",
					"solution" : ""
				},
				"1162201" : {
					"cause" : "The VPC specification template name already exists.",
					"desc" : "The VPC specification template name already exists.",
					"solution" : ""
				},
				"1162202" : {
					"cause" : "The VPC specification template does not exist.",
					"desc" : "The VPC specification template does not exist.",
					"solution" : "Contact technical support."
				},
				"1162203" : {
					"cause" : "The VPC specification template is in use.",
					"desc" : "The VPC specification template is in use.",
					"solution" : "Contact technical support."
				},
				"1162500" : {
					"cause" : "The external network does not exist.",
					"desc" : "The external network does not exist.",
					"solution" : "Contact technical support."
				},
				"1162501" : {
					"cause" : "The number of organization networks exceeds the upper limit.",
					"desc" : "The number of organization networks exceeds the upper limit.",
					"solution" : "Contact the system administrator."
				},
				"1162503" : {
					"cause" : "The VLAN ID is not available or the corresponding VLAN pool is unavailable.",
					"desc" : "The VLAN ID is not available or the corresponding VLAN pool is unavailable.",
					"solution" : "Contact technical support."
				},
				"1162505" : {
					"cause" : "The VLAN has been used or the VLAN pool to which the VLAN belongs has been deleted.",
					"desc" : "The VLAN has been used or the VLAN pool to which the VLAN belongs has been deleted.",
					"solution" : "Contact technical support."
				},
				"1162506" : {
					"cause" : "The DVS cannot be deleted because an external or organization network is already created on it.",
					"desc" : "The DVS cannot be deleted because an external or organization network is already created on it.",
					"solution" : "Contact technical support."
				},
				"1162507" : {
					"cause" : "The VSS cannot be deleted because an external or organization network is already created on the DVS providing the VSS.",
					"desc" : "The VSS cannot be deleted because an external or organization network is already created on the DVS providing the VSS.",
					"solution" : "Contact technical support."
				},
				"1162508" : {
					"cause" : "The vpc does not exist.",
					"desc" : "The vpc does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1162510" : {
					"cause" : "Failed to create the organization network.",
					"desc" : "Failed to create the organization network.",
					"solution" : "Contact technical support."
				},
				"1162511" : {
					"cause" : "Failed to create the DHCP subnet.",
					"desc" : "Failed to create the DHCP subnet.",
					"solution" : "Contact technical support."
				},
				"1162512" : {
					"cause" : "No available external network.",
					"desc" : "No available external network.",
					"solution" : "Contact technical support."
				},
				"1162514" : {
					"cause" : "The network does not exist.",
					"desc" : "The network does not exist.",
					"solution" : "Contact technical support."
				},
				"1162515" : {
					"cause" : "The external network has been used by the current VPC.",
					"desc" : "The external network has been used by the current VPC.",
					"solution" : "Contact technical support."
				},
				"1162516" : {
					"cause" : "The network does not belong to the current VPC.",
					"desc" : "The network does not belong to the current VPC.",
					"solution" : "Contact technical support."
				},
				"1162517" : {
					"cause" : "The number of networks has reached the maximum number allowed by the VPC.",
					"desc" : "The number of networks has reached the maximum number allowed by the VPC.",
					"solution" : "Contact technical support."
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
					"cause" : "The manual IP doesn't existu3002",
					"desc" : "The manual IP doesn't existu3002",
					"solution" : "Please refresh the manual IP list and try again."
				},
				"1162529" : {
					"cause" : "The DHCP server for external network dose not exist.",
					"desc" : "The DHCP server for external network dose not exist.",
					"solution" : "Contact the system administrator."
				},
				"1162530" : {
					"cause" : "The state does not allow the DHCP server operation.",
					"desc" : "The state does not allow the DHCP server operation.",
					"solution" : "Contact the system administrator."
				},
				"1162531" : {
					"cause" : "A maximum of 200 routed networks can be created for a VPC that has applied for a software firewall.",
					"desc" : "A maximum of 200 routed networks can be created for a VPC that has applied for a software firewall.",
					"solution" : "Contact technical support."
				},
				"1162532" : {
					"cause" : "A maximum of 199 external networks with its IP address assignment mode set to internal DHCP can be created in a zone.",
					"desc" : "A maximum of 199 external networks with its IP address assignment mode set to internal DHCP can be created in a zone.",
					"solution" : "Contact technical support."
				},
				"1162550" : {
					"cause" : "The current router does not support the VXLAN network.",
					"desc" : "The current router does not support the VXLAN network.",
					"solution" : "Contact technical support."
				},
				"1163003" : {
					"cause" : "The association relationship between the VFW and the VPC is abnormal.",
					"desc" : "The association relationship between the VFW and the VPC is abnormal.",
					"solution" : "Contact technical support."
				},
				"1163006" : {
					"cause" : "The correct VFW has been associated with a VPC.",
					"desc" : "The correct VFW has been associated with a VPC.",
					"solution" : "Contact technical support."
				},
				"1163007" : {
					"cause" : "The VPC has been associated with a VFW.",
					"desc" : "The VPC has been associated with a VFW.",
					"solution" : "Contact technical support."
				},
				"1163008" : {
					"cause" : "The VFW cannot be released because networks exist in the VPC.",
					"desc" : "The VFW cannot be released because networks exist in the VPC.",
					"solution" : "Contact technical support."
				},
				"1163009" : {
					"cause" : "The VFW does not need to be released because it is not associated with any VPC.",
					"desc" : "The VFW does not need to be released because it is not associated with any VPC.",
					"solution" : "Contact technical support."
				},
				"1163010" : {
					"cause" : "The firewall resource ID does not exist.",
					"desc" : "The firewall resource ID does not exist.",
					"solution" : "Contact technical support."
				},
				"1163012" : {
					"cause" : "Failed to modify firewall configurations.",
					"desc" : "Failed to modify firewall configurations.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1163013" : {
					"cause" : "There is elastic IP in vpc, can not realse virtual firewall.",
					"desc" : "There is elastic IP in vpc, can not realse virtual firewall.",
					"solution" : "Contact technical support."
				},
				"1163014" : {
					"cause" : "An authorization relationship already exists.",
					"desc" : "An authorization relationship already exists.",
					"solution" : "Contact technical support."
				},
				"1164200" : {
					"cause" : "There is no available public IP in the zone.",
					"desc" : "There is no available public IP in the zone.",
					"solution" : "Contact the system administrator."
				},
				"1166003" : {
					"cause" : "The virtual firewall is freezed.can not create acl.",
					"desc" : "The virtual firewall is freezed.can not create acl.",
					"solution" : "Contact the system administrator."
				},
				"1166006" : {
					"cause" : "The virtual firewall is freezed.can not create acl rule.",
					"desc" : "The virtual firewall is freezed.can not create acl rule.",
					"solution" : "Contact the system administrator."
				},
				"1166007" : {
					"cause" : "The firewall ACL has already existed.",
					"desc" : "The firewall ACL has already existed.",
					"solution" : "Contact the system administrator."
				},
				"1166016" : {
					"cause" : "The status of VPC does not allow to create firewall acl.",
					"desc" : "The status of VPC does not allow to create firewall acl.",
					"solution" : "Contact the system administrator."
				},
				"1166017" : {
					"cause" : "The network is not route network.can not create NetACL.",
					"desc" : "The network is not route network.can not create NetACL.",
					"solution" : "Contact the system administrator."
				},
				"1166018" : {
					"cause" : "The VPC is not applied any router.",
					"desc" : "The VPC is not applied any router.",
					"solution" : "Contact technical support."
				},
				"1166019" : {
					"cause" : "Elastic IP and the acl belong to different VFW.",
					"desc" : "Elastic IP and the acl belong to different VFW.",
					"solution" : "Contact the system administrator."
				},
				"1166020" : {
					"cause" : "The acl is not firewall acl.can not create firewall acl rule.",
					"desc" : "The acl is not firewall acl.can not create firewall acl rule.",
					"solution" : "Contact the system administrator."
				},
				"1166023" : {
					"cause" : "The network status is not ready. can not create NetACL rule.",
					"desc" : "The network status is not ready. can not create NetACL rule.",
					"solution" : "Contact the system administrator."
				},
				"1166026" : {
					"cause" : "Router is not ready。",
					"desc" : "Router is not ready。",
					"solution" : "Please check the Router status"
				},
				"1167002" : {
					"cause" : "SNAT is not enabled.",
					"desc" : "SNAT is not enabled.",
					"solution" : "Contact the system administrator."
				},
				"1167011" : {
					"cause" : "DNAT is not enabled.",
					"desc" : "DNAT is not enabled.",
					"solution" : "Contact the system administrator."
				},
				"1167012" : {
					"cause" : "Failed to open SNAT for the network on the device.",
					"desc" : "Failed to open SNAT for the network on the device.",
					"solution" : "Contact the system administrator."
				},
				"1167019" : {
					"cause" : "SNAT is being enabled.",
					"desc" : "SNAT is being enabled.",
					"solution" : "Contact the system administrator."
				},
				"1167021" : {
					"cause" : "There is no available IP in the public IP pool.",
					"desc" : "There is no available IP in the public IP pool.",
					"solution" : "Contact the system administrator."
				},
				"1167029" : {
					"cause" : "SNAT is being disabled.",
					"desc" : "SNAT is being disabled.",
					"solution" : "Contact the system administrator."
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
					"cause" : "SNAT is not enabled on any network in the VPC.",
					"desc" : "SNAT is not enabled on any network in the VPC.",
					"solution" : "Contact the system administrator."
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
				"1167062" : {
					"cause" : "The public port is already in use.",
					"desc" : "The public port is already in use.",
					"solution" : "Contact the system administrator."
				},
				"1167200" : {
					"cause" : "The elastic IP address does not exist.",
					"desc" : "The elastic IP address does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1167202" : {
					"cause" : "The elastic IP address is already bound to the VM.",
					"desc" : "The elastic IP address is already bound to the VM.",
					"solution" : "Contact the system administrator."
				},
				"1167204" : {
					"cause" : "The NIC does not support elastic IP address configurations.",
					"desc" : "The NIC does not support elastic IP address configurations.",
					"solution" : "Contact the system administrator."
				},
				"1167205" : {
					"cause" : "The elastic IP address is not bound to a VM.",
					"desc" : "The elastic IP address is not bound to a VM.",
					"solution" : "Contact the system administrator."
				},
				"1167208" : {
					"cause" : "The elastic IP address is already frozen.",
					"desc" : "The elastic IP address is already frozen.",
					"solution" : "Contact the system administrator."
				},
				"1167209" : {
					"cause" : "The elastic IP address is already recovered.",
					"desc" : "The elastic IP address is already recovered.",
					"solution" : "Contact the system administrator."
				},
				"1167210" : {
					"cause" : "The elastic IP address is being bound to the VM.",
					"desc" : "The elastic IP address is being bound to the VM.",
					"solution" : "Contact the system administrator."
				},
				"1167211" : {
					"cause" : "The elastic IP address is being unbound fromu00a0the VM.",
					"desc" : "The elastic IP address is being unbound fromu00a0the VM.",
					"solution" : "Contact the system administrator."
				},
				"1167212" : {
					"cause" : "The elastic IP address is being frozen.",
					"desc" : "The elastic IP address is being frozen.",
					"solution" : "Contact the system administrator."
				},
				"1167213" : {
					"cause" : "The elastic IP address is being recovered.",
					"desc" : "The elastic IP address is being recovered.",
					"solution" : "Contact the system administrator."
				},
				"1167214" : {
					"cause" : "The applied elastic IP address exceed the max num.",
					"desc" : "The applied elastic IP address exceed the max num.",
					"solution" : "Contact the system administrator."
				},
				"1167215" : {
					"cause" : "There is no nic can be bound to elastic ip.",
					"desc" : "There is no nic can be bound to elastic ip.",
					"solution" : "Contact the system administrator."
				},
				"1167216" : {
					"cause" : "The eip vpc is not consistent with the nic vpc.",
					"desc" : "The eip vpc is not consistent with the nic vpc.",
					"solution" : "Contact the system administrator."
				},
				"1167217" : {
					"cause" : "This EIP has ACL rules.",
					"desc" : "This EIP has ACL rules.",
					"solution" : "Contact the system administrator."
				},
				"1167218" : {
					"cause" : "The private IP dose not exist.",
					"desc" : "The private IP dose not exist.",
					"solution" : "Contact the system administrator."
				},
				"1167219" : {
					"cause" : "The elastic IP address is used by VPN.",
					"desc" : "The elastic IP address is used by VPN.",
					"solution" : "Contact the system administrator."
				},
				"1167220" : {
					"cause" : "The IP address allocation mode of this network cannot be set to static injection.",
					"desc" : "The IP address allocation mode of this network cannot be set to static injection.",
					"solution" : "Contact technical support."
				},
				"1167222" : {
					"cause" : "The number of elastic IP exceeds the maximum.",
					"desc" : "The number of elastic IP exceeds the maximum.",
					"solution" : "Contact the system administrator."
				},
				"1167223" : {
					"cause" : "The elastic IP address is bound to the VLB of F5.",
					"desc" : "The elastic IP address is bound to the VLB of F5.",
					"solution" : "Contact the system administrator."
				},
				"1167224" : {
					"cause" : "The private IP address is bound to an elastic IP address.",
					"desc" : "The private IP address is bound to an elastic IP address.",
					"solution" : "Contact the system administrator."
				},
				"1167226" : {
					"cause" : "The elastic IP address is bound to a private IP address.",
					"desc" : "The elastic IP address is bound to a private IP address.",
					"solution" : "Contact the system administrator."
				},
				"1167228" : {
					"cause" : "DNAT is configured for the NIC.",
					"desc" : "DNAT is configured for the NIC.",
					"solution" : "Contact the system administrator."
				},
				"1167229" : {
					"cause" : "DNAT is configured by the private IP address.",
					"desc" : "DNAT is configured by the private IP address.",
					"solution" : "Contact the system administrator."
				},
				"1167230" : {
					"cause" : "The elastic IP address is bound to the SLB.",
					"desc" : "The elastic IP address is bound to the SLB.",
					"solution" : "Contact the system administrator."
				},
				"1167231" : {
					"cause" : "The IP bandwidth is updating.",
					"desc" : "The IP bandwidth is updating.",
					"solution" : "Contact the system administrator."
				},
				"1167232" : {
					"cause" : "The elastic IP address does not belong to the VPC.",
					"desc" : "The elastic IP address does not belong to the VPC.",
					"solution" : "Contact the system administrator."
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
					"solution" : "Contact technical support."
				},
				"1167304" : {
					"cause" : "IP addresses in the IP address pool do not exist.",
					"desc" : "IP addresses in the IP address pool do not exist.",
					"solution" : "Contact technical support."
				},
				"1167305" : {
					"cause" : "IP addresses in the IP address pool are in use.",
					"desc" : "IP addresses in the IP address pool are in use.",
					"solution" : "Contact technical support."
				},
				"1167306" : {
					"cause" : "You can add a maximum of 32 IP address segments in a public IP address pool.",
					"desc" : "You can add a maximum of 32 IP address segments in a public IP address pool.",
					"solution" : "Contact technical support."
				},
				"1167307" : {
					"cause" : "You can add a maximum of 8 IP address pools in a zone.",
					"desc" : "You can add a maximum of 8 IP address pools in a zone.",
					"solution" : "Contact technical support."
				},
				"1167308" : {
					"cause" : "The IP and zone id do not match.",
					"desc" : "The IP and zone id do not match.",
					"solution" : "Contact the system administrator."
				},
				"1167309" : {
					"cause" : "The subnet of the public IP address segment conflicts with the external network subnet.",
					"desc" : "The subnet of the public IP address segment conflicts with the external network subnet.",
					"solution" : "Contact technical support."
				},
				"1167310" : {
					"cause" : "The public IP address is already released.",
					"desc" : "The public IP address is already released.",
					"solution" : "Contact technical support."
				},
				"1168001" : {
					"cause" : "Virtual firewalls do not support configuration of ASPF rules.",
					"desc" : "Virtual firewalls do not support configuration of ASPF rules.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1168002" : {
					"cause" : "The virtual firewall in its current state does not support configuration of ASPF rules.",
					"desc" : "The virtual firewall in its current state does not support configuration of ASPF rules.",
					"solution" : "Contact the system administrator."
				},
				"1168007" : {
					"cause" : "Updating virtual firewall ASPF rules. Please try again later.",
					"desc" : "Updating virtual firewall ASPF rules. Please try again later.",
					"solution" : "Contact the system administrator."
				},
				"1169002" : {
					"cause" : "This IP is not set on vfw.",
					"desc" : "This IP is not set on vfw.",
					"solution" : "Contact the system administrator."
				},
				"1169101" : {
					"cause" : "The IP bandwidth template does not exist.",
					"desc" : "The IP bandwidth template does not exist.",
					"solution" : "Please refresh the IP bandwidth template list and try again."
				},
				"1169103" : {
					"cause" : "The number of IP bandwidth templates exceeds the upper limit.",
					"desc" : "The number of IP bandwidth templates exceeds the upper limit.",
					"solution" : ""
				},
				"1169105" : {
					"cause" : "Failed to configure IP bandwidth on the device.",
					"desc" : "Failed to configure IP bandwidth on the device.",
					"solution" : "Contact the system administrator."
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
					"solution" : "Contact technical support."
				},
				"1180102" : {
					"cause" : "Failed to add the VSA external interface.",
					"desc" : "Failed to add the VSA external interface.",
					"solution" : "Contact technical support."
				},
				"1180103" : {
					"cause" : "Failed to add the VSA.",
					"desc" : "Failed to add the VSA.",
					"solution" : "Contact technical support."
				},
				"1180104" : {
					"cause" : "vsa VM template is not exist.",
					"desc" : "vsa VM template is not exist.",
					"solution" : "Contact the system administrator."
				},
				"1180105" : {
					"cause" : "VPC has already applyed virtual firewall.",
					"desc" : "VPC has already applyed virtual firewall.",
					"solution" : "Contact technical support."
				},
				"1180107" : {
					"cause" : "The external network type is not normal subnet type.",
					"desc" : "The external network type is not normal subnet type.",
					"solution" : "Contact technical support."
				},
				"1180108" : {
					"cause" : "The external network has no free Ip.",
					"desc" : "The external network has no free Ip.",
					"solution" : "Contact technical support."
				},
				"1180109" : {
					"cause" : "The external network and vpc does not belong same zone.",
					"desc" : "The external network and vpc does not belong same zone.",
					"solution" : "Contact technical support."
				},
				"1180110" : {
					"cause" : "IP assignment mode of external network is not static-manual.",
					"desc" : "IP assignment mode of external network is not static-manual.",
					"solution" : "Contact technical support."
				},
				"1180111" : {
					"cause" : "Firewall vsa status does not allow this opreate.",
					"desc" : "Firewall vsa status does not allow this opreate.",
					"solution" : "Contact technical support."
				},
				"1180112" : {
					"cause" : "Get firewall vsa vm ip failed.",
					"desc" : "Get firewall vsa vm ip failed.",
					"solution" : "Contact technical support."
				},
				"1180114" : {
					"cause" : "There is no available vsa manage network.",
					"desc" : "There is no available vsa manage network.",
					"solution" : "Contact technical support."
				},
				"1180115" : {
					"cause" : "There is no available vtep network.",
					"desc" : "There is no available vtep network.",
					"solution" : "Contact technical support."
				},
				"1180116" : {
					"cause" : "Firewall VSA is not in the VPC.",
					"desc" : "Firewall VSA is not in the VPC.",
					"solution" : "Contact technical support."
				},
				"1180117" : {
					"cause" : "No firewall vsa exist.",
					"desc" : "No firewall vsa exist.",
					"solution" : "Contact technical support."
				},
				"1180118" : {
					"cause" : "Invalid externetwork.",
					"desc" : "Invalid externetwork.",
					"solution" : "Contact technical support."
				},
				"1180119" : {
					"cause" : "A DHCP server for external networks has already been created in the zone.",
					"desc" : "A DHCP server for external networks has already been created in the zone.",
					"solution" : "Contact technical support."
				},
				"1180121" : {
					"cause" : "Create VSA vm failed.",
					"desc" : "Create VSA vm failed.",
					"solution" : "Contact the system administrator."
				},
				"1180122" : {
					"cause" : "There are external networks whose IP address assignment mode is set to internal DHCP in the zone.",
					"desc" : "There are external networks whose IP address assignment mode is set to internal DHCP in the zone.",
					"solution" : "Contact the system administrator."
				},
				"1180126" : {
					"cause" : "DHCP server status does not allow this opreate.",
					"desc" : "DHCP server status does not allow this opreate.",
					"solution" : "Please refresh and try again."
				},
				"1180128" : {
					"cause" : "Failed to delete DHCP Subnet.",
					"desc" : "Failed to delete DHCP Subnet.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact technical support."
				},
				"1181011" : {
					"cause" : "The IP addresses reserved in the gateway and subnet are duplicated. The second and third IP addresses in the subnet are reserved by the system and cannot be used as gateway addresses.",
					"desc" : "The IP addresses reserved in the gateway and subnet are duplicated. The second and third IP addresses in the subnet are reserved by the system and cannot be used as gateway addresses.",
					"solution" : "Contact technical support."
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
					"solution" : "Contact the system administrator."
				},
				"1182001" : {
					"cause" : "The VPN gateway cannot be created for the VPC because the VPC does not applyufffda virtual firewall of hardware device.",
					"desc" : "The VPN gateway cannot be created for the VPC because the VPC does not applyufffda virtual firewall of hardware device.",
					"solution" : "Contact the system administrator."
				},
				"1182002" : {
					"cause" : "The VPN gateway does not exist.",
					"desc" : "The VPN gateway does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1182003" : {
					"cause" : "The VPN gateway is already in use.",
					"desc" : "The VPN gateway is already in use.",
					"solution" : "Contact the system administrator."
				},
				"1182004" : {
					"cause" : "The VPN gateway name already exists.",
					"desc" : "The VPN gateway name already exists.",
					"solution" : "Contact the system administrator."
				},
				"1182005" : {
					"cause" : "The VPN gateway and the VPC do not match.",
					"desc" : "The VPN gateway and the VPC do not match.",
					"solution" : "Contact the system administrator."
				},
				"1182006" : {
					"cause" : "The VPN gateway cannot be created for the VPC because the VPC does not have available elastic IP address.",
					"desc" : "The VPN gateway cannot be created for the VPC because the VPC does not have available elastic IP address.",
					"solution" : "Contact the system administrator."
				},
				"1183000" : {
					"cause" : "The remote gateway address conflicts with another remote gateway address in the VPC.",
					"desc" : "The remote gateway address conflicts with another remote gateway address in the VPC.",
					"solution" : "Contact the system administrator."
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
					"cause" : "Create a VPN connection fails from bottom.",
					"desc" : "Create a VPN connection fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184026" : {
					"cause" : "Update a VPN connection fails from bottom.",
					"desc" : "Update a VPN connection fails from bottom.",
					"solution" : "Contact the system administrator."
				},
				"1184027" : {
					"cause" : "Delete a VPN connection fails from bottom.",
					"desc" : "Delete a VPN connection fails from bottom.",
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
					"cause" : "One VPC supports only one L2TP VPN connection and an L2TP VPN connection already exists in the VPC.",
					"desc" : "One VPC supports only one L2TP VPN connection and an L2TP VPN connection already exists in the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184031" : {
					"cause" : "The network conflicts with the remote network of the VPC.",
					"desc" : "The network conflicts with the remote network of the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184032" : {
					"cause" : "The network conflicts with the subnet of the L2TP VPN.",
					"desc" : "The network conflicts with the subnet of the L2TP VPN.",
					"solution" : "Contact the system administrator."
				},
				"1184033" : {
					"cause" : "The subnet information of the L2TP VPN conflicts with another L2TP VPN subnet.",
					"desc" : "The subnet information of the L2TP VPN conflicts with another L2TP VPN subnet.",
					"solution" : "Contact the system administrator."
				},
				"1184034" : {
					"cause" : "The remote user subnet conflicts with the subnet of the L2TP VPN.",
					"desc" : "The remote user subnet conflicts with the subnet of the L2TP VPN.",
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
					"cause" : "VPC does not apply a virtual firewall of hardware device.",
					"desc" : "VPC does not apply a virtual firewall of hardware device.",
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
					"cause" : "Delete a VPN fails from bottom.",
					"desc" : "Delete a VPN fails from bottom.",
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
				"1184056" : {
					"cause" : "L2TP VPN service is abnormal.",
					"desc" : "L2TP VPN service is abnormal.",
					"solution" : "Contact the system administrator."
				},
				"1184057" : {
					"cause" : "L2TP VPN user does not exist.",
					"desc" : "L2TP VPN user does not exist.",
					"solution" : "Contact the system administrator."
				},
				"1184058" : {
					"cause" : "The status of L2TP VPN user is not allowed to operate.",
					"desc" : "The status of L2TP VPN user is not allowed to operate.",
					"solution" : "Contact the system administrator."
				},
				"1184059" : {
					"cause" : "L2TP VPN user not belongs to the VPC.",
					"desc" : "L2TP VPN user not belongs to the VPC.",
					"solution" : "Contact the system administrator."
				},
				"1184061" : {
					"cause" : "Can not create L2TP VPN users because the network does not apply to VDC.",
					"desc" : "Can not create L2TP VPN users because the network does not apply to VDC.",
					"solution" : "Contact the system administrator."
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
					"solution" : "Please contact your administrator or view the help manual."
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
				"1211006" : {
					"cause" : "The multicast IP address pools overlap.",
					"desc" : "The multicast IP address pools overlap.",
					"solution" : "Please check and retry."
				},
				"1211007" : {
					"cause" : "The multicast IP address pool exceed the max num.",
					"desc" : "The multicast IP address pool exceed the max num.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"1220001" : {
					"cause" : "The current state of the router operation not allowed.",
					"desc" : "The current state of the router operation not allowed.",
					"solution" : "Contact the system administrator."
				},
				"1220002" : {
					"cause" : "No aggregation switch。",
					"desc" : "No aggregation switch。",
					"solution" : "Please contact your administrator or view the help manual."
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
				"122006" : {
					"cause" : "The current network mode dose not support hardware router.",
					"desc" : "The current network mode dose not support hardware router.",
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
					"solution" : "Contact technical support."
				},
				"1290006" : {
					"cause" : "Recover VSAM data failed,please retry.",
					"desc" : "Recover VSAM data failed,please retry.",
					"solution" : "Contact technical support."
				},
				"1290007" : {
					"cause" : "VSAM is auditing.",
					"desc" : "VSAM is auditing.",
					"solution" : "Contact technical support."
				},
				"1290011" : {
					"cause" : "u6dfbu52a0u6216u8005u5220u9664u9759u6001ip-macu7ed1u5b9auff0cmacu91cdu590du3002",
					"desc" : "u6dfbu52a0u6216u8005u5220u9664u9759u6001ip-macu7ed1u5b9auff0cmacu91cdu590du3002",
					"solution" : "Contact technical support."
				},
				"1290012" : {
					"cause" : "The VSA vm does not exist.",
					"desc" : "The VSA vm does not exist.",
					"solution" : "Contact technical support."
				},
				"1290013" : {
					"cause" : "VSA DHCP service is not on.",
					"desc" : "VSA DHCP service is not on.",
					"solution" : "Contact technical support."
				},
				"1290035" : {
					"cause" : "Dhcp server is busy, please try again later.",
					"desc" : "Dhcp server is busy, please try again later.",
					"solution" : "Contact technical support."
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
				"1290047" : {
					"cause" : "The VSA VM does not provide services when it is not in the management state.",
					"desc" : "The VSA VM does not provide services when it is not in the management state.",
					"solution" : "Contact technical support."
				},
				"1290048" : {
					"cause" : "The VSA VM cannot provide services because it does not have the service process registered.",
					"desc" : "The VSA VM cannot provide services because it does not have the service process registered.",
					"solution" : "Contact technical support."
				},
				"1290049" : {
					"cause" : "Exceeded the maximum number of IPsec VPN connections.",
					"desc" : "Exceeded the maximum number of IPsec VPN connections.",
					"solution" : "Contact technical support."
				},
				"1290050" : {
					"cause" : "Invalid local IP address.",
					"desc" : "Invalid local IP address.",
					"solution" : "Contact technical support."
				},
				"1290051" : {
					"cause" : "The local IP address is not configured on the external port.",
					"desc" : "The local IP address is not configured on the external port.",
					"solution" : "Contact technical support."
				},
				"1290052" : {
					"cause" : "Invalid local internal subnet.",
					"desc" : "Invalid local internal subnet.",
					"solution" : "Contact technical support."
				},
				"1290053" : {
					"cause" : "Local internal subnet conflict.",
					"desc" : "Local internal subnet conflict.",
					"solution" : "Contact technical support."
				},
				"1290054" : {
					"cause" : "The local internal subnet is not configured on the internal port.",
					"desc" : "The local internal subnet is not configured on the internal port.",
					"solution" : "Contact technical support."
				},
				"1290055" : {
					"cause" : "Exceeded the maximum number of internal subnets.",
					"desc" : "Exceeded the maximum number of internal subnets.",
					"solution" : "Contact technical support."
				},
				"1290056" : {
					"cause" : "The VSA VM is unavailable.",
					"desc" : "The VSA VM is unavailable.",
					"solution" : "Contact technical support."
				},
				"1290057" : {
					"cause" : "Invalid name.",
					"desc" : "Invalid name.",
					"solution" : "Contact technical support."
				},
				"1290058" : {
					"cause" : "The IPsec VPN gateway does not exist.",
					"desc" : "The IPsec VPN gateway does not exist.",
					"solution" : "Contact technical support."
				},
				"1290059" : {
					"cause" : "The limit and offset parameters must be both specified or left unspecified.",
					"desc" : "The limit and offset parameters must be both specified or left unspecified.",
					"solution" : "Contact technical support."
				},
				"1290060" : {
					"cause" : "IPsec VPN connection information has been configured on the IPsec VPN gateway.",
					"desc" : "IPsec VPN connection information has been configured on the IPsec VPN gateway.",
					"solution" : "Contact technical support."
				},
				"1290061" : {
					"cause" : "Abnormal IPsec VPN service.",
					"desc" : "Abnormal IPsec VPN service.",
					"solution" : "Contact technical support."
				},
				"1290062" : {
					"cause" : "The IPsec VPN connection does not exist.",
					"desc" : "The IPsec VPN connection does not exist.",
					"solution" : "Contact technical support."
				},
				"1310002" : {
					"cause" : "The number of rules in the security group exceeds the limit.",
					"desc" : "The number of rules in the security group exceeds the limit.",
					"solution" : "Contact technical support."
				},
				"1310003" : {
					"cause" : "The security group rule does not exist.",
					"desc" : "The security group rule does not exist.",
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
				"1310027" : {
					"cause" : "The member to be deleted from the security group does not exist.",
					"desc" : "The member to be deleted from the security group does not exist.",
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
				"1310067" : {
					"cause" : "Delete operation failed,Please quit security groups first.",
					"desc" : "Delete operation failed,Please quit security groups first.",
					"solution" : "Please quit security groups first."
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
				"1600016" : {
					"cause" : "The resource not belong the AZ.",
					"desc" : "The resource not belong the AZ.",
					"solution" : "Contact technical support."
				},
				"1002435" : {
					"cause" : "The VM position is not compatible with the disk. Attach failed.",
					"desc" : "The VM position is not compatible with the disk. Attach failed",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"5103002" : {
					"cause" : "The resource exist.",
					"desc" : "The resource exist.",
					"solution" : "Contact the system administrator."
				},
				"5103017" : {
					"cause" : "The resource does not exist.",
					"desc" : "The resource does not exist.",
					"solution" : "Contact the system administrator."
				}
			};
			window.exceptionMap = window.exceptionMap || {};
			_.extend(window.exceptionMap, exceptionMap);
			return window.exceptionMap;
		});