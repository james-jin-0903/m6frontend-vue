<template>
    <div>
        <v-dialog v-model="show" persistent width="70vw" >
            <v-card>
                <v-card-title class="headline blue darken-2 white--text">
                    {{ isEdit ? 'Update' : 'Create' }} a Marketplace Item
                </v-card-title>
                <v-card-text class="card-text-scroll" >
                    <v-form ref="form" >
                        <v-autocomplete v-model="marketplaceItem.app_id" label="App" :items="appsList" item-text="title" item-value="id" :rules="genericRules" />
                        <v-autocomplete v-model="marketplaceItem.status" label="Status" :items="statusOptions" :rules="genericRules" />
                        <vue-editor
                            v-model="marketplaceItem.overview"
                            placeholder="Overview"
                        />
                        <v-file-input
                            v-model="fileTemp"
                            v-if="isEdit"
                            append-outer-icon="mdi-cancel"
                            counter
                            dense
                            filled
                            label="label"
                            outlined
                            prepend-icon="mdi-file-document-outline"
                            show-size
                            truncate-length="20"
                            @change="selectFile"
                            @click:append-outer="edit = !edit"
                        />
                    </v-form>
                    <div class="flex-row pa-2 scroll" v-if="isEdit" >
                        <div class="flex-column" v-for="(media, index) in marketplaceItem.media" :key="`marketplace-item-${index}`" >
                            <img class="image-size" :src="getMediaUrl(media.id)" alt="">
                            <v-btn color="red" icon x-small @click="deletingMedia(media.id)" >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red darken-2" class="white--text" text @click="closing"  >
                        Close
                    </v-btn>
                    <v-btn v-if="isEdit" color="green darken-2" class="white--text" @click="updating" >Update</v-btn>
                    <v-btn v-else color="green darken-2" class="white--text" @click="creating" >Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <m6-confirm-delete
            message="Are you sure you want to delete this marketplace image?"
            :show="showDeleteModal"
            title="Delete Marketplace Item"
            @cancel="cancelDelete"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { VueEditor } from 'vue2-editor'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        editItem: {
            type: Object,
            default: () => ({})
        }
    },

    components: {
        VueEditor
    },

    data: () => ({
        marketplaceItem: {},
        statusOptions: ['Draft', 'Archived', 'Published'],
        genericRules: [
            v => !!v || 'This field is required',
        ],
        fileTemp: null,
        showDeleteModal: false,
        mediaIdToDelete: 0
    }),

    watch: {
        editItem: {
            handler: function(val) {
                this.marketplaceItem = {...val}
            },
            immediate: false
        }
    },

    methods: {
        ...mapMutations('SnackBarNotif', {
            notifDanger: 'notifDanger',
            notifSuccess: 'notifSuccess'
        }),

        ...mapActions('Marketplace', {
            createMarketplace: 'createMarketplace',
            updateMarketplace: 'updateMarketplace',
            deleteMarketplace: 'deleteMarketplace',
            createMarketplaceMedia: 'createMarketplaceMedia',
            deleteMarketplaceMedia: 'deleteMarketplaceMedia'
        }),

        async confirmDelete() {
            try {
                this.loading = true
                await this.deleteMarketplaceMedia({ marketplaceID: this.marketplaceItem.id, mediaID: this.mediaIdToDelete })
                this.$emit('updateMedia', { id: this.mediaIdToDelete })
                this.cancelDelete()
                this.loading = false
            } catch(e) {
                this.loading = false
            }
        },

        cancelDelete() {
            this.showDeleteModal = false
            this.mediaIdToDelete = 0
        },

        deletingMedia(id) {
            this.mediaIdToDelete = id
            this.showDeleteModal = true
        },

        getMediaUrl(id) {
            return `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/url/${id}`
        },

        async selectFile(file) {
            try {
                this.loading = true 
                const localFile = {
                    file_type: file['type'],
                    file_extension: file['name'].match(/\.[0-9a-z]+$/i)[0],
                    file_name: file['name'].substring(file['name'][0], file['name'].lastIndexOf('.')),
                    file_name_full: file['name'],
                    file_size: file['size'],
                    file: file
                }

                const headers = {
                    'Content-Type': localFile['file_type'],
                    'path': 'record/',
                    'Content-Name': localFile['file_name_full']
                }

                const res = await this.createMarketplaceMedia({ marketplaceID: this.marketplaceItem.id, headers ,file: {...localFile} })
                this.fileTemp = null
                this.$emit('updateMedia', { id: res.attachmentId })
                this.loading = false
            } catch(e) {
                this.loading = false
            }
        },

        formValidate () {
            return !this.$refs.form.validate()
        },    

        formReset () {
            this.$refs.form.reset()
        },

        closing() {
            this.formReset()
            this.marketplaceItem = {}
            this.$emit('close')
        },

        async creating() {
            try {
                if( this.formValidate() ) {
                    this.notifDanger('Please fill in all of the required fields') 
                    return
                }
                this.loading = true 
                const res = await this.createMarketplace(this.marketplaceItem)
                this.$emit('modifyMarketplaceList', { id: res.marketplace_id, ...this.marketplaceItem})
                this.loading = false
                this.notifSuccess('The item was saved')
                this.closing()
            } catch(e) {
                this.notifDanger('There was an error while creating the Marketplace Item')
                this.loading = false
            }
        },

        async updating() {
            try {
                if( this.formValidate() ) {
                    this.notifDanger('Please fill in all of the required fields') 
                    return
                }
                this.loading = true 
                this.updateMarketplace(this.marketplaceItem)
                this.$emit('modifyMarketplaceList', {...this.marketplaceItem})
                this.loading = false
                this.notifSuccess('The item was updated')
                this.closing()
            } catch(e) {
                this.notifDanger('There was an error while updating the Marketplace Item')
                this.loading = false
            }
        }
    },

    computed: {
      ...mapState('AppBuilder', {
        appsList: 'appsList'
      }),

      isEdit() {
        return Boolean(this.$h.dg(this.marketplaceItem, 'id', 0))
      }
    }
}
</script>

<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}
.flex-column {
    display: flex;
    flex-direction: column;
}
.image-size {
    height: 5rem;
    width: auto;
}

.scroll {
    overflow-x: none;
    overflow-y: auto;
}

.card-text-scroll {
    height: 70vh;
    overflow-y: auto;
}
</style>