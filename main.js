const audio = new Audio("./click-sound.wav");
let buttonHome = document.querySelector(".sound-icon")

buttonHome.addEventListener("click", () => {
  window.navigator.vibrate(500);
})

const { createApp } = Vue

  createApp({
    data() {
      return {
        events: [],
        period: "all"
      }
    },
    created() {
    this.events = Array.from(schedule.events);
    console.log(this.events)
 
    },
    methods: {
    
    }
  }).mount('#app')