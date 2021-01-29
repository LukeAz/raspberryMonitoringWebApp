/*
 * License: MIT
 * LukeAz => https://github.com/LukeAz
*/

function createChart(id, data) { 
  return new Chart(id, {
    type: 'doughnut',
    data: {
      datasets: [{
        percent: data.value,
        backgroundColor: [data.color, '#e8e8e8'],
        borderColor: 'transparent'}]
    },
    plugins: [
      { beforeInit: (chart) => {
         let dataset = chart.data.datasets[0];
         dataset.data = [dataset.percent, data.limit - dataset.percent];
         chart.canvas.style.display='inline';}
      },
      { beforeDraw: (chart) => {
          let width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          let fontSize = (height / 100).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.fillStyle = "#9b9b9b"; 
          ctx.textBaseline = "middle";
          let text = chart.data.datasets[0].percent + data.symbol,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = 2 * height / 3;
          ctx.fillText(text, textX, textY);
          title = data.text,
            textX = Math.round((width - ctx.measureText(title).width) / 2),
            textY = 1 * height / 3;
          ctx.fillText(data.text, textX, textY);
          ctx.save();}
      }],
    options: {
      aspectRatio	: 1,
      responsive: false,
      cutoutPercentage: 83,
      rotation: 3 * Math.PI / 2,
      tooltips: {enabled: false},
    }});
}

function updateChart(chart, data) {
  chart.data.datasets[0].percent = data.value;
  chart.data.datasets[0].data = [chart.data.datasets[0].percent, data.limit - chart.data.datasets[0].percent];
  chart.data.datasets[0].backgroundColor = [data.color, '#e8e8e8'];
  chart.update();
}

function elementInsert (id, data) {
  document.getElementById(id).innerHTML = data[id];
}

window.onload = () => {
  var ids = ['tempnow', 'cpu', 'ram', 'disk']; 
  var charts = [];
  let wsConfig = document.getElementById('ws').innerHTML;
  const MAXTEMP = document.getElementById('settingMaxTemp').innerHTML;
  var client = new WebSocket(wsConfig);  
  client.onmessage = (event) => {
    let data = JSON.parse(event.data);
    let elements = Object.keys(data).filter(x => ids.indexOf(x) === -1);
    for (x in elements) 
      elementInsert(elements[x], data);
    //FIRST ENTER
    if (charts.length==0)
      for(i in ids) {
        let id = ids[i];
        data[id].color = (data[id].value < MAXTEMP-10) ? 'green' : (data[id].value < MAXTEMP ? 'orange' : 'red');
        charts.push(createChart(id, data[id]));
      }
    else 
      for(i in charts) {
        let id = ids[i];
        data[id].value = data[id].value > data[id].limit ? data[id].limit : data[id].value;
        data[id].color = (data[id].value < MAXTEMP-10) ? 'green' : (data[id].value < MAXTEMP ? 'orange' : 'red');
        updateChart(charts[i], data[id]);
      }
  };
  client.onopen = () => {
    client.send("getInfo");
    setInterval(()=> {
      client.send("getInfo");
    }, 2000)
  }
  client.onerror = () => console.error;
}

