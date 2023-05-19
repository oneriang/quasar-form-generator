import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'index', component: () => import('pages/IndexPage.vue') },
      { path: '', component: () => import('pages/fPage.vue') },
      // { path: '', component: () => import('components/demo/app.vue') },
  ],
  },
  {
    path: '/app',
    component: () => import('pages/App.vue'),
  },
  {
    path: '/a',
    component: () => import('pages/a.vue'),
  },
  {
    path: '/d',
    component: () => import('pages/d.vue'),
  },
  {
    path: '/e',
    component: () => import('pages/ePage.vue'),
  },
  {
    path: '/f',
    component: () => import('pages/fPage.vue'),
  },
  {
    path: '/t',
    component: () => import('pages/TestPage.vue'),
  },
  {
    path: '/b',
    component: () => import('pages/b.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
