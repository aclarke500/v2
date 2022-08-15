<template>
  <div class="container">
    <div class="top">
      <div class="content-block">

        <h1>Verus</h1>

        <div class="navigation">
          <span :class="{ active: mode == 1 }" @click="switchMode(1)">New Patient</span>
          <span :class="{ active: mode == 2 }" @click="switchMode(2)">New Appointment</span>
          <span :class="{ active: mode == 3 }" @click="switchMode(3)">View Patient</span>
        </div>

      </div>
    </div>

    <div class="main">
      <div class="content-block">
        <!-- components for new patient/newappt -->
        <CreatePatients v-if="this.mode == 1" @submitPatient="submitPatient" />
        <CreateAppointments v-if="this.mode == 2" @submit-appointment="submitApt" /> <!--  -->
        <ViewPatient v-if="this.mode == 3" />
        <SimpleLogin v-if="this.mode == 0"></SimpleLogin>

        <!-- Check to see whether they're logging in, creating a new patient, or appointment™ -->
        <ul v-if="this.mode == 1">
          <!-- patient mode -->
          <li v-for="p in patients" v-bind:key="p">
            <p>{{ p.name }} - {{ p.id }} - {{ p.birthday.toDateString() }}</p>
          </li>
        </ul>

        <ul v-if="this.mode == 2">
          <h3> Codes billed for {{ mostRecentAppointment.id }} : {{ mostRecentAppointment.codeToString }}</h3>
          <!-- appointment mode -->
          <li v-for="a in appointments" v-bind:key="a">
            <!-- gotta inject some sorta for loop into here to display multiple codes -->
            <p>{{ a.id }} - {{ a.date }} - {{ a.diagnosis }} - {{ displayCodes(a.code) }} - {{ a.patientType }} - {{
                a.refStatus
            }}</p>
          </li>
        </ul>


      </div>
    </div>
  </div>
</template>


<script>
import CreatePatients from './components/CreatePatients.vue'
import CreateAppointments from './components/CreateAppointments.vue'
import ViewPatient from "./components/ViewPatient.vue";
import { billing } from './logic/Billing'
import SimpleLogin from './components/SimpleLogin.vue'
import { newAppointment, createPatient, getAppointments, addAppointment, getPatient, GoogleSignIn } from './firebase'


export default {
  name: 'App', //this just needs to be here for Vue to work
  components: {
    CreatePatients,
    CreateAppointments,
    SimpleLogin,
    ViewPatient,
  },
  data() {
    return {
      mostRecentAppointment: {},
      patients: [
      ],
      appointments: [
      ],
      mode: 2, //setting the mode to appointments by default and not patient registration
      patient: '',

    }
  },
  methods: {
    /**
     * @param {number}
     */
    switchMode(mode) {
      // 0 is welcome, 1 is new pat, 2 is new apt
      this.mode = mode
    },


    displayCodes(codes) {
      let codeString = ''
      for (let i = 0; i < codes.length - 1; i++) {
        codeString += (codes[i] + ", ")
      }
      codeString += codes[codes.length - 1]
      return codeString
    },

    /**
     * WIP for displaying patient data
     * @param {Number}
     */
    async getPatientByCR(cr) {
      // let pat = getPatient(cr)
      // console.log(this.patients[3])
      // this.patient=this.patients[3]

      
      const information = await getPatient(cr)
      let patient = information[0]

      const name = patient.name
      const crNumber = patient.id
      const birthday = patient.birthday
      this.patient = {
        name: name,
        id: crNumber,
        birthday: birthday,
      }


      let v = await getAppointments(cr)

    },

    async submitApt(apt) {
      //replace with call to backend to check
      //alert('chef')

      let patient = await getPatient(apt.id)
      if (!patient) {
        alert("Patient not found, double check CR number.")
        return
      }

      //appointments are lists, first appointment is patient registration
      patient = patient[0]
      //converting dates
      patient.date = new Date(patient.date.year, patient.date.month, patient.date.day)
      //get all apts w same cr number
      let appointments = await getAppointments(apt.id)
      //for loop and convert dates
      for (let i = 0; i < appointments.length; i++) {
        appointments[i].date = new Date(appointments[i].date.year, appointments[i].date.month, appointments[i].date.day)
      }


      //pass data into billing logic tree
      let code = billing(apt, appointments, patient)

      //add codes and stringified codes 
      apt = Object.assign(apt, { code: code, codeToString: this.displayCodes(code) })
      this.appointments.push(apt)
      this.mostRecentAppointment = apt

      //we need to do the stupid conversion before we pass to firebase

      let year, month, day = '';
      year = apt.date.getFullYear()
      month = apt.date.getMonth()
      day = apt.date.getDate()

      apt.date = {
        day: day, 
        month: month,
        year: year,
      }

      newAppointment(apt)


    },
    /**
     * @param {Array} code
     * @return {String} pretty codes
     */
    displayCodes(codes) {
      let val = ""
      for (let i = 0; i < codes.length; i++) {
        val += codes[i] + ', '
      }
      return val
    },
    //this is adding a patient to the data base
    submitPatient(pat) {
      this.patients.push(pat)

      //debugger
      const today = Date.now()
      if (pat.date > today) alert('AHHHHHH')

      createPatient(pat)
    },

    callLoginFunction() {
      //GoogleSignIn()
    }
  } //methods closing bracket
}//return closing bracker
</script>

<style>
body,
html,
div#app {
  height: 100%;
  margin: 0;
  /*  */
  font: 400 16px Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
  font-weight: normal;

}

div.main {
  overflow-y: auto;
  flex: 1;
  background-color: #f0ebf8;
}

div.content-block {
  margin: auto;
  width: 700px;
}

div.top {
  border-bottom: 1px solid #ccc;
}

h1 {
  text-align: center;
  font-family: 'docs-Roboto', Helvetica, Arial, sans-serif;
}

div.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

div.navigation {
  text-align: center;

}

div.navigation>span {
  display: inline-block;
  padding: 10px;
  font-weight: 500;
  cursor: pointer;
}

div.navigation>span.active {
  border-bottom: solid 2px rgb(103, 58, 183);
  ;
}

div.form-title {
  font-size: 36px;

}

div.form-top {
  margin: 15px 0;
  background-color: white;
  padding: 20px;
  border: solid 1px #ccc;
  border-top: solid 5px rgb(103, 58, 183);
  border-radius: 5px;
}

div.form-item {
  margin: 15px 0;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

div.form-item label {
  display: block;
  padding-bottom: 15px;

}

div.form input {
  border: none;
  border-bottom: solid 1px #ccc;
  font-size: 16px;
  outline: none;
}

div.form input:focus {
  border-bottom: solid 1px rgb(103, 58, 183);
  ;
}
</style>