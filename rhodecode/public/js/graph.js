// branch_renderer.js - Rendering of branch DAGs on the client side
//
// Copyright 2010 Marcin Kuzminski <marcin AT python-works DOT com>
// Copyright 2008 Jesper Noehr <jesper AT noehr DOT org>
// Copyright 2008 Dirkjan Ochtman <dirkjan AT ochtman DOT nl>
// Copyright 2006 Alexander Schremmer <alex AT alexanderweb DOT de>
//
// derived from code written by Scott James Remnant <scott@ubuntu.com>
// Copyright 2005 Canonical Ltd.
//
// This software may be used and distributed according to the terms
// of the GNU General Public License, incorporated herein by reference.

var colors = [
	[ 1.0, 0.0, 0.0 ],
	[ 1.0, 1.0, 0.0 ],
	[ 0.0, 1.0, 0.0 ],
	[ 0.0, 1.0, 1.0 ],
	[ 0.0, 0.0, 1.0 ],
	[ 1.0, 0.0, 1.0 ],
	[ 1.0, 1.0, 0.0 ],
	[ 0.0, 0.0, 0.0 ]
];

function BranchRenderer() {
	
	this.canvas = document.getElementById("graph_canvas");
	
	if (!document.createElement("canvas").getContext)
		this.canvas = window.G_vmlCanvasManager.initElement(this.canvas);
	this.ctx = this.canvas.getContext('2d');
	this.ctx.strokeStyle = 'rgb(0, 0, 0)';
	this.ctx.fillStyle = 'rgb(0, 0, 0)';
	this.cur = [0, 0];
	this.line_width = 2.0;
	this.dot_radius = 3.5;
	
	this.setColor = function(color, bg, fg) {
		color %= colors.length;
		var red = (colors[color][0] * fg) || bg;
		var green = (colors[color][1] * fg) || bg;
		var blue = (colors[color][2] * fg) || bg;
		red = Math.round(red * 255);
		green = Math.round(green * 255);
		blue = Math.round(blue * 255);
		var s = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
		this.ctx.strokeStyle = s;
		this.ctx.fillStyle = s;
	}

	this.render = function(data,canvasWidth,lineCount) {
		var idx = 1;
		var rela = document.getElementById('graph');

		if (lineCount == 0)
			lineCount = 1;

		var edge_pad = this.dot_radius + 2;
		var box_size = Math.min(18, Math.floor((canvasWidth - edge_pad*2)/(lineCount)));
		var base_x = canvasWidth - edge_pad;

		for (var i in data) {

			var row = document.getElementById("chg_"+idx);
			if (row == null)
				continue;
			var	next = document.getElementById("chg_"+(idx+1));
			var extra = 0;
			
			cur = data[i];
			node = cur[1];
			in_l = cur[2];

			var rowY = row.offsetTop + row.offsetHeight/2 - rela.offsetTop;
			var nextY = (next == null) ? rowY + row.offsetHeight/2 : next.offsetTop + next.offsetHeight/2 - rela.offsetTop;

			for (var j in in_l) {
				
				line = in_l[j];
				start = line[0];
				end = line[1];
				color = line[2];

				this.setColor(color, 0.0, 0.65);

				
				x = base_x - box_size * start;
				
				this.ctx.lineWidth=this.line_width;
				this.ctx.beginPath();
				this.ctx.moveTo(x, rowY);

				if (start == end)
				{
					this.ctx.lineTo(x,nextY+extra,3);
				}
				else
				{
					var x2 = base_x - box_size * end;
					var ymid = (rowY+nextY) / 2;
					this.ctx.bezierCurveTo (x,ymid,x2,ymid,x2,nextY);
				}
				this.ctx.stroke();
			}
			
			column = node[0];
			color = node[1];
			
			radius = this.dot_radius;

			x = base_x - box_size * column;
		
			this.ctx.beginPath();
			this.setColor(color, 0.25, 0.75);
			this.ctx.arc(x, rowY, radius, 0, Math.PI * 2, true);
			this.ctx.fill();
			
			idx++;
		}
				
	}

}
