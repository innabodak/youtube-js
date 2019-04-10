'use strict';

const switcher = document.querySelector('#cbx'),
    more = document.querySelector('.more'),
    modal = document.querySelector('.modal'),
    videos = document.querySelectorAll('.videos__item'),
    videosWrapper = document.querySelector('.videos__wrapper'),
    darkColor = '#000000',
    lightColor = '#ffffff';

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

function sliceTitle(selector, count) {
    document.querySelectorAll(selector).forEach(item => {
        item.textContent.trim();
        if (item.textContent.length < count) {
            return;
        } else {
            const str = item.textContent.slice(0, count + 1) + '...';
            item.textContent = str;
        }
    });
}

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    player.stopVideo();
}

function bindModal(cards) {
    cards.forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const id = card.getAttribute('data-url');
            loadVideo(id);
            openModal();
        });
    });
}

videos.forEach(item => {
    bindModal(item);
});

modal.addEventListener('click', e => {
    if (!e.target.classList.contains('modal__body')) {
        closeModal();
    }
});

document.addEventListener('keydown', e => {
    if (modal.style.display === 'block' && e.keyCode === 27) {
        closeModal();
    }
});

function createVideoPlayer() {
    var tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    setTimeout(() => {
        player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: 'M7lc1UVf-VE',
        });
    }, 1000);
}
createVideoPlayer();

function loadVideo(id) {
    player.loadVideoById({ videoId: `${id}` });
}

function start() {
    gapi.client
        .init({
            apiKey: 'AIzaSyCi_I0CmA-pzX20JdQfthGaa6-yK8onesQ',
            discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
            ],
        })
        .then(() => {
            return gapi.client.youtube.playlistItems.list({
                part: 'snippet,contentDetails',
                maxResults: '6',
                playlistId: 'PL3LQJkGQtzc4gsrFkm4MjWhTXhopsMgpv',
            });
        })
        .then(response => {
            console.log(response.result);
            let delay = 10;
            response.result.items.forEach(item => {
                let card = document.createElement('a');
                card.classList.add('videos__item', 'videos__item-active');
                card.setAttribute('data-url', item.contentDetails.videoId);
                card.innerHTML = `
                    <img src=${item.snippet.thumbnails.high.url} alt="thumb" />
                    <div class="videos__item-descr">${item.snippet.title}</div>
                    <div class="videos__item-views">2.3 тыс. просмотров</div>
                `;

                videosWrapper.appendChild(card);
                delay += 250;
                setTimeout(() => {
                    card.classList.remove('videos__item-active');
                }, delay);

                if (night) {
                    card.querySelector(
                        '.videos__item-descr',
                    ).style.color = lightColor;
                    card.querySelector(
                        '.videos__item-views',
                    ).style.color = lightColor;
                }
            });

            sliceTitle('.videos__item-descr', 80);
            bindModal(document.querySelectorAll('.videos__item'));
        })
        .catch(e => {
            console.log(e);
        });
}

more.addEventListener('click', () => {
    more.remove();
    gapi.load('client', start);
});

function search(target) {
    gapi.client
        .init({
            apiKey: 'AIzaSyCi_I0CmA-pzX20JdQfthGaa6-yK8onesQ',
            discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
            ],
        })
        .then(() => {
            return gapi.client.youtube.search.list({
                maxResults: '10',
                part: 'snippet',
                q: `${target}`,
                type: '',
            });
        })
        .then(response => {
            while (videosWrapper.firstChild) {
                videosWrapper.removeChild(videosWrapper.firstChild);
            }
            console.log(response.result);

            let delay = 10;
            response.result.items.forEach(item => {
                let card = document.createElement('a');
                card.classList.add('videos__item', 'videos__item-active');
                card.setAttribute('data-url', item.id.videoId);
                card.innerHTML = `
                    <img src=${item.snippet.thumbnails.high.url} alt="thumb" />
                    <div class="videos__item-descr">${item.snippet.title}</div>
                    <div class="videos__item-views">2.3 тыс. просмотров</div>
                `;

                videosWrapper.appendChild(card);
                delay += 250;
                setTimeout(() => {
                    card.classList.remove('videos__item-active');
                }, delay);

                if (night) {
                    card.querySelector(
                        '.videos__item-descr',
                    ).style.color = lightColor;
                    card.querySelector(
                        '.videos__item-views',
                    ).style.color = lightColor;
                }
            });

            sliceTitle('.videos__item-descr', 80);
            bindModal(document.querySelectorAll('.videos__item'));
        });
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    gapi.load('client', () =>
        search(document.querySelector('.search > input').value),
    );
    document.querySelector('.search > input').value = '';
});
