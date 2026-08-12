// alert("Вітаю в моїй веб-программі.\n\n  Розробником є Мельниченко Вікторія Олегівна 11 клас");
// alert("Сайт не адаптивний! \n\n\nДля найкращого використовування змініть роздільну здатність екрану в бразуері на 1440х900. \n\nАбо ж, якщо у вас 1920х1080, збільшіть масштаб на 125%");

let f_choose = document.querySelector('.first-choose');
let up_l = document.querySelector('.up-line');
let l_l = document.querySelector('.l-line');
let r_l = document.querySelector('.r-line');
let d_l = document.querySelector('.down-line');
let user_choose = document.querySelector('.user');
let s_choose = document.querySelector('.second-choose');
let ch_up_l = document.querySelector('.st-up-l-c');
let ch_do_l = document.querySelector('.end-down-l-c');
let t_choose = document.querySelector('.third-choose');
let fo_choose = document.querySelector('.fourth-choose');
let circle_task = document.querySelector('.circle-task');
let square_task = document.querySelector('.square-task');
let rectangle_task = document.querySelector('.rectangle-task');
let triangle_task = document.querySelector('.triangle-task');
let text_f = document.querySelector('.text-f');
let text_s = document.querySelector('.text-s');
let text_t = document.querySelector('.text-t');
let text_fo = document.querySelector('.text-fo');


user_choose.addEventListener('mouseover', () => {
    up_l.style.opacity = 0;
    up_l.style.visibility = "hidden";
    l_l.style.opacity = 0;
    l_l.style.visibility = "hidden";
    r_l.style.opacity = 0;
    r_l.style.visibility = "hidden";
    d_l.style.opacity = 0;
    d_l.style.visibility = "hidden";
    ch_up_l.style.opacity = 1;
    ch_up_l.style.visibility = "visible";
    ch_do_l.style.opacity = 1;
    ch_do_l.style.visibility = "visible";
});
user_choose.addEventListener('mouseout', () => {
    up_l.style.opacity = 1;
    up_l.style.visibility = "visible";
    l_l.style.opacity = 1;
    l_l.style.visibility = "visible";
    r_l.style.opacity = 1;
    r_l.style.visibility = "visible";
    d_l.style.opacity = 1;
    d_l.style.visibility = "visible";
    ch_up_l.style.opacity = 0;
    ch_up_l.style.visibility = "hidden";
    ch_do_l.style.opacity = 0;
    ch_do_l.style.visibility = "hidden";
});

/*
 * Підсвітка рамки при наведенні.
 *
 * Раніше координати були вписані пікселями під роздільність автора: для «Кола»
 * верхній відрізок 270..350, нижній 380..1170, для «Трикутника» 270..980 і
 * 1070..1170 і так далі. Ці числа не були прив'язані ні до меню, ні до самих
 * пунктів, тому розриви не збігалися з тим, на що навели.
 *
 * Тепер рахуємо з реального положення: верхня смуга йде від лівої стійки рамки
 * до лівого краю вибраного пункту, нижня — від його правого краю до правої
 * стійки. Розрив обрамляє саме вибране, на будь-якій ширині екрана.
 */
const FRAME_INSET = 0;   // смуги йдуть від самого краю меню, як і в CSS

function markChoice(item) {
    const menu = user_choose.getBoundingClientRect();
    const box = item.getBoundingClientRect();

    const left = box.left - menu.left;
    const right = box.right - menu.left;
    const innerRight = menu.width - FRAME_INSET;

    ch_up_l.style.left = FRAME_INSET + 'px';
    ch_up_l.style.width = Math.max(0, left - FRAME_INSET) + 'px';

    ch_do_l.style.left = right + 'px';
    ch_do_l.style.width = Math.max(0, innerRight - right) + 'px';
}

f_choose.addEventListener('mouseover', () => markChoice(f_choose));

f_choose.addEventListener('click', () => {
    circle_task.style.marginTop = "20px";
    square_task.style.marginTop = "40px";
    rectangle_task.style.marginTop = "40px";
    triangle_task.style.marginTop = "40px";
    circle_task.style.opacity = 1;
    circle_task.style.visibility = "visible";
    square_task.style.opacity = 0;
    square_task.style.visibility = "hidden";
    rectangle_task.style.opacity = 0;
    rectangle_task.style.visibility = "hidden";
    triangle_task.style.opacity = 0;
    triangle_task.style.visibility = "hidden";
    text_f.style.color = "#D16464";
    text_s.style.color = "black";
    text_t.style.color = "black";
    text_fo.style.color = "black";
});

s_choose.addEventListener('click', () => {
    circle_task.style.marginTop = "40px";
    square_task.style.marginTop = "20px";
    rectangle_task.style.marginTop = "40px";
    triangle_task.style.marginTop = "40px";
    circle_task.style.opacity = 0;
    circle_task.style.visibility = "hidden";
    square_task.style.opacity = 1;
    square_task.style.visibility = "visible";
    rectangle_task.style.opacity = 0;
    rectangle_task.style.visibility = "hidden";
    triangle_task.style.opacity = 0;
    triangle_task.style.visibility = "hidden";
    text_f.style.color = "black";
    text_s.style.color = "#D16464";
    text_t.style.color = "black";
    text_fo.style.color = "black";
});

s_choose.addEventListener('mouseover', () => markChoice(s_choose));

t_choose.addEventListener('mouseover', () => markChoice(t_choose));

t_choose.addEventListener('click', () => {
    rectangle_task.style.marginTop = "20px";
    circle_task.style.marginTop = "40px";
    square_task.style.marginTop = "40px";
    triangle_task.style.marginTop = "40px";
    circle_task.style.opacity = 0;
    circle_task.style.visibility = "hidden";
    square_task.style.opacity = 0;
    square_task.style.visibility = "hidden";
    rectangle_task.style.opacity = 1;
    rectangle_task.style.visibility = "visible";
    triangle_task.style.opacity = 0;
    triangle_task.style.visibility = "hidden";
    text_f.style.color = "black";
    text_s.style.color = "black";
    text_t.style.color = "#D16464";
    text_fo.style.color = "black";
});

fo_choose.addEventListener('mouseover', () => markChoice(fo_choose));

fo_choose.addEventListener('click', () => {
    rectangle_task.style.marginTop = "40px";
    circle_task.style.marginTop = "40px";
    square_task.style.marginTop = "40px";
    triangle_task.style.marginTop = "20px";
    circle_task.style.opacity = 0;
    circle_task.style.visibility = "hidden";
    square_task.style.opacity = 0;
    square_task.style.visibility = "hidden";
    rectangle_task.style.opacity = 0;
    rectangle_task.style.visibility = "hidden";
    triangle_task.style.opacity = 1;
    triangle_task.style.visibility = "visible";
    text_f.style.color = "black";
    text_s.style.color = "black";
    text_t.style.color = "black";
    text_fo.style.color = "#D16464";
});


//circle_task
let c_input = document.querySelector('.c-radius-input-in');
let dia_out = document.querySelector('.diametr-c-out');
let plos_out = document.querySelector('.plos-c-out');
let dovzh_out = document.querySelector('.dovzhina-c-out');
let btn_s_c = document.querySelector('.button-s-c');

btn_s_c.addEventListener('click', () => {
    if (c_input.value == "") alert("Ви не заповнили поле вводу!");
    else{
        plos_out.innerHTML = (Math.PI * (c_input.value **2)).toFixed(2) + ' см.';
        dovzh_out.innerHTML = (2 * Math.PI * c_input.value).toFixed(2) + ' см.';
        dia_out.innerHTML = 2 * c_input.value + ' см.';
    }
});

//square_task
let sq_input = document.querySelector('.sq-side-input-in');
let sq_plos_out = document.querySelector('.plos-sq-out');
let sq_diag_out = document.querySelector('.diag-sq-out');
let sq_radint_out = document.querySelector('.radin-sq-out');
let sq_per_out = document.querySelector('.per-sq-out');
let sq_radout_out = document.querySelector('.radout-sq-out');
let button_s_sq = document.querySelector('.button-s-sq');

button_s_sq.addEventListener('click', () => {
    if (sq_input.value == "") alert("Ви не заповнили поле вводу!");
    else{
        sq_plos_out.innerHTML = sq_input.value **2 + ' cм<sup>2</sup>';
        sq_diag_out.innerHTML = Math.floor(sq_input.value * Math.sqrt(2)) + ' cм';
        sq_radint_out.innerHTML = sq_input.value / 2 + ' cм';
        sq_per_out.innerHTML = 4 * sq_input.value + ' cм';
        sq_radout_out.innerHTML = (sq_input.value * (Math.sqrt(2) / 2)).toFixed(2) + ' см';
    }
});

//rectangle_task
let rect_input_a = document.querySelector('.rect-sidea-input-in');
let rect_input_b = document.querySelector('.rect-sideb-input-in');
let rect_plos_out = document.querySelector('.plos-rect-out');
let rect_diag_out = document.querySelector('.diag-rect-out');
let rect_cut_a_out = document.querySelector('.cuta-rect-out');
let rect_per_out = document.querySelector('.per-rect-out');
let rect_cut_b_out = document.querySelector('.cutb-rect-out');
let button_s_rect = document.querySelector('.button-s-rect');

function angleCut(x, y) {
    return Math.atan2(x, y) * 180 / Math.PI;
}

button_s_rect.addEventListener('click', () => {
    if (rect_input_a.value == "" || rect_input_b.value == "") alert("Ви не заповнили поле вводу!");
    else{
        rect_plos_out.innerHTML = rect_input_a.value * rect_input_b.value + " см<sup>2</sup>";
        rect_per_out.innerHTML = 2 * Number(rect_input_a.value + rect_input_b.value) + " см";
        rect_diag_out.innerHTML = Math.sqrt(Number(rect_input_a.value * 2) + Number(rect_input_b.value * 2)).toFixed(2) + " см";
        rect_cut_a_out.innerHTML = angleCut(rect_input_b.value, rect_input_a.value).toFixed(2) + " &deg";
        rect_cut_b_out.innerHTML = angleCut(rect_input_a.value, rect_input_b.value).toFixed(2) + " &deg";
    }
});

//triangle_task
let tr_side_a_input = document.querySelector('.tr-sidea-input-in');
let tr_side_b_input = document.querySelector('.tr-sideb-input-in');
let tr_side_c_input = document.querySelector('.tr-sidec-input-in');
let tr_plos_out = document.querySelector('.plos-tr-out');
let tr_radin_out = document.querySelector('.radin-tr-out');
let tr_per_out = document.querySelector('.per-tr-out');
let tr_radout_out = document.querySelector('.radout-tr-out');
let button_s_tr = document.querySelector('.button-s-tr');

button_s_tr.addEventListener('click', () => {
    if (tr_side_a_input.value == "" || tr_side_b_input.value == "" || tr_side_c_input.value == "") alert("Ви не заповнили поле вводу!");
    else{
        if (((Number(tr_side_a_input.value) > 0 ) && (Number(tr_side_b_input.value) > 0) && (Number(tr_side_c_input.value) > 0)) && 
        ((Number(tr_side_a_input.value) + Number(tr_side_b_input.value) > Number(tr_side_c_input.value)) && 
        (Number(tr_side_b_input.value) + Number(tr_side_c_input.value) > Number(tr_side_a_input.value)) && 
        (Number(tr_side_a_input.value) + Number(tr_side_c_input.value) > Number(tr_side_b_input.value)))) {
            let p = (Number(tr_side_a_input.value) + Number(tr_side_b_input.value) + Number(tr_side_c_input.value)) * 0.5;
            tr_plos_out.innerHTML = Math.sqrt(p * (p - tr_side_a_input.value) * (p - tr_side_b_input.value) * (p - tr_side_c_input.value)).toFixed(2) + ' см<sup>2</sup>'; 
            tr_per_out.innerHTML = Number(tr_side_a_input.value) + Number(tr_side_b_input.value) + Number(tr_side_c_input.value) + ' см';
            tr_radin_out.innerHTML = Math.sqrt(((p - Number(tr_side_a_input.value)) * (p - Number(tr_side_b_input.value)) * (p - Number(tr_side_c_input.value)) / p)).toFixed(2) + ' &deg';
            tr_radout_out.innerHTML = ((tr_side_a_input.value * tr_side_b_input.value * tr_side_c_input.value) / (4 * Math.sqrt(p * (p - tr_side_a_input.value) * (p - tr_side_b_input.value) * (p - tr_side_c_input.value)))).toFixed(2) + ' &deg';
        }else alert("Трикутника не існує!");
    }
});

function Correct(event) {
    event.value = event.value.replace(/[^0-9]/g, "");
};


document.querySelector('.exit-btn').addEventListener('click', () => {
    window.open(location,'_self').close();
});