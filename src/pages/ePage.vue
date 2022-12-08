<template>
    <div>

        <!-- elements -->
        <div v-for="(item) in items" ref="elements" :key="item.id">

            <!-- element's content -->
            <div>ID: {{ item.id }}</div>
            <div>Name: {{ item.name }}</div>

        </div>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

// a list for testing
let items = [
    { id: 1, name: 'item name 1' },
    { id: 2, name: 'item name 2' },
    { id: 3, name: 'item name 3' },
];

// this also works with a list of elements
let elements = ref(null);

// testing
onMounted(() => {

    let all = elements.value;
    let item1 = all[0];
    let item2 = all[1];
    let item3 = all[2];

    console.log([all, item1, item2, item3]);

});
</script>
