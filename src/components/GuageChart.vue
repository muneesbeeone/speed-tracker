<template>
    <div>
      <div id="chartContainer">
        <svg id="gaugeChart" viewBox="-80 -10 380 200">
          <!-- Background Arc -->
          <path
            id="gaugeBackground"
            :d="describeArc(100, 100, 80, 0, 180)"
            fill="none"
            stroke="#E0E0E0"
            stroke-width="10"
          />
  
          <!-- Green Segments for Progress Arc -->
          <g id="gaugeSegments">
            <path
              v-for="(segment, index) in segments"
              :key="index"
              :d="segment.d"
              :stroke="index < segmentsToShow ? 'green' : '#CCCCCC'"
              fill="none"
              stroke-width="12"
            />
          </g>
  
          <!-- Pointer (Triangle) -->
          <polygon :points="pointerPoints" fill="green" />
  
          <!-- Main value display in the center -->
          <text x="100" y="70" text-anchor="middle" font-family="Space Grotesk" font-weight="bold" font-size="20" fill="green">
            {{ value.toFixed(2) }}
          </text>
  
          <!-- Static text labels for min, mid, max values -->
          <text x="-6" y="100" text-anchor="middle" font-size="14">0</text>
          <text x="100" y="-1" text-anchor="middle" font-size="14">75</text>
          <text x="210" y="100" text-anchor="middle" font-size="14">150</text>
  
          <!-- Caption below the gauge -->
          <text x="100" y="90" text-anchor="middle" font-size="14">Current Mining</text>
        </svg>
      </div>
<!--   
      <div id="sliderContainer">
        <input type="range" min="0" max="150" v-model="value" />  
      </div> -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'GaugeChart',
    props: {
      value: {
        type: Number,
      }
    },
    data() {
      return {
        segments: [], // Holds segment paths
      };
    },
    computed: {
      segmentsToShow() {
        return Math.floor((this.value / 150) * 80);
      },
      pointerPoints() {
        // Calculate pointer position based on current value
        let endAngle = (this.value / 150) * 180;
        let pointerPos = this.polarToCartesian(100, 100, 85, endAngle);
        let pointerBase1 = this.polarToCartesian(100, 100, 75, endAngle + 4);
        let pointerBase2 = this.polarToCartesian(100, 100, 75, endAngle - 4);
        return `${pointerPos.x},${pointerPos.y} ${pointerBase1.x},${pointerBase1.y} ${pointerBase2.x},${pointerBase2.y}`;
      },
    },
    methods: {
      polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
        return {
          x: centerX + radius * Math.cos(angleInRadians),
          y: centerY + radius * Math.sin(angleInRadians),
        };
      },
      describeArc(x, y, radius, startAngle, endAngle) {
        let start = this.polarToCartesian(x, y, radius, endAngle);
        let end = this.polarToCartesian(x, y, radius, startAngle);
        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        let d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
      },
      createGaugeSegments() {
        const segmentCount = 80; // Total number of segments
        const maxAngle = 180; // Half-circle
        const segmentGap = 1; // Gap between segments in degrees
        const segmentWidth = (maxAngle - segmentGap * (segmentCount - 1)) / segmentCount;
        const segmentRadius = 92;
  
        this.segments = []; // Clear previous segments
  
        for (let i = 0; i < segmentCount; i++) {
          let startAngle = i * (segmentWidth + segmentGap);
          let endAngle = startAngle + segmentWidth;
          this.segments.push({
            d: this.describeArc(100, 100, segmentRadius, startAngle, endAngle),
          });
        }
      },
      updateGauge() {
        this.createGaugeSegments(); // Recalculate segments when value changes
      },
    },
    mounted() {
      this.createGaugeSegments(); // Initialize gauge segments
    },
    watch: {
    value() {
      this.updateGauge(); // Watch the value and update the gauge accordingly
    },
  },
  };
  </script>
  
  <style scoped>
  text {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: azure;
  }
  
  #sliderContainer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  </style>
  