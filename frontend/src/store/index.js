import { createStore } from "vuex";

export default createStore({
  state: {
    authenticate: false,
    member_id: "",
    employee_id: "",
    name: "",
    status: "",
    www: false,
    patient_Id: 0,
    //----------------------
    members1: [],
  },
  mutations: {
    setMyAuthenticate(state, authenticate) {
      state.authenticate = authenticate;
    },
    setMyMember_id(state, member_id) {
      state.member_id = member_id;
    },
    setMyEmployee_id(state, employee_id) {
      state.employee_id = employee_id;
    },
    setMyName(state, name) {
      state.name = name;
    },
    setMyStatus(state, status) {
      state.status = status;
    },
    setMyWWW(state, www) {
      state.www = www;
    },
    //---------------------------------
    setMyMembers1(state, members1) {
      state.members1 = members1;
    },
    setPatientId(state, id) {
      state.patient_Id = id;
    },
  },
  // getters: {
  //   myAuthenticate: (state) => state.authenticate,
  //   myMember_id: (state) => state.member_id,
  //   myEmployee_id: (state) => state.employee_id,
  //   myName: (state) => state.name,
  //   myStatus: (state) => state.status,
  //   myWWW: (state) => state.www,
  //   myMembers1: (state) => state.members1,
  // },
  getters: {
    myAuthenticate(state) {
      return state.authenticate;
    },
    myMember_id(state) {
      return state.member_id;
    },
    myEmployee_id(state) {
      return state.employee_id;
    },
    myName(state) {
      return state.name;
    },
    myStatus(state) {
      return state.status;
    },
    myWWW(state) {
      return state.www;
    },
    myMembers1(state) {
      return state.members1;
    },
    myPatientId(state) {
      return state.patient_Id;
    },
  },
  actions: {},
  modules: {},
});
