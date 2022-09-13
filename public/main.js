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
      darkMode: false,
      clickSound: new Audio("./assets/sound/pop-sound.mp3"),
      page: "home",
      detail: "",
      loaded: false
    }
  },
  created() {
    this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    this.logged = JSON.parse(localStorage.getItem('logged'));
    this.sound = JSON.parse(localStorage.getItem('clicksound'));
    this.darkMode = JSON.parse(localStorage.getItem('darkMode'));
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
    this.loaded = true;
  },

  methods: {
    addReminder: function (eve) {
      if (!this.reminders?.some(ev => ev.id === eve.id)) {
        this.reminders?.push(eve);
        eve.add = false;
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
      }

    },
    deleteReminder: function (eve) {
      this.reminders = this.reminders.filter(ev => ev.id !== eve.id);
      eve.add = true;
      localStorage.setItem('reminders', JSON.stringify(this.reminders));
    },
    darkModeSave: function() {
      localStorage.setItem('darkMode', JSON.stringify(!this.darkMode));
    },
    vibrate: function (ms) {

      if (!this.vibration) {
        navigator.vibrate(ms);
        localStorage.setItem('vibration', JSON.stringify(this.vibration));
      } else {
        localStorage.setItem('vibration', JSON.stringify(this.vibration));
      }
      if (this.sound) {
        this.clickSound.play();
        localStorage.setItem('clicksound', JSON.stringify(this.sound));
      } else {
        localStorage.setItem('clicksound', JSON.stringify(this.sound));
      }


    },
    enableEdition: function () {
      this.conditionInput = false;

    },
    saveChanges: function () {
      this.conditionInput = true;
      this.placeName = this.name;
      this.placeLastName = this.lastName;
      this.placeAge = this.age;
      this.placeGender = this.gender;
    },
    login: function () {
      this.logged = true;
      localStorage.setItem('logged', JSON.stringify(this.logged));
    },
    logout: function () {
      this.logged = false;
      localStorage.setItem('logged', JSON.stringify(this.logged));
    },
    moreInfo: function (eve) {
      this.detail = eve;

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