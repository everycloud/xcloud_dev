
var HH_ChmFilename = "";
var HH_WindowName = "";
var HH_GlossaryFont = "";
var HH_Glossary = "";
var HH_Avenue = "";
var HH_ActiveX = false;

var gstrBsAgent 	= navigator.userAgent.toLowerCase();
var gnBsVer	   		= parseInt(navigator.appVersion);

var gbBsOpera		= (gstrBsAgent.indexOf('opera') != -1);
var gbBsKonqueror	= (gstrBsAgent.indexOf('konqueror') != -1);
var gbBsSafari		= (gstrBsAgent.indexOf('safari') != -1);
var gbBsIE  		= (gstrBsAgent.indexOf('msie') != -1) && !gbBsOpera && !gbBsKonqueror && !gbBsSafari;
var gbBsNS  		= (gstrBsAgent.indexOf('mozilla') != -1) && ((gstrBsAgent.indexOf('spoofer') == -1) && (gstrBsAgent.indexOf('compatible') == -1)) && !gbBsOpera && !gbBsKonqueror && !gbBsSafari;

var gbBsMac			= (gstrBsAgent.indexOf('mac') != -1);
var gbBsWindows		= ((gstrBsAgent.indexOf('win') != -1) || (gstrBsAgent.indexOf('16bit') != -1));
var gbBsSunOS		= (gstrBsAgent.indexOf("sunos") != -1);

var gbBsIE3Before 	= ((gbBsIE) && (gnBsVer <= 2));
var gbBsNS3Before 	= ((gbBsNS) && (gnBsVer <= 3));

var gbBsNS2			= ((gbBsNS) && (gnBsVer <= 2));
var gbBsNS3			= ((gbBsNS) && (gnBsVer == 3));
var gbBsIE300301	= ((gbBsIE) && (gnBsVer == 2) && ((gstrBsAgent.indexOf("3.00") != -1)||(gstrBsAgent.indexOf("3.0a") != -1)||(gstrBsAgent.indexOf("3.0b")!=-1)||(gstrBsAgent.indexOf("3.01")!=-1)));
var gbBsIE302		= ((gbBsIE) && (gnBsVer == 2) && (gstrBsAgent.indexOf("3.02") != -1));

var gbBsNS4			= ((gbBsNS) && (gnBsVer >= 4));
var gbBsNS6			= ((gbBsNS) && (gnBsVer >= 5));
var	gbBsNS7			= false;

var gbBsIE4			= ((gbBsIE) && (gnBsVer >= 4));
var gbBsIE5			= false;
var gbBsIE55		= false;
var gbBsIE7			= false;

var gbBsOpera6		= false;
var gbBsOpera7		= false;

var gbBsKonqueror3	= false;
var gbSafari3 		= false ;
var gbAIR			= (gstrBsAgent.indexOf('adobeair')!=-1);
var gbChrome 		= (gstrBsAgent.indexOf('chrome')!=-1);



gbBsIE = (navigator.appName.indexOf("Microsoft") != -1) && !gbBsOpera && !gbBsKonqueror && !gbBsSafari;;
if (gbBsIE)
{
	if (parseInt(navigator.appVersion) >= 4) {
		gbBsIE4 = true;
		if (gbBsIE4) {
			var nPos = gstrBsAgent.indexOf("msie");
			var strIEversion = gstrBsAgent.substring(nPos + 5);
			var nVersion =  parseFloat(strIEversion);
			if (nVersion >= 5)
				gbBsIE5 = true;
			if (nVersion >= 5.5)
			{
				if(nVersion >= 7)
					gbBsIE7 = true;
				gbBsIE55 = true;
			}
		}
	}
}
if (gbBsNS6)
{
	var nPos=gstrBsAgent.indexOf("gecko");
	if(nPos!=-1)
	{
		var nPos2=gstrBsAgent.indexOf("/", nPos);
		if(nPos2!=-1)
		{
			var nVersion=parseFloat(gstrBsAgent.substring(nPos2+1));
			if (nVersion>=20020823)
				gbBsNS7=true;
		}
	}	
}
if (gbBsOpera)
{
	var nPos = gstrBsAgent.indexOf("opera");
	if(nPos!=-1)
	{
		var nVersion = parseFloat(gstrBsAgent.substring(nPos+6));
		if (nVersion >= 6)
		{
			gbBsOpera6=true;
			if (nVersion >=7)
				gbBsOpera7=true;	
		}
	}
}
if (gbBsKonqueror)
{
	var nPos = gstrBsAgent.indexOf("konqueror");
	if(nPos!=-1)
	{
		var nVersion = parseFloat(gstrBsAgent.substring(nPos+10));
		if (nVersion >= 3)
		{
			gbBsKonqueror3=true;
		}
	}
}

if(gbBsSafari)
{
	var nPos = gstrBsAgent.indexOf("version/");
	if(nPos!=-1)
	{
		var nVersion = parseFloat(gstrBsAgent.substring(nPos+8,nPos+9));
		if (nVersion >= 3)
		{
			gbSafari3=true;
		}
	}
}

if(gbChrome)
{
	
	gbBsSafari 	= true ;
	gbSafari3	= true;
}

function insertAdjacentHTML(obj, where, htmlStr)
{
	if (gbBsIE || gbBsOpera7)
	{
		obj.insertAdjacentHTML(where, htmlStr);
	}
	else if (gbBsNS6 || gbBsSafari)
	{
		var r = obj.ownerDocument.createRange();
		r.setStartBefore(obj);
		var	parsedHTML = r.createContextualFragment(htmlStr);
		
		switch (where){
		case 'beforeBegin':
			obj.parentNode.insertBefore(parsedHTML,obj);
			break;
		case 'afterBegin':
			obj.insertBefore(parsedHTML,obj.firstChild);
			break;
		case 'beforeEnd':
			obj.appendChild(parsedHTML);
			break;
		case 'afterEnd':
			if (obj.nextSibling){
			obj.parentNode.insertBefore(parsedHTML,obj.nextSibling);
			} else {
			obj.parentNode.appendChild(parsedHTML);
			}
			break;
		}
	}
}


function setAttribute(obj, attr, val)
{
	if (gbBsIE)
	    obj.setAttribute(attr,val);
	else
	{
	    if (obj.setAttribute)
	        obj.setAttribute(attr,val);
	    else
	        obj.setProperty(attr,val,null);
	}       
};

function getAttribute(obj, attr)
{
   if (gbBsIE)
	    return obj.getAttribute(attr);
	else
	{
	    if ((obj.getAttribute)&&(obj.getAttribute(attr)))
	        return obj.getAttribute(attr);	  
	     else if ((obj.getPropertyValue)&&(obj.getPropertyValue(attr)))
	        return obj.getPropertyValue(attr) ;
	     else if ((obj.getPropertyCSSValue)&&(obj.getPropertyCSSValue(attr)))
	        return obj.getPropertyCSSValue(attr) ;
	     else
	        return null ;
	}          
};


function BsscHasExtJs()
{
	if( gbBsIE3Before || gbBsNS3Before)
		return false;
	return true;
}


var gBsOnLoads 			= new Array();	
var gBsOnClicks 		= new Array();	
var gBsOnUnLoads 		= new Array();	
var gBsOnMouseOvers 	= new Array();	
var gBsOnMouseOuts 		= new Array();	

var gbOrignalOnMouseDown = null;

function BsscRegisterOnLoad(funcHandler)
{
	var nLength = gBsOnLoads.length;
	gBsOnLoads[nLength] = funcHandler;
}

function BsscRegisterOnClick(funcHandler)
{
	var nLength = gBsOnClicks.length;
	gBsOnClicks[nLength] = funcHandler;
}

function BsscRegisterOnUnLoad(funcHandler)
{
	var nLength = gBsOnUnLoads.length;
	gBsOnUnLoads[nLength] = funcHandler;
}

function BsscRegisterOnMouseOver(funcHandler)
{
	var nLength = gBsOnMouseOvers.length;
	gBsOnMouseOvers[nLength] = funcHandler;
}

function BsscRegisterOnMouseOut(funcHandler)
{
	var nLength = gBsOnMouseOuts.length;
	gBsOnMouseOuts[nLength] = funcHandler;
}

function BsGeneralOnLoad()
{
	if (!gbBsIE4 && !gbBsNS4)
		return;

		
}


function BsReDo()
{
  if (innerWidth != origWidth || innerHeight != origHeight)
     location.reload();
}

function BSSCOnLoad(event)
{
	if( !BsscHasExtJs() )
		return;
	for (var nElement = gBsOnLoads.length - 1; nElement >= 0; nElement--)
		gBsOnLoads[nElement]();
}

function BSSCOnClick(event)
{
	if (!BsscHasExtJs()) return;
		
	for (var nElement = gBsOnClicks.length - 1; nElement >= 0; nElement--)
		gBsOnClicks[nElement]();
}

function BSSCOnUnload(event)
{
	if (!BsscHasExtJs()) return;
	for (var nElement = gBsOnUnLoads.length - 1; nElement >= 0; nElement--)
		gBsOnUnLoads[nElement]();
}

function BSSCOnMouseOver(event)
{
	if (!BsscHasExtJs()) return;
	for (var nElement = gBsOnMouseOvers.length - 1; nElement >= 0; nElement--)
		gBsOnMouseOvers[nElement]();
}

function BSSCOnMouseOut(event)
{
	if (!BsscHasExtJs()) return;
	for (var nElement = gBsOnMouseOuts.length - 1; nElement >= 0; nElement--)
	{
		gBsOnMouseOuts[nElement]();
	}
}

if (typeof(BsscRegisterOnLoad) != "undefined")
{
	BsscRegisterOnLoad(BsGeneralOnLoad);
}
if (gbBsNS4&&!gbBsNS6) {
	origWidth = innerWidth;
	origHeight = innerHeight;
	onresize = BsReDo;
}

function BsHHActivateComponents()
{
	if( HH_ActiveX && (HH_ChmFilename != "") && ((self == top) || (self == top.frames[0])))
	{
		var objBody = getElementsByTag(document,"BODY")[0];
		if( typeof(objBody) == "object" )
		{
			insertAdjacentHTML(objBody, "beforeEnd", '<OBJECT ID="HHComponentActivator" CLASSID="CLSID:399CB6C4-7312-11D2-B4D9-00105A0422DF" width=0 height=0></OBJECT>');
			if (HHComponentActivator.object)
				HHComponentActivator.Activate(HH_ChmFilename, HH_WindowName, HH_GlossaryFont, HH_Glossary, HH_Avenue);
		}
	}
}

function BsHHActivXOnLoad()
{	
	if( gbBsIE4 )
		BsHHActivateComponents(); 
}

if( typeof(BsscRegisterOnLoad) != "undefined" )
{
	BsscRegisterOnLoad(BsHHActivXOnLoad);
}

var gbPopupMenuTimeoutExpired = false;
var gbInPopupMenu = false;
var gbPopupMenuTopicList = null;
var gOlddocumentClick = null;



var g_bIsPopupMenuInit = false;
function _WritePopupMenuLayer()
{
	if (!g_bIsPopupMenuInit)
        {
	  if (gbBsNS4&&!gbBsNS6) {

	   	document.write("<DIV CLASS='WebHelpPopupMenu' ID='PopupMenu'></DIV>");
	  } else{
	  document.write("<DIV ID='PopupMenu' STYLE='position:absolute; left:0px; top:0px; z-index:4; visibility:hidden;'></DIV>");
	  if (!(gbBsNS4&&!gbBsNS6)) {
		document.write("<STYLE TYPE='text/css'>");
		if (gbBsMac&&gbBsIE4) {
			document.write(".PopupOver {font-family:'Arial'; color:white; background:navy; font-size:10pt; font-style:normal;font-weight:normal;text-decoration:none;}");
			document.write(".PopupNotOver {font-family:'Arial'; color:black; background:#c0c0c0; font-size:10pt; font-style:normal;font-weight:normal;text-decoration:none;}");
		} else {
			document.write(".PopupOver {font-family:'Arial'; color:white; background:navy; font-size:8pt; font-style:normal;font-weight:normal;text-decoration:none;}");
			document.write(".PopupNotOver {font-family:'Arial'; color:black; background:#c0c0c0; font-size:8pt; font-style:normal;font-weight:normal;text-decoration:none;}");
		}
		document.write("</STYLE>");
	   }
          }
	  g_bIsPopupMenuInit = true;
	}
}

 
function _SeekFrameByName( cRoot, strName )
{
	if( cRoot == null )	return null;
	if( cRoot.frames == null )	return null;
	if( cRoot.frames[strName] != null )	return cRoot.frames[strName];
	for (var i=0; i<cRoot.frames.length; i++)
	{
		var cObj = null;
		if (!gbBsNS6) 
			cObj = _SeekFrameByName( cRoot.frames(i).document, strName );
		else
			cObj = _SeekFrameByName( cRoot.frames[i], strName );
		if( cObj != null )		return cObj;
	};
	return null;
}
function _GetFrameByName( cRoot, strName )
{
	if( cRoot == null )	return null;
	var cRet = _SeekFrameByName(cRoot, strName);
	if( cRet != null )	return cRet;
	if (cRoot.parent != cRoot)
		return _GetFrameByName( cRoot.parent, strName );
	else
		return null;
}

var gfn_arguments = null;
function _PopupMenu_Invoke(fn_arguments)
{
	gfn_arguments = fn_arguments;
	if (gbBsOpera6&&gbBsMac)
	{
		var wndOldPopupLinks= window.open(document.location.href, "popuplinks");
		wndOldPopupLinks.close();
		setTimeout("_PopupMenu_Invoke_2();",100);
	}
	else
	{
		_PopupMenu_Invoke_2();
	}
}

function _PopupMenu_Invoke_2()
{
	var fn_arguments = gfn_arguments;
	gfn_arguments = null;
	
	
	var argLen = fn_arguments.length;
	if (argLen < 3) {
		return false;
	}

	
	var strTarget = "";
	var targetDoc = null;
	if (fn_arguments[1] == '') {
		if (BSSCPopup_IsPopup()) {
			targetDoc = parent;
			strTarget = "TARGET= _parent";
		}
		else
			targetDoc = window.document;
	} else {
		targetDoc = _GetFrameByName( parent, fn_arguments[1] );

		strTarget = "TARGET='" + fn_arguments[1] + "'";
	}

	if ((!gbBsIE4 && !gbBsNS4 && !gbBsOpera7 && !gbBsKonqueror3 &&!gbBsSafari) || ((gbBsMac) && (gbBsIE4) && (window.event.srcElement.tagName == "AREA"))) {
	
		var argLen 	= fn_arguments.length;

		
		var nHeight = argLen * 15;
		var nWidth = 400;
		var strParam = "titlebar=no,toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=auto";
		strParam += ",height=" + nHeight + ",width=200";
		strParam += ",resizable";

		var wndTemp=null;
		
		if (!gbBsOpera)
			wndTemp = window.open("", "temp", strParam);

		
		var wndPopupLinks=null;
		if (gbBsOpera&&gbBsMac)
		{
			wndTemp = window.open(document.location.href, "temp", strParam);
			wndPopupLinks= window.open(document.location.href, "popuplinks", strParam);
		}
		else
			wndPopupLinks= window.open("", "popuplinks", strParam);
		wndPopupLinks.document.open("text/html");

		
		if (wndTemp)
			wndTemp.close();

		var sHTML="<html><head>";
		sHTML += "<";
		sHTML += "/head>";
		sHTML+="<body onBlur=\'self.focus();\'>";
		var strParaLine = "";
		for (var i = 0; i < (argLen - 2) / 2; i++) {
			strParaLine = "";
			strParaLine += "<a href=\"javascript:";
			if (gbBsIE) {
				strParaLine += "onBlur=null; ";
			}
			strParaLine += "opener.location=\'";
			strParaLine += fn_arguments[2 * i + 3];
			strParaLine += "\';close();\"";
			strParaLine += strTarget;

			strParaLine += ">";
			strParaLine += fn_arguments[2 * i + 2];
			strParaLine += "</a>";
			strParaLine += "<br>";
			sHTML+=strParaLine;
		}
		sHTML+="</body></html>";
		wndPopupLinks.document.write(sHTML);
		wndPopupLinks.document.close();
		window.gbInPopupMenu = true;
		if (!gbBsIE) {
			wndPopupLinks.focus();
		}
		return false;
	}

	if (((argLen < 5) && ((isNaN(fn_arguments[2])) || (gbPopupMenuTopicList == null))) ||
		((argLen < 4) && ((!isNaN(fn_arguments[2])) && (gbPopupMenuTopicList != null)))) {
		
		var strURL = "";
		if (isNaN(fn_arguments[2]) ||  (gbPopupMenuTopicList == null)) {
			strURL = fn_arguments[3];
		}
		else 	{
			strURL = gbPopupMenuTopicList[fn_arguments[2]].strURL;
		}

		if (targetDoc != null) {
			targetDoc.location.href = strURL;
		}
		else {
			if (fn_arguments[1] != null && typeof(fn_arguments[1]) != "undefined")
				window.open(strURL, fn_arguments[1]);
			else
				window.open(strURL);
		}		
		window.gbInPopupMenu = true;
		return false;
	}
	
	var strMenu = "";
	if (gbBsNS4&&!gbBsNS6) {
		strMenu = '<TABLE BORDER="1" CELLSPACING=0 CELLPADDING=3 BGCOLOR="#c0c0c0">';
	} else {
		strMenu = '<TABLE STYLE="border:2px outset white;" CELLSPACING=0';
		if (gbBsMac) {
			strMenu += ' CELLPADDING=4';
		} else {
			strMenu += ' CELLPADDING=2';
		}	
		strMenu += ' BGCOLOR=#c0c0c0>';
	}
	
	var i = 2;
	while (i <= argLen - 1) {
		strMenu += '<TR><TD><NOBR>'
		
		if (isNaN(fn_arguments[i]) ||  (gbPopupMenuTopicList == null)) {
			strMenu += '<DIV STYLE="padding-left:3pt; padding-right:3pt;"><A HREF="' + fn_arguments[i + 1] + '"' + strTarget;
		} else {
			strMenu += '<DIV STYLE="padding-left:3pt; padding-right:3pt;"><A HREF="' + gbPopupMenuTopicList[fn_arguments[i]].strURL + '"' + strTarget;
		}
		strMenu += ' onclick="PopupMenu_HandleClick(event);"';
		strMenu += ' onmouseover="PopupMenu_Over(event);"';
		strMenu += ' onmouseout="PopupMenu_Out(event);"';
		strMenu += '>';
		if (isNaN(fn_arguments[i]) || (gbPopupMenuTopicList == null)) {
			strMenu += '<SPAN CLASS="PopupNotOver">' + fn_arguments[i] + '</SPAN>';
		} else {
			strMenu += '<SPAN CLASS="PopupNotOver">' + gbPopupMenuTopicList[fn_arguments[i]].strTitle + '</SPAN>';
		}
		strMenu += '</A></DIV></NOBR></TD></TR>';

		if (isNaN(fn_arguments[i]) || (gbPopupMenuTopicList == null)) {
			i += 2;
		} else {
			i += 1;
		}
	}
	strMenu += "</TABLE>";

	if (gbBsMac) {
	
		strMenu +="<TABLE></TABLE>";
	}

	var layerPopup = null;
	var stylePopup = null;
	var nEventX = 0;
	var nEventY = 0;
	var nWindowWidth = 0;
	if (gbBsIE4 || gbBsOpera7) {

		layerPopup = getElement("PopupMenu");
		layerPopup.innerHTML = strMenu;
		stylePopup = layerPopup.style;

		_BSPSGetClientSize();

		
		nEventX = window.event.clientX;
		nEventY = window.event.clientY;

		if (nEventY + layerPopup.scrollHeight + 10 < gBsClientHeight) {
		    nEventY += getScrollTop() + 10;
		} else {
		    nEventY = (getScrollTop() + gBsClientHeight) - layerPopup.scrollHeight - 20;
		}
		stylePopup.top = nEventY;
		
		var nPopupWidth = layerPopup.scrollWidth;
		if (gbBsMac) {
			nPopupWidth = 80; 
		}
		if (nEventX + nPopupWidth + 20 > gBsClientWidth) {
			if (gBsClientWidth - nPopupWidth < 5) {
				stylePopup.left = 5;
			} else {
				stylePopup.left = gBsClientWidth - nPopupWidth - 5;
			}
		} else {
			stylePopup.left = nEventX + getScrollLeft() + 20;
		}

		stylePopup.visibility = "visible";
		if (!gOlddocumentClick && document.onclick)
			gOlddocumentClick = document.onclick;
		document.onclick = PopupMenu_HandleClick;

	} else if (gbBsNS6 || gbBsKonqueror3||gbBsSafari) {
		layerPopup = getElement("PopupMenu");
		layerPopup.style.visibility = "hidden";
	
		if (gbBsNS6)
		{
			var e = fn_arguments[0];
			nEventX = e.pageX;
			nEventY = e.pageY;
		}
		else
		{
			nEventX = window.event.clientX;
			nEventY = window.event.clientY;
		}
		_BSPSGetClientSize();
		layerPopup.innerHTML = strMenu;

		if (nEventY + layerPopup.offsetHeight + 20  <  window.pageYOffset + gBsClientHeight) {
			nEventY += 20;
		} else {
			nEventY = gBsClientHeight + window.pageYOffset - layerPopup.offsetHeight - 20;
		}

		if (nEventX + layerPopup.offsetWidth + 20 > gBsClientWidth + window.pageXOffset) {
			if (gBsClientWidth + window.pageXOffset - layerPopup.offsetWidth < 20) {
				nEventX = 5;
			} else {
				nEventX = gBsClientWidth + window.pageXOffset - layerPopup.offsetWidth - 20;
			}
		} else {
			nEventX += 20;
		}
		if (gbBsNS6 || gbChrome)
			layerPopup.style.top = nEventY + "px";
		else
			layerPopup.style.top = nEventY;
		if (gbBsNS6 || gbChrome)
			layerPopup.style.left = nEventX + "px";
		else
			layerPopup.style.left = nEventX;
		
		layerPopup.innerHTML = strMenu;
		layerPopup.style.visibility = "visible";
		if (!gOlddocumentClick && document.onclick)
			gOlddocumentClick = document.onclick;
		window.onclick = PopupMenu_HandleClick;
	}
	else if (gbBsNS4) {
		layerPopup = document.layers.PopupMenu;
		layerPopup.visibility = "hide";
		stylePopup = layerPopup.document;
		stylePopup.write(strMenu);
		stylePopup.close();
		var e = fn_arguments[0];
		nEventX = e.pageX;
		nEventY = e.pageY;
		_BSPSGetClientSize();
		if (nEventY + layerPopup.clip.height + 20 < window.pageYOffset + gBsClientHeight) {
			nEventY += 20;
		} else {
			nEventY = gBsClientHeight + window.pageYOffset- layerPopup.clip.height - 20;
		}
		layerPopup.top = nEventY;

		if (nEventX + layerPopup.clip.width + 20 > gBsClientWidth + window.pageXOffset) {
			if (gBsClientWidth + window.pageXOffset - layerPopup.clip.width < 20) {
				nEventX = 5;
			} else {
				nEventX = gBsClientWidth + window.pageXOffset - layerPopup.clip.width - 20;
			}
		} else {
			nEventX += 20;
		}

		layerPopup.left = nEventX;

		layerPopup.visibility = "visible";

		window.captureEvents(Event.MOUSEDOWN);
		if (!gOlddocumentClick && document.onmousedown)
			gOlddocumentClick = document.onmousedown;
		window.onmousedown = PopupMenu_HandleClick;
	}

	window.gbInPopupMenu = true;
	window.gbPopupMenuTimeoutExpired = false;
	setTimeout("PopupMenu_Timeout();", 100);
	return false;
}

function PopupMenu_Timeout()
{
	window.gbPopupMenuTimeoutExpired = true;
}

function PopupMenu_Over(e)
{
    if (gbBsIE4||gbBsOpera7)
		e.srcElement.className = "PopupOver";
    else if (gbBsNS6)
		e.target.parentNode.className = "PopupOver";
	return;
}

function PopupMenu_Out(e)
{
    if (gbBsIE4||gbBsOpera7)
		e.srcElement.className = "PopupNotOver";
    else if (gbBsNS6)
		e.target.parentNode.className = "PopupNotOver";
	return;
}

function PopupMenu_HandleClick(e)
{
	if (window.gbPopupMenuTimeoutExpired) {
		window.gbInPopupMenu = false;
		if (gbBsNS4 && !gbBsNS6) {
			window.releaseEvents(Event.MOUSEDOWN);
		}

		var layerPopup = null;
		if (gbBsNS4&&!gbBsNS6) {
			layerPopup = document.layers.PopupMenu;
			layerPopup.visibility = "hide";
		} else {
			layerPopup = getElement("PopupMenu");
			layerPopup.style.visibility = "hidden";
		}
	
		if (gOlddocumentClick)
		{
			if (gbBsNS4 && !gbBsNS6)
				document.onmousedown = gOlddocumentClick;
			else
				document.onclick = gOlddocumentClick;
		}
	}
	return;
}

function BSSCPopup_ClickMac()
{
	if ((!DHTMLPopupSupport()) && (gbBsIE4 || gbBsOpera7))
	{	
		var bClickOnAnchor = false;
		var el;
		if ((window.event != null) &&
		    (window.event.srcElement != null))
		{
		    el = window.event.srcElement;
			while (el != null)
			{
				if ((el.tagName == "A") || (el.tagName == "AREA")) 	{
					bClickOnAnchor = true;
					break;
				}
				if (el.tagName == "BODY") {
					break;
				}
				el = getParentNode(el);
			}
		}
		if (BSSCPopup_IsPopup())
		{
			if (!bClickOnAnchor) {
				parent.window.gPopupWindow = null;
				self.close();
			}
		}
		else
		{
			bClosePopupWindow = true;
			if ((bClickOnAnchor) &&
				(el.href) &&
			    ((el.href.indexOf("javascript:BSSCPopup") != -1) || (el.href.indexOf("javascript:null") != -1) || (el.href.indexOf("javascript:void(0)") != -1)))
			{
				bClosePopupWindow = false;
			}
			if (bClosePopupWindow)
			{
				if (window.gPopupWindow != null && !window.gPopupWindow.closed )
				{
					window.gPopupWindow.close();
				}
			}
		}
	}
}

function BsPopupOnClick()
{
	if (!gbBsIE4 && !gbBsOpera7)
		return;

	BSSCPopup_ClickMac();
}

function _BSSCOnError(message)
{
	if(-1 != message.indexOf("denied") 
		|| -1 != message.indexOf("Object required"))
	 return true;
}


var gBsStyVisShow	= null;
var gBsStyVisHide	= null;
var gBsClientWidth	= 640;
var gBsClientHeight = 480;


var gBRateH_W		= 0.618; 
var gBMaxXOfParent	= 0.8; 
var gBMaxYOfParent	= 0.8;
var gBscrollHeight   = 16;
var gBscrollWidth   =  16;
var gBpermitXDelta	= 3;
var gBpermitYDelta	= 3;


var arrayPopupURL = new Array();
var arrayAbsPopupURL = new Array();
var arrayIntervalId = new Array();

var arrayDirty = new Array();

function getBRateH_W()
{
	return 0.618 ;
}

function getBscrollWidth()
{
	return 16 ;
}

function getBscrollHeight()
{
	return 16 ;
}

function getBMaxXOfParent()
{
	return 0.8 ;
}

function getBMaxYOfParent()
{
	return 0.8 ;
}

function setIntervalID(nIndex,id)
{
    arrayIntervalId[nIndex] = id;
}

function getIntervalID(nIndex)
{
	if (nIndex == -1 || arrayIntervalId.length <= nIndex) 
	    return -1;
	else
        return arrayIntervalId[nIndex];
}

function setAbsPopupURL(nIndex, strURL)
{
	arrayAbsPopupURL[nIndex] = strURL;
}

function getAbsPopupURL(nIndex)
{
	if (nIndex == -1 || arrayAbsPopupURL.length <= nIndex) return null;
	else 
		return arrayAbsPopupURL[nIndex];
}

function getPopupURL(nIndex)
{
	if (nIndex == -1 || arrayPopupURL.length <= nIndex) return null;
	else 
		return arrayPopupURL[nIndex];
}

function getPopupID(nIndex)
{
	return gstrPopupID + nIndex;
}

function getPopupShadowID(nIndex)
{
	return gstrPopupShadowID + nIndex;
}

function getPopupTopicID(nIndex)
{
	return gstrPopupTopicID + nIndex;
}

function getPopupIFrameID(nIndex)
{
	return gstrPopupIFrameID + nIndex;
}

function getPopupIFrameName(nIndex)
{
	return gstrPopupIFrameName + nIndex;
}


function getPopupTopicStyle(nIndex)
{
	return getElement(getPopupTopicID(nIndex)).style;
}

function getPopupShadowStyle(nIndex)
{
	return getElement(getPopupShadowID(nIndex)).style;
}

function getPopupIFrame(nIndex)
{
	if(gbAIR)
	{
		return window.frames[getPopupIFrameName(nIndex)];
	}
	else
	{
		if (gbBsNS6||gbSafari3)
			return eval("window.frames['" + getPopupIFrameName(nIndex) + "']");
		else
			return eval("document.frames['" + getPopupIFrameName(nIndex) + "']");
	}
}

function getPopupDivStyle(nIndex)
{
	return getElement(getPopupID(nIndex)).style;
}

function getPopupIFrameStyle(nIndex)
{
	return getElement(getPopupIFrameID(nIndex)).style;
}


function findDiv(strURL)
{
	for (var i = 0; i < arrayPopupURL.length; i ++ ) {
		if (arrayPopupURL[i] == strURL) {
			return i;
		}
	}
	return -1;
}

var gnToken = -1;
function takeToken()
{
	gnToken ++;
	if (gnToken > 10000) gnToken = 0;
	return gnToken;
}

function IsValidToken(nToken)
{
	return (gnToken == nToken);
}

function addDiv(strURL)
{
	for (var i = 0; i < arrayPopupURL.length; i ++) {
		if (arrayPopupURL[i] == null) {
			arrayPopupURL[i] = strURL;
			return i;
		}
	}	
	arrayPopupURL[i] = strURL;
	arrayDirty[i] = true;
	return i;
}

function setDirty()
{
	for (var i = 0; i < arrayPopupURL.length; i ++ )
		arrayDirty[i] = true;
}

function IsDirty(nIndex)
{
	if (nIndex == -1)
		return true;
	else 
		if (arrayDirty.length > nIndex) 
			return arrayDirty[nIndex];
		else
			return true;
}

function hideAll()
{
	for (var i = 0; i < arrayPopupURL.length; i ++ )
	{
		getPopupDivStyle(i).visibility = gBsStyVisHide;
		getPopupIFrameStyle(i).visibility = gBsStyVisHide;
		if(gbBsIE)
		    removeThis(document.all(getPopupID(i)));
	}
	if(gbBsIE)
		arrayPopupURL.length = 0;
}

function getCurrentPopupIFrame()
{
	for (var i = 0; i < arrayPopupURL.length; i ++)
		if (getPopupDivStyle(i).visibility == gBsStyVisShow)
			return getPopupIFrame(i);
	return null;
}

function setClear(nIndex)
{
	if (nIndex != -1)
		arrayDirty[nIndex] = false;
}

function _BSSCCreatePopupDiv(strURL)
{
	var nIndex = findDiv(strURL);
	if (nIndex == -1 ) {
		nIndex = addDiv(strURL);
		BsPopup_CreateDiv(nIndex);
	}
	else {
		if (IsDirty(nIndex)) {
			if("object" == typeof(getPopupIFrame(nIndex).document))
				getPopupIFrame(nIndex).document.location.href = strURL;
		}
	}
	return nIndex;
}


function _BSPSGetBrowserInfo()
{
	if (gbBsNS4&&!gbBsNS6)
	{
		gBsStyVisShow	= "show";
		gBsStyVisHide	= "hide";
	}
	else
	{
		gBsStyVisShow	= "visible";
		gBsStyVisHide	= "hidden";
	}
}

_BSPSGetBrowserInfo();


function _BSPSGetClientSize()
{
	if( typeof( window.innerWidth ) == 'number' )
	{
		gBsClientWidth	= innerWidth;
		gBsClientHeight = innerHeight;
	}
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
	{
		gBsClientWidth = document.documentElement.clientWidth;
		gBsClientHeight = document.documentElement.clientHeight;
	} 
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) 
	{
		gBsClientWidth = document.body.clientWidth;
		gBsClientHeight = document.body.clientHeight;
	}
}

var gstrPopupID = 'BSSCPopup';
var gstrPopupShadowID = 'BSSCPopupShadow';
var gstrPopupTopicID = 'BSSCPopupTopic';
var gstrPopupIFrameID = 'BSSCPopupIFrame';
var gstrPopupIFrameName = 'BSSCPopupIFrameName';

var gstrPopupSecondWindowName = 'BSSCPopup';

var gPopupWindow = null;
var gnPopupClickX = 0;
var gnPopupClickY = 0;

var gnPopupScreenClickX = 0;
var gnPopupScreenClickY = 0;

var gbPopupTimeoutExpired = false;

function DHTMLPopupSupport()
{
	if (((gbBsIE4) && (!gbBsMac))||gbBsOpera7|| gbBsNS7 || gbSafari3||gbAIR) {
		return true;
	}
	return false;
}

function BSSCPopup_IsPopup()
{
	if (DHTMLPopupSupport() && (this.name.indexOf(gstrPopupIFrameName) != -1)) {
		return true;
	} else if ((gbBsNS4 || gbBsIE4 || gbBsOpera7) && (this.name.indexOf(gstrPopupID) != -1)) {
		return true;
	} else {
		return false;
	}
}


if (BSSCPopup_IsPopup() && !gbBsIE4 && !gbBsOpera7) {
	document.write("<base target=\"bsscright\">");
}


function BsPopup_CreateDiv(nIndex)
{
	if(!DHTMLPopupSupport())
		return;
	
	var strPopupDiv = "<DIV ID='" + getPopupID(nIndex) + "' STYLE='position:absolute; top:-100; left:0; z-index:600; visibility:hidden;'>";
	strPopupDiv += "<DIV ID='" + getPopupShadowID(nIndex) + "' STYLE=\"position:absolute;top:0; left:0;  background-color:#C0C0C0;\"></DIV>";
	strPopupDiv += "<DIV ID='" + getPopupTopicID(nIndex) + "' STYLE=\"position:absolute;top:0; left:0;  background-color:#FFFFFF;border:1px #000000 outset;\">";
	strPopupDiv += "<IFRAME title=\"Popup Window\" ID='" + getPopupIFrameID(nIndex) + "' name='" + getPopupIFrameName(nIndex) + "' src = '" + getPopupURL(nIndex) + "' frameborder=0 scrolling=auto></IFRAME>";
	strPopupDiv += "</DIV></DIV>";

	var objBody = getElementsByTag(document, "BODY")[0];
	if( typeof(objBody) != "object" )
		return;

	insertAdjacentHTML(objBody, "beforeEnd", strPopupDiv);
}

function handleLoadNS()
{
	if (this.id)
	{
		var nIndex = parseInt(this.id.substring(gstrPopupIFrameID.length));
		BSSCPopup_PostWork(nIndex);
	}
}

function BSSCPopup_PostWork(nIndex)
{
	getPopupDivStyle(nIndex).visibility = gBsStyVisShow;
	getPopupIFrameStyle(nIndex).visibility =gBsStyVisShow;

	setClear(nIndex);
	window.gbPopupTimeoutExpired = true;

	BSSCPopup_ChangeTargettoParent(getPopupIFrame(nIndex).document);
	if (gbBsNS6)
		getPopupIFrame(nIndex).document.body.addEventListener("click",BSSCPopupClicked,false);
	else
		getPopupIFrame(nIndex).document.body.onclick = BSSCPopupClicked;

	if (!gbOrignalOnMouseDown && document.onmousedown)
		gbOrignalOnMouseDown = document.onmousedown;

	if (gbBsNS6)
		document.addEventListener("mousedown", BSSCPopupParentClicked,false);
	else
		document.onmousedown = BSSCPopupParentClicked;
}

function BSSCPopup_Timeout(nIndex, nToken)
{
    if (!IsValidToken(nToken)) return;

	if (gbBsNS6||((getPopupIFrame(nIndex).document.readyState == "complete") &&
		(getPopupIFrame(nIndex).document.body != null))) {
		BSSCPopup_PostWork(nIndex);
	} else {
		setTimeout("BSSCPopup_Timeout(" + nIndex + "," + nToken + ")", 100);
	}
}


function BSSCPopup_ChangeTargettoParent(tagsObject)
{
	var collA = getElementsByTag(tagsObject, "A");
	BSSCPopup_ChangeTargettoParent2(collA);

	var collIMG = getElementsByTag(tagsObject,"IMG");
	BSSCPopup_ChangeTargettoParent2(collIMG);
}

function BSSCPopup_ChangeTargettoParent2(colls)
{
	if (colls != null)  {
		for (var j = 0; j < colls.length; j ++ )
		{
			var strtemp = colls[j].href;
			if (strtemp)
			{
				strtemp = strtemp.toLowerCase();
				if (strtemp.indexOf("javascript:") == -1)
				if (colls[j].target == "")
					colls[j].target = "_parent";
			}
		}
	}
}

function BSPSPopupTopicWinHelp(strURL)
{
	_BSSCPopup(strURL);
	return;
}

function DelayBSSCPopup_AfterLoad(nIndex ,nToken ,cuswidth ,cusheight )
{
    var intervalID = getIntervalID(nIndex);
    if(intervalID!=-1)
        clearInterval(intervalID);
        
    BSSCPopup_AfterLoad(nIndex ,nToken ,cuswidth ,cusheight );
}

function _BSSCPopup(strURL, width, height)
{
	var cuswidth = 0;
	var cusheight = 0;
	if ("undefined" != typeof(width) && "undefined" != typeof(height)) {
		cuswidth = width;
		cusheight= height;
	}
	
	if (DHTMLPopupSupport()) {
		var nToken = takeToken(); 
		var nIndex = _BSSCCreatePopupDiv(strURL);
		window.gbPopupTimeoutExpired = false;
		var ntWidth = gBsClientWidth;
		var ntHeight = gBsClientHeight;
		_BSPSGetClientSize();
		if (ntWidth != gBsClientWidth || ntHeight != gBsClientHeight) {
			setDirty();
		}

		if (IsDirty(nIndex)) 
		{
			if(gbAIR)
			{
			    var tempappTimer = setInterval(function(){DelayBSSCPopup_AfterLoad(nIndex ,nToken ,cuswidth ,cusheight )}, 400);
			    setIntervalID(nIndex,tempappTimer);
			}
			else
			{
				if (gbBsMac) {
					setTimeout("BSSCPopup_AfterLoad(" + nIndex + "," + nToken + "," + cuswidth + "," + cusheight  +")", 400);
				} else {
					setTimeout("BSSCPopup_AfterLoad(" + nIndex + "," + nToken + "," + cuswidth + "," + cusheight + ")", 100);
				}
			}
		}
		else {
			MoveDivAndShow(nIndex ,nToken, cuswidth, cusheight);
		}
	} else {
		_BSSCPopup2(strURL, cuswidth, cusheight);
	}
	return;
}

if (gbBsIE55)
{
	var ehlpdhtm_fOldBefureUnload = window.onbeforeunload;
	var gnBsUnload=0;
	window.onbeforeunload = window_BUnload;
}
	
function window_BUnload()
{
	gnBsUnload++;
	if (gnBsUnload>1)
		return;
	for (var i = 0; i < arrayPopupURL.length; i ++)
		removeThis(document.all(getPopupID(i)));
	arrayPopupURL.length = 0;	
	if (ehlpdhtm_fOldBefureUnload)
		ehlpdhtm_fOldBefureUnload();
}

function _BSSCPopup2(strURL, width, height)
{
	if (gbBsOpera6&&gbBsMac)
	{
		var wmTemp = window.open(document.location.href, gstrPopupSecondWindowName);
		wmTemp.close();
		setTimeout("_BSSCPopup3(\""+strURL+"\","+width+","+height+");",100);
	}
	else
		_BSSCPopup3(strURL, width, height);
}
		
function _BSSCPopup3(strURL, width, height)
{
	if (window.name == gstrPopupSecondWindowName) {
		window.location = strURL;
	} else {
		if (!gbBsMac || !gbBsNS4) {
			BSSCHidePopupWindow();
		}
		var nX = 0;
		var nY = 0;
		var nHeight = 300;
		var nWidth = 400;
		if (width > 0 && height > 0) {
			nHeight = height;
			nWidth = width;
		}
		_BSPSGetClientSize();

		nX = window.gnPopupScreenClickX;
		nY = window.gnPopupScreenClickY;

		if (nY + nHeight + 40 > screen.availHeight) {
			nY = screen.availHeight - nHeight - 40;
		}
		if (nX + nWidth + 40 > screen.availWidth) {
			nX = screen.availWidth - nWidth - 40;
		}

		
		var strParam="titlebar=no,toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=yes";
		if (gbBsNS) {
			if (gbBsNS6) {
				strParam += ",Height=" + nHeight + "px,Width=" + nWidth+"px";
				strParam += ",screenX=" + nX + ",screenY=" + nY;
				strParam += ",dependent=yes";
			}
			else {
				strParam += ",OuterHeight=" + nHeight + ",OuterWidth=" + nWidth;
				strParam += ",screenX=" + nX + ",screenY=" + nY;
				strParam += ",dependent=yes";
			}
		}
		else {
			strParam += ",height=" + nHeight + ",width=" + nWidth;
			strParam += ",left=" + nX + ",top=" + nY;
		}
		if (gbBsSafari)
		{
			if (window.gPopupWindow)
				window.gPopupWindow.close();		
			window.gPopupWindow = window.open(strURL, "", strParam);
			window.gPopupWindow.name = gstrPopupSecondWindowName;
			window.gPopupWindow.moveTo(nX, nY);
			window.gPopupWindow.document.location.reload();
		}	
		else
		{
			var wmTemp=null;
			if (gbBsKonqueror3)
			{
				if (window.gPopupWindow)
					window.gPopupWindow.close();
			}
			if (gbBsOpera&&gbBsMac)
			{
				wmTemp= window.open(document.location.href, "Temp", strParam);
			}
			window.gPopupWindow = window.open(strURL, gstrPopupSecondWindowName, strParam);
			if (!gbBsIE)
				window.gPopupWindow.focus();
				
			if (wmTemp)
				wmTemp.close();
		}

		if (gbBsNS4)
			setEventHandle();
		else if (gbBsIE4 || gbBsOpera7||gbBsKonqueror3)
			setTimeout("setPopupFocus();", 100);
	}
	return;
}

function setEventHandle()
{
	window.gPopupWindow.captureEvents(Event.CLICK | Event.BLUR);
	window.gPopupWindow.onclick = NonIEPopup_HandleClick;
	window.gPopupWindow.onblur = NonIEPopup_HandleBlur;
}

function setPopupFocus()
{
	window.gPopupWindow.focus();
}

function NonIEPopup_HandleBlur(e)
{
	window.gPopupWindow.focus();
}

function NonIEPopup_HandleClick(e)
{
	
	document.routeEvent(e);

	
	if (window.gPopupWindow.gbInPopupMenu) {
		window.gPopupWindow.captureEvents(Event.CLICK);
		window.gPopupWindow.onclick = NonIEPopup_HandleClick;
		return false;
	}

	
	if(e.target.href)
	{
		if(e.target.href.indexOf("javascript:")==-1) 
		{
			if (e.target.target=="")
				window.location.href = e.target.href;
			else
				window.open(e.target.href, e.target.target);
			this.close();
		}
	} 
	else
		this.close();
	return false;
}

function BSSCPopup_AfterLoad(nIndex, nToken, cuswidth, cusheight)
{	
	if (!window.getPopupIFrame(nIndex).document) {
		_BSSCPopup2(getPopupURL(nIndex), cuswidth, cusheight);
		return;
	}
	
    if (!IsValidToken(nToken)) return;

	if (gbSafari3||gbAIR)
	{
		setAbsPopupURL(nIndex, window.getPopupIFrame(nIndex).document.location.href); 
		BSSCPopup_ResizeAfterLoad(nIndex, nToken, cuswidth, cusheight);
		return;
	}
	
	if (gbBsNS6)
	{
		setAbsPopupURL(nIndex, window.getPopupIFrame(nIndex).document.location.href); 
		setTimeout("BSSCPopup_ResizeAfterLoad(" + nIndex + "," + nToken + "," + cuswidth + "," + cusheight + ")", 200);
		return;
	}
	
	if ((window.getPopupIFrame(nIndex).document.readyState == "complete") &&
		(window.getPopupIFrame(nIndex).document.body != null)) {
			if (window.getPopupIFrame(nIndex).document.location.href.indexOf("about:blank") != -1) { 
				window.getPopupIFrame(nIndex).document.location = getPopupURL(nIndex);
				setTimeout("BSSCPopup_AfterLoad(" + nIndex + "," + nToken + "," + cuswidth + "," + cusheight + ")", 200);
			}
			else
				{
					setAbsPopupURL(nIndex, window.getPopupIFrame(nIndex).document.location.href); 
					BSSCPopup_ResizeAfterLoad(nIndex, nToken, cuswidth, cusheight);
				}
	} else {
		setTimeout("BSSCPopup_AfterLoad(" + nIndex + "," + nToken + "," + cuswidth + "," + cusheight + ")", 200);
	}
}

function BSSCPopup_ResizeAfterLoad(nIndex, nToken, cuswidth, cusheight)
{
	if (window.gbPopupTimeoutExpired) return;

    if (!IsValidToken(nToken)) return;

	getPopupDivStyle(nIndex).visibility = gBsStyVisHide;
	getPopupIFrameStyle(nIndex).visibility = gBsStyVisHide;
	if(gbBsIE)
	{
	    
	    getPopupIFrameStyle(nIndex).visibility = gBsStyVisShow;
		getPopupDivStyle(nIndex).visibility = gBsStyVisShow;
	}

	_BSPSGetClientSize();

	var size = new BSSCSize(0, 0);

	if (cuswidth <= 0 || cusheight <= 0)
		BSSCGetContentSize(window.getPopupIFrame(nIndex), size);
	else {
		size.x = cuswidth;
		size.y = cusheight;
	}

	
	var nWidth = size.x;
	var nHeight = size.y;

	
	
	if (nWidth < 0 || nHeight < 0) return; 	
	
	
	nWidth = nWidth + 22;
	nHeight = nHeight + 30;
	
	getPopupDivStyle(nIndex).width = nWidth+ "px" ;
	getPopupDivStyle(nIndex).height = nHeight+ "px" ;
	
	getPopupShadowStyle(nIndex).width = nWidth + "px" ;
	getPopupShadowStyle(nIndex).height = nHeight + "px" ;
	
	
    getPopupTopicStyle(nIndex).width = nWidth + "px" ;
	getPopupTopicStyle(nIndex).height = nHeight + "px" ;
	
	getPopupIFrameStyle(nIndex).width = nWidth + "px" ;
	getPopupIFrameStyle(nIndex).height = nHeight + "px" ;
		
	if (gbBsIE55 || gbBsNS6 || gbSafari3||gbAIR)
	{
		getPopupIFrameStyle(nIndex).top = 0;
		getPopupIFrameStyle(nIndex).left = 0;
	}
	
	var strURL = getPopupURL(nIndex);
	if (strURL.indexOf("#") != -1&&gbBsNS6)
		getPopupIFrame(nIndex).location.reload();
	else if (strURL.indexOf("#") != -1||gbBsNS6)
		getPopupIFrame(nIndex).location.href = strURL;  
		
	MoveDivAndShow(nIndex, nToken, cuswidth, cusheight);
}

function getScrollLeft()
{
	if( typeof( window.pageXOffset) == 'number' ) 
		return window.pageXOffset ;
	else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) 
		return document.body.scrollLeft ;
	else if( document.documentElement && document.documentElement.scrollLeft  ) 
		return document.documentElement.scrollLeft;
	else
		return 0 ;	
}

function getScrollTop()
{
	if( typeof( window.pageYOffset) == 'number' ) 
		return window.pageYOffset ;
	else if( document.body && document.body.scrollTop ) 
		return document.body.scrollTop ;
	else if( document.documentElement && document.documentElement.scrollTop  ) 
		return document.documentElement.scrollTop;
	else
		return 0 ;	
}


function MoveDivAndShow(nIndex, nToken, cuswidth, cusheight)
{
	if (window.getPopupIFrame(nIndex).document.location.href != getAbsPopupURL(nIndex)) { 
			window.getPopupIFrame(nIndex).document.location = getPopupURL(nIndex);
			if(gbAIR)
			{
				BSSCPopup_AfterLoad(nIndex ,nToken ,cuswidth ,cusheight );
			}
			else
				setTimeout("BSSCPopup_AfterLoad(" + nIndex + "," + nToken + "," + cuswidth + "," + cusheight + ")", 200);
			return;
	}

	
	var nClickX = window.gnPopupClickX;
	var nClickY = window.gnPopupClickY;
	var nTop = 0;
	var nLeft = 0;
	
	var nWidth = parseInt(getPopupDivStyle(nIndex).width);
	var nHeight = parseInt(getPopupDivStyle(nIndex).height);
	
	if (nClickY + nHeight + 20 < gBsClientHeight + getScrollTop()) {
		nTop = nClickY + 10;
	} else {
		nTop = (getScrollTop() + gBsClientHeight) - nHeight - 20;
	}
	if (nClickX + nWidth < gBsClientWidth + getScrollLeft()) {
		nLeft = nClickX;
	} else {
		nLeft = (getScrollLeft() + gBsClientWidth) - nWidth - 8;
	}

	if(!gbBsIE55)
	{
		if (nTop < getScrollTop()) nTop  = getScrollTop() + nTop;
		if (nLeft< getScrollLeft())  nLeft = getScrollLeft() + nLeft;
	}
    
   	if (isNaN(nLeft))
		getPopupDivStyle(nIndex).left = nClickX + "px";	
	else
		getPopupDivStyle(nIndex).left = nLeft+ "px";	
	
	if (isNaN(nTop))
		getPopupDivStyle(nIndex).top = nClickY  + "px";
	else
		getPopupDivStyle(nIndex).top = nTop + "px";

	
	getPopupShadowStyle(nIndex).left = 6 + "px";
	getPopupShadowStyle(nIndex).top = 6 + "px";
	if (gbBsIE55)
	{
		getPopupShadowStyle(nIndex).left = 4;
		getPopupShadowStyle(nIndex).top = 4;
	}
	
	if (gbBsMac&&gbBsIE4) {
		
		getPopupIFrameStyle(nIndex).pixelLeft = 100;
		getPopupIFrameStyle(nIndex).pixelLeft = 0;
		
		getPopupIFrame(nIndex).window.BSSCOnLoad();
	}

	if (gbBsNS6&&IsDirty(nIndex))
		getElement(getPopupIFrameID(nIndex)).addEventListener("load", handleLoadNS, false);
	else
		BSSCPopup_Timeout(nIndex , nToken );
	return;
}

function	BSSCSize(x, y)
{
	this.x = x;
	this.y = y;
}

function BSSCGetContentSize(thisWindow, size)
{
	if (!gbBsIE4 && !gbBsOpera7 && !gbBsNS4 && !gbSafari3 && !gbAIR)
		return;


	if ((gbBsMac&&gbBsIE4)||gbBsOpera7) {
		size.x = 320;
		size.y = 180;
		return;
	}

	
	
	
	

	var ClientRate = gBsClientHeight / gBsClientWidth;

	
	var GoldenSize = new BSSCSize(0,0);
	GoldenSize.x = gBsClientWidth * getBMaxXOfParent();
	GoldenSize.y = gBsClientHeight *getBMaxYOfParent() ;

	if (ClientRate > gBRateH_W) {
		GoldenSize.y = GoldenSize.x * gBRateH_W;
	}
	else {
		GoldenSize.x = GoldenSize.y / gBRateH_W;
	}

	
	var x = 0;
	var maxgoldx = GoldenSize.x;
	var maxx = gBsClientWidth * getBMaxXOfParent();
	
	var miny = getScrollHeight(thisWindow) + getBscrollHeight();
	
	if (miny > GoldenSize.y) 
	{
		if(gbBsIE55)
		{
			thisWindow.resizeTo(maxx , getScrollHeight(thisWindow) + getBscrollHeight());
		}
		
		miny = 	getScrollHeight(thisWindow) + getBscrollHeight();
		maxy = gBsClientHeight * getBMaxYOfParent();
		
		if (miny > maxy) { 
			miny = maxy;
			size.x = maxx;
			size.y = maxy;
			thisWindow.document.body.scroll = 'yes'; 
		}
		else { 
			size.y = miny;
			
			
			x = maxx;
			deltax = -maxx/2;
			while (true) {
				x = x + deltax;
				diffy = getScrollHeight(thisWindow) + getBscrollHeight() - x * ClientRate;
				if (diffy >  gBpermitYDelta ) 
					deltax = Math.abs(deltax) /2;
				else if (diffy <  -gBpermitYDelta) 
					deltax = -Math.abs(deltax) /2;
				else 
					
					break;
				if (Math.abs(deltax) < gBpermitXDelta) 
					break;
			}
			size.x = getScrollWidth(thisWindow); 
			size.y = getScrollHeight(thisWindow);
			thisWindow.document.body.scroll = 'no';
		}
	}
	else {
		if (getScrollWidth(thisWindow) > maxgoldx) {
			size.x = maxx; 
			size.y = miny;	
			thisWindow.document.body.scroll = 'yes';
		}
		else {
			
			x = maxgoldx;
			deltax = -maxgoldx/2;
			while (true) {
				x = x + deltax;
				diffy = getScrollHeight(thisWindow) + getBscrollHeight() - x * getBRateH_W();
				if (diffy >  gBpermitYDelta ) 
					deltax = Math.abs(deltax) /2;
				else if (diffy <  -gBpermitYDelta) 
					deltax = -Math.abs(deltax) /2;
				else 
					
					break;
				if (Math.abs(deltax) < gBpermitXDelta) 
					break;
			}
			size.x = getScrollWidth(thisWindow);
			size.y = getScrollHeight(thisWindow) ;
			thisWindow.document.body.scroll = 'no'; 
			if (getScrollWidth(thisWindow) > size.x)
			{
				size.x = getScrollWidth(thisWindow);
			}
			if (getScrollHeight(thisWindow) > size.y)
			{
				size.y = getScrollHeight(thisWindow);
			}
		}
	}
	if (gbBsNS6)
		size.y = size.y + 20 ;	
	return;
}

function getScrollWidth(thisWindow)
{
   var w =  thisWindow.document.body.scrollWidth ? thisWindow.document.body.scrollWidth : thisWindow.window.pageXOffset  ; 
   return w ? w : 0;
} 

function getScrollHeight(thisWindow)
{
   var h = thisWindow.document.body.scrollHeight ? thisWindow.document.body.scrollHeight : thisWindow.window.pageYOffset  ; 
   return h ? h : 0;
}


function BSSCPopupParentClicked()
{
	if (!window.gbPopupTimeoutExpired) {
		return false;
	}
	
	document.onmousedown = gbOrignalOnMouseDown;

	
	hideAll();

	window.gbPopupTimeoutExpired = false;

	return true;
}

function isInsideHyperLink(obj)
{
	if (obj&&obj!=getParentNode(obj))
	{
		if (obj.tagName=="A"||obj.tagName=="IMG")
			return true;
		else
			return isInsideHyperLink(getParentNode(obj));
	}
	else
		return false;
}

function BSSCPopupClicked(e)
{
	if (!window.gbPopupTimeoutExpired) {
		return false;
	}

	var popupIFrame = getCurrentPopupIFrame();
	if (popupIFrame == null) {
		return true;
	}

	if (gbBsIE4 && (!((popupIFrame.window.event != null) &&
		(popupIFrame.window.event.srcElement != null) &&
		isInsideHyperLink(popupIFrame.window.event.srcElement)))) {
		document.onmousedown = gbOrignalOnMouseDown;
		
		
		hideAll();
		window.gbPopupTimeoutExpired = false;
		return true;
	}
	else if (!gbAIR && gbBsNS6 && (!((e != null) &&
			(e.target!= null) && isInsideHyperLink(e.target))))
	{
	    document.removeEventListener("mousedown", BSSCPopupParentClicked,false);
	    if(gbOrignalOnMouseDown)
		    document.addEventListener("mousedown", gbOrignalOnMouseDown,false);
		
		hideAll();
		window.gbPopupTimeoutExpired = false;
		return true;		
	}
}


function  BSPSPopupOnMouseOver(event)
{
	if (gbBsIE4 || gbBsOpera7||gbBsKonqueror3) {
		window.gnPopupClickX = event.clientX + getScrollLeft();
		window.gnPopupClickY = event.clientY + getScrollTop();
		window.gnPopupScreenClickX = event.screenX;
		window.gnPopupScreenClickY = event.screenY;
	} else if (gbBsSafari) {
		window.gnPopupClickX = event.clientX + getScrollLeft();
		window.gnPopupClickY = event.clientY + getScrollTop();
		window.gnPopupScreenClickX = event.screenX + window.screenX;
		window.gnPopupScreenClickY = event.screenY + window.screenY;
	} else if (gbBsNS4) {
		window.gnPopupClickX = event.pageX - window.pageXOffset;
		window.gnPopupClickY = event.pageY - window.pageYOffset;
		window.gnPopupScreenClickX = event.screenX - window.pageXOffset;
		window.gnPopupScreenClickY = event.screenY - window.pageYOffset;
	}
}

function BSSCHidePopupWindow()
{
	if (window.gPopupWindow != null) {
		if (gbBsNS4) {
			if ((typeof window.gPopupWindow != "undefined") && (!window.gPopupWindow.closed)) {
				window.gPopupWindow.close();
				window.gPopupWindow = null;
			}
		}
	}
	return;
}


if (typeof(BsscRegisterOnClick) != "undefined")
{
	BsscRegisterOnClick(BsPopupOnClick);
}






function BSSCCreatePopupDiv()
{
	return;
}

function WritePopupMenuLayer()
{
	if (BsscHasExtJs()) {_WritePopupMenuLayer();}
}

function BSSCPopup(strURL, width, height)
{
	var re = new RegExp("'", 'g');
	strURL = strURL.replace(re, "%27");

	if (BsscHasExtJs())	{ 
		_BSSCPopup(strURL, width, height);
	}else{
		
		var wndTemp = null;
		if (!gbBsNS3) {
			wndTemp = window.open("", "temp", "titlebar=no,toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=yes,height=3,width=4");
		}
		
		var wndPopup = window.open(strURL, "BSSCPopup", "titlebar=no,toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=yes,height=300,width=400");
		
		if (!gbBsNS3) {
			wndTemp.close();
		} else {
			wndPopup.focus();
		}
	}
}

var gbWndTemp = null, gbWndPopupLinks = null;
var gbstrParaTotal = "";

function PopupMenu_Invoke()
{
	if (typeof(wfRelatedTopic) == 'function' && typeof(IsFlashSupported) == 'function')
	{
		if (Number(gsSkinVersion) > 2 && IsFlashSupported())
		{
			return wfRelatedTopic(PopupMenu_Invoke.arguments);
		}
	}
	if (BsscHasExtJs()) {
		return _PopupMenu_Invoke(PopupMenu_Invoke.arguments);
	}
	if (gbBsNS3Before || gbBsIE3Before )	{
		var argLen 	= PopupMenu_Invoke.arguments.length;
		if (argLen < 5) {
			window.document.location.href = PopupMenu_Invoke.arguments[3];
			return false;
		}
		gbWndTemp = null;
		gbWndPopupLinks = null;
		gbstrParaTotal = "";
		for (var i = 0; i < (argLen - 2) / 2; i++) {
			var strParaLine = "";
			if (gbBsNS2){
				strParaLine += "<a href=\"";
				strParaLine += PopupMenu_Invoke.arguments[2 * i + 3];
				strParaLine += "\">"
				strParaLine += PopupMenu_Invoke.arguments[2 * i + 2];
				strParaLine += "</a>";
			} else {
				strParaLine += "<a href=\"javascript:";
				strParaLine += "gotoUrl(\'";
				strParaLine += PopupMenu_Invoke.arguments[2 * i + 3];
				strParaLine += "\');\"";
				if (PopupMenu_Invoke.arguments[1] != '') {
					strParaLine += " TARGET='" + PopupMenu_Invoke.arguments[1] + "'";
				}
				strParaLine += ">";
				strParaLine += PopupMenu_Invoke.arguments[2 * i + 2];
				strParaLine += "</a>";
			}
			strParaLine += "<br>";
			gbstrParaTotal += strParaLine;
		}
		var nHeight = argLen * 15;
		var nWidth = 400;
		var strParam = "titlebar=no,toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=auto";
		strParam += ",height=" + nHeight + ",width=200,resizable";
		
		
		if (!gbBsNS3) {
			gbWndTemp = window.open("", "temp", "titlebar=no,toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=yes,height=3,width=4");
		} 
		gbWndPopupLinks = window.open("", "popuplinks", strParam);

		setTimeout("Wait_PopupMenuReady()", 100);
	}
	return true;
}

function Wait_PopupMenuReady() 
{
	if (gbWndPopupLinks != null && "object" == typeof(gbWndPopupLinks.document)) {
		PopupMenu_InvokeReady();
	}
	else 
		setTimeout("Wait_PopupMenuReady()", 100);
}

function PopupMenu_InvokeReady()
{
	if (gbWndPopupLinks != null) {
		gbWndPopupLinks.document.open("text/html");
		gbWndPopupLinks.document.write("<html><head>");
		if (gbBsNS2) {
			gbWndPopupLinks.document.write("<base href=\"" + location +"\">");
		} else {
			
			gbWndPopupLinks.document.write("<");
			gbWndPopupLinks.document.write("script>");
			gbWndPopupLinks.document.write("function gotoUrl(aUrl) {opener.window.location=aUrl; close();}");
			gbWndPopupLinks.document.write("<");
			gbWndPopupLinks.document.write("/script>");
		}
		gbWndPopupLinks.document.write("<");
		gbWndPopupLinks.document.write("/head>");
		gbWndPopupLinks.document.write("<body onBlur=\'self.focus();\'>");
		gbWndPopupLinks.document.write(gbstrParaTotal);
		gbWndPopupLinks.document.write("</body></html>");
		gbWndPopupLinks.document.close();

		
		if (!gbBsNS3 && gbWndTemp != null) {
			gbWndTemp.close();
		}else {
			gbWndPopupLinks.focus();
		}

		return true;
	}
	return false;
}









function IsParagraph(el)
{
	return( el.tagName == "P" || el.tagName.indexOf("H") == 0 ) ? true : false;
}


function kadovIsParagraph(el)
{
	return IsParagraph(el);
}


function InitEachChild(el)
{	
	for(var i=0; i<getChildNodes(el).length; i++)
	{
		var child = getChildNodes(el)[i];
		if( child.tagName == "SCRIPT" || child.tagName == "!" )
			continue;

		if( child.id != "" )
		{
			
			if (gbBsIE4&&!gbBsMac)
			{
				var onLoadEffect = getAttribute(child.style, "x-on-pageload" );
				if( (onLoadEffect != null) && (onLoadEffect > "") )
					setAttribute(child.style, "x-on-pageload", "" );
			}
			
			var href = getAttribute(child,"href");
			if( href != null && href > "" && href.indexOf( "BSSCPopup" ) >= 0 )
				FilePopupInit(child.id); 
			else if( child.className == "dropspot" || child.className == "expandspot" || 
					 child.className == "glossterm" )
				TextPopupInit(child.id);
			else if( child.className == "trigger")
				InitTrigger(child.id);
			else
			{
				InitEffects(child.id);
				CEngine.SetOneTargetInitialState( child.id );
			}
		}
		
		if( (child.tagName == "IMG") && (getAttribute(child,"dynsrc") > "") )
			child.start = "mouseover";

		InitEachChild(child);
	}
}

function kadovInitEachChild(el)
{	
	InitEachChild(el);
}

function RetrieveTextInner(el)
{	
	var x = "";
	if( (!el) || (el.tagName == "!") || (el.tagName == "SCRIPT" ))
		return x;

	if( IsParagraph(el) )
	{
		var strNewID = " ";
		if( el.id != "" )
			strNewID += "id=" + el.id + "_NewSpan ";
		x = "<span" + strNewID + "style='" + el.style.cssText + "'>" + el.innerHTML + "</span>";
	}
	else
	{
		for(var i=0; i<getChildNodes(el).length; i++)
			x += RetrieveTextInner( getChildNodes(el)[i] );
	}
	return x;
}

function kadovRetrieveTextInner(el)
{
	return 	RetrieveTextInner(el);
}

function RetrieveCleanHTML( strRawHTML, strTagOpen, strTagClose, nDistance )
{	
	var nTagOpen = strRawHTML.indexOf( strTagOpen, 0 );
	if( nTagOpen < 0 )
		return strRawHTML;

	var nTagClose = strRawHTML.indexOf( strTagClose, nTagOpen);
	if( nTagClose < nTagOpen )
		return strRawHTML;
		
	if( typeof(nDistance) == "number" && nDistance > 0 )
		if( (nTagClose - nTagOpen) != nDistance )
			return strRawHTML;
		
	var strCleanOnce = strRawHTML.substring(0, nTagOpen) + strRawHTML.substr(nTagClose + strTagClose.length) ;
	return 	RetrieveCleanHTML( strCleanOnce, strTagOpen, strTagClose );
}

function kadovRetrieveCleanHTML( strRawHTML, strTagOpen, strTagClose, nDistance )
{	
	return RetrieveCleanHTML( strRawHTML, strTagOpen, strTagClose, nDistance );
}	

function AdjustObjectTag(strRawHTML, nStartPos)
{
	
	
	var strDTCTagOpen = '<!--Metadata type="DesignerControl" startspan';
	var strDTCTagClose = '<!--Metadata type="DesignerControl" endspan-->';
	var nDTCTagOpen = strRawHTML.indexOf( strDTCTagOpen, nStartPos );
	if( nDTCTagOpen < 0 )
		return strRawHTML;
	var nDTCTagClose = strRawHTML.indexOf( strDTCTagClose, nDTCTagOpen );
	if( nDTCTagClose < nDTCTagOpen)
		return strRawHTML; 
		
	
	var strRTObjTagOpen = 'classid=clsid:ADB880A6-D8FF-11CF-9377-00AA003B7A11';
	var strRTObjTagClose = '</OBJECT>';
	var nRTObjTagOpen = strRawHTML.indexOf( strRTObjTagOpen, nDTCTagOpen );
	if( nRTObjTagOpen < nDTCTagOpen )
		return strRawHTML;
	var nRTObjTagClose = strRawHTML.indexOf( strRTObjTagClose, nRTObjTagOpen );
	if( nRTObjTagClose < nRTObjTagOpen )
		return strRawHTML; 
		
	
	var strRTObjLabel = '<PARAM NAME=\"Command\" VALUE=\"Related Topics';
	if( strRawHTML.indexOf(strRTObjLabel, nRTObjTagOpen) < 0 )
		return strRawHTML;
	
	
	var strRTItemsOpen = '<param name="Items" value="';
	var strRTItemsClose = '$$**$$" >';
	var strRTItemsClose2 = '$$**$$">';

	var nRTItemsOpen = strRawHTML.indexOf(strRTItemsOpen, nDTCTagOpen);
	if( nRTItemsOpen < nDTCTagOpen )
		return strRawHTML;
	var nRTItemsClose = strRawHTML.indexOf(strRTItemsClose, nRTItemsOpen);
	if (nRTItemsClose == -1)
		nRTItemsClose = strRawHTML.indexOf(strRTItemsClose2, nRTItemsOpen);
	if( nRTItemsClose < nRTItemsOpen )
		return strRawHTML;
		
	
	var strItems = strRawHTML.substring( nRTItemsOpen + strRTItemsOpen.length, nRTItemsClose);
	if( strItems.length < 1 )
		return strRawHTML;
	
	
	var strItemsArray = strItems.split('$$**$$');
	if( strItemsArray.length < 1 )
		return strRawHTML;
	var strRunTimeItemParam = "";
	for( var i = 0; i < strItemsArray.length; i++ )
	{
		strRunTimeItemParam += '<PARAM  NAME="Item' + (i+1);
		strRunTimeItemParam += '"' + '  VALUE="';
		strRunTimeItemParam += strItemsArray[i];
		strRunTimeItemParam += '">';
	}
	
	
	var strAdjustedHTML = strRawHTML.substring(0,nRTObjTagClose) + strRunTimeItemParam + strRawHTML.substring(nRTObjTagClose, strRawHTML.length);
	return AdjustObjectTag(strAdjustedHTML, nDTCTagClose + strDTCTagClose.length);
}

function kadovAdjustObjectTag(strRawHTML, nStartPos)
{
 return AdjustObjectTag(strRawHTML, nStartPos);
}

function TextPopupOnLoad( el )
{
	if( typeof(el) == "string" )
		el = getElement(el);
	var src = null;
	if(el.id)
	{
		for (var i=0;i<gPopupData.length;i++)
			if (gPopupData[i].el==el.id)
			{
				src=gPopupData[i].popupId;
				break;
			}
	}
	if (!src)	
		return 0;

	var name = src;
	if( src.substr(0,1) == "#" ) 
		name = src.substr(1, src.length-1);
	var srcDiv = getElement(name);
	if( !srcDiv )
		return 1;

	return 0;
}
function kadovTextPopupOnLoad( el )
{
	return TextPopupOnLoad( el );
}
function getElementsByTag(obj,sTagName)
{
	if(obj.getElementsByTagName)
		return obj.getElementsByTagName(sTagName);
	else if(obj.all)
		return obj.all.tags(sTagName);
	return null;
}

function getElement(sID)
{
	if(document.getElementById)
		return document.getElementById(sID);
	else if(document.all)
		return document.all(sID);
	return null;
}

function getParentNode(obj)
{
	if(obj.parentNode)
		return obj.parentNode;
	else if(obj.parentElement)
		return obj.parentElement;
	return null;
}

function getChildNodes(obj)
{
	if(obj.childNodes)
	{
		var children = new Array();
		for (var i = 0; i < obj.childNodes.length; i++)
		{
			if (obj.childNodes[i].nodeType == 1)
				children[children.length] = obj.childNodes[i];
		}
		return children;
	}
	else if(obj.children)
		return obj.children;
	return null;	
}

function removeThis(obj)
{
	if(obj.parentNode)
		obj.parentNode.removeChild(obj);
	else
		obj.outerHTML="";
}

function TextPopup( el )
{
	if (!gbBsIE4 && !gbBsOpera7 && !gbBsSafari && !gbBsNS6 && !gbBsKonqueror3 )
		return;
	
	if (window.event)
		window.event.cancelBubble = true;

	if( typeof(el) == "string" )
		el = getElement(el);

	if (!el||el==window)
		return;

	for(var i=0; i<getChildNodes(el).length; i++)
	{
		var child = getChildNodes(el)[i];
		if( child && (child.tagName == "IMG") )
		{
			if(child.className == "TwistyImage")
			{
				if( child.style && (child.style.display == "") )
					child.style.display = "none";
				else if(child.style)
					child.style.display = "";
			}
		}

		if( child && (child.tagName == "SPAN") )
		{
			if(child.className == "MTText")
			{
				if( child.style && (child.style.display == "") )
					child.style.display = "none";
				else if(child.style)
					child.style.display = "";
			}
		}
	}
	
	var src = null;	
	if(!src&&el.id)
	{
		for (var i=0;i<gPopupData.length;i++)
			if (gPopupData[i].el==el.id)
			{
				src=gPopupData[i].popupId;
				break;
			}
	}
	if(!src)
		return;
		
	var name = src;
	if( src.substr(0,1) == "#" ) 
	name = src.substr(1, src.length-1);

	var srcDiv = getElement(name);
	if( !srcDiv )
		return;

	if( srcDiv )
	{
		if( srcDiv.style.display == "" )
			srcDiv.style.display = "none";
		else
		{
			if(srcDiv.className == "expandtext")
			{
				var inner = RetrieveTextInner(srcDiv);
				if( inner == "" )
					inner = srcDiv.innerHTML;
				if(inner.indexOf("&nbsp;") != 0 && inner.indexOf(" ") != 0)
				{
					inner = "&nbsp;" + inner;
					srcDiv.innerHTML = inner;
				}
			}

			srcDiv.style.display = "";
		}
	}
	if(gbBsIE4)
		event.returnValue=false;
	return;
}

function kadovTextPopup( el )
{
	TextPopup( el );
}

function FindParentParagraph( el )
{
	if( typeof(el) == "string" )
		el = getElement(el);
	if( (!el) || el.tagName == "BODY" )
		return null;
	if( IsParagraph(getParentNode(el)) )
		return getParentNode(el);
	else
		return FindParentParagraph( getParentNode(el) );
}

function kadovFindParentParagraph( el )
{
	return FindParentParagraph( el );
}


function RegisterEventHandler( obj, strEvent, strEventHandler )
{
	CCSSP.RegisterEventHandler( obj, strEvent, strEventHandler );
}

function kadovRegisterEventHandler( obj, strEvent, strEventHandler )
{
 RegisterEventHandler( obj, strEvent, strEventHandler );
}


function textPopupData(el, popupId)
{
	this.el = el;
	this.popupId = "#"+popupId;
}

var gPopupData = new Array();

function TextPopupInit( el, popupId)
{
	if (!gbBsIE4 && !gbBsOpera7 && !gbBsSafari && !gbBsNS6 && !gbBsKonqueror3)
		return;
		
	if( typeof(el) == "string" )
	{
		if (popupId)
		{
			gPopupData[gPopupData.length]=new textPopupData(el, popupId);
		}
		el = getElement(el);
	}
		
	if( el != null )
	{
		CCSSP.RegisterEventHandler( el, "onclick", "TextPopup(\"" + el.id +"\");" );
		CCSSP.RegisterEventHandler( window, "onload", "TextPopupOnLoad(\"" + el.id +"\");" );
	}
}

function kadovTextPopupInit( el, popupId)
{
	return TextPopupInit( el, popupId);
}





function InitTriggersInHead( )
{
  if( Object.xDelayedInitElements )
  {
     var x = Object.xDelayedInitElements;
     for(i=0; i<x.length; i++)
     	InitTrigger( x[i] );
  }
}

function kadovInitTriggersInHead( )
{
	InitTriggersInHead( );
}


function FilePopupInit( el )
{
	if( typeof(el) == "string" )
		el = getElement(el);

	if( el != null )
		CCSSP.RegisterEventHandler( el, "onmouseover", "BSPSPopupOnMouseOver(event);" );
}
function kadovFilePopupInit( el )
{
	FilePopupInit( el );
}

function InitTrigger( element, a_targets )
{
	var srcElement = element;
	if( typeof(srcElement) == "string" )
	{
		srcElement = getElement(element,0);
		if(srcElement == null)
			return;
	}
	
	
	var targets = null;
	if(typeof(a_targets) != "undefined")
		targets = a_targets;
	if(!targets)
		targets = getAttribute(srcElement, "x-targets" );
	if (!targets)
		targets = getAttribute(srcElement.style,"x-targets");
	if (!targets)
		return;	
	var arrOneTarget = targets.split( "," );
	for( var i = 0; i < arrOneTarget.length; i ++ )
		bsscFXInit( element, arrOneTarget[i], null, null, null, null );
}

function kadovInitTrigger( element )
{
	InitTrigger( element )
}

function IsParentVisible( el )
{
	if( typeof(el) == "string" )
		el = getElement(el);
	if( (!el) || el.tagName == "BODY" )
		return true;
	if( el.style.display == 'none' ) 
		return false;
	else
		return IsParentVisible( getParentNode(el) );
}

function kadovIsParentVisible( el )
{
	return IsParentVisible( el );
}
function InitEffects( element, effectsList )
{
	var srcElement = element;
	if( typeof(srcElement) == "string" )
	{
		srcElement = getElement(element,0);
		if(srcElement == null)
			return;
	}
	
	if(effectsList)
	{
		var str = effectsList;
		var nStart = 0;
		var indx = str.indexOf(":", nStart);
		var effect = null;
		var value = null;
		while(nStart >= 0 && indx > 0 && indx < str.length)
		{
			effect = effectsList.substr(nStart, indx-nStart);
			var indx2 = str.indexOf(";", nStart);
			if(indx2 == -1)
				indx2 = str.length;
			value = effectsList.substr(indx+1, indx2);
			if(effect && value)
			    setAttribute(srcElement,effect, value);
			nStart = effectsList.indexOf("x-on", indx2+1);
			indx = str.indexOf(":", nStart);
		}
		
	}
	
	InitEffect( srcElement, "x-on-hover" );
	InitEffect( srcElement, "x-on-pageclick" );
	InitEffect( srcElement, "x-on-pageload" );
	InitEffect( srcElement, "x-on-trigger-1" );
	InitEffect( srcElement, "x-on-trigger-2" );
}

function kadovInitEffects( element )
{
	InitEffects( element );
}


function InitEffect( element, prop )
{
	var values = null;
	if( getAttribute(element,prop))		
		values = getAttribute(element, prop );	
	else if( getAttribute( element, "currentStyle" )  && element.currentStyle.getAttribute)
		values = element.currentStyle.getAttribute( prop );
	else  if (element.style.getAttribute)
		values = element.style.getAttribute( prop );
		
	if( !values )
		return;
    
	var functions = new Array();
	var nIdx = 0, nStart = 0;
	var nNext = values.indexOf( "\)", 0);
	while( nNext >= 0 && nNext < values.length )
	{
		functions[nIdx] = values.substr( nStart, nNext-nStart+1);
		nStart = nNext + 1;
		nIdx++;
		nNext = values.indexOf( "\)", nStart);
	}
		
	for( var i=0; i<functions.length; i++)
	{
		var id = getAttribute(element, "id" );
		var translatedProp = TranslateProp(prop);

		var lp = functions[i].indexOf( "(" );
		var fnname = functions[i].substring(0, lp);
		var srcargs = functions[i].substring(lp+1, functions[i].length-1);
		
		var nClickTimes = 1;
		var arrForClickCount = srcargs.split( "," );
		for( var j = 0; j < arrForClickCount.length; j++ )
		{
			var nPageClick = arrForClickCount[j].indexOf("clicks");
			if( nPageClick >= 0 )
			{
				nPageClick = arrForClickCount[j].indexOf("=");
				if( nPageClick > 0 )
				{
					nClickTimes = arrForClickCount[j].substring( nPageClick + 1, arrForClickCount[j].length) * 1;
					break;
				}
			}
		}
		var args = srcargs;
		if( j < arrForClickCount.length )
		{
			args = "";
			for( var k = 0; k < arrForClickCount.length; k ++ )
			{
				if( k != j )
				{
					args += arrForClickCount[k];
					if( k < arrForClickCount.length - 1 )
						args += ",";
				}
			}
		}
		bsscFXInit( null, id, translatedProp, fnname, args, nClickTimes );
	}
}

function kadovInitEffect( element, prop )
{
	InitEffect( element, prop );
}

function TranslateProp( prop )
{
	switch( prop )
	{
	case "x-on-hover" :     return "bsschover";
	case "x-on-pageclick" : return "bsscpageclick";
	case "x-on-pageload" :  return "bsscpageload";
	case "x-on-trigger-1" : return "bssctrigger1";
	case "x-on-trigger-2" : return "bssctrigger2";
	}
	return null;
}

function kadovTranslateProp( prop )
{
	return TranslateProp( prop );
}




function bsscFXInit( trigger_ID, target_ID, event_type, 
	action_type, action_setting, event_addional )
{
		
	if( typeof(event_type) == "string" )
		event_type = event_type.toLowerCase();
	if( typeof(action_type) == "string" )
		action_type = action_type.toLowerCase();
	if( typeof(action_setting) == "string" )
		 action_setting = action_setting.toLowerCase();
	
	
	var eleTarget = CCSSP.GetObject( target_ID );
	if( (eleTarget != null) && (event_type != null) && (action_type != null) )
	{
		
		CEngine.AddOneTarget( target_ID, eleTarget );
		CEngine.BuildTargetObject(target_ID, event_type, action_type, action_setting, event_addional);
	}
	
	
	if( typeof(trigger_ID) == "string" && trigger_ID != "" )
		CEngine.BuildTriggerObject( trigger_ID, target_ID );
}	







function CCSSP(){} 

CCSSP.GetObject = function( obj )
{
	if( typeof(obj) == "object" )
		return obj;
	else if( typeof(obj) == "string" && obj != "")
	{
		if (gbBsNS6)
		    return getElement(obj);	
		else if( gbBsNS4 )
			return eval("document." + obj);
		else
			return eval("document.all(\"" + obj + "\")");
	}
	else
		return null;
}

CCSSP.MoveObjectTo = function(obj, x, y)
{
	if( gbBsNS4 && !gbBsNS6) 
		obj.moveTo(x,y);
	else
	{
		if (x == '')
	        x = 0 ;
	    if (y == '')
	        y = 0 ;
	    obj.style.left = parseInt(x) + 'px';
	    obj.style.top = parseInt(y) + 'px'; 
	}
}

CCSSP.SetTimer = function(obj, timeout)
{
	if( obj.timer == null )
	{
		if(gbAIR)
		{
			obj.timer = setInterval(function(){CEngine.PerformAnimation( obj.aniIndex)}, timeout );
		}
		else
			obj.timer = setInterval("CEngine.PerformAnimation(" + obj.aniIndex + ")", timeout );
	}
}


CCSSP.MoveObjectBy = function(obj, dx, dy)
{
	if (gbBsNS6)
	{
	    var left = parseInt(obj.style.left);
	    obj.style.setProperty('left',(left + dx ) + 'px',0) ;
	    var top =  parseInt(obj.style.top);
	    obj.style.setProperty('top' , (top + dy) + 'px' ,0);
	}
	else if( gbBsNS4 )
		obj.moveBy(dx,dy);
	else
	{
		obj.style.pixelLeft += dx;
		obj.style.pixelTop += dy;
	}
}

CCSSP.SetObjectBGColor = function(obj, color)
{
	if  (gbBsNS6)
	    obj.style.setProperty( "background-color" , color , 0);
	else if( gbBsNS4 )
		obj.bgColor = color;
	else
		obj.style.backgroundColor = color;
}

CCSSP.ShowObject = function(obj, bShow)
{
	if (gbBsNS6)
	    obj.style.setProperty('visibility', (bShow == true) ? 'visible' : 'hidden',null);
	else if( gbBsNS4 )
		obj.visibility = (bShow == true) ? 'show' : 'hide';
	else
		obj.style.visibility = (bShow == true) ? 'visible' : 'hidden';
}

CCSSP.GetObjectLeft = function(obj)
{
	if (gbBsNS6)
	    return obj.style.left ;
	else if( gbBsNS4 )
		return obj.left;
	else
		return obj.style.pixelLeft;
}

CCSSP.GetObjectTop = function(obj)
{
	if (gbBsNS6)
	    return obj.style.top ;
	else if( gbBsNS4 )
		return obj.top;
	else
		return obj.style.pixelTop;
}

CCSSP.GetObjectContainLeft = function(obj)
{
	if( typeof(obj.pageX) != 'undefined')
		return obj.pageX;
	else if( typeof(obj.clientLeft) != 'undefined' )
		return obj.clientLeft;
	else
	    return obj.offsetLeft;	
}

CCSSP.GetObjectWindowLeft = function(obj)
{
	if( gbBsNS4 && !gbBsNS6)
		return obj.pageX;
	else
	{
		var nOffsetWindowLeft = 0;
		for(var element = obj; element; element = element.offsetParent)
			nOffsetWindowLeft += CCSSP.GetObjectContainLeft(element);
		return nOffsetWindowLeft;
	}
}

CCSSP.GetObjectContainTop = function(obj)
{
	if( typeof(obj.pageY) != 'undefined')
		return obj.pageY;
	else if( typeof(obj.clientTop) != 'undefined' && obj == document.body)
		return obj.clientTop;
	else
		return obj.offsetTop;	
}

CCSSP.GetObjectWindowTop = function(obj)
{
	if( gbBsNS4 && !gbBsNS6)
		return obj.pageY;
	else
	{
		var nOffsetWindowTop = 0;
		for(var element = obj; element; element = element.offsetParent)
			nOffsetWindowTop += CCSSP.GetObjectContainTop(element);
		return nOffsetWindowTop;
	}
}

CCSSP.GetObjectHeight = function(obj)
{
	if( gbBsNS4 && !gbBsNS6)
		return obj.clip.height;
	else
		return obj.offsetHeight;
}

CCSSP.GetObjectWidth = function(obj)
{
	if( gbBsNS4 && !gbBsNS6)
		return obj.clip.width;
	else
		return obj.offsetWidth;
}

CCSSP.RegisterEventHandler = function( srcObj, rawEventName, funcHandler )
{ 
	if (gbBsNS4 && !gbBsNS6)
		return ;
		
	var oldHandler = "";

	if (gbBsMac &&gbBsIE4&&!gbBsIE5)
	{
		if (typeof(srcObj[rawEventName.toLowerCase()])=="unknown")
		{ 
			for( var i = 0; i < document.scripts.length; i++ ) 
			{
				var script = document.scripts[i];
				if( (script.htmlFor == srcObj.id || script.htmlFor == srcObj ) && script.event == rawEventName )
				{
					oldHandler = script.innerHTML;
					break;
				}
			}
		}
	}
	else
	{
		var oldInlineHandler = srcObj[rawEventName.toLowerCase()];
		if( oldInlineHandler != null && typeof(oldInlineHandler) != "undefined")
		{
			var functionDefinition = oldInlineHandler.toString();
			var bodyStart = functionDefinition.indexOf( "{" );
			var bodyEnd = functionDefinition.lastIndexOf( "}" );
			if( bodyStart > 0 || bodyEnd > bodyStart )
				oldHandler = functionDefinition.substr( bodyStart + 1, bodyEnd - bodyStart - 2 );
		}
		else if( gbBsIE4 )
		{ 
			for( var i = 0; i < document.scripts.length; i++ ) 
			{
				var script = document.scripts[i];
				if( (script.htmlFor == srcObj.id || script.htmlFor == srcObj ) && script.event == rawEventName )
				{
					oldHandler = script.innerHTML;
					break;
				}
			}
		}
	}
	if( oldHandler.indexOf(funcHandler) >= 0 )
		return;

	if( gbBsNS4 ) 
	{
		var noOn = rawEventName.substring(2, rawEventName.length);
		if( typeof(noOn) == "string" && noOn.length > 3 ) {
			if (srcObj.captureEvents)
				srcObj.captureEvents( Event[noOn.toUpperCase()] );
		}
	}
	
	var newHandler = oldHandler;
	if( newHandler.length == 0 )
		newHandler = funcHandler;
	else
		newHandler += "; " + funcHandler;	
	if ((gbBsNS6)&&(srcObj.addEventListener))
	    srcObj.addEventListener( noOn.toLowerCase(), new Function("event", newHandler ),false);
	else
	    srcObj[rawEventName.toLowerCase()] = new Function( newHandler );	
}

CCSSP.GetWindowHeight = function()
{
	if( gbBsNS4 )
		return window.innerHeight;
	else
		return document.body.clientHeight;
}

CCSSP.GetWindowBottom = function()
{
	if( gbBsNS4 )
		return window.outerHeight + window.pageYOffset;
	else
		return document.body.clientHeight + getScrollTop();
}

CCSSP.GetWindowWidth = function()
{
	if( gbBsNS4 )
		return window.innerWidth;
	else
		return document.body.clientWidth;
}

CCSSP.GetWindowRight = function()
{
	if( gbBsNS4 )
		return window.outerWidth + window.pageXOffset;
	else
		return document.body.clientWidth + getScrollLeft();
}

CCSSP.TrimString = function( objString, subtrim )
{
	if( typeof(subtrim) != "string" || subtrim == null )
		return objString;
	var strHead = objString.substring(0, 1);
	var strRear = objString.substring(objString.length-1, objString.length);
	if( strHead != subtrim && strRear != subtrim )
		return objString;
	
	var spacePos = objString.indexOf(subtrim);
	if( spacePos < 0 )
		return objString;
	else if( spacePos == objString.length - 1 )
		return objString.substring(0, spacePos);
	else
	{
		var newString = objString.substring( spacePos + 1, objString.length);
		return CCSSP.TrimString( newString, subtrim );
	}
}

CCSSP.TrimSpace = function( objString )
{
	var Trim1 = CCSSP.TrimString( objString, " ");
	if( typeof(Trim1) != "string" || Trim1 == null )
	    return Trim1;
	var strHead = Trim1.substring(0, 1);
	if(strHead == "\"")
	    return CCSSP.TrimString( Trim1, "\"");
	return CCSSP.TrimString( Trim1, "\'");
}

CCSSP.GetEventElement = function( navEventObject )
{
	if(gbBsNS4) 
		return navEventObject.target;
	else
		return event.srcElement;
}

CCSSP.PrepareFilter = function( Obj )
{
	Obj.style.filter = "";
	if(Obj.style.position == "absolute" )
		return;
	if(gbBsIE7)
	{
		if( Obj.style.zoom != "")
			return;
		Obj.style.zoom = 1;
	}
	else
	{
		if(Obj.style.width != "" || Obj.style.height != "")
			return;
		Obj.style.height = CCSSP.GetObjectHeight(Obj);
	}
}

CCSSP.IsDescendant = function( progenitor, progeny )
{
	if( typeof(progeny) == "undefined" || progeny == null )
		return false;
	else if( progeny == progenitor )
		return true; 
	else if( progeny.id == progenitor.id ) 
		return true; 
	else if( getParentNode(progeny) == getParentNode(progenitor))
		return false;
	else
		return CCSSP.IsDescendant( progenitor, getParentNode(progeny));
}

CCSSP.IsTextTag = function( Obj )
{
	if( typeof( Obj.tagName ) == "undefined" )
		return false;
	return( Obj.tagName.indexOf("H") == 0 || Obj.tagName == "P" || 
			Obj.tagName == "FONT" || Obj.tagName == "SPAN" );
}








function CTrigger( TriggerElement )
{
	
	this.eleTrigger = TriggerElement;
	
	
	this.nCounter = 0; 
	
	
	
	this.objStrTarget = new Object();
	this.eleTrigger.style.cursor = "pointer";
	if( this.eleTrigger.tagName == "AREA" && getAttribute(this.eleTrigger,"href") == "" )
		setAttribute(this.eleTrigger , "href", "#"); 
}

CTrigger.prototype.AddTargetID = function( strTargetID )
{
	if( typeof(strTargetID) != "string" )
		return ;
	if( typeof(this.objStrTarget[strTargetID]) != "string" )
		this.objStrTarget[strTargetID] = strTargetID;
}

CTrigger.prototype.OnTriggerClick = function(event)
{
	var strEventType = ( (this.nCounter++)% 2 == 0 ) ? 
		"bssctrigger1" : "bssctrigger2";
		
	
	for( var strTargetID in this.objStrTarget ) 
		CEngine.SendEventToOneTarget( strTargetID, strEventType ,event);
}



function CTarget( TargetElement )
{
	
	this.eleTarget = TargetElement;
	this.objManager = new Object(); 
} 

CTarget.nPageClickCounter = 0;

CTarget.prototype.GetAgencyObject = function(str_action_type,action_setting )
{
	switch( str_action_type )
	{
	case "show":return new CAgencyShow( this.eleTarget, true ) ;
	case "hide":return new CAgencyShow( this.eleTarget, false ) ;

    case "flyin" : 
    	return new CAgencyFly(this.eleTarget, action_setting, true);
    case "flyout" : 
    	return new CAgencyFly(this.eleTarget, action_setting, false);
    case "spiralin" : 
    	return new CAgencySpiral(this.eleTarget, action_setting, true);
    case "spiralout" : 
    	return new CAgencySpiral(this.eleTarget, action_setting, false);
    case "zoomin" :
    	return new CAgencyZoom(this.eleTarget, action_setting, true);
    case "zoomout" : 
    	return new CAgencyZoom(this.eleTarget, action_setting, false);
    case "elastic" : 
		return new CAgencyElastic(this.eleTarget, action_setting);
		
    case "fadein" : 
    	return new CAgencyAlpha(this.eleTarget, action_setting, true) ;
    case "fadeout" :
    	return new CAgencyAlpha(this.eleTarget, action_setting, false) ;
    case "rockrollstatic" :
    case "rockroll" :
    	return  new CAgencyWave(this.eleTarget, action_setting, false) ;
 
    case "glow":
    	return  new CAgencyGlow(this.eleTarget,action_setting);
    case "dropshadow":
    	return new CAgencyDropShadow(this.eleTarget,action_setting);
    case "transition" :
    	return new CAgencyRevealTrans(this.eleTarget,action_setting) ;
    case "blur" :
    	return  new CAgencyBlur(this.eleTarget,action_setting) ;

    case "fliph" : 
    case "flipv" :
    case "invert":
    case "gray" :
    	return new CAgencyChangeFilter(this.eleTarget, str_action_type) ;
    
    case "fontchange": 
    	return new CAgencyFontChange(this.eleTarget,action_setting) ;
    case "boderchange": 
    case "stylechange":
    	return new CAgencyChangeStyle(this.eleTarget,action_setting);

	default: return null;
	}
}

CTarget.prototype.SetEventManager = function( 
	one_event_type,str_action_type,action_setting,event_additional)
{
	if( typeof( one_event_type ) != "string" ||	
		typeof( str_action_type ) != "string"||
		typeof( action_setting ) != "string" )
		return false;
	if( typeof(this.objManager[one_event_type]) == "undefined" )
	{
		this.objManager[one_event_type] = new Object();
		this.objManager[one_event_type].length = 0;
	}
	
	var eventAgency = this.GetAgencyObject(str_action_type,action_setting);
	if( eventAgency != null )
	{
		var ct = this.objManager[one_event_type].length ++;
		this.objManager[one_event_type][ct] = eventAgency;
		
		if( one_event_type == "bsscpageclick" )
		{
			if( typeof(event_additional) == "number" )
				this.objManager[one_event_type][ct].nPageClick = event_additional;
			else 
				this.objManager[one_event_type][ct].nPageClick = 1;
			
			if( (typeof(this.objManager.nMinPageClickIndex) == "undefined") ||
			    (this.objManager[one_event_type][ct].nPageClick < 
					this.objManager[one_event_type][this.objManager.nMinPageClickIndex].nPageClick) )
				this.objManager.nMinPageClickIndex = ct;
		}
		
		
		if( ((one_event_type == "bsscpageclick") && 
			 (this.objManager[one_event_type][ct].nPageClick == 1)) ||
			one_event_type == "bsscpageload" ||
			one_event_type == "bssctrigger1" )
			CCSSP.ShowObject( this.eleTarget, false );
		
		if( one_event_type == "bssctrigger1" || one_event_type == "bssctrigger2" )
			if( typeof( this.strTriggerEvent ) == "undefined" )
				this.strTriggerEvent = ( one_event_type == "bssctrigger1" ) ? "bssctrigger2" : "bssctrigger1";
			
		return true;
	}
	return false;
}

CTarget.prototype.OnEvent = function( strBsscEvent,event )
{
	if( typeof(this.objManager[strBsscEvent]) == "object" )
	{ 
		var eventAgency = this.objManager[strBsscEvent];
		for( var i = 0; i < eventAgency.length; i++ )
		{
			if( strBsscEvent == "bsscpageclick" && 
			 	eventAgency[i].nPageClick != CTarget.nPageClickCounter )
				 continue;
			else if( strBsscEvent == "bsschover" && event.type == "mouseout" )
				eventAgency[i].EndEffect();
			else 
				eventAgency[i].UpdateEffect(); 
		}
	}
}

CTarget.prototype.SetState = function( strBsscEvent )
{
	if( typeof(this.objManager[strBsscEvent]) != "object" )
		return false;

	
	var eventAgency = this.objManager[strBsscEvent];
	
	if( strBsscEvent == "bsscpageclick" )
	{
		if (this.objManager.nMinPageClickIndex == 'undefined')
		    this.objManager.nMinPageClickIndex = 0 ;
		eventAgency[this.objManager.nMinPageClickIndex].PrepareEffect();
		return true;
	}
	else
	{
		for( var i = 0; i < eventAgency.length; i++ )
			eventAgency[i].PrepareEffect(); 
		if( i > 0 )
			return true;
		else
			return false;
	}
}



function CEngine(){}


CEngine.objTrigger = new Object();

CEngine.objTarget = new Object(); 


CEngine.arrAnimation = new Array();
CEngine.PerformAnimation = function( nIndex )
{
	CEngine.arrAnimation[nIndex].UpdateEffect();
}

CEngine.AddOneTrigger = function(TriggerID,TriggerElement)
{
	if( typeof(TriggerID) != "string" || TriggerElement == null ||
	    typeof(TriggerElement) != "object" )
		return;
	if( typeof(CEngine.objTrigger[TriggerID] ) != "object" )
		CEngine.objTrigger[TriggerID] = new CTrigger(TriggerElement);
}
	
CEngine.AddOneTarget = function(TargetID, TargetElement)
{
	if( typeof(TargetID) != "string" || TargetElement == null ||
		typeof(TargetElement) != "object" )
		return;
	if( typeof(CEngine.objTarget[TargetID]) != "object" )
		CEngine.objTarget[TargetID] = new CTarget( TargetElement );	
}

CEngine.SendEventToOneTarget = function(strTargetID, strBsscEvent,event )
{
	if( typeof(CEngine.objTarget[strTargetID]) == "object" ) 
	{
		if( strBsscEvent == "bssctrigger1" || strBsscEvent == "bssctrigger2" )
		{
			if( strBsscEvent == CEngine.objTarget[strTargetID].strTriggerEvent )
				strBsscEvent = (strBsscEvent == "bssctrigger1") ? "bssctrigger2" : "bssctrigger1";
			CEngine.objTarget[strTargetID].strTriggerEvent = strBsscEvent;
		}
		CEngine.objTarget[strTargetID].OnEvent( strBsscEvent,event );
	}
}

CEngine.SendEventToAllTarget = function( strBsscEvent,event )
{ 
	for( var strTargetID in CEngine.objTarget ) 
		CEngine.SendEventToOneTarget( strTargetID, strBsscEvent,event );
}

CEngine.SetOneTargetInitialState = function( strTargetID )
{
	if( typeof(CEngine.objTarget[strTargetID]) == "object" ) 
	{
		var objTarget = CEngine.objTarget[strTargetID];
		if( objTarget.SetState( "bsscpageload" ) == false )
		{
			objTarget.SetState( "bsscpageclick" );
			objTarget.SetState( "bssctrigger1" );
		}
	}
}

CEngine.AdjustPageClickCounter = function()
{
	var nAdjustedClickCounter = CTarget.nPageClickCounter;
	var bAdjusted = false;
	for( var strTargetID in CEngine.objTarget ) 
	{
		var objEventPageClick = CEngine.objTarget[strTargetID].objManager.bsscpageclick;
		if( objEventPageClick != null )
		{
			for( var i = 0; i < objEventPageClick.length; i++ )
			{
				var nOtherPageClick = objEventPageClick[i].nPageClick;
				if( nOtherPageClick == CTarget.nPageClickCounter )
					return;
				if( nOtherPageClick > CTarget.nPageClickCounter )
				{
					if( !bAdjusted )
					{
						nAdjustedClickCounter = nOtherPageClick;
						bAdjusted = true;
					}
					else if( nOtherPageClick < nAdjustedClickCounter )
						nAdjustedClickCounter = nOtherPageClick;
				}
			}
		}
	}
	CTarget.nPageClickCounter = nAdjustedClickCounter;
}

CEngine.OnPageLoad = function(event)
{ 	
	
	for( var strTargetID in CEngine.objTarget )
		CEngine.SetOneTargetInitialState( strTargetID );
	
	
	CEngine.SendEventToAllTarget( "bsscpageload",event );
}

CEngine.OnPageClick = function(event)
{ 
   	var src = CCSSP.GetEventElement( arguments[0] );
   	if( src == null )
		return;
		
	var objClickedTrigger = null;
	for( var strTriggerID in CEngine.objTrigger )
	{ 
		if( CCSSP.IsDescendant( CEngine.objTrigger[strTriggerID].eleTrigger,src) )
		{
			objClickedTrigger = CEngine.objTrigger[strTriggerID];
			break;
		}
	}
	
	if( objClickedTrigger != null) 
		objClickedTrigger.OnTriggerClick(event);
	else 
	{ 
		CTarget.nPageClickCounter++;
		CEngine.AdjustPageClickCounter();
		CEngine.SendEventToAllTarget( "bsscpageclick" ,event);
	}
}	

CEngine.OnMouseOver = function(event)
{ 
	var src = CCSSP.GetEventElement( arguments[0] );
	if( src == null )
		return;
		
	var strHoveredTargetID = null;
	for( var strTargetID in CEngine.objTarget )
	{ 
		if( CCSSP.IsDescendant( CEngine.objTarget[strTargetID].eleTarget, src ) )
	    {
			strHoveredTargetID = strTargetID;
			break;
	    }
	}
	
	if( strHoveredTargetID != null ) 
		CEngine.SendEventToOneTarget( strHoveredTargetID, "bsschover",event );
}

CEngine.BuildTargetObject = function(target_ID,event_type,action_type,
			action_setting, event_additional)
{
	
	if( typeof( CEngine.objTarget[target_ID] ) != "object" )
		return false;
	var TargetObject = CEngine.objTarget[target_ID];
	
	
	var arrEvent = event_type.split("|"); 
	var arrAction = action_type.split("|");
	for( var trim = 0; trim < arrEvent.length; trim++ )
		arrEvent[trim] = CCSSP.TrimSpace(arrEvent[trim]);
	
	for( trim = 0; trim < arrAction.length; trim++ )
		arrAction[trim] = CCSSP.TrimSpace(arrAction[trim]);
	
	var arrSetting = new Array(); 
	if( typeof(action_setting) == "string" )
		arrSetting = action_setting.split("|");
	
	for( var i = arrSetting.length; i < arrAction.length; i++ )
	{
		if( typeof(arrSetting[i]) != "string" )
			 arrSetting[i] = "";
	}				 

	
	TargetObject.eleTarget.ABSX = CCSSP.GetObjectLeft( TargetObject.eleTarget );
	TargetObject.eleTarget.ABSY = CCSSP.GetObjectTop( TargetObject.eleTarget );

	if( arrEvent.length > 1 )
	{
		if( arrAction.length != 2 )
			return false; 
		for( i = 0 ; i < 2; i++ )
		{
			if( TargetObject.SetEventManager(arrEvent[i], arrAction[i], 
				arrSetting[i], event_additional) == false )
				return false; 
		}
	}
	else 
	{
		for( i = 0 ; i < arrAction.length; i++ )
		{
			TargetObject.SetEventManager(event_type, arrAction[i], arrSetting[i], event_additional);
			
			if( typeof(TargetObject.objManager[event_type]) != "object" ||
					typeof(TargetObject.objManager[event_type][i]) != "object" )
				return false; 
		}
	}
	return true;
}

CEngine.BuildTriggerObject = function(trigger_ID, target_ID)
{
	var arrTrigger = trigger_ID.split("|"); 
	for( var i = 0; i < arrTrigger.length; i ++ )
	{
		arrTrigger[i] = CCSSP.TrimSpace( arrTrigger[i] );
		var eleTrigger = CCSSP.GetObject( arrTrigger[i] );
		if( eleTrigger == null )
			continue; 
		CEngine.AddOneTrigger( arrTrigger[i], eleTrigger );

		
		if( typeof( this.objTrigger[arrTrigger[i]] ) != "object" )
			continue;
		CEngine.objTrigger[arrTrigger[i]].AddTargetID( target_ID );
	}
}









function CAgencyShow( element, bIsShow )
{
	this.ele = element;
	this.bIsShow = bIsShow;
}

CAgencyShow.prototype.PrepareEffect = function()
{
	CCSSP.ShowObject( this.ele, !this.bIsShow );
}

CAgencyShow.prototype.UpdateEffect = function()
{
	CCSSP.ShowObject( this.ele, this.bIsShow );
}

CAgencyShow.prototype.EndEffect = function()
{
	CCSSP.ShowObject( this.ele, !this.bIsShow );
}



function CAgencyFly( element, settings, bIsIn )
{
	this.ele = element;
	this.bIsIn = bIsIn;
	this.duration = 1000; 
	this.direction = "right";

	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "speed" : this.duration = 100000/arrOneSet[1]; break;
		case "direction" : this.direction = arrOneSet[1]; break;
		}
	}
		
	if( this.ele.style.position != "absolute" )
		this.ele.style.position = "relative";
	this.timer = null;
	this.aniIndex = CEngine.arrAnimation.length;
	CEngine.arrAnimation[this.aniIndex] = this;
}

CAgencyFly.prototype.PrepareEffect = function()
{
	CCSSP.ShowObject(this.ele, !this.bIsIn );
}

CAgencyFly.prototype.UpdateEffect = function()
{
	if( this.timer == null )
		this.ResetParameters();

	var percent = ((new Date()).getTime() - this.startTime)/this.duration;
	if( percent >= 1.0 )
		this.EndEffect();
	else
	{
		var newX = this.startX*(1.0-percent) +  this.finalX*percent;
		var newY = this.startY*(1.0-percent) +  this.finalY*percent;
		CCSSP.MoveObjectTo(this.ele, newX, newY);
		CCSSP.SetTimer(this,20);
	}
}

CAgencyFly.prototype.EndEffect = function()
{
	clearInterval( this.timer );
	this.timer = null;

	if( this.bIsIn ) 
		CCSSP.MoveObjectTo(this.ele, this.finalX, this.finalY);
	else 
		CCSSP.MoveObjectTo(this.ele, this.startX, this.startY);
	CCSSP.ShowObject(this.ele, this.bIsIn );
}

CAgencyFly.prototype.ResetParameters = function()
{
	this.PrepareEffect();
	CCSSP.ShowObject(this.ele, true );

	this.startX = 0;
	this.startY = 0;
	this.finalX = 0;
	this.finalY = 0; 
	
	var offsetLeft = CCSSP.GetObjectWindowLeft(this.ele) + this.ele.offsetWidth;
	var offsetTop = CCSSP.GetObjectWindowTop(this.ele) + this.ele.offsetHeight;
	var offsetRight = CCSSP.GetWindowRight();
	var offsetBottom = CCSSP.GetWindowBottom();

	if( this.bIsIn )
	{ 
		this.finalX = this.ele.ABSX;
		this.finalY = this.ele.ABSY;

		switch( this.direction )
		{
		case "right": this.startX = offsetRight; this.startY = this.finalY; break;
		case "left": this.startX = -offsetLeft;  this.startY = this.finalY; break;
		case "down": this.startY = offsetBottom; this.startX = this.finalX; break;
		case "up":  this.startY = -offsetTop;    this.startX = this.finalX; break;
		case "downright":
  			this.startX = ( offsetBottom < offsetRight) ? offsetBottom : offsetRight;
			this.startY = this.startX;		break;
		case "upright":
  			this.startX = (offsetTop < offsetRight)? offsetTop : offsetRight;
			this.startY = -this.startX;		break;
		case "upleft":
			this.startX = -((offsetTop < offsetRight)? offsetTop : offsetRight);
			this.startY = this.startX;		break;
		case "downleft":
			this.startX = -(( offsetBottom < offsetRight) ? offsetBottom : offsetRight);
			this.startY = -this.startX;     break;
		}
	}
	else
	{ 
		this.startX = this.ele.ABSX;
		this.startY = this.ele.ABSY;

		switch( this.direction )
		{
		case "right": this.finalX = offsetRight;  this.finalY = this.startY; break;
		case "left": this.finalX = -offsetLeft;   this.finalY = this.startY;  break;
		case "down": this.finalY = offsetBottom;  this.finalX = this.startX; break;
		case "up":  this.finalY = -offsetTop;     this.finalX = this.startX; break;
		case "downright":
  			this.finalX = ( offsetBottom < offsetRight) ? offsetBottom : offsetRight;
			this.finalY = this.finalX;		break;
		case "upright":
  			this.finalX = (offsetTop < offsetRight)? offsetTop : offsetRight;
			this.finalY = -this.finalX;		break;
		case "upleft":
			this.finalX = -((offsetTop < offsetRight)? offsetTop : offsetRight);
			this.finalY = this.finalX;		break;
		case "downleft":
			this.finalX = -(( offsetBottom < offsetRight) ? offsetBottom : offsetRight);
			this.finalY = -this.finalX;     break;
		}
	}
	CCSSP.MoveObjectTo(this.ele, this.startX, this.startY);
	this.startTime = (new Date()).getTime();
}



function CAgencySpiral( element, settings, bIsIn )
{
	this.ele = element;
	this.bIsIn = bIsIn;
	this.duration = 1000; 

	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "speed" : this.duration = 100000/arrOneSet[1]; break;
		}
	}

	if( this.ele.style.position != "absolute" )
		this.ele.style.position = "relative";
	this.timer = null;
	this.aniIndex = CEngine.arrAnimation.length;
	CEngine.arrAnimation[this.aniIndex] = this;
}

CAgencySpiral.prototype.PrepareEffect = function()
{
	CCSSP.ShowObject(this.ele, !this.bIsIn );
}

CAgencySpiral.prototype.UpdateEffect = function()
{
	if( this.timer == null )
		this.ResetParameters();

	var percent = ((new Date()).getTime() - this.startTime)/this.duration;
	if( percent >= 1.0 )
		this.EndEffect();
	else
	{
		var rf = (this.bIsIn)? (1.0 - percent) : percent; 
		var t = (1.0-rf) * 4.0 * Math.PI
		var rxP = (this.bIsIn)? this.startX : this.finalX; 
		var ryP = (this.bIsIn)? this.startY : this.finalY; 
		var rx = (Math.abs(rxP) < 200) ? Math.abs(rxP) : 200;
		var ry = (Math.abs(ryP) < 200) ? Math.abs(ryP) : 200;

		var newX = Math.ceil(-rf*Math.cos(t)*rx) + this.ele.ABSX;
		var newY = Math.ceil(-rf*Math.sin(t)*ry) + this.ele.ABSY;
		CCSSP.MoveObjectTo(this.ele, newX, newY);
		CCSSP.SetTimer(this,20);
	}
}

CAgencySpiral.prototype.EndEffect = function()
{
	clearInterval( this.timer );
	this.timer = null;
	
	if( this.bIsIn ) 
		CCSSP.MoveObjectTo(this.ele, this.finalX, this.finalY);
	else 
		CCSSP.MoveObjectTo(this.ele, this.startX, this.startY);
	CCSSP.ShowObject(this.ele, this.bIsIn );
}

CAgencySpiral.prototype.ResetParameters = function()
{
	this.PrepareEffect();
	CCSSP.ShowObject(this.ele, true );
	this.startX = (this.bIsIn)? CCSSP.GetWindowRight() : this.ele.ABSX;
	this.startY = (this.bIsIn)? CCSSP.GetWindowBottom() : this.ele.ABSY;
	this.finalX = (this.bIsIn)? this.ele.ABSX : CCSSP.GetWindowRight();
	this.finalY = (this.bIsIn)? this.ele.ABSY : CCSSP.GetWindowBottom(); 
	
	CCSSP.MoveObjectTo(this.ele, this.startX, this.startY);
	this.startTime = (new Date()).getTime();
}



function CAgencyElastic( element, settings)
{
	this.ele = element;
	this.duration = 1000; 
	this.direction = "right";

	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "speed" : this.duration = 100000/arrOneSet[1]; break;
		case "direction" : this.direction = arrOneSet[1]; break;
		}
	}
		
	if( this.ele.style.position != "absolute" )
		this.ele.style.position = "relative";
	this.timer = null;
	this.aniIndex = CEngine.arrAnimation.length;
	CEngine.arrAnimation[this.aniIndex] = this;
}

CAgencyElastic.prototype.PrepareEffect = function()
{
	CCSSP.ShowObject(this.ele, false );
}

CAgencyElastic.prototype.UpdateEffect = function()
{
	if( this.timer == null )
		this.ResetParameters();

	var percent = ((new Date()).getTime() - this.startTime)/this.duration;
	if( percent >= 1.0 )
		this.EndEffect();
	else
	{
		var newX = this.startX;
		var newY = this.startY;
		var rf = Math.exp(-percent*3);
		var t = percent * 1.5 * Math.PI
		var rx = (Math.abs(this.startX) > Math.abs(this.startY)) ? this.startX : this.startY;
		switch (this.direction )
		{
		case "left":   
		case "right" : newX = rf*Math.cos(t)*rx + this.ele.ABSX; break;
		case "up":	   
		case "down" :  newY = rf*Math.cos(t)*rx + this.ele.ABSX; break;
		}
		CCSSP.MoveObjectTo(this.ele, newX, newY);
		CCSSP.SetTimer(this,20);
	}
}

CAgencyElastic.prototype.EndEffect = function()
{
	CCSSP.MoveObjectTo(this.ele, this.finalX, this.finalY);
	clearInterval( this.timer );
	this.timer = null;
}

CAgencyElastic.prototype.ResetParameters = function()
{
	CCSSP.ShowObject(this.ele, true );
	this.startX = this.ele.ABSX;
	this.finalX = this.ele.ABSX;
	this.startY = this.ele.ABSY;
	this.finalY = this.ele.ABSY;
	
	switch (this.direction)
	{ 
	case "left":  this.startX = -this.ele.offsetWidth; break;
	case "right": this.startX = this.ele.offsetWidth;  break;
	case "up":    this.startY = -this.ele.offsetHeight;break;
	case "down":  this.startY = this.ele.offsetHeight; break;
	}
	CCSSP.MoveObjectTo(this.ele, this.startX, this.startY);
	this.startTime = (new Date()).getTime();
}



function CAgencyZoom( element, settings, bIsIn)
{
	this.ele = element;
	this.duration = 1000; 
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "speed" : this.duration = 100000/arrOneSet[1]; break;
		}
	}

	this.bIsIn = bIsIn;
	this.timer = null;
	this.aniIndex = CEngine.arrAnimation.length;
	CEngine.arrAnimation[this.aniIndex] = this;
}

CAgencyZoom.prototype.PrepareEffect = function()
{
	CCSSP.ShowObject(this.ele, false);
}

CAgencyZoom.prototype.UpdateEffect = function()
{
	if( this.timer == null )
		this.ResetParameters();

	var percent = ((new Date()).getTime() - this.startTime)/this.duration;
	if( percent >= 1.0 )
		this.EndEffect();
	else
	{
		var nFactorIn = Math.ceil(50+50*percent);
		var nFactorOut = Math.ceil(100+200*(1-percent));
		var AlterFontsize = ((this.bIsIn)? nFactorIn : nFactorOut) + "%";
		var AlterFactor = ((this.bIsIn)? nFactorIn : nFactorOut) / 100;
		
		this.UpdateEffectAllChildren(this.ele, AlterFontsize, AlterFactor);
		var arr ;
		if (this.ele.all)
		    arr = this.ele.all ;
		else
		    arr = this.ele.getElementsByTagName ('*');
		for(var index = 0; index < arr.length; index++)
			this.UpdateEffectAllChildren(arr[index], AlterFontsize, AlterFactor);
			
		CCSSP.SetTimer(this,20);
	}
}

CAgencyZoom.prototype.UpdateEffectAllChildren = function(child, FontSize, Factor)
{
	if( CCSSP.IsTextTag(child) )
		child.style.fontSize = FontSize;
	else
	{
		if( typeof(child.orgWidth) == "number" )
			child.style.width = Factor * child.orgWidth;
		if( typeof(child.orgHeight) == "number" )
			child.style.height = Factor * child.orgHeight;
	}
}

CAgencyZoom.prototype.EndEffect = function()
{
	this.EndEffectAllChildren(this.ele);
	var arr ;
	if(this.ele.all)
	    arr = this.ele.all ;
	else
	    arr = this.ele.getElementsByTagName('*');
	for(var index = 0; index < arr.length; index++)
		this.EndEffectAllChildren(arr[index]);
	
	clearInterval( this.timer );
	this.timer = null;
}

CAgencyZoom.prototype.EndEffectAllChildren = function( child )
{	
	if( CCSSP.IsTextTag(child) )
		child.style.fontSize = child.orgFontSize;
	else
	{
		if( typeof(child.intactWidth) != "undefined" )
		{
			child.width = child.intactWidth;
			child.height = child.intactHeight;
		}
		else if( typeof(child.style.intactPixelWidth) != "undefined" )
		{
			child.style.pixelWidth = child.style.intactPixelWidth;
			child.style.pixelHeight = child.style.intactPixelHeight;
		}
	}
}

CAgencyZoom.prototype.ResetParameters = function()
{
	this.PrepareEffect();
	this.ResetParametersAllChildren( this.ele );
	var arr ;
	if (this.ele.all)
	    arr = this.ele.all ;
	else
	    arr = this.ele.getElementsByTagName('*');
	for(var index = 0; index < arr.length; index++)
		this.ResetParametersAllChildren(arr[index]);
		
	this.startTime = (new Date()).getTime();
}

CAgencyZoom.prototype.ResetParametersAllChildren = function( child )
{
	CCSSP.ShowObject(child, true );
	if( (child.tagName == "DIV") && (getParentNode(child).tagName == "TD") )
		child.width = "100%";
	
	if( CCSSP.IsTextTag(child) )
		child.orgFontSize = child.style.fontSize;
	else
	{
		if( child.width > "" || child.height > "" )
		{
			child.orgWidth = child.intactWidth = child.width;
			child.orgHeight = child.intactHeight = child.height;
		}
		else if( ( typeof(child.orgWidth) != "number" ) && (typeof(child.orgHeight) != "number") )
		{
			child.orgWidth = child.style.intactPixelWidth = child.style.pixelWidth;
			child.orgHeight = child.style.intactPixelHeight = child.style.pixelHeight;
		}
	}
}




function CAgencyAlpha( element, settings, bIsIn )
{
	this.ele = element;
	this.bIsIn = bIsIn;

	
	this.startOpacity = (this.bIsIn) ? 0 : 100;
	this.endOpacity = (this.bIsIn) ? 100 : 0;
	
	this.duration = 1000; 
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "speed" : this.duration = 100000/arrOneSet[1]; break;
		}
	}
	
	this.timer = null;
	this.aniIndex = CEngine.arrAnimation.length;
	CEngine.arrAnimation[this.aniIndex] = this;
}

CAgencyAlpha.prototype.PrepareEffect = function()
{
	
	
	
	CCSSP.PrepareFilter( this.ele );
	CCSSP.ShowObject(this.ele, !this.bIsIn );
}

CAgencyAlpha.prototype.UpdateEffect = function()
{
	if( this.timer == null )
		this.ResetParameters();
	if( typeof(this.ele.filters.alpha) != "object" )
	{
		this.EndEffect();
		return;
	}

	var percent = ((new Date()).getTime() - this.startTime)/this.duration;
	if( percent >= 1.0 )
		this.EndEffect();
	else if( typeof(this.ele.filters.alpha) == "object" )
	{
		this.ele.filters.alpha.opacity = this.startOpacity*(1.0-percent) + this.endOpacity*percent;
		CCSSP.SetTimer(this,20);
	}
}

CAgencyAlpha.prototype.EndEffect = function()
{
	clearInterval( this.timer );
	this.timer = null;
	this.ele.style.filter = "";
	CCSSP.ShowObject(this.ele, this.bIsIn );
}

CAgencyAlpha.prototype.ResetParameters = function()
{
	this.PrepareEffect();
	CCSSP.ShowObject(this.ele, true );
	this.ele.style.filter = "alpha(opacity=" + this.startOpacity + ")";
	this.startTime = (new Date()).getTime();
}



function CAgencyWave( element, settings )
{
	this.ele = element;

	this.duration = 0; 
	this.strength = 10;
	this.freq = 1;
	this.lightstrength = 1;
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "duration" : this.duration = 100000/arrOneSet[1]; break;
		case "strength" : this.strength = arrOneSet[1]; break;
		case "freq" : this.freq = arrOneSet[1]; break;
		case "lightstrength" : this.lightstrength = arrOneSet[1]; break;
		}
	}

	this.timer = null;
	this.aniIndex = CEngine.arrAnimation.length;
	CEngine.arrAnimation[this.aniIndex] = this;
}

CAgencyWave.prototype.PrepareEffect = function()
{
	CCSSP.PrepareFilter(this.ele);

	CCSSP.ShowObject(this.ele, true );
}

CAgencyWave.prototype.UpdateEffect = function()
{
	if( this.timer == null )
		this.ResetParameters();
	if( (typeof(this.ele.filters) == "undefined") || (typeof(this.ele.filters.wave) != "object" ) )
	{
		this.EndEffect();
		return;
	}

	if( this.duration > 0 )
	{
		var percent = ((new Date()).getTime() - this.startTime)/this.duration;
		if( percent >= 1.0 )
		{
			this.EndEffect();
			return;
		}
	}
	
	this.ele.filters.wave.phase += 5;
	this.ele.filters.wave.phase %= 100;
	CCSSP.SetTimer(this,50);
}

CAgencyWave.prototype.EndEffect = function()
{
	this.ele.style.filter = "";
	clearInterval( this.timer );
	this.timer = null;
}

CAgencyWave.prototype.ResetParameters = function()
{
	this.PrepareEffect();
	this.ele.style.filter = "wave(strength=" + this.strength + ",freq=" + 
	 this.freq +", lightstrength=" + this.lightstrength +",phase=0);";
	this.startTime = (new Date()).getTime();
}



function CAgencyGlow( element, settings )
{
	this.ele = element;

	
	this.glowColor = "green";
	this.glowStrength = "3";
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "color" : this.glowColor = arrOneSet[1]; break;
		case "strength" : this.glowStrength = arrOneSet[1]; break;
		}
	}
}

CAgencyGlow.prototype.PrepareEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	CCSSP.ShowObject(this.ele, true );
	if( this.ele.style.backgroundColor != "" )
	{
		this.ele.intactBackgroundColor = this.ele.style.backgroundColor;
		this.ele.style.backgroundColor = "";
	}
}

CAgencyGlow.prototype.UpdateEffect = function()
{
	this.PrepareEffect();
	this.ele.style.filter = "glow(Color=" + this.glowColor + ", Strength=" + 
		this.glowStrength + ", enabled=true" +")";
}

CAgencyGlow.prototype.EndEffect = function()
{
	this.ele.style.filter = "";
	if( typeof(this.ele.intactBackgroundColor) != "undefined" )
		this.ele.style.backgroundColor = this.ele.intactBackgroundColor;
}



function CAgencyDropShadow( element, settings )
{
	this.ele = element;

	
	this.shadowColor = "black"; 
	this.shadowOffx = "1";
	this.shadowOffy = "1";
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "color" : this.shadowColor = arrOneSet[1]; break;
		case "offx" : this.shadowOffx = arrOneSet[1]; break;
		case "offy" : this.shadowOffy = arrOneSet[1]; break;
		}
	}
}

CAgencyDropShadow.prototype.PrepareEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	CCSSP.ShowObject(this.ele, true );
	
	if( this.ele.style.backgroundColor != "" )
	{
		this.ele.intactBackgroundColor = this.ele.style.backgroundColor;
		this.ele.style.backgroundColor = "";
	}
}

CAgencyDropShadow.prototype.UpdateEffect = function()
{
	this.PrepareEffect();
	this.ele.style.filter = "dropshadow(color=" + this.shadowColor + ", offx=" + 
		this.shadowOffx + ", offy=" + this.shadowOffy + ")";
}

CAgencyDropShadow.prototype.EndEffect = function()
{
	this.ele.style.filter = "";
	if( typeof(this.ele.intactBackgroundColor) != "undefined" )
		this.ele.style.backgroundColor = this.ele.intactBackgroundColor;
}



function CAgencyRevealTrans( element, settings )
{
	this.ele = element;

	
	this.duration = 1.0; 
	this.transition = 0;
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "type" : this.transition = arrOneSet[1]; break;
		case "duration" : this.duration = 100/arrOneSet[1];	break;
		}
	}
}

CAgencyRevealTrans.prototype.PrepareEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	CCSSP.ShowObject( this.ele, false);
}

CAgencyRevealTrans.prototype.UpdateEffect = function()
{
	if( typeof( this.ele.filters.RevealTrans ) == "object" )
	{
		if( this.ele.filters.RevealTrans.status == 2 )
			this.ele.filters.RevealTrans.stop();  
	}

	this.PrepareEffect();
	
	this.ele.style.filter = "RevealTrans(duration=" + this.duration + 
		", transition=" + this.transition + ")";
	
    if( typeof( this.ele.filters.RevealTrans ) == "object" )
    {
		this.ele.filters.RevealTrans.apply();
		CCSSP.ShowObject( this.ele, true);
		this.ele.filters.RevealTrans.play();  
	}
	else
		CCSSP.ShowObject( this.ele, true);
}

CAgencyRevealTrans.prototype.EndEffect = function()
{
    if( typeof( this.ele.filters.RevealTrans ) == "object" )
		this.ele.filters.RevealTrans.stop();  
	this.ele.style.filter = "";
}



function CAgencyBlur( element, settings )
{
	this.ele = element;

	
	this.strength = "5";
	this.direction = "90";
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "strength" : this.strength = arrOneSet[1]; break;
		case "direction" : this.direction = arrOneSet[1]; break;
		}
	}
}

CAgencyBlur.prototype.PrepareEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	CCSSP.ShowObject(this.ele, true );
}

CAgencyBlur.prototype.UpdateEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	this.ele.style.filter = "blur(strength=" + this.strength + 
		", direction=" + this.direction + ")";
}

CAgencyBlur.prototype.EndEffect = function()
{
	this.ele.style.filter = "";
}



function CAgencyChangeFilter( element, settings ) 
{
	this.ele = element;

	
	this.filterFunction = settings;
}

CAgencyChangeFilter.prototype.PrepareEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	CCSSP.ShowObject(this.ele, true );
}

CAgencyChangeFilter.prototype.UpdateEffect = function()
{
	CCSSP.PrepareFilter(this.ele);
	this.ele.style.filter = this.filterFunction;
}

CAgencyChangeFilter.prototype.EndEffect = function()
{
	this.ele.style.filter = "";
}





function CAgencyFontChange( element, settings )
{
	this.ele = element;
	
	
	this.RetrieveOldFont( this.ele );
	
	
	this.newfontFamily = this.ele.oldFontFamily;
	this.newfColor = this.ele.oldColor;
	this.newtextDecoration = this.ele.oldTextDecoration;
	this.newfontWeight = this.ele.oldFontWeight;
	this.newfontStyle = this.ele.oldFontStyle;
	this.newfontSize = this.ele.oldFontSize;
	this.newBackgroundColor = this.ele.oldBackgroundColor;
	
	var arrAllSet = settings.split(",");
	for( var i = 0; i < arrAllSet.length; i ++ )
	{
		arrAllSet[i] = CCSSP.TrimSpace(arrAllSet[i]);
		var arrOneSet = arrAllSet[i].split("=");
		for( var j = 0; j < arrOneSet.length; j++ )
			arrOneSet[j] = CCSSP.TrimSpace(arrOneSet[j]);
		switch( arrOneSet[0] )
		{
		case "font-family" : this.newfontFamily = arrOneSet[1]; break;
		case "color" : this.newfColor = arrOneSet[1]; break;
		case "underline" : this.newtextDecoration = (arrOneSet[1]=="on")? "underline" : "none"; break;
		case "bold" : this.newfontWeight = (arrOneSet[1]=="on")? "bold" : "normal"; break;
		case "italic" : this.newfontStyle = (arrOneSet[1]=="on")? "italic" : "normal"; break;
		case "size" : this.newfontSize = arrOneSet[1]; break;
		case "background-color" : this.newBackgroundColor = arrOneSet[1]; break;
		}
	}
}

CAgencyFontChange.prototype.RetrieveOldFont = function(objChild)
{
	if( typeof(objChild.oldFontFamily) == "undefined" )
		objChild.oldFontFamily = objChild.style.fontFamily;
	if( typeof(objChild.oldColor) == "undefined" )
		objChild.oldColor = objChild.style.color;
	if( typeof(objChild.oldTextDecoration) == "undefined" )
		objChild.oldTextDecoration = objChild.style.textDecoration;
	if( typeof(objChild.oldFontWeight) == "undefined" )
		objChild.oldFontWeight = objChild.style.fontWeight;
	if( typeof(objChild.oldFontStyle) == "undefined" )
		objChild.oldFontStyle = objChild.style.fontStyle;
	if( typeof(objChild.oldFontSize) == "undefined" )
		objChild.oldFontSize = objChild.style.fontSize;
	if( typeof(objChild.oldBackgroundColor) == "undefined" )
		objChild.oldBackgroundColor = objChild.style.backgroundColor;
}

CAgencyFontChange.prototype.PrepareEffect = function()
{
	
	var arr = this.ele.getElementsByTagName ('*');
	for(var index = 0; index < arr.length; index++)
		this.RetrieveOldFont(arr[index]);
	CCSSP.ShowObject(this.ele, true );
}

CAgencyFontChange.prototype.UpdateEffect = function()
{
	this.PrepareEffect();
	this.UpdateEffectAllChildren( this.ele );
	var arr = this.ele.getElementsByTagName ('*');
	for( var index = 0; index < arr.length; index++)
		this.UpdateEffectAllChildren(arr[index]);
}

CAgencyFontChange.prototype.UpdateEffectAllChildren = function(objChild)
{
	objChild.style.fontFamily = this.newfontFamily;
	objChild.style.color = this.newfColor;
	objChild.style.textDecoration = this.newtextDecoration;
	objChild.style.fontWeight = this.newfontWeight;
	objChild.style.fontStyle = this.newfontStyle;
	objChild.style.fontSize = this.newfontSize;
	objChild.style.backgroundColor = this.newBackgroundColor;
}

CAgencyFontChange.prototype.EndEffect = function()
{
	this.EndEffectAllChildren( this.ele );
	var arr = this.ele.getElementsByTagName ('*');
	for( var index = 0; index < arr.length; index++)
		this.EndEffectAllChildren(arr[index]);
}

CAgencyFontChange.prototype.EndEffectAllChildren = function( objChild )
{
	if( typeof(objChild.oldFontFamily) != "undefined" )
		objChild.style.fontFamily = objChild.oldFontFamily;
	if( typeof(objChild.oldColor) != "undefined" )
		objChild.style.color = objChild.oldColor;
	if( typeof(objChild.oldFontWeight) != "undefined" )
		objChild.style.fontWeight = objChild.oldFontWeight;
	if( typeof(objChild.oldFontStyle) != "undefined" )
		objChild.style.fontStyle = objChild.oldFontStyle;
	if( typeof(objChild.oldFontSize) != "undefined" )
		objChild.style.fontSize = objChild.oldFontSize;
	if( typeof(objChild.oldTextDecoration) != "undefined" )
		objChild.style.textDecoration = objChild.oldTextDecoration;
	if( typeof(objChild.oldBackgroundColor) != "undefined" )
		objChild.style.backgroundColor = objChild.oldBackgroundColor;
}



function CAgencyChangeStyle( element, settings )
{
	this.ele = element;
	
	
	this.oldstyle = this.ele.style.cssText;
	
	
	this.newStyle = this.oldstyle;
	
	if( typeof(settings) == "string" && settings.length > 1 )
		this.newStyle = this.oldstyle + " " + settings;
}

CAgencyChangeStyle.prototype.PrepareEffect = function()
{
	CCSSP.ShowObject(this.ele, true );
}

CAgencyChangeStyle.prototype.UpdateEffect = function()
{
	this.ele.style.cssText = this.newStyle;
}

CAgencyChangeStyle.prototype.EndEffect = function()
{
	this.ele.style.cssText = this.oldStyle;
}





CCSSP.RegisterEventHandler( window, "onload", "CEngine.OnPageLoad(event);BSSCOnLoad(event);InitTriggersInHead(event);");
CCSSP.RegisterEventHandler( document, "onclick", "CEngine.OnPageClick(event);BSSCOnClick(event);");
CCSSP.RegisterEventHandler( document, "onmouseover", "CEngine.OnMouseOver(event);BSSCOnMouseOver(event);" );
CCSSP.RegisterEventHandler( document, "onmouseout", "CEngine.OnMouseOver(event);BSSCOnMouseOut(event);" );
CCSSP.RegisterEventHandler( window, "onunload", "BSSCOnUnload();");





