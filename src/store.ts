import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface Person {
  name: string;
  firstTermClasses: string[];
  secondTermClasses: string[];
  electiveTermClasses: string[];
  firstTermCount: number;
  secondTermCount: number;
}

export default new Vuex.Store({
  state: {
    people: new Array<Person>(),
  },
  getters: {
    getPeople(state) {
      return state.people;
    },
  },
  mutations: {
    addPerson(state, person: Person) {
      state.people.push(person);
    },
    removePerson(state, person: number) {
      state.people.splice(person, 1);
    },
  },
  actions: {

  },
});
