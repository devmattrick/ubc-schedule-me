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
              placeholder="CPSC 101"
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
              placeholder="CPSC 101"
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

const classes = {
  ANTH: ['100A', '101'],
  CPSC: ['101'],
};

const classList = Object.entries(classes).flatMap((pair) => {
  const [key, values] = pair;

  return values.map((value) => `${key} ${value}`);
});

export default Vue.extend({
  data() {
    return {
      name: '',
      filteredClasses: classList,
      firstTermClasses: [],
      secondTermClasses: [],
      electiveClasses: [],
      firstTermCount: 5,
      secondTermCount: 5,
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
                .indexOf(input.toLowerCase()) >= 0;
      });
    },
    addFormSubmit() {
      if (!this.name || this.firstTermClasses.length === 0 || this.secondTermClasses.length === 0) {
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

