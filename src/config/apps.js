import RowView from '../components/layout/RowView.vue';
import TabView from '../components/layout/TabView.vue';

export default {
  root: TabView,
  apps: [
    {
      component: RowView,
      name: 'Row',
      icon: 'fa-align-justify fa-rotate-90',
      shortcut: 'KeyR',
    },
    {
      component: TabView,
      name: 'TabView',
      icon: 'fa-table',
      shortcut: 'KeyT',
    },
  ],
};
