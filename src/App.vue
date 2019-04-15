<template>
  <div id="app">
    <div class="page-layout">
      <header class="navbar is-spaced">
        <div class="container">
          <div class="navbar-brand">
            <div class="navbar-item">
              <span class="is-size-3">☀️ UBC Schedule Me</span>
            </div>
          </div>
        </div>
      </header>

      <div class="page-content">
        <transition name="router-slide" mode="out-in">
          <router-view/>
        </transition>
      </div>

      <section class="section">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <router-link
                class="button"
                :to="{ name: pages[currentPage - 1] }"
                :disabled="!allowPrev"
              >
                Previous
              </router-link>
            </div>
            <div class="level-right">
              <router-link
                class="button is-primary"
                :to="{ name: pages[currentPage + 1] }"
                :disabled="!allowNext"
              >
                Next
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.router-slide-enter-active, .router-slide-leave-active {
  transition: 0.3s ease-in-out;
  transition-property: transform, opacity;
}
.router-slide-enter, .router-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      currentPage: 0,
      pages: [
        'home',
        'classes',
      ],
    };
  },
  computed: {
    allowPrev(): boolean {
      return this.currentPage > 0;
    },
    allowNext(): boolean {
      return this.currentPage < this.pages.length - 1;
    },
  },
  watch: {
    $route(to) {
      this.currentPage = to.name ? this.pages.indexOf(to.name) : -1;
    },
  },
});
</script>

