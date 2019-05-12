<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Set up People and Classes
          </h1>
          <p class="subtitle">
            Add people and classes to get started. We'll try to match as many classes as possible between everyone!
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="level" v-for="(person, i) in getPeople" :key="i">
          <div class="level-left" style="flex: 1;">
            <div class="level-item" style="width: 100%; justify-content: flex-start;">
              <div class="columns" style="width: 100%;">
                <div class="column is-one-third">
                  <h2 class="is-size-4">{{person.name}}</h2>
                </div>
                <div class="column">
                  <h3>First Term ({{person.firstTermCount}})</h3>
                  <b-tag v-for="clazz in person.firstTermClasses" :key="clazz">{{clazz}}</b-tag>
                </div>
                <div class="column">
                  <h3>Second Term ({{person.secondTermCount}})</h3>
                  <b-tag v-for="clazz in person.secondTermClasses" :key="clazz">{{clazz}}</b-tag>
                </div>
                <div class="column">
                  <h3>Electives</h3>
                  <b-tag v-for="clazz in person.electiveClasses" :key="clazz">{{clazz}}</b-tag>
                </div>
              </div>
            </div>
          </div>
          <div class="level-right">
            <button class="button is-outlined is-danger" @click="removePerson(i)"><b-icon icon="delete"/></button>
          </div>
        </div>

        <div v-if="getPeople.length > 0">
          <hr/>
        </div>

        <h5 class="is-size-5">Add a Person</h5>
        <br>

        <div v-if="error != null">
          <b-message type="is-danger">
            <div v-for="err in error.split('\n')" :key="err">
              {{err}}
              <br/>
            </div>
          </b-message>
        </div>

        <form @submit.prevent="addFormSubmit">
          <b-field label="Name">
            <b-input placeholder="John Doe" v-model="name"/>
          </b-field>

          <b-field label="First Term Classes Count">
            <b-input
              type="number"
              value="5"
              v-model="firstTermCount"
            >
              <template slot-scope="props">
                <span>{{props.option}}</span>
              </template>

              <template slot="empty">
                No classes found
              </template>
            </b-input>
          </b-field>

          <b-field label="Required First Term Classes">
            <b-taginput
              autocomplete
              :data="filteredClasses"
              @typing="getFilteredClasses"
              placeholder="CPSC 101"
              v-model="firstTermClasses"
            >
              <template slot-scope="props">
                <span>{{props.option}}</span>
              </template>

              <template slot="empty">
                No classes found
              </template>
            </b-taginput>
          </b-field>

          <b-field label="Second Term Classes Count">
            <b-input
              type="number"
              value="5"
              v-model="secondTermCount"
            >
              <template slot-scope="props">
                <span>{{props.option}}</span>
              </template>

              <template slot="empty">
                No classes found
              </template>
            </b-input>
          </b-field>

          <b-field label="Required Second Term Classes">
            <b-taginput
              autocomplete
              :data="filteredClasses"
              @typing="getFilteredClasses"
              placeholder="CPSC 210"
              v-model="secondTermClasses"
            >
              <template slot-scope="props">
                <span>{{props.option}}</span>
              </template>

              <template slot="empty">
                No classes found
              </template>
            </b-taginput>
          </b-field>
          <b-field label="Elective Classes">
            <b-taginput
              autocomplete
              :data="filteredClasses"
              @typing="getFilteredClasses"
              placeholder="ANTH 101"
              v-model="electiveClasses"
            >
              <template slot-scope="props">
                <span>{{props.option}}</span>
              </template>

              <template slot="empty">
                No classes found
              </template>
            </b-taginput>
          </b-field>
          <br/>
          <b-field>
            <button class="button is-success">
              <b-icon icon="plus"/> <span>Add Person</span>
            </button>
          </b-field>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.form-indent {
  margin-left: 2em;
}
</style>


<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

let classes = {};
let classList = [] as string[];

fetch('http://localhost/courses')
  .then((response) => response.json())
  .then((json) => {
    classes = json.courses;

    classList = Object.entries(classes).flatMap((pair) => {
      const [key, values] = pair;

      return (values as string[]).map((value) => `${key} ${value}`);
    });
  });

const conditionsToError = [
  {
    condition: (context: any) => !context.name,
    message: 'No name entered',
  },
  {
    condition: (context: any) => context.firstTermClasses.length === 0,
    message: 'No first term classes entered',
  },
  {
    condition: (context: any) => context.secondTermClasses.length === 0,
    message: 'No second term classes entered',
  },
  {
    condition: (context: any) => {
      const classesGiven = context.firstTermClasses.length +
                              context.secondTermClasses.length +
                              context.electiveClasses.length;
      const classesRequested = context.firstTermCount + context.secondTermCount;

      return classesGiven < classesRequested;
    },
    message: 'Classes requested exceed the courses given',
  },
];

export default Vue.extend({
  data() {
    return {
      name: '',
      filteredClasses: classList,
      firstTermClasses: [] as string[],
      secondTermClasses: [] as string[],
      electiveClasses: [] as string[],
      firstTermCount: 5,
      secondTermCount: 5,
      error: null as unknown,
    };
  },
  methods: {
    ...mapMutations([
      'addPerson',
      'removePerson',
    ]),
    getFilteredClasses(input: string): void {
      this.filteredClasses = classList.filter((clazz) => {
        return clazz
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0 && !this.isIncluded(clazz);
      }).slice(0, 10);
    },
    isIncluded(clazz: string): boolean {
      return this.firstTermClasses.includes(clazz) ||
        this.secondTermClasses.includes(clazz) ||
        this.electiveClasses.includes(clazz);
    },
    addFormSubmit() {
      const relevantConditions = conditionsToError.filter((element, _) => element.condition(this));

      if (relevantConditions.length > 0) {
        let e = 'Cannot add person due to the following errors:\n';

        relevantConditions.forEach((err) => {
          e += '- ' + err.message + '\n';
        });

        this.error = e;
        return;
      }

      this.addPerson({
        name: this.name,
        firstTermClasses: this.firstTermClasses.slice(),
        secondTermClasses: this.secondTermClasses.slice(),
        electiveClasses: this.electiveClasses.slice(),
        firstTermCount: this.firstTermCount,
        secondTermCount: this.secondTermCount,
      });

      this.name = '';
      this.firstTermClasses = [];
      this.secondTermClasses = [];
      this.electiveClasses = [];
      this.firstTermCount = 5;
      this.secondTermCount = 5;

    },
  },
  computed: {
    ...mapGetters([
      'getPeople',
    ]),
  },
});
</script>

