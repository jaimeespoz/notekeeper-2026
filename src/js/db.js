/**
 * @copyright codewithsadee 2023
 */

"use strict";

/**
 * Import module
 */
import {
   generateID,
   findNotebook,
   findNotebookIndex,
   findNote,
   findNoteIndex,
} from "./utils";

// DB Object
let /**{Object} */ notekeeperDB = {};

/**
 *  Initializes a local database. If the database exists in local storage, it is loaded
 *  Otherwise, a new empty database structure is created and stored
 */
const initDB = function () {
   const /**{JSON | undefined} */ db = localStorage.getItem("notekeeperDB");

   if (db) {
      notekeeperDB = JSON.parse(db);
   } else {
      notekeeperDB.notebooks = [];
      localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
   }
};

initDB();

/**
 * Reads and loads the localStorage data in t the global variable 'notekeeperDB'
 *
 */
const readDB = function () {
   notekeeperDB = JSON.parse(localStorage.getItem("notekeeperDB"));
};

/**
 * Writes the current state of the global variable 'notekeeperDB' to local storage
 */
const writeDB = function () {
   localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
};

/**
 * Collection of functions for performing CRUD (Create, Read, Update, Delete) operations on database
 * The database state is managed using global variables and local storage
 *
 * @namespace
 * @property {Object} get       - Functions for retrieving data from the database
 * @property {Object} post      - Functions for adding data to the database
 * @property {Object} update    - Functions for updating data in the database
 * @property {Object} delete    - Functions for deleting data from the database
 */

export const db = {
   post: {
      /** Adds a new notebook to the database
       *
       * @function
       * @param {string} name     - The name or the new notebook
       * @returns {Object}        The newly create notebook object
       */
      notebook(name) {
         readDB();
         console.log(name);
         const /** {Object} */ notebookData = {
               id: generateID(),
               name,
               notes: [],
            };
         console.log(notebookData);
         notekeeperDB.notebooks.push(notebookData);
         writeDB();
         return notebookData;
      },
      /**
       * Adds a new note to a specified notebook in the database
       *
       * @function
       * @param {string} notebookID     -  The ID of the notebook to add the note to
       * @param {Object} object         -  The note object to add
       * @returns {Object}                 The newly created note object
       */
      note(notebookID, object) {
         readDB();

         const /** {Object}*/ notebook = findNotebook(notekeeperDB, notebookID);
         const /**{Object} */ noteData = {
               id: generateID(),
               notebookID,
               ...object,
               postedOn: new Date().getTime(),
            };

         console.log(noteData);
         notebook.notes.unshift(noteData);
         writeDB();

         return noteData;
      },
   },

   get: {
      /**
       * Retrieves all notebooks from the database
       *
       * @function
       * @returns {Array<Objects>}    An array of notebook objects
       */
      notebook() {
         readDB();

         return notekeeperDB.notebooks;
      },

      /**
       * Retrieves all notes eithin a specified notebook
       *
       * @function
       * @param {string} notebookId     -    The ID of the notebook to retrieve notes from
       * @returns {Array<Object>}            An array of note objects
       */
      note(notebookId) {
         readDB();

         const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
         return notebook.notes;
      },
   },

   update: {
      /**
       * Updates the name of a notebook in the database
       *
       * @param {string} notebookId     -   The ID of the notebook to update
       * @param {string} name           -   The new name for the notebook
       * @returns {Object}                  The update notebook object
       */
      notebook(notebookId, name) {
         readDB();

         const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
         notebook.name = name;

         writeDB();

         return notebook;
      },

      /**
       *  Updates the content of a note in the database
       *
       * @function
       * @param {string} noteId     -  The ID of the note to update
       * @param {Object} object     -  The updated data for the note
       * @param {Object}               The updated note object
       */
      note(noteId, object) {
         readDB();

         const /**{Object} */ oldNote = findNote(notekeeperDB, noteId);
         const /**{Object} */ newNote = Object.assign(oldNote, object);

         writeDB();

         return newNote;
      },
   },

   delete: {
      /**
       * Deletes a notebook from the database
       *
       * @function
       * @param {string} notebookID    -  The ID of the notebook to delete
       */
      notebook(notebookID) {
         readDB();

         const /**{Number} */ notebookIndex = findNotebookIndex(
               notekeeperDB,
               notebookID
            );
         console.log(notebookIndex);
         notekeeperDB.notebooks.splice(notebookIndex, 1);

         writeDB();
      },
      /**
       * Deletes a note from a specified notebook in the database
       *
       * @function
       * @param {string} notebookId    -  The ID of the notebook
       * @param {string} noteId        -  The ID of the note to delete
       * @requires {Array<Object>}        An array of remaining notes to the notebook
       */
      note(notebookID, noteId) {
         readDB();

         const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
         const /**{Number} */ noteIndex = findNotebookIndex(notebook, noteId);

         notebook.notes.splice(noteIndex, 1);

         writeDB();

         return notebook.notes;
      },
   },
};
