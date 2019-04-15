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
        <hr/>
        <h5 class="is-size-5">Add a Person</h5>
        <br>
        <form>
          <b-field label="Name">
            <b-input placeholder="John Doe"/>
          </b-field>

          <b-field label="Classes">
            <b-taginput
              autocomplete
              :data="filteredClasses"
              @typing="getFilteredClasses"
              field="code"
              placeholder="HCOM 101"
              v-model="selectedClasses"
            >
              <template slot-scope="props">
                <span>{{props.option.code}}</span>
              </template>

              <template slot="empty">
                No classes found
              </template>
            </b-taginput>
          </b-field>
          <br/>
          <b-field>
            <button class="button is-success">Add Person</button>
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
import { mapActions, mapGetters } from 'vuex';

const classes = [
  {
    code: 'HCOM 101',
    name: 'Human Communications 101',
  },
];

export default Vue.extend({
  data() {
    return {
      filteredClasses: classes,
      selectedClasses: [],
    };
  },
  methods: {
    ...mapActions([
      'addPerson',
      'removePerson',
    ]),
    getFilteredClasses(input: string): void {
      this.filteredClasses = classes.filter((clazz) => {
        return clazz.code
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0;
      });
    },
  },
});
</script>

