// set the dimensions and margins of the graph
let margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data
let questions = [
  d3.csv("../data/nature.csv"),
  d3.csv("../data/society.csv"),
  d3.csv("../data/math.csv"),  
  d3.csv("../data/chinese.csv"),
  d3.csv("../data/english.csv"),

];


let subjectsArray = [{subject:0 , name: "自然"},
                     {subject:1 , name: "社會"},
                     {subject:2 , name: "數學"},
                     {subject:3 , name: "國文"},
                     {subject:4 , name: "英語"}]


let allData = [];
let subject = 0;
let time = 0;
let year = "全部";
let intervalBeat;

//OUTS: add a Year label to svg
let timeText = svg
  .append("text")
  .attr("x", width / 2 -30)
  .attr("y", margin.top + 15) ;





//把讀入的放入 allData
Promise.all(questions).then(function (data) {
  data.forEach(function (eachDataset) {
    eachDataset.forEach(function (d) {
      //d["question"] = +d["question"];
      d["dis"] = +d["dis"];
      d["pass"] = +d["pass"];      
      //d["year"] = new Date(d["year"]);
      
    });
  });
  allData = data;
  updateChart(allData, subject, year);
});




//Add in event listener for indicator choice.
$("#subjectChoice").on("change", function () {
  subject =
    $("#subjectChoice").val() === "nature"
      ? 0
      : $("#subjectChoice").val() === "soceity"
      ? 1
      : $("#subjectChoice").val() === "math"
      ? 2
      : $("#subjectChoice").val() === "chinese"
      ? 3
      : $("#subjectChoice").val() === "english"
      ? 4
      : null;
  updateChart(allData, subject, year);
});

//Add in event listener for year choice.
$("#yearChoice").on("change", function () {
  year =
    $("#yearChoice").val() === "全部"
      ? "全部"
      
      : $("#yearChoice").val() === "111"
      ? "111"
      : $("#yearChoice").val() === "110"
      ? "110"
      : $("#yearChoice").val() === "109"
      ? "109"
      : $("#yearChoice").val() === "108"
      ? "108"
      : $("#yearChoice").val() === "107"
      ? "107"      
      : $("#yearChoice").val() === "106"
      ? "106"            
      : $("#yearChoice").val() === "105"
      ? "105" 
      : $("#yearChoice").val() === "104"
      ? "104"                  
      : null;



  updateChart(allData, subject, year) ;

});

//Add in event listener for playing
$("#play").on("click", function () {
  intervalBeat = setInterval(pressPlay, 500);
});

//Add in event listener for pausing
$("#pause").on("click", function () {
  clearInterval(intervalBeat);
});



function pressPlay() {
  if (time < 6) {
    time += 1;
  } else {
    time = 0;
  }

  year = 104 + time;
  year = year.toString();
  updateChart(allData, subject, year);
}

//Function that builds the right chart depending on user choice on website:
function updateChart(someData, subject, year) {
  let dataNature = d3
    .nest()
    .entries(someData[0]);

  let dataSoceity = d3
    .nest()
    .entries(someData[1]);

  let dataMath = d3
    .nest()
    .entries(someData[2]);

  let dataChinese = d3
    .nest()
    .entries(someData[3]);

  let dataEnglish = d3
    .nest()
    .entries(someData[4]);
    
    
  questionsData = [dataNature,dataSoceity,dataMath,dataChinese,dataEnglish];
  
  let filteredData = questionsData[subject]

  filteredData =
    year === "全部"
    ? filteredData
    : filteredData.filter( function(ele){
       return ele.year == year
    });


  //time = year - 104;

  
  //let filteredData = questionsData[subject][time]["values"];
  

  subjectName = subjectsArray[subject]["name"];

  timeText.text( subjectName + "   " + year + "年度" );

  // Add X axis
  let x = d3.scaleLinear().domain([0, 1]).range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //Add x-axis label:
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
    )
    .attr("class", "subject")
    .style("text-anchor", "middle")
    .text("通過率");



  // add the x gridlines
  svg
    .append("g")			
    .attr("class", "grid")
    .call(d3.axisTop(x)
          .ticks(5)
          .tickSize(-height)
          .tickFormat("")
    )




  //svg.selectAll(".subject").text(subject);

  // Add Y axis
  let y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  //Add y-axis label:
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("鑑別度");
    

  // add the y gridlines
  svg
    .append("g")			
    .attr("class", "grid")
    .call(d3.axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat("")
    )


    

  // Color scale: give me a year name, I return a color
  let color = d3
    .scaleOrdinal()
    .domain([
      "111",    
      "110",
      "109",
      "108",
      "107",
      "106",
      "105",
      "104"                 
    ])
    .range(["#EDBB99", "#EDE599", "#CBED99", "#A1ED99", "#99EDBB", "#99EDE5", "#009999", "#005599"]);

  // JOIN new data with old elements.
  var circles = svg.selectAll("circle").data(filteredData, function (d) {
    return d["year"];
  });


  // EXIT old elements not present in new data.
  circles.exit().attr("class", "exit").remove();

  // ENTER new elements present in new data.
  circles
    .enter()
    .append("circle")
    .attr("class", "enter")
    .attr("fill", function (d) {
      return color(d["year"]);
    })
    .merge(circles)
    .attr("cy", function (d) {
      return y(d["dis"]);
    })
    .attr("cx", function (d) {
      return x(d["pass"] );
    })
    .attr("r", 5)
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
}



var tooltip = d3.select("#vis-container").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// tooltip mouseover event handler
var tipMouseover = function(d) {


  var html  = "<font size='5'>" + d.year + "<br/>" +
              "<span>" +  d.question +"</span><br/>" +
              "<b>" + "通過率 <b/>"  + d.pass +  "<b> 鑑別度: </b> " + d.dis  + "</font>";

  tooltip.html(html)
//      .style("left", (d3.event.pageX + 15) + "px")
//      .style("top", (d3.event.pageY - 28) + "px")
    .transition()
      .duration(200) // ms
      .style("opacity", 0.9) // started as 0!

};
// tooltip mouseout event handler
var tipMouseout = function(d) {
  tooltip.transition()
      .duration(300) // ms
      .style("opacity", 0); // don't care about position!
};

// gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}


