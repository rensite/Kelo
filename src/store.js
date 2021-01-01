import Vue from 'vue';
import Vuex from 'vuex';
import Task from './classes/Task.js';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

const store = new Vuex.Store({
  state: {
    currentIndex: 0,
    taskList: [],
  },
  getters: {
    currentIndex: state => {
      return state.currentIndex;
    },
    taskList: state => {
      return state.taskList;
    },
    taskListTotal: state => {
      return state.taskList.length;
    },
    taskListLeft: state => {
      return state.taskList.filter(task => !task.state).length;
    }
  },
  mutations: {
    rewriteTaskList (state, taskList) {
      state.taskList = taskList;
    },
    updateIndex (state) {
      // @ToDo: nextIndex has a concurrency problem (i.e. different browser tabs)
      state.currentIndex++;
    },
    updateTask (state, {taskPosition, task}) {
      state.taskList[taskPosition] = task;
    }
  },
  actions: {
    createTask ({commit, dispatch, getters}, title) {
      commit('updateIndex');
      const { currentIndex } = getters;
      const task = new Task(title, currentIndex);
      dispatch('pushTask', task);
    },
    pushTask ({commit, getters}, task) {
      const { taskList } = getters;
      taskList.unshift(task);
      commit('rewriteTaskList', taskList);
    },
    updateTask ({getters, commit}, payload) {
      const {taskPosition, taskField, newTitle} = payload;
      const task = getters.taskList[taskPosition];
      task[taskField] = newTitle;
      commit('updateTask', {taskPosition, task});
      console.log(taskPosition,task, taskField, newTitle);
    },
    removeTask ({getters, commit}, taskId) {
      if (confirm('Are you sure?')) {
        const { taskList } = getters;
        const indexTask = getters.taskList
          .findIndex(task => task.id === taskId);
        taskList.splice(indexTask, 1);
        commit('rewriteTaskList', taskList);
      }
    },
    toggleTaskState ({getters, commit}, taskId) {
      const task = getters.taskList.find(task => task.id === taskId);
      task.state = !task.state;
      commit('updateTask', taskId, task);
    },
  },
  plugins: [vuexLocal.plugin],
});

export default store;
