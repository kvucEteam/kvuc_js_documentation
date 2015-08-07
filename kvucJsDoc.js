
function htmlEntities(str) {
    return String(str).replace(/\$/g, '&#36;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


function RemoveExtraTabs(str) {
    console.log("RemoveExtraTabs - BEFORE: " + str );
    // return String(str).replace(/\\n\\t/g, '\n');
    var After = String(str).replace(/\t+/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    console.log("RemoveExtraTabs - AFTER: " + After );
    return String(After);
}


function ReturnBodyContent(Html) {
    var StartPos = Html.indexOf( "<body" );
    if (StartPos !== -1){
        var EndPos = Html.indexOf( "</body>" );
        if (EndPos !== -1){
            var BodyContent = Html.substring(StartPos, EndPos + 7)
        } else {
            alert('FEJL:\nArgumentet "Html" i funktionen "ReturnBodyContent()" modtager ikke et korrekt formateret body-slut-tag.'+
              '\nBody-slut-taget skal skrives: "</body>" - det må IKKE skives med mellemrum mellem "<" og "body" - dvs således: "</body>".');
        }
    } else {
        alert('FEJL:\nArgumentet "Html" i funktionen "ReturnBodyContent()" modtager ikke et korrekt formateret body-start-tag.'+
              '\nBody-start-taget skal skrives: "<body>" eller "<body ...properties... >" - det må IKKE skives med mellemrum mellem '+
              '\n"<" og "body" - devs således: "< body ...properties... >".');
    }
    return BodyContent;
}

// var Html = ' <!DOCTYPE html><html><head><title>KVUC JS dokumentation</title></head><body><div class="container-fluid"> Lorem ipsum dolor sit amet.</div><script src="../../../../library/vendor_scripts.js"></script><script src="../../../../library/custom_scripts.js"></script><script type="text/javascript">$(document).ready(function() {one_line_footer();});</script></body></html> ';
// console.log("ReturnBodyContent: " + htmlEntities( ReturnBodyContent(Html) ) );


function InsetReturnedHtml(Url, AjaxData){
    var Sarr = Url.split("/");
    var FileName = Sarr[Sarr.length-1].split(".")[0];

    // var SectionObj = $(".SectionHeader:contains('"+FileName+"')").parent();  // <----- NOT a robust way of obtaining the parent object!

    var SectionObj = $(".SectionHeader").filter(function() { // This is a more robust way...
        console.log("InsetReturnedHtml - (this).text(): " + $(this).text().replace("()","").trim() + ", FileName: " + FileName );
        return $(this).text().replace("()","").trim() === FileName;  
    }).parent();

    console.log("SectionObj: " + SectionObj.prop("class") );

    var HTML = "";
    HTML += '<pre class="brush: xml;">';
    // HTML += RemoveExtraTabs(htmlEntities(ReturnBodyContent(AjaxData)));
    HTML += htmlEntities(ReturnBodyContent(AjaxData));
    HTML += '</pre>';

    $(".DemoCode", SectionObj).html(HTML);
}
// console.log("InsetReturnedHtml: " + InsetReturnedHtml("html/footer.html", Html));

function ReturnAjaxData(Type, Url, Async, DataType) {
	console.log("ReturnAjaxData OK!");
    $.ajax({
        type: Type,
        url: Url,
        async: Async,
        dataType: DataType,
        success: function(Data) {
            console.log("ReturnAjaxData 1: " + JSON.stringify(Data));
            console.log("ReturnAjaxData 2: " + Data);
            // JsonData = JSON.parse(JSON.stringify(Data));
            InsetReturnedHtml(Url, Data);
        }
    });
}


function SetIframeHeight() {

    $("iframe").each(function(index, element) {
        element.style.height = element.contentWindow.document.body.offsetHeight+'px';
    });
}


// Denne funktion sortere alle sections alfabetisk på baggrund af deres navn 
function SortSectionsAlphabetically() {
    var HeadingsArray = [];
    $(".SectionHeader").each(function(index, element) {
        var TempObj = {"Heading" : null, "Obj" : null};
        TempObj.Heading = $(element).text();
        TempObj.Obj = $(element).parent().html();
        HeadingsArray.push(TempObj);
    });

    HeadingsArray.sort(function(a, b){
        console.log("a[0]: " + JSON.stringify(a.Heading) );
        if(a.Heading < b.Heading) return -1;
        if(a.Heading > b.Heading) return 1;
        return 0;
    });

    console.log("SortSectionsAlphabetically - HeadingsObj: " + JSON.stringify( HeadingsArray ) );

    $(".Section").each(function(index, element) {
        $(element).html(HeadingsArray[index].Obj);
        console.log("SortSectionsAlphabetically - HeadingsArray[index].Obj: " + JSON.stringify( HeadingsArray[index].Obj ) );
    });

    MakeClickableTableOfContent(HeadingsArray);
}


// Denne funktion danner en liste over de dokumenterede funktioner
function MakeClickableTableOfContent(HeadingObj) {
    var HTML = '<ul id="TOC_list">';
    for (var Index in HeadingObj){
        var HeaderStr = String(HeadingObj[Index].Heading.split("(")[0]);
        console.log("MakeClickableTableOfContent - HeaderStr: " + HeaderStr);
        HTML += '<li> <a href="#">'+HeaderStr+'</a></li>';

        // var SectionObj = $(".SectionHeader:contains('"+HeadingObj[Index].Heading+"')");  // <----- NOT a robust way of obtaining the object!

        var SectionObj = $(".SectionHeader").filter(function() {  // This is a more robust way...
            return $(this).text() === HeadingObj[Index].Heading;
        });

        var SectionStr = $(SectionObj).text();
        console.log("MakeClickableTableOfContent - SectionStr: " + SectionStr);
        // $(".SectionHeader:contains('"+HeaderStr+"')").parent().prop("id", HeaderStr);  // <---- OK!!!
        $(SectionObj).parent().prop("id", HeaderStr);
        $(SectionObj).html($(SectionObj).text()+'<a href="#" title="Til tops" class="glyphicon glyphicon-triangle-top right"></a> <span class="clear"></span>');
    }
    HTML += '</ul>';

    $("#TOC_position").html(HTML);
}


$(document).ready(function() {

});

$( window ).load(function() {  // IMPORTANT: Waits untill all elements are loaded, then...
    

    SetIframeHeight();                                  // ... first: find and set all iframe heights...

    $("code.spaces").each(function(index, element) {    // ... second: remove all extra tab-charecters in the code-tags... NOTE: 1 tab is assumed to have length = 4.
        var SpaceText = $(element).text();
        if (SpaceText.length - 4 >= 0){
            $(element).text(SpaceText.substr(0, SpaceText.length-4));
        }
    });

    $(".DemoContainer").css( "display", "none" );       // ... thrid: hide alle DemoContainers...

    SortSectionsAlphabetically();  // ... fourth: all Sections are sorted alphabetically...


    // Make the slideUp/slideDown active:
    $( ".DemoHeader" ).click(function() { 
        var ParentObj = $( this ).parent();
        $( ".DemoContainer", ParentObj ).slideToggle( "slow", function() {
            // $( "> span", ThisObj ).toggleClass( "glyphicon-chevron-right");
            // $( "> span", ThisObj ).toggleClass( "glyphicon-chevron-down" );
        });
        $( ".DemoHeader > span", ParentObj ).toggleClass( "glyphicon-chevron-right");
        $( ".DemoHeader > span", ParentObj ).toggleClass( "glyphicon-chevron-down" );
    });


    // This makes a slow scroll to the scroll-point on the page:
    $("#TOC_list a").click(function(e){
        e.preventDefault(); // Prevent the link-nature of the anchor-tag.
        var FuncName = $(this).text();
        $('html, body').animate({
            scrollTop: $("#"+FuncName).offset().top
        }, 500);
    })

    // This makes a slow scroll to the top of the page:
    $("h2 a").click(function(e){
        e.preventDefault(); // Prevent the link-nature of the anchor-tag.
        var FuncName = $(this).text();
        $('html, body').animate({
            scrollTop: $("#TOC_heading").offset().top
        }, 500);
    })

    // $('[data-toggle="tooltip"]').tooltip(); 

});