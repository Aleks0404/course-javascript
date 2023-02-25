import { formTemplate, reviewTemplate } from './objects';
import './chat.html';
import { getReviews, addReview } from './localstorage';

let myMap;
let clusterer;
//let ymaps;

document.addEventListener('DOMContentLoaded', () => {
  ymaps = window.ymaps;
  ymaps.ready(init);
});

function init() {
  myMap = new ymaps.Map('map', {
    center: [55.99628, 37.19762],
    zoom: 12,
    controls: ['zoomControl'],
  });
  /*var placemark = new ymaps.Placemark([55.9646, 37.19925], {});
  myMap.geoObjects.add(placemark);*/

  myMap.events.add('click', function (mapEvent) {
    // обработчик кликов
    const coords = mapEvent.get('coords');
    myMap.balloon.open(coords, formTemplate);

    delayAddReviewSubmit(myMap, mapEvent);
  });

  clusterer = new ymaps.Clusterer({
    clusterDisableClickZoom: true,
    gridSize: 512,
  });

  clusterer.events.add('click', function (clusterEvent) {
    const geoObjectsInCluster = clusterEvent.get('target').getGeoObjects();
    const content = ymaps.templateLayoutFactory.createClass(
      `<div class="reviews">${getReviewList(geoObjectsInCluster)}</div>`
    ); // createClass помещаем нашу разметку

    clusterEvent.get('target').options.set({ clusterBalloonContentLayout: content }); // помещаем контент в кластер
  });

  getGeoObjects(); // функция которая пробегается в localstorege по всем отзывам и ресует нам метки
}
function getGeoObjects() {
  const geoObjects = [];

  for (const review of getReviews() || []) {
    const placemark = new ymaps.Placemark(review.coords, {
      balloonContent:
        `<div class="reviews">${getReviewList(review.coords, true)}</div>` + formTemplate,
    });
    placemark.events.add('click', (placemarkEv) => {
      placemarkEv.stopPropagation(); // обработали клик и запретили события по умолчанию
      delayAddReviewSubmit(placemark, placemarkEv);
    });

    geoObjects.push(placemark);
  }
  clusterer.removeAll();
  myMap.geoObjects.remove(clusterer);
  clusterer.add(geoObjects);
  myMap.geoObjects.add(clusterer);
}
//после того как вы нажали добавить отзыв мы закрываем наш баллун

function getReviewList(currentGeoObjects, isCoords) {
  let reviewListHTML = '';

  if (isCoords) {
    const review = getReviews().find(
      (rev) => JSON.stringify(rev.coords) === JSON.stringify(currentGeoObjects)
    );
    // мы обращаемся ко всем отзывам getReviews в localstorage и находи отзыв где у нас координаты отзыва равен тем координатам которые мы передаем на вход currentGeoObjects функции в review.coords передавали. если эти координаты равны значит это тот отзыв что нам нужен
    // мы помещаем этот отзыв в переменную getReviewList с помощью reviewTemplate

    reviewListHTML += reviewTemplate(review);
  } else {
    for (const review of getReviews()) {
      if (
        currentGeoObjects.find((geoObject) => {
          return (
            JSON.stringify(review.coords) ===
            JSON.stringify(geoObject.geometry._coordinates)
          );
        })
      ) {
        reviewListHTML += reviewTemplate(review);
      }
    }
  }
  return reviewListHTML;
}

function delayAddReviewSubmit(geoObject, geoObjectEvent) {
  // небольшая задержка обработки клика добавления отзыва по форме
  setTimeout(() => {
    document.querySelector('#add-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const review = {
        coords: geoObjectEvent.get('coords'),
        author: this.elements.author.value,
        place: this.elements.place.value,
        reviewText: this.elements.review.value,
      };
      addReview(review); // после того как добавили новый localStorag, нужно перерендерить заново карту, вызываем getGeoObjects который и выполняет наш рендер
      getGeoObjects();
      geoObject.balloon.close();
    });
  }, 0);
}
