import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDcEF75RT4BLjMQV3AKGre9NqiupbBfc2Y",
    authDomain: "verus-69947.firebaseapp.com",
    projectId: "verus-69947",
    storageBucket: "verus-69947.appspot.com",
    messagingSenderId: "1084790538717",
    appId: "1:1084790538717:web:473d7e4d23c76c94c0b634",
    measurementId: "G-XS4DG0T11L"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();
const user = 'dzfhfV7bi2NEpHaMpTd00nrx7hi2';
const path = "/Physicians/dzfhfV7bi2NEpHaMpTd00nrx7hi2/Patients";


/**
 * Signing in with Google
 * @param {object} auth - authenticates connection between client and database.
 * @param {object} provider - type of authentication used, Google in this case.
 * @returns {Null} - doesn't return anything.
 */
export function GoogleSignIn() { signInWithPopup(auth, provider)
 .then((result) => {
   // This gives you a Google Access Token. You can use it to access the Google API.
   const credential = GoogleAuthProvider.credentialFromResult(result);
   const token = credential.accessToken;
   // The signed-in user info.
   const user = result.user;
 }).catch((error) => {
   // Handle Errors here.
   const errorCode = error.code;
   const errorMessage = error.message;
   // The email of the user's account used.
   const email = error.customData.email;
   // The AuthCredential type that was used.
   const credential = GoogleAuthProvider.credentialFromError(error);
 });}



//__________________PATIENTS FUNCTIONS____________________


export function getPatient(id) {
    return new Promise(async(resolve, reject)=>{
 // defining function
        // if length is smaller than 1 it will throw an alert telling the user to enter a valid cr number
        // if (crValue.length == 0) throw alert("Please enter a valid CR number.");
        // listing all the documents in a given path where the cr number is equals to cr_value
        const q = query(collection(db, path), where("id", "==", id));
        // getting the documents specified in q.
        const querySnapshot = await getDocs(q);
        //console.logging every document.
        let patientList = [];

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              patientList.push(doc.data())
              //renderPatients(doc);
          });
        resolve(patientList);
    })}


// Function that creates patient in Firebase
export async function createPatient(patient){
    //console.log(patient.id)
    const numberOfOcurrences = await getPatient(patient.id);
    console.log(numberOfOcurrences)
    if (numberOfOcurrences.length == 0) {
    const physiciansRef = collection(db, path);
    const newPatient = addDoc(physiciansRef,{
    name: patient.name,
    id: patient.id,
    birthday: patient.birthday, 
    chronicDisease: patient.chronicDisease,
    date: patient.date
})
  console.log(patient.birthday)
  console.log(`Path: ${newPatient.path}`)
}
else {
    alert ("Patient already registered")
    console.log(numberOfOcurrences)
    console.log(patient.birthday)

}
}


//__________________APPOINTMENT FUNCTIONS____________________

export function getAppointments(cr) {
    return new Promise(async(resolve, reject)=>{
 // defining function
        // if length is smaller than 1 it will throw an alert telling the user to enter a valid cr number
        // if (crValue.length == 0) throw alert("Please enter a valid CR number.");
        // listing all the documents in a given path where the cr number is equals to cr_value
        const q = query(collection(db, path), where("cr", "==", cr), orderBy("date", "desc"));
        // getting the documents specified in q.
        const querySnapshot = await getDocs(q);
        //console.logging every document.
        let appointmentList = [];

          querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              appointmentList.push(doc.data())
              //renderPatients(doc);
          });
          console.log(appointmentList)
        resolve(appointmentList);
})}


export function newAppointment(apt){
    console.log(apt.id)
    
    const physiciansRef = collection(db, path);
        const newAppointment = addDoc(physiciansRef, {
        //MATTERS A LOT
            diagnosis: apt.diagnosis,
            cr: apt.id,
            patientType: apt.patientType,
            aptType: apt.aptType,
            endTime: apt.endTime,
            travel: apt.didTravel,
            aptLength: apt.aptLength,
            date: apt.date,
            code: apt.code
        })
        // logging on console the path to the new doc.
        console.log(`Your doc was created at ${newAppointment.path}`);
        console.log(apt.code)
    
    }

    export function numberOfAppointmentsAtGivenDate(date) {
      return new Promise(async(resolve, reject)=>{
          const q = query(collection(db, path), where("date", "==", date));
          // getting the documents specified in q.
          const querySnapshot = await getDocs(q);
          //console.logging every document.
          let appointmentList = [];
  
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                appointmentList.push(doc.data())
                //renderPatients(doc);
            });
            console.log(appointmentList.length)
          resolve(appointmentList.length);
  })}