const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const margin = {top: 20, right: 100, bottom: 50, left: 75}
let width = window.innerWidth*.85-margin.left-margin.right,
    height = 700-margin.top-margin.bottom;

let dopingColor=["#f9a83e","#93ffff"]
let dateFormat = d3.timeParse("%Y-%m-%d")//initial parse to d3
let formatTime = d3.timeFormat("%B %Y");//parse time out from d3 for toolTip
let axistFormatTime = d3.timeFormat("%Y");//parse time out from d3 for xaxis
let gdpFormat=d3.format("$");//format for toolTip

let x = d3.scaleLinear()//x axis scale for d3 interpretation
    .range([width,0]);
let y = d3.scaleLinear()//y axis scale for d3 interpretation
    .range([0,height]);
let x2 = d3.scaleLinear()//scale used only for x axis display purposes
    .domain([0, 200])
    .range([width,0]);
let xAxis = d3.axisBottom(x)//xaxis display properties
let yAxis = d3.axisLeft(y)//yaxis display properties
            .tickValues([1, 5, 10, 15, 20, 25, 30,35])

let toolTipDiv = d3.select("body").append("div")//toolTip div definition, definition in css sheet would not work for me???
            .attr("class", "toolTip")
            .style("position", "absolute")
            .style("padding", "5px")
            .style("color", "darkgreen")
            .style("background-color", "white")
            .style("font-size", "18px")
            .style("border-radius", "3px");

let chart = d3.select(".chart")//main chart definition
    .attr("width", width + margin.left + margin.right)//margins added for axis
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url,function(error,doperData){//use d3's own json capabilites to get data
  if (error) throw error;
  //resturnture data in a format d3 can understand, object{x,y} per data point


  let transposedDoper = doperData.map(function(d){
    let val={}
    val.timeDiff = d.Seconds-2210
    val.rank = d.Place
    val.name = d.Name
    val.nationality = d.Nationality
    val.winDetail= "Year: "+d.Year + ", Time: " + d.Time
    if(d.Doping!==""){val.doping = dopingColor[0]}
    else{val.doping = dopingColor[1]}
    val.notes=d.Doping
    return val
  })

  x.domain(d3.extent(transposedDoper, function(d) { return d.timeDiff; })).nice();
  y.domain(d3.extent(transposedDoper, function(d) { return d.rank; })).nice();
  //set domains for x an y scales per tutorial
  //x.domain(transposedDoper.map(function(d) { return d.timeDiff; }));
  //y.domain(transposedDoper.map(function(d) { return d.rank; }));



  let scatter = chart.selectAll("g")//d3 selects "future" g elements to draw on
    .data(transposedDoper)
    .enter().append("circle")
    .attr("r",6)
    .attr("cx",function(d,i) {return x(d.timeDiff)})
    .attr("cy", function(d,i) {return y(d.rank);})
    .attr("fill", function(d,i) {return d.doping;})

    .on("mouseover", function(d) {//tool tip functionality
       toolTipDiv.html("<strong>"+d.name +" : " + d.nationality +"</strong><br/>"+d.winDetail+"<br/>"+d.notes)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY+40) + "px")
         .style("visibility", "visible");
       })
     .on("mouseout", function(d) {
       toolTipDiv.style("visibility", "hidden");
       });

  let bNames = chart.selectAll("g")
    .data(transposedDoper)
    .enter().append("text")
    .attr("x",function(d,i) {return x(d.timeDiff)+10})
    .attr("y", function(d,i) {return y(d.rank)+4;})
    .attr("text-anchor", "right")
    .style("font-size", "10px")
    .style("fill", "white")
    .text(function(d,i) {return d.name})

  //legends below
  chart.append("circle")
    .attr("r",6)
    .attr("cx",width/1.2)
    .attr("cy", height/2)
    .attr("fill", dopingColor[0])
  chart.append("text")//add title
        .attr("x", width/1.18)
        .attr("y", height/1.97)
        .attr("text-anchor", "right")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Riders with doping allegations")
  chart.append("circle")
    .attr("r",6)
    .attr("cx",width/1.2)
    .attr("cy", height/1.8)
    .attr("fill", dopingColor[1])
  chart.append("text")//add title
        .attr("x", width/1.18)
        .attr("y", height/1.77)
        .attr("text-anchor", "right")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("No doping allegations")


  chart.append("g")//add xaxis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height*1.05 + ")")
      .call(xAxis);
  chart.append("g")//add yaxis
      .attr("class", "y axis")
      .attr("transform", "translate(-30,0)")
      .call(yAxis);

  //titles and axis labels
  chart.append("text")//add title
        .attr("x", (width / 2))
        .attr("y", 2)
        .attr("text-anchor", "middle")
        .style("font-size", (width/38))
        .style("fill", "white")
        .style("cursor","pointer")
        .style("href",url)
        .text("Doping in Professional Bicycle Racing")
        .on("click",function(){window.open(url,"_blank")})
  chart.append("text")//add y axis label
        .attr("transform", "translate(0," + height*1.05 + ")")
        .attr("transform", "rotate(-90)")
        .attr("x",-100)
        .attr("y",-5)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "white")
        .text("Ranking");
  chart.append("text")//add y axis label
        .attr("y", height)
        .attr("x",height-75)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "white")
        .text("Seconds Behind Fastest Time");
})
