<template>
  <header class="fixed w-full h-12 md:h-16 py-1 md:py-2 bg-gray-200 z-40 shadow-sm">
    <div class="container mx-auto h-full px-4 flex items-center justify-between">
      <a href="#" class="h-full w-20 mr-4">
        <img src="@/assets/images/logo.svg" class="h-full w-auto" alt="Kelo Logo" />
      </a>
        
      <form @submit.prevent="createTask" class="fixed bottom-0 left-0 md:relative w-full md:w-2/3 ">
        <input type='text' ref='title' tabindex='0' placeholder='All your data is saved in LocalStorage'
              class="input w-full px-5 py-3 md:px-6 md:py-3 rounded-0 md:rounded-lg pr-12 border-t-2 border-b-2 md:border-0"
              v-model="task.title" />
        <button class="button absolute flex top-0 right-0 bg-gray-300 md:bg-transparent h-full px-4 ">
          <font-awesome-icon icon="plus" class="text-2xl  text-gray-800 md:text-gray-500 hover:text-gray-800" />
        </button>
      </form>

      <div>
        <div v-if="totalTasks > 0">
          <font-awesome-icon icon="fire-alt" class="mr-2 text-lg" />
          <span class="text-lg">{{totalTasks}}</span>
        </div>
        <div v-else>
          <font-awesome-icon icon="check-double" class="text-2xl" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
    props: {},
    data () {
      return {}
    },
    computed: {
      totalTasks () {
        return this.$store.getters.tasksLeft
      },

      task: {
        get () {
          return this.$store.getters.task
        },
        set (newValue) {
          this.$store.commit('saveTask', newValue)
        }
      } 
    },
    watch: {},
    methods: {
      createTask () {
        this.$emit('createTask')
      }
    }
  }
</script>

<style lang="scss">
    .input, .button {
        &:focus {
            @apply outline-none;
        }
    }
</style>