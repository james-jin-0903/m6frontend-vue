import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import axios from 'axios'

Vue.use(firestorePlugin)
const config = {
  apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASEURL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID,
  projectId: process.env.VUE_APP_FIREBASE_PROJECTID
}

export let db = {}
export let storage = {}
let firebaseInitiated = false
let firebaseCPMApp = null
const getToken = true

export const destroyFirebase = () => {
  if (firebaseInitiated) {
    firebaseCPMApp.delete()
    firebaseInitiated = false
    // eslint-disable-next-line no-console
    console.log('Firebase Delete')
  } else {
    // eslint-disable-next-line no-console
    console.log('Firebase not initiated')
  }
}

// eslint-disable-next-line no-async-promise-executor
export const doFirebaseAuth = () => new Promise(async (resolve, reject) => {
  // eslint-disable-next-line no-console
  console.log('Starting Firebase Auth')

  const { data: { token } } = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/firebase/getToken`)
  firebase
    .auth()
    .signInWithCustomToken(token)
    .then(() => {
      resolve(true)
      // eslint-disable-next-line no-console
      console.log('Firebase Auth Done')
    }).catch(e => {
    // eslint-disable-next-line no-console
      console.log(e)
      reject(e)
    })
})


export const newFirebaseInit = () => new Promise(async (resolve, reject) => {
  try {
    if (!firebase.apps.length) {
      firebaseCPMApp = firebase.initializeApp(config)
      firebaseInitiated = true
      db = firebase.firestore()
      storage = firebase.storage()
    }
    console.log('Firebase Init')

    resolve(true)
  } catch (e) {
    console.log(e)
    reject(e)
  }
})
