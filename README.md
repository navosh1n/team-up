# Team-Up
Приложение для оптимизации процессов найма и обучения сотрудников. Подробнее в [wiki](https://github.com/navosh1n/team-up/wiki).

```
Дисклеймер! Данное приложение находится на стадии MVP. 
Поэтому возможны баги и есть неоптимальный код (некоторый связан с ограничениями firestore).
```

### Текущий функционал
* Авторизация через Google Account.
* Управление списком пользователей (сотрудников, экспертов).
* Ролевая модель с правами доступа к определенному функционалу.
* История тестирования и результаты каждого тестирования.
* База вопросов. Есть возможность добавлять, редактировать и удалять вопросы.
* Режим тестирования. Пока есть время и вопросы, система будет предлагать по одному вопросу. 
  При повторном тестировании одного и того же сотрудника, в начале будут предложены вопросы, 
  на которые сотрудник в прошлый раз не ответил правильно.
* Вопросы нескольких типов. Устный (виден только эксперту), Визуальный (можно скинуть сотруднику) 
  и live coding (вопрос с редактором кода, позволяет видеть, что пишет сотрудник).
  
### Технологии
* На фронте: vue, vuex, js, scss, monaco-editor, tiptap
* На беке: firebase. *(Планируется переезд на Node.js после релиза MVP)*

## Project setup
```
npm install
```
### Firebase config
Необходимо создать .env файл с переменной окружения `VUE_APP_FIREBASE`, 
которая в формате json содержит firebase config.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
npm run build:dev // build app with .env.staging
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
