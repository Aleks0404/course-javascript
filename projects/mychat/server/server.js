const WebSocket = require('ws');

//создаем экземпляр нашего сервера c классом(глобальным)принимает на себя конфигурации, где ключевым полем будет поле port
const wss = new WebSocket.Server({ port: 4000 }, () =>
  console.log('Server started on port 4000')
); // websocket будет крутиться на 4000 порту, сборка на 8085, backend на другом порту, что бы не было конфликтов
const clients = new Set();
// после подключения к websocked серверу, мы можем установить некоторые прослушки
wss.on('connection', (wsClient) => {
  console.log('Connect');
  clients.add(wsClient);

  wsClient.on('message', (message) => {
    const req = JSON.parse(message.toString());
    broadcast(req);
  });
}); // обращаемся к ws и у него есть метод on который подключает слушатель событий ( одно из, событие connection- кто то к серверу подключился)
// вторым аргументом передаем функцию callback в которой параметр websocket клиента
// когда случился connect, мы должны в массив clients добавить нашего клиента
// для каждого клиента навешиваем определен. прослушку событий, каждый подключ клиент имел свои слушатели событий и каждый раз мог реагировать на то или иное изменение которое твориться на сервере
// прослушка message и второй параметр в callback message
//весь обмен данными между фронтендом и сервером с  точки зрения webssocket выполняется по средствам строк, мы с фронтенда не можем передать на прямую объект мы его оборачиваемв JSON stringify
// сделаем рассылку всем подключенным клиентам и будем их уведомлять, создаем отдельную function broadcast и будем передавать в нее то что нам шлет клиент
// req это не что иное как те данные которые шлет наш клиент
// на основании данных что нам шлют нам нужно будет сформировать response(ОТВЕТ)
// клиенты это массив, пробегаемся по всем нашим подключенным клиентам
function broadcast(clientData) {
  let response;
  clients.forEach((client) => {
    switch (clientData.event) {
      case 'login':
        response = { type: 'login', payload: clientData.payload };
        break;
      case 'message':
        response = { type: 'message', payload: clientData.payload };
        break;
      case 'logout':
        response = { type: 'logout', payload: clientData.payload };
        break;

      default:
        break;
    }
    client.send(JSON.stringify(response));
  });
}
// на каждой итерации мы будем получать нашего клиента
//далле будет ответ на событие которое шлет клиент
// воспользуемся конструкцией switch case, и будем смотреть на событие event
/*если поле event которое с фронта является login, то response(ответ) будет объект, 
тоже будет тип login, и какие нибудь данные payload*/
// и обработаем еще два case когда кто-то отправил сообщение и кто-то разлогинелся
/* и далее в цикле forEach((client), 
отправим эти данные обратно, обратимся к нашему клиенту и вызовим у него метод send */
/* после того как мы выполним строчку client.send(JSON.stringify(response))
 мы уже на клиенте в index.js попадем в ws.onmessage = (
    serverResponse
  ) => {};  и уже тут будем отлавливать, что нам присылает сервер.
  вот так происходит взаимодействие*/

/* в браузере нажали кнопку - "войти в чат" на server сработал connect, сработал event login, попали response: type login итд.
  отправили это всем клиентам client.send(JSON.stringify(response)) и поймали это в index.js function start 
   и в консоле мы получаем данное сообщение - Пришло с сервера ...'*/
