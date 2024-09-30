<template>
  <div>
    <h1>Live Vehicle Speed Tracker</h1>
    <p>Current Speed: <span>{{ speed.toFixed(2) }}</span> km/h</p>
    <p>{{ statusMessage }}</p>
    <GuageChart :value="speed"/>
  </div>
</template>

<script>
import GuageChart from './GuageChart.vue';

export default {
  data() {
    return {
      speed: 100,
      statusMessage: "Waiting for GPS...",
      prevPosition: null,
      prevTime: null,
    };
  },
  components: {
    GuageChart 
  },
  methods: {
    // Function to calculate distance using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // Earth radius in meters
      const toRad = (deg) => deg * Math.PI / 180;

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
    },

    // Success callback for geolocation
    success(position) {
      const { latitude, longitude } = position.coords;
      const currentTime = new Date().getTime();

      if (this.prevPosition) {
        const distance = this.calculateDistance(
          this.prevPosition.latitude,
          this.prevPosition.longitude,
          latitude,
          longitude
        );

        const timeElapsed = (currentTime - this.prevTime) / 1000; // Time in seconds
        const speed = (distance / timeElapsed) * 3.6; // Convert m/s to km/h

        // Update the speed with a debounce effect
        if (speed > 0) {
          this.speed = speed;
          this.statusMessage = `Speed calculated successfully.`;
        }
      }

      this.prevPosition = { latitude, longitude };
      this.prevTime = currentTime;
    },

    // Error callback for geolocation
    error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      this.statusMessage = "Unable to retrieve GPS data.";
    },

    // Initialize GPS tracking
    startTracking() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          this.success,
          this.error,
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        this.statusMessage = "Geolocation is not supported by this browser.";
      }
    },
  },
  mounted() {
    this.startTracking();
  },
};
</script>

<style scoped>

</style>
