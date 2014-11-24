(function(){
    var video = document.querySelector("#videoElement");
     
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
     
    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
     
    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }
     
    function videoError(e) {
        // do something
    }

	var videoId = 'videoElement';
var scaleFactor = 0.2;
var canvas = document.getElementById("c");

var intervalID = setInterval(function (){
        var video  = document.getElementById(videoId);
        var w = video.videoWidth * scaleFactor;
        var h = video.videoHeight * scaleFactor;
	canvas.width  = w;
	canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
	ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    }, 300);

var trackingrgb = [];
var threshhold = 10;

var started = false;

var avgx = 0;
var avgy = 0;

var cx = 0;
var cy = 0;

var odd = false;

var intervalID2 = setInterval(function (){
	
	odd = !odd;
	
	if(trackingrgb.length != 3)
	return;
	
var o = 1;
	if(odd)
	var o = 2;		
	
	var x = [];
	var y = [];
        for(var i=o;i<canvas.width;i+=2){
		for(var j=o;j<canvas.height;j+=2){
			var p = c.getContext('2d').getImageData(i, j, 1, 1).data; 
			var r = p[0];
			var g = p[1];
			var b = p[2];
			if(r <= trackingrgb[0]+threshhold && r >= trackingrgb[0]-threshhold){
				if(g <= trackingrgb[1]+threshhold && g >= trackingrgb[1]-threshhold){
					if(b <= trackingrgb[2]+threshhold && b >= trackingrgb[2]-threshhold){
						x.push(i);
						y.push(j);
					}
				}
			}
		}
	}

	var sum = 0;
	for(var k=0;k<x.length;k++){
		sum += x[k];	
	}
	avgx = sum/x.length;
	sum = 0;
	for(var m=0;m<y.length;m++){
		sum += y[m];	
	}
	avgy = sum/y.length;
	$("#loc").html("Tracked pos: (x,y) ("+Math.round(avgx)+","+Math.round(avgy)+")");
	
var context = document.getElementById("draw").getContext('2d');
	if (!started) {
document.getElementById("draw").width = document.getElementById("c").width;
document.getElementById("draw").height = document.getElementById("c").height;
    context.beginPath();
context.lineWidth = 2;

cx = Math.round(avgx);
cy = Math.round(avgy);
    context.moveTo(cx, cy);
    started = true;
  } else {

cx += (Math.round(avgx)-cx)*0.3;
cy += (Math.round(avgy)-cy)*0.3;

    context.lineTo(cx, cy);
    context.stroke();
  }	
	
    }, 300);

/*$('#c').mousemove(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    //var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    $('#status').html(coord + "<br>(r,g,b) (" + p[0] + "," + p[1] + "," + p[2] + ")");
});*/

$('#c').click(function(e) {
    var pos = findPos(this);
    var x = document.getElementById("c").width-(e.pageX - pos.x);
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    //var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    $('#tracking').html("Tracking: (r,g,b) (" + p[0] + "," + p[1] + "," + p[2] + ") with +- "+threshhold+" r, g, and b");
	trackingrgb = [p[0],p[1],p[2]];
});

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

})();
