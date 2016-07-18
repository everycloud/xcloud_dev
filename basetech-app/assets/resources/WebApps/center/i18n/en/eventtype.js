define([], function () {
var exceptionMap =	
{
        "IRM.PVM.REPAIR":"restore deployment service"
        ,
        "IRM.VM.DELETE.VOLUME":"Delete Disk"
        ,
        "IRM.SNAPSHOT.DELETE.VOLUMESNAPSHOT":"Delete disk sanpshot"
        ,
        "IRM.SNAPSHOT.CREATE.VOLUMESNAPSHOT":"Create Disk sanpshot"
        ,
        "IRM.SNAPSHOT.MODIFY.VOLUMESNAPSHOT":"Modify Disk sanpshot"
        ,
        "IRM.VM.MOUNT.VOLUME":"Attach disk"
        ,
        "IRM.VM.CREATE.VOLUME":"Create Disk"
        ,
        "IRM.VM.UNMOUNT.VOLUME":"Detach disk"
        ,
        "IRM.CLOUDINFRA.SYNCHRONIZE":"Update the resource pool"
        ,
        "IRM.VM.VOLUME.CREATE":"Add disk to VM"
        ,
        "IRM.VM.VOLUME.DELETE":"Delete VM's Disk"
        ,
        "IRM.VM.MODIFY.VOLUME":"Modify Disk"
        ,
        "IRM.FAILED.PVM.DELETE":"delete failed deployment service"
        ,
        "IRM.PVM.CREATE":"apply deployment service"
        ,
        "IRM.PVM.CREATE.VM.CREATE":"create deployment service vm"
        ,
        "IRM.PVM.CREATE.VM.MODIFYROUTE":"modiry route for deployment service"
        ,
        "IRM.PVM.CREATE.VM.GETIP":"get deployment service vm ip"
        ,
        "IRM.PVM.UPDATE":"update deployment service"
        ,
        "IRM.PVM.UPDATE.STOP":"stop deployment service vm"
        ,
        "IRM.PVM.UPDATE.STOP":"stop deployment service vm"
        ,
		"IRM.OCCUPIEDVM.CREATE":"create occupied vm"
        ,
        "IRM.PVM.UPDATE.START":"start deployment service vm"
        ,
        "IRM.PVM.START.STARTVM":"start deployment service vm"
        ,
        "IRM.PVM.START.GETIP":"get deployment service vm ip"
        ,
        "IRM.PVM.UPDATE.MODIFY.NIC.PARENT":"update deployment service vm nics information"
        ,
        "IRM.PVM.UPDATE.ADD.NIC":"add deployment service vm nic"
        ,
        "IRM.PVM.UPDATE.DELETE.NIC":"delete deployment service vm nic"
        ,
        "IRM.PVM.UPDATE.MODIFY.NIC":"update deployment service vm nic"
        ,
        "IRM.PVM.UPDATE.GETIP":"get deployment service vm ip"
        ,
        "IRM.PVM.UPDATE.MOFIFY.ROUTE":"update deployment service vm route information"
        ,
        "IRM.PVM.START":"start deployment service"
        ,
        "IRM.PVM.STOP":"stop deployment service"
        ,
        "IRM.PVM.DELETE":"delete deployment service"
        ,
        "IRM.TEST.TEST":"start vm"
        ,
        "IRM_VFW_ALLOCATE_VFW":"Allocate vFireWall"
        ,
        "IRM_RELEASE_VFW":"Release vFireWall"
        ,
        "IRM.VSA.DEL_FIREWALLVSA":"Release vFireWall"
        ,
        "IRM.VSA.MODIFYFIREWALLVSA":"Modify vFireWall"
        ,
        "IRM.VSA.CREATE_VSAVM_FOR_REPAIRVSA":"Create new VSA vm"
        ,
        "IRM.VSA.DEL_OLD_VSAVM_FOR_REAIRVSA":"Delete old VSA vm"
        ,
        "IRM.VSA.VSA_FORCE_SYNC":"VSA data synchronization"
        ,
        "IRM.VSA.REPAIRVSA":"Repair VSA"
        ,
        "IRM.VM.TEMPLATE.EXPORT":"Export vm template"
        ,
        "IRM.VM.EXPORT":"Export virtual machine"
        ,
        "IRM.VSA.ADDNICTOVSA":"Add nic to securitygroup"
        ,
        "IRM.VM.TEMPLATE.IMPORT":"Import template"
        ,
        "IMR_CREATE_FIREWALLVSA":"Allocate vFireWall"
        ,
        "IRM.VSA.CREATEFWVSAVM":"Create firewall VSA vm"
        ,
        "IRM.VSA.CREATEFWVSAPG":"Create firewall VSA portgroup"
        ,
        "IRM.VSA.ADDFIREWALLVSA":"Register firewall VSA"
        ,
        "IRM.VSA.ADDEXSUBNETFORFWVSA":"Create external subnet"
        ,
        "IRM.VSA.CRATEROUTEFORFWVSA":"Create route for external subnet"
        ,
        "IRM.VSA.CREATESUBNETFORFWVSA":"Create subnet for vxlan"
        ,
        "IRM.VSA.ADDROUTEFORVLXAN":"Create route for vxlan"
        ,
        "IRM.VSA.DEL_FWVSA_FROMVSAM":"Cancel firewall VSA"
        ,
        "IRM.AUDIT.VSAM":"Restore VSAM data"
        ,
        "IRM.RESTORE.VSAM":"Restore VSAM"
        ,
        "IRM.VSAM.START_RECOVER_VSAM":"Restore VSAM data"
        ,
        "IRM.VSAM.AUDIT.ADDNAPT":"Add NAPT"
        ,
        "IRM.VSAM.AUDIT.DELNAPT":"Delete NAPT"
        ,
        "IRM.VSAM.AUDIT.ADDSNAT":"Add SNAT"
        ,
        "IRM.VSAM.AUDIT.DELSNAT":"Delete SNAT"
        ,
        "IRM.VSAM.AUDIT.ADDVSA":"Add VSA"
        ,
        "IRM.VSAM.AUDIT.DELVSA":"Delete VSA"
        ,
        "IRM.VSAM.AUDIT.ADDIPMAC":"Add IP and MAC"
        ,
        "IRM.VSAM.AUDIT.DELIPMAC":"Delete IP and MAC"
        ,
        "IRM.VSAM.AUDIT.ADDDHCPSUBNET":"Add DHCP subnet"
        ,
        "IRM.VSAM.AUDIT.DELDHCPSUBNET":"Delete DHCP subnet"
        ,
        "IRM.VSAM.AUDIT.ADDSUBNET":"Add subnet"
        ,
        "IRM.VSAM.AUDIT.DELSUBNET":"Delete subnet"
        ,
        "IRM.VSAM.AUDIT.ADDEXSUBNET":"Add external subnet"
        ,
        "IRM.VSAM.AUDIT.DELEXSUBNET":"Delete external subnet"
        ,
        "IRM.VSAM.AUDIT.UPDATEFWZONE":"Update firewall zone"
        ,
        "IRM.VSAM.AUDIT.ADDFWRULE":"Add firewall rule"
        ,
        "IRM.VSAM.AUDIT.DELFWRULE":"Delete firewall rule"
        ,
        "IRM.VSAM.AUDIT.ADDVPNGATEWAY":"Add VPN gateway"
        ,
        "IRM.VSAM.AUDIT.DELVPNGATEWAY":"Delete VPN gateway"
        ,
        "IRM.VSAM.AUDIT.ADDVPNGATECONN":"Add VPN connection"
        ,
        "IRM.VSAM.AUDIT.DELVPNGATECONN":"Delete VPN connection"
        ,
        "IRM.VSA.DEL_FWVSAVM":"Delete firewall VSA vm"
        ,
        "IRM.VSA.DEL_PG_FOR_FWVSA":"Delete firewall VSA portgroup"
        ,
        "IRM_VFW_MODIFY_VFW":"Modify vFireWall"
        ,
        "IRM.REPAIR.NETWORK_IP_MAC":"Repair IP on the network"
        ,
        "IRM.REPAIR.NETWORK_IP.REALLOCATE":"Re-allocate IP in the network"
        ,
        "IRM.REMOVE.VM.TO.AFFINITY":"Remove Members"
        ,
        "IRM.ADD.VM.TO.AFFINITY":"Add Members"
        ,
        "IRM.STATIC_IP_MAC.ADD":"Register IP and MAC binding relationship on the VSA"
        ,
        "IRM.STATIC_IP_MAC.DELETE":"Delete IP and MAC binding relationship on the VSA"
        ,
        "IRM.REPAIR.NETWORK_IP.RELEASE":"Recycle IP in the network"
        ,
        "IRM.REPAIR.NETWORK_IP_MAC.TEMPTASK":"Repair IP on the network failed"
        ,
        "IRM.SECURITYGROUP.REMOVEFROMSGFORNIC":"Remove nic from security group"
        ,
        "IRM.SECURITYGROUP.DELRULEFORREMOVENIC":"Delete security group rule"
        ,
        "IRM.SECURITYGROUP.ADDTODEFSGFORREMOVEMEMBER":"Add nic to default security group"
        ,
        "IRM.SECURITYGROUP.UPDATENICFLOATIP.SUB":"NIC configurate floating IP"
    	,
        "IRM.SECURITYGROUP.ADDDEFSGRULETOGEFORREMOVEMEMBER":"Add default security group rule"
        ,
        "IRM.SECURITYGROUP.UPDATEIPSETFORREMOVEMEMBER":"Update ipset"
        ,
        "IRM.SECURITYGROUP.UPDATEIPSETFORREMOVEMEMBERSUB":"Update ipset"
        ,
        "IRM.SECURITYGROUP.REMOVENICFORMDEFSG":"Remove nic from default security group"
        ,
        "IRM.SECURITYGROUP.ADDTOSGFORNIC":"Add nic to security group"
        ,
        "IRM.SECURITYGROUP.ADDRULEFORADDNIC":"Add security group rule"
        ,
        " IRM.SECURITYGROUP.DELDEFSGRULEFORADDMEMBER":"Delete default security group rule"
        ,
        "IRM.SECURITYGROUP.REMOVEMEMBER":"Exit Security Group"
        ,
        "IRM.SECURITYGROUP.REMOVEMEMBERSUB":"Exit Security Group Sub Task"
        ,
        "IRM_CREATE_DHCPVSA":"Create DHCP server"
        ,
        "IRM_CREATE_VSAVM":"Create VSA vm"
        ,
        "IRM_CREATE_UHMSUBNET":"Create subnet"
        ,
        "IRM_ADD_VSA":"Add VSA"
        ,
        "IRM_CREATE_VSABUSNETWORK":"Config VSA business network"
        ,
        "IRM_CREATE_VSAROUTE":"Config VSA route information"
        ,
        "IRM_DELETE_DHCPVSA":"Delete DHCP server"
        ,
        "IRM_CREATE_VSADHCPSUBNET":"Create DHCP subnet"
        ,
        "IRM.EIP.BIND":"Bind elastic IP"
        ,
        "IRM.EIP.UNBIND":"Unbind elastic IP"
        ,
        "IRM.EIP.DELDNAT":"Delete NAT"
        ,
        "IRM.EIP.DELIPBW":"Delete IP bandwidth"
        ,
        "IRM.EIP.DELACLRULE":"Delete ACL rules"
        ,
        "IRM.EIP.DELSGRULE":"Delete security group rules"
        ,
        "IRM_VFW_ALLOCATE_BAND":"Set bandwidth"
        ,
        "IRM.SNAT.CREATE":"Open SNAT"
        ,
        "IRM.SNAT.DELETE":"Close SNAT"
        ,
        "IRM_VSA_VSA_FORCESYNC":"VSA force sync"
        ,
        "IRM.IP_BANDWIDTH.UPDATE":"Update IP bandwidth"
        ,
        "IRM.FIREWALL.ADD":"Add physical firewall"
        ,
        "IRM.FIREWALL.REDISCOVERY":"Rediscovery phy firewall"
        ,
        "IRM.FIREWALL.UPDATECONNECTOR":"Update phy firewall"
        ,
        "IRM.FIREWALL.DELETE":"Delete physical firewall"
        ,
        "IRM.FIREWALL.ADDACL":"Add ACL"
        ,
        "IRM.FIREWALL.ADDACLENTRY":"Add ACL rule"
        ,
        "IRM.FIREWALL.DELETEACLENTRY":"Delete ACL rule"
        ,
        "IRM.SECURITYGROUP.ADDMEMBER":"Join Security Group"
        ,
        "IRM.SECURITYGROUP.ADDMEMBERSUB":"Join Security Group Sub Task"
        ,
        "IRM.SECURITYGROUP.ADDSGRULES":"Add security group rules"
        ,
        "IRM.SECURITYGROUP.ADDSINGLESGRULE":"Add security group rules"
        ,
        "IRM.SECURITYGROUP.DELSGRULES":"Delete security group rules"
        ,
        "IRM.SECURITYGROUP.DELSINGLESGRULE":"Add security group rules "
        ,
		"IRM.SECURITYGROUP.UPDATENICFLOATIP":"NIC configurate floating IP"
		,
		"IRM.SECURITYGROUP.ADD_CLOUD_OBJECT_SGRULE":"Add cloud object security group rules"
		,
        "IRM.VFIREWALL.SETASPF":"Set aspf"
        ,
        "IRM.VFIREWALL.CREATEVPNCONNECTION":"Create vpn connection"
        ,
        "IRM.VFIREWALL.DELETEVPNCONNECTION":"Delete vpn connection"
        ,
        "IRM.VFIREWALL.UPDATEVPNCONNECTION":"Update vpn connection"
        ,
        "IRM.VFIREWALL.CREATEVPN":"Create vpn"
        ,
        "IRM.VFIREWALL.DELETEVPN":"Delete vpn"
        ,
        "IRM.VFIREWALL.CREATEL2TPVPNUSER":"Create l2tp-vpn user"
        ,
        "IRM.VFIREWALL.DELETEL2TPVPNUSER":"Delete l2tp-vpn user"
        ,
        "IRM.BLOCKSTORAGE.CREATE.VOLUMN":"Create Disk"
        ,
        "IRM.VM.EXPAND.VOLUME":"Expand Disk"
        ,
        "IRM.BLOCKSTORAGE.CREATE":"Create Block Storage"
        ,
        "IRM.Disk.MigrateSingleDisk":"Migrate disk"
        ,
        "IRM.VM.MigrateDisksInVm":"Migrate disks in vm"
        ,
        "IRM.Disk.AdjustDiskVolume":"Adjust VM disk volume"
        ,
        "IRM.HOST.UpdateUplinkPortAggr.SERVER":"Update Host UplinkPortAggr"
        ,
        "IRM.HOST.UpdateUplinkPortAggr.SWITCH":"Update Switch UplinkPortAggr"
        ,
        "IRM.CLUSTER.UpdateUplinkPortAggr.MODIFY":"Update Cluster UplinkPortAggr"
        ,
        "IRM.DISK.RECYCLE":"Recycle disk"
        ,
        "IRM.VM.ADDUSBDEV":"Add USB Device"
        ,
        "IRM.VM.DELUSBDEV":"Delete USB Device"
        ,
        "IRM.VM.ADDUSBCONTROLER":"Add USB Controner"
        ,
        "IRM.VM.DELUSBCONTROLER":"Delete USB Controner"
        ,
        "IRM.VM.ADDUSBDEVANDCONTROLER":"Add USB Device and USB Controler"
        ,
        "IRM.VM.HIBERNATE":"Hibernate VM"
        ,
        "IRM_VM_START":"Start VM"
        ,
        "IRM_VM_STOP":"Stop VM"
        ,
        "IRM_VM_STOP_FORCE":"Stop VM forcibly"
        ,
        "IRM_VM_RESTART":"Restart VM"
        ,
        "IRM_VM_RESTART_FORCE":"Restart VM forcibly"
        ,
        "IRM_VM_MIGRATE":"Migrate VM"
        ,
        "IRM.VM.PAUSE":"Pause VM"
        ,
        "IRM.VM.MODIFY.UPGRADEMODE":"Modify VM upgrade mode"
        ,
        "IRM.VM.RESUME":"Resume VM"
        ,
        "IRM.VM.UNPAUSE":"Unpause VM"
        ,
        "IRM.VM.LIVEMIGRATE":"Live Migrate VM"
        ,
        "IRM.VM.COLDMIGRATE":"Cold Migrate VM"
        ,
        "IRM_VM_DRRESUME":"Resume VM"
        ,
        "IRM.VM.ATTACHISO":"Mount VM CDRom"
        ,
        "IRM.VM.DETTACHISO":"Unmount VM CDRom"
        ,
        "IRM.VM.DELETE":"Delete VM"
        ,
        "IRM.VM.BATCH.DELETE":"Batch delete VM"
        ,
        "IRM.VMTEMPLATE.DELETE":"Delete VM template"
        ,
        "IRM.VM.STOP.BEFORE.DELETE":"Stop VM forcibly"
        ,
        "IRM.DISK.ZEROFILL":"Overwrite Disk with zeros"
        ,
        "IRM.DISK.ZEROFILL.SUB":"Overwrite Disk with zeros"
        ,
        "IRM.VM.DELETE.SUB":"Delete VM"
        ,
        "IRM.VMTEMPLATE.DELETE.SUB":"Delete VM template"
        ,
        "IRM.VM.DELETE.CONFIG":"Delete VM Configuration"
        ,
        "IRM.VMTEMPLATE.DELETE.CONFIG":"Delete VM Configuration"
        ,
        "IRM.DISK.REMOVE":"Delete VM's Disk"
        ,
        "IRM.VM.REPAIROS":"Restore VM"
        ,
        "IRM.VM.REPAIR.STOPVM":"Stop VM forcibly"
        ,
        "IRM.VM.REPAIR.STARTVM":"Start VM"
        ,
        "IRM.VM.CLONE.TEMPLATE":"Clone VM"
        ,
        "IRM.VM.REPAIR.DETACHDISK.OLD":"Detach disk"
        ,
        "IRM.VM.REPAIR.ATACHDISK.OLD":"Attach original VM's Disk to VM"
        ,
        "IRM.VM.REPAIR.DETACHDISK.NEW":"Detach disk"
        ,
        "IRM.VM.REPAIR.ATACHDISK.NEW":"Attach new VM's Disk to VM"
        ,
        "IRM.VM.REPAIR.DELETEVM.NEW":"Delete VM"
        ,
        "IRM.VM.CREATESYSTEMDISK":"Create VM's System Disk"
        ,
        "IRM.VM.CREATESYSTEMDISK.CLONEVM":"Clone VM"
        ,
        "IRM.VM.CREATESYSTEMDISK.DETACHDISK":"Detach new VM's System Disk"
        ,
        "IRM.VM.CREATESYSTEMDISK.DELETENEWVM":"Delete VM"
        ,
        "IRM.VM.MODIFYSYSTEMDISK":"Modify VM's System Disk"
        ,
        "IRM.VM.MODIFYSYSTEMDISK.STOPVM":"Stop VM"
        ,
        "IRM.VM.MODIFYSYSTEMDISK.DETACHVOLUME":"Detach disk"
        ,
        "IRM.VM.MODIFYSYSTEMDISK.ATTACHVOLUME":"Attach disk"
        ,
        "IRM.DISK.DISATTACH":"Detach disk"
        ,
        "IRM.DISK.REMOVE.SUB":"Delete VM's Disk"
        ,
        "IRM.DISK.ATTACH":"Attach VM's Disk to VM"
        ,
        "IRM.DISK.CRAETE":"Add disk to VM"
        ,
        "IRM_VM_HOSTMIGRATE":"Migrate all VMs on a server"
        ,
        "IRM_VM_HOSTMIGRATE":"Migrate all VMs on a server"
        ,
        "IRM.VMTEMPLATE.CONFIG.ICACHE":"Configure iCache"
        ,
	    "IRM.VM.MODIFY.INFO":"Update VM's Properties"
        ,
        "IRM.VM.MODIFY.SPEC":"Update VM's Properties"
        ,
        "IRM.VM.MODIFY.SPEC.SUB":"Update VM's Properties"
        ,
        "IRM.VM.MODIFY.SPEC.DB":"Update VM's Record Data"
        ,
        "IRM.VMSNAPSHOT.CREATE":"Create VM snapshot"
        ,
        "IRM.VMSNAPSHOT.RESUME":"Snapshot resume VM"
        ,
        "IRM.VMSNAPSHOT.REMOVE":"Remove VM snapshot"
        ,
        "IRM.HOST.POWERONALL":"Power On All"
        ,
        "IRM.HOST.POWEROFFALL":"Power Off All"
        ,
        "IRM.HOST.BATCHPOWERON":"Batch power on hosts"
        ,
        "IRM.HOST.BATCHPOWEROFF":"Batch power off hosts"
        ,
        "IRM.VM.BATCHSTOP":"Batch stop vm"
        ,
        "IRM.VM.BATCHSTART":"Batch start vm"
        ,
        "IRM.HOST.POWERON":"Power on host"
        ,
        "IRM.HOST.POWEROFF":"Power off host"
        ,
        "IRM.DEVICETRAP.DEVICE":"Update Devices SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.SERVER":"Update Servers SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.STORAGE":"Update Storages SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.SWITCH":"Update Switches SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.SERVER.BATCH":"Batch Update Server SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.STORAGE.BATCH":"Batch Update Storages SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.SWITCH.BATCH":"Batch Update Switches SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.SERVER.SINGLE":"Single Update Server SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.STORAGE.SINGLE":"Single Update Storages SNMP-TRAP Config"
        ,
        "IRM.DEVICETRAP.SWITCH.SINGLE":"Single Update Switches SNMP-TRAP Config"
        ,
        "IRM.HOST.ENTERMAINTANCE":"Enter maintenance mode"
        ,
        "IRM.HOST.EXITMAINTANCE":"Exit maintenance mode"
        ,
        "IRM.DSWARE.START":"Start FusionStorage Service"
        ,
        "IRM.DSWARE.STOP":"Stop FusionStorage Service"
        ,
        "IRM.HYPERVISOR.DISCOVERY":"Discover hypervisor"
        ,
        "IRM.NETWORK.CREATEINTERNALNETWORK":"Create network"
        ,
        "IRM.NETWORK.DELETEINTERNALNETWORK":"Delete network"
        ,
        "IRM.NETWORK.MODIFYSUBNET":"Modify Subnet"
        ,
        "IRM.EXTERNALNETWORK.CREATE":"Create external network"
        ,
        "IRM.EXTERNALNETWORK.MODIFY":"Modify external network"
        ,
        "IRM.EXTERNALNETWORK.DELETE":"Delete external network"
        ,
        "AME.APP.STOP.PARENT":"Batch stop application"
        ,
        "AME.APP.BATCHSTOP":"Batch stop application"
        ,
        "AME.APP.BATCHSTART":"Batch start application"
        ,
        "AME.APP.STOP":"stop application"
        ,
        "AME.APP.START":"start application"
        ,
        "SSP.Instance.Create":"create application"
        ,
        "IRM.HOST.SAFESTOP":"Power Off host safe"
        ,
        "IRM.HOST.SAFESTART":"Power On host safe"
        ,
        "IRM.HOST.SAFEREBOOT":"Restart host safe"
        ,
        "IRM.CLUSTER.APPLY.RECOMM":"Apply cluster drs recommendation"
        ,
        "IRM.HYPERVISOR.DISCOVER.VMTEMP":"Discover VM Template"
        ,
        "IRM.VM.BATCH.CREATE":"Template Deploy VM"
        ,
        "IRM.BAREVM.BATCH.CREATE":"Create VM"
        ,
        "IRM.BAREVM.BATCH.CREATE.EACH":"Create VM"
        ,
        "IRM.BAREVM.BATCH.CREATE.BUILD":"Create Bare VM"
        ,
        "IRM.VM.BATCH.CREATE.EACH":"Create VM"
        ,
        "IRM.VM.CREATE.DRILL":"Create drill VM"
        ,
        "IRM.VM.BATCH.CLONE":"Clone VM"
        ,
        "IRM.VM.BATCH.CREATE.CLONE":"Clone VM"
        ,
        "IRM.VM.BATCH.CREATE.CONFIG":"Configure VM"
        ,
        "IRM.VMTEMPLATE.CREATE":"Create VM Template"
        ,
        "IRM.VM.CREATE":"Create Bare VM"
        ,
        "IRM.VM.CLONE.VM.TEMPLATE":"Clone VM to template"
        ,
        "IRM.VM.ADD.NIC":"Create VM Nic"
        ,
        "IRM.VM.MOD.NIC":"Modify VM Nic"
        ,
        "IRM.VM.DEL.NIC":"Delete VM Nic"
        ,
        "IRM.VMTEMPLATE.DEL.NIC":"Delete VM template nic"
        ,
        "IRM.VM.BACKUP":"Backup VM"
        ,
        "IRM.VM.BACKUP.SUB":"Backup VM"
        ,
        "IRM.VM.BACKUP.CONFIG":"Config VM after backup"
        ,
        "IRM.VM.BACKUP.RESTORE":"Restore VM"
        ,
        "IRM.VM.BACKUP.RESTORE.SUB":"Restore VM"
        ,
        "IRM.VM.BACKUP.RESTORE.CONFIG":"Config VM after restore"
        ,
        "IRM.VM.DELETE.RES.DISK ":"Delete VM Disk"
        ,
        "IRM.VMTEMPLATE.DELETE.RES.DISK ":"Delete VM template disk"
        ,
        "IRM.VM.DISK.DISATTACH ":"Disattach Disk"
        ,
        "IRM.VM.DISK.REMOVE ":"Remove Disk"
        ,
        "IRM.VOLUME.MIGRATE":"Migrate Disk"
        ,
        "IRM.VOLUMN.BATCH.REMOVE":"Delete Disk"
        ,
        "IRM.VOLUMN.REMOVE":"Delete Disk"
        ,
        "IRM.VOLUMN.BATCH.SAFE.REMOVE":"Delete Disk safely"
        ,
        "IRM.VOLUMN.SAFE.REMOVE":"Delete Disk safely"
        ,
        "IRM.LB.CREATE.LB":"Create VLB"
        ,
        "IRM.LB.CREATE.LB.SLBVM.PARENT":"Create VLB VM"
        ,
        "IRM.LB.CREATE.LB.SLB":"Create SLB"
        ,
        "IRM.LB.CREATE.LB.LISTENER":"Set listener"
        ,
        "IRM.LB.HLB.CREATE.NETWORK.PARENT":"Create HLB network profile"
        ,
        "IRM.LB.HLB.CREATE.LB":"Create HLB"
        ,
        "IRM.LB.HLB.BIND.VM":"Attach HLB to VM"
        ,
        "IRM.LB.DELETE.LB":"Delete VLB"
        ,
        "IRM.LB.HLB.UNBINDVM.PARENT":"Detach HLB from VM"
        ,
        "IRM.LB.HLB.DELETELB":"Delete HLB"
        ,
        "IRM.LB.HLB.DELETE.NETWORK.PARENT":"Delete HLB network profile"
        ,
        "IRM.LB.CREATE.LB.LISTENER.SESSIONPERSISTENCE":"Set sticky session"
        ,
        "IRM.LB.PAUSE.HLB":"Freeze LB"
        ,
        "IRM.LB.RESUME.HLB":"Unfreeze LB"
        ,
        "IRM.LB.PAUSE":"Freeze LB"
        ,
        "IRM.LB.RESUME":"Unfreeze LB"
        ,
        "IRM.LB.BINDIP.PARENT.TASK":"Bind elastic IP address to LB"
        ,
        "IRM.LB.UNBINDIP.PARENT.TASK":"Unbind elastic IP address from LB"
        ,
        "IRM.LB.MODIFY.LB":"Modify VLB"
        ,
        "IRM.LB.LISTENERS.CREATE":"Create listener"
        ,
        "IRM.LB.LISTENERS.DEL":"Delete listener"
        ,
        "IRM.LB.LISTENER.CERT.ASSOCIATE":"Set certificate"
        ,
        "IRM.HLB.LISTENER.CERT.ASSOCIATE":"Set certificate"
        ,
        "IRM.LB.LISTENER.BINDVMS":"Associate VLB with VM"
        ,
        "IRM.LB.LISTENER.BINDVMS.SUB.LISTENER.BINDVM":"Associate VM with VLB"
        ,
        "IRM.LB.LISTENER.BINDVMS.SUB.LISTENER.BINDVM.UHM":"Associate VM with VLB"
        ,
        "IRM.LB.LISTENER.BINDVMS.SUB.LISTENER.DELETEVM.UHM":"Disassociate VM from VLB"
        ,
        "IRM.LB.LISTENER.BINDVMS.SUB.LISTENER.MODIFYVM":"Modify the weight of VM"
        ,
        "IRM.LB.LISTENER.MODIFYVMS":"Modify the weight of VM"
        ,
        "IRM.LB.LISTENER.MODIFY.BINDVMS":"Associate  VM from VLB and Disassociate VM from VLB"
        ,
        "IRM.LB.LISTENER.MODIFY.BINDVMS.DELETEVM":"Disassociate VM from VLB"
        ,
        "IRM.LB.LISTENER.MODIFY.BINDVMS.BINDVM":"Associate VM from VLB"
        ,
        "IRM.LB.HLB.UNBIND.VM":"Disassociate VM from VLB"
        ,
        "IRM.LB.CREATE.LB.LISTENER.HEALTHCHECK":"Set health check"
        ,
        "IRM.LB.CREATE.LB.ADDVSA":"Add VSA"
        ,
        "IRM.LB.CREATE.LB.CREATESUBET":"Add subnet"
        ,
        "IRM.LB.CREATE.LB.ADDEXTSUBNET":"Add external network"
        ,
        "IRM.LB.CREATE.LB.CREATEROUTE":"Add route"
        ,
        "IRM.LB.MODIFY.LB.MODIFY.LISTENERS":"Modify listener"
        ,
        "IRM.LB.MODIFY.LB.MODIFY.DELETE.SEEIONS":"Delete sticky session"
        ,
        "IRM.LB.LISTENERS.DEL.SUB.DEL.PARENT":"Delete listener"
        ,
        "IRM.HLB.LISTENERS.DEL.SUB.DEL":"Delete listener"
        ,
        "IRM.LB.LISTENERS.DEL.SUB.DEL":"Delete listener"
        ,
        "IRM.LB.LISTENERS.DEL.SUB.DEL":"Delete listener"
        ,
        "IRM.LB.LISTENERS.OBJ.CREATE":"Create listener"
        ,
        "IRM.LB.LISTENER.OBJ.CREATE":"Create listener"
        ,
        "IRM.LB.MODIFY.LB.LISTENER":"Modify listener"
        ,
        "IRM.LB.MODIFY.LB.LISTENER.PARENT":"Modify listener"
        ,
        "IRM.LB.DELETE.LB.VSA":"Delete VSA"
        ,
        "IRM.LB.CREATE.LB.SLBVM":"Create VLB VM"
        ,
        "IRM.LB.LISTENER.CREATE":"Create listener"
        ,
        "IRM.LB.DELETE.LB.SLBVM":"Delete VLB VM"
        ,
        "IRM.LB.LISTENER.DELETEVMS":"Disassociate VLB from VM"
        ,
        "IRM.LB.LISTENER.BINDVMS.SUB.LISTENER.DELETEVM":"Disassociate VLB from VM"
        ,
        "IRM.LB.HLB.LISTENER.UNBINDVM.PARENT":"Disassociate VLB from VM"
        ,
        "IRM.LB.REPARIE.SLB":"Repair SLB"
        ,
        "IRM.LB.REPARIE.CREATE.LB.SLBVM":"Create VM"
        ,
        "IRM.LB.REPAIR.DELETE.LB.SLBVM":"Delete VM"
        ,
        "IRM.LB.DELETE.LB.SLBVM.CYCLE":"Delete VM recycle"
        ,
        "IRM.LB.SYN.SLBVM":"Synchronize SLB data"
        ,
        "IRM.VOLUMN.ATTACH":"Attach disk"
        ,
        "IRM.VOLUMN.DETACH":"Detach disk"
        ,
        "AME.VM.BATCH.SOFTWAREINSTALL":"Software Batch Install"
        ,
        "AME.VM.SOFTWAREINSTALL":"Software Install"
        ,
        "AME.VM.BATCH.SCRIPTINSTALL":"Script Batch Install"
        ,
        "AME.VM.SCRIPTINSTALL":"Script Install"
        ,
        "IRM.FILE.COPY":"copy"
        ,
        "IRM.FILE.IMPORT":"import"
        ,
        "IRM.FILE.EXPORT":"export"
        ,
        "IRM.FILE.DELETE":"delete"
        ,
        "IRM.FLOW.NONEED.QUERY":"Create VPC"
        ,
        "IRM_VPC_CREATE_VFW":"Allocate vFireWall"
        ,
        "IRM_VPC_CREATE_INITERNAL_NET":"Create internal network"
        ,
        "IRM_VPC_CREATE_ROUTED_NET":"Create routed network"
        ,
        "IRM_VPC_CREATE_VPN":"Create VPN"
        ,
        "IRM.BAREMETAL.INSTALLOS":"Install OS"
        ,
        "IRM.BAREMETAL.CLEANDATA":"Clean disk data"
        ,
        "IRM.NETWORK.UPDATEINTERNALNETWORK":"Modify network"
        ,
        "IRM.VM.MIGRATE.WHOLE":"Modify VM's Host and datastore"
        ,
        "IRM.VM.RESUME.RECYCLING":"Resume recycling VM"
        ,
        "IRM.VM.DISKIO.MODIFY":"Set I/O upper limit"
        ,
        "IRM.ROUTER.CREATEROUTER":"Apply router"
        ,
        "IRM.ROUTER.DELETEROUTER":"Release router"
        ,
        "IRM.VFW.CREATE_SUBNET":"Create subnet on the virtual firewall"
        ,
        "IRM.VFW.DELETE_SUBNET":"Delete subnet on the virtual firewall"
        ,
        "IRM.ROUTER.CREATEROUTER.OPVRF":"Register sub task when creating router"
        ,
        "IRM.ROUTER.CREATEROUTER.TEMPTASK":"Register temporary sub task when creating router"
        ,
        "IRM.ROUTER.DELETEROUTER.OPVFW":"Register sub task of operating the virtual firewall when deleting router"
        ,
        "IRM.ROUTER.DELETEROUTER.OPVRF":"Register sub task of operating the switch when deleting router"
        ,
        "IRM.ROUTER.DELETEROUTER.OPVRFSUBTASK":"Register sub sub task of operating the switch when deleting router"
        ,
        "IRM.SWITCH.CREATE_VRF":"Create VRF on the switch"
        ,
        "IRM.SWITCH.DELETE_VRF":"Delete VRF on the switch"
        ,
        "IRM.SWITCH.CREATE_VRFSUBNET":"Create subnet on the switch"
        ,
        "IRM.SWITCH.DELETE_VRFSUBNET":"Delete subnet on the switch"
        ,
        "IRM.SWITCH.CREATE_VRFROUTE":"Create route on the switch"
        ,
        "IRM.SWITCH.DELETE_VRFROUTE":"Delete route on the switch"
         ,
        "IRM.NETWORK.NETWORK.ASSOCATEROUTER":"Add interface on the router"
        ,
        "IRM.NETWORK.NETWORK.DEASSOCATEROUTER":"Delete interface on the router"
		,
		"AME_VMT_CREATE_COMPLETE":"Complete VM template creating"
		,
		"AME_VMT_CONVERT_TO_VM":"Convert VM Template to VM"
		,
		"AME_VMT_MODIFY_SOFTWARE":"Modify VM template's software"
		,
		"AME_VMT":"VM template"
		,
		"IRM.HOST.MAINTAINMODE.MIGRATEVM":"Migrate all the vm on the host"
		,
		"IRM.CONVERT.VM.TO.TEMPLATE":"Convert vm to template"
		,
		"IRM.CONVERT.TEMPLATE.TO.VM":"Convert template to vm"
		,
		"IRM.IMPORT.VM.TEMPLATE":"Import vm or vm templdate"
		,
		"AME.APP.CREATE":"Create application"
	    ,
	    "AME.APP.MODIFY":"Modify application"
	    ,
	    "AME.APP.REPAIR":"Repair application"
	    ,
	    "AME.APP.DELETE":"Delete application"
	    ,
	    "AME.APP.STOP.ONE.APP":"Stop application"
	    ,
	    "AME.APP.START.ONE.APP":"Start application"
	    ,
		"AME.APP.SCALING.GROUP.AUTO.ACTION":"Execute scaling action"
		,
		"AME.APP.SCALING.GROUP.MODIFY":"Modify Topo Scaling Group"
		,
		"AME.APP.SCALING.GROUP.REFRESH.VLB":"Refresh VLB"
		,
		"AME.APP.SCALING.GROUP.BIND.VLB":"Modify VLB binded by App scaling group"
		,
		"AME.APP.VLB.REFRESH":"Modify VLB binded by App vm"
        ,
        "IRM.NETWORK.CREATDNAT":"Create DNAT"
        ,
        "IRM.NETWORK.DELETEDNAT":"Delete DNAT"
        ,
        "IRM.FIREWALL.DELACL":"Delete ACL"
        ,
        "IRM.FIREWALL.CREATE":"Enable ACL"
        ,
        "IRM.FIREWALL.REMOVE":"Disable ACL"
        ,
        "SWM.BACKUP":"Backup"
        ,
        "IRM_FM_MANAGEMENT_IP":"Modify FM management IP"
        ,
        "IRM_MODIFY_FM_IP":"Modify FM management IP"
        ,
        "IRM_MODIFY_FC_ALARM_IP":"Modify FC alarm IP"
        ,
        "IRM_MODIFY_VSAM_ALARM_IP":"Modify VSAM alarm IP"
};
return exceptionMap;
}) 