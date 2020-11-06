<template>
  <div id="app">
    <Header @create-task="createTask"></Header>
    <div class="pt-16 md:pt-20">
      <div class="container mx-auto px-2 md:px-4">
        <div v-if="(taskListTotal > 0)">
          <div
            v-if="taskListTotal === 0"
            class="flex flex-col items-center justify-center text-center text-gray-500 py-16"
          >
            <font-awesome-icon
              icon="check-double"
              class="mb-5 text-6xl"
            />
            <span class="text-lg font-light">All tasks had been completed! ツ</span>
          </div>
          <div
            v-for="(task, index) in taskList"
            :key="task.id"
          >
            <TaskRow
              :task="task"
              :taskPosition="index"
              @updateTask="update-task"
              @removeTask="remove-task"
            />
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center font-light justify-center text-center text-gray-500 text-lg py-16"
        >
          <font-awesome-icon
            icon="star"
            class="mb-5 text-6xl"
          />
          <span>There are no tasks yet.<br> It's perfect time to start!</span>
        </div>
      </div>
    </div>
    <footer class="text-center pt-6 pb-16">
      <span class="text-sm text-gray-300 mr-2 font-light">&copy; 2020 Renat Galin</span>
      <a
        href="https://github.com/rensite/Kelo"
        class="text-gray-300 hover:text-gray-600"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'github']"
          prefix="fab"
          class="text-lg"
        />
      </a>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Header from '@/components/Header.vue';
import TaskRow from '@/components/TaskRow.vue';

export default {
  name: 'app',
  components: {
    Header,
    TaskRow
  },
  computed: {
    ...mapGetters([
      'taskList',
      'taskListTotal',
      'taskListLeft',
    ]),
  },
  created () {
    document.title = 'Kelo - Save anything in one place';
  },
  methods: {
    ...mapActions({
      createTask: 'createTask',
    }),
  }
};
</script>
