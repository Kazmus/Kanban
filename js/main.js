//globals
var activeTag = null;
var activeCol = null;

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
    const card = { id: uid(), text, tag: activeTag };
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
    //updateCounts();
    //initDragDrop();
}

function tagSelection() {
    $(".tag-btn").on("click", function () {
        if (activeTag != null) {
            activeTag.removeClass("active");
        }
        activeTag = $(this).addClass("active");
    })
}

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

$(function () {
    $(".add-btn").on("click", function () {
        activeCol = $(this).siblings(".cards");
        openModal();
    });

    $("#modal-confirm").on("click", function () {
        addCard();
    });

    $("#modal-cancel").on("click", function () {
        closeModal();
    });
})