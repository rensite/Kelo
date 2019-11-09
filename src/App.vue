<template lang="pug">
  #app
    header.header.header--fixed
      a(href="#").logo.header__logo
        img(src="https://rensite.ru/files/mockup/logo.svg").logo__image
      
      .header__mode.mode
        p.mode__caption(v-if='mode === "all"' @click='changeMode("todo")') ToDo Only
        p.mode__caption(v-else @click='changeMode("all")') Show All
        
      form(@submit.prevent='createTask').header__form
        input(type='text' v-model='newTask' placeholder='What are you going to do?').input
        
      p.header__tasks Total: {{tasksTotal}}

    .tasks(:class='mode')
      p(v-show='tasksLeft === 0 && mode === "todo"').tasks__message Nothing to do
      .tasks__row(v-for='task, index in tasks' :key='task.text' :class='classState(task.state)').row
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
      newTask: '',
      mode: 'all',
      tasks: []
    }
  },
  
  computed: {
    tasksTotal: function () {
      return this.tasks.length;
    },
    
    tasksLeft: function () {
      return this.tasks.filter(task => task.state.length === 0).length;
    }
  },
  
  watch: {
    tasks: {
      deep: true,
      handler: function() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
      }
    },
    
    mode: function() {
      localStorage.setItem('mode', this.mode);
    }
  },
  
  mounted () {
   if (localStorage.getItem('tasks')) {
    this.tasks = JSON.parse(localStorage.getItem('tasks'));
   } else {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
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
      //eslint-disable-next-line
      console.log(string.match(reg));
      return string.match(reg);
    },
    
    createTask: function() {
      let task = new Task(0, this.newTask);
      this.tasks.unshift(task);
      this.newTask = '';
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