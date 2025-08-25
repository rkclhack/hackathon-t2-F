<script setup>
const handleClick = () => {
  alert("ボタンがクリックされました")
}

const handleMouseOver = () => {
  alert("ボタンがマウスオーバーされたよーー")
}
</script>

<template>
  <h1>Sample4</h1>
  <button @click="handleClick">click</button>
  <button @mouseover="handleMouseOver">MouseOver</button>
  <!-- <button>@mouseover="handleMouseOver">MouseOver</button> -->
</template>




