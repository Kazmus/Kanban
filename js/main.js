$(function () {
    // ─── State ─────────────────────────────────────────────────────────
    const STORAGE_KEY = 'kanban_v1';
    let state = loadState();
    let activeCol = null;
    let activeTag = 'none';

    // ─── Default cards (first visit) ──────────────────────────────────
    const defaults = {
        todo: [
            { id: uid(), text: 'Créer la structure HTML', tag: 'dev' },
            { id: uid(), text: 'Définir la palette de couleurs', tag: 'design' },
        ],
        inprogress: [
            { id: uid(), text: 'Implémenter le drag & drop', tag: 'dev' },
        ],
        done: [
            { id: uid(), text: 'Poser le projet', tag: 'none' },
        ]
    };

    if (!state) state = defaults;

    // ─── Render ────────────────────────────────────────────────────────
    function render() {
        ['todo', 'inprogress', 'done'].forEach(col => {
            const $cards = $(`#col-${col}`);
            $cards.empty();
            state[col].forEach(card => $cards.append(buildCard(card)));
        });
        updateCounts();
        initDragDrop();
    }

    function buildCard(card) {
        const tagColors = {
            design: '#7c6af7',
            dev: '#3ecfcf',
            bug: '#f76a6a',
            none: 'transparent'
        };
        const color = tagColors[card.tag] || 'transparent';
        return $(`
      <div class="card" data-id="${card.id}">
        <p class="card-text">${escHtml(card.text)}</p>
        <div class="card-footer">
          <span class="card-tag" data-tag="${card.tag}"
            style="--tag-color:${color}">${card.tag}</span>
          <button class="card-delete" title="Delete">✕</button>
        </div>
      </div>
    `);
    }

    function updateCounts() {
        ['todo', 'inprogress', 'done'].forEach(col => {
            const count = state[col].length;
            $(`.column[data-col="${col}"] .col-count`).text(count);
        });
    }

    // ─── Drag & Drop ──────────────────────────────────────────────────
    function initDragDrop() {
        $('.card').draggable({
            revert: 'invalid',
            zIndex: 999,
            cursor: 'grabbing',
            helper: 'clone',
            opacity: 0.85,
            start(e, ui) {
                $(this).addClass('ui-draggable-dragging');
                ui.helper.css({ width: $(this).outerWidth() });
            },
            stop(e, ui) {
                $(this).removeClass('ui-draggable-dragging');
            }
        });

        $('.cards').droppable({
            accept: '.card',
            hoverClass: 'ui-droppable-hover',
            drop(e, ui) {
                const $col = $(this);
                const toCol = $col.closest('.column').data('col');
                const cardId = ui.draggable.data('id');

                // Find & remove from source
                let card = null;
                ['todo', 'inprogress', 'done'].forEach(col => {
                    const idx = state[col].findIndex(c => c.id === cardId);
                    if (idx !== -1) {
                        card = state[col].splice(idx, 1)[0];
                    }
                });

                if (card) {
                    state[toCol].push(card);
                    saveState();
                    render();
                    // Highlight the newly dropped card
                    $col.find(`.card[data-id="${card.id}"]`).addClass('just-dropped');
                }
            }
        });
    }

    // ─── Add card modal ────────────────────────────────────────────────
    $(document).on('click', '.add-btn', function () {
        activeCol = $(this).data('col');
        activeTag = 'none';
        $('#card-input').val('');
        $('.tag-btn').removeClass('active');
        $('.tag-btn[data-tag="none"]').addClass('active');
        $('#modal-overlay').addClass('open');
        setTimeout(() => $('#card-input').focus(), 50);
    });

    $(document).on('click', '.tag-btn', function () {
        $('.tag-btn').removeClass('active');
        $(this).addClass('active');
        activeTag = $(this).data('tag');
    });

    $('#modal-cancel, #modal-overlay').on('click', function (e) {
        if (e.target === this) closeModal();
    });

    $('#modal-confirm').on('click', addCard);

    $('#card-input').on('keydown', function (e) {
        if (e.key === 'Enter') addCard();
        if (e.key === 'Escape') closeModal();
    });

    function addCard() {
        const text = $('#card-input').val().trim();
        if (!text) return;
        const card = { id: uid(), text, tag: activeTag };
        state[activeCol].push(card);
        saveState();
        render();
        closeModal();
    }

    function closeModal() {
        $('#modal-overlay').removeClass('open');
        activeCol = null;
    }

    // ─── Delete card ───────────────────────────────────────────────────
    $(document).on('click', '.card-delete', function (e) {
        e.stopPropagation();
        const id = $(this).closest('.card').data('id');
        ['todo', 'inprogress', 'done'].forEach(col => {
            state[col] = state[col].filter(c => c.id !== id);
        });
        saveState();
        render();
    });

    // ─── Persistence ──────────────────────────────────────────────────
    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────
    function uid() {
        return Math.random().toString(36).slice(2, 9);
    }
    function escHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ─── Init ──────────────────────────────────────────────────────────
    render();
});