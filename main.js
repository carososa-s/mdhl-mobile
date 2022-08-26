const audio = new Audio("./click-sound.wav");
let buttonHome = document.querySelector(".sound-icon")

buttonHome.addEventListener("click", () => {
    audio.play();
})

const { createApp } = Vue

  createApp({
    data() {
      return {
        events: []
      }
    },
    created() {
    this.events = Array.from(schedule.events);
    console.log(this.events)
    },
    methods: {

    }
  }).mount('#app')