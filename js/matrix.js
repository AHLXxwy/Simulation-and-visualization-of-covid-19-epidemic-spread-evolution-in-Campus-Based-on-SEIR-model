
var width = 400;
var height = 400;
var svgm = d3.select("#Mt")
                    .append("svg")
                     .attr("width",width)
                    .attr("height",height)
//grid
//horizon
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 15)
            .attr("x2", 350)
            .attr("y2", 15)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 76)
            .attr("x2", 350)
            .attr("y2", 76)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 137)
            .attr("x2", 350)
            .attr("y2", 137)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 198)
            .attr("x2", 350)
            .attr("y2", 198)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 259)
            .attr("x2", 350)
            .attr("y2", 259)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 320)
            .attr("x2", 350)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");

//direction            
svgm.append("line")
            .attr("x1", 10)
            .attr("y1", 15)
            .attr("x2", 10)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 78)
            .attr("y1", 15)
            .attr("x2", 78)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 146)
            .attr("y1", 15)
            .attr("x2", 146)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 214)
            .attr("y1", 15)
            .attr("x2", 214)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 282)
            .attr("y1", 15)
            .attr("x2", 282)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");
svgm.append("line")
            .attr("x1", 350)
            .attr("y1", 15)
            .attr("x2", 350)
            .attr("y2", 320)
            .attr("stroke", "white")
            .attr("stroke-width", "1px");

//text
//horizon
svgm.append('text')
        .text('Stu')
        .attr("x",15)
        .attr('y',335)
        .style("font-size", "12px")
        .attr("stroke","white")
svgm.append('text')
        .text('Teacher')
        .attr("x",80)
        .attr('y',335)
        .style("font-size", "12px")
        .attr("stroke","white")
svgm.append('text')
        .text('Guard')
        .attr("x",150)
        .attr('y',335)
        .style("font-size", "12px")
        .attr("stroke","white")
svgm.append('text')
        .text('CateenStaff')
        .attr("x",220)
        .attr('y',335)
        .style("font-size", "12px")
        .attr("stroke","white")
svgm.append('text')
        .text('DomAdmin')
        .attr("x",290)
        .attr('y',335)
        .style("font-size", "12px")
        .attr("stroke","white")
//direction
svgm.append('text')
        .text('Stu')
        .attr("x",360)
        .attr('y',20)
        .attr("font-size", "12px")
        .attr("style", " writing-mode: tb; glyph-orientation-vertical: 0")
        .attr("stroke","white")
svgm.append('text')
        .text('Teacher')
        .attr("x",360)
        .attr('y',83)
        .attr("font-size", "12px")
        .attr("style", " writing-mode: tb; glyph-orientation-vertical: 0")
        .attr("stroke","white")
svgm.append('text')
        .text('Guard')
        .attr("x",360)
        .attr('y',146)
        .attr("font-size", "12px")
        .attr("style", " writing-mode: tb; glyph-orientation-vertical: 0")
        .attr("stroke","white")
svgm.append('text')
        .text('CateenStaff')
        .attr("x",360)
        .attr('y',204)
        .attr("font-size", "12px")
        .attr("style", " writing-mode: tb; glyph-orientation-vertical: 0")
        .attr("stroke","white")
svgm.append('text')
        .text('DomAdmin')
        .attr("x",360)
        .attr('y',275)
        .attr("font-size", "12px")
        .attr("style", " writing-mode: tb; glyph-orientation-vertical: 0")
        .attr("stroke","white")
//cicrle
var dataprob=[12,8,20,14,19,
            17,5,6,12,19,
            24,10,9,6,15,
            18,17,16,10,7,
            10,8,3,5,6,12
            ]
var datadiffer=[-0.19,0.20,0.8,0.7,0.2,01,0.20,0.34,0.17,-0.18]
var max
for(var m=0;m<datadiffer.length;m++){
    min=datadiffer[0];
    max=datadiffer[0];
    if(datadiffer[m]>max)
    max=datadiffer[m]
    if(datadiffer[m]<min)
    min=datadiffer[m]
}
var k=0
var colorset=['yellow','black'];
for(var i=0;i<5;i++){
    for(var j=0;j<5;j++){
svgm.append("circle")         
   .attr("cx",(i*70)+35)          
   .attr("cy",(j*62)+48)         
   .attr("r",dataprob[k]*0.7)  
   .attr("fill", colorset[k%2])      
   .attr("stroke", "orange")       //给各圆边涂成橘黄
   .attr("stroke-width", 1)
   .attr("id","c"+(i+1).toString()+(j+1).toString());
   k++;
    }

}