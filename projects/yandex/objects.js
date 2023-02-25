/*const coords = [
  [55.79250889261476, 37.70729125976562],
  [55.79715079730104, 37.547989501953126],
  [55.85203782600991, 37.554855957031236],
];
const myCollection = new ymaps.GeoObjectCollection(
  {},
  {
    preset: 'islands#redIcon', //все метки красные
    draggable: false, // и их не перемещать
    iconLayout: 'default#image',
    iconImageHref: '/img/icons/myIcon.gif',
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42],
  }
);
coords.forEach((coord) => {
  myCollection.add(new ymaps.Placemark(coord));
});
myMap.geoObject.add(myCollection);*/

export const formTemplate = ` <form id = "add-form">
<input type="text" placeholder="Укажите ваше имя" name="author"><br><br>
<input type="text" placeholder="Укажите место" name="place"><br><br>
<textarea placeholder="Оставить отзыв" name="review"></textarea><br><br>
<button id="add-btn">Добавить</button><br>
</form>`;

export const reviewTemplate = (review) => {
  return ` 
    <div class="review">
    <div><strong>Имя: </strong>${review.author}</div>
    <div><strong>Место: </strong>${review.place}</div>
    <div><strong>Отзыв: </strong>${review.reviewText}</div>
    </div>`;
};
