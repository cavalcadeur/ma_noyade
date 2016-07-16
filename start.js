var W,H;
var ctx,canvas;
var Widget;
var keys = [];
var persos = [];
var imgPersos = [new Image,new Image,new Image,new Image];
imgPersos.forEach(
    function (e,i){
        e.src = "images/p"+i+".png";
    }
);
var controls = [87,32,38,96];
var courants = [0,0,0,0];
var bulles = [];
var t2 = 0;
var deaths = 0;
var point = [0,0,0,0,0];
var alerting = 0;
var bouncing = 10;
var mode = "classique";
var modes = ["classique","rebond","tempetes","poursuite"];
var timeoutID;
var multiplier = 1;
var proba = 7;

// programme

function rnd(max){
    return Math.floor(Math.floor(Math.random()*max));
}

function rndSpecial(){
    if (rnd(2) == 0) return -1;
    else return 1;
}

function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.setAttribute("width",W);
    canvas.setAttribute("height",H);
}

function monopole(){
    var nn = 0;
    courants.forEach(
        function(e,i){
            if (e > 0) nn += 1;
            else if (e < 0) nn -= 1;
        }
    );
    if (nn == -4 || nn == 4) return 1;
    else return 666;
}

function reInit(n = 0){
    point = [W/2,H/2,0,0,0];
    persos = [];
    for (var i = 0;i < 4;i ++){
        persos.push({"x":W/2+(i-2)*70,"y":H-25,"vx":0,"vy":0,"air":60,"j":0,"r":0,"dead":0,"fade":1});
    }
    courants = [0,0,0,0];
    deaths = 0;
    mode = modes[rnd(modes.length)];
    if (n == 0) initMode();
}

function initMode(){
    if (mode == "classique"){
        bouncing = 10;
        multiplier = 1;
        proba = 7;
    }
    else if (mode == "rebond"){
        bouncing = 100;
        multiplier = 1;
        proba = 7;
    }
    else if (mode == "tempetes"){
        bouncing = 15;
        multiplier = 3;
        proba = 14;
    }
    else if (mode == "poursuite"){
        bouncing = 10;
        multiplier = 1;
        proba = 7;
    }
    alertMode("mode " + mode);
    timeoutID = window.setTimeout(disalertMode, 2000);
}

function start(){
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;
    resize();
    reInit(1);
    for (var i = 0;i < 50;i ++){
        bulles.push({"x":rnd(W),"y":rnd(H),"vx":0,"s":rnd(8)+4,"d":rndSpecial(),"n":0,"vy":0});
    }
    //    Widget = require("wdg");
    document.addEventListener(
        "keydown",
        function (event){
            event.preventDefault();
            event.stopPropagation();
            keys[event.keyCode] = 1;
        }
    );
    document.addEventListener(
        "keyup",
        function (event){
            if (alerting == 1) disalert();
            event.preventDefault();
            event.stopPropagation();
            keys[event.keyCode] = 0;
        }
    );
    alert("Coincés au fond de l'océan, vous allez vous noyer. Sauf si vous parvenez à survivre en récupérant les points d'air blanc. Celui qui survivra le plus longtemps aura la victoire. j1 : w  j2 : espace  j3 : fleche du haut  j4 : 0");
    animation();
}

function animation(){
    var f = function(t) {
        paint(t);
        window.requestAnimationFrame(f);
    };
    window.requestAnimationFrame(f);
}

function paint(t){
    if (alerting == 0){
        persos.forEach(
            function(e,i){
                if (e.dead == 0){
                    e.air -= (t-t2)/1000;
                    if (e.air < 0) dead(i);
                    if (e.j == 0){
                        if (keys[controls[i]] == 1) {
                            e.vy = -20;
                            e.j = 1;
                        }
                    }
                    else {
                        if (keys[controls[i]] == 0) e.j = 0;
                    }
                    if (e.vy < 10) e.vy += 1;
                    if (e.vx > courants[Math.round(e.y/H*3)]*2) e.vx -= 1;
                    else if (e.vx < courants[Math.round(e.y/H*3)]*2) e.vx += 1;
                    e.r += e.vx/125;
                    e.x += e.vx/5;
                    e.y += e.vy/5;
                    if (e.y + 25 > H) e.y = H - 25;
                    else if (e.y - 25 < 0) {e.y = 25;e.vy = 1;}
                    if (e.x + 25 > W) e.x = W - 25;
                    else if (e.x - 25 < 0) e.x = 25;
                    persos.forEach(
                        function(f,j){
                            if (i != j && f.dead == 0){
                                if (Math.hypot(e.x-f.x,e.y-f.y) < 50){
                                    if (e.x > f.x) e.vx = bouncing;
                                    else if (e.x < f.x) e.vx = -bouncing;
                                    if (e.y > f.y) e.vy = bouncing;
                                    else if (e.y < f.y) e.vy = -bouncing;
                                }
                            }
                        }
                    );
                    if (Math.hypot(e.x-point[0],e.y-point[1]) < 75){
                        e.air += 10;
                        point[0] = rnd(W/2) + W/4;
                        point[1] = rnd(H);
                    }
                }
                else{
                    if (e.fade > 0) e.fade -= 0.01;
                    else if (e.fade <= 0 && e.fade > -5) {
                        deaths += 1;
                        var gagnant;
                        var victoire = ["jaune","bleu","rouge","vert"];
                        if (deaths == 3) {
                            persos.forEach(
                                function(e,i){
                                    if (e.dead == 0) gagnant = victoire[i];
                                }
                            );
                            if (gagnant == undefined) alert ("Fin du jeu mes amis ! C'est une belle égalité.");
                            else alert("Fin du jeu mes amis ! C'est le " + gagnant + " qui a gagné !!!!!!!!!!!!!");
                        }
                        e.fade = -10;
                    }
                }
            }
        );
    }
    if (rnd(50) < proba) {
        var h = rnd(4);
        var hh = (rnd(3)-1)*multiplier;
        courants[h] += hh;
        if (monopole() == 1) courants[h] -= hh*2;
    }
    drawFond();
    draw();
    t2 = t;
}

function draw() {
    ctx.fillStyle = "rgb(255,255,255)";
    for (var i = 0;i < 5;i++){
        ctx.globalAlpha = 1-point[2]/500-i*0.2;
        ctx.beginPath();
        ctx.arc(point[0],point[1],i*50+point[2]/2,-Math.PI,Math.PI);
        ctx.fill();
    }
    point[2] += 1;
    if (point[2] == 101) point[2] = 0;
    if (mode == "poursuite"){
        point[0] += point[3]/10;
        point[1] += point[4]/10;
        point[3] += rnd(3)-1;
        point[4] += rnd(3)-1;
        if (point[0] > W) point[0] = W;
        else if (point[0] < 0) point[0] = 0;
        if (point[1] > H) point[1] = H;
        else if (point[1] < 0) point[1] = 0;
    }
    persos.forEach(
        function(e,i){
            if (e.fade >= 0) ctx.globalAlpha = e.fade;
            else ctx.globalAlpha = 0;
            ctx.save();
            ctx.translate(e.x,e.y);
            ctx.rotate(e.r);
            ctx.drawImage(imgPersos[i],-25,-25);
            ctx.restore();
            if (e.air > 60) var cercle = Math.PI/2*3;
            else if(e.air <= 0) var cercle = -Math.PI/2;
            else var cercle = ((60-e.air)/60*Math.PI*2)-Math.PI/2;
            ctx.strokeStyle = "rgb(200,200,250)";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(e.x + 25,e.y-25,3,-Math.PI/2,cercle,true);
            ctx.stroke();
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(e.x + 25,e.y-25,6,-Math.PI,Math.PI,true);
            ctx.stroke();
        }
    );
    ctx.globalAlpha = 1;
}

function drawFond(){
    for (var i = 0;i < 10;i++){
        ctx.fillStyle = "rgb(" + (15 - i) + "," + (15 - i) + "," + (95 - i*2) + ")";
        ctx.fillRect(0,i*(H/10),W,H/10);
    }
    ctx.strokeStyle = "rgb(200,200,250)";
    ctx.fillStyle = "rgb(50,50,100)";
    ctx.globalAlpha = 0.1;
    bulles.forEach(
        function(e){
            ctx.beginPath();
            ctx.arc(e.x,e.y+e.vy,e.s,-Math.PI,Math.PI);
            ctx.stroke();
            ctx.fill();
            e.x += courants[Math.round(e.y/H*3)]/5;
            e.vy += e.n/5;
            e.n += e.d/20;
            if (Math.abs(e.n) > 2) e.d = e.d * -1;
            if (e.x < -20) e.x = W + 15;
            else if (e.x > W + 20) e.x = -15;
        }
    );
    ctx.globalAlpha = 1;
}

function dead(n){
    persos[n].dead = 1;
}
