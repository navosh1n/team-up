import Vue from 'vue';
import VueRouter from 'vue-router';
import authService from '@/services/api/auth-service';

Vue.use(VueRouter);

export const RouteTypes = {
  UsersPage: 'UsersPage',
  QuestionsPage: 'QuestionsPage',
  HistoryPage: 'HistoryPage',
  TestingPage: 'TestingPage',
  ResultsPage: 'ResultsPage',
  AuthPage: 'AuthPage',
  SharedQuestionPage: 'SharedQuestionPage',
  Page404: 'Page404',
};

const routes = [
  {
    path: '/',
    redirect: { name: RouteTypes.UsersPage },
  },
  {
    path: '/users',
    name: RouteTypes.UsersPage,
    meta: { checkAccess: true },
    component: () => import(/* webpackChunkName: "users" */ '@/pages/users-page/index.vue'),
  },
  {
    path: '/questions',
    name: RouteTypes.QuestionsPage,
    meta: { checkAccess: true },
    component: () => import(/* webpackChunkName: "questions" */ '@/pages/questions-page/index.vue'),
  },
  {
    path: '/history',
    name: RouteTypes.HistoryPage,
    meta: { checkAccess: true },
    component: () => import(/* webpackChunkName: "history" */ '@/pages/history-page/index.vue'),
  },
  {
    path: '/testing/:id',
    name: RouteTypes.TestingPage,
    meta: { checkAccess: true },
    component: () => import(/* webpackChunkName: "testing" */ '@/pages/testing-page/index.vue'),
  },
  {
    path: '/results/:id',
    name: RouteTypes.ResultsPage,
    meta: { checkAccess: true },
    component: () => import(/* webpackChunkName: "results" */ '@/pages/results-page/index.vue'),
  },
  {
    path: '/auth',
    name: RouteTypes.AuthPage,
    component: () => import(/* webpackChunkName: "auth" */ '@/pages/auth-page.vue'),
  },
  {
    path: '/shared-question/:id',
    name: RouteTypes.SharedQuestionPage,
    component: () => import(/* webpackChunkName: "shared-question" */ '@/pages/shared-question-page/index.vue'),
  },
  {
    path: '/404',
    name: RouteTypes.Page404,
    component: () => import(/* webpackChunkName: "page404" */ '@/pages/page-404.vue'),
  },
  {
    path: '*',
    redirect: { name: RouteTypes.Page404 },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuth = await authService.checkAuth();
  if (to.name !== RouteTypes.AuthPage && !isAuth && to.meta.checkAccess) {
    next({ name: RouteTypes.AuthPage });
  } else if (to.name === RouteTypes.AuthPage && isAuth) {
    next('/');
  } else {
    next();
  }
});

export default router;
