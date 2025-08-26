<script setup>
import { provide, ref } from "vue"
// #region reactive state
const userName = ref("")
const reportData = reactive({
  task: '',
  url: '',
  process: '',
  post_time: null,
  ID: null,
  username: ''
})
const feedbackData = reactive({
  fb_comment: '',
  fb_eva: '', // 'good' or 'bad'
  report_id: null,
  reviewer_username: ''
})
// #endregion
// #region global variable
provide("userName", userName)
provide("reportData", reportData)
provide("feedbackData", feedbackData)
provide("feedbackList", feedbackList)

provide("updateReportData", (newReportData) => {
  Object.assign(reportData, newReportData)
})

provide("addFeedback", (newFeedback) => {
  feedbackList.push({
    id: Date.now(), // 簡易ID生成
    fb_comment: newFeedback.fb_comment,
    fb_eva: newFeedback.fb_eva,
    report_id: newFeedback.report_id,
    reviewer_username: newFeedback.reviewer_username,
    created_at: new Date()
  })
})

// #endregion
</script>
<template>
  <router-view />
</template>
<style scoped>
</style>