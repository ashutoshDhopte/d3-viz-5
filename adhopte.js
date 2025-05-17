


$(document).ready(() => {

    Promise.all([
        d3.csv('data/2015.csv', (d) => {
            return {
                rank: parseInt(d['Happiness Rank']),
                country: d['Country'],
                score: parseFloat(d['Happiness Score']),
                gdpPerCap: parseFloat(d["Economy (GDP per Capita)"]),
                govtCorruption: parseFloat(d["Trust (Government Corruption)"]),
                freedom: parseFloat(d["Freedom"]),
                health: parseFloat(d["Health (Life Expectancy)"]),
            };
        }),
        d3.csv('data/2016.csv', (d) => {
            return {
                rank: parseInt(d['Happiness Rank']),
                country: d['Country'],
                score: parseFloat(d['Happiness Score']),
                gdpPerCap: parseFloat(d["Economy (GDP per Capita)"]),
                govtCorruption: parseFloat(d["Trust (Government Corruption)"]),
                freedom: parseFloat(d["Freedom"]),
                health: parseFloat(d["Health (Life Expectancy)"]),
            };
        }),
        d3.csv('data/2017.csv', (d) => {
            return {
                rank: parseInt(d['Happiness.Rank']),
                country: d['Country'],
                score: parseFloat(d['Happiness.Score']),
                gdpPerCap: parseFloat(d["Economy..GDP.per.Capita."]),
                govtCorruption: parseFloat(d["Trust..Government.Corruption."]),
                freedom: parseFloat(d["Freedom"]),
                health: parseFloat(d["Health..Life.Expectancy."]),
            };
        }),
        d3.csv('data/2018.csv', (d) => {
            return {
                rank: parseInt(d['Overall rank']),
                country: d['Country or region'],
                score: parseFloat(d['Score']),
                gdpPerCap: parseFloat(d["GDP per capita"]),
                govtCorruption: parseFloat(d["Perceptions of corruption"]),
                freedom: parseFloat(d["Freedom to make life choices"]),
                health: parseFloat(d["Healthy life expectancy"]),
            };
        }),
        d3.csv('data/2019.csv', (d) => {
            return {
                rank: parseInt(d['Overall rank']),
                country: d['Country or region'],
                score: parseFloat(d['Score']),
                gdpPerCap: parseFloat(d["GDP per capita"]),
                govtCorruption: parseFloat(d["Perceptions of corruption"]),
                freedom: parseFloat(d["Freedom to make life choices"]),
                health: parseFloat(d["Healthy life expectancy"]),
            };
        })        
        
    ]).then(dataArr => {

        drawGraphs(dataArr);
    })
});

function drawGraphs(dataArr){

    let yearDataObjArr = [];
    let year = 2015;
    let yearArr = [];
    const labelMap = new Map([
        ['scoreAvg', 'Happiness Score'],
        ['gdpAvg', 'GDP per Capita'],
        ['corruptionAvg', 'Government Corruption'],
        ['freedomAvg', 'Freedom to make life choices'],
        ['healthAvg', 'Healthy life expectancy'],
    ]);

    dataArr.forEach(element => {

        let count = element.length;
        let sum = 0;
        let sumGdp = 0;
        let sumCorr = 0;
        let sumFree = 0;
        let sumHealth = 0;
        
        element.forEach(innerElement => {
            sum += innerElement.score;
            sumGdp += innerElement.gdpPerCap;
            sumCorr += innerElement.govtCorruption ? innerElement.govtCorruption : 0;
            sumFree += innerElement.freedom;
            sumHealth += innerElement.health ? innerElement.health : 0;
        });

        yearDataObjArr.push({
            year: year,
            scoreAvg: Number((sum/count).toFixed(2)),
            gdpAvg: Number((sumGdp/count).toFixed(2)),
            corruptionAvg: Number((sumCorr/count).toFixed(2)),
            freedomAvg: Number((sumFree/count).toFixed(2)),
            healthAvg: Number((sumHealth/count).toFixed(2)),
        });

        yearArr.push(year);
        year++;
    });

    let margin = 20, width = 600, height = 450;

    //first left -- positive
    const positiveSvg = d3.select('#positive_svg')
        .append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    //bottom x-axis
    const xScalePositive = d3.scaleBand()
        .domain(yearArr)
        .range([ 0, width - margin*5 ]);

    positiveSvg.append("g")
        .attr("transform", `translate(${margin*2},${height-margin})`)
        .attr('opacity', 0.5)
        .call(d3.axisBottom(xScalePositive));

    positiveSvg.append("text")
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("transform", `translate(${width/2},${height + margin})`)
        .attr('opacity', 0.5)
        .text('Year');

    //top x-axis
    const xScaleTopPositive = d3.scaleLinear()
        .range([ 0, width - margin*5 ]);

    positiveSvg.append("g")
        .attr("transform", `translate(${margin*2},${margin*2})`)
        .attr('opacity', 0.5)
        .call(d3.axisTop(xScaleTopPositive).tickSize(0).tickValues([]));

    positiveSvg.selectAll('.scoreValues')
        .data(yearDataObjArr)
        .enter()
        .append('text')
            .attr('class', 'scoreValues')
            .attr("font-size", "10px")
            .attr("transform", d => `translate(${margin*4 + xScalePositive(d.year)},${margin*1.5})`)
            .attr('opacity', 0.5)
            .text(d => d.scoreAvg);

    positiveSvg.selectAll('.scoreValuesTicks')
        .data(yearDataObjArr)
        .enter()
        .append('line')
            .attr('class', 'scoreValuesTicks')
            .attr('opacity', 0.5)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('x1', d => margin*4 + 10 + xScalePositive(d.year)) 
            .attr('y1', margin*1.7)
            .attr('x2', d => margin*4 + 10 + xScalePositive(d.year))
            .attr('y2', margin*2);

    positiveSvg.append("text")
        .attr("x", width/2 + margin*2)
        .attr("y", 0)
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("transform", `translate(0,0)`)
        .attr('opacity', 0.8)
        .attr('stroke-width', 0.5)
        .attr('fill', '#d35400')
        .text('Happiness Score');

    //y-axis
    const yScalePositive = d3.scaleLinear()
        .domain([1, 0])
        .range([ 0, height-margin*3 ]);

    positiveSvg.append("g")
        .attr("transform", `translate(${margin*2},${margin*2})`)
        .attr('opacity', 0.5)
        .call(d3.axisLeft(yScalePositive));

    positiveSvg.append("text")
        .attr("x", -height/2 + 90)
        .attr("y", 0)
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("transform", `translate(0,0) rotate(-90)`)
        .attr('opacity', 0.5)
        .text('Factor scale affecting Happiness');

    const positivePlotSvg = positiveSvg.append('g')
        .attr("transform", `translate(0,${margin*2.5})`);

    //happiness score rectangle graph -- focused on width
    const widthScale = d3.scaleLinear()
        .domain([d3.min(yearDataObjArr.map(d => d.scoreAvg)), d3.max(yearDataObjArr.map(d => d.scoreAvg))])
        .range([10, 50])

    positivePlotSvg.selectAll('.scoreBox')
        .data(yearDataObjArr)
        .enter()
        .append('rect')
            .attr('class', 'scoreBox')
            .attr('x', d => xScalePositive(d.year) - widthScale(d.scoreAvg)/2)
            .attr('y', d => yScalePositive(Math.max(d.gdpAvg, d.corruptionAvg, d.freedomAvg)) - 10)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr('width', d => widthScale(d.scoreAvg))
            .attr('height', d => yScalePositive(Math.min(d.gdpAvg, d.corruptionAvg, d.freedomAvg)) - yScalePositive(Math.max(d.gdpAvg, d.corruptionAvg, d.freedomAvg)) + 20)
            .attr('stroke', '#d35400')
            .attr('stroke-width', 1)
            .attr('fill', '#FFD580')
            .attr("transform", `translate(${margin*4 + 10},0)`)
            .attr('opacity', 0.6);

    //other factors line plot
    const color = d3.scaleOrdinal()
        .range(['#2E5C97', '#A6534D', '#8B63A6', '#2D8B75', '#d35400']);

    const lineMap = new Map();
    lineMap.set('gdpAvg', []);
    lineMap.set('corruptionAvg', []);
    lineMap.set('freedomAvg', []);
    lineMap.set('healthAvg', []);

    yearDataObjArr.forEach(obj => {
        lineMap.get('gdpAvg').push({
            year: obj.year,
            value: obj.gdpAvg
        });
        lineMap.get('corruptionAvg').push({
            year: obj.year,
            value: obj.corruptionAvg
        });
        lineMap.get('freedomAvg').push({
            year: obj.year,
            value: obj.freedomAvg
        });
        lineMap.get('healthAvg').push({
            year: obj.year,
            value: obj.healthAvg
        });
    });

    positivePlotSvg.selectAll(".line")
        .data(lineMap)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", d => color(d[0]))
        .attr("stroke-width", 2.5)
        .attr("transform", `translate(${margin*4 + 10},0)`)
        .attr("d", function(d){
          return d3.line()
            .x(d => xScalePositive(d.year))
            .y(d => yScalePositive(d.value))
            .curve(d3.curveCatmullRom.alpha(0.5))
            (d[1])
        });

    positivePlotSvg.selectAll(".line-label")
        .data(lineMap)
        .join("text")
        .attr("class", "line-label")
        .attr("transform", d => {
            const lastPoint = d[1][d[1].length - 1];
            return `translate(${xScalePositive(lastPoint.year) + margin*4 + 40},
                             ${yScalePositive(lastPoint.value)})`;
        })
        .attr("dy", "0.35em")
        .attr("fill", d => color(d[0]))
        .text(d => labelMap.get(d[0]))
        .style('font-size', '12px')
        .style('max-width', '120px')
        .attr('opacity', 0.8)
        .call(wrap, 120);
    
    
    

    //second right -- negative
    const negativeSvg = d3.select('#negative_svg')
        .append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const yearArrNegative = yearArr;
    const yearDataObjArrNegative = yearDataObjArr;

    //top axis
    const xScaleNegative = d3.scaleBand()
        .domain(yearArrNegative)
        .range([ 0, width - margin*5 ]);

    negativeSvg.append("g")
        .attr("transform", `translate(${margin*2},${margin*1.5})`)
        .attr('opacity', 0.5)
        .call(d3.axisTop(xScaleNegative));

    negativeSvg.append("text")
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("transform", `translate(${width/2},0)`)
        .attr('opacity', 0.5)
        .text('Year');

    //y-axis
    const yScaleNegative = d3.scaleLinear()
        .domain([0, 1.5])
        .range([ 0, height-margin*3 ]);

    negativeSvg.append("g")
        .attr("transform", `translate(${margin*2},${margin*1.5})`)
        .attr('opacity', 0.5)
        .call(d3.axisLeft(yScaleNegative));

    negativeSvg.append("text")
        .attr("x", -height/2 + 90)
        .attr("y", 0)
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("transform", `translate(0,0) rotate(-90)`)
        .attr('opacity', 0.5)
        .text('Factor scale affecting Happiness');

    //Happiness score area
    negativeSvg.append("path")
        .datum(yearDataObjArrNegative)
        .attr("fill", "#FFD580")
        .attr("stroke-width", 1.5)
        .attr('transform', `translate(${margin*4.5}, ${margin*1.5})`)
        .attr("d", d3.area()
            .x(d => xScaleNegative(d.year))
            .y0(yScaleNegative(0))
            .y1(d => yScaleNegative(d.scoreAvg-4))
        );

    //GDP score area
    negativeSvg.append("path")
        .datum(yearDataObjArrNegative)
        .attr("fill", "#2E5C97")
        .attr("stroke-width", 1.5)
        .attr('transform', `translate(${margin*4.5}, ${margin*1.5})`)
        .attr("d", d3.area()
            .x(d => xScaleNegative(d.year))
            .y0(yScaleNegative(0))
            .y1(d => yScaleNegative(d.gdpAvg))
        );

    //Health score area
    negativeSvg.append("path")
        .datum(yearDataObjArrNegative)
        .attr("fill", "#2D8B75")
        .attr("stroke-width", 1.5)
        .attr('transform', `translate(${margin*4.5}, ${margin*1.5})`)
        .attr("d", d3.area()
            .x(d => xScaleNegative(d.year))
            .y0(yScaleNegative(0))
            .y1(d => yScaleNegative(d.healthAvg))
        );

    //Freedom score area
    negativeSvg.append("path")
        .datum(yearDataObjArrNegative)
        .attr("fill", "#8B63A6")
        .attr("stroke-width", 1.5)
        .attr('transform', `translate(${margin*4.5}, ${margin*1.5})`)
        .attr("d", d3.area()
            .x(d => xScaleNegative(d.year))
            .y0(yScaleNegative(0))
            .y1(d => yScaleNegative(d.freedomAvg))
        );

    //Corruption score area
    negativeSvg.append("path")
        .datum(yearDataObjArrNegative)
        .attr("fill", "#A6534D")
        .attr("stroke-width", 1.5)
        .attr('transform', `translate(${margin*4.5}, ${margin*1.5})`)
        .attr("d", d3.area()
            .x(d => xScaleNegative(d.year))
            .y0(yScaleNegative(0))
            .y1(d => yScaleNegative(d.corruptionAvg))
        );

    lineMap.set('scoreAvg', []);
    yearDataObjArr.forEach(obj => {
        lineMap.get('scoreAvg').push({
            year: obj.year,
            value: obj.scoreAvg-4
        });
    });

    negativeSvg.selectAll(".area-label")
        .data(lineMap)
        .join("text")
        .attr("class", "area-label")
        .attr("transform", d => {
            const lastPoint = d[1][d[1].length - 1];
            return `translate(${xScaleNegative(lastPoint.year) + margin*4 + 20},
                             ${yScaleNegative(lastPoint.value)+20})`;
        })
        .attr("dy", "0.35em")
        .attr("fill", d => color(d[0]))
        .text(d => labelMap.get(d[0]))
        .style('font-size', '12px')
        .style('max-width', '120px')
        .attr('opacity', 0.8)
        .call(wrap, 140);
}

// Add the wrap function
function wrap(text, width) {
    text.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan")
                       .attr("x", 0)
                       .attr("y", y)
                       .attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                           .attr("x", 0)
                           .attr("y", y)
                           .attr("dy", ++lineNumber * lineHeight + dy + "em")
                           .text(word);
            }
        }
    });
}    
