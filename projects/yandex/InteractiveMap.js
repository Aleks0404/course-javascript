export default class InteractiveMAP {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }
}
InitMap();
{
  this.map.events.add('click', (e) => this.onClick(e.get('coords'))); //отлавливаем клики по карте
}
openBalloon(coordes, content);
{
  this.map.balloon.open(coordes, content);
}
closeBallon();
{
  this.map.balloon.close();
  constructor;
}

// FormTemplate cвойство внутри которого будет храниться html шаблон нашей формы

constructor();
{
  this.FormTemplate = document.querySelector('#addFormTemplate').innerHTML;
  this.map = new InteractiveMAP('map', this.onClick.bind(this));
  this.map.init().then(this.onInit.bind(this));
}

// метод createForm вызывается когда мы кликаем на карту

createForm(coordes);
{
  const root = document.createElement('div'); // создаем див
  root.innerHTML = this.FormTemplate; // наполняем див этим this.FormTemplate -  html содержимым
  const reviewForm = root.querySelector('[data-role="review-form]'); // находим элемент с дата атрибутом role = review-form
  reviewForm.dataset.coordes = JSON.stringify(coordes); // записываем еще один дата атрибут который будет coords,
  //при отправки отзыва мы должны взять откуда то коррдинаты этого отзыва

  return root;
}
onClick(coords);
{
  const form = this.createForm(coords); // создаем форму по таким то координатам
  this.map.openBalloon(coords, form.innerHTML); // открываем balloon по тем же координатам. и говорим каким соодержимым нужно наполнить наш balloon
}
