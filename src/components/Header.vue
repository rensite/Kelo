<template>
  <header class="fixed w-full h-12 md:h-16 py-1 md:py-2 bg-gray-200 z-40 shadow-sm">
    <div class="container mx-auto h-full px-4 flex items-center justify-between">
      <a
        href="#"
        class="h-full w-20 mr-4"
      >
        <img
          src="@/assets/images/logo.svg"
          class="h-full w-auto"
          alt="Kelo Logo"
        />
      </a>

      <form
        @submit.prevent="createTask"
        class="fixed bottom-0 left-0 md:relative w-full md:w-2/3 "
      >
        <input
          v-model="taskTitle"
          type="text"
          ref="title"
          tabindex="0"
          placeholder="All your data is saved in LocalStorage"
          class="input w-full pl-5 pr-10 py-3 md:pl-6 md:pr-12 md:py-3 rounded-0 md:rounded-lg border-t-2 border-b-2 md:border-0"
        />
        <button v-if="taskTitle.length" class="button absolute flex items-center top-0 right-0 bg-gray-300 md:bg-transparent h-full px-4 ">
          <font-awesome-icon
            icon="plus"
            class="text-2xl text-gray-800 md:text-gray-500 hover:text-gray-800"
          />
        </button>
      </form>

      <div class="buttons flex items-center">
        <div v-if="taskListLeft > 0">
          <font-awesome-icon
            icon="fire-alt"
            class="mr-2 text-lg"
          />
          <span class="text-lg">{{taskListLeft}}</span>
        </div>
        <div v-else>
          <font-awesome-icon
            icon="check-double"
            class="text-2xl"
          />
        </div>

        <a
          href="#"
          class="button ml-2"
          @click.self="backup"
        >
          <font-awesome-icon
            icon="save"
            class="text-2xl pointer-events-none"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  data () {
    return {
      taskTitle: '',
    };
  },
  computed: {
    ...mapGetters({
      taskListLeft: 'taskListLeft',
    }),
  },
  methods: {
    createTask () {
      if (this.taskTitle.length) {
        this.$emit('create-task', this.taskTitle);
        this.clearTask();
      }
    },
    clearTask () {
      this.taskTitle = '';
    },
    backup(e) {
      const text = localStorage.getItem('vuex');
      console.log(text);
      const file = new Blob([text], {type: 'text/json'});
      e.target.href = URL.createObjectURL(file);
      e.target.download = 'kelo-backup.json';
    },
  }
};
</script>

<style lang="scss">
    .input, .button {
        &:focus {
            @apply outline-none;
        }
    }
</style>
