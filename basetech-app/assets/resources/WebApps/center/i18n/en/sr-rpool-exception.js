define([], function() {
			var exceptionMap = {
				"4000011" : {
					"cause" : "The external system communication is abnormal. For example, the returned message is empty, or the field is incorrect",
					"desc" : "The external system communication is abnormal. For example, the returned message is empty, or the field is incorrect",
					"solution" : "Contact the administrator or see the online help"
				},
				"4000018" : {
					"cause" : "The system resources are insufficient.",
					"desc" : "The system resources are insufficient.",
					"solution" : "Contact technical support."
				},
				"4001008" : {
					"cause" : "The VM template data is corrupted or does not exit.",
					"desc" : "The VM template data is corrupted or does not exit.",
					"solution" : "Delete the VM template"
				},
				"4002005" : {
					"cause" : "The VM template does not exist.",
					"desc" : "The VM template does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4002015" : {
					"cause" : "The entered parameter is incorrect",
					"desc" : "The entered parameter is incorrect",
					"solution" : "Enter the parameter based on the name input specifications"
				},
				"4002019" : {
					"cause" : "The entered parameter is incorrect",
					"desc" : "The entered parameter is incorrect",
					"solution" : "Enter the parameter based on the description input specifications"
				},
				"4002071" : {
					"cause" : "You cannot create a VM when the server is in the maintenance mode.",
					"desc" : "You cannot create a VM when the server is in the maintenance mode.",
					"solution" : "Contact the system administrator."
				},
				"4002082" : {
					"cause" : "The vCPU reservation is incorrect.",
					"desc" : "The vCPU reservation is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications"
				},
				"4002083" : {
					"cause" : "The vCPU quota is incorrect",
					"desc" : "The vCPU quota is incorrect",
					"solution" : "Refer to the online help and set the parameter based on specifications"
				},
				"4002084" : {
					"cause" : "The vCPU restriction is incorrect.",
					"desc" : "The vCPU restriction is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications"
				},
				"4002085" : {
					"cause" : "The number of VM memories is incorrect",
					"desc" : "The number of VM memories is incorrect",
					"solution" : "Refer to the online help and set the parameter based on specifications"
				},
				"4002086" : {
					"cause" : "The VM memory quota is incorrect.",
					"desc" : "The VM memory quota is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002087" : {
					"cause" : "The hard disk ID is incorrect.",
					"desc" : "The hard disk ID is incorrect.",
					"solution" : "Contact the system administrator."
				},
				"4002088" : {
					"cause" : "The VM hard disk size is incorrect.",
					"desc" : "The VM hard disk size is incorrect.",
					"solution" : "Refer to the online help"
				},
				"4002089" : {
					"cause" : "The number of hard disks on the VM exceeds the maximum value.",
					"desc" : "The number of hard disks on the VM exceeds the maximum value.",
					"solution" : "Please contact technical support engineers."
				},
				"4002091" : {
					"cause" : "The VM NIC network is empty",
					"desc" : "The VM NIC network is empty",
					"solution" : "Contact the administrator"
				},
				"4002092" : {
					"cause" : "The number of VM NICs exceeds the maximum",
					"desc" : "The number of VM NICs exceeds the maximum",
					"solution" : "Refer to the online help and set the parameter based on specifications"
				},
				"4002093" : {
					"cause" : "The VM start configuration is invalid",
					"desc" : "The VM start configuration is invalid",
					"solution" : "Contact the administrator"
				},
				"4002094" : {
					"cause" : "The VM fault processing policy does not conform to specifications",
					"desc" : "The VM fault processing policy does not conform to specifications",
					"solution" : "Contact the administrator"
				},
				"4002096" : {
					"cause" : "The VM Tools is not started",
					"desc" : "The VM Tools is not started",
					"solution" : "Contact the administrator"
				},
				"4002097" : {
					"cause" : "The specified node does not exist.",
					"desc" : "The specified node does not exist.",
					"solution" : "Contact the administrator"
				},
				"4002098" : {
					"cause" : "The server does not exist.",
					"desc" : "The server does not exist.",
					"solution" : "Please contact your administrator or view the help manual"
				},
				"4002099" : {
					"cause" : "The specified logical resource cluster does not exist",
					"desc" : "The specified logical resource cluster does not exist",
					"solution" : "Refresh the page to check whether the resource cluster exists or contact the administrator"
				},
				"4002110" : {
					"cause" : "The VM memory restriction is incorrect.",
					"desc" : "The VM memory restriction is incorrect.",
					"solution" : "Parameter error"
				},
				"4002111" : {
					"cause" : "The OS type is incorrect.",
					"desc" : "The OS type is incorrect.",
					"solution" : "Select another one from the drop-down list."
				},
				"4002112" : {
					"cause" : "The OS version is incorrect.",
					"desc" : "The OS version is incorrect.",
					"solution" : "Select another one from the drop-down list."
				},
				"4002113" : {
					"cause" : "The vCPU reservation value is incorrect.",
					"desc" : "The vCPU reservation value is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002114" : {
					"cause" : "The VM memory reservation value is incorrect.",
					"desc" : "The VM memory reservation value is incorrect.",
					"solution" : "Refer to the online help and set the parameter based on specifications."
				},
				"4002115" : {
					"cause" : "The MAC IP address already exists",
					"desc" : "The MAC IP address already exists",
					"solution" : "Contact the system administrator."
				},
				"4002117" : {
					"cause" : "The MAC address resources are insufficient.",
					"desc" : "The MAC address resources are insufficient.",
					"solution" : "Contact the system administrator"
				},
				"4002121" : {
					"cause" : "The MAC address is incorrect.",
					"desc" : "The MAC address is incorrect.",
					"solution" : "Contact the system administrator."
				},
				"4002123" : {
					"cause" : "The cluster or host cannot be left empty.",
					"desc" : "The cluster or host cannot be left empty.",
					"solution" : "Contact technical support engineers."
				},
				"4002124" : {
					"cause" : "The data store indicator must be selected.",
					"desc" : "The data store indicator must be selected.",
					"solution" : "Select the data store indicator."
				},
				"4002125" : {
					"cause" : "The OS type cannot be left empty.",
					"desc" : "The OS type cannot be left empty.",
					"solution" : "Select the OS type."
				},
				"4002127" : {
					"cause" : "The hard disk slot ID cannot be duplicate",
					"desc" : "The hard disk slot ID cannot be duplicate",
					"solution" : "Contact the administrator"
				},
				"4002133" : {
					"cause" : "The destination node or cluster cannot meet the storage requirements for running the VM.",
					"desc" : "The destination node or cluster cannot meet the storage requirements for running the VM.",
					"solution" : "Contact the system administrator."
				},
				"4002134" : {
					"cause" : "The destination node or cluster cannot meet the network requirements for running the VM.",
					"desc" : "The destination node or cluster cannot meet the network requirements for running the VM.",
					"solution" : "Contact the system administrator."
				},
				"4002136" : {
					"cause" : "An existing disk cannot be attached to the VM because the disk is not shared and has been attached to a VM, the disk is shared but has been attached to four VMs, or the disk is in a state that does not allow attachment.",
					"desc" : "An existing disk cannot be attached to the VM because the disk is not shared and has been attached to a VM, the disk is shared but has been attached to four VMs, or the disk is in a state that does not allow attachment.",
					"solution" : "Contact the system administrator"
				},
				"4002137" : {
					"cause" : "You can attach a maximum of four shared disks to a VM.",
					"desc" : "You can attach a maximum of four shared disks to a VM.",
					"solution" : "Contact technical support engineers."
				},
				"4002138" : {
					"cause" : "A shared disk has been attached to the specified VM",
					"desc" : "A shared disk has been attached to the specified VM",
					"solution" : "Contact the administrator"
				},
				"4002140" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support engineers."
				},
				"4002146" : {
					"cause" : "A node that meets the storage requirements for starting the VM does not exist in the specified cluster or host.",
					"desc" : "A node that meets the storage requirements for starting the VM does not exist in the specified cluster or host.",
					"solution" : "Contact technical support engineers."
				},
				"4002147" : {
					"cause" : "A node that meets the network requirements for starting the VM does not exist in the specified cluster or host.",
					"desc" : "A node that meets the network requirements for starting the VM does not exist in the specified cluster or host.",
					"solution" : "Contact technical support engineers."
				},
				"4002227" : {
					"cause" : "The VM NIC network does not exist.",
					"desc" : "The VM NIC network does not exist.",
					"solution" : "Contact the administrator"
				},
				"4002286" : {
					"cause" : "The VM template creation is in progress.",
					"desc" : "The VM template creation is in progress.",
					"solution" : "Please contact technical support engineers."
				},
				"4002288" : {
					"cause" : "The VM is in the stopped or hibernation state.",
					"desc" : "The VM is in the stopped or hibernation state.",
					"solution" : "Please contact technical support engineers."
				},
				"4002289" : {
					"cause" : "The VM is entering hibernation",
					"desc" : "The VM is entering hibernation",
					"solution" : "Please contact technical support engineers."
				},
				"4002295" : {
					"cause" : "Attachment failed\\, because an ISO file has been attached to the server where the current VM is located",
					"desc" : "Attachment failed\\, because an ISO file has been attached to the server where the current VM is located",
					"solution" : "Contact the administrator"
				},
				"4002312" : {
					"cause" : "The VM cannot be converted to a template because snapshots have been created for the VM.",
					"desc" : "The VM cannot be converted to a template because snapshots have been created for the VM.",
					"solution" : "Delete the snapshots on the VM and try again."
				},
				"4002358" : {
					"cause" : "The VM template is being used to create VMs",
					"desc" : "The VM template is being used to create VMs",
					"solution" : "Please try later."
				},
				"4002366" : {
					"cause" : "The VM template information cannot be found.",
					"desc" : "The VM template information cannot be found.",
					"solution" : "Contact technical support"
				},
				"4002371" : {
					"cause" : "The CPU resources are insufficient",
					"desc" : "The CPU resources are insufficient",
					"solution" : "Contact the administrator"
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
					"solution" : "Contact the administrator"
				},
				"4002377" : {
					"cause" : "No available host.",
					"desc" : "No available host.",
					"solution" : "Contact the administrator"
				},
				"4002504" : {
					"cause" : "The template cannot be converted to a VM because it contains a linked clone.",
					"desc" : "The template cannot be converted to a VM because it contains a linked clone.",
					"solution" : "Please select another VM template"
				},
				"4040015" : {
					"cause" : "Disconnected with the hypervisor.",
					"desc" : "Disconnected with the hypervisor.",
					"solution" : "Please contact technical support engineers."
				},
				"4040024" : {
					"cause" : "The resource cluster does not exist",
					"desc" : "The resource cluster does not exist",
					"solution" : "Please select another resource cluster."
				},
				"4040143" : {
					"cause" : "The number of the VM's CPU cores exceeds the maximum CPU cores of the hosts in the cluster.",
					"desc" : "The number of the VM's CPU cores exceeds the maximum CPU cores of the hosts in the cluster.",
					"solution" : "Please input the correct number."
				},
				"4070007" : {
					"cause" : "The VM is not created using the VM template",
					"desc" : "The VM is not created using the VM template",
					"solution" : "Contact the administrator"
				},
				"4070008" : {
					"cause" : "The number of VM disks has reached the upper limit",
					"desc" : "The number of VM disks has reached the upper limit",
					"solution" : "Contact technical support"
				},
				"4070022" : {
					"cause" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored",
					"desc" : "The VM is not in running or stopped state. Only the running or stopped VM can be restored",
					"solution" : "Check the VM state\\, and restore the VM again"
				},
				"4070045" : {
					"cause" : "Discovering VM templates ...",
					"desc" : "Discovering VM templates ...",
					"solution" : "Contact technical support"
				},
				"4070529" : {
					"cause" : "The VM OS does not support CPU installation without stopping the VM",
					"desc" : "The VM OS does not support CPU installation without stopping the VM",
					"solution" : "Please contact your administrator or view the help manual"
				},
				"4070530" : {
					"cause" : "The VM does not support CPU hot swap.",
					"desc" : "The VM does not support CPU hot swap.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070531" : {
					"cause" : "The CPU hot swapping function attribute is modified incorrectly",
					"desc" : "The CPU hot swapping function attribute is modified incorrectly",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4070532" : {
					"cause" : "The VM OS does not support memory installation without stopping the VM.",
					"desc" : "The VM OS does not support memory installation without stopping the VM.",
					"solution" : "Please contact your administrator or view the help manual"
				},
				"4070533" : {
					"cause" : "The memory hot swap function attribute is modified incorrectly.",
					"desc" : "The memory hot swap function attribute is modified incorrectly.",
					"solution" : "Please contact your administrator or view the help manual"
				},
				"4100001" : {
					"cause" : "A mandatory parameter is not specified.",
					"desc" : "A mandatory parameter is not specified.",
					"solution" : "Ensure that all mandatory parameters are specified."
				},
				"4410011" : {
					"cause" : "The data store resources of the 'SAN-SATA' type in the cluster are insufficient.",
					"desc" : "The data store resources of the 'SAN-SATA' type in the cluster are insufficient.",
					"solution" : "Please contact technical support engineers."
				},
				"4410012" : {
					"cause" : "The data store resources of the 'SAN-Any' type in the cluster are insufficient.",
					"desc" : "The data store resources of the 'SAN-Any' type in the cluster are insufficient.",
					"solution" : "Please contact technical support engineers."
				},
				"4410013" : {
					"cause" : "The data store resources of the 'SAN-SSD' type in the cluster are insufficient.",
					"desc" : "The data store resources of the 'SAN-SSD' type in the cluster are insufficient.",
					"solution" : "Please contact technical support engineers."
				},
				"4410014" : {
					"cause" : "The data store resources of the 'SAN-SAS&FC' type in the cluster are insufficient.",
					"desc" : "The data store resources of the 'SAN-SAS&FC' type in the cluster are insufficient.",
					"solution" : "Please contact technical support engineers."
				},
				"4410015" : {
					"cause" : "Storage resources in the cluster are insufficient or no storage that meets the VM startup requirements is available.",
					"desc" : "Storage resources in the cluster are insufficient or no storage that meets the VM startup requirements is available.",
					"solution" : "Please contact technical support engineers."
				},
				"4410018" : {
					"cause" : "The specified storage resources are insufficient or cannot meet the VM startup requirements.",
					"desc" : "The specified storage resources are insufficient or cannot meet the VM startup requirements.",
					"solution" : "Please contact the system administrator or view the online help."
				},
				"4800000" : {
					"cause" : "Internal service error.",
					"desc" : "Internal service error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4800001" : {
					"cause" : "Invalid parameter.",
					"desc" : "Invalid parameter.",
					"solution" : "Please enter valid parameters."
				},
				"4800012" : {
					"cause" : "No matched VM template exists",
					"desc" : "No matched VM template exists",
					"solution" : "Please create the matched VM template"
				},
				"4810001" : {
					"cause" : "Users no operating authority.",
					"desc" : "Users no operating authority.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4820016" : {
					"cause" : "System error.",
					"desc" : "System error.",
					"solution" : "Contact technical support engineers."
				},
				"4820026" : {
					"cause" : "Failed to obtain the VM information.",
					"desc" : "Failed to obtain the VM information.",
					"solution" : "Please contact the system administrator"
				},
				"4822001" : {
					"cause" : "Some parameter is invalid.",
					"desc" : "Some parameter is invalid.",
					"solution" : "Please input valid parameter."
				},
				"4822027" : {
					"cause" : "The internal service error.",
					"desc" : "The internal service error.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4823002" : {
					"cause" : "Invoke IRM failed.",
					"desc" : "Invoke IRM failed.",
					"solution" : "Please contact your administrator or view the help manual."
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
					"solution" : "Contact technical support"
				},
				"4823008" : {
					"cause" : "The database exception.",
					"desc" : "The database exception.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4823010" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"4823011" : {
					"cause" : "VM template does not exist.",
					"desc" : "VM template does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4823012" : {
					"cause" : "A VM is failed to be created\\, and therefore it cannot be made into a template",
					"desc" : "A VM is failed to be created\\, and therefore it cannot be made into a template",
					"solution" : "Delete the VM template and create another VM template."
				},
				"4823014" : {
					"cause" : "System error",
					"desc" : "System error",
					"solution" : "Contact technical support"
				},
				"4823016" : {
					"cause" : "The shared file path cannot be empty",
					"desc" : "The shared file path cannot be empty",
					"solution" : "Enter the shared file path"
				},
				"4823017" : {
					"cause" : "Cannot delete registration status.",
					"desc" : "Cannot delete registration status.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4823018" : {
					"cause" : "The VM template has been created successfully",
					"desc" : "The VM template has been created successfully",
					"solution" : "Contact the administrator"
				},
				"4823019" : {
					"cause" : "Failed to start the VM",
					"desc" : "Failed to start the VM",
					"solution" : "Contact technical support"
				},
				"4823020" : {
					"cause" : "You can modify only created VM templates.",
					"desc" : "You can modify only created VM templates.",
					"solution" : "Refresh the page and try again."
				},
				"4823021" : {
					"cause" : "An error occurred when the template was converted to a VM.",
					"desc" : "An error occurred when the template was converted to a VM.",
					"solution" : "Please try later or contact the administrator"
				},
				"4823022" : {
					"cause" : "The operation is not allowed because the VM template is being used.",
					"desc" : "The operation is not allowed because the VM template is being used.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4823023" : {
					"cause" : "The zone of the user and that of the resources do not match.",
					"desc" : "The zone of the user and that of the resources do not match.",
					"solution" : "Contact the system administrator."
				},
				"4823024" : {
					"cause" : "Failed to create the VM template because the available resource cluster does not exist.",
					"desc" : "Failed to create the VM template because the available resource cluster does not exist.",
					"solution" : "Contact the administrator to add the resource cluster."
				},
				"4823036" : {
					"cause" : "The VM in the current state does not support the VNC login.",
					"desc" : "The VM in the current state does not support the VNC login.",
					"solution" : "Try again later or start the VM."
				},
				"4823037" : {
					"cause" : "The VM template name already exists.",
					"desc" : "The VM template name already exists.",
					"solution" : "Enter another VM template name"
				},
				"4823038" : {
					"cause" : "The software can be installed only on the VM templates that is being creating.",
					"desc" : "The software can be installed only on the VM templates that is being creating.",
					"solution" : "Refresh the page and try again."
				},
				"4823040" : {
					"cause" : "Failed to perform the operation because the VM is in hibernation state.",
					"desc" : "Failed to perform the operation because the VM is in hibernation state.",
					"solution" : "Please start the VM and try again"
				},
				"4823047" : {
					"cause" : "You cannot modify the VM template in this status.",
					"desc" : "You cannot modify the VM template in this status.",
					"solution" : "Review the VM template status"
				},
				"4823049" : {
					"cause" : "Delete NFS template failed.",
					"desc" : "Delete NFS template failed.",
					"solution" : "Contact the administrator"
				},
				"4823058" : {
					"cause" : "The status of VM template is conflict.",
					"desc" : "The status of VM template is conflict.",
					"solution" : "Please wait the status convert success."
				},
				"4823059" : {
					"cause" : "The description of VM template is invalid.",
					"desc" : "The description of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823060" : {
					"cause" : "The update mode parameter of VM template is invalid.",
					"desc" : "The update mode parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823061" : {
					"cause" : "The block heat transfer parameter of VM template is invalid.",
					"desc" : "The block heat transfer parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823062" : {
					"cause" : "The icon of VM template is invalid.",
					"desc" : "The icon of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823063" : {
					"cause" : "The CPU parameter of VM template is invalid.",
					"desc" : "The CPU parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823064" : {
					"cause" : "The memory parameter of VM template is invalid.",
					"desc" : "The memory parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823065" : {
					"cause" : "The disk parameter of VM template is invalid.",
					"desc" : "The disk parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823066" : {
					"cause" : "The NIC parameter of VM template is invalid.",
					"desc" : "The NIC parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823067" : {
					"cause" : "The OS parameter of VM template is invalid.",
					"desc" : "The OS parameter of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823068" : {
					"cause" : "The name of VM template is invalid.",
					"desc" : "The name of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823069" : {
					"cause" : "The cluster of VM template is invalid.",
					"desc" : "The cluster of VM template is invalid.",
					"solution" : "Please modify the parameter and retry."
				},
				"4823070" : {
					"cause" : "The VM template is related the VM logic template, delete failed.",
					"desc" : "The VM template is related the VM logic template, delete failed.",
					"solution" : "Please unrelated VM logic template first"
				},
				"4823071" : {
					"cause" : "The VM template is used by app, delete failed.",
					"desc" : "The VM template is used by app, delete failed.",
					"solution" : "Please delete app first"
				},
				"4823072" : {
					"cause" : "The Image file is larger than 6GB.",
					"desc" : "The Image file is larger than 6GB.",
					"solution" : "Please operate on FSP directly."
				},
				"4823073" : {
					"cause" : "Insufficient storage space.",
					"desc" : "Insufficient storage space.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4823074" : {
					"cause" : "sent imagefile to openstack failed, Please check the Openstack service",
					"desc" : "sent imagefile to openstack failed, Please check the Openstack service",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825000" : {
					"cause" : "The VM logic template is not associated with VM template.",
					"desc" : "The VM logic template is not associated with VM template.",
					"solution" : "Please contact the system administrator."
				},
				"4825001" : {
					"cause" : "The VM template association does not exist.",
					"desc" : "The VM template association does not exist.",
					"solution" : "Contact the administrator"
				},
				"4825002" : {
					"cause" : "The VM logic template does not exist.",
					"desc" : "The VM logic template does not exist.",
					"solution" : "Contact the system administrator"
				},
				"4825003" : {
					"cause" : "Failed to query information about associated clusters.",
					"desc" : "Failed to query information about associated clusters.",
					"solution" : "Please contact the system administrator."
				},
				"4825007" : {
					"cause" : "The VM logical template is in the activated state, and therefore cannot be disassociated from the VM template.",
					"desc" : "The VM logical template is in the activated state, and therefore cannot be disassociated from the VM template.",
					"solution" : "Please deactivate the VM logical template and try again."
				},
				"4825011" : {
					"cause" : "The VM template is lost.",
					"desc" : "The VM template is lost.",
					"solution" : "Contact the administrator"
				},
				"4825012" : {
					"cause" : "The VM logical template is in the activated state, and therefore cannot be associated with or disassociated from the VM template.",
					"desc" : "The VM logical template is in the activated state, and therefore cannot be associated with or disassociated from the VM template.",
					"solution" : "Please deactivate the VM logical template and try again."
				},
				"4825015" : {
					"cause" : "The status of VM logic template has not been updated.",
					"desc" : "The status of VM logic template has not been updated.",
					"solution" : "Please update the status of VM logic template."
				},
				"4825016" : {
					"cause" : "The VM logic template and system versions do not match.",
					"desc" : "The VM logic template and system versions do not match.",
					"solution" : "Contact the system administrator"
				},
				"4825017" : {
					"cause" : "The VM logic template and system disk does not match.",
					"desc" : "The VM logic template and system disk does not match.",
					"solution" : "Contact the system administrator."
				},
				"4825018" : {
					"cause" : "A VM template has been associated with the VM logic template.",
					"desc" : "A VM template has been associated with the VM logic template.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825019" : {
					"cause" : "A VM template has been associated with the VM logic template.",
					"desc" : "A VM template has been associated with the VM logic template.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825020" : {
					"cause" : "The logic state of the virtual machine template is activated, you cannot modify.",
					"desc" : "The logic state of the virtual machine template is activated, you cannot modify.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825022" : {
					"cause" : "The VM template creating has not been accomplished, and therefore cannot be associated with a VM logical template.",
					"desc" : "The VM template creating has not been accomplished, and therefore cannot be associated with a VM logical template.",
					"solution" : "Please accomplish the VM template creating and try again"
				},
				"4825023" : {
					"cause" : "Logic template virtual machine is active, you cannot delete.",
					"desc" : "Logic template virtual machine is active, you cannot delete.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825025" : {
					"cause" : "A VM template has been associated with the VM logic template.",
					"desc" : "A VM template has been associated with the VM logic template.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825111" : {
					"cause" : "The name of VM logic template is duplicated.",
					"desc" : "The name of VM logic template is duplicated.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4825113" : {
					"cause" : "The VM template has been associated with a VM logical template.",
					"desc" : "The VM template has been associated with a VM logical template.",
					"solution" : "Please disassociate the VM template from the VM logical template and try again."
				},
				"4825116" : {
					"cause" : "A VM template in the same cluster has been associated with the VM logical template",
					"desc" : "A VM template in the same cluster has been associated with the VM logical template",
					"solution" : "Please view the associated VM template"
				},
				"4825117" : {
					"cause" : "The number of added VM templates reaches the maximum",
					"desc" : "The number of added VM templates reaches the maximum",
					"solution" : "Delete unnecessary VM templates and retry to create VM template. Perform this operation with caution"
				},
				"4825118" : {
					"cause" : "The number of added VM templates reaches the maximum.",
					"desc" : "The number of added VM templates reaches the maximum.",
					"solution" : "Delete unnecessary VM templates and retry to create VM template. Perform this operation with caution"
				},
				"4840002" : {
					"cause" : "Failed to connect to the database.",
					"desc" : "Failed to connect to the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4840005" : {
					"cause" : "Failed to save to the database.",
					"desc" : "Failed to save to the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4840006" : {
					"cause" : "Failed to query the database.",
					"desc" : "Failed to query the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4840007" : {
					"cause" : "Failed to delete the database.",
					"desc" : "Failed to delete the database.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4840014" : {
					"cause" : "The number of CPU exceeds maximum limit",
					"desc" : "The number of CPU exceeds maximum limit",
					"solution" : "Please input the correct number"
				},
				"4880001" : {
					"cause" : "Some parameter is missing.",
					"desc" : "Some parameter is missing.",
					"solution" : "Please input required parameter."
				},
				"4880002" : {
					"cause" : "Some parameter is invalid.",
					"desc" : "Some parameter is invalid.",
					"solution" : "Please input valid parameter."
				},
				"4880003" : {
					"cause" : "The VM flavor does not exist.",
					"desc" : "The VM flavor does not exist.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4880004" : {
					"cause" : "The VM flavor name already exists.",
					"desc" : "The VM flavor name already exists.",
					"solution" : "Please input other VM flavor name."
				},
				"4880005" : {
					"cause" : "Duplicate disk index.",
					"desc" : "Duplicate disk index.",
					"solution" : "Please input other index of disk."
				},
				"4880006" : {
					"cause" : "The number of VM flavor is out of bound.",
					"desc" : "The number of VM flavor is out of bound.",
					"solution" : "Please contact your administrator or view the help manual."
				},
				"4410020" : {
					"cause" : "Storage resources in the specified host are insufficient or no storage is available to support VM start.",
					"desc" : "Storage resources in the specified host are insufficient or no storage is available to support VM start.",
					"solution" : "Please contact your administrator or view the help manual."
				}
			};
			return exceptionMap;
		})