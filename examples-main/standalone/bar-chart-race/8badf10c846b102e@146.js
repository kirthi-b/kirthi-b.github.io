function _1(md){return(
md`# Sankey With Animated Gradients

Hover over a node to see the gradient animate.`
)}

function chart(d3,DOM,width,height,graph,margin,format,sankey,arrow,duration)
{
  const svg = d3.select(DOM.svg(width, height));
  
  const defs = svg.append("defs");
  
  // Add definitions for all of the linear gradients.
  const gradients = defs.selectAll("linearGradient")
    .data(graph.links)
    .join("linearGradient")
    .attr("id", d => d.gradient.id)
  gradients.append("stop").attr("offset", 0.0).attr("stop-color", d => d.source.color);
  gradients.append("stop").attr("offset", 1.0).attr("stop-color", d => d.target.color);
    
  // Add a g.view for holding the sankey diagram.
  const view = svg.append("g")
    .classed("view", true)
    .attr("transform", `translate(${margin}, ${margin})`);
  
  // Define the nodes.
  const nodes = view.selectAll("rect.node")
    .data(graph.nodes)
    .join("rect")
    .classed("node", true)
    .attr("id", d => `node-${d.index}`)
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => Math.max(1, d.y1 - d.y0))
    .attr("fill", d => d.color)
    .attr("opacity", 0.9);
  
  // Add titles for node hover effects.
  nodes.append("title").text(d => `${d.name}\n${format(d.value)}`);
  
  // Add text labels.
  view.selectAll("text.node")
    .data(graph.nodes)
    .join("text")
    .classed("node", true)
    .attr("x", d => d.x1)
    .attr("dx", 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("font-size", 10)
    .attr("font-family", "Arial, sans-serif")
    .text(d => d.name)
    .filter(d => d.x1 > width / 2)
    .attr("x", d => d.x0)
    .attr("dx", -6)
    .attr("text-anchor", "end");
  
  // Define the gray links.
  const links = view.selectAll("path.link")
    .data(graph.links)
    .join("path")
    .classed("link", true)
    .attr("d", sankey.sankeyLinkHorizontal())
    .attr("stroke", "black")
    .attr("stroke-opacity", 0.1)
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("fill", "none");
  
  // Add <title> hover effect on links.
  links.append("title").text(d => `${d.source.name} ${arrow} ${d.target.name}\n${format(d.value)}`);
    
  // Define the default dash behavior for colored gradients.
  function setDash(link) {
    let el = view.select(`#${link.path.id}`);
    let length = el.node().getTotalLength();
    el.attr("stroke-dasharray", `${length} ${length}`)
      .attr("stroke-dashoffset", length);
  }
  
  const gradientLinks = view.selectAll("path.gradient-link")
    .data(graph.links)
    .join("path")
    .classed("gradient-link", true)
    .attr("id", d => d.path.id)
    .attr("d", sankey.sankeyLinkHorizontal())
    .attr("stroke", d => d.gradient)
    .attr("stroke-opacity", 0)
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("fill", "none")
    .each(setDash);
  
  function branchAnimate(node) {
    let links = view.selectAll("path.gradient-link")
      .filter((link) => {
        return node.sourceLinks.indexOf(link) !== -1;
      });
    let nextNodes = [];
    links.each((link) => {
      nextNodes.push(link.target);
    });
    links.attr("stroke-opacity", 0.5)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .on("end", () => {
        nextNodes.forEach((node) => {
          branchAnimate(node);
        });
      });
  }
  
  function branchClear() {
    gradientLinks.transition();
    gradientLinks.attr("stroke-opactiy", 0)
      .each(setDash);
  }

  nodes.on("mouseover", branchAnimate)
    .on("mouseout", branchClear);
  
  return svg.node();
}


function _graph(layout,energy,color,DOM)
{
  const graph = layout(energy);
  
  graph.nodes.forEach((node) => {
    node.color = color((Math.random() * (1 - 0) + 0).toFixed(2));
  });
  
  graph.links.forEach((link) => {
    link.gradient = DOM.uid("gradient");
    link.path = DOM.uid("path");
  });
  
  return graph;
}


function _layout(sankey,size,nodePadding,nodeWidth){return(
sankey.sankey()
  .size(size)
  .nodePadding(nodePadding)
  .nodeWidth(nodeWidth)
)}

function _format(d3){return(
(value) => {
  let f = d3.format(",.0f");
  return f(value) + " TWh";
}
)}

function _color(d3){return(
(value) => {
  return d3.interpolateViridis(value);
}
)}

function _energy(){return(
{"nodes":[
{"name":"Automated License Plate Readers"},
{"name":"Body-worn Cameras"},
{"name":"Body-worn cameras"},
{"name":"Camera Registry"},
{"name":"Cell-Site Simulator"},
{"name":"Drones"},
{"name":"Face Recognition"},
{"name":"Gunshot detection"},
{"name":"Predictive Policing"},
{"name":"Real-Time Crime Center"},
{"name":"Ring/Neighbors Partnership"},
{"name":"Video Analytics/Computer Vision"},
{"name":"Sheriff"},
{"name":"Police"},
{"name":"Constables"},
{"name":"State Police"},
{"name":"Fusion Center"},
{"name":"District Attorney"},
{"name":"Tax Board"},
{"name":"State Agency"},
{"name":"Task Force"},
{"name":"Probation"},
{"name":"Environmental Services Enforcement"},
{"name":"NPS"},
{"name":"State police"},
{"name":"DHS"},
{"name":"Corrections"},
{"name":"Crash Team"},
{"name":"Public Safety"},
{"name":"Homeland Security"},
{"name":"Attorney General"},
{"name":"Juvenile"},
{"name":"School District"},
{"name":"Parks"},
{"name":"Prosecutor"},
{"name":"Medical Examiner"},
{"name":"Transit Police"},
],
"links":[
{"source":0,"target":13,"value":322},
{"source":0,"target":14,"value":1},
{"source":0,"target":17,"value":1},
{"source":0,"target":16,"value":2},
{"source":0,"target":12,"value":46},
{"source":0,"target":15,"value":1},
{"source":0,"target":20,"value":1},
{"source":0,"target":18,"value":1},
{"source":1,"target":14,"value":3},
{"source":1,"target":22,"value":2},
{"source":1,"target":23,"value":1},
{"source":1,"target":13,"value":335},
{"source":1,"target":21,"value":1},
{"source":1,"target":12,"value":75},
{"source":1,"target":19,"value":1},
{"source":2,"target":13,"value":2},
{"source":3,"target":13,"value":143},
{"source":3,"target":12,"value":30},
{"source":4,"target":25,"value":1},
{"source":4,"target":13,"value":21},
{"source":4,"target":12,"value":5},
{"source":4,"target":15,"value":3},
{"source":4,"target":24,"value":4},
{"source":5,"target":26,"value":2},
{"source":5,"target":27,"value":1},
{"source":5,"target":17,"value":4},
{"source":5,"target":29,"value":1},
{"source":5,"target":33,"value":1},
{"source":5,"target":13,"value":361},
{"source":5,"target":28,"value":3},
{"source":5,"target":12,"value":316},
{"source":5,"target":15,"value":16},
{"source":5,"target":24,"value":15},
{"source":6,"target":30,"value":1},
{"source":6,"target":14,"value":1},
{"source":6,"target":26,"value":2},
{"source":6,"target":16,"value":1},
{"source":6,"target":31,"value":1},
{"source":6,"target":35,"value":1},
{"source":6,"target":13,"value":218},
{"source":6,"target":32,"value":1},
{"source":6,"target":12,"value":61},
{"source":6,"target":15,"value":13},
{"source":7,"target":13,"value":89},
{"source":7,"target":34,"value":1},
{"source":7,"target":12,"value":3},
{"source":8,"target":13,"value":19},
{"source":8,"target":12,"value":1},
{"source":9,"target":13,"value":6},
{"source":9,"target":12,"value":1},
{"source":10,"target":14,"value":1},
{"source":10,"target":17,"value":1},
{"source":10,"target":13,"value":1151},
{"source":10,"target":12,"value":179},
{"source":11,"target":13,"value":20},
{"source":11,"target":12,"value":1},
{"source":11,"target":19,"value":1},
{"source":11,"target":36,"value":1}
]}
)}

function _size(width,margin,height){return(
[width - 2 * margin, height - 2 * margin]
)}

function _height(){return(
600
)}

function _margin(){return(
10
)}

function _nodeWidth(){return(
20
)}

function _nodePadding(){return(
10
)}

function _duration(){return(
250
)}

function _arrow(){return(
"\u2192"
)}

function _d3(require){return(
require("d3@5.9")
)}

function _sankey(require){return(
require("d3-sankey@0.12")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("svg")).define("svg", ["d3","DOM","width","height","graph","margin","format","sankey","arrow","duration"], _svg);
  main.variable(observer("graph")).define("graph", ["layout","energy","color","DOM"], _graph);
  main.variable(observer("layout")).define("layout", ["sankey","size","nodePadding","nodeWidth"], _layout);
  main.variable(observer("format")).define("format", ["d3"], _format);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("energy")).define("energy", _energy);
  main.variable(observer("size")).define("size", ["width","margin","height"], _size);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("nodeWidth")).define("nodeWidth", _nodeWidth);
  main.variable(observer("nodePadding")).define("nodePadding", _nodePadding);
  main.variable(observer("duration")).define("duration", _duration);
  main.variable(observer("arrow")).define("arrow", _arrow);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("sankey")).define("sankey", ["require"], _sankey);
  return main;
}
