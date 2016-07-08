
window.whname = "wh_stub";

var gbInited = false;
var gWndStubPage = null;
function getStubPage()
{
	if (!gbInited)
	{
		gWndStubPage = getStubPage_inter(window);
		gbInited = true;
	}
	return gWndStubPage;
}

function getStubPage_inter(wCurrent) {
	if (null == wCurrent.parent || wCurrent.parent == wCurrent)
		return null;

	if (wCurrent.parent.whname && "wh_stub" == wCurrent.parent.whname) 
		return wCurrent.parent;
	else
		if (wCurrent.parent.frames.length != 0 && wCurrent.parent != wCurrent)
			return getStubPage_inter(wCurrent.parent);
		else 
			return null;
}

function RegisterListener(framename, nMessageId)
{
	var wStartPage = getStubPage();
	if (wStartPage && wStartPage != this) {
		return wStartPage.RegisterListener(framename, nMessageId);
	}
	else 
		return false;
}

function RegisterListener2(oframe, nMessageId)
{
	var wStartPage = getStubPage();
	if (wStartPage && wStartPage != this) {
		return wStartPage.RegisterListener2(oframe, nMessageId);
	}
	else 
		return false;
}

function UnRegisterListener2(oframe, nMessageId)
{
	var wStartPage = getStubPage();
	if (wStartPage && wStartPage != this && wStartPage.UnRegisterListener2) {
		return wStartPage.UnRegisterListener2(oframe, nMessageId);
	}
	else 
		return false;
}

function SendMessage(oMessage)
{
	var nMsgId = oMessage.nMessageId;
	if (nMsgId == WH_MSG_ISINFRAMESET && oMessage.wSender != this)
		return true;
	var wStartPage = getStubPage();
	if (wStartPage && wStartPage != this && wStartPage.SendMessage) 
	{
		return wStartPage.SendMessage(oMessage);
	}
	else 
		return false;
}
var gbWhProxy=true;