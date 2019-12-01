<template lang="pug">
  #app
    header.header.header--fixed
      a(href="#").logo.header__logo
        img(src="/assets/images/logo.svg").logo__image
      
      .header__mode.mode
        p.mode__caption(v-if='mode === "all"' @click='changeMode("todo")') ToDo Only
        p.mode__caption(v-else @click='changeMode("all")') Show All
        
      form(@submit.prevent='createTask').header__form
        input(type='text' v-model='omniInput' placeholder='What are you going to do?').input
        
      p.header__tasks Total: {{tasksTotal}}

    .tasks(:class='mode')
      p(v-show='tasksLeft === 0 && mode === "todo"').tasks__message Nothing to do
      .tasks__row(v-for='task, index in filteredTasks' :key='task.index' :class='classState(task.state)').row
        .row__id # {{task.id}}
        input(type='text' v-model='task.text').input.row__input
        .row__actions.actions
          .actions__item(@click='renewTask(index)' v-if='task.state.length').row-icon
            i.far.fa-redo
          .actions__item(@click='finishTask(index)' v-else).row-icon
            i.far.fa-check-circle
          .actions__item(@click='removeTask(index)').row-icon
            i.far.fa-trash-alt
        .row__links
          a(v-for='link, index in extractLinks(task.text)' :key='index' :href='link' target='_blank').actions__item.actions__item--nobg.row-icon
            i.fas.fa-external-link-alt
    
    //pre
      p {{tasks}}
</template>

<script>
class Task {
  constructor(id = 0, text = '', state = '') {
    this.id = id;
    this.text = text;
    this.state = state;
  }
}

export default {
  name: 'app',
  data () {
    return {
      omniInput: '',
      mode: 'all',
      tasks: [],
      timeout: false,
      command: {
        action: false,
        params: false
      }
    }
  },
  
  computed: {
    tasksTotal: function () {
      return this.tasks.length;
    },
    
    tasksLeft: function () {
      if (this.tasks.length) { return false }

      return this.tasks.filter(task => task.state.length === 0).length;
    },

    filteredTasks: function () {
      if (this.tasks.length === 0) { return false }

      if (this.command.action === '/find') {
        if (this.command.params.length > 0) {
          return this.tasks.filter(task => task.text.toLowerCase().indexOf(this.command.params.toLowerCase()) >= 0)
        }
      }
      
      return this.tasks.filter(task => task.state.length === 0)
    }
  },
  
  watch: {
    tasks: {
      deep: true,
      handler: function() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
          localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }, 1000);
      }
    },
    
    mode: function() {
      localStorage.setItem('mode', this.mode);
    },

    omniInput (val) {
      let reg = /\/[a-zA-Z].{0,}\s.{1,}/;

      if (val.match(reg)) {
        let action = val.split(/ (.+)/)[0]
        let params = val.split(/ (.+)/)[1]

        if (action && action.length > 0) {
          this.command.action = val.split(/ (.+)/)[0]
        }
        
        if (params && params.length > 0) {
          this.command.params = val.split(/ (.+)/)[1]
        }

      } else {
          this.command.action = false
          this.command.params = false
      }
    }
  },
  
  mounted () {
    try {
      if(localStorage.getItem('tasks')) {
        let tasks = localStorage.getItem('tasks')
        this.tasks = JSON.parse(tasks);
      }
    } catch (e) {
      // @ToDo: Handle
      return false
    }
  
    if (localStorage.getItem('mode')) {
      this.mode = localStorage.getItem('mode');
    }
  },
  
  methods: {
    classState: function(state) {
      return (state === 'done' ? 'row--' + state : '');
    },
    
    changeMode: function(state) {
      this.mode = state;
    },

    extractLinks: function(string) {
      let reg = /(https?:\/\/[^\s]+)/g;
      return string.match(reg);
    },
    
    createTask: function() {
      let reg = /\/[a-zA-Z].{0,}\s.{1,}/;

      if (this.omniInput.match(reg)) {
        this.command.action = this.omniInput.split(/ (.+)/)[0]
        this.command.params = this.omniInput.split(/ (.+)/)[1]
      } else {
        let task = new Task(0, this.omniInput);
        this.tasks.unshift(task);
        this.omniInput = '';
      }
    },
    
    finishTask: function(index) {
      this.$set(this.tasks[index], 'state', 'done');
    },
        
    renewTask: function(index) {
      this.$set(this.tasks[index], 'state', '');
    },
    
    removeTask: function(index) {
      if (confirm('Are you sure?')) {
        this.tasks.splice(index, 1);
      }
    }
  }
}
</script>

<style lang="scss">
  @import 'src/assets/scss/index.scss';
</style>