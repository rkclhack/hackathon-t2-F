<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")
// #endregion 

//set username
const login = (name) =>{
  userName.value = name
}

// #region global variable
provide("userName", userName)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
