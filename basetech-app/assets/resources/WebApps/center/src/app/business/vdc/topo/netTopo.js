define(["tiny-lib/angular", "tiny-lib/raphael", "app/services/icons",
	"app/business/vdc/topo/ajaxTopo"], 
	function (angular, Raphael, icons, ajax) {
    "use strict";

    var ctrl = ["$scope", "$q", function ($scope, $q) {

	var svgPath = 'app/services/icons/';
	var imgPath = '../theme/default/images/';
	
	var paper = Raphael("netTopo", 900, 900);
	
	$scope.name = "";
	$scope.cpu = {used:0,total:0};
	$scope.memory = {used:0,total:0};
	$scope.store = {used:0,total:0};
	
	var fm = {
		type: "root",
		text: " ",
		useChild: true
	};
	
	function getChild(node, callback){
		function onOK(data){
			node.childData = data;
			callback(data);
		}
		
		var map = {
			root : function(node, callback){
				return ajax.topo.getFC($q, onOK);
			},
			zone : function(node, callback){
				return ajax.topo.getAZ($q, node.id, onOK);
			},
			az : function(node, callback){
				return ajax.topo.getCluster($q, node.id, onOK);
			},
			cluster : function(node, onOK){
				return callback([]);
			}
		}
		
		var func = map[node.type];
		if (func){
			return func(node, callback);
		}
		
		return [];
	}
		
	var Style = {
		root : {
			img : imgPath+'subjunctive.png',
			width: 60,
			height: 60
		},
		zone : {
			img : imgPath+'resource-partitions.png',
			width: 30,
			height: 30
		},
		az : {
			img : imgPath+'virtual-cluster.png',
			width: 30,
			height: 30
		},
		cluster : {
			img : imgPath+'vdc.png',
			width: 30,
			height: 30
		},
		
		init : function(node, key){
			var s = Style[key];
			if (s){
				node.style = s;
			}
		}
	};

	var Point = {
		base : {x:300, y:60},
		arc : function(p, R, arc){
			return {x: p.x + (R * Math.cos(arc)), 
				y: p.y + (R * Math.sin(arc))};
		},
		radius : function(width, height){
			return Math.sqrt(Math.pow(width/2,2),Math.pow(height/2,2));
		},
		offset : function(p, x, y){
			var pos = new Object();
			pos.x = p.x + (x||0);
			pos.y = p.y + (y||0);
			return pos;
		}
	}
	
	var Draw = {
		img : function(node, pos, set){
			if (null == node.style){
				Style.init(node, node.type);
			}
			var s = node.style;
			if (null == s){
				return;
			}
			
			set = set || paper.set();
			var c = paper.image(s.img, pos.x-(s.width/2), pos.y-(s.height/2), s.width, s.height);
			var t = paper.text(pos.x+(s.width/2)+10, pos.y, node.text||node.type).attr("text-anchor","start");
			set.push(c,t)
			return set;
		},
		connect : function(p1,p2){
			var c = paper.path(["M", p1.x,p1.y, "C", p1.x,(p2.y+p2.y)/2, p2.x,(p1.y+p1.y)/2, p2.x,p2.y]);
			c.attr({
				"stroke": "#33a6ff",
                "stroke-width": "2",
				"stroke-linecapstring": "butt",
				"stroke-linejoin": "round"
			})
			return c;
		},
		hide : function(pos){
			var c = paper.circle(pos.x, pos.y, 4);
			c.attr({
				fill: "#33a6ff",
				"stroke": "#33a6ff",
                "stroke-width": "2",
			});
			return c;
		},
		
		drawNode : function(node, pos, set){
			set = set || paper.set();
			var s = Draw.img(node, pos);
			if (!s){
				return;
			}
			
			set.push(s);
			node.pos = Point.offset(pos);
			node.child = paper.set();
			set.push(node.child);
			
			node.showChild = false;
			Draw.hideChild(node);
			
			node.toggle = function(){
				node.showChild = !node.showChild;
				node.showChild ? Draw.showChild(node) : Draw.hideChild(node);
			}
			
			node.init = function(){
				$scope.name = "";
				$scope.cpu = null;
				$scope.memory = null;
				$scope.store = null;
				$scope.ip = null;
				$scope.vlan = null;
				$scope.firewall = null;
				$scope.network = null;
				setTimeout(function(){
					$scope.$digest();
				},0)
			}
			
			node.update = function(){
				$scope.name = node.name||node.text;
				if (node.useChild && node.childNode && node.childNode.length){
					node.cpu = {used:0,total:0};
					node.memory = {used:0,total:0};
					node.store = {used:0,total:0};
					node.ip = {used:0,total:0};
					node.vlan = {used:0,total:0};
					node.firewall = {used:0,total:0};
					for (var i in node.childNode){
						var e = node.childNode[i];
						if (e.cpu){
							node.cpu.used += e.cpu.used;
							node.cpu.total += e.cpu.total;
						}
						if (e.memory){
							node.memory.used += e.memory.used;
							node.memory.total += e.memory.total;
						}
						if (e.store){
							node.store.used += e.store.used;
							node.store.total += e.store.total;
						}
						if (e.ip){
							node.ip.used += e.ip.used;
							node.ip.total += e.ip.total;
						}
						if (e.vlan){
							node.vlan.used += e.vlan.used;
							node.vlan.total += e.vlan.total;
						}
						if (e.firewall){
							node.firewall.used += e.firewall.used;
							node.firewall.total += e.firewall.total;
						}
						$scope.network = e.ip && e.vlan && e.firewall;
					}
				}else{
					$scope.network = node.ip && node.vlan && node.firewall;
				}
				$scope.cpu = node.cpu;
				$scope.memory = node.memory;
				$scope.store = node.store;
				$scope.ip = node.ip;
				$scope.vlan = node.vlan;
				$scope.firewall = node.firewall;
				setTimeout(function(){
					$scope.$digest();
				},0)
			}
			
			s.mouseover(function(){
				node.update();
			});

			s.click(function(){
				node.toggle();
			});

			return set;
		},
		
		showChild : function(n){
			n.child.remove();
			n.child.clear();
			
			if (n.father){
				for (var i in n.father.childNode){
					var e = n.father.childNode[i];
					if (n === e){
						continue;
					}
					
					if (e.showChild){
						e.toggle();
					}
				}
			}
			
			n.init();
			getChild(n, function(child){
				var i = 0;
				for (; i < child.length; i++){
					var e = child[i];
					e.father = n;
					var p = Point.offset(n.pos, (n.style.width+80)*(i-(child.length-1)/2), 120);
					Draw.drawNode(e, p, n.child);
					var l = Draw.connect(Point.offset(n.pos, 0, n.style.height/2),
						Point.offset(p, 0, (0-e.style.height/2)));
					n.child.push(l);
				}
				n.childNode = child;
				n.update();
			});
		},
		
		hideChild : function(n){
			n.child.remove();
			n.child.clear();
			var i = 0;
			for (; i < 3; i++){
				var c = Draw.hide(Point.offset(n.pos, (i-1)*15, 10 + n.style.height/2));
				n.child.push(c);
			}
		},
		
		tree : function(parent, cur, child){
			var pos = Point.base;
			var last = null;
			
			for (var e in parent){
				var n = parent[e];
				var s = Style[n.type];
				if (null == s){
					continue;
				}
				
				if (null != last){
					Draw.connect(last, Point.offset(pos, 0, 0-(s.height/2)));
				}
				
				Draw.img(n, pos);
				last = Point.offset(pos, 0, s.height/2);
				pos = Point.offset(last, 0, 60);
			}
			
			Draw.connect(last, Point.offset(pos, 0, 0-(s.height/2)));
			var c = Draw.img(cur, pos);
			var s = Style[cur.type];
			
			function childHide(){
				var st = paper.set();
				var i = 0;;
				for (; i < 5;i++){
					var c = Draw.hide(
						Point.arc(pos, 10+Point.radius(s.width,s.height), Math.PI*(i+1)/6));
					st.push(c);
				}
				return st;
			}
			
			function childShow(child){
				var st = paper.set();
				var i = 0;
				var R = 180;
				for (;(i < child.length && i < 5);i++){
					var e = child[i];
					var cs = Style[e.type];
					var y = Point.offset(pos, 120 * (i - 2), 90);
					var l = Draw.connect(
						Point.arc(pos, Point.radius(s.width,s.height), Math.PI*(i+1)/6), 
						Point.arc(pos, R-Point.radius(cs.width,cs.height), Math.PI*(i+1)/6)
						);
					var c = Draw.img(e, 
						Point.arc(pos, R, Math.PI*(i+1)/6)
						);
					st.push(c,l);
				}
				return st;
			}
			
			function exp(){
				if (cur.expand){
					cur.expand.remove();
					cur.expand = null;
					cur.hide = childHide();
				}else{
					cur.expand = childShow(child);
					if (cur.hide){
						cur.hide.remove();
						cur.hide = null;
					}
				}
			}
			c.click(exp)
			exp();
		}
	}
	
	Draw.drawNode(fm, Point.base);
	fm.toggle();

	}];
    return ctrl;
});