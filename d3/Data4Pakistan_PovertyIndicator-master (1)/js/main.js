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
let promises = [
  d3.csv("data/dfPovertyAdultLit.csv"),
  d3.csv("data/dfPovertyMobileOwn.csv"),
  d3.csv("data/dfPovertyLaborForcePart.csv"),
  d3.csv("data/dfPovertyEmplAg.csv"),
  d3.csv("data/dfPovertyEmplIndustry.csv"),
  d3.csv("data/dfPovertyEmplSvc.csv"),
];
let allData = [];
let xAxisLabel = "Adult Literacy";
let time = 0;
let displayTime = 2004 + time;
let intervalBeat;

//OUTS: add a Year label to svg
let timeText = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", margin.top);

Promise.all(promises).then(function (data) {
  data.forEach(function (eachDataset) {
    eachDataset.forEach(function (d) {
      d["Poverty Rate (%)"] = +d["Poverty Rate (%)"];
      d["Year"] = new Date(d["Year"]);
      if (
        d.hasOwnProperty(
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        )
      ) {
        d[
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        ] = +d[
          "Adult literacy, 25 or more years old (% of population aged 25 or more)"
        ];
      } else if (
        d.hasOwnProperty("Households' mobile phone ownership (% of population)")
      ) {
        d["Households' mobile phone ownership (% of population)"] = +d[
          "Households' mobile phone ownership (% of population)"
        ];
      } else if (
        d.hasOwnProperty(
          "Labor force participation rate (% of working age population, 15-64 years old)"
        )
      ) {
        d[
          "Labor force participation rate (% of working age population, 15-64 years old)"
        ] = +d[
          "Labor force participation rate (% of working age population, 15-64 years old)"
        ];
      } else if (
        d.hasOwnProperty("Employment services (% of total employment)")
      ) {
        d["Employment services (% of total employment)"] = +d[
          "Employment services (% of total employment)"
        ];
      } else if (
        d.hasOwnProperty("Employment in industry (% of total employment)")
      ) {
        d["Employment in industry (% of total employment)"] = +d[
          "Employment in industry (% of total employment)"
        ];
      } else if (
        d.hasOwnProperty("Employment in agriculture (% of total employment)")
      ) {
        d["Employment in agriculture (% of total employment)"] = +d[
          "Employment in agriculture (% of total employment)"
        ];
      }
    });
  });

  allData = data;

  updateChart(allData, xAxisLabel, time);
});

//Add in event listener for indicator choice.
$("#indicatorChoice").on("change", function () {
  xAxisLabel =
    $("#indicatorChoice").val() === "adultLit"
      ? "Adult Literacy"
      : $("#indicatorChoice").val() === "mobileOwn"
      ? "Mobile Phone Ownership"
      : $("#indicatorChoice").val() === "laborForcePart"
      ? "Labor Force Participation Rate"
      : $("#indicatorChoice").val() === "emplAg"
      ? "Employment In Ag Sector"
      : $("#indicatorChoice").val() === "emplIndustry"
      ? "Employment In Industrial Sector"
      : $("#indicatorChoice").val() === "emplSvc"
      ? "Employment In Services Sector"
      : null;
  updateChart(allData, xAxisLabel, time);
});

//Add in event listener for geographic choice.
$("#geographicChoice").on("change", function () {
  updateChart(allData, xAxisLabel, time);
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
  if (time < 5) {
    time += 1;
  } else {
    time = 0;
  }
  updateChart(allData, xAxisLabel, time);
}

//Function that builds the right chart depending on user choice on website:
function updateChart(someData, xAxisLabel, time) {
  let dataAdultLit = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[0]);

  let dataMobileOwn = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[1]);

  let dataLaborForcePart = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[2]);

  let dataEmplAg = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[3]);

  let dataEmplIndustry = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[4]);

  let dataEmplSvc = d3
    .nest()
    .key(function (d) {
      return d["Year"];
    })
    .entries(someData[5]);

  displayTime = 2004 + time * 2;
  timeText.text("Year: " + displayTime);

  let filteredData =
    $("#indicatorChoice").val() === "adultLit"
      ? dataAdultLit[time]
      : $("#indicatorChoice").val() === "mobileOwn"
      ? dataMobileOwn[time]
      : $("#indicatorChoice").val() === "laborForcePart"
      ? dataLaborForcePart[time]
      : $("#indicatorChoice").val() === "emplAg"
      ? dataEmplAg[time]
      : $("#indicatorChoice").val() === "emplIndustry"
      ? dataEmplIndustry[time]
      : $("#indicatorChoice").val() === "emplSvc"
      ? dataEmplSvc[time]
      : null;

  filteredData =
    $("#geographicChoice").val() === "allProv"
      ? filteredData["values"]
      : filteredData["values"].filter(
          (each) => each["Province"] === $("#geographicChoice").val()
        );

  // Add X axis
  let x = d3.scaleLinear().domain([0, 100]).range([0, width]);

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
    .attr("class", "xAxisLabel")
    .style("text-anchor", "middle");

  svg.selectAll(".xAxisLabel").text(xAxisLabel);

  // Add Y axis
  let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  //Add y-axis label:
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Poverty Rate");

  // Color scale: give me a province name, I return a color
  let color = d3
    .scaleOrdinal()
    .domain([
      "Balochistan",
      "Federal Capital Territory",
      "Khyber Pakhtunkhwa",
      "Punjab",
      "Sindh",
    ])
    .range(["#440154ff", "#21908dff", "#fde725ff", "#129490", "#CE1483"]);

  // JOIN new data with old elements.
  var circles = svg.selectAll("circle").data(filteredData, function (d) {
    return d["District"];
  });

  // EXIT old elements not present in new data.
  circles.exit().attr("class", "exit").remove();

  // ENTER new elements present in new data.
  circles
    .enter()
    .append("circle")
    .attr("class", "enter")
    .attr("fill", function (d) {
      return color(d["Province"]);
    })
    .merge(circles)
    .attr("cy", function (d) {
      return y(d["Poverty Rate (%)"]);
    })
    .attr("cx", function (d) {
      //OUTS: Why is this resulting in errors??
      // console.log(x(d["Households' mobile phone ownership (% of population)"]));

      return x(
        d["Households' mobile phone ownership (% of population)"] ||
          d[
            "Adult literacy, 25 or more years old (% of population aged 25 or more)"
          ] ||
          d[
            "Labor force participation rate (% of working age population, 15-64 years old)"
          ] ||
          d["Employment in agriculture (% of total employment)"] ||
          d["Employment in industry (% of total employment)"] ||
          d["Employment services (% of total employment)"]
      );
    })
    .attr("r", 5);
}
