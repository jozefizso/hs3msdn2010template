// Current language
var curLang;
var showAll;
var scrollPos=null;
var curURL = document.location + ".";

function documentElement(id){
	return document.getElementById(id);
}

function sourceElement(e){
	if (window.event)
		e = window.event;
	return e.srcElement? e.srcElement : e.target;
}

function hsHideBoxes(){
	var pres = document.getElementsByTagName("DIV");
	var pre;

	if (pres) {
		for (var iPre = 0; iPre < pres.length; iPre++) {
			pre = pres[iPre];
			if (pre.className) {
				if (pre.className == "hspopupbubble") {
					pre.style.visibility = "hidden";
				}
			};
		}
	}
}

function getElementPosition(e){ 
	var offsetLeft = 0; 
	var offsetTop = 0; 
	while (e){ 
		// Allow for the scrolling body region in IE
		if (hsmsieversion() > 4) {
			offsetLeft += (e.offsetLeft - e.scrollLeft); 
			offsetTop += (e.offsetTop - e.scrollTop); 
		}
		else
		{
			offsetLeft += e.offsetLeft ; 
			offsetTop += e.offsetTop; 		
		}
		e = e.offsetParent; 
	} 
	if (navigator.userAgent.indexOf('Mac') != -1 && typeof document.body.leftMargin != 'undefined'){ 
		offsetLeft += document.body.leftMargin; 
		offsetTop += document.body.topMargin; 
	} 
	return {left:offsetLeft,top:offsetTop}; 
} 

function cancelEvent(e){
	e.returnValue = false;
	e.cancelBubble = true;
	if (e.stopPropagation) { 
		e.stopPropagation(); 
		e.preventDefault();
	} 	
}

function hsBeforePrint(){

	var i;
	var allElements;

	if (window.text) documentElement("text").style.height = "auto";
		
	allElements = document.getElementsByTagName("*");
		
	for (i=0; i < allElements.length; i++){
		if (allElements[i].tagName == "BODY") {
			allElements[i].scroll = "yes";
			}
		if (allElements[i].id == "hspagetop") {
			allElements[i].style.margin = "0px 0px 0px 0px";
			allElements[i].style.width = "100%";
			}
		if (allElements[i].id == "hspagebody") {
			allElements[i].style.overflow = "visible";
			allElements[i].style.top = "5px";
			allElements[i].style.width = "100%";
			allElements[i].style.padding = "0px 10px 0px 30px";
			}
		if (allElements[i].id == "hsseealsobutton" || allElements[i].id == "hslanguagesbutton") {
			allElements[i].style.display = "none";
			}
		if (allElements[i].className == "LanguageSpecific") {
			allElements[i].style.display = "block";
			}
		}
}

function hsAfterPrint(){

	 document.location.reload();

}

function hsShowSeeAlsoBox(e){

	if (window.event)
		e = window.event;

	hsHideSeeAlso();
	hsHideLanguage();

	var button = sourceElement(e)

	e.returnValue = false;
	e.cancelBubble = true;
	if (e.stopPropagation) { 
		e.stopPropagation(); 
		e.preventDefault();
	} 	

	var div = documentElement("hsseealsomenu");
	if (div && button) {	
		div.style.height = "";
		div.style.left = 3 + "px";
		div.style.top = button.offsetTop + button.offsetHeight + "px";
		div.style.visibility = "visible";
	}

	return false;
	
}

function hsShowGlossaryItemBox(term,definition,e){

	if (window.event)
		e = window.event;

	hsHideBoxes(e);

	var button = sourceElement(e);
	var documentWidth;
	var documentHeight;
	var boxWidth;
	var pixelLeft;
	var pixelTop;
	var boxHeigt;
	var boxWidth;
	
	cancelEvent(e);

	var div = documentElement("hsglossaryitembox")
	if (div && button) {

		// Have the browser size the box
		div.style.height = "";
		div.style.width = "";
		
		// Clear the tooltip so it doesn't appear above the popup
		button.title = "";
		
		div.innerHTML = "<p><strong>" + term + "</strong><br>" + definition + "</p>";
	
		pixelTop = getElementPosition(button).top + 14;
		
		// Check if the box would go off the bottom of the visible area
		documentHeight = document.body.clientHeight;
		boxHeight = div.clientHeight;
		if (pixelTop + boxHeight > documentHeight) 
		{
			// If the box won't fit both above and below the link
			//  using the default width then make the box wider
			if (boxHeight >= pixelTop)
				div.style.width = "80%";
			else			
				pixelTop = pixelTop - 14 - boxHeight;
		}
		div.style.top = pixelTop + "px";
		
		documentWidth = document.body.clientWidth;
		boxWidth = div.clientWidth;
		pixelLeft = button.offsetLeft;

		// Check if the box would go off the edge of the visible area		
		if (pixelLeft + boxWidth > documentWidth)
		{
			pixelLeft = documentWidth - boxWidth - 5;
		}
		div.style.left = pixelLeft + "px";		
		
		// Show the box
		div.style.visibility = "visible";
	}

}

function hsShowLanguageBox(e){

	if (window.event)
		e = window.event;	

	hsHideSeeAlso();
	hsHideLanguage();
	
	var button = sourceElement(e);

	cancelEvent(e);

	var div = documentElement("hslanguagemenu");
	if (div && button) {
		div.style.height = "";
		div.style.pixelLeft = 0;
		div.style.pixelTop = button.offsetTop + button.offsetHeight;
		div.style.visibility = "visible";
	}
}

function hsSetLanguageFilter(language,e){

	if (window.event)
		e = window.event;	

	hsHideSeeAlso();
	hsHideLanguage();

	cancelEvent(e);
	
	curLang = language;
	hsUpdateLanguageElements();
	
}

function hsBodyLoad(){

	var cLang;
	var i;
	var b;
	var l;
	var e;

	if (curURL.indexOf("#") != -1)
	{
		var oBanner= documentElement("hspagetop");
		scrollPos = document.body.scrollTop - oBanner.offsetHeight;
	}
	hsResizeBan();
	document.body.onclick = hsBodyClick;
	document.body.onresize = hsBodyResize;
	
	// Check the context window for current language.
	var cLang;
	try{
		for (i=1; i< window.external.ContextAttributes.Count; i++){
			if(window.external.ContextAttributes(i).Name.toUpperCase()=="DEVLANG"){
				var b = window.external.ContextAttributes(i).Values.toArray();
				cLang = b[0].toUpperCase();
			}
		}
	}
	catch(e){}
	
	if (cLang != null){
		if (cLang.indexOf("VB")!=-1) curLang = "VB";
		if (cLang.indexOf("VC")!=-1) curLang = "VC";
		if (cLang.indexOf("CSHARP")!=-1) curLang = "CS";
		if (cLang.indexOf("JSCRIPT")!=-1) curLang = "JScript";
	}

	if (curLang == null){
		var l = "";
		var multipleLang = false;
		// Check to see what the help filter is set to.
		try {l = window.external.Help.FilterQuery.toUpperCase();}
		catch(e){}
		if (l.indexOf("VB")!=-1){
			cLang = "VB";
			}
		if (l.indexOf("VC")!=-1){
			if (cLang!=null) multipleLang = true;
			cLang = "VC";
			}
		if (l.indexOf("C#")!=-1){
			if (cLang!=null) multipleLang = true;
			cLang = "CS";
			}
		if (l.indexOf("CSHARP")!=-1){
			if (cLang!=null) multipleLang = true;
			cLang = "CS";
			}
		if (l.indexOf("JSCRIPT")!=-1){
			if (cLang!=null) multipleLang = true;
			cLang = "JScript";
			}
		if (multipleLang==false) curLang = cLang;
	}

	if (curLang != null)
		showAll = false;
		
	hsUpdateLanguageElements();	
	
	window.onbeforeprint = hsBeforePrint;
	window.onafterprint = hsAfterPrint;	
	
}

function hsUpdateLanguageElements(){

	if (!curLang) return;

	var pres = document.getElementsByTagName("DIV");
	var pre;

	if (pres) {
		for (var iPre = 0; iPre < pres.length; iPre++) {
			pre = pres[iPre];
			if (pre.Name && pre.className) {
				if (pre.className == "LanguageSpecific") {
					if (pre.Name.toUpperCase().indexOf(curLang.toUpperCase()) != -1 || curLang == "All") {
						pre.style.display = "block";				
					}
					else {
						pre.style.display = "none";
					};
				}
			};
		}
	}
	
}

function hsBodyResize(){
	hsResizeBan();
}

function hsBodyClick(){
	hsHideBoxes();
	hsResizeBan();
}

function hsHideSeeAlso(){
	if (documentElement("dxseealsomenu")) {
		documentElement("hsseealsomenu").style.visibility = "hidden";
	};
}


function hsHideLanguage(){
	if (documentElement("dxlanguagemenu")) {
		documentElement("hslanguagemenu").style.visibility = "hidden";
	};
}

function hsResizeBan(){

	if (hsmsieversion() > 4)
	{
		try
		{

			if (document.body.clientWidth==0) return;
			var oBanner= documentElement("hspagetop");
			var oText= documentElement("hspagebody");
			if (oText == null) return;
			var oBannerrow1 = documentElement("hsprojectnamebanner");
			var oTitleRow = documentElement("hspagetitlebanner");
			if (oBannerrow1 != null){
				var iScrollWidth = hsbody.scrollWidth;
				oBannerrow1.style.marginRight = 0 - iScrollWidth;
			}
			if (oTitleRow != null){
				oTitleRow.style.padding = "0px 10px 0px 22px; ";
			}
			if (oBanner != null){
				document.body.scroll = "no"
				oText.style.overflow= "auto";
				oBanner.style.width= document.body.offsetWidth-2;
				oText.style.paddingRight = "20px"; // Width issue code
				oText.style.width= document.body.offsetWidth-4;
				oText.style.top=0;  
				if (document.body.offsetHeight > oBanner.offsetHeight)
					oText.style.height= document.body.offsetHeight - (oBanner.offsetHeight+4) 
				else oText.style.height=0
				if(scrollPos!=null)
				{
					oText.scrollTop = scrollPos;
					scrollPos = null;
				}
			}	
			try{nstext.setActive();} //allows scrolling from keyboard as soon as page is loaded. Only works in IE 5.5 and above.
			catch(e){}

		}
		catch(e){}
	}	
} 

function hsmsieversion()
// Return Microsoft Internet Explorer (major) version number, or 0 for others.
// This function works by finding the "MSIE " string and extracting the version number
// following the space, up to the decimal point for the minor version, which is ignored.
{
    var ua = window.navigator.userAgent
    var msie = ua.indexOf ( "MSIE " )

    if ( msie > 0 )        // is Microsoft Internet Explorer; return version number
        return parseInt ( ua.substring ( msie+5, ua.indexOf ( ".", msie ) ) )
    else
        return 0    // is other browser
}
