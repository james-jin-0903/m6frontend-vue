<template>
  <div>
    <div class="align-center d-flex">
      <div
        class="grey lighten-3"
        :class="{ 'py-1 px-10': website, 'pa-16': !website }"
      >
        <m6-upload @loading="loading = !loading" @response="responseAppLogo">
          <v-img v-if="getImage" :src="getImage" width="180" />
          <v-icon
            v-else
            class="grey--text text--lighten-1"
            :size="website ? 20 : 38"
          >
            mdi-image-filter-hdr
          </v-icon>
        </m6-upload>
      </div>
      <div
        class="ml-8"
        :class="{ 'd-flex justify-center align-center': website }"
      >
        <p
          class="add-field font-weight-regular grey lighten-3 mb-0 mr-2 pt-1 px-4 rounded-xl"
        >
          Record Title
        </p>
        <p />
        <add-field @addNewField="addNewField" />
        <v-list v-if="!website" :style="`background-color: ${listBg}`">
          <v-list-item
            v-for="field in appFieldsFiltered()"
            :key="field.id"
            class="my-0 py-0"
          >
            <v-list-item-content @click="editField(field)">
              <v-list-item-title>{{ field.label }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-0 py-0">
              <v-btn icon>
                <v-icon color="red lighten-3" @click="showDelete(field)">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <field
      v-if="showFieldModal"
      :editing="editing"
      :field="activeField"
      :fields-bag="[]"
      :show="showFieldModal"
      @close="showFieldModal = false"
      @result="pushField"
    />

    <v-dialog v-model="showDeleteModal" width="500">
      <delete-dialog :element="message" @closeDeleteModal="confirmDelete" />
    </v-dialog>
    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import AddField from "@/components/AppBuilder/Buttons/AddField";
import Field from "@/components/AppBuilder/Modals/Field";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

// eslint-disable-next-line vue/require-name-property
export default {
  components: {
    AddField,
    Field,
    DeleteDialog,
  },
  props: {
    listBg: {
      type: String,
      default: "#fff",
    },
    listItemColor: {
      type: String,
      default: "rgba(0, 0, 0, 0.87)",
    },
    website: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showDeleteModal: false,
    message: "",
    fieldToDelete: 0,
    defaultField: {
      label: "New Field",
      type: "text",
      weight: 0,
      metadata: {
        options: [],
        required: false,
        headerField: true,
        position: 1,
      },
    },
    activeField: {},
    editing: false,
    showFieldModal: false,
    loading: false,
  }),

  computed: {
    ...mapState("AppBuilder", {
      app: "app",
    }),
    getImage() {
      if (this.$h.dg(this.app, "iconLink", false)) {
        return this.app.iconLink;
      }
      return "";
    },
  },
  methods: {
    ...mapActions("AppBuilder", {
      updateApp: "updateApp",
    }),
    
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    redirect() {
      this.$router.push("/records");
    },

    appFieldsFiltered() {
      return this.$h.dg(this.app, "fields", []).filter((f) => !f.table_id);
    },

    showDelete(field) {
      this.message = `Field '${field.label}'`;
      this.showDeleteModal = true;
      this.fieldToDelete = field.id;
    },

    async confirmDelete(result) {
      if (result) {
        if (this.fieldToDelete !== null) {
          await this.$store.dispatch(
            "AppBuilder/deleteField",
            this.fieldToDelete
          );
          const index = this.app.fields
            .map((item) => item.id)
            .indexOf(this.fieldToDelete);
          this.app.fields.splice(index, 1);
        }
      }

      this.fieldToDelete = null;
      this.showDeleteModal = false;
    },

    addNewField() {
      this.defaultField["appID"] = this.app.id;

      this.activeField = { ...this.defaultField };
      this.editing = false;
      this.showFieldModal = true;
    },

    editField(field) {
      this.defaultField["appID"] = this.app.id;

      this.activeField = { ...this.defaultField, ...field };
      this.editing = true;
      this.showFieldModal = true;
    },

    pushField(item) {
      if (this.editing) {
        const index = this.app.fields.map((item) => item.id).indexOf(item.id);
        this.app.fields[index] = { ...item };
      } else {
        this.app.fields.push(item);
      }
      this.showFieldModal = false;
      this.editing = false;
    },
    async responseAppLogo(data) {
      this.loading = true;
      if (data.ok) {
        this.app.iconLink = data.data.link;
        await this.updateApp({ params: this.app });
        this.notifSuccess("The image was uploaded");
        this.loading = false;
      } else {
        this.loading = false;
        this.notifDanger("There was an error while uploading");
      }
    },
  },
};
</script>
