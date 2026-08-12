const img : NodeListOf<HTMLImageElement> = document.querySelectorAll('.img'),
modalTitle : HTMLElement = document.querySelector('#modal h2') as HTMLElement,
modalIm: HTMLImageElement = document.getElementById('modal-img') as HTMLImageElement,
overlay : HTMLDivElement = document.getElementById('overlay') as HTMLDivElement,
modal: HTMLDivElement = document.getElementById('modal') as HTMLDivElement,
date : Date = new Date();
let active : boolean = false, hovered = false, double = false, zoomedIm = false;

document.querySelector('.date')?.setAttribute('year', date.getFullYear().toString());

img.forEach((img : HTMLImageElement) => {
    img.addEventListener('click', (event : Event) => {
        const currImg: HTMLImageElement = event.target as HTMLImageElement;

        if (!active){
            const modalWidth = currImg.getAttribute('modal-width');
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

    img.addEventListener('mouseover', (event : Event) => {
        if (!active && !hovered){
            img.style.transform = 'scale(1.05)';
            hovered = true;
        }
    });

    img.addEventListener('mouseout', (event : Event) => {
        if (!active && hovered){
            img.style.transform = '';
            hovered = false;
        }
    })
});

document.addEventListener('click', (event : Event) => {
    const isClickedIm = Array.prototype.slice.call(img).some((img: HTMLElement) => img.contains(event.target as Node));
    const isClicked = modal.contains(event.target as HTMLDivElement);
  
    if (!isClickedIm && !isClicked && active){
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

modalIm.addEventListener('click', (event : Event) => {
    if (active && !double){
        modalIm.style.transform = 'scale(1.5)';
        modalIm.style.cursor = 'zoom-out';
        double = true;
        zoomedIm = true;
    }

    else if (active && double){
        modalIm.style.transform = 'scale(1)';
        modalIm.style.cursor = 'zoom-in';
        double = false;
        zoomedIm = false;
    }
});

modalIm.addEventListener('mouseover', (event : Event) =>{
    if (!zoomedIm){
        modalIm.style.transform = 'scale(1.05)';
    }
});
modalIm.addEventListener('mouseout', (event: Event) => {
    if(!zoomedIm){
        modalIm.style.transform = 'scale(1)';
    }
});

