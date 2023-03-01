import './chat.html';

const loginBtn = document.querySelector('#loginchat');
const msgBtn = document.querySelector('#msg');
const logoutBtn = document.querySelector('#logout');
const chatContainer = document.querySelector('#chat');
const usernameInput = document.querySelector('#username');
const messageInput = document.querySelector('#message');
const mainChat = document.querySelector('#main');

let ws;

const socketServerURL = 'ws://localhost:4000'; //ссылка подключения к websocket серверу (бекэнду), сервер у нас запущен на локальном хосте, мы тут обращаемся к нашему протоколу WS

loginBtn.addEventListener('click', () => {
  const reqBody = { event: 'login', payload: { username: usernameInput.value } };
  ws.send(JSON.stringify(reqBody)); // поле event(событие) - login(мы хоти залогиниться)
}); /* на кнопку логина вешаем обработчик кликов, событие click и функция callback, и что нибудь отправляем, 
есть переменная reqBody (тело запроса) которое будем слать на наш сервер. Для того что бы отправить
 на wabsocket серверу мы обращаемся к ws. в таком виде не можем отправить. отправляем строкой. оборачиваем JSON.stryngify
 после send мы на сервере попадем в прослушку message*/
//document.querySelector('button').addEventListener('click', function() {
//var elementOne = document.getElementById('one');
//var elementTwo = document.getElementById('two');

msgBtn.addEventListener('click', () => {
  const reqBody = {
    event: 'message',
    payload: { username: usernameInput.value, message: messageInput.value },
  };
  ws.send(JSON.stringify(reqBody));
});

logoutBtn.addEventListener('click', () => {
  const reqBody = {
    event: 'logout',
    payload: { username: 'Alex' },
  };
  ws.send(JSON.stringify(reqBody));
});

function start() {
  ws = new WebSocket(socketServerURL);

  ws.onmessage = (serverResponse) => {
    const { type, payload } = JSON.parse(serverResponse.data);
    //console.log('Пришло с сервера', type, payload);

    switch (type) {
      case 'login':
        chatContainer.innerHTML += `<p>Пользователь ${payload.username} вошол в чат</p>`;
        break;
      case 'message':
        chatContainer.innerHTML += `<p>${payload.username}: ${payload.message}</p>`;
        break;
      case 'logout':
        chatContainer.innerHTML += `<p>Пользователь ${payload.username} покинул чат</p>`;
        break;

      default:
        break;
    }
  }; /* когда есть подключение, мы можем прослушивать события которые приходят с сервера(повесить сразу обработчик прослушивателя) 
 onmessage будет являться функцией где в callback будет прилитать ответ от сервера какой он нам пришлет, 
 тоесть повесить сразу обработчик прослушивателя. Обратимся к переменной ws и у него будет доступен такой метод как onmessage.
 serverResponse будет срабатывать когда сервер будет что-то отправлять ему*/
} //функция принимает socketURL когда будем вызывать эту функцию, будет передавать нашу переменную socketServerURL в socketURL
// есть глобальный класс WebSocket (называется так же как и пакет у нас для сервера) в который мы передаем ссылку подключения
// вызываем функцию старт

start();
// вызывается функция start и сработает подключение
/* данные приходят в serverResponse,
 но их нужно предварительно распарсить в JSON читаемый формат,
 можем сразу выцепить поле type которое шлет нам сервер, 
 деструктурировать из нашего ответа JSON.parse, 
 уда передадим наш serverResponse и дополнительно поле data, 
 в поле data храняться те самые данные которые 
 мы вот response = { type: 'logout', payload: clientData.payload }; отправляем,
 поэтому мы вытащим(деструктурируем) поле type*/
/* когда получили тип можем воспользоваться switch case конструкцией,
и посмотреть на поле type, что там в нем хранится, если login обращаемся в chatContainer
 и будем в него что-то складывать и тд.*/
