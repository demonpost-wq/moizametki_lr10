function makeId() {
  return Date.now().toString() + '-' + Math.random().toString(16).slice(2);
}

class Note {
  constructor(text, id = makeId(), createdAt = new Date().toLocaleString()) {
    this.id = id;
    this.text = text;
    this.createdAt = createdAt;
  }

  render(onEdit, onDelete) {
    const div = document.createElement('div');
    div.className = 'note';

    const content = document.createElement('div');
    content.className = 'note-content';

    const p = document.createElement('p');
    p.textContent = this.text;

    const small = document.createElement('small');
    small.textContent = 'заебашено: ' + this.createdAt;

    content.appendChild(p);
    content.appendChild(small);

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'ебашь';
    editBtn.onclick = () => onEdit(this.id);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'удали мать';
    delBtn.onclick = () => onDelete(this.id);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    div.appendChild(content);
    div.appendChild(actions);
    return div;
  }
}

class NoteManager {
  constructor(storageKey = 'myNotes') {
    this.storageKey = storageKey;
    this.notes = [];
    this.loadNotes();
  }

  addNote(text) {
    const note = new Note(text);
    this.notes.unshift(note);
    this.saveNotes();
  }

  editNote(id, newText) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.text = newText;
      this.saveNotes();
    }
  }

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveNotes();
  }

  saveNotes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }

  loadNotes() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      this.notes = parsed.map(n => new Note(n.text, n.id, n.createdAt));
    }
  }

  displayNotes(container) {
    container.innerHTML = '';
    if (this.notes.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'ниче нету.';
      container.appendChild(empty);
      return;
    }

    this.notes.forEach(note => {
      const noteElement = note.render(
        id => {
          const current = this.notes.find(n => n.id === id);
          const newText = prompt('заредачить:', current ? current.text : '');
          if (newText !== null) {
            const trimmed = newText.trim();
            if (trimmed.length > 0) {
              this.editNote(id, trimmed);
              this.displayNotes(container);
            } else {
              alert('ЗАЕБАШЬ ЧЕ НИБУДЬ УЖЕ.');
            }
          }
        },
        id => {
          if (confirm('точно заебашить заметку?')) {
            this.deleteNote(id);
            this.displayNotes(container);
          }
        }
      );
      container.appendChild(noteElement);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('noteInput');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const notesContainer = document.getElementById('notesContainer');

  const noteManager = new NoteManager();
  noteManager.displayNotes(notesContainer);

  function addFromInput() {
    const text = noteInput.value.trim();
    if (!text) return;
    noteManager.addNote(text);
    noteInput.value = '';
    noteManager.displayNotes(notesContainer);
  }

  addNoteBtn.addEventListener('click', addFromInput);
  noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addFromInput();
    if (e.key === 'Shift') addFromInput();
  });
});
console.log("Vite работает!");
