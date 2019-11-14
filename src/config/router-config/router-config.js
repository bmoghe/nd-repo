//import { Discovery, SheetComponent, ChildA, ChildB, Sheets } from "../../components";
import SheetComponent from '../../components/sheet-component/sheet-component';
import SheetsSwitcherContainer from '../../components/sheets-switcher/redux/container/SheetsSwitcherContainer';
import { PageNotFound } from '../../shared/components';
import { BASE_URL } from "../../shared/constants/urls";

const base_url = BASE_URL();

const AppRoutes = [
  {
    path: `${base_url}/sheet/:id`,
    component: SheetsSwitcherContainer,
    children: [
      {
        path: `${base_url}/sheet/:id`,
        component: SheetComponent
      }
    ]
  },
  {
    component: PageNotFound
  }
];

export default AppRoutes;