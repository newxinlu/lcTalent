import { LOGIN, NOLOGIN } from '../constants/counter'

const INITIAL_STATE = {
  islogin: false
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        islogin: true
      }
     case NOLOGIN:
       return {
         ...state,
         islogin:false
       }
     default:
       return state
  }
}
