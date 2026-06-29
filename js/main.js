$(function () {
    let state = { todo: [], inprogress: [], done: [] };
    let activeCol = null;
    let activeTag = 'none';

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
            design: '#7c6af7', dev: '#3ecfcf', bug: '#f76a6a', none: 'transparent'
        };
        const color = tagColors[card.tag] || 'transparent';
        return $(`
        <div class="card" data-id="${card.id}">
            <p class="card-text">${escHtml(card.text)}</p>
            <div class="card-footer">
            <span class="card-tag" data-tag="${card.tag}"
                style="--tag-color:${color}">${card.tag}</span>
            <span class="card-user">${escHtml(card.username || '')}</span>
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

    function initDragDrop() {
        ['todo', 'inprogress', 'done'].forEach(col => {
            const el = document.getElementById(`col-${col}`);
            if (!el) return;

            if (el._sortable) el._sortable.destroy();

            el._sortable = Sortable.create(el, {
                group: 'kanban',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                delay: 0,
                delayOnTouchOnly: false,
                touchStartThreshold: 3,

                onEnd(evt) {
                    const cardId = String(evt.item.getAttribute('data-id'));
                    const fromCol = evt.from.closest('.column').dataset.col;
                    const toCol = evt.to.closest('.column').dataset.col;

                    if (fromCol === toCol && evt.oldIndex === evt.newIndex) return;

                    let card = null;
                    ['todo', 'inprogress', 'done'].forEach(c => {
                        const idx = state[c].findIndex(x => x.id === cardId);
                        if (idx !== -1) card = state[c].splice(idx, 1)[0];
                    });

                    if (card) {
                        const targetIndex = evt.newIndex;
                        state[toCol].splice(targetIndex, 0, card);

                        updateCounts();

                        evt.item.classList.add('just-dropped');
                        setTimeout(() => evt.item.classList.remove('just-dropped'), 600);

                        if (fromCol !== toCol) {
                            api({ action: 'move', id: card.id, status: toCol });
                        }
                    }
                }
            });
        });
    }

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

    async function addCard() {
        const text = $('#card-input').val().trim();
        if (!text) return;
        const status = activeCol;
        const res = await api({ action: 'add', text, tag: activeTag, status });
        state[status].push({ id: String(res.id), text, tag: activeTag, username: currentUser });
        render();
        closeModal();
    }

    function closeModal() {
        $('#modal-overlay').removeClass('open');
        activeCol = null;
    }

    $(document).on('click', '.card-delete', function (e) {
        e.stopPropagation();
        const id = String($(this).closest('.card').attr('data-id'));
        ['todo', 'inprogress', 'done'].forEach(col => {
            state[col] = state[col].filter(c => c.id !== id);
        });
        render();
        api({ action: 'delete', id });   // ← persist
    });


    async function loadCards() {
        const res = await fetch('/projects/kanban/json/data.php');
        const cards = await res.json();

        const grouped = { todo: [], inprogress: [], done: [] };
        cards.forEach(card => {
            const col = grouped[card.status] ? card.status : 'todo';
            grouped[col].push({
                id: card.id,
                text: card.text,
                tag: (card.tag || 'none').toLowerCase(),
                username: card.username
            });
        });
        return grouped;
    }

    function escHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    async function api(payload) {
        const res = await fetch('/projects/kanban/json/actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return res.json();
    }

    async function init() {
        state = await loadCards();
        render();
    }
    init();
});