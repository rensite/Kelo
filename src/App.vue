<template>
  <div id="app">
    <Header @createTask="createTask"></Header>
    <div class="pt-16 md:pt-20">
      <div class="container mx-auto px-2 md:px-4">
        <div v-if="(taskList.length > 0)">
          <div v-if="totalTasks === 0" class="flex flex-col items-center justify-center text-center text-gray-500 py-16">
            <font-awesome-icon icon="check-double" class="mb-5 text-6xl" />
            <span class="text-lg font-light">All tasks had been completed! ツ</span>
          </div>
          <div v-for="task in taskList" :key="task.id">
            <TaskRow :task="task" @updateTask="updateTask" @removeTask="removeTask"></TaskRow>
          </div>
        </div>
        <div v-else class="flex flex-col items-center font-light justify-center text-center text-gray-500 text-lg py-16">  
          <font-awesome-icon icon="star" class="mb-5 text-6xl" />
          <span>There are no tasks yet.<br> It's perfect time to start!</span>
        </div>
      </div>
    </div>
    <footer class="text-center pt-6 pb-16">
      <span class="text-sm text-gray-300 mr-2 font-light">&copy; 2020 Renat Galin</span>
      <a href="https://github.com/rensite/Kelo" class="text-gray-300 hover:text-gray-600" target="_blank">
        <font-awesome-icon :icon="['fab', 'github']" prefix="fab" class="text-lg" />
      </a>
    </footer>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  import TaskRow from '@/components/TaskRow.vue'

  export default {
    name: 'app',
    data () {
      return {}
    },
    components: {
      Header,
      TaskRow
    },
    computed: {
      taskList () {
        return this.$store.getters.taskList
      },
      index () {
        return this.$store.getters.index
      },
      totalTasks () {
        return this.$store.getters.tasksLeft
      },
    },
    
    created () {
      let index = 1,
          taskList = []

      document.title = 'Kelo - Save anything in one place';

      this.manageLocalStorage('index', index)
      this.manageLocalStorage('taskList', taskList)

      this.$store.commit('saveTask')
    },
    
    methods: {
      manageLocalStorage (field = 'index', value) {
        if (!localStorage.getItem(field)) {
          localStorage.setItem(field, JSON.stringify(value))
        } else {
          try {
            value = JSON.parse(localStorage.getItem(field))
          } catch {
            let backup = localStorage.getItem(field)
            localStorage.setItem(`${field}.backup`, backup)
            localStorage.setItem(field, JSON.stringify(value))
          }
        }

        this.$store.commit(field, value)
      },

      updateLocalStorage (field = 'index') {
        let value = this.$store.getters[field]
        localStorage.setItem(field, JSON.stringify(value))
      },

      createTask () {
        this.$store.dispatch('pushTask')

        this.updateLocalStorage('index')
        this.updateLocalStorage('taskList')
      },

      updateTask () {
        this.updateLocalStorage('index')
        this.updateLocalStorage('taskList')
      },

      removeTask: function(taskId) {
        if (confirm('Are you sure?')) {
          this.$store.commit('removeTask', taskId)
          
          this.updateLocalStorage('index')
          this.updateLocalStorage('taskList')
        }
      }
    }
  }
</script>