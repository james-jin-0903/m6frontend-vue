<template>
  <span>
    <span v-bind="attrs" v-on="on">
      <template
        v-if="
          field.type === 'boolean' && genericRecord[`${field.id}`] !== undefined
        "
      >
        {{ genericRecord[`${field.id}`] ? "Yes" : "No" }}
      </template>
      <template
        v-else-if="
          field.type === 'trilean' && genericRecord[`${field.id}`] !== undefined
        "
      >
        {{ getTriValue(genericRecord[`${field.id}`]) }}
      </template>
      <template
        v-else-if="
          field.type === 'attachment' &&
          genericRecord[`${field.id}`] !== undefined
        "
      >
        {{ genericRecord[`${field.id}`]["file_name"] }}
      </template>
      <template
        v-else-if="
          field.type === 'imageDropArea' &&
          genericRecord[`${field.id}`] !== undefined
        "
      >
        <img
          :src="genericRecord[`${field.id}`]"
          width="200"
          :alt="`f-value-${field.id}`"
        />
      </template>
      <template
        v-else-if="
          field.type === 'number' && genericRecord[`${field.id}`] !== undefined
        "
      >
        {{
          genNumber(genericRecord[`${field.id}`], field.metadata.numberOption)
        }}
      </template>
      <template
        v-else-if="
          field.type === 'timestamp' &&
          genericRecord[`${field.id}`] !== undefined
        "
      >
        {{ genTimestamp(genericRecord[`${field.id}`], field.metadata.format) }}
      </template>
      <template
        v-else-if="
          field.type === 'people' && genericRecord[`${field.id}`] !== undefined
        "
      >
        {{ genPeopleValue(genericRecord[`${field.id}`]) }}
      </template>
      <template
        v-else-if="
          $h.dg(field, 'machine_name', '') === 'rapid_snapshot' &&
          genericRecord[`${field.id}`] !== undefined
        "
      >
        <img class="full-size" :src="genericRecord[`${field.id}`]" />
      </template>
      <template
        v-else-if="
          field.type === 'taxonomy' &&
          genericRecord[`${field.id}`] !== undefined
        "
      >
        {{ taxonomyValues[field.id] }}
      </template>
      <template v-else-if="Array.isArray(genericRecord[`${field.id}`])">
        <template
          v-if="$h.dg(field, 'metadata.displayFormat', '') === 'bullet'"
        >
          <ul v-if="typeof genericRecord[`${field.id}`][0] === 'object'">
            <li
              v-for="g in genericRecord[`${field.id}`]"
              :key="g.id"
              class="align-center d-flex"
            >
              <v-img
                v-if="field.metadata.bulletIcon"
                class="mr-2"
                d-inline
                :src="field.metadata.bulletIcon"
                width="10px"
              />
              <v-icon v-else class="mr-1" size="24"> mdi-rectangle </v-icon>
              {{ g.value }}
            </li>
          </ul>

          <ul v-else>
            <li
              v-for="g in genericRecord[`${field.id}`]"
              :key="g.id"
              class="align-center d-flex"
            >
              <v-img
                v-if="field.metadata.bulletIcon"
                class="mr-2"
                d-inline
                :src="field.metadata.bulletIcon"
                width="10px"
              />
              <v-icon v-else class="mr-1" size="24"> mdi-rectangle </v-icon>
              {{ g }}
            </li>
          </ul>
        </template>
        <template v-else>
          {{
            typeof genericRecord[`${field.id}`][0] === "object"
              ? genericRecord[`${field.id}`].map((g) => g.value).join(", ")
              : genericRecord[`${field.id}`].join(", ")
          }}
        </template>
      </template>
      <template v-else-if="typeof genericRecord[`${field.id}`] === 'object'">
        {{ genericRecord[`${field.id}`].value }}
      </template>
      <template v-else>
        {{ genericRecord[`${field.id}`] }}
      </template>
    </span>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ProgressiveFieldSwitch",
  props: {
    attrs: {
      type: Object,
      default: () => ({}),
    },
    field: {
      type: Object,
      default: () => ({}),
    },
    fields: {
      type: Array,
      default: () => [],
    },
    genericRecord: {
      type: Object,
      default: () => ({}),
    },
    on: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  computed: {
    progressive() {
      const fieldList = this.fields.filter(
        (field) =>
          field.type !== "helper-media" &&
          field.metadata.progressiveField === "yes" &&
          field.metadata.progressiveFieldId === this.field.id &&
          field.type !== "autonumber"
      );
      fieldList.forEach((field) => this.$set(field, "showFieldForm", false));
      return fieldList;
    },
  },
  methods: {
    genNumber(value, format) {
      if (format === "currency") {
        return (
          "$" +
          parseFloat(value)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        );
      } else {
        return parseFloat(value);
      }
    },
    getTriValue(value) {
      if (value === 1) {
        return "Yes";
      } else if (value === 0) {
        return "No";
      } else {
        return "N/A";
      }
    },
    genTimestamp(value, format) {
      if (format) {
        const date = new Date(value);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        const hour = ("0" + date.getHours()).slice(-2);
        const min = ("0" + date.getMinutes()).slice(-2);
        const sec = ("0" + date.getSeconds()).slice(-2);
        switch (format) {
          case "mm/dd/YYYY":
            return `${month}/${day}/${year}`;
          case "mm/dd/YYYY H:m:s":
            return `${month}/${day}/${year} ${hour}:${min}:${sec}`;
          case "dd/mm/YYYY H:m:s":
            return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
        }
      } else {
        return value;
      }
    },
    genPeopleValue(peopleArray) {
      const name = [];
      if (Array.isArray(peopleArray)) {
        peopleArray.map((row) => {
          const res = this.currentCompanyUsers.find(
            (u) => this.$h.dg(u, "user.id", "") === row
          );
          name.push(
            this.$h.dg(res, "user.firstName", "") +
              " " +
              this.$h.dg(res, "user.lastName", "")
          );
        });
        return name.join(", ");
      }
      return peopleArray;
    },
  },
};
</script>

<style>
</style>