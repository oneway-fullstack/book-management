<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card flat>
              <v-card-title class="headline font-weight-bold mx-6 mt-4">
                My Books
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="editBook(null)">Add book</v-btn>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="books"
              item-key="id"
              multi-sort
              :loading="loading"
            >
              <template v-slot:item.book_poster_image="{ item }">
                <v-img
                  :src="item.book_poster_image"
                  class="poster-image"
                ></v-img>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn color="primary" @click="editBook(item)">Edit</v-btn>
                &nbsp;
                <v-btn color="error" @click="deleteBook(item)">Delete</v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-dialog v-model="editing" max-width="500px">
          <v-card>
            <v-card-title>
              <span v-if="bookItem.id === null" class="headline">Add book</span>
              <span v-else class="headline">Edit Book</span>
              <v-spacer></v-spacer>
              <v-btn
                fab
                text
                dark
                small
                color="red lighten-3"
                style="margin-right: -6px"
                @click="editing = !editing"
                >X</v-btn
              >
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="8">
                    <v-file-input
                      accept=".png, .gif, .jpg"
                      prepend-icon="mdi-file-image"
                      label="Poster Image"
                      placeholder="Please select book cover"
                      @change="onImageUpload"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="bookItem.book_title"
                      label="Title"
                      max="64"
                      dense
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="bookItem.book_author"
                      label="Author"
                      max="64"
                      dense
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      v-model="bookItem.book_description"
                      label="Description"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                dark
                color="green"
                :loading="loadingState"
                @click="saveEditing"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-snackbar
          v-model="snackbar"
          :top="true"
          :timeout="5000"
          :color="snackColor"
          >{{ snackMsg }}</v-snackbar
        >
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "dashboard",
  data: () => {
    return {
      userId: null,
      books: [],
      loading: true,
      editing: false,
      isEditing: false,
      loadingState: false,
      snackbar: false,
      snackColor: "success",
      snackMsg: "",
      updatedBookPoster: null,
      bookItem: {
        id: null,
        user_target_id: null,
        book_title: null,
        book_author: null,
        book_description: null,
        book_poster_image: null,
      },
    };
  },
  mounted() {
    this.userId = this.$store.getters.userId;
    this.getMyBooks();
  },
  computed: {
    loggedIn: function () {
      return this.$store.getters.loggedIn;
    },
    headers: function () {
      return [
        {
          text: "ID",
          sortable: true,
          value: "id",
        },
        {
          text: "Cover",
          sortable: true,
          value: "book_poster_image",
        },
        {
          text: "Title",
          sortable: true,
          value: "book_title",
        },
        {
          text: "Author",
          sortable: true,
          value: "book_author",
        },
        {
          text: "Description",
          sortable: true,
          value: "book_description",
        },
        {
          text: "Uploaded Date",
          sortable: true,
          value: "book_created_at",
        },
        {
          text: "Edit",
          value: "actions",
        },
      ];
    },
  },
  methods: {
    async getMyBooks() {
      await this.$store.dispatch("myBooks");
      this.books = this.$store.getters.books;
      this.loading = false;
    },

    editBook(item) {
      this.bookItem = Object.assign({}, item);

      this.editing = true;
      this.isEditing = true;
    },

    async deleteBook(item) {
      const confirm = await this.$confirm("Do you want to remove really?");
      if (confirm) {
        const ret = await this.$store.dispatch("removeBook", {
          id: item.id,
        });
        this.alertMessage("success", "The book has been removed.");
        this.getMyBooks();
      }
    },

    onImageUpload(file) {
      this.bookItem.book_poster_image = file;
      this.updatedBookPoster = file;
    },

    async saveEditing() {
      const obj = this.bookItem;
      if (!obj.book_title) {
        this.alertMessage("fail", "Please input book title.");
        return;
      }

      if (!obj.book_author) {
        this.alertMessage("fail", "Please input book author.");
        return;
      }

      if (!obj.book_description) {
        this.alertMessage("fail", "Please input book description.");
        return;
      }

      this.loadingState = true;
      let formData = new FormData();
      formData.append("book_description", this.bookItem.book_description);
      formData.append("book_author", this.bookItem.book_author);
      formData.append("book_title", this.bookItem.book_title);
      formData.append("user_target", this.userId);

      if (!obj.id) {
        if (this.bookItem.book_poster_image != null) {
          formData.append("book_poster_image", this.bookItem.book_poster_image);
        }
        await this.$store.dispatch("createBook", formData);

        if (this.$store.getters.status == 400) {
          this.alertMessage("fail", this.$store.getters.message);
          this.loadingState = false;
          return;
        } else {
          this.alertMessage("success", "The new book has been added.");
        }
      } else {
        if (this.updatedBookPoster != null) {
          formData.append("book_poster_image", this.updatedBookPoster);
        }
        const ret = await this.$store.dispatch("updateBook", {
          id: obj.id,
          form: formData,
        });

        if (this.$store.getters.status == 400) {
          this.alertMessage("fail", this.$store.getters.message);
          this.loadingState = false;
          return;
        } else {
          this.alertMessage("success", "The book has been updated.");
        }
      }

      this.getMyBooks();
      this.editing = false;
      this.loadingState = false;
    },

    alertMessage(type, msg) {
      if (msg) {
        this.snackbar = true;
        this.snackColor =
          type === "success" ? "success" : type === "fail" ? "error" : "info";
        this.snackMsg = msg;
      }
    },
  },
  head() {
    return {
      title: "Dashboard -",
    };
  },
};
</script>
<style scoped>
.poster-image {
  width: 50px;
  height: 50px;
}

.poster-thumbnail {
  width: 150px;
  height: 150px;
}
</style>