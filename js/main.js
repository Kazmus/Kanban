//globals
var state = loadState();
var activeTag = null;
var activeCol = null;

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

function openModal() {
    $(".modal-overlay").addClass("open").show();
    tagSelection();
}

function closeModal() {
    $(".modal-overlay").removeClass("open").hide();
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
        <p class="card-text">${card.text}</p>
        <div class="card-footer">
          <span class="card-tag" data-tag="${card.tag}"
            style="--tag-color:${color}">${card.tag}</span>
          <button class="card-delete" title="Delete">✕</button>
        </div>
      </div>
    `);
}

function addCard() {
    const text = $('#card-input').val().trim();
    if (!text) return;
    const card = { id: uid(), text, tag: activeTag.attr("data-tag") };
    //state[activeCol].push(card);
    //saveState();
    //render();
    activeCol.append(buildCard(card));
    closeModal();
}

function render() {
    ['todo', 'inprogress', 'done'].forEach(col => {
        const $cards = $(`#col-${col}`);
        $cards.empty();
        state[col].forEach(card => $cards.append(buildCard(card)));
    });
    countCards();
    initDragDrop();
}

function tagSelection() {
    $(".tag-btn").on("click", function () {
        if (activeTag != null) {
            activeTag.removeClass("active");
        }
        activeTag = $(this).addClass("active");
    });
}

function deleteCard(card) {
    card.remove();
}

function countCards() {
    ['todo', 'inprogress', 'done'].forEach(col => {
        var count = document.getElementById("col-" + col).childElementCount;
        $("#col-" + col).siblings(".col-header").children(".col-count").text(count);
    });
}

function initDragDrop() {
    $('.card').draggable({
        revert: 'invalid',
        zIndex: 999,
        cursor: 'grabbing',
        helper: 'clone',
        opacity: 0.85,
        start(e, ui) {
            console.log(e);
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

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

$(function () {
    $(".add-btn").on("click", function () {
        activeCol = $(this).siblings(".cards");
        openModal();
    });

    $("#modal-cancel").on("click", function () {
        closeModal();
    });

    $("#modal-confirm").on("click", function () {
        addCard();
        countCards();
    });

    $(document).on("click", ".card-delete", function () {
        deleteCard($(this).parents(".card"));
        countCards();
    });

    render();
})