<template>
  <div>
    <editor-menu-bar :editor="editor">
      <div
        slot-scope="{ commands, isActive }"
        :class="['menubar'] "
      >
        <div class="toolbar">
          <v-toolbar flat>
            <v-btn
              class="ma-0"
              icon
              small
              title="Undo"
              @click="commands.undo"
            >
              <v-icon>mdi-undo</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              icon
              small
              title="Redo"
              @click="commands.redo"
            >
              <v-icon>mdi-redo</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.bold() }"
              icon
              small
              title="Bold"
              @click="commands.bold"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.italic() }"
              icon
              small
              title="Italic"
              @click="commands.italic"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.strike() }"
              icon
              small
              title="Strikethrough"
              @click="commands.strike"
            >
              <v-icon>mdi-format-strikethrough</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.underline() }"
              icon
              small
              title="Underline"
              @click="commands.underline"
            >
              <v-icon>mdi-format-underline</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.code() }"
              icon
              small
              title="Grey Highlight"
              @click="commands.code"
            >
              <v-icon>mdi-code-tags</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.paragraph() }"
              icon
              small
              title="Paragraph"
              @click="commands.paragraph"
            >
              P
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.alignment({ textAlign: 'left' }) }"
              icon
              small
              title="Align Left"
              @click="commands.alignment({ textAlign: 'left' })"
            >
              <v-icon>mdi-format-align-left</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.alignment({ textAlign: 'center' }) }"
              icon
              small
              title="Align Center"
              @click="commands.alignment({ textAlign: 'center' })"
            >
              <v-icon>mdi-format-align-center</v-icon>
            </v-btn>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.alignment({ textAlign: 'right' }) }"
              @click="commands.alignment({ textAlign: 'right' })"
            >
              <v-icon>mdi-format-align-right</v-icon>
            </button>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.bullet_list() }"
              icon
              small
              title="Unordered List"
              @click="commands.bullet_list"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.ordered_list() }"
              icon
              small
              title="Ordered List"
              @click="commands.ordered_list"
            >
              <v-icon>mdi-format-list-numbered</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.blockquote() }"
              icon
              small
              title="Blockquote"
              @click="commands.blockquote"
            >
              <v-icon>mdi-format-quote-close</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.code_block() }"
              icon
              small
              title="Code Block"
              @click="commands.code_block"
            >
              <v-icon>mdi-file-code</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              :class="{ 'is-active': isActive.code_block() }"
              icon
              small
              title="Image"
              @click="showImagePrompt(commands.image)"
            >
              <v-icon>mdi-image</v-icon>
            </v-btn>

            <v-btn
              class="ma-0"
              icon
              small
              title="New Table"
              @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            >
              <v-icon>mdi-border-all</v-icon>
            </v-btn>

            <template v-if="isActive.table()">
              <v-btn
                class="ma-0"
                icon
                small
                title="Delete table"
                @click="commands.deleteTable"
              >
                <v-icon>mdi-grid-off</v-icon>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Add Column Before"
                @click="commands.addColumnBefore"
              >
                <svg
                  id="icon--add_col_before"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M19 14a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm2.5 5.938a.937.937 0 1 0 0-1.875h-1.25a.312.312 0 0 1-.313-.313V16.5a.937.937 0 1 0-1.875 0v1.25c0 .173-.14.313-.312.313H16.5a.937.937 0 1 0 0 1.875h1.25c.173 0 .313.14.313.312v1.25a.937.937 0 1 0 1.875 0v-1.25c0-.173.14-.313.312-.313h1.25zM2 19a3 3 0 0 0 6 0V5a3 3 0 1 0-6 0v14zm-2 0V5a5 5 0 1 1 10 0v14a5 5 0 0 1-10 0z"
                  />
                </svg>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Add Column After"
                @click="commands.addColumnAfter"
              >
                <svg
                  id="icon--add_col_after"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M5 14a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm2.5 5.938a.937.937 0 1 0 0-1.875H6.25a.312.312 0 0 1-.313-.313V16.5a.937.937 0 1 0-1.875 0v1.25c0 .173-.14.313-.312.313H2.5a.937.937 0 1 0 0 1.875h1.25c.173 0 .313.14.313.312v1.25a.937.937 0 1 0 1.875 0v-1.25c0-.173.14-.313.312-.313H7.5zM16 19a3 3 0 0 0 6 0V5a3 3 0 0 0-6 0v14zm-2 0V5a5 5 0 0 1 10 0v14a5 5 0 0 1-10 0z"
                  />
                </svg>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Delete Column"
                @click="commands.deleteColumn"
              >
                <svg
                  id="icon--delete_col"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M12.641 21.931a7.01 7.01 0 0 0 1.146 1.74A5 5 0 0 1 7 19V5a5 5 0 1 1 10 0v7.29a6.972 6.972 0 0 0-2 .965V5a3 3 0 0 0-6 0v14a3 3 0 0 0 3.641 2.931zM19 14a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm-2.5 5.938h5a.937.937 0 1 0 0-1.875h-5a.937.937 0 1 0 0 1.875z"
                  />
                </svg>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Add Row Before"
                @click="commands.addRowBefore"
              >
                <svg
                  id="icon--add_row_before"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M19 14a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm2.5 5.938a.937.937 0 1 0 0-1.875h-1.25a.312.312 0 0 1-.313-.313V16.5a.937.937 0 1 0-1.875 0v1.25c0 .173-.14.313-.312.313H16.5a.937.937 0 1 0 0 1.875h1.25c.173 0 .313.14.313.312v1.25a.937.937 0 1 0 1.875 0v-1.25c0-.173.14-.313.312-.313h1.25zM5 2a3 3 0 1 0 0 6h14a3 3 0 0 0 0-6H5zm0-2h14a5 5 0 0 1 0 10H5A5 5 0 1 1 5 0z"
                  />
                </svg>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Add Column After"
                @click="commands.addRowAfter"
              >
                <svg
                  id="icon--add_row_after"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M19 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm2.5 5.938a.937.937 0 1 0 0-1.875h-1.25a.312.312 0 0 1-.313-.313V2.5a.937.937 0 1 0-1.875 0v1.25c0 .173-.14.313-.312.313H16.5a.937.937 0 1 0 0 1.875h1.25c.173 0 .313.14.313.312V7.5a.937.937 0 1 0 1.875 0V6.25c0-.173.14-.313.312-.313h1.25zM5 16a3 3 0 0 0 0 6h14a3 3 0 0 0 0-6H5zm0-2h14a5 5 0 0 1 0 10H5a5 5 0 0 1 0-10z"
                  />
                </svg>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Delete Row"
                @click="commands.deleteRow"
              >
                <svg
                  id="icon--delete_row"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M13.255 15a6.972 6.972 0 0 0-.965 2H5A5 5 0 0 1 5 7h14a5 5 0 0 1 4.671 6.787 7.01 7.01 0 0 0-1.74-1.146A3 3 0 0 0 19 9H5a3 3 0 0 0 0 6h8.255zM19 14a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm-2.5 5.938h5a.937.937 0 1 0 0-1.875h-5a.937.937 0 1 0 0 1.875z"
                  />
                </svg>
              </v-btn>
              <v-btn
                class="ma-1"
                icon
                small
                title="Merge Cells"
                @click="commands.toggleCellMerge"
              >
                <svg
                  id="icon--combine_cells"
                  height="100%"
                  viewBox="0 0 28 28"
                  width="100%"
                >
                  <path
                    d="M2 19a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v14zm-2 0V5a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5zm12-9a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm0 6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm0-13a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1z"
                  />
                </svg>
              </v-btn>
            </template>
            <!-- <v-divider class="mx-3" inset vertical></v-divider> -->
            <!-- <v-btn
                    class="ma-0"
                    small
                    outline
                    color="blue lighten-2"
                    @click="commands.heading({ level: 2 })"
            >Title</v-btn>-->
          </v-toolbar>
        </div>
      </div>
    </editor-menu-bar>
    <editor-content
      class="editor__content"
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  HardBreak,
  Heading,
  Mention,
  Code,
  Bold,
  Italic,
  Blockquote,
  CodeBlock,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History,
  Image
  // Paragraph
} from 'tiptap-extensions'

import Alignment from './Alignment.js'
// import tippy from "tippy.js";

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Mention({
            matcher: {
              char: '#'
            },
            // a list of all suggested items
            items: () => suggestionData,

            // is called when a suggestion starts
            onEnter: ({ items, query, range, command, virtualNode }) => {
              this.query = query
              this.filteredSuggestions = items
              this.suggestionRange = range
              this.renderPopup(virtualNode)
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command
            },
            // is called when a suggestion has changed
            onChange: ({ items, query, range, virtualNode }) => {
              this.query = query
              this.filteredSuggestions = items
              this.suggestionRange = range
              this.navigatedSuggestionIndex = 0
              this.renderPopup(virtualNode)
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null
              this.filteredSuggestions = []
              this.suggestionRange = null
              this.navigatedSuggestionIndex = 0
              this.destroyPopup()
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              // pressing up arrow
              if (event.keyCode === 38) {
                this.upHandler()
                return true
              }
              // pressing down arrow
              if (event.keyCode === 40) {
                this.downHandler()
                return true
              }
              // pressing enter
              if (event.keyCode === 13) {
                this.enterHandler()
                return true
              }

              return false
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: (items, query) => {
              if (!query) {
                return items
              }

              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ['value']
              })

              return fuse.search(query)
            }
          }),
          new Code(),
          new Bold(),
          new Italic(),
          new Image(),
          new Alignment()
        ],
        content: ''
      })
    }
  },
  methods: {
    getText() {
      return this.editor.getHTML()
    },
    setText(text) {
      this.editor.setContent(text)
    }
  }
}
</script>
