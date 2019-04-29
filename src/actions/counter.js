import {
  LOGIN, NOLOGIN
} from '../constants/counter'

export const isLogin = () => {
  return {
    type: LOGIN,
  }
}
export const noLogin = () => {
  return {
    type: NOLOGIN,
  }
}

// 异步的action
export function asyncLogin () {
  return dispatch => {
    setTimeout(() => {
      dispatch(isLogin())
    }, 100)
  }
}
export function asyncNoLogin () {

  return dispatch => {
    setTimeout(() => {
      dispatch(noLogin())
    }, 100)
  }
}
