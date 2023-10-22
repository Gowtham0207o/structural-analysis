 // Get the canvas element
 var ctx = document.getElementById('beamChart').getContext('2d');

 // Create a chart
 var beamChart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: ['Beam'],
     datasets: [{
       label: 'Point Load',
       data: [1], // Represents the point load
       backgroundColor: '#007bff',
     }]
   },
   options: {
     responsive: false,
     scales: {
       x: {
         display: false,
         beginAtZero: true,
         max: 1.5, // Adjust the value as needed for your beam length
       },
       y: {
         beginAtZero: true,
         max: 2, // Adjust the value as needed for your vertical scale
         title: {
           display: true,
           text: 'Load (kN)'
         }
       }
     },
     plugins: {
       legend: {
         display: false,
       },
       title: {
         display: true,
         text: 'Simply Supported Beam with Point Load',
       }
     },
     onRender: function (chart) {
       // Draw a rectangle
       var rectX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 4;
       var rectY = chart.chartArea.top;
       var rectWidth = (chart.chartArea.right - chart.chartArea.left) / 2;
       var rectHeight = chart.chartArea.bottom - chart.chartArea.top;
       var arrowX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
       var arrowY = chart.chartArea.bottom;

       // Draw the rectangle
       ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
       ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

       // Draw the arrow
       ctx.beginPath();
       ctx.moveTo(arrowX - 5, arrowY - 10);
       ctx.lineTo(arrowX + 5, arrowY - 10);
       ctx.lineTo(arrowX, arrowY);
       ctx.closePath();
       ctx.fillStyle = '#007bff';
       ctx.fill();
     }
   }
 });
 $(function () {
  $('[data-toggle="tooltip"]').tooltip();
});