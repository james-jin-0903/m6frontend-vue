<template>
  <vue-upload-component
    accept="image/png,image/gif,image/jpeg,image/webp"
    class="drop-file__div"
    :class="{ expanded: !fileName }"
    :drop="true"
    :multiple="false"
    @input-filter="onFilePicked"
  >
    <v-icon x-large> mdi-cloud-upload </v-icon>
    <br />
    <p class="mb-0">Drag & Drop file here</p>
    <br />
    <p v-if="fileName" class="file-name__span">
      {{ fileName }}
    </p>
    <div v-else>
      <p class="mb-0">or</p>
      <br />
      <p class="file-name__span__btn mb-0">Browse File</p>
    </div>
  </vue-upload-component>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
import Compressor from "compressorjs";
import VueUploadComponent from "vue-upload-component";

const vueAppHttpPoint = process.env.VUE_APP_HTTP;
const vueAppEndpPoint = process.env.VUE_APP_ENDPOINT;

export default {
  name: "DropArea",
  props: {
    btnButton: {
      type: String,
      default: "",
    },
    acceptedFileType: {
      type: String,
      default: "",
    },
    small: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Object],
      default: null,
    },
  },
  components: {
    VueUploadComponent,
  },
  data: () => ({
    fileMap: {
      image: "image/*",
    },
    file: {},
    fileURL: null,
  }),
  computed: {
    fileName() {
      return this.value
        ? typeof this.value == "object"
          ? this.value.file_name
          : this.value
        : this.file.name;
    },
  },
  methods: {
    ...mapActions("File", {
      getPresignedUrl: "getPresignedUrl",
    }),
    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
    }),
    pickFile() {
      this.$refs.obj.click();
    },
    async onFilePicked(file, old, prevent) {
      if (file) {
        this.$emit("loading");

        switch (true) {
          case this.acceptedFileType === file.type:
            await this.prepareUpload(file.file);
            break;

          case !this.acceptedFileType.length:
            await this.prepareUpload(file.file);
            break;

          default:
            this.notifDanger(
              `The file must be of type: ${this.acceptedFileType}`
            );
            this.$emit("loading");
            break;
        }

        this.file = file;
      }
    },
    prepareUpload(obj) {
      return new Promise((resolve, reject) => {
        try {
          const fileTypePartial = obj.type.split("/")[0];
          const data = {
            folder: fileTypePartial,
            fileType: obj.type,
            fileName: obj.name,
          };
          axios
            .post(`${vueAppHttpPoint}${vueAppEndpPoint}/api/file/upload`, data)
            .then(async ({ data }) => {
              const url = data.url;
              let objectUploaded = null;

              if (fileTypePartial === "image") {
                const processedFile = await this.imageProcessing(obj);
                objectUploaded = await this.uploadingFile(url, processedFile);
              } else {
                objectUploaded = await this.uploadingFile(url, obj);
              }

              await this.processFetch(objectUploaded, false);

              const objUrl = this.getUrlForObj(url);

              const resPayload = {
                ok: true,
                data: { link: objUrl, fileType: obj.type },
              };
              this.$emit("response", resPayload);
              resolve(resPayload);
            })
            .catch((e) => {
              const err = { ok: false, err: e };
              this.$emit("response", err);
              reject(err);
              throw e;
            });
        } catch (e) {
          const err = { ok: false, err: e };
          this.$emit("response", err);
          reject(err);
        }
      }).finally(() => {
        this.$emit("loading");
      });
    },
    uploadingFile(url, obj) {
      return new Promise((resolve, reject) => {
        const newHeaders = new Headers();
        newHeaders.append("x-amz-acl", "public-read");
        newHeaders.append("Content-Type", obj.type);
        fetch(url, {
          method: "PUT",
          mode: "cors",
          body: obj,
          headers: newHeaders,
        })
          .then((res) => resolve(res))
          .catch((err) => {
            reject(err);
          });
      });
    },
    processFetch(responseFetch, returnJson = true) {
      return new Promise((resolve, reject) => {
        if (responseFetch.ok && returnJson) {
          responseFetch.json().then((res) => {
            resolve(res);
          });
        } else if (responseFetch.ok) {
          resolve();
        } else {
          responseFetch.json().then((err) => {
            reject(err);
          });
        }
      });
    },

    getUrlForObj(url) {
      return url.split("?")[0];
    },

    imageProcessing(file) {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            resolve(result);
          },
          error(err) {
            reject(err);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.drop-file__div {
  width: 100%;
  height: 120px;
  text-align: center;
  justify-content: center;
  border: 1px solid grey;
  border-radius: 2px;
  border-style: dashed;
  padding: 10px;
  box-shadow: 0 0 5px 5px #eaeaea;
  transition: 0.2s;

  &.expanded {
    height: 175px !important;
  }
}
.file-name__span {
  font-size: 12px;
  color: #359ff4;
  text-decoration: underline;
}
.file-name__span__btn {
  padding: 10px;
  margin-top: 10px;
  border: 0.5px solid #2196f3;
  color: #2196f3;
  border-radius: 5px;
}
</style>
