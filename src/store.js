import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

class Task {
    constructor(id = 0, title = '', text = '', state = false) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.state = state;
    }
  }

const store = new Vuex.Store({
    state: {
        index: 1,
        task: false,
        taskList: []
    },
    getters: {
        index: state => {
            return state.index
        },
        task: state => {
            return state.task
        },
        taskList: state => {
            return state.taskList
        },
        totalTasks: state => {
            return state.taskList.length
        },
        tasksLeft: state => {
            return state.taskList.filter(task => !task.state).length
        }
    },
    mutations: {
        taskList (state, taskList) {
            state.taskList = taskList
        },
        saveTask (state) {
            state.task = new Task(state.index)
        },
        index (state, index) {
            state.index = index
        },
        incrementIndex (state) {
            state.index++
        },
        removeTask (state, taskId) {
            let index = state.taskList.findIndex(task => task.id === taskId)
            state.taskList.splice(index, 1);
        }
    },
    actions: {
        pushTask ({commit, getters}) {
            let taskList = getters.taskList
            taskList.unshift(getters.task)

            commit('taskList', taskList)
            commit('incrementIndex')
            commit('saveTask')
        }
    }
})

export default store