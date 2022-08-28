const audio = new Audio("./click-sound.wav");
let buttonHome = document.querySelector(".sound-icon")

buttonHome.addEventListener("click", () => {
  navigator.vibrate(500);
})

const { createApp } = Vue

createApp({
  data() {
    return {
      events: [],
      eventsFiltered: [],
      period: "all",
      reminders: []
    }
  },
  created() {
    this.events = Array.from(schedule.events);
    this.eventsFiltered = this.events;
    for (eventt of this.events) {
      if (!this.reminders?.some(e => e.id === eventt.id)) {
        eventt.add = true;
      } else {
        eventt.add = false;
      }
    }
     this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  },
  methods: {
    addReminder: function (eventt) {
      if (!this.reminders?.some(e => e.id === eventt.id)) {
        this.reminders?.push(eventt);
        eventt.add = false;
        console.log(this.reminders)
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
      }
      
    },
    deleteReminder: function (eventt) {
      eventt.add = true;
      this.reminders = this.reminders.filter(e => e.id !== eventt.id)
      console.log(this.reminders)
      localStorage.setItem('reminders', JSON.stringify(this.reminders));
    }

  },
  computed: {
    filterByPeriod: function () {
      //TODOS LOS EVENTOS
      if (this.period == "all") {
        this.eventsFiltered = this.events;
      } else if (this.period == "month") { //FILTRA EVENTOS POR MES
        const actualDate = new Date();
        let month = actualDate.getMonth() + 1;
        month = 10; //Esta variable la asigno ya que solo hay partidos en el mes 9 y 10
        let regex = new RegExp(month + '/');
        this.eventsFiltered = this.events.filter(events => regex.test(events.date));
      } else if (this.period == "week") { //FILTRA EVENTOS DE LA SEMANA
        const actualDate = new Date();
        let month = actualDate.getMonth() + 1;
        month = 10; //Esta variable la asigno ya que solo hay partidos en el mes 9 y 10
        let regex = new RegExp(month + '/');
        let eventsFilteredMonth = this.events.filter(events => regex.test(events.date));
        let dayOfWeek = actualDate.getDay();
        let day = actualDate.getDate();
        let dif = 7 - dayOfWeek;
        let endOfWeek = day + dif;
        day = day.toString();
        let startOfWeek;
        if (day.length == 1) {
          startOfWeek = "0" + day;
        } else {
          startOfWeek = day;
        }
        startRange = startOfWeek.toString().split("");
        endRange = endOfWeek.toString().split("");
        let regexDays;
        if (endRange[0] === startRange[0]) {
          regexDays = new RegExp('/' + endRange[0] + '[' + startRange[1] + '-' + endRange[1] + ']');
        } else {
          regexDays = new RegExp('/' + '(' + startRange[0] + '[' + startRange[1] + '-' + '9' + ']|' + endRange[0] + '[' + '0' + '-' + endRange[1] + ']' + ')');
        }
        this.eventsFiltered = eventsFilteredMonth.filter(events => regexDays.test(events.date));
      }
    }
  }
}).mount('#app')