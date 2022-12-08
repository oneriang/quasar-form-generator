<template>
    <div class="p-5 w-56 border-2 border-blue-300 rounded-md mx-auto">
      <div>名前: {{ name }}</div>
      <div>年齢: {{ age }}</div>
      <div>性別: {{ gender }}</div>
      <div>電話番号: {{ phoneNumber }}</div>
    </div>
  </template>
  <script>
  export default ({
    name: 'TestPage',
    props: ['name', 'age', 'gender', 'phoneNumber'],
  })
  </script>