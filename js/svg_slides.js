/*  This is a basic attempt to use d3 to process transitional slides from SVG files (i.e. Inkscape)
    The main objective here was to keep everything as simple as possible
        
    To create a slide, simply create a rectangle in inkscape where you set the object ID to "slide_" + a number
    This number can be either integer or float, so "slide_1","slide_2" and "slide_3.56" all work.
    
    The script sorts the slide-numbers and transitions between slides based on the final sorted order.  
    
    It is easy to add slides into a pre-existing ordering, simply by chosing a floating number in the middle of the two
    Example: If we want to add slide between "slide_2" and "slide_3" we simply add a rectancle called "slide_2.5"
    
    Keyboard definitions:
        Right arrow:    next slide
        Left arrow:     previous slide
        Home:           first slide
        End:            last slide
   
    Please be aware that you need to remove any layer transition is the svg file (or put the layer transition to 0,0)
    
    Each slide has a scale_x and scale_y functions that have pre-set range to the slide boundaries and a default
    domain of [0,1000], allowing the user to position objects easily onto each slide.
    
    
    ziggy.jonsson.nyc@gmail.com
*/
  
var slides={},
    slide = 0,
    delay = delay ? delay : 7000;

function svg_slides(svg,delay) {
	
	//style du body
	d3.select("body")
		.style("margin",0);
	
	//AJOUT du navigateur
	var nav = d3.select("body").append("div")
    		.attr("id",'navig')
    		.style("position",'absolute')
    		.style("left",'10px')
    		.style("bottom",'0px');
	
	nav.append("label")
    			.attr("for",'numSlide')
    			.text("Diapo = ")
	    		.append("span")
	    			.attr("id",'numSlide-value')
	    			.text("...");
	nav.append("input")
		.attr("id",'numSlide')
		.attr("type",'range')
		.attr("max",'10')
		.attr("min",'0')
		.attr("value",'1')
		.attr("step",'1')
		.on("input", function() {
	    	changeImage(this.value);	
		});
	nav.append("span")
		.text("38")
		.attr("id",'numSlide-max');
        
    svg.attr("preserveAspectRatio","xMidYMid meet");
    svg.attr("width",window.innerWidth);
    svg.attr("height",window.innerHeight-10);

    rects = svg.selectAll("rect")[0];

    for (i=0;i<rects.length;i++) {
        id = rects[i].id;
        console.log(id);
        if (id.slice(0,6)=='slide_') { 
            slides[id.slice(6)]=rects[i] ;
            rects[i].scale_x = d3.scale.linear().range([rects[i].x.baseVal.value,rects[i].x.baseVal.value+rects[i].width.baseVal.value]).domain([0,1000]);
            rects[i].scale_y = d3.scale.linear().range([rects[i].y.baseVal.value,rects[i].y.baseVal.value+rects[i].height.baseVal.value]).domain([0,1000]);
            }
        
    }

    keys = Object.keys(slides).sort();
    slides.keys = keys;
    
    //ajoute un curseur sur les images avec un onclick
    var imgs = svg.selectAll("image")
    	.on({
	      "mouseover": function(d) {
	        if(this.getAttribute("onclick"))d3.select(this).style("cursor", "pointer");
	      },
	      "mouseout": function(d) {
	    	  if(this.getAttribute("onclick"))d3.select(this).style("cursor", "default");
	      }
	    });    		
 
    //met à jour le navigateur d'image s'il existe
	d3.select("#numSlide")
    			.attr("max",keys.length-1);
	d3.select("#numSlide-max")
		.text(keys.length-1);
    
    d3.select("body").on("touchmove", function() { if(slide<keys.length-1) {slide++; console.log(slide);}});

    d3.select(window).on("keydown", function() {
        switch (d3.event.keyCode) {
          case 37: {if (slide>0) {
        	  slide=slide-1; 
        	  console.log(slide);
        	  next_slide()};
        	  break}
          case 39: {
        	  if(slide<keys.length-1) {
        		  slide++; 
        		  console.log(slide+" : "+keys[slide]);
        		  next_slide()
        	  };
        	  break}
          case 36: {
        	  slide = 0;
        	  next_slide();
        	  break}
          case 35: {
        	  slide = keys.length -1; 
        	  next_slide();
        	  break}
        }
        
     });

    // Start with the first slide
    next_slide();
	changeImage(0);

    return slides
}

function next_slide()  {
    svg.transition().duration(delay).attr("viewBox",slides[keys[slide]].x.baseVal.value+" "+slides[keys[slide]].y.baseVal.value+" "+slides[keys[slide]].width.baseVal.value+" "+slides[keys[slide]].height.baseVal.value);
    changeNavig(slide);
}

function showWebPage(url){
	console.log(url);
	document.getElementById("ifDiag").setAttribute("src",url);
	var u = document.getElementById("ifURL");
	u.setAttribute("href",url);
	u.innerHTML=url;
	diagIframe.showModal();
}

function changeImage(numIma){
   	// adjust the range text
	if(svg){
		slide = numIma;	
		next_slide();
	}
}

function changeNavig(numIma){
   	// adjust the range text
   	console.log(numIma+" "+slide);
	d3.select("#numSlide-value").text(numIma);
	d3.select("#numSlide").property("value", numIma); 	
}
