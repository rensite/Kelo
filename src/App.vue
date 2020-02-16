<template lang="pug">
  #app(:class='{"editorMode" : editor}')
    header.header.header--fixed
      a(href="#").logo.header__logo
        img(src="@/assets/images/logo.svg").logo__image
      
      .header__mode.mode
        p.mode__caption(v-if='mode === "all"' @click='changeMode("todo")') ToDo Only
        p.mode__caption(v-else @click='changeMode("all")') Show All
        
      form(@submit.prevent='createTask').header__form
        input(type='text' v-model='current.title' @keydown.ctrl.enter.prevent='openEditor(current)' @input.lazy='inputParse(current.title)' placeholder='Type, save or /f' ref='title' tabindex='0').input
        
      p.header__tasks Total: {{tasksTotal}}

    .tasks(:class='mode')
      p(v-show='noTasks').tasks__message Nothing to do
      
      .tasks__row(v-for='task, index in filteredTasks' :key='task.id' :class='classState(task.state)').row
        .row__info
          a(@click='openEditor(task, true)' v-if='task.text.length').actions__item.actions__item--nobg.row-icon
            i.fas.fa-align-left
        input(type='text' v-model='task.title' tabindex='-1').input.row__input
        .row__actions.actions
          .actions__item(@click='renewTask(task)' v-if='task.state.length').row-icon
            i.fas.fa-redo
          .actions__item(@click='finishTask(task)' v-else).row-icon
            i.far.fa-check-circle
          .actions__item(@click='removeTask(task)').row-icon
            i.far.fa-trash-alt
        .row__links
          a(v-for='link, index in extractLinks(task.title)' :key='index' :href='link' target='_blank').actions__item.actions__item--nobg.row-icon
            i.fas.fa-external-link-alt
    .editor
      textarea(v-model='current.text' placeholder='Task description' ref="textarea" tabindex='0' v-autosize).editor__textarea.textarea
      .editor__footer
        button(@click='createTask').button Save
        button(@click='openEditor').button.button--hollow Cancel

</template>

<script>
// import { log } from 'util';
class Task {
  constructor(id = 1, title = '', text = '', state = '') {
    this.id = id;
    this.title = title;
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
      index: 1,
      tasks: [],
      current: {},
      timeout: false,
      editor: false,
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
    
    noTasks: function () {
      let result = false

      if (this.mode === 'todo') {
        result = this.tasks.filter(task => task.state.length === 0).length === 0
      } else {
        result = this.tasks.length === 0
      }
      
      return result
    },

    filteredTasks: function () {
      if (this.tasks.length === 0) { return false }

      if (this.command.action === '/f') {
        if (this.command.params.length > 0) {
          return this.tasks.filter(task => task.title.toLowerCase().indexOf(this.command.params.toLowerCase()) >= 0)
        }
      }
      
      return this.tasks
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
    }
  },
  
  mounted () {
    if (localStorage.getItem('index')) {
      this.index = parseInt(localStorage.getItem('index'));
    } else {
      localStorage.setItem('index', this.index)
    }

    this.current = new Task(this.index)

    try {
      if(localStorage.getItem('tasks')) {
        let tasks = localStorage.getItem('tasks')
        this.tasks = JSON.parse(tasks);
      }
    } catch (e) {
      // @ToDo: Handle
      // console.log(e)
      return false
    }
  
    if (localStorage.getItem('mode')) {
      this.mode = localStorage.getItem('mode');
    }
  },
  
  methods: {
    classState: function(state) {
      return (state === 'done' ? 'row--' + state : '')
    },

    openEditor: function(task, editTask = false) {
      if (editTask) {
        this.current = JSON.parse(JSON.stringify(task))
      }

      if (!this.editor) {
        this.editor = true
        this.$refs.textarea.focus()
      } else if (this.editor) {
        this.editor = false
        this.$refs.title.focus()
      }
    },

    inputParse (input) {
      let reg = /\/[a-zA-Z].{0,}\s.{1,}/;

      if (input.match(reg)) {
        let action = input.split(/ (.+)/)[0]
        let params = input.split(/ (.+)/)[1]

        if (action && action.length > 0) {
          this.command.action = input.split(/ (.+)/)[0]
        }
        
        if (params && params.length > 0) {
          this.command.params = input.split(/ (.+)/)[1]
        }

      } else {
          this.command.action = false
          this.command.params = false
      }
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

      if (this.current.title.match(reg)) {
        this.command.action = this.omniInput.split(/ (.+)/)[0]
        this.command.params = this.omniInput.split(/ (.+)/)[1]
      } else if (this.current.title.length > 0) {
        let task = this.current
        this.index++
        localStorage.setItem('index', this.index)

        this.tasks.unshift(task);
        this.current = new Task(this.index);
      }

      if (this.editor) {
        this.editor = false
        this.$refs.title.focus()
      }
    },
    
    finishTask: function(task) {
      this.$set(task, 'state', 'done');
    },
        
    renewTask: function(task) {
      this.$set(task, 'state', '');
    },
    
    removeTask: function(task) {
      if (confirm('Are you sure?')) {
        this.tasks.splice(this.tasks.indexOf(task), 1);
      }
    }
  }
}
</script>

<style lang="scss">
  @import 'src/assets/scss/index.scss';
</style>