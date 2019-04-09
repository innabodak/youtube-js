'use strict';

const switcher = document.querySelector('#cbx'),
    more = document.querySelector('.more'),
    modal = document.querySelector('.modal'),
    videos = document.querySelectorAll('.videos__item');

let player;

function bindSlideToggle(trigger, box, content, openClass) {
    let button = {
        element: document.querySelector(trigger),
        active: false,
    };

    const boxBody = document.querySelector(box),
        boxContent = document.querySelector(content);

    button.element.addEventListener('click', () => {
        if (!button.active) {
            button.active = true;
            boxBody.style.height = boxContent.clientHeight + 'px';
            boxBody.classList.add(openClass);
        } else {
            button.active = false;
            boxBody.style.height = 0;
            boxBody.classList.remove(openClass);
        }
    });
}

bindSlideToggle(
    '.hamburger',
    '[data-slide="nav"]',
    '.header__menu',
    'slide-active',
);

function switchMode() {
    const darkColor = '#000000',
        lightColor = '#ffffff';

    if (!night) {
        night = true;
        document.body.classList.add('night');
        document.querySelectorAll('.hamburger > line').forEach(item => {
            item.style.stroke = lightColor;
        });
        document.querySelectorAll('.videos__item-descr').forEach(item => {
            item.style.color = lightColor;
        });
        document.querySelectorAll('.videos__item-views').forEach(item => {
            item.style.color = lightColor;
        });
        document.querySelector('.header__item-descr').style.color = lightColor;
        document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
    } else {
        night = false;
        document.body.classList.remove('night');
        document.querySelectorAll('.hamburger > line').forEach(item => {
            item.style.stroke = darkColor;
        });
        document.querySelectorAll('.videos__item-descr').forEach(item => {
            item.style.color = darkColor;
        });
        document.querySelectorAll('.videos__item-views').forEach(item => {
            item.style.color = darkColor;
        });
        document.querySelector('.header__item-descr').style.color = darkColor;
        document.querySelector('.logo > img').src = 'logo/youtube.svg';
    }
}

let night = false;
switcher.addEventListener('change', () => {
    switchMode();
});

const data = [
    ['img/thumb_3.webp', 'img/thumb_4.webp', 'img/thumb_5.webp'],
    [
        '#3 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов',
        '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки Урок 2',
        '#1 Верстка реального заказа landing Page | Марафон вёрстки | Артём Исламов',
    ],
    ['3,6 тыс. просмотров', '4,2 тыс. просмотров', '28 тыс. просмотров'],
    ['X9SmcY3lM-U', '7BvHoh0BrMw', 'mC8JW_aG2EM'],
];

more.addEventListener('click', () => {
    const videosWrapper = document.querySelector('.videos__wrapper');
    more.remove();

    for (let i = 0; i < data[0].length; i++) {
        let card = document.createElement('a');
        card.classList.add('videos__item', 'videos__item-active');
        card.setAttribute('data-url', data[3][i]);
        card.innerHTML = `
            <img src=${data[0][i]} alt="thumb" />
            <div class="videos__item-descr">${data[1][i]}</div>
            <div class="videos__item-views">${data[2][i]}</div>
        `;

        videosWrapper.appendChild(card);
        setTimeout(() => {
            card.classList.remove('videos__item-active');
        }, 10);
    }
});