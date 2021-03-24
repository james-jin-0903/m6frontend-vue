<template>
  <div
    class="card-large-shadow pointer root"
    @click="$emit('click')"
  >
    <div class="inline-flex">
      <h3>{{ title }}</h3>
      <div class="calendar-position">
        <img 
        color="green"
        src="@/assets/actioncenterIcons/017-calendar-16.svg"
        style="width: 30px;"
        >
        <p class="ma-0 day-calendar size-14">{{ day }}</p>
      </div>
    </div>
    <div class="task">
      <p>{{ events.length }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionDate',
  props: {
    title: {
      type: String,
      default: ''
    },
    events: {
      type: [Object, Array],
      default: []
    },
    day: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style>
    .root {
        display: inline-block;
        background: white;
        padding: 10px;
        width: 100%;
        height: 100px;
        border-radius: 10px;
    }
    .root h3 {
        display: inline-flex;
    }
    .img{
        float: right;
        padding: 0.5rem;
        background-color: cadetblue;
        border-radius: 10px;
        font-weight: bold;
    }
    .img p{
        color: white;
        margin: 0;
    }
    .task{
        position: relative;
        float: right;
        text-align: center;
        width: 1.2rem;
        height: 1.2rem;
        font-weight: bold;
        font-size: smaller;
        border-radius: 50%;
        background: rgb(223, 33, 0);
        margin-left: 100%;
        margin-top: 30px;
    }
    .task p {
        color: white;
    }
    .day-calendar{
      position: relative;
      left: 5px;
      top: -30px;
      width: 20px;
      text-align: center;
      font-weight: 900;
      font-family: sans-serif;
      background: -webkit-linear-gradient(45deg, rgba(77,223,161,1) 0%, rgba(13,167,237,1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .calendar-position{
      padding-left: 110px;
      position: absolute;
      width: min-content;
    }
</style>
