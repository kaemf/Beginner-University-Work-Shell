var _a;
var img = document.querySelectorAll('.img'), modalTitle = document.querySelector('#modal h2'), modalIm = document.getElementById('modal-img'), overlay = document.getElementById('overlay'), modal = document.getElementById('modal'), date = new Date();
var active = false, hovered = false, double = false, zoomedIm = false;
(_a = document.querySelector('.date')) === null || _a === void 0 ? void 0 : _a.setAttribute('year', date.getFullYear().toString());
img.forEach(function (img) {
    img.addEventListener('click', function (event) {
        var currImg = event.target;
        if (!active) {
            var modalWidth = currImg.getAttribute('modal-width');
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            modal.style.transform = 'scale(1)';
            document.body.style.overflow = 'hidden';
            img.style.transform = '';
            modalIm.src = currImg.src;
            modalIm.style.width = modalWidth !== null ? modalWidth + '%' : '100%';
            modalTitle.style.width = modalWidth !== null ? '70%' : '';
            modalTitle.textContent = currImg.getAttribute('title');
            active = true;
        }
    });
    img.addEventListener('mouseover', function (event) {
        if (!active && !hovered) {
            img.style.transform = 'scale(1.05)';
            hovered = true;
        }
    });
    img.addEventListener('mouseout', function (event) {
        if (!active && hovered) {
            img.style.transform = '';
            hovered = false;
        }
    });
});
document.addEventListener('click', function (event) {
    var isClickedIm = Array.prototype.slice.call(img).some(function (img) { return img.contains(event.target); });
    var isClicked = modal.contains(event.target);
    if (!isClickedIm && !isClicked && active) {
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
        modalIm.style.transform = 'scale(1)';
        active = false;
        hovered = false;
        double = false;
    }
});
modalIm.addEventListener('click', function (event) {
    if (active && !double) {
        modalIm.style.transform = 'scale(1.5)';
        modalIm.style.cursor = 'zoom-out';
        double = true;
        zoomedIm = true;
    }
    else if (active && double) {
        modalIm.style.transform = 'scale(1)';
        modalIm.style.cursor = 'zoom-in';
        double = false;
        zoomedIm = false;
    }
});
modalIm.addEventListener('mouseover', function (event) {
    if (!zoomedIm) {
        modalIm.style.transform = 'scale(1.05)';
    }
});
modalIm.addEventListener('mouseout', function (event) {
    if (!zoomedIm) {
        modalIm.style.transform = 'scale(1)';
    }
});
