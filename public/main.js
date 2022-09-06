const { createApp } = Vue

createApp({
  data() {
    return {
      events: [],
      eventsFiltered: [],
      period: "all",
      reminders: [],
      conditionInput: true,
      placeName: "example",
      placeLastName: "example",
      placeAge: "0",
      placeGender: "example",
      name: "",
      lastName: "",
      gender: "",
      age: "",
      vibration: false,
      logged: false,
      sound: false,
      clickSound: new Audio("./assets/sound/pop-sound.mp3")
    }
  },
  created() {
    this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    this.logged = JSON.parse(localStorage.getItem('logged'));
    this.sound = JSON.parse(localStorage.getItem('clicksound'));
    this.vibration = JSON.parse(localStorage.getItem('vibration'));
    this.events = Array.from(schedule.events);
    for (eve of this.events) {
      if (!this.reminders?.some(ev => ev.id === eve.id)) {
        eve.add = true;
      } else {
        eve.add = false;
      }
    }
    this.eventsFiltered = this.events;
    this.name = this.placeName;
      this.lastName = this.placeLastName;
      this.gender = this.placeGender;
      this.age = this.placeAge;
    
  },
  methods: {
    addReminder: function (eve) {
      if (!this.reminders?.some(ev => ev.id === eve.id)) {
        this.reminders?.push(eve);
        eve.add = false;
        console.log(this.reminders)
        console.log(this.eventsFiltered)
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
      }
      
    },
    deleteReminder: function (eve) {
      this.reminders = this.reminders.filter(ev => ev.id !== eve.id);
      eve.add = true;
      console.log(this.reminders)
      console.log(this.eventsFiltered)
      localStorage.setItem('reminders', JSON.stringify(this.reminders));
    },
    vibrate: function(ms) {
    
      if(!this.vibration) {
        navigator.vibrate(ms);
        localStorage.setItem('vibration', JSON.stringify(this.vibration));
      } 
      if(this.sound) {
        this.clickSound.play();
        localStorage.setItem('clicksound', JSON.stringify(this.sound));
      }

      
    },
    enableEdition: function() {
      this.conditionInput = false;
    
    },
    saveChanges: function() {
      this.conditionInput = true;
      this.placeName = this.name;
      this.placeLastName = this.lastName;
      this.placeAge = this.age;
      this.placeGender = this.gender;
    },
    login: function() {
      this.logged = true;
      localStorage.setItem('logged', JSON.stringify(this.logged));
    },
    logout: function() {
      this.logged = false;
      localStorage.setItem('logged', JSON.stringify(this.logged));
    }
  },
  computed: {
    filterByPeriod: function () {
      //TODOS LOS EVENTOS
      if (this.period == "all") {
        this.eventsFiltered = this.events;
        console.log(this.period)
      } else if (this.period == "month") { //FILTRA EVENTOS POR MES
        const actualDate = new Date();
        let month = actualDate.getMonth() + 1;
        month = 10; //Esta variable la asigno ya que solo hay partidos en el mes 9 y 10
        let regex = new RegExp(month + '/');
        console.log(this.period)
        this.eventsFiltered = this.events.filter(events => regex.test(events.date));
        console.log(this.eventsFiltered)
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
        console.log(this.period)
        
        this.eventsFiltered = eventsFilteredMonth.filter(events => regexDays.test(events.date));
        console.log(this.eventsFiltered)
      }
    }
  }
}).mount('#app')